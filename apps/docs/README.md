# @xui-design/docs

XUI 跨框架组件库的文档站——一个自研 Vue 3 SPA,基于 vue-router hash 模式,内容由 `src/content` 下结构化 TS 元数据驱动,双端(Vue / React)demo 经 DemoBlock 双 tab 实时挂载。

## 启动方式

基于 `package.json` 的 scripts:

```bash
pnpm dev          # 启动 Vite dev server(默认端口 5175,被占用时顺延 5176、5177…)
pnpm build        # 生产构建,产物输出到 dist/
pnpm preview      # 预览构建产物
pnpm type-check   # vue-tsc --noEmit 类型检查
pnpm lint         # eslint src/**/*.{ts,tsx,vue}
```

dev 默认端口由 `vite.config.ts` 的 `server.port: 5175` 指定,`strictPort` 未开启,占用时 Vite 自动顺延。

## 目录结构

基于 `src/` 实际布局:

```
apps/docs/src/
├── main.ts                       # 入口:createApp(App).use(router).mount('#app'),引入 @xui-design/styles 与 docs.scss
├── App.vue                       # 布局骨架:SideNav + <RouterView :key="$route.fullPath"> + TableOfContents
├── router.ts                     # createWebHashHistory,路由:/、/theme、/i18n、/components/:slug
├── env.d.ts
├── components/                   # 通用渲染组件
│   ├── SideNav.vue              # 左侧导航:开始分组 + 组件分类分组,未上线条目置灰
│   ├── TableOfContents.vue       # 右侧锚点目录:扫描 h2.docs-section-title,IntersectionObserver 高亮
│   ├── DemoBlock.vue             # 单个 demo 块:Vue/React 双 tab,React 经 createRoot 挂载
│   ├── react-mount.tsx           # React demo 挂载桥:mountReactDemo(container, demo)
│   ├── CodeBlock.vue             # Prism 语法高亮 + 一键复制(vue/react/bash)
│   └── ApiSection.vue            # API 表格:Props/Events/Slots/Methods/Types 分块渲染
├── pages/                        # 路由级页面
│   ├── HomePage.vue              # / 首页:介绍 / 特性 / 安装 / 快速开始 / 24 组件总览
│   ├── ThemePage.vue             # /theme 主题定制指南页(3 组双端 demo)
│   ├── I18nPage.vue              # /i18n 国际化指南页(2 组双端 demo)
│   └── ComponentPage.vue          # /components/:slug 组件详情页(由 meta 驱动渲染)
├── content/                      # 结构化内容(元数据 + 真实 demo 源文件)
│   ├── registry.ts               # CATEGORIES / COMPONENT_LIST(24 项全量)/ componentMetas / componentMetaMap
│   ├── types.ts                  # ComponentMeta / DemoDefinition / ApiPropRow 等类型契约
│   ├── button/                   # 每个组件一个目录
│   │   ├── meta.ts               # features / demos / api / notes / a11y
│   │   └── demos/                # 双端同名 demo:type.vue + type.tsx、size.*、state.*
│   ├── switch/ table/ message/ input/ modal/ ... (共 24 个组件目录)
│   ├── theme/demos/              # 主题指南页 demo:dark / tokens / component(双端各 3 组)
│   └── i18n/demos/               # 国际化指南页 demo:switch / custom(双端各 2 组)
└── styles/
    └── docs.scss                 # 文档站自身样式
```

## 技术栈

来自 `package.json` dependencies:

- **Vue** `^3.5.0` + **vue-router** `^4.6.4`(hash 模式)
- **React** `^19.0.0` + **react-dom** `^19.0.0`(仅用于双端 demo 实时挂载,非应用主体)
- **prismjs** `^1.30.0`(代码高亮,按需语言组件)
- workspace 依赖:`@xui-design/core`、`@xui-design/vue`、`@xui-design/react`、`@xui-design/styles`

devDependencies 关键项:`@vitejs/plugin-vue` `^5.0.0`、`@vitejs/plugin-react` `^4.0.0`、`vue-tsc` `^2.1.0`。

