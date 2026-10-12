# Switch 组件双态文本宽度自适应重构

## Context

Switch 组件设置 `checkedText` / `uncheckedText` 时，轨道使用固定宽度（md=56px, sm=44px），文本通过 `max-width` + `text-overflow: ellipsis` 截断。当文本超过 2-3 个字（如"启用超长文本展示"）时被截断为"启..."，用户体验差。

用户要求：设置显示文本时，轨道宽度基于文本宽度自适应，不再截断。

## 方案

使用 CSS Grid 重叠技术：两个文本（checked/unchecked）置于同一 grid cell（`grid-area: 1/1`），grid 列宽自动取较宽文本。不活动的文本用 `visibility: hidden`（保持占位，避免切换时宽度抖动）。滑块在 has-text 模式改为 `position: absolute` + `transition: left`，替代原有的 `transform: translateX` 固定位移。

### 无文本模式（不变）
- 轨道固定宽度 40px(md)/28px(sm)
- 滑块 `transform: translateX(20px)` / `translateX(12px)`

### 有文本模式（重构）
- 轨道 `width: auto` + `min-width: 56px`(md) / `44px`(sm)
- 新增 `.xui-switch__text-wrap`：`display: inline-grid; grid-template-columns: max-content`，内含两个文本重叠
- 文本 `grid-area: 1/1`，checked 文本 `justify-self: start`，unchecked 文本 `justify-self: end`
- text-wrap `padding: 0 20px`(md) / `0 16px`(sm) 为滑块预留两侧空间
- 滑块 `position: absolute; top: 2px; left: 2px`，checked 时 `left: calc(100% - thumb - 2px)`
- 滑块 `transition: left 0.2s`，`transform: none` 覆盖无文本模式的 translateX

## 修改文件

### 1. CSS：`packages/styles/src/components.scss`（L1886-L2032 switch 区段）
- `.xui-switch--has-text .xui-switch__core`：`width: 56px` → `width: auto; min-width: 56px`
- `.xui-switch--sm.xui-switch--has-text .xui-switch__core`：`width: 44px` → `width: auto; min-width: 44px`
- 新增 `.xui-switch__text-wrap`：grid 布局 + padding
- 新增 `.xui-switch--sm .xui-switch__text-wrap`：sm padding
- 重写 `.xui-switch__text`：移除 `position: absolute / max-width / overflow / text-overflow`，改为 `grid-area: 1/1; position: static`
- `.xui-switch__text--checked`：`left: 8px` → `justify-self: start; visibility: hidden`
- `.xui-switch__text--unchecked`：`right: 8px` → `justify-self: end; visibility: visible`
- 新增 `.is-checked .xui-switch__text--checked { visibility: visible }` 和 `.is-checked .xui-switch__text--unchecked { visibility: hidden }`
- 移除 `.xui-switch--sm .xui-switch__text { max-width: 20px }`
- has-text 滑块规则：`translateX(36px)` → `position: absolute; left: calc(100% - 16px - 2px); transform: none`
- sm has-text 滑块规则：`translateX(28px)` → `left: calc(100% - 12px - 2px); transform: none`

### 2. Vue：`packages/vue/src/components/switch/Switch.vue`
- 模板：将 v-if/v-else-if 单文本渲染改为 text-wrap 包裹双文本（均常驻 DOM，visibility 由 CSS 控制）
- 只渲染 truthy 的文本（空串不渲染对应元素）

### 3. React：`packages/react/src/components/switch/Switch.tsx`
- 同 Vue：text-wrap 包裹双文本

### 4. 类型：`packages/core/src/components/switch/types.ts`
- `checkedText` / `uncheckedText` 的 JSDoc：移除"超长自动截断"，改为"轨道宽度自适应文本"

### 5. 文档：`apps/docs/src/content/switch/meta.ts`
- notes 中移除文本截断相关说明，改为自适应宽度说明

### 6. 测试更新

**Vue `packages/vue/src/components/switch/__tests__/Switch.test.ts`：**

L75-90 "双态文本" 测试：
- 旧：`wrapper.find('.xui-switch__text')` 找到唯一的文本元素
- 新：分开查找 `.xui-switch__text--checked` 和 `.xui-switch__text--unchecked`，分别断言内容

L103-105 "仅提供 checkedText" 测试：
- 旧：`expect(only.find('.xui-switch__text').exists()).toBe(false)` — 关闭态无文本节点
- 新：`expect(only.find('.xui-switch__text--checked').exists()).toBe(true)` — checked 文本常驻 DOM（visibility 由 CSS 控制）

**React `packages/react/src/components/switch/__tests__/Switch.test.tsx`：**

L82-96 "双态文本" 测试：同 Vue 更新
L109-111 "仅提供 checkedText" 测试：同 Vue 更新

## 验证
1. `pnpm --filter @xui/vue test` + `pnpm --filter @xui/react test` — 单测通过
2. `pnpm --filter @xui/styles lint` — stylelint 无报错（注意 no-descending-specificity 规则）
3. `pnpm --filter @xui/core test` — 契约测试通过（不涉及 DOM 结构变更）
4. 浏览器访问 docs 站 `/components/switch` — "双态文本"demo 中长文本完整显示，切换时滑块平滑滑动，无宽度抖动
