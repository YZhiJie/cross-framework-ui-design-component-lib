import { defineConfig, type Plugin } from 'vite';
import { appendFileSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

// Vite lib 模式会把 entry 中的 CSS 抽取为独立文件，且不会在 JS 产物中回写引用。
// 构建结束后向 JS 产物注入对 index.css 的引用，使消费方 `import '@xui-design/styles'`
// 即可生效全部样式，无需手动再引 css。
function injectCssImport(): Plugin {
  return {
    name: 'xui-styles-inject-css-import',
    closeBundle() {
      const mjsPath = resolve(rootDir, 'dist/index.mjs');
      const cjsPath = resolve(rootDir, 'dist/index.cjs');
      writeFileSync(mjsPath, `import './index.css';\n${readFileSync(mjsPath, 'utf8')}`);
      // CJS 用 try/catch 包裹：bundler 静态分析仍会打进 CSS；
      // 纯 Node require（如契约测试）无法解析 .css 时静默跳过，不阻断模块加载
      appendFileSync(cjsPath, `try {\n  require('./index.css');\n} catch {}\n`);
    },
  };
}

export default defineConfig({
  plugins: [injectCssImport()],
  build: {
    lib: {
      entry: {
        index: resolve(rootDir, 'src/index.ts'),
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) =>
        entryName === 'index'
          ? `index.${format === 'es' ? 'mjs' : 'cjs'}`
          : `${entryName}.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        dir: 'dist',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || '';
          if (name.endsWith('.css')) {
            return 'index.css';
          }
          return '[name][extname]';
        },
      },
    },
  },
});
