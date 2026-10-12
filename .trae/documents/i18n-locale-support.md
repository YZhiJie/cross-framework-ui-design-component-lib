# 组件库国际化（i18n）支持 + 文档站 i18n 章节

## Context

组件库目前所有用户可见文案硬编码中文（Modal 确认/取消、Table 暂无数据、各 aria-label、DatePicker 星期表头等），无法切换语言。本次为组件库新增 i18n 能力：内置 zh-CN（默认，向后兼容零行为变化）/ en-US 语言包，提供全局 locale API（对齐既有 theme 全局 API 模式），并支持 registerLocale 扩展任意语言；同时在文档站新增 /i18n 指南章节。

核心约束（已验证）：
- 契约测试（scripts/contract-test.ts）将 core spec props.defaults 与双端默认值三方 Object.is 比对 → 文案默认值改走 locale 时，spec 与双端内联默认值必须同步删除（双双变 undefined）
- @xui/shared 严禁 import @xui/core；locale 模块对齐 packages/shared/src/theme/theme.ts 骨架
- React hook 必须稳定快照引用（复用 packages/react/src/hooks/use-logic-state.ts 基座）

## 设计

### 语言包类型（shared/src/locale）

```ts
export type XuiLocaleData = {
  modal: { ok: string; cancel: string };
  popconfirm: { confirm: string; cancel: string };
  table: { empty: string; selectAll: string; selectRow: (index: number) => string };
  pagination: { nav: string; prev: string; next: string };
  datePicker: { panel: string; prevMonth: string; nextMonth: string; weekdays: readonly string[]; placeholder: string };
  skeleton: { loading: string };
  breadcrumb: { nav: string };
  select: { searchPlaceholder: string; searchAriaLabel: string; triggerPlaceholder: string };
};
export type XuiLocaleInput = { [K in keyof XuiLocaleData]?: Partial<XuiLocaleData[K]> };
```

- selectRow 用函数型 `(index) => string`（中英语序不同，模板替换无法跨语序；函数引用固定不破坏缓存）
- weekdays 整组替换，不做 per-item 合并

### 全局 API（对齐 theme 模式）

- `getLocale(): string` / `setLocale(key): void`（未注册 key 静默忽略）/ `subscribeLocale(listener: (data: XuiLocaleData) => void): () => void` / `registerLocale(key, partial: XuiLocaleInput)`（顶层逐组浅合并，生成新包引用）/ `getLocaleData(): XuiLocaleData`
- **稳定引用缓存**：`getLocaleData()` 恒返回模块级 cache；仅 setLocale 切换 key、registerLocale 命中当前 key 时重建并通知（保证 React useSyncExternalStore 快照语义）
- 与 theme 的有意差异：locale 纯内存不写 DOM，SSR 下 setLocale/registerLocale 正常生效
- 内置包：zhCN（默认，weekdays 复用 DATE_WEEKDAY_LABELS）、enUS；DATE_WEEKDAY_LABELS 保留导出不删

### 双端 hook

- React：`packages/react/src/hooks/use-locale.ts` — 复用 `useLogicState(subscribeLocale, getLocaleData)`
- Vue：`packages/vue/src/hooks/use-locale.ts`（新建 hooks 目录，vue 包当前无）— `ref(getLocaleData())` + subscribeLocale 更新 + getCurrentScope/onScopeDispose 退订
- 双端 index.ts re-export locale API + useLocaleData（对齐 theme re-export 先例：vue/src/index.ts L58-69、react/src/index.ts L71-84）

## 实施步骤

