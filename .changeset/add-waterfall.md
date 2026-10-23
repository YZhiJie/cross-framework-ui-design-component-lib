---
"@xui-design/shared": minor
"@xui-design/core": minor
"@xui-design/vue": minor
"@xui-design/react": minor
"@xui-design/styles": minor
---

feat: 新增 Waterfall 瀑布流组件

基于最短列贪心分配的多列瀑布流布局：
- 支持响应式断点（breakpoints），容器尺寸变化时 ResizeObserver 自动切换列数
- 高度缓存跨列数切换复用：切换 4→2 列时零成本复用已测量高度
- 图片/内容异步加载完成后自动触发重排
- rAF 合并调度，一帧内多次变化只执行一次重排
- Vue #item 作用域 slot（item + index）/ React renderItem 回调双端对齐
