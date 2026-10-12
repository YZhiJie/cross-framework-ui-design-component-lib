<script setup lang="ts">
import { ref } from 'vue';
import { Tooltip, Popconfirm, Button } from '@xui-design/vue';
import { isZh } from '../../../i18n';

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
      <Button type="primary" @click="scrollToTopEdge">
        {{ isZh() ? '滚动到视口顶部' : 'Scroll to viewport top' }}
      </Button>
      <Button @click="scrollToBottomEdge">
        {{ isZh() ? '滚动到视口底部' : 'Scroll to viewport bottom' }}
      </Button>
    </div>
    <p style="color: var(--docs-text-secondary, #888); font-size: 13px; margin: 8px 0 16px">
      {{
        isZh()
          ? '点击按钮将触发元素定位到视口边缘，再悬停 / 点击组件观察气泡自动翻转。'
          : 'Click a button to position the element at the viewport edge, then hover / click the component to see the popover auto-flip.'
      }}
    </p>
    <div ref="topAnchor" class="demo-row" style="padding: 8px 0">
      <Tooltip
        :content="isZh() ? '上方空间不足 → 翻转到下方' : 'Not enough space above → flip down'"
        placement="top"
      >
        <Button>{{ isZh() ? 'Tooltip top（近顶部）' : 'Tooltip top (near top)' }}</Button>
      </Tooltip>
      <Popconfirm
        :content="isZh() ? '确认删除此条记录？' : 'Confirm delete this record?'"
        placement="top"
        :confirm-text="isZh() ? '删除' : 'Delete'"
        :cancel-text="isZh() ? '取消' : 'Cancel'"
      >
        <Button type="danger">Popconfirm top</Button>
      </Popconfirm>
    </div>
    <div style="height: 50vh" />
    <div ref="bottomAnchor" class="demo-row" style="padding: 8px 0">
      <Tooltip
        :content="isZh() ? '下方空间不足 → 翻转到上方' : 'Not enough space below → flip up'"
        placement="bottom"
      >
        <Button>{{ isZh() ? 'Tooltip bottom（近底部）' : 'Tooltip bottom (near bottom)' }}</Button>
      </Tooltip>
      <Popconfirm
        :content="isZh() ? '底部确认提交？' : 'Confirm submit at bottom?'"
        placement="bottom"
        :confirm-text="isZh() ? '提交' : 'Submit'"
        :cancel-text="isZh() ? '取消' : 'Cancel'"
      >
        <Button type="primary">Popconfirm bottom</Button>
      </Popconfirm>
    </div>
  </div>
</template>
