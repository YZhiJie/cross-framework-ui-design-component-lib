<script setup lang="ts">
/**
 * Form - Vue 3 适配层
 *
 * 通过 provide 向所有 FormItem 注入表单 context（逻辑实例 + 全局 props）。
 * 渲染原生 <form> 元素，拦截 submit 事件 → 调用 logic.submit()。
 * defineExpose 暴露 FormRef 命令式 API。
 */
import { computed, onUnmounted, provide, ref, watchEffect } from 'vue';
import { createFormLogic } from '@xui-design/shared';
import type { FormLogicInstance, FormState } from '@xui-design/shared';
import type { FormProps, FormRef } from '@xui-design/core';

export interface FormContext {
  logic: FormLogicInstance;
  /** 响应式状态快照（subscribe 驱动更新），FormItem 必须从此处读取以保证联动 */
  state: FormState;
  disabled: boolean;
  readonly: boolean;
  labelWidth?: string | number;
  labelPosition?: 'left' | 'right' | 'top';
}

const props = withDefaults(
  defineProps<Omit<FormProps, 'onSubmit' | 'onSubmitFail' | 'onValuesChange'>>(),
  {
    disabled: false,
    readonly: false,
    labelPosition: 'right',
    scrollToFirstError: false,
  },
);

const emit = defineEmits<{
  submit: [values: Record<string, unknown>];
  submitFail: [errors: Record<string, string[]>];
  valuesChange: [changedValues: Record<string, unknown>, allValues: Record<string, unknown>];
}>();

const logicRef = ref<FormLogicInstance | null>(null);
if (logicRef.value === null) {
  logicRef.value = createFormLogic({
    initialValues: props.initialValues,
    rules: props.rules,
    disabled: props.disabled,
    readonly: props.readonly,
    validateTrigger: props.validateTrigger,
    onSubmit: (values) => emit('submit', values),
    onSubmitFail: (errors) => emit('submitFail', errors),
    onValuesChange: (changed, all) => emit('valuesChange', changed, all),
  });
}
const logic = logicRef.value;

const state = ref(logic.getState());
const unsubscribe = logic.subscribe((next) => {
  state.value = next;
});
onUnmounted(() => {
  unsubscribe();
});

watchEffect(() => {
  logic.updateOptions({
    disabled: props.disabled,
    readonly: props.readonly,
    rules: props.rules,
    onSubmit: (values) => emit('submit', values),
    onSubmitFail: (errors) => emit('submitFail', errors),
    onValuesChange: (changed, all) => emit('valuesChange', changed, all),
  });
});

const formContext = computed<FormContext>(() => ({
  logic,
  state: state.value,
  disabled: props.disabled,
  readonly: props.readonly,
  labelWidth: props.labelWidth,
  labelPosition: props.labelPosition,
}));

provide('xuiForm', formContext);

const handleNativeSubmit = (e: Event) => {
  e.preventDefault();
  logic.submit();
};

defineExpose<FormRef>({
  validate: (trigger) => logic.validate(trigger),
  validateField: (name, trigger) => logic.validateField(name, trigger),
  getFieldValue: (name) => logic.getFieldValue(name),
  getFieldsValue: () => logic.getFieldsValue(),
  setFieldValue: (name, value) => logic.setFieldValue(name, value),
  setFieldsValue: (values) => logic.setFieldsValue(values),
  resetFields: (names) => logic.resetFields(names),
  clearValidate: (names) => logic.clearValidate(names),
  submit: () => logic.submit(),
});
</script>

<template>
  <form
    :class="['xui-form', props.className]"
    :style="props.style"
    @submit.prevent="handleNativeSubmit"
  >
    <slot />
    <div v-if="$slots.actions" class="xui-form__actions">
      <slot name="actions" />
    </div>
  </form>
</template>
