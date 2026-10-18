<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useId, useTemplateRef, watchEffect } from 'vue';
import {
  createCascaderLogic,
  getColumnsByPath,
  getPathCheckState,
  resolvePath,
} from '@xui-design/shared';
import type { CascaderOption } from '@xui-design/shared';
import { icons } from '@xui-design/icons';
import { useLocaleData } from '../../hooks/use-locale';
import type { CascaderProps } from '@xui-design/core';

const props = withDefaults(defineProps<Omit<CascaderProps, 'onChange' | 'onClear'>>(), {
  value: undefined,
  defaultValue: undefined,
  placeholder: undefined,
  disabled: false,
  clearable: false,
  separator: ' / ',
  changeOnSelect: false,
  multiple: false,
  checkStrictly: false,
});

const emit = defineEmits<{
  change: [value: string[] | string[][], labels: string[] | string[][]];
  clear: [];
  'update:value': [value: string[] | string[][]];
}>();

const rootRef = useTemplateRef<HTMLElement>('root');
const triggerRef = useTemplateRef<HTMLElement>('trigger');
const triggerId = useId();
const panelId = useId();

const { value, defaultValue, disabled } = props;

const logic = createCascaderLogic({
  value,
  defaultValue,
  options: props.options,
  disabled,
  separator: props.separator,
  changeOnSelect: props.changeOnSelect,
  multiple: props.multiple,
  checkStrictly: props.checkStrictly,
  onChange: (val, labels) => {
    emit('update:value', val);
    emit('change', val, labels);
  },
  onClear: () => emit('clear'),
});

const state = ref(logic.getState());

const unsubscribe = logic.subscribe((next) => {
  state.value = next;
});

const handleOutside = (event: MouseEvent) => {
  if (state.value.open && rootRef.value && !rootRef.value.contains(event.target as Node)) {
    logic.close();
  }
};

onMounted(() => {
  document.addEventListener('mousedown', handleOutside);
});

onUnmounted(() => {
  unsubscribe();
  document.removeEventListener('mousedown', handleOutside);
});

watchEffect(() => {
  logic.updateOptions({
    value: props.value,
    disabled: props.disabled,
    options: props.options,
    changeOnSelect: props.changeOnSelect,
    checkStrictly: props.checkStrictly,
  });
});

// 根据 activePath 计算各列
const columns = computed(() => getColumnsByPath(props.options, state.value.activePath));

// 单选：选中路径的展示文案
const displayLabel = computed(() =>
  !props.multiple && state.value.value
    ? (resolvePath(props.options, state.value.value as string[])?.labels.join(props.separator) ??
      null)
    : null,
);

// 多选：已勾选的标签列表
const checkedTags = computed(() => {
  if (!props.multiple || !state.value.value) return [];
  const paths = state.value.value as string[][];
  return paths
    .map((path) => {
      const resolved = resolvePath(props.options, path);
      return resolved ? { path, label: resolved.labels.join(props.separator) } : null;
    })
    .filter(Boolean) as { path: string[]; label: string }[];
});

// 是否有选中值（控制清空按钮显示）
const hasValue = computed(() => {
  if (props.multiple) {
    return checkedTags.value.length > 0;
  }
  return !!state.value.value;
});

const locale = useLocaleData();

/** 判断某选项路径是否被勾选（父级由后代叶子全选推导） */
const isOptionChecked = (level: number, option: CascaderOption): boolean => {
  if (!props.multiple) return false;
  const path = [...state.value.activePath.slice(0, level), option.value];
  return getPathCheckState(
    props.options,
    state.value.value as string[][],
    path,
    props.checkStrictly,
  ).checked;
};

/** 判断某选项是否半选（部分后代叶子被勾选） */
const isOptionIndeterminate = (level: number, option: CascaderOption): boolean => {
  if (!props.multiple) return false;
  const path = [...state.value.activePath.slice(0, level), option.value];
  return getPathCheckState(
    props.options,
    state.value.value as string[][],
    path,
    props.checkStrictly,
  ).indeterminate;
};

/** 删除多选标签 */
const removeTag = (path: string[]) => {
  logic.toggleCheck(path);
};

const handleTriggerKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault();
      logic.toggleOpen();
      break;
    case 'Escape':
      if (state.value.open) {
        event.preventDefault();
        logic.close();
      }
      break;
  }
};

const focus = () => {
  triggerRef.value?.focus();
};

