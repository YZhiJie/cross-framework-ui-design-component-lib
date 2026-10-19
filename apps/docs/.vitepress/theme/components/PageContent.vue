<script setup lang="ts">
/**
 * 页面内容过渡层：覆盖 VitePress 全局 Content 组件
 *
 * Content 以 relativePath 为 key，路由切换时旧页淡出、新页淡入；
 * mode="out-in" 保证过渡期间无双页重叠抖动。
 *
 * 连带影响：out-in 使新页面 DOM 晚于 VP 解析锚点的时机才挂载——router.js 在跨页
 * 跳转的 nextTick 里用 getElementById 取锚点，取不到就退回 window.scrollTo(0, 0)，
 * 于是从搜索结果跳到其他页面的章节时不会滚动到锚点。这里在过渡结束后按 VP 相同的
 * 公式补一次定位；偏移量复用 VP 公开导出的 getScrollOffset，落点与页内锚点点击一致。
 */
import { Content, getScrollOffset, useData } from 'vitepress';

const { page } = useData();

function scrollToHash() {
  const hash = window.location.hash;
  if (!hash) return;
  // 与 VP 的优先序一致：历史回退时若该条记录存有滚动位置，优先还原位置而非锚点
  //（router.js 用 `hash && !scrollPosition` 判断，故此处同样放行 scrollPosition 为 0）
  if (history.state?.scrollPosition) return;
  let target: HTMLElement | null = null;
  try {
    target = document.getElementById(decodeURIComponent(hash).slice(1));
  } catch {
    return;
  }
  if (!target) return;
  const targetPadding = parseInt(getComputedStyle(target).paddingTop, 10);
  const targetTop =
    window.scrollY + target.getBoundingClientRect().top - getScrollOffset() + targetPadding;
  window.scrollTo(0, targetTop);
}
</script>

<template>
  <Transition name="xui-page" mode="out-in" @after-enter="scrollToHash">
    <Content :key="page.relativePath" />
  </Transition>
</template>
