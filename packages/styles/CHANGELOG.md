# @xui-design/styles

## 0.5.0

### Minor Changes

- [`3ad9a7b`](https://github.com/YZhiJie/cross-framework-ui-design-component-lib/commit/3ad9a7bb9fc7c06b63c0231da7960bfb87747639) - feat: 新增 Waterfall 瀑布流组件

  基于最短列贪心分配的多列瀑布流布局：
  - 支持响应式断点（breakpoints），容器尺寸变化时 ResizeObserver 自动切换列数
  - 高度缓存跨列数切换复用：切换 4→2 列时零成本复用已测量高度
  - 图片/内容异步加载完成后自动触发重排
  - rAF 合并调度，一帧内多次变化只执行一次重排
  - Vue #item 作用域 slot（item + index）/ React renderItem 回调双端对齐

## 0.4.2

### Patch Changes

- [`144dda7`](https://github.com/YZhiJie/cross-framework-ui-design-component-lib/commit/144dda7136044f640c1c56a9e72ca75470016602) - 修复 Cascader / Tree / TreeSelect 复选框勾选标记未居中问题：勾选 ✓ 与半选横条从手写绝对定位偏移（left: 3px / top: 0，实际偏左上约 2-3px）改为 `left/top: 50% + translate(-50%, -50%)` 实现水平垂直双居中，✓ 附加 -1px 左移补偿旋转后的视觉重心右偏。

## 0.4.1

### Patch Changes

- [`8bf2605`](https://github.com/YZhiJie/cross-framework-ui-design-component-lib/commit/8bf260593de4c4cb8f847ae3a00002e93cb374fb) - fix: 修复暗色主题下 Tooltip 气泡白字不可见的问题。气泡原先复用文本色 token 作背景（`background: var(--xui-color-text)`）并硬编码 `color: #fff`，暗色下 `--xui-color-text` 翻转为浅色 `#f3f4f6`，导致白字浅底完全看不见。现引入独立语义 token `--xui-color-tooltip-bg` / `--xui-color-tooltip-text`（浅色 `#1f2937` / `#fff`，暗色 `[#374151](https://github.com/YZhiJie/cross-framework-ui-design-component-lib/issues/374151)` / `#f3f4f6`）成对使用，气泡外观随主题整体翻转；箭头沿用 `background-color: inherit` 自动跟随，无需额外改动。

## 0.4.0

### Minor Changes

- [`bb7d766`](https://github.com/YZhiJie/cross-framework-ui-design-component-lib/commit/bb7d766586da04925308657c9f458046d7cd4e77) - ⚠️ **Breaking（exports 收窄）**：移除各包 `exports` 中指向不存在产物的子路径——core 的 `./components/*` `./spec` `./types`、shared 的 `./components/*` `./hooks` `./utils`、vue / react / icons 的 `./components/*`、styles 的 `./theme/*` `./components/*` `./reset.css`，统一收敛为仅根导出 `.`。这些子路径声明的目标文件在 dist 中从未存在，正常消费方不可能正在使用，实际影响面为零；但若构建工具对未声明子路径的报错策略不同，请在升级后检查是否存在相关深路径引用。0.x 阶段按 minor 发布（semver 0.x 约定 minor 可含 breaking），组件与样式的根导出 API 无任何变化。

## 0.3.0

### Minor Changes

- [`a8852b3`](https://github.com/YZhiJie/cross-framework-ui-design-component-lib/commit/a8852b36ae59d7d0577f8146d8455527a19679a1) - 新增 Form / FormItem 表单组件（双端一致）：支持同步/异步校验、条件规则（when）、跨字段关联校验（validator 接收全部表单值）、内置校验规则（required / email / phone / number / length / regex / url / custom）、change / blur / submit 三种校验触发时机、字段级联注册、 initialValues 初始化 / resetFields 重置 / submit 提交 / getFieldValue / setFieldValue 等命令式 API、表单级 disabled / readonly、动态增删字段，并新增对应 BEM 样式与文档站 Form 页面（4 组双端 demo）。

### Patch Changes

- 修复裸导入 `import '@xui-design/styles'` 不生效的问题：此前构建仅输出 `dist/index.css`，`exports["."]` 指向的 JS 产物缺失，消费方只能显式引用 `@xui-design/styles/index.css`。现新增 `src/index.ts` 入口，构建输出 `index.mjs` / `index.cjs` 并注入对 `index.css` 的引用，裸导入即生效全部样式（原 `/index.css` 子路径保持兼容）。文档站安装指引同步补充 `@xui-design/styles` 依赖。

## 0.2.1

### Patch Changes

- [`4b3dfbf`](https://github.com/YZhiJie/cross-framework-ui-design-component-lib/commit/4b3dfbfabfb831fa56113443abe511e4d13cf9fe) - 补齐 publishConfig.access: public 配置，修复 CI 自动发布时 scoped 包被拒绝的问题。

## 0.2.0

### Minor Changes

- [`6844824`](https://github.com/YZhiJie/cross-framework-ui-design-component-lib/commit/68448246ac455d6e5c1ceb5f33e96496127512ba) - 新增全组件图标自定义能力（14 组件插槽 / render 回调，含 Table 作用域 sortIcon 与 Message icon 选项）、Switch 双态文本（checkedText / uncheckedText）、全局主题 token API（setThemeTokens / clearThemeTokens）。全部为增量变更，未传新属性时行为与 0.1.0 一致。修复 Tooltip / Popconfirm 气泡在 flex/grid stretch 布局中相对被拉宽的包裹根定位导致错位的问题（气泡改为锚定 trigger 元素）。Tooltip / Popconfirm / Select 新增浮层视口避让：空间不足自动翻转方位（Select 向上展开为 is-drop-up）、交叉轴溢出视口自动钳制，滚动 / resize 实时重算；修复 Popconfirm 左右方位箭头与气泡边框间出现缝隙、呈漂浮独立菱形的问题（双菱形箭头结构）。修复 Button danger 变体背景 / 边框硬编码色值未消费 --xui-color-danger 语义 token 的问题（暗色主题与组件级 token 覆盖此前对 danger 按钮不生效）。详见 docs/11-变更说明文档.md

## 0.1.0

### Minor Changes

- 首个预发布版本：跨框架组件库基础设施（core 契约 + shared 纯逻辑 + Vue3/React19 双端适配层），含 Button / Input / Modal 三组件、统一图标包与样式单一来源，双端 184 测试用例与契约测试全绿。
