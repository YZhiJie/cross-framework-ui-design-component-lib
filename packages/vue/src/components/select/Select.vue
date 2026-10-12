<script setup lang="ts">
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  useId,
  useTemplateRef,
  watch,
  watchEffect,
} from 'vue';
import {
  bindViewportUpdate,
  createSelectLogic,
  createVirtualListLogic,
  getViewport,
  resolveFloatingPosition,
} from '@xui/shared';
import { icons } from '@xui/icons';
import { useLocaleData } from '../../hooks/use-locale';
import type { SelectProps, SelectValue } from '@xui/core';

const props = withDefaults(defineProps<Omit<SelectProps, 'onChange' | 'onClear'>>(), {
  // 显式 undefined 默认值：未绑定 value 时保持 undefined → 逻辑层进入非受控模式
  // （提供 value 即受控），与 React 端语义对齐
  value: undefined,
  defaultValue: undefined,
  placeholder: undefined,
  disabled: false,
  clearable: false,
  multiple: false,
  searchable: false,
  virtual: false,
  maxHeight: 264,
  className: undefined,
  style: undefined,
});

const emit = defineEmits<{
  change: [value: SelectValue];
  clear: [];
  'update:value': [value: SelectValue];
}>();

// 触发器 placeholder / 搜索框文案取全局语言包（setLocale / registerLocale 后响应式更新）
const locale = useLocaleData();

const rootRef = useTemplateRef<HTMLElement>('root');
const triggerRef = useTemplateRef<HTMLElement>('trigger');
const dropdownRef = useTemplateRef<HTMLElement>('dropdown');
const triggerId = useId();
const listboxId = useId();

/** 虚拟选项行高：与 CSS 变量 --xui-select-item-height 默认值对齐（虚拟模式要求行高固定） */
const ITEM_HEIGHT = 30;

// setup 仅执行一次：解构快照仅用于逻辑层初始化，后续同步一律经 props.xxx 响应式访问
const { value, defaultValue, options, disabled, clearable, multiple, searchable } = props;

const logic = createSelectLogic({
  value,
  defaultValue,
  options,
  disabled,
  clearable,
  multiple,
  searchable,
  onChange: (val) => {
    emit('update:value', val);
    emit('change', val);
  },
  onClear: () => emit('clear'),
});

const state = ref(logic.getState());

const unsubscribe = logic.subscribe((next) => {
  state.value = next;
});

// 虚拟滚动窗口计算（仅 virtual 模式消费）
const vl = createVirtualListLogic({ itemCount: 0, itemHeight: ITEM_HEIGHT, viewportHeight: 0 });
const vlState = ref(vl.getState());
const unsubscribeVl = vl.subscribe((next) => {
  vlState.value = next;
});

// 点击组件外部时收起面板
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
  unsubscribeVl();
  unbindViewport?.();
  document.removeEventListener('mousedown', handleOutside);
});

// Props 变更同步到逻辑层（受控模式：value 变更 → 逻辑层）
watchEffect(() => {
  logic.updateOptions({
    value: props.value,
    options: props.options,
    disabled: props.disabled,
    clearable: props.clearable,
    multiple: props.multiple,
    searchable: props.searchable,
  });
});

const filteredOptions = computed(() => state.value.filteredOptions);
const isVirtual = computed(() => props.virtual);

const visibleOptions = computed(() => {
  const list = filteredOptions.value;
  if (!isVirtual.value) return list;
  return list.slice(vlState.value.startIndex, vlState.value.endIndex + 1);
});

const selectedOption = computed(() =>
  props.options?.find((option) => option.value === state.value.value),
);

/** 多选模式已选 tag 列表（含 options 中不存在的值，回退显示原始值） */
const selectedTags = computed(() => {
  if (!props.multiple) return [];
  const values = Array.isArray(state.value.value) ? state.value.value : [];
  return values.map((item) => {
    const option = props.options?.find((candidate) => candidate.value === item);
    return { value: item, label: option?.label ?? item };
  });
});

/** 是否已选中（多选看数组长度，单选看非 null） */
const hasValue = computed(() =>
  props.multiple ? selectedTags.value.length > 0 : state.value.value !== null,
);

const rootClass = computed(() => [
  props.className,
  {
    'is-disabled': state.value.disabled,
    'is-open': state.value.open,
    'is-multiple': props.multiple,
    'is-virtual': isVirtual.value,
    'is-drop-up': dropUp.value,
  },
]);

