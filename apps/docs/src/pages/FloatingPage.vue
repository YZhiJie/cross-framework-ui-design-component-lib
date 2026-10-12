<script setup lang="ts">
/**
 * 浮层视口避让指南页：方位翻转 / 偏移钳制 / 滚动 resize 实时重算
 * 独立于组件文档页，走 /floating 路由
 */
import DemoBlock from '../components/DemoBlock.vue';
import ApiSection from '../components/ApiSection.vue';

import FlipVue from '../content/floating/demos/flip.vue';
import FlipReact from '../content/floating/demos/flip';
import MultiVue from '../content/floating/demos/multi.vue';
import MultiReact from '../content/floating/demos/multi';

import flipVueSource from '../content/floating/demos/flip.vue?raw';
import flipReactSource from '../content/floating/demos/flip.tsx?raw';
import multiVueSource from '../content/floating/demos/multi.vue?raw';
import multiReactSource from '../content/floating/demos/multi.tsx?raw';

const demos = [
  {
    id: 'flip',
    title: '方位翻转（flip）',
    description:
      '首选方位空间不足且对侧更充足时自动翻转：placement="top" 在视口顶部翻转到 bottom，placement="bottom" 在视口底部翻转到 top。',
    vueComponent: FlipVue,
    reactComponent: FlipReact,
    vueSource: flipVueSource,
    reactSource: flipReactSource,
  },
  {
    id: 'multi',
    title: '三组件共用避让逻辑',
    description:
      'Tooltip / Popconfirm / Select 双端共用 @xui/shared/floating 的翻转与钳制算法，不重复实现。',
    vueComponent: MultiVue,
    reactComponent: MultiReact,
    vueSource: multiVueSource,
    reactSource: multiReactSource,
  },
];

const api = {
  methods: [
    {
      name: 'resolveFloatingPosition',
      signature:
        '(trigger: FloatingRect, popper: FloatingRect, viewport: FloatingViewport, options: ResolveFloatingOptions) => FloatingPosition',
      description:
        '纯函数：输入触发器 / 浮层 / 视口的坐标矩形，输出最终方位（可能已翻转）与交叉轴平移量；不读 DOM、不写样式，便于单测。',
    },
    {
      name: 'getViewport',
      signature: '() => FloatingViewport',
      description:
        '获取当前视口边界（整页可视区域）；SSR / 无 window 环境返回零矩形（计算结果等价于不翻转不偏移）。',
    },
    {
      name: 'bindViewportUpdate',
      signature: '(callback: () => void) => () => void',
      description:
        '订阅视口变化（scroll capture + resize），回调经 rAF 合并（一帧最多一次）；返回解绑函数，组件卸载时调用即可彻底清理。',
    },
  ],
  types: [
    {
      name: 'FloatingPlacement',
      definition: `type FloatingPlacement = 'top' | 'bottom' | 'left' | 'right';`,
      description: '四方位联合类型，与 core 契约的 placement 对齐。',
    },
    {
      name: 'FloatingRect',
      definition: `type FloatingRect = {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
};`,
      description: '视口坐标矩形，可直接传 getBoundingClientRect() 的结果。',
    },
    {
      name: 'ResolveFloatingOptions',
      definition: `type ResolveFloatingOptions = {
  placement: FloatingPlacement;
  gap?: number;        // 触发器与浮层间距，默认 8
  viewportPadding?: number; // 视口边缘安全区，默认 8
};`,
      description: 'resolveFloatingPosition 的入参选项。',
    },
    {
      name: 'FloatingPosition',
      definition: `type FloatingPosition = {
  placement: FloatingPlacement; // 实际方位（可能已翻转）
  shift: number;                // 交叉轴平移量（px）
};`,
      description: '避让计算结果：top/bottom 方位 shift 为水平位移（正向右移），left/right 方位为垂直位移（正向下移）。',
    },
  ],
};

