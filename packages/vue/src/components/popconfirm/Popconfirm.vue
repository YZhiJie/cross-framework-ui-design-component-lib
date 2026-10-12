<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, useId, watch, watchEffect } from 'vue';
import {
  bindViewportUpdate,
  createPopconfirmLogic,
  getViewport,
  resolveFloatingPosition,
} from '@xui-design/shared';
import type { FloatingPlacement } from '@xui-design/shared';
import { useLocaleData } from '../../hooks/use-locale';
import type { PopconfirmProps } from '@xui-design/core';

const props = withDefaults(defineProps<Omit<PopconfirmProps, 'onConfirm' | 'onCancel'>>(), {
  content: undefined,
  placement: 'top',
  disabled: false,
});

const emit = defineEmits<{ confirm: []; cancel: [] }>();

// 未提供 confirmText / cancelText 时取全局语言包（setLocale / registerLocale 后响应式更新）
const locale = useLocaleData();
const confirmLabel = computed(() => props.confirmText ?? locale.value.popconfirm.confirm);
const cancelLabel = computed(() => props.cancelText ?? locale.value.popconfirm.cancel);

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

// 视口避让：实际方位（可能翻转）与交叉轴 shift（px）
const triggerRef = ref<HTMLElement | null>(null);
const popperRef = ref<HTMLElement | null>(null);
const resolvedPlacement = ref<FloatingPlacement>(props.placement);
const shiftPx = ref(0);
let unbindViewport: (() => void) | null = null;

function updatePosition() {
  const triggerEl = triggerRef.value;
  const popperEl = popperRef.value;
  if (!triggerEl || !popperEl) return;
  const popperRect = popperEl.getBoundingClientRect();
  // 零尺寸表示未完成布局（jsdom 环境恒为 0），保持首选方位避免误翻转
  if (popperRect.width === 0 && popperRect.height === 0) return;
  const { placement, shift } = resolveFloatingPosition(
    triggerEl.getBoundingClientRect(),
    popperRect,
    getViewport(),
    { placement: state.value.placement, gap: 8 },
  );
  resolvedPlacement.value = placement;
  shiftPx.value = shift;
}

watch(
  () => state.value.open,
  (open) => {
    if (open) {
      resolvedPlacement.value = state.value.placement;
      shiftPx.value = 0;
      nextTick(updatePosition);
      unbindViewport?.();
      unbindViewport = bindViewportUpdate(updatePosition);
    } else {
      unbindViewport?.();
      unbindViewport = null;
    }
  },
);

// 打开期间 placement prop（经 logic state 同步）变化需重新测量
watch(
  () => state.value.placement,
  (placement) => {
    if (state.value.open) {
      resolvedPlacement.value = placement;
      shiftPx.value = 0;
      nextTick(updatePosition);
    }
  },
);

onUnmounted(() => {
  unsubscribe();
  unbindViewport?.();
  document.removeEventListener('mousedown', handleDocMouseDown);
});

// Props 变更同步到逻辑层（运行时禁用会收起已开气泡）
watchEffect(() => {
  logic.updateOptions({ placement: props.placement, disabled: props.disabled });
});

// 暴露命令式 show / hide / toggle（与 React 适配层的 PopconfirmRef 对齐）
const show = () => {
  if (!state.value.open) logic.toggle();
};

const hide = () => {
  logic.close();
};

const toggle = () => {
  logic.toggle();
};

defineExpose({ show, hide, toggle });
</script>

<template>
  <span ref="rootRef" class="xui-popconfirm" :class="className" :style="style">
    <span
      ref="triggerRef"
      class="xui-popconfirm__trigger"
      :aria-describedby="state.open ? popperId : undefined"
      @click="logic.toggle()"
    >
      <slot />
      <span
        v-if="state.open"
        ref="popperRef"
        :id="popperId"
        class="xui-popconfirm__popper"
        :class="`is-${resolvedPlacement}`"
        :style="
          resolvedPlacement === 'top' || resolvedPlacement === 'bottom'
            ? { marginLeft: `${shiftPx}px` }
            : { marginTop: `${shiftPx}px` }
        "
        role="tooltip"
        @click.stop
      >
        <span class="xui-popconfirm__content">
          <slot name="content">{{ props.content }}</slot>
        </span>
        <div class="xui-popconfirm__actions">
          <button class="xui-button xui-button--sm" type="button" @click="logic.cancel()">
            {{ cancelLabel }}
          </button>
          <button
            class="xui-button xui-button--primary xui-button--sm"
            type="button"
            @click="logic.confirm()"
          >
            {{ confirmLabel }}
          </button>
        </div>
        <span class="xui-popconfirm__arrow" aria-hidden="true" />
      </span>
    </span>
  </span>
</template>
<!-- 组件样式统一维护在 packages/styles/src/components.scss（单一来源），SFC 不再内联样式 -->