`vite.config.ts` 同时启用 `vue()` 与 `react()` 插件,并通过 `resolve.alias` 将 `@xui-design/*` 直接指向兄弟包 `packages/*/src/index.ts`(源码直链,免预构建)。

## 使用说明

### 启动

```bash
pnpm dev
# 浏览器访问 http://localhost:5175 (hash 路由,任意静态路径/file:// 均可工作)
```

### 新增组件文档完整流程

以新增 `xxx` 组件文档为例:

1. **建目录与 demo 文件**:在 `src/content/xxx/` 下创建 `meta.ts` 与 `demos/` 目录。每个 demo 需双端各一份同名文件:`name.vue`(Vue 端)与 `name.tsx`(React 端),放在 `demos/` 下。

2. **编写 meta.ts**:遵循 `src/content/types.ts` 的 `ComponentMeta` 结构,填写 `name` / `slug` / `title` / `category` / `summary` / `features` / `scenarios` / `demos` / `api`(props/events/slots/methods/types) / `notes` / `a11y`。`demos` 数组每项需提供 `vueComponent`、`reactComponent`、`vueSource`、`reactSource` 四字段。导入约定(见 `button/meta.ts`):
   - Vue 组件:`import TypeVue from './demos/type.vue'`(带 `.vue`)
   - React 组件:`import TypeReact from './demos/type'`(**不带 `.tsx` 扩展名**,让 TS/Vite 解析命中同目录 `.tsx`,见下方避坑点①)
   - 源码:`import typeVueSource from './demos/type.vue?raw'` 与 `import typeReactSource from './demos/type.tsx?raw'`(**?raw 导入仍带完整文件名**)

3. **注册进 registry.ts**:在 `src/content/registry.ts` 顶部 import 该 meta,加入 `componentMetas` 数组;同时在 `COMPONENT_LIST` 中确认对应条目的 `available: true`(若该组件已在规划清单中则改为 true,否则新增条目)。`componentMetaMap` 会自动由 `componentMetas` 派生,无需手动维护。

4. **验证**:启动 dev server,在 SideNav 对应分类下应出现可点击条目,路由 `/components/xxx` 渲染 `ComponentPage.vue`,由 meta 驱动展示特性、demo、API 表格。

当前 24 个组件文档已全量上线(`COMPONENT_LIST` 全部 `available: true`)。

### 指南页路由(非组件 meta)

指南页不走 `componentMetas`,而是独立路由与独立页面组件,但在 SideNav「开始」分组下提供入口:

- **/theme 主题定制页**(`ThemePage.vue`):基于 CSS 变量的三层主题体系(明暗主题 / 全局 token / 组件级定制)。demo 文件位于 `src/content/theme/demos/`(dark / tokens / component,双端各 3 组),API 表格涵盖 `setTheme` / `getTheme` / `toggleTheme` / `subscribeTheme` / `setThemeTokens` / `clearThemeTokens`。
- **/i18n 国际化指南页**(`I18nPage.vue`):内置 zh-CN / en-US 语言包,`setLocale` 切换、`registerLocale` 扩展。demo 文件位于 `src/content/i18n/demos/`(switch / custom,双端各 2 组),API 表格涵盖 `setLocale` / `getLocale` / `getLocaleData` / `registerLocale` / `subscribeLocale` / `useLocaleData`。

两个指南页均复用 `DemoBlock` 与 `ApiSection` 组件,渲染机制与组件文档页一致。

### DemoBlock 双 tab 机制

`DemoBlock.vue` 实现同一 demo 的 Vue / React 双端实时挂载:

- 内部维护 `framework` ref(`'vue' | 'react'`,默认 vue)与 `showCode` ref(默认展开代码)。
- Vue 端:`<component :is="demo.vueComponent" v-if="framework === 'vue'">`,由 Vue 直接渲染。
- React 端:切到 react tab 时,`watch(framework)` 在 `nextTick` 后调用 `mountReactDemo(reactHost, demo.reactComponent)`(见 `react-mount.tsx`,内部 `createRoot(container).render(createElement(demo))`);切回 vue 或组件卸载时 `reactRoot.unmount()` 释放。
- 代码区随 tab 联动:`CodeBlock` 接收 `framework === 'vue' ? demo.vueSource : demo.reactSource`,语言映射为 `vue -> prismjs markup`、`react -> prismjs typescript`。

