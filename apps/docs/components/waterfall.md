---
title: 瀑布流 Waterfall
---

# 瀑布流 <span class="page-head__en">Waterfall</span> <span class="doc-tag">数据展示</span>

基于最短列贪心分配的多列瀑布流布局：支持响应式断点自适应列数、图片/内容加载后自动触发重排、高度缓存避免重复测量，列数切换时零成本复用已测量高度。

## 功能特性

- 最短列贪心分配 + 并列 round-robin，初始未测量场景均匀分布
- 响应式断点（breakpoints）自动跟随容器尺寸变化切换列数
- 高度缓存跨列数切换复用：切换 4→2 列时不重新测量 DOM
- 图片 / 内容异步加载完成后 ResizeObserver 自动触发重排
- rAF 合并调度：一帧内多次变化只执行一次重排，避免抖动
- CSS 变量 gutter 可覆盖间距（--xui-waterfall-gutter）

### 使用场景

- 图片画廊 / 商品卡片列表（高度不一的混合内容）
- 搜索结果页：按最短列自动对齐，视觉紧凑
- 自适应仪表盘：窗口缩放 → 自动调整列数

## 代码演示

每个 demo 均可切换 Vue / React 标签页实时交互，并可展开查看对应框架源码。

### 基础用法

固定 3 列、间距 16px，传入不等高数据演示最短列贪心分配；点击触发 itemClick 事件。

<ComponentDemo slug="waterfall" demo-id="basic" />

### 响应式断点

配置 breakpoints 后，容器宽度变化时自动切换列数（&lt;600px 1 列 / 600-1000px 2 列 / &gt;1000px 3 列），高度缓存复用零成本。

<ComponentDemo slug="waterfall" demo-id="responsive" />

### 服务端加载 + 无限滚动

模拟分页接口（setTimeout + picsum.photos 随机图），滚动触底触发 `loadMore` 拉取下一页；图片 `onLoad` 后 ResizeObserver 自动重排；配合 `loading` / `finished` 守卫避免重复触发。

<ComponentDemo slug="waterfall" demo-id="server-load" />

## API 文档

`@xui-design/core` ComponentSpec · 唯一契约基准，双端一致

### Props

<ComponentApi slug="waterfall" kind="props" />

### Events / 回调

<ComponentApi slug="waterfall" kind="events" />

### Slots / 渲染回调

<ComponentApi slug="waterfall" kind="slots" />

### 契约类型

**WaterfallItem**

```ts
type WaterfallItem = Record<string, unknown>;
```

瀑布流条目类型

**WaterfallBreakpoint**

```ts
type WaterfallBreakpoint = {
  minWidth: number;  // 视口最小宽度（px）
  columns: number;   // 该宽度下的列数
};
```

响应式断点

**WaterfallLayoutPayload**

```ts
type WaterfallLayoutPayload = {
  columnCount: number;   // 当前列数
  columnHeights: number[];  // 每列累计高度（px）
};
```

布局变更载荷

## 注意事项

- 高度缓存（Map&lt;key, number&gt;）在逻辑层维护，列数变化时直接复用，零 DOM 测量开销。
- ResizeObserver 全局监听 item 高度变化，图片 onLoad 后自动触发 updateItemHeight → 重排。
- jsdom / 旧环境无 ResizeObserver 时降级为首次同步测量，核心布局逻辑不受影响。
- renderItem 未提供时渲染 xui-waterfall__item-placeholder 占位，业务方应通过 renderItem / #item slot 填充实际内容。

## 无障碍

- 根节点为语义化容器，条目点击时使用原生 div onClick；若需按钮可访问性建议在 slot 内容里自行封装 button 元素。