const toggleOpen = () => {
  logic.toggleOpen();
};

const close = () => {
  logic.close();
};

defineExpose({ focus, toggleOpen, close });
</script>

<template>
  <div
    ref="root"
    class="xui-cascader"
    :class="[
      className,
      { 'is-disabled': state.disabled, 'is-open': state.open, 'is-multiple': props.multiple },
    ]"
    :style="style"
  >
    <div
      ref="trigger"
      :id="triggerId"
      class="xui-cascader__trigger"
      role="combobox"
      :aria-expanded="state.open"
      aria-haspopup="dialog"
      :aria-controls="state.open ? panelId : undefined"
      :aria-disabled="state.disabled || undefined"
      :tabindex="state.disabled ? -1 : 0"
      @click="logic.toggleOpen()"
      @keydown="handleTriggerKeydown"
    >
      <!-- 多选标签 -->
      <template v-if="props.multiple">
        <span v-if="checkedTags.length === 0" class="xui-cascader__placeholder">
          {{ props.placeholder ?? locale.cascader.placeholder }}
        </span>
        <span v-else class="xui-cascader__tags">
          <span v-for="tag in checkedTags" :key="tag.path.join('/')" class="xui-cascader__tag">
            <span class="xui-cascader__tag-label">{{ tag.label }}</span>
            <span
              class="xui-cascader__tag-close"
              role="button"
              aria-label="remove"
              @click.stop="removeTag(tag.path)"
              >×</span
            >
          </span>
        </span>
      </template>
      <!-- 单选展示 -->
      <template v-else>
        <span v-if="displayLabel" class="xui-cascader__value">{{ displayLabel }}</span>
        <span v-else class="xui-cascader__placeholder">
          {{ props.placeholder ?? locale.cascader.placeholder }}
        </span>
      </template>

      <span
        v-if="props.clearable && hasValue && !state.disabled"
        class="xui-cascader__clear"
        role="button"
        aria-label="clear"
        @click.stop="logic.clear()"
      >
        <slot name="clearIcon">
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            aria-hidden="true"
            v-html="icons.clear"
          />
        </slot>
      </span>
      <span
        v-else
        class="xui-cascader__arrow"
        :class="{ 'is-open': state.open }"
        aria-hidden="true"
      >
        <slot name="suffixIcon">
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            v-html="icons['arrow-down']"
          />
        </slot>
      </span>
    </div>
    <div
      v-if="state.open"
      :id="panelId"
      class="xui-cascader__panel"
      role="dialog"
      :aria-label="locale.cascader.panel"
    >
      <div class="xui-cascader__columns">
        <ul
          v-for="(column, level) in columns"
          :key="level"
          class="xui-cascader__column"
          role="listbox"
          :aria-label="`level-${level}`"
        >
          <li
            v-for="option in column"
            :key="option.value"
            class="xui-cascader__item"
            :class="{
              'is-active': state.activePath[level] === option.value,
              'is-disabled': option.disabled,
              'is-checked': props.multiple && isOptionChecked(level, option),
            }"
            role="option"
            :aria-selected="state.activePath[level] === option.value"
            :aria-disabled="option.disabled || undefined"
            @click="!option.disabled && logic.select(level, option.value)"
          >
            <!-- 多选 checkbox -->
            <span v-if="props.multiple" class="xui-cascader__checkbox" aria-hidden="true">
              <span
                class="xui-cascader__checkbox-inner"
                :class="{
                  'is-checked': isOptionChecked(level, option),
                  'is-indeterminate': isOptionIndeterminate(level, option),
                }"
              />
            </span>
            <span class="xui-cascader__item-label">{{ option.label }}</span>
            <span
              v-if="option.children && option.children.length > 0"
              class="xui-cascader__item-arrow"
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 24 24"
                width="12"
                height="12"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                v-html="icons['arrow-right']"
              />
            </span>
          </li>
        </ul>
      </div>
      <!-- 多选底部操作栏 -->
      <div v-if="props.multiple" class="xui-cascader__footer">
        <button type="button" class="xui-cascader__footer-btn" @click="logic.checkAll()">
          全选
        </button>
        <button type="button" class="xui-cascader__footer-btn" @click="logic.uncheckAll()">
          清空
        </button>
      </div>
    </div>
  </div>
</template>

<!-- 组件样式统一维护在 packages/styles/src/components.scss（单一来源），SFC 不再内联样式 -->