/** 视口避让：下方空间不足且上方更充足时下拉面板向上展开 */
const dropUp = ref(false);
let unbindViewport: (() => void) | null = null;

function updateDropDirection() {
  const root = rootRef.value;
  const dropdown = dropdownRef.value;
  if (!root || !dropdown) return;
  const dropdownRect = dropdown.getBoundingClientRect();
  // 零尺寸表示未完成布局（jsdom 环境恒为 0），保持向下展开避免误翻转
  if (dropdownRect.width === 0 && dropdownRect.height === 0) return;
  // Select 面板与触发器同宽，无交叉轴偏移，仅消费 flip 结果
  const { placement } = resolveFloatingPosition(
    root.getBoundingClientRect(),
    dropdownRect,
    getViewport(),
    { placement: 'bottom', gap: 4, viewportPadding: 4 },
  );
  dropUp.value = placement === 'top';
}

watch(
  () => state.value.open,
  (open) => {
    if (open) {
      dropUp.value = false;
      nextTick(updateDropDirection);
      unbindViewport?.();
      unbindViewport = bindViewportUpdate(updateDropDirection);
    } else {
      unbindViewport?.();
      unbindViewport = null;
      dropUp.value = false;
    }
  },
);

const rootStyle = computed(() => props.style ?? undefined);

const dropdownStyle = computed(() => {
  const style: Record<string, string> = { maxHeight: `${props.maxHeight}px` };
  if (isVirtual.value) style.height = `${props.maxHeight}px`;
  return style;
});

// 虚拟模式：过滤选项数 / 视口高度同步到窗口计算（视口即内联 height = maxHeight）
watchEffect(() => {
  if (!isVirtual.value) return;
  vl.updateOptions({
    itemCount: filteredOptions.value.length,
    viewportHeight: props.maxHeight,
  });
});

// 搜索词变化重置虚拟滚动位置，避免过滤后 scrollTop 越界空白
watch(
  () => state.value.searchQuery,
  async () => {
    if (!isVirtual.value) return;
    vl.scrollTo(0);
    await nextTick();
    if (dropdownRef.value) dropdownRef.value.scrollTop = 0;
  },
);

// 键盘高亮项滚动跟随（保持 ARIA combobox 的高亮项可见）
watchEffect(() => {
  const { open, activeIndex } = state.value;
  if (!open || activeIndex === -1) return;
  void activeIndex;
  nextTick(() => {
    const el = document.getElementById(`${listboxId}-option-${activeIndex}`);
    el?.scrollIntoView?.({ block: 'nearest' });
  });
});

const handleScroll = (event: Event) => {
  vl.scrollTo((event.target as HTMLElement).scrollTop);
};

const handleSearchInput = (event: Event) => {
  logic.setSearch((event.target as HTMLInputElement).value);
};

/** 面板展开时聚焦搜索框（searchable 模式） */
watch(
  () => state.value.open,
  async (open) => {
    if (!open || !props.searchable) return;
    await nextTick();
    dropdownRef.value?.querySelector<HTMLInputElement>('.xui-select__search')?.focus();
  },
);

const handleTriggerKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault();
      if (state.value.open) logic.confirmHighlight();
      else logic.toggleOpen();
      break;
    case 'Escape':
      if (state.value.open) {
        event.preventDefault();
        logic.close();
      }
      break;
    case 'ArrowDown':
      event.preventDefault();
      if (state.value.open) logic.moveHighlight(1);
      else logic.toggleOpen();
      break;
    case 'ArrowUp':
      event.preventDefault();
      if (state.value.open) logic.moveHighlight(-1);
      else logic.toggleOpen();
      break;
  }
};

/** 搜索框键盘导航（焦点在输入框内；Space 为正常输入字符不拦截） */
const handleSearchKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'Enter':
      event.preventDefault();
      logic.confirmHighlight();
      break;
    case 'ArrowDown':
      event.preventDefault();
      logic.moveHighlight(1);
      break;
    case 'ArrowUp':
      event.preventDefault();
      logic.moveHighlight(-1);
      break;
    case 'Escape':
      event.preventDefault();
      logic.close();
      break;
  }
};

