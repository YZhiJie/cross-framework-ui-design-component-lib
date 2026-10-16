---
"@xui-design/vue": minor
"@xui-design/react": minor
---

feat: 双端根导出组件契约 Props 类型，名称逐字对齐。每个声明式组件直接 re-export core 契约类型（`ButtonProps`、`ModalProps` 等 26 个，全量含 onXxx 事件回调声明），另导出命令式 API 的 `XxxRef` 类型（Vue 10 个新增；React 沿用既有）。消费侧双端统一：`import type { ButtonProps, ButtonRef } from '@xui-design/vue' / '@xui-design/react'`。

⚠️ **Breaking（仅 React）**：根导出移除 `XxxComponentProps` 别名类型（0.3.0 已发布）——其为契约 Props 附加 ref/className 收窄的适配类型，现统一由直出的 `XxxProps` 替代；组件内部实现不变，`XxxRef`、`FormContextValue` 等真实适配类型保留。Vue 端为纯新增，无 breaking。