### Step 0 — core 契约调整
- [core/src/components/modal/spec.ts](file:///Users/yangzhijie/Desktop/github_repositories/cross-framework-ui-design/packages/core/src/components/modal/spec.ts)：props.defaults 删除 okText/cancelText（L38-39），props.type 保留
- [core/src/components/popconfirm/spec.ts](file:///Users/yangzhijie/Desktop/github_repositories/cross-framework-ui-design/packages/core/src/components/popconfirm/spec.ts)：defaults 删除 confirmText/cancelText（L29-30）
- [core/src/components/table/spec.ts](file:///Users/yangzhijie/Desktop/github_repositories/cross-framework-ui-design/packages/core/src/components/table/spec.ts)：slots.empty.fallback（L45）描述改为"默认取当前语言包 table.empty"
- core/src/components/modal/types.ts、popconfirm/types.ts：默认值注释改为"默认取全局语言包文案"

### Step 1 — shared locale 模块（新建）
- packages/shared/src/locale/{locale.ts, zh-CN.ts, en-US.ts, index.ts, \_\_tests\_\_/locale.test.ts}
- packages/shared/src/index.ts 增加 `export * from './locale'`

### Step 2 — 双端 hook + re-export
- packages/react/src/hooks/use-locale.ts、packages/vue/src/hooks/use-locale.ts
- packages/vue/src/index.ts、packages/react/src/index.ts 追加 re-export

### Step 3 — 双端 8 组件接入
接入模式（Modal.vue 代表）：
1. 删内联默认值：`okText = '确认'` → `okText,`
2. `const locale = useLocaleData()` + `const okLabel = computed(() => okText ?? locale.value.modal.ok)`
3. 模板 `{{ okText }}` → `{{ okLabel }}`（漏改会渲染空白，改完即跑组件测试）

| 组件 | Vue | React | 改动 |
|---|---|---|---|
| Modal | Modal.vue L13-14 | Modal.tsx L49-50 | okText/cancelText → locale.modal.ok/cancel |
| Popconfirm | Popconfirm.vue L14 | Popconfirm.tsx L32-33 | confirmText/cancelText → locale.popconfirm.* |
| Table | Table.vue L230/306/328 | Table.tsx L179/278/299 | 全选/selectRow/空态 fallback → locale.table.* |
| Pagination | Pagination.vue L69/76/112 | Pagination.tsx L73/79/121 | aria 分页/上一页/下一页 → locale.pagination.* |
| DatePicker | DatePicker.vue L115/160/166/188/207-208 | DatePicker.tsx L178/183/209/230-232 | aria + weekdays + placeholder → locale.datePicker.* |
| Skeleton | Skeleton.vue L46 | Skeleton.tsx L48 | aria 加载中 → locale.skeleton.loading |
| Breadcrumb | Breadcrumb.vue L43/47 | Breadcrumb.tsx L51/63 | aria 面包屑 → locale.breadcrumb.nav |
| Select | Select.vue L342/347/402 | Select.tsx L312/318/384-386 | 搜索 placeholder/aria + 请选择兜底 → locale.select.* |

React hooks 规则：useLocaleData 在组件顶层无条件调用，不得进条件分支（契约解析 parseReactProps 只读 `} = props;` 解构块，不受影响）。

### Step 4 — 文档站 /i18n 章节
- 新建 apps/docs/src/pages/I18nPage.vue（对齐 ThemePage.vue：工作机制说明 + API 表 + 注意事项）
- 新建 apps/docs/src/content/i18n/demos/：双端 2 组（① setLocale zh↔en 实时切换 Modal/Popconfirm/Pagination/DatePicker；② registerLocale 自定义语言包）
- src/router.ts 加 `/i18n` 路由；src/components/SideNav.vue「开始」分组加「国际化」入口
- 受影响 meta.ts 默认值列同步（modal/popconfirm/table/pagination/date-picker/select/skeleton/breadcrumb 8 份，如 modal/meta.ts okText default 改"跟随语言包"）

### Step 5 — changeset + 提交
- .changeset/ 新增 minor（locale 为新增 API，shared/core/vue/react/docs 联动）
- commit & push（直推 main）

## 验证

```bash
pnpm build                        # 先全量构建（contract-test 读 vue dist）
pnpm test                         # 全部单测（现有 936 + locale 新增）
pnpm type-check && pnpm lint
pnpm tsx scripts/contract-test.ts # Modal/Popconfirm 文案默认值行预期变为（无默认），双端一致通过
```

浏览器实测（docs dev server，先重启避免旧 dist 缓存）：/i18n 页双 tab 实测 setLocale 切换后 Modal/Popconfirm/Pagination/DatePicker 文案实时联动、registerLocale 自定义包生效、显式 prop 仍优先。

### 测试新增重点
- shared：默认 zh-CN 值 / setLocale 切换与通知 / 未注册 key 静默 / registerLocale 深合并与缓存重建 / weekdays 整组替换 / selectRow 输出（beforeEach 复位 zh-CN）
- 双端组件：Modal setLocale 后按钮文案切换 + 显式 okText 优先 + registerLocale 生效；Table selectRow 函数型 + 空态；DatePicker weekdays 切换

## 风险
- 契约测试读 vue dist：改 Vue 源码后必须先 build @xui/vue 再跑 contract-test
- SSR hydration：registerLocale 需在渲染前同构执行（文档注明）
- locale 全局单例：I18nPage 双 tab demo 相互联动属预期，demo 描述注明"全局生效"