const notes = [
  'CSS 包裹定位前提：浮层已通过 CSS 包裹方案随文档流跟随触发器，本模块仅输出避让修正；适配层必须先保证基础定位（居中 + gap）正确，再叠加 shift。',
  '翻转避免抖动：只在首选方位空间不足且对侧更充足时才翻转，两侧都不足时维持首选方位（由 shift 钳制兜底），不在边界附近来回翻转。',
  'scroll 必须用 capture：滚动事件不冒泡，祖先容器滚动只能在捕获阶段于 window 收到；bindViewportUpdate 已用 capture，适配层不要改回冒泡监听。',
  '组件卸载必须解绑：bindViewportUpdate 返回的解绑函数须在 onBeforeUnmount / useEffect cleanup 中调用，否则监听泄漏、回调引用已卸载 DOM。',
  'overflow: hidden 祖先仍可能裁剪面板：气泡采用 CSS 包裹定位而非 portal，父容器存在 overflow 裁剪时需在布局层面规避。',
];
</script>

<template>
  <div class="docs-content">
    <header class="page-head">
      <h1 class="page-head__title">
        浮层视口避让
        <span class="page-head__en">Floating</span>
        <span class="doc-tag">指南</span>
      </h1>
      <p class="page-head__summary">
        Tooltip / Popconfirm / Select 等浮层组件双端共用 @xui/shared/floating 的纯逻辑避让模块：
        首选方位空间不足时自动翻转（flip），交叉轴溢出视口时自动钳制（shift），
        滚动与窗口 resize 时经 rAF 合并实时重算。
      </p>
    </header>

    <section>
      <h2 class="docs-section-title">工作机制</h2>
      <ul class="docs-list">
        <li>
          <strong>flip 方位翻转</strong>：计算首选方位与对侧的可用空间（如
          <code class="inline-code">spaceAbove = trigger.top - viewport.top</code>），
          首选方位放不下且对侧更充足时翻转；两侧都不足时维持首选方位，避免抖动。
        </li>
        <li>
          <strong>shift 偏移钳制</strong>：居中对齐后向视口安全区钳制（默认
          <code class="inline-code">≥ 8px</code>），交叉轴溢出时保持安全区不贴边 / 不裁切。
        </li>
        <li>
          <strong>scroll / resize 实时重算</strong>：滚动事件以 capture 方式监听
          <code class="inline-code">window</code>（祖先容器滚动也能收到），回调经
          <code class="inline-code">requestAnimationFrame</code> 合并，一帧内最多执行一次。
        </li>
        <li>
          <strong>框架无关</strong>：<code class="inline-code">resolveFloatingPosition</code>
          是纯函数，不读 DOM / 不写样式；DOM 测量与样式应用由双端适配层桥接，逻辑层不重复实现。
        </li>
        <li>
          <strong>SSR 安全降级</strong>：无 <code class="inline-code">window</code> 时
          <code class="inline-code">getViewport</code> 返回零矩形、
          <code class="inline-code">bindViewportUpdate</code> 返回空函数，不抛错。
        </li>
      </ul>
    </section>

    <section>
      <h2 class="docs-section-title">代码演示</h2>
      <p style="margin-bottom: 8px; color: var(--docs-text-secondary); font-size: 13px">
        每个 demo 均可切换 Vue / React 标签页实时交互，并可展开查看对应框架源码。
      </p>
      <DemoBlock v-for="demo in demos" :key="demo.id" :demo="demo" />
    </section>

    <section>
      <h2 class="docs-section-title">API 文档</h2>
      <p style="margin-bottom: 16px; color: var(--docs-text-secondary); font-size: 13px">
        浮层避让 API 由 <code class="inline-code">@xui/shared/floating</code> 提供（框架无关纯逻辑），
        Tooltip / Popconfirm / Select 双端适配层桥接调用，不直接暴露给应用层。
      </p>
      <ApiSection :api="api" />
    </section>

    <section>
      <h2 class="docs-section-title">注意事项</h2>
      <ul class="docs-list">
        <li v-for="note in notes" :key="note">{{ note }}</li>
      </ul>
    </section>
  </div>
</template>
