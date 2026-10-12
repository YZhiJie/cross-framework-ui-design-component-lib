# @xui-design/playground-react

XUI 跨框架组件库的 React 调试场——一个单文件 React 19 SPA,集中陈列全部 24 个 `@xui-design/react` 组件,用于隔离环境下的集成验证与交互调试。

## 启动方式

基于 `package.json` 的 scripts:

```bash
pnpm dev          # 启动 Vite dev server(默认端口 5174)
pnpm build        # 生产构建,产物输出到 dist/
pnpm preview      # 预览构建产物
pnpm type-check   # tsc --noEmit 类型检查
pnpm lint         # eslint src/**/*.{ts,tsx}
```

dev 默认端口由 `vite.config.ts` 的 `server.port: 5174` 指定。

## 目录结构

基于 `src/` 实际布局(极简单文件调试场):

```
apps/playground-react/src/
├── main.tsx      # 入口:createRoot(...).render(<React.StrictMode><App/></React.StrictMode>),引入 styles.css
├── App.tsx       # 调试场主体:24 个组件全部陈列 + Event log,函数组件 + hooks
└── styles.css     # 调试场样式(布局与 Vue 调试场同构)
```

入口 `index.html` 位于 `apps/playground-react/index.html`,挂载点 `#root`。

`App.tsx` 单文件承载全部调试内容:顶部标题与副标题,随后按 `<section>` 分组陈列 Button / Input / Switch / Checkbox / Tag / Alert / Modal / RadioGroup·Radio / Progress / Badge·Avatar / Empty / Select / Tabs / Message / Tooltip / DatePicker / Pagination / Table / Spin / Breadcrumb / Skeleton / InputNumber / Popconfirm,末尾为 Event log(`<pre className="log">`),实时打印各组件事件回调(`pushLog`)。`App` 为函数组件,状态全部由 `useState` / `useRef` 管理,布局与 Vue 调试场(`@xui-design/playground-vue`)一一对应。

## 技术栈

来自 `package.json` dependencies:

- **react** `^19.0.0` + **react-dom** `^19.0.0`
- workspace 依赖:`@xui-design/react`(组件源,含 `ModalRef` 等导出类型)、`@xui-design/core`(契约类型,如 `BreadcrumbItem` / `TableColumn`)、`@xui-design/styles`(BEM 样式,在 `App.tsx` 内 `import '@xui-design/styles'`)

devDependencies:`@vitejs/plugin-react` `^4.0.0`、`@types/react` `^19.0.0`、`@types/react-dom` `^19.0.0`。

`vite.config.ts` 仅启用 `react()` 插件,通过 `resolve.alias` 将 `@xui-design/react` / `@xui-design/core` / `@xui-design/styles` 直链兄弟包 `packages/*/src/index.ts`(源码直链,免预构建)。

`tsconfig.json` 关键项:`jsx: react-jsx`、`types: ["react", "react-dom"]`、`paths` 指向兄弟包 src(与 docs 应用不同,playground 只引 React 一端)。

`main.tsx` 使用 `React.StrictMode` 包裹,便于在开发期暴露副作用与不安全生命周期。

## 使用说明

### 用途

调试场用于在隔离环境中验证单个组件或组件间组合的真实交互行为,尤其适合验证:

- `@xui-design/react` 适配层对各组件 API 的实际响应(`value`/`onChange` 受控、`defaultValue` 非受控、`ref` 命令式调用如 `modalRef.current?.open()`)
- 受控/非受控两种用法(`useState` 受控 vs `defaultValue` 非受控)
- 大数据量场景(Select 虚拟滚动 1000 项、Table 虚拟滚动 1000 行)
- 跨组件联动(Modal 内读取 Input 值、Skeleton 切换加载态显示 Avatar 等)
- React 19 特性(StrictMode 下的副作用检测)

### 如何新增调试页

当前所有组件调试集中在单个 `App.tsx` 内,新增调试内容直接在该文件内追加 `<section>` 即可:

1. 在文件顶部从 `@xui-design/react` 导入待调试组件(若尚未导入);如需契约类型(如 `TableColumn`),从 `@xui-design/core` 导入;如需适配层导出类型(如 `ModalRef`),从 `@xui-design/react` 导入 type。
2. 在 `App` 函数体内用 `useState` / `useRef` 声明所需状态(参考既有 `name` / `visible` / `switchValue` / `modalRef` 等模式)。注意 `pushLog` 用 `setLog((prev) => [...].slice(0, 30))` 限长,避免无限增长。
3. 在返回的 JSX 中新增一个 `<section>`,包含 `<h2>` 标题与若干 `.row` / `.column` 容器,摆放组件并绑定 props / `onChange` / `onClick` 回调(`pushLog(...)` 将事件打印到 Event log)。
4. 如需独立样式,在 `src/styles.css` 中补充对应类名(参考既有 `.row` / `.column` / `.hint` / `.log`)。

无需新增文件或路由——调试场刻意保持单文件扁平结构,便于快速迭代。

### Vue / React 调试场对照

两个调试场(`@xui-design/playground-vue` 与 `@xui-design/playground-react`)API 口径完全对齐:`@xui-design/core` 的 `ComponentSpec` 为双端唯一契约,Vue 事件 ↔ React 回调、Vue `v-model:value` ↔ React `value`/`onChange`、Vue 插槽 ↔ React `renderXxx` 一一映射。同一组件在两端的用法可在两个调试场间逐行对照,便于核验适配层行为一致性。

## 关键避坑点

- **Breadcrumb 导航用锚点 href**:演示 Breadcrumb 的真实导航行为(href 渲染为 `<a>`)时,`items` 须用锚点 `href: '#home'`(如 `breadcrumbItems`),而非路径 `/home`,否则会触发不必要的路由跳转。
- **Modal 受控同步**:React 端 `Modal` 的命令式 `ref.open()` 触发 `onOpen` 后,需在 `onOpen` 内将受控 `visible` 对齐为 `true`,使 confirm/cancel/close 等关闭路径统一走受控 state(对齐 Vue 端 `v-model:visible` 的回写行为,见 `App.tsx` 的 `onOpen` 注释)。
- **Vite dev server 与 @xui 兄弟包 dist 产物**:长期驻留的 dev server 若在 `@xui-design/core` 的 `dist/types` 重建前启动,类型解析缓存会被污染,重启 dev server 即恢复;workspace 内 `@xui` 兄弟包 dist 被重建时,Vite 默认忽略 `node_modules` 变更会加载旧代码,遇到异常优先重启 dev server。
