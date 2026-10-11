<script setup lang="ts">
import { onUnmounted, ref } from 'vue';
import { icons } from '@xui/icons';
import type { MessageType } from '@xui/core';
import type { MessageLogicInstance } from '@xui/shared';

// Message 全局宿主组件：由 manager.ts 挂载到 document.body，
// 订阅单例管理器状态并渲染消息队列（不作为公共组件导出）。
const props = defineProps<{ manager: MessageLogicInstance }>();

const state = ref(props.manager.getState());

const unsubscribe = props.manager.subscribe((next) => {
  state.value = next;
});

onUnmounted(() => {
  unsubscribe();
});

const TYPE_ICONS: Record<MessageType, string> = {
  info: icons.info,
  success: icons.success,
  warning: icons.warning,
  error: icons.error,
};
</script>

<template>
  <div class="xui-message" aria-live="polite">
    <div
      v-for="item in state.items"
      :key="item.id"
      :class="['xui-message__item', `xui-message__item--${item.type}`]"
    >
      <svg
        class="xui-message__icon"
        viewBox="0 0 24 24"
        width="15"
        height="15"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        v-html="item.icon ?? TYPE_ICONS[item.type]"
      />
      <span class="xui-message__content">{{ item.content }}</span>
      <button
        v-if="item.closable"
        type="button"
        class="xui-message__close"
        aria-label="close"
        @click="props.manager.close(item.id)"
      >
        <svg
          viewBox="0 0 24 24"
          width="12"
          height="12"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          aria-hidden="true"
          v-html="icons.close"
        />
      </button>
    </div>
  </div>
</template>

<!-- 组件样式统一维护在 packages/styles/src/components.scss（单一来源），SFC 不再内联样式 -->
