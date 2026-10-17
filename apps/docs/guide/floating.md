# 浮层视口避让 <span class="page-head__en">Floating Positioning</span> <span class="doc-tag">指南</span>

Tooltip / Popconfirm / Select 等浮层组件双端共用 @xui-design/shared/floating 的纯逻辑避让模块：首选方位空间不足时自动翻转（flip），交叉轴溢出视口时自动钳制（shift），滚动与窗口 resize 时经 rAF 合并实时重算。

## 工作机制

- **flip 方位翻转**：计算首选方位与对侧的可用空间（如 `spaceAbove = trigger.top - viewport.top`），首选方位放不下且对侧更充足时翻转；两侧都不足时维持首选方位，避免抖动。
- **shift 偏移钳制**：居中对齐后向视口安全区钳制（默认 `≥ 8px`），交叉轴溢出时保持安全区不贴边 / 不裁切。
- **scroll / resize 实时重算**：滚动事件以 capture 方式监听 `window`（祖先容器滚动也能收到），回调经 `requestAnimationFrame` 合并，一帧内最多执行一次。
- **框架无关**：`resolveFloatingPosition` 是纯函数，不读 DOM / 不写样式；DOM 测量与样式应用由双端适配层桥接，逻辑层不重复实现。
- **SSR 安全降级**：无 `window` 时 `getViewport` 返回零矩形、`bindViewportUpdate` 返回空函数，不抛错。

## 代码演示

每个 demo 均可切换 Vue / React 标签页实时交互，并可展开查看对应框架源码。

### 方位翻转（flip）

首选方位空间不足且对侧更充足时自动翻转：placement="top" 在视口顶部翻转到 bottom，placement="bottom" 在视口底部翻转到 top。

<GuideDemo guide="floating" demo-id="flip" />

### 三组件共用避让逻辑

Tooltip / Popconfirm / Select 双端共用 @xui-design/shared/floating 的翻转与钳制算法，不重复实现。

<GuideDemo guide="floating" demo-id="multi" />

## API

浮层避让 API 由 `@xui-design/shared/floating` 提供（框架无关纯逻辑），Tooltip / Popconfirm / Select 双端适配层桥接调用，不直接暴露给应用层。

### 命令式方法

<GuideApi guide="floating" kind="methods" />

### 契约类型

**FloatingPlacement**

```ts
type FloatingPlacement = 'top' | 'bottom' | 'left' | 'right';
```

四方位联合类型，与 core 契约的 placement 对齐。

**FloatingRect**

```ts
type FloatingRect = {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
};
```

视口坐标矩形，可直接传 getBoundingClientRect() 的结果。

**ResolveFloatingOptions**

```ts
type ResolveFloatingOptions = {
  placement: FloatingPlacement;
  gap?: number;        // 触发器与浮层间距，默认 8
  viewportPadding?: number; // 视口边缘安全区，默认 8
};
```

resolveFloatingPosition 的入参选项。

**FloatingPosition**

```ts
type FloatingPosition = {
  placement: FloatingPlacement; // 实际方位（可能已翻转）
  shift: number;                // 交叉轴平移量（px）
};
```

避让计算结果：top/bottom 方位 shift 为水平位移（正向右移），left/right 方位为垂直位移（正向下移）。

## 注意事项

- CSS 包裹定位前提：浮层已通过 CSS 包裹方案随文档流跟随触发器，本模块仅输出避让修正；适配层必须先保证基础定位（居中 + gap）正确，再叠加 shift。
- 翻转避免抖动：只在首选方位空间不足且对侧更充足时才翻转，两侧都不足时维持首选方位（由 shift 钳制兜底），不在边界附近来回翻转。
- scroll 必须用 capture：滚动事件不冒泡，祖先容器滚动只能在捕获阶段于 window 收到；bindViewportUpdate 已用 capture，适配层不要改回冒泡监听。
- 组件卸载必须解绑：bindViewportUpdate 返回的解绑函数须在 onBeforeUnmount / useEffect cleanup 中调用，否则监听泄漏、回调引用已卸载 DOM。
- overflow: hidden 祖先仍可能裁剪面板：气泡采用 CSS 包裹定位而非 portal，父容器存在 overflow 裁剪时需在布局层面规避。
