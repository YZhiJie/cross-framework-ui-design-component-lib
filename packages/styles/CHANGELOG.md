# @xui/styles

## 0.2.0

### Minor Changes

- [`6844824`](https://github.com/YZhiJie/cross-framework-ui-design-component-lib/commit/68448246ac455d6e5c1ceb5f33e96496127512ba) - 新增全组件图标自定义能力（14 组件插槽 / render 回调，含 Table 作用域 sortIcon 与 Message icon 选项）、Switch 双态文本（checkedText / uncheckedText）、全局主题 token API（setThemeTokens / clearThemeTokens）。全部为增量变更，未传新属性时行为与 0.1.0 一致。修复 Tooltip / Popconfirm 气泡在 flex/grid stretch 布局中相对被拉宽的包裹根定位导致错位的问题（气泡改为锚定 trigger 元素）。Tooltip / Popconfirm / Select 新增浮层视口避让：空间不足自动翻转方位（Select 向上展开为 is-drop-up）、交叉轴溢出视口自动钳制，滚动 / resize 实时重算；修复 Popconfirm 左右方位箭头与气泡边框间出现缝隙、呈漂浮独立菱形的问题（双菱形箭头结构）。修复 Button danger 变体背景 / 边框硬编码色值未消费 --xui-color-danger 语义 token 的问题（暗色主题与组件级 token 覆盖此前对 danger 按钮不生效）。详见 docs/11-变更说明文档.md

## 0.1.0

### Minor Changes

- 首个预发布版本：跨框架组件库基础设施（core 契约 + shared 纯逻辑 + Vue3/React19 双端适配层），含 Button / Input / Modal 三组件、统一图标包与样式单一来源，双端 184 测试用例与契约测试全绿。