**跨路由复用坑**:DemoBlock 在不同组件文档页间若无 key,Vue 会复用实例,导致 framework tab 状态与 React `createRoot` 挂载点一起残留(显示成上一个组件的 demo)。`App.vue` 通过 `<RouterView :key="$route.fullPath">` 强制整页重建来解决。

### TableOfContents 锚点目录机制

`TableOfContents.vue` 自动生成右侧目录:

- 路由挂载后 `nextTick(scan)` 扫描页面内所有 `h2.docs-section-title`,提取文本并补 `id`(无 id 时赋 `toc-section-N`),渲染为锚点列表。
- `IntersectionObserver`(`rootMargin: '-80px 0px -70% 0px'`)监听可见章节并高亮当前项;点击锚点 `scrollIntoView({ behavior: 'smooth' })`。
- 路由切换后 `watch(route.fullPath)` 重新扫描(等待 `nextTick`)。
- 视口宽度不足时隐藏:`@media (width <= 1400px) { .docs-toc { display: none } }`(stylelint 要求新记法,见避坑点④)。

## GitHub Pages 部署

线上地址:**https://yzhijie.github.io/xui-design-docs/**

### 部署架构

文档站通过独立仓库 [YZhiJie/xui-design-docs](https://github.com/YZhiJie/xui-design-docs) 部署,与主仓库分离:

```
主仓库 apps/docs ──build──> dist/ ──推送──> YZhiJie/xui-design-docs (main)
                                                    │
                                            .github/workflows/deploy.yml
                                            (upload-pages-artifact + deploy-pages)
                                                    │
                                            GitHub Pages 自动发布
```

- 部署仓库内容为**构建产物本身**(`index.html` + `assets/` + 图标文件),不含源码;`.github/workflows/deploy.yml` 负责发布,push 到 main 即触发。
- Pages 的 build type 为 `workflow`(GitHub Actions 模式),无需 gh-pages 分支。
- 仓库根含 `.nojekyll`,禁用 Jekyll 处理,保证 Vite 产物原样服务。

### base 路径与 hash 路由

项目站点 URL 带仓库名前缀(`/xui-design-docs/`),构建时必须注入相同的 Vite `base`,否则资源 404:

```bash
cd apps/docs
DOCS_BASE=/xui-design-docs/ pnpm build
```

`vite.config.ts` 中 `base: process.env.DOCS_BASE ?? '/'`——不传 `DOCS_BASE` 时保持 `/`,本地 dev / preview 不受影响。构建后 `dist/index.html` 中的资源引用(favicon、CSS、JS)均带 `/xui-design-docs/` 前缀,可通过 `grep -o 'href="[^"]*"' dist/index.html` 验证。

路由使用 `createWebHashHistory`(hash 模式),所有路由在 `#/` 之后,GitHub Pages 无需配置 SPA rewrite 规则,直接支持任意路由直达与刷新。

### 更新流程

文档内容(含 meta、demo、页面组件、图标)改动后,执行以下指令更新线上文档(假设部署仓库已 clone 到 `~/Desktop/github_repositories/xui-design-docs`):

```bash
# 0. 首次:克隆部署仓库(只做一次)
git clone https://github.com/YZhiJie/xui-design-docs.git ~/Desktop/github_repositories/xui-design-docs

# 1. 构建文档站(注入 GitHub Pages base 前缀)
cd ~/Desktop/github_repositories/cross-framework-ui-design/apps/docs
DOCS_BASE=/xui-design-docs/ pnpm build

# 2. 验证构建产物的资源前缀(应全部带 /xui-design-docs/)
grep -o 'href="[^"]*"' dist/index.html

# 3. 清理部署仓库旧产物(保留 .git 与 .github,防过期 hash 文件残留)
cd ~/Desktop/github_repositories/xui-design-docs
git rm -rq assets 2>/dev/null; rm -rf assets index.html *.png *.jpg .nojekyll

# 4. 复制新产物
cp -R ~/Desktop/github_repositories/cross-framework-ui-design/apps/docs/dist/. .
touch .nojekyll

# 5. 提交并推送(push 后 Actions 自动部署,约 1 分钟生效)
git add -A
git commit -m "docs: 更新文档站内容"
git push origin main

# 6. 验证部署结果
gh run list --repo YZhiJie/xui-design-docs --limit 1   # 确认 deploy run 成功
curl -sL -o /dev/null -w "%{http_code}\n" https://yzhijie.github.io/xui-design-docs/   # 期望 200
```

注意事项:

- 第 1 步的 `DOCS_BASE` 必须与仓库名一致,否则线上资源 404
- 第 3 步保留 `.github/workflows/deploy.yml`(发布流水线)和 `.git`
- 本机 git 凭据已配置(osxkeychain),推送无需内嵌 token

### 站点图标

`public/` 下的图标文件会被 Vite 原样复制到 `dist/` 根:

| 文件 | 用途 | 引用方式 |
|------|------|----------|
| `favicon-32x32.png` | 浏览器标签页图标 | `index.html` 的 `rel="icon"` |
| `apple-touch-icon.png` | iOS 主屏图标 | `index.html` 的 `rel="apple-touch-icon"` |
| `logo-512.png` | 高清 logo 资源 | 备用 |
| `logo.jpg` | 原始生成图(1920×1920) | 源文件,未直接引用 |

`index.html` 中图标引用写 `/favicon-32x32.png` 形式的根相对路径,构建时由 Vite 自动注入 `base` 前缀。

## 关键避坑点

源自 `project_memory` 与源码注释,均需在新增文档/demo 时遵守:

1. **React demo import 不带 `.tsx` 扩展(TS5097)**:`meta.ts` 中 `import X from './demos/name'` 让解析命中同目录 `.tsx`;`?raw` 源码导入仍须带完整文件名 `./demos/name.tsx?raw`(见 `button/meta.ts` 注释)。

2. **SFC `<script>` 块会被字面序列 `</script>` 截断**:源码字符串(含注释)中不能直接出现该序列,需用 `'<' + '/script' + '>'` 三段拼接输出(见 `HomePage.vue` 的 `SCRIPT_CLOSE_TAG`)。

3. **tsconfig 不可设 `rootDir`**:`paths` 指向兄弟包 `src` 会触发 TS6059,当前 `apps/docs/tsconfig.json` 未设 `rootDir`;`jsx` 用 `react-jsx`(配合双端 demo)。

4. **stylelint media-feature-range-notation**:媒体查询须用新记法 `@media (width <= 900px)`,而非 `max-width:`(见 `TableOfContents.vue` 的 `@media (width <= 1400px)`)。

5. **prismjs 按需语言组件须按依赖序 import**:在 `CodeBlock.vue` 中为 `clike -> javascript -> typescript`(及 `bash`);顺序错误会导致语法未注册。

6. **模板内联 filter 回调参数会隐式 any(TS7006)**:分组逻辑放 `<script setup>` 里预计算,再在模板循环(见 `HomePage.vue` 的 `componentGroups` 预分组与注释)。

7. **IDE 内置浏览器自动化不稳定**:连续 navigate 易触发 "IDE Command timeout";新建 tab 的首次导航成功率最高。验证 docs 站时:① 视口外元素首次点击会静默失效,须先 `scrollIntoView` + wait 1s 再点击;② 切换 demo tab 等导致无障碍树位移的操作后,旧快照 ref 会指错元素,跨快照复用 ref 前必须重新 snapshot。

8. **Vite dev server 与 @xui 兄弟包 dist 产物**:长期驻留的 dev server 若在 `@xui-design/core` 的 `dist/types` 重建前启动,`compiler-sfc` 类型解析缓存会被污染(重启 dev server 即恢复);若 workspace 内 `@xui` 兄弟包 dist 被重建,Vite 默认忽略 `node_modules` 变更会加载旧代码,遇到此类异常优先重启 dev server。
