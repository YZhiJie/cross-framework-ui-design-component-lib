---
'@xui/core': minor
'@xui/shared': minor
'@xui/vue': minor
'@xui/react': minor
---

新增组件库国际化能力：@xui/shared 新增 locale 模块（内置 zh-CN / en-US 语言包，默认 zh-CN 且内置文案与历史硬编码逐字一致，升级零行为变化），提供 setLocale / getLocale / getLocaleData / registerLocale（组级浅合并扩展任意语言）/ subscribeLocale 运行时 API 与双端 useLocaleData Hook；Modal / Popconfirm / Table / Pagination / DatePicker / Select / Skeleton / Breadcrumb 8 个组件的内置文案（按钮文本、空态、aria-label、占位符、面板标题与星期）统一接入语言包，组件显式文案 prop 依旧优先。契约调整：Modal okText/cancelText 与 Popconfirm confirmText/cancelText 不再有硬编码默认值（未提供时取语言包）。文档站新增 /i18n 国际化指南页（工作机制、内置文案清单、双端交互 demo、API 文档）。
