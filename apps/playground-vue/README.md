# @xui/playground-vue

XUI 跨框架组件库的 Vue 调试场——一个单文件 Vue 3 SPA,集中陈列全部 24 个 `@xui/vue` 组件,用于隔离环境下的集成验证与交互调试。

## 启动方式

基于 `package.json` 的 scripts:

```bash
pnpm dev          # 启动 Vite dev server(默认端口 5173)
pnpm build        # 生产构建,产物输出到 dist/
pnpm preview      # 预览构建产物
pnpm type-check   # vue-tsc --noEmit 类型检查
pnpm lint         # eslint src/**/*.{ts,vue}
```

dev 默认端口由 `vite.config.ts` 的 `server.port: 5173` 指定。

## 目录结构

基于 `src/` 实际布局(极简单文件调试场):

```
apps/playground-vue/src/
├── main.ts        # 入口:createApp(App).mount('#app'),无路由、无状态库
├── App.vue        # 调试场主体:24 个组件全部陈列 + Event log,样式内联 <style scoped>
└── (无其他子文件)
```

入口 `index.html` 位于 `apps/playground-vue/index.html`,挂载点 `#app`。

`App.vue` 单文件承载全部调试内容:顶部标题与副标题,随后按 `<section>` 分组陈列 Button / Input / Switch / Checkbox / Tag / Alert / Modal / RadioGroup·Radio / Progress / Badge·Avatar / Empty / Select / Tabs / Message / Tooltip / DatePicker / Pagination / Table / Spin / Breadcrumb / Skeleton / InputNumber / Popconfirm,末尾为 Event log(`<pre class="log">`),实时打印各组件事件回调(`pushLog`)。样式通过 `<style scoped>` 内联,布局为 `max-width: 760px` 居中单栏。

## 技术栈

来自 `package.json` dependencies:

- **vue** `^3.5.0`
- workspace 依赖:`@xui/vue`(组件源)、`@xui/core`(契约类型,如 `BreadcrumbItem` / `TableColumn` / `TableRow` / `TableRowKey` / `TableSort` / `SelectValue`)、`@xui/styles`(BEM 样式,在 `App.vue` 内 `import '@xui/styles'`)

devDependencies:`@vitejs/plugin-vue` `^5.0.0`、`vue-tsc` `^2.1.0`。

`vite.config.ts` 仅启用 `vue()` 插件,通过 `resolve.alias` 将 `@xui/vue` / `@xui/core` / `@xui/styles` 直链兄弟包 `packages/*/src/index.ts`(源码直链,免预构建)。

`tsconfig.json` 关键项:`jsx: preserve`、`types: ["vue"]`、`paths` 指向兄弟包 src(与 docs 应用不同,playground 只引 Vue 一端)。

## 使用说明

### 用途

调试场用于在隔离环境中验证单个组件或组件间组合的真实交互行为,尤其适合验证:

- `@xui/vue` 适配层对各组件 API 的实际响应(v-model、事件回调、ref 命令式调用等)
- 受控/非受控两种用法(`v-model:value` 受控 vs `default-value` 非受控)
- 大数据量场景(Select 虚拟滚动 1000 项、Table 虚拟滚动 1000 行)
- 跨组件联动(Modal 内读取 Input 值、Skeleton 切换加载态显示 Avatar 等)

### 如何新增调试页

当前所有组件调试集中在单个 `App.vue` 内,新增调试内容直接在该文件内追加 `<section>` 即可:

1. 在 `<script setup>` 顶部从 `@xui/vue` 导入待调试组件(若尚未导入);如需契约类型,从 `@xui/core` 导入。
2. 按 `ref` 声明所需响应式状态(参考既有 `name` / `modalVisible` / `switchValue` 等模式)。
3. 在 `<template>` 中新增一个 `<section>`,包含 `<h2>` 标题与若干 `.row` / `.column` 容器,摆放组件并绑定 props / v-model / 事件回调(`@click="pushLog(...)"` 将事件打印到 Event log)。
4. 如需独立样式,在文件末尾 `<style scoped>` 内补充对应类名(参考既有 `.row` / `.column` / `.hint` / `.log`)。

无需新增文件或路由——调试场刻意保持单文件扁平结构,便于快速迭代。

## 关键避坑点

- **Breadcrumb 导航用锚点 href**:演示 Breadcrumb 的真实导航行为(href 渲染为 `<a>`)时,`items` 须用锚点 `href: '#home'`(如 `breadcrumbItems`),而非路径 `/home`,否则在 hash-less 的单页调试场中会触发不必要的路由跳转。
- **Vite dev server 与 @xui 兄弟包 dist 产物**:长期驻留的 dev server 若在 `@xui/core` 的 `dist/types` 重建前启动,`compiler-sfc` 类型解析缓存会被污染,重启 dev server 即恢复;workspace 内 `@xui` 兄弟包 dist 被重建时,Vite 默认忽略 `node_modules` 变更会加载旧代码,遇到异常优先重启 dev server。