// 暴露命令式 focus / toggleOpen / close（与 React 适配层的 SelectRef 对齐）
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
  <div ref="root" class="xui-select" :class="rootClass" :style="rootStyle">
    <div
      ref="trigger"
      :id="triggerId"
      class="xui-select__trigger"
      role="combobox"
      :aria-expanded="state.open"
      aria-haspopup="listbox"
      :aria-controls="state.open ? listboxId : undefined"
      :aria-activedescendant="
        state.open && state.activeIndex !== -1
          ? `${listboxId}-option-${state.activeIndex}`
          : undefined
      "
      :aria-disabled="state.disabled || undefined"
      :tabindex="state.disabled ? -1 : 0"
      @click="logic.toggleOpen()"
      @keydown="handleTriggerKeydown"
    >
      <template v-if="props.multiple">
        <span class="xui-select__tags">
          <span v-for="tag in selectedTags" :key="tag.value" class="xui-select__tag">
            <span class="xui-select__tag-label">{{ tag.label }}</span>
            <span
              class="xui-select__tag-close"
              role="button"
              aria-label="remove"
              @click.stop="logic.select(tag.value)"
            >
              <slot name="clearIcon">
                <svg
                  viewBox="0 0 24 24"
                  width="10"
                  height="10"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  aria-hidden="true"
                  v-html="icons.clear"
                />
              </slot>
            </span>
          </span>
          <span v-if="selectedTags.length === 0" class="xui-select__placeholder">
            {{ props.placeholder ?? locale.select.triggerPlaceholder }}
          </span>
        </span>
      </template>
      <span v-else-if="selectedOption" class="xui-select__value">{{ selectedOption.label }}</span>
      <span v-else class="xui-select__placeholder">{{
        props.placeholder ?? locale.select.triggerPlaceholder
      }}</span>
      <span
        v-if="props.clearable && hasValue && !state.disabled"
        class="xui-select__clear"
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
      <span v-else class="xui-select__arrow" aria-hidden="true">
        <slot name="suffixIcon">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            v-html="icons['arrow-down']"
          />
        </slot>
      </span>
    </div>
    <ul
      v-if="state.open"
      ref="dropdown"
      :id="listboxId"
      class="xui-select__dropdown"
      role="listbox"
      :aria-labelledby="triggerId"
      :aria-multiselectable="props.multiple || undefined"
      :style="dropdownStyle"
      @scroll="handleScroll"
    >
      <li v-if="props.searchable" role="presentation" class="xui-select__search-item">
        <input
          class="xui-select__search"
          type="text"
          role="searchbox"
          :placeholder="locale.select.searchPlaceholder"
          :value="state.searchQuery"
          :aria-label="locale.select.searchAriaLabel"
          @input="handleSearchInput"
          @keydown="handleSearchKeydown"
          @click.stop
        />
      </li>
      <template v-if="visibleOptions.length > 0">
        <li
          v-if="isVirtual && vlState.offsetY > 0"
          class="xui-select__spacer"
          :style="{ height: `${vlState.offsetY}px` }"
          aria-hidden="true"
        ></li>
        <li
          v-for="(option, index) in visibleOptions"
          :id="`${listboxId}-option-${isVirtual ? vlState.startIndex + index : index}`"
          :key="option.value"
          class="xui-select__option"
          :class="{
            'is-selected': props.multiple
              ? Array.isArray(state.value) && (state.value as string[]).includes(option.value)
              : option.value === state.value,
            'is-active': (isVirtual ? vlState.startIndex + index : index) === state.activeIndex,
            'is-disabled': option.disabled,
          }"
          role="option"
          :aria-selected="
            props.multiple
              ? Array.isArray(state.value) && (state.value as string[]).includes(option.value)
              : option.value === state.value
          "
          :aria-disabled="option.disabled || undefined"
          @click="logic.select(option.value)"
        >
          {{ option.label }}
        </li>
        <li
          v-if="isVirtual && vlState.fillerHeight > 0"
          class="xui-select__spacer"
          :style="{ height: `${vlState.fillerHeight}px` }"
          aria-hidden="true"
        ></li>
      </template>
      <li v-else class="xui-select__empty" role="presentation">无匹配结果</li>
    </ul>
  </div>
</template>

<!-- 组件样式统一维护在 packages/styles/src/components.scss（单一来源），SFC 不再内联样式 -->
