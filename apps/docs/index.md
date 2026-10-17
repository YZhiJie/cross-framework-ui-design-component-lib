---
layout: home

hero:
  name: XUI
  text: 跨框架组件库
  tagline: 一套核心契约，Vue 3 与 React 19 双端同构的通用组件库
  actions:
    - theme: brand
      text: 组件文档
      link: /components/button
    - theme: alt
      text: 主题定制
      link: /guide/theme

features:
  - title: 单一契约 @xui-design/core
    details: ComponentSpec 是双端唯一合同，Props / Events / Slots 由契约层定义，适配层不得新增分歧。
  - title: Vue / React 双端同构
    details: 同名组件、同 API 口径：Vue 事件 ↔ React 回调、Vue 插槽 ↔ React renderXxx 一一映射。
  - title: 样式单一来源
    details: '@xui-design/styles 统一输出 BEM 类名与 CSS 变量主题，双端零样式漂移。'
  - title: 核心逻辑单份实现
    details: '@xui-design/shared 承载状态与交互逻辑，双端只做薄适配；TypeScript 严格模式全量类型贯通。'
---

<ComponentOverview />
