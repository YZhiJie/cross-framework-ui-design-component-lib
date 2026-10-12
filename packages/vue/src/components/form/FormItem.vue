<script setup lang="ts">
/**
 * FormItem - Vue 3 适配层
 *
 * 通过 inject 获取 Form context，注册字段（name + rules）。
 * 使用 cloneVNode 向子组件注入 value / onUpdate:value / onChange / onBlur / disabled，
 * 实现自动双向绑定——用户无需手动绑定 value 与事件。
 * 渲染标签、校验错误、额外提示。
 */
import {
  Comment,
  cloneVNode,
  computed,
  inject,
  onBeforeUnmount,
  onMounted,
  useSlots,
  watch,
} from 'vue';
import type { VNode } from 'vue';
import type { FormItemProps, FormItemRef } from '@xui-design/core';
import type { ValidationRule, ValidationTrigger } from '@xui-design/shared';
import type { FormContext } from './Form.vue';
import { hasRequiredRule } from '@xui-design/shared';

const props = withDefaults(
  defineProps<
    Omit<FormItemProps, 'rules' | 'name'> & {
      name?: string;
      rules?: ValidationRule[];
    }
  >(),
  {
    required: false,
    validateFirst: false,
    hidden: false,
    labelAlign: 'right',
  },
);

const emit = defineEmits<{
  change: [value: unknown];
  blur: [value: unknown];
}>();

const slots = useSlots();

const formCtx = inject<ReturnType<typeof computed<FormContext>> | FormContext | undefined>(
  'xuiForm',
  undefined,
);

/** 将可能被 Ref 包裹的 context 展开为普通值 */
const ctx = computed<FormContext | undefined>(() => {
  if (!formCtx) return undefined;
  // provide 传入的是 ComputedRef<FormContext>，inject 返回其 .value
  const raw = formCtx as unknown;
  if (
    raw &&
    typeof raw === 'object' &&
    'value' in raw &&
    typeof (raw as { value: unknown }).value === 'object'
  ) {
    return (raw as { value: FormContext }).value;
  }
  return raw as FormContext;
});

if (!ctx.value) {
  // 没有外层 Form 时 FormItem 仍可工作（仅做标签与布局，不参与校验）
}

/** 本字段的规则：FormItem 级 rules */
const itemRules = computed<ValidationRule[]>(() => props.rules ?? []);

/** 是否必填（显式 required 或 rules 含 required 规则） */
const isRequired = computed(() => props.required || hasRequiredRule(itemRules.value));

/** 字段值（从响应式 state 快照读取，确保外部 setFieldsValue 也能联动） */
const fieldValue = computed(() => {
  if (props.name && ctx.value) {
    return ctx.value.state.values[props.name];
  }
  return undefined;
});

/** 字段错误（从响应式 state 快照读取，getState() 非响应式会导致错误永不刷新） */
const fieldErrors = computed<string[]>(() => {
  if (!props.name || !ctx.value) return [];
  return ctx.value.state.errors[props.name] ?? [];
});

/** 是否校验中 */
const fieldValidating = computed(() => {
  if (!ctx.value) return false;
  return ctx.value.state.validating;
});

/** 禁用状态（合并 Form 级与 FormItem 无独立 disabled） */
const isDisabled = computed(() => ctx.value?.disabled ?? false);
const isReadonly = computed(() => ctx.value?.readonly ?? false);

/** 标签宽度样式 */
const labelStyle = computed(() => {
  const width = ctx.value?.labelWidth;
  if (width === undefined) return undefined;
  const value = typeof width === 'number' ? `${width}px` : width;
  return { width: value, flexShrink: 0 };
});

const labelPosition = computed(() => ctx.value?.labelPosition ?? 'right');

// ────────── 注册 / 注销 ──────────

onMounted(() => {
  if (props.name && ctx.value) {
    ctx.value.logic.registerField(props.name, itemRules.value);
  }
});

