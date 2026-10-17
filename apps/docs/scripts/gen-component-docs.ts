/**
 * 组件文档 md 生成器（VitePress 迁移专用）
 *
 * 原理：文档内容仍以 src/content/<slug>/meta.ts 为唯一来源（结构化双语数据），
 * 生成器用 Vite SSR 模块加载器把 registry.ts（连带全部 meta / demo 组件）编译
 * 后读出纯文本字段，按模板写出 VitePress markdown 页面：
 *
 * - zh 树：apps/docs/components/<slug>.md（root locale）
 * - en 树：apps/docs/en/components/<slug>.md
 *
 * 静态文本（概览 / 特性 / 场景 / 注意事项 / 无障碍 / 契约类型）直接生成真实
 * markdown —— 进入右侧目录、参与本地搜索索引、享有原生锚点与复制按钮；
 * 交互区（demo / API 表格）由全局组件 ComponentDemo / ComponentApi 渲染。
 *
 * 运行：pnpm --filter @xui-design/docs docs:gen
 */
import { createServer } from 'vite';
import vue from '@vitejs/plugin-vue';
import react from '@vitejs/plugin-react';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { ComponentMeta } from '../src/content/types';
import { CATEGORIES, COMPONENT_LIST } from '../src/content/component-list';

// 注意：不要在顶层静态 import ui-messages 的运行时值 —— 它链式 import @xui-design/vue（.vue 源码），
// tsx / node 无法加载；下方在 main() 里经 vite SSR 模块加载器取回后赋值（与 registry 同一上下文）。
import type { UiMessages } from '../src/i18n/ui-messages';

let messagesMap: Record<'zh-CN' | 'en-US', UiMessages>;

// tsx 加载器下 plugin-vue 内部解析 vue/compiler-sfc 会得到 null，显式传入编译器
const nodeRequire = createRequire(import.meta.url);
const vueCompiler = nodeRequire('vue/compiler-sfc');

const docsRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** 纯文本转义（md 开启 html 模式，< > & 需转义避免被当作标签吞掉） */
const esc = (text: string): string =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

type ApiKind = 'props' | 'events' | 'slots' | 'methods' | 'types';
const API_KINDS: ApiKind[] = ['props', 'events', 'slots', 'methods', 'types'];

/** 各 API 分组的 h3 标题（与 ApiSection 内部标题逐字一致） */
function apiLabel(kind: ApiKind, lang: 'zh-CN' | 'en-US'): string {
  const ui = messagesMap[lang].api;
  switch (kind) {
    case 'props':
      return 'Props';
    case 'events':
      return ui.eventsTitle;
    case 'slots':
      return ui.slotsTitle;
    case 'methods':
      return ui.methodsTitle;
    case 'types':
      return ui.typesTitle;
  }
}

