# @xui-design/core

## 0.3.0

### Minor Changes

- [`a8852b3`](https://github.com/YZhiJie/cross-framework-ui-design-component-lib/commit/a8852b36ae59d7d0577f8146d8455527a19679a1) - 新增 Form / FormItem 表单组件（双端一致）：支持同步/异步校验、条件规则（when）、跨字段关联校验（validator 接收全部表单值）、内置校验规则（required / email / phone / number / length / regex / url / custom）、change / blur / submit 三种校验触发时机、字段级联注册、 initialValues 初始化 / resetFields 重置 / submit 提交 / getFieldValue / setFieldValue 等命令式 API、表单级 disabled / readonly、动态增删字段，并新增对应 BEM 样式与文档站 Form 页面（4 组双端 demo）。

### Patch Changes

- Updated dependencies [[`a8852b3`](https://github.com/YZhiJie/cross-framework-ui-design-component-lib/commit/a8852b36ae59d7d0577f8146d8455527a19679a1)]:
  - @xui-design/shared@0.3.0

## 0.2.1

### Patch Changes

- [`4b3dfbf`](https://github.com/YZhiJie/cross-framework-ui-design-component-lib/commit/4b3dfbfabfb831fa56113443abe511e4d13cf9fe) - 补齐 publishConfig.access: public 配置，修复 CI 自动发布时 scoped 包被拒绝的问题。
- Updated dependencies [[`4b3dfbf`](https://github.com/YZhiJie/cross-framework-ui-design-component-lib/commit/4b3dfbfabfb831fa56113443abe511e4d13cf9fe)]:
  - @xui-design/shared@0.2.1

## 0.2.0

### Minor Changes

- [`e3bac86`](https://github.com/YZhiJie/cross-framework-ui-design-component-lib/commit/e3bac865d5a1718875081be8227b22f170f1a699) - 新增组件库国际化能力：@xui-design/shared 新增 locale 模块（内置 zh-CN / en-US 语言包，默认 zh-CN 且内置文案与历史硬编码逐字一致，升级零行为变化），提供 setLocale / getLocale / getLocaleData / registerLocale（组级浅合并扩展任意语言）/ subscribeLocale 运行时 API 与双端 useLocaleData Hook；Modal / Popconfirm / Table / Pagination / DatePicker / Select / Skeleton / Breadcrumb 8 个组件的内置文案（按钮文本、空态、aria-label、占位符、面板标题与星期）统一接入语言包，组件显式文案 prop 依旧优先。契约调整：Modal okText/cancelText 与 Popconfirm confirmText/cancelText 不再有硬编码默认值（未提供时取语言包）。文档站新增 /i18n 国际化指南页（工作机制、内置文案清单、双端交互 demo、API 文档）。

- [`6844824`](https://github.com/YZhiJie/cross-framework-ui-design-component-lib/commit/68448246ac455d6e5c1ceb5f33e96496127512ba) - 新增全组件图标自定义能力（14 组件插槽 / render 回调，含 Table 作用域 sortIcon 与 Message icon 选项）、Switch 双态文本（checkedText / uncheckedText）、全局主题 token API（setThemeTokens / clearThemeTokens）。全部为增量变更，未传新属性时行为与 0.1.0 一致。修复 Tooltip / Popconfirm 气泡在 flex/grid stretch 布局中相对被拉宽的包裹根定位导致错位的问题（气泡改为锚定 trigger 元素）。Tooltip / Popconfirm / Select 新增浮层视口避让：空间不足自动翻转方位（Select 向上展开为 is-drop-up）、交叉轴溢出视口自动钳制，滚动 / resize 实时重算；修复 Popconfirm 左右方位箭头与气泡边框间出现缝隙、呈漂浮独立菱形的问题（双菱形箭头结构）。修复 Button danger 变体背景 / 边框硬编码色值未消费 --xui-color-danger 语义 token 的问题（暗色主题与组件级 token 覆盖此前对 danger 按钮不生效）。详见 docs/11-变更说明文档.md

### Patch Changes

- Updated dependencies [[`e3bac86`](https://github.com/YZhiJie/cross-framework-ui-design-component-lib/commit/e3bac865d5a1718875081be8227b22f170f1a699), [`6844824`](https://github.com/YZhiJie/cross-framework-ui-design-component-lib/commit/68448246ac455d6e5c1ceb5f33e96496127512ba)]:
  - @xui-design/shared@0.2.0

## 0.1.0

### Minor Changes

- 首个预发布版本：跨框架组件库基础设施（core 契约 + shared 纯逻辑 + Vue3/React19 双端适配层），含 Button / Input / Modal 三组件、统一图标包与样式单一来源，双端 184 测试用例与契约测试全绿。

### Patch Changes

- Updated dependencies []:
  - @xui-design/shared@0.1.0