onBeforeUnmount(() => {
  if (props.name && ctx.value) {
    ctx.value.logic.unregisterField(props.name);
  }
});

// rules 变更时重新注册
watch(
  () => itemRules.value,
  (next) => {
    if (props.name && ctx.value) {
      ctx.value.logic.registerField(props.name, next);
    }
  },
);

// ────────── 值变更 & 校验触发 ──────────

/** 处理子组件值变更 */
const handleValueChange = (value: unknown) => {
  if (!props.name || !ctx.value) return;
  ctx.value.logic.setFieldValue(props.name, value);
  emit('change', value);
  // 触发 'change' 时机校验
  ctx.value.logic.validateField(props.name, 'change');
};

/** 处理子组件失焦 */
const handleBlur = () => {
  if (!props.name || !ctx.value) return;
  emit('blur', fieldValue.value);
  // 触发 'blur' 时机校验
  ctx.value.logic.validateField(props.name, 'blur');
};

// ────────── VNode 克隆：注入 value / events / disabled ──────────

/** 从插槽中找到第一个真实子 VNode（跳过注释节点） */
const extractChild = (): VNode | null => {
  const children = slots.default?.() ?? [];
  for (const child of children) {
    if (child.type !== Comment && child.type !== null) {
      return child;
    }
  }
  return null;
};

/** 克隆子 VNode 并注入表单相关的 props 与事件 */
const injectedChild = computed<VNode | null>(() => {
  const child = extractChild();
  if (!child) return null;

  const injectedProps: Record<string, unknown> = {
    value: fieldValue.value,
    disabled: isDisabled.value || undefined,
    readonly: isReadonly.value || undefined,
  };

  // 注入事件（与子组件已有事件合并，Vue 3 cloneVNode 会将同名事件合并为数组）
  injectedProps['onUpdate:value'] = (v: unknown) => handleValueChange(v);
  injectedProps['onChange'] = (v: unknown) => {
    // change 事件载荷可能是值（Input）或事件对象（原生）
    handleValueChange(v);
  };
  injectedProps['onBlur'] = () => handleBlur();

  return cloneVNode(child, injectedProps);
});

// ────────── 命令式 API ──────────

defineExpose<FormItemRef>({
  validate: (trigger?: ValidationTrigger) => {
    if (!props.name || !ctx.value) return Promise.resolve([]);
    return ctx.value.logic.validateField(props.name, trigger);
  },
  clearValidation: () => {
    if (!props.name || !ctx.value) return;
    ctx.value.logic.clearValidate([props.name]);
  },
  resetField: () => {
    if (!props.name || !ctx.value) return;
    ctx.value.logic.resetFields([props.name]);
  },
});
</script>

<template>
  <div
    v-if="!props.hidden"
    :class="[
      'xui-form-item',
      `xui-form-item--label-${labelPosition}`,
      {
        'is-error': fieldErrors.length > 0,
        'is-required': isRequired,
        'is-validating': fieldValidating,
      },
      props.className,
    ]"
    :style="props.style"
  >
    <label
      v-if="props.label || $slots.label"
      class="xui-form-item__label"
      :style="labelStyle"
      :class="`xui-form-item__label--${props.labelAlign}`"
    >
      <slot name="label">{{ props.label }}</slot>
    </label>
    <div class="xui-form-item__content">
      <component :is="() => injectedChild" v-if="injectedChild" />
      <div v-if="props.extra || $slots.extra" class="xui-form-item__extra">
        <slot name="extra">{{ props.extra }}</slot>
      </div>
      <transition name="xui-form-item-fade">
        <div v-if="fieldErrors.length > 0 && !$slots.error" class="xui-form-item__error">
          {{ fieldErrors[0] }}
          <span v-if="fieldErrors.length > 1" class="xui-form-item__error-count">
            (+{{ fieldErrors.length - 1 }})
          </span>
        </div>
      </transition>
      <slot v-if="$slots.error" name="error" :errors="fieldErrors" />
    </div>
  </div>
</template>
