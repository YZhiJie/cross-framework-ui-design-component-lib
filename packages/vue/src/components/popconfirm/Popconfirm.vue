<script setup lang="ts">
import { onUnmounted, ref, useId, watchEffect } from 'vue';
import { createPopconfirmLogic } from '@xui/shared';
import type { PopconfirmProps } from '@xui/core';

const props = withDefaults(defineProps<Omit<PopconfirmProps, 'onConfirm' | 'onCancel'>>(), {
  content: undefined,
  confirmText: '确定',
  cancelText: '取消',
  placement: 'top',
  disabled: false,
});

const emit = defineEmits<{ confirm: []; cancel: [] }>();

const popperId = useId();
const rootRef = ref<HTMLElement | null>(null);

const logic = createPopconfirmLogic({
  placement: props.placement,
  disabled: props.disabled,
  onConfirm: () => emit('confirm'),
  onCancel: () => emit('cancel'),
});

const state = ref(logic.getState());

const unsubscribe = logic.subscribe((next) => {
  state.value = next;
});

// 点击外部收起（不触发确认 / 取消回调）
const handleDocMouseDown = (event: MouseEvent) => {
  const root = rootRef.value;
  if (root && !root.contains(event.target as Node)) logic.close();
};
document.addEventListener('mousedown', handleDocMouseDown);

onUnmounted(() => {
  unsubscribe();
  document.removeEventListener('mousedown', handleDocMouseDown);
});

// Props 变更同步到逻辑层（运行时禁用会收起已开气泡）
watchEffect(() => {
  logic.updateOptions({ placement: props.placement, disabled: props.disabled });
});
</script>

<template>
  <span ref="rootRef" class="xui-popconfirm" :class="className" :style="style">
    <span
      class="xui-popconfirm__trigger"
      :aria-describedby="state.open ? popperId : undefined"
      @click="logic.toggle()"
    >
      <slot />
    </span>
    <span
      v-if="state.open"
      :id="popperId"
      class="xui-popconfirm__popper"
      :class="`is-${state.placement}`"
      role="tooltip"
    >
      <span class="xui-popconfirm__content">
        <slot name="content">{{ props.content }}</slot>
      </span>
      <div class="xui-popconfirm__actions">
        <button class="xui-button xui-button--sm" type="button" @click="logic.cancel()">
          {{ props.cancelText }}
        </button>
        <button
          class="xui-button xui-button--primary xui-button--sm"
          type="button"
          @click="logic.confirm()"
        >
          {{ props.confirmText }}
        </button>
      </div>
      <span class="xui-popconfirm__arrow" aria-hidden="true" />
    </span>
  </span>
</template>
<!-- 组件样式统一维护在 packages/styles/src/components.scss（单一来源），SFC 不再内联样式 -->
