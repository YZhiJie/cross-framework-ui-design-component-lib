/**
 * 体积检查脚本
 *
 * 检查各包构建产物是否符合体积预算：
 * - @xui-design/shared: < 78KB (gzip；Waterfall 布局 + breakpoint logic 加入后由 74KB 上调)
 * - @xui-design/core: < 38KB (gzip，Waterfall 契约加入后由 36KB 上调)
 * - @xui-design/vue: < 128KB (gzip, 不含 vue；Waterfall SFC + ResizeObserver 加入后由 123KB 上调)
 * - @xui-design/react: < 101KB (gzip, 不含 react)
 * - @xui-design/styles: < 20KB (gzip)
 * - @xui-design/icons: < 50KB (gzip)
 */

import { readdirSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { readFileSync } from 'node:fs';

const rootDir = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');

interface SizeBudget {
  packageName: string;
  distDir: string;
  maxGzipKB: number;
  description: string;
}

const budgets: SizeBudget[] = [
  {
    packageName: '@xui-design/shared',
    distDir: 'packages/shared/dist',
    maxGzipKB: 78,
    description: '纯逻辑核心层（Waterfall 布局 + breakpoint logic 上调）',
  },
  {
    packageName: '@xui-design/core',
    distDir: 'packages/core/dist',
    // 30 → 35 → 36 → 38：Waterfall 契约加入后上调
    maxGzipKB: 38,
    description: '框架无关抽象层',
  },
  {
    packageName: '@xui-design/vue',
    distDir: 'packages/vue/dist',
    maxGzipKB: 128,
    description: 'Vue 适配层（不含 vue；Waterfall + 3.75KB）',
  },
  {
    packageName: '@xui-design/react',
    distDir: 'packages/react/dist',
    maxGzipKB: 101,
    description: 'React 适配层（不含 react；TimeSlotPicker + 1KB）',
  },
  {
    packageName: '@xui-design/styles',
    distDir: 'packages/styles/dist',
    maxGzipKB: 20,
    description: '共享样式包',
  },
  {
    packageName: '@xui-design/icons',
    distDir: 'packages/icons/dist',
    maxGzipKB: 50,
    description: '图标包',
  },
];

function getDistFiles(dir: string): string[] {
  const fullPath = resolve(rootDir, dir);
  const files: string[] = [];

  function walk(currentDir: string) {
    const entries = readdirSync(currentDir);
    for (const entry of entries) {
      const entryPath = join(currentDir, entry);
      const stat = statSync(entryPath);
      if (stat.isDirectory()) {
        walk(entryPath);
      } else if (entry.endsWith('.mjs') || entry.endsWith('.cjs') || entry.endsWith('.js')) {
        files.push(entryPath);
      }
    }
  }

  try {
    walk(fullPath);
  } catch {
    // dist directory doesn't exist
  }

  return files;
}

function getFileGzipSize(filePath: string): number {
  const content = readFileSync(filePath);
  const gzipped = gzipSync(content);
  return gzipped.length;
}

let hasFailure = false;

console.log('\n📦 Bundle Size Check\n');
console.log(
  'Package'.padEnd(20) + 'Actual (gzip)'.padEnd(20) + 'Budget (gzip)'.padEnd(20) + 'Status',
);
console.log('-'.repeat(80));

for (const budget of budgets) {
  const files = getDistFiles(budget.distDir);

  if (files.length === 0) {
    console.log(
      `${budget.packageName}`.padEnd(20) +
        'N/A'.padEnd(20) +
        `${budget.maxGzipKB}KB`.padEnd(20) +
        '⚠️  No dist (skip)',
    );
    continue;
  }

  let totalSize = 0;
  for (const file of files) {
    totalSize += getFileGzipSize(file);
  }

  const totalKB = totalSize / 1024;
  const passed = totalKB <= budget.maxGzipKB;

  if (!passed) {
    hasFailure = true;
  }

  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(
    `${budget.packageName}`.padEnd(20) +
      `${totalKB.toFixed(2)}KB`.padEnd(20) +
      `${budget.maxGzipKB}KB`.padEnd(20) +
      status,
  );
}

console.log('');
if (hasFailure) {
  console.error('❌ Bundle size check FAILED - some packages exceed budget\n');
  process.exit(1);
} else {
  console.log('✅ All packages within size budget\n');
}
