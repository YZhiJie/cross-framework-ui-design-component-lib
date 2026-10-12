<script setup lang="ts">
import { ref } from 'vue';
import { Tooltip, Popconfirm, Button } from '@xui-design/vue';

const topAnchor = ref<HTMLElement>();
const bottomAnchor = ref<HTMLElement>();

const scrollToTopEdge = () => {
  const el = topAnchor.value;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  window.scrollTo({ top: window.scrollY + rect.top - 12, behavior: 'smooth' });
};

const scrollToBottomEdge = () => {
  const el = bottomAnchor.value;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  window.scrollTo({
    top: window.scrollY + rect.top - window.innerHeight + rect.height + 12,
    behavior: 'smooth',
  });
};
</script>

<template>
  <div class="demo-column">
    <div class="demo-row">
      <Button type="primary" @click="scrollToTopEdge">滚动到视口顶部</Button>
      <Button @click="scrollToBottomEdge">滚动到视口底部</Button>
    </div>
    <p style="color: var(--docs-text-secondary, #888); font-size: 13px; margin: 8px 0 16px">
      点击按钮将触发元素定位到视口边缘，再悬停 / 点击组件观察气泡自动翻转。
    </p>
    <div ref="topAnchor" class="demo-row" style="padding: 8px 0">
      <Tooltip content="上方空间不足 → 翻转到下方" placement="top">
        <Button>Tooltip top（近顶部）</Button>
      </Tooltip>
      <Popconfirm
        content="确认删除此条记录？"
        placement="top"
        confirm-text="删除"
        cancel-text="取消"
      >
        <Button type="danger">Popconfirm top</Button>
      </Popconfirm>
    </div>
    <div style="height: 50vh" />
    <div ref="bottomAnchor" class="demo-row" style="padding: 8px 0">
      <Tooltip content="下方空间不足 → 翻转到上方" placement="bottom">
        <Button>Tooltip bottom（近底部）</Button>
      </Tooltip>
      <Popconfirm
        content="底部确认提交？"
        placement="bottom"
        confirm-text="提交"
        cancel-text="取消"
      >
        <Button type="primary">Popconfirm bottom</Button>
      </Popconfirm>
    </div>
  </div>
</template>