/** 生成的 md 页面（zh / en 双份） */
function renderPage(meta: ComponentMeta, lang: 'zh-CN' | 'en-US'): string {
  const zh = lang === 'zh-CN';
  const ui = messagesMap[lang];
  const category = CATEGORIES.find((item) => item.key === meta.category)!;
  const pick = (ltext: { 'zh-CN': string; 'en-US': string }) =>
    zh ? ltext['zh-CN'] : ltext['en-US'];

  const lines: string[] = [];

  // ---------- frontmatter：标题用于浏览器标签 / 搜索 ----------
  lines.push('---');
  lines.push(zh ? `title: ${meta.title} ${meta.name}` : `title: ${meta.name}`);
  lines.push('---');
  lines.push('');

  // ---------- 页头：h1 + 英文副名 + 分类标签 ----------
  const h1 = zh
    ? `${meta.title} <span class="page-head__en">${meta.name}</span>`
    : `${meta.name} <span class="page-head__en">${meta.title}</span>`;
  lines.push(`# ${h1} <span class="doc-tag">${esc(pick(category.title))}</span>`);
  lines.push('');
  lines.push(esc(pick(meta.summary)));
  lines.push('');

  // ---------- 功能特性 / 使用场景 ----------
  lines.push(`## ${ui.component.features}`);
  lines.push('');
  for (const feature of meta.features) lines.push(`- ${esc(pick(feature))}`);
  lines.push('');
  if (meta.scenarios && meta.scenarios.length > 0) {
    lines.push(`### ${ui.component.scenarios}`);
    lines.push('');
    for (const scenario of meta.scenarios) lines.push(`- ${esc(pick(scenario))}`);
    lines.push('');
  }

  // ---------- 代码演示（demo 标题 / 说明入目录与搜索，交互区交给 ComponentDemo） ----------
  lines.push(`## ${ui.component.demos}`);
  lines.push('');
  lines.push(esc(ui.component.demosHint));
  lines.push('');
  for (const demo of meta.demos) {
    lines.push(`### ${esc(pick(demo.title))}`);
    lines.push('');
    if (demo.description) {
      lines.push(esc(pick(demo.description)));
      lines.push('');
    }
    lines.push(`<ComponentDemo slug="${meta.slug}" demo-id="${demo.id}" />`);
    lines.push('');
  }

  // ---------- API 文档（表格由 ComponentApi 渲染；契约类型直接生成 md 代码块） ----------
  lines.push(`## ${ui.component.api}`);
  lines.push('');
  lines.push(
    `\`@xui-design/core\` ComponentSpec · ${zh ? '唯一契约基准，双端一致' : 'single contract, identical on both frameworks'}`,
  );
  lines.push('');
  for (const kind of API_KINDS) {
    if (kind === 'types') {
      // 契约类型：真实 md 代码块（可复制、可搜索、暗色自适应）
      const types = meta.api.types;
      if (!types || types.length === 0) continue;
      lines.push(`### ${apiLabel(kind, lang)}`);
      lines.push('');
      for (const typeBlock of types) {
        lines.push(`**${typeBlock.name}**`);
        lines.push('');
        lines.push('```ts');
        lines.push(typeBlock.definition);
        lines.push('```');
        lines.push('');
        if (typeBlock.description) {
          lines.push(esc(pick(typeBlock.description)));
          lines.push('');
        }
      }
    } else {
      // 表格类分组（props / events / slots / methods）：单表组件渲染
      const rows = meta.api[kind];
      if (!rows || rows.length === 0) continue;
      lines.push(`### ${apiLabel(kind, lang)}`);
      lines.push('');
      lines.push(`<ComponentApi slug="${meta.slug}" kind="${kind}" />`);
      lines.push('');
    }
  }

  // ---------- 注意事项 / 无障碍 ----------
  for (const [sectionKey, key] of [
    ['notes', 'notes'],
    ['a11y', 'a11y'],
  ] as const) {
    const items = meta[sectionKey];
    if (!items || items.length === 0) continue;
    lines.push(`## ${ui.component[key]}`);
    lines.push('');
    for (const item of items) lines.push(`- ${esc(pick(item))}`);
    lines.push('');
  }

  return lines.join('\n');
}

async function main(): Promise<void> {
  const server = await createServer({
    root: docsRoot,
    configFile: false,
    logLevel: 'error',
    plugins: [vue({ compiler: vueCompiler }), react()],
    resolve: {
      alias: {
        '@xui-design/vue': path.resolve(docsRoot, '../../packages/vue/src/index.ts'),
        '@xui-design/react': path.resolve(docsRoot, '../../packages/react/src/index.ts'),
        '@xui-design/core': path.resolve(docsRoot, '../../packages/core/src/index.ts'),
      },
    },
  });

  try {
    // 纯 ssrLoadModule 场景不经过 dev 中间件链路，buildStart 不会被触发，
    // 而 vite:css 等核心插件在 buildStart 里初始化缓存（SFC <style> 虚拟模块依赖它），
    // 这里手动补一次，否则带 <style> 的 SFC 转换会报 cssModulesCache 未初始化
    await (
      server as unknown as { pluginContainer: { buildStart: (opts?: object) => Promise<void> } }
    ).pluginContainer.buildStart({});

    const registry = (await server.ssrLoadModule('/src/content/registry.ts')) as {
      componentMetas: ComponentMeta[];
    };
    const metas = registry.componentMetas;
    // 文案（章节标题等）与运行时同源：ui-messages 经 vite SSR 加载
    messagesMap = (
      (await server.ssrLoadModule('/src/i18n/ui-messages.ts')) as {
        messagesMap: Record<'zh-CN' | 'en-US', UiMessages>;
      }
    ).messagesMap;

    await mkdir(path.join(docsRoot, 'components'), { recursive: true });
    await mkdir(path.join(docsRoot, 'en/components'), { recursive: true });

    let written = 0;
    for (const meta of metas) {
      const entry = COMPONENT_LIST.find((item) => item.slug === meta.slug);
      if (!entry?.available) continue;
      await writeFile(
        path.join(docsRoot, 'components', `${meta.slug}.md`),
        renderPage(meta, 'zh-CN'),
      );
      await writeFile(
        path.join(docsRoot, 'en/components', `${meta.slug}.md`),
        renderPage(meta, 'en-US'),
      );
      written += 2;
    }
    console.log(`[docs:gen] ${metas.length} 组件 → ${written} 个 md 页面已生成`);
  } finally {
    await server.close();
  }
}

main().catch((error) => {
  console.error('[docs:gen] 生成失败：', error);
  process.exit(1);
});
