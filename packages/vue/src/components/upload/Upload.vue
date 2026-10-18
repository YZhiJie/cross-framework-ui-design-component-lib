<script setup lang="ts">
import { computed, onUnmounted, ref, useTemplateRef, watchEffect } from 'vue';
import { createUploadLogic } from '@xui-design/shared';
import type { UploadFile } from '@xui-design/core';
import type { UploadProps } from '@xui-design/core';

const props = withDefaults(defineProps<Omit<UploadProps, 'onChange' | 'onRemove'>>(), {
  accept: undefined,
  multiple: false,
  disabled: false,
  maxCount: undefined,
  maxSize: undefined,
  listType: 'text',
  drag: false,
  autoUpload: true,
  requestUpload: undefined,
  beforeUpload: undefined,
  value: undefined,
  defaultValue: undefined,
});

const emit = defineEmits<{
  change: [fileList: UploadFile[]];
  remove: [file: UploadFile];
}>();

const inputRef = useTemplateRef<HTMLInputElement>('fileInput');

const { value, defaultValue, disabled } = props;

const logic = createUploadLogic({
  action: props.action,
  multiple: props.multiple,
  disabled,
  maxCount: props.maxCount,
  maxSize: props.maxSize,
  listType: props.listType,
  autoUpload: props.autoUpload,
  requestUpload: props.requestUpload,
  beforeUpload: props.beforeUpload,
  value,
  defaultValue,
  onChange: (files) => {
    emit('change', files);
  },
  onRemove: (file) => emit('remove', file),
});

const state = ref(logic.getState());

const unsubscribe = logic.subscribe((next) => {
  state.value = next;
});

onUnmounted(() => {
  unsubscribe();
});

watchEffect(() => {
  logic.updateOptions({
    value: props.value,
    disabled: props.disabled,
  });
});

const handleInputChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const files = input.files;
  if (files && files.length > 0) {
    logic.selectFiles(files);
  }
  input.value = '';
};

// 拖拽计数器：子元素间移动会触发 dragleave，计数归零才撤销高亮
let dragEnterCount = 0;

const handleDragEnter = () => {
  dragEnterCount += 1;
  logic.setDragOver(true);
};

const handleDragLeave = () => {
  dragEnterCount = Math.max(0, dragEnterCount - 1);
  if (dragEnterCount === 0) logic.setDragOver(false);
};

const handleDrop = (event: DragEvent) => {
  dragEnterCount = 0;
  logic.setDragOver(false);
  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    logic.selectFiles(files);
  }
};

const open = () => {
  inputRef.value?.click();
};

const clear = () => {
  logic.clear();
};

/** 手动上传所有 pending 文件 */
const submit = () => {
  logic.submit();
};

/** 格式化速率（字节/秒 → 可读字符串） */
const formatSpeed = (bps?: number): string => {
  if (bps === undefined || bps <= 0) return '';
  if (bps < 1024) return `${bps.toFixed(0)} B/s`;
  if (bps < 1024 * 1024) return `${(bps / 1024).toFixed(1)} KB/s`;
  return `${(bps / (1024 * 1024)).toFixed(1)} MB/s`;
};

/** 格式化剩余时间（秒 → mm:ss） */
const formatRemaining = (seconds?: number): string => {
  if (seconds === undefined || seconds <= 0) return '';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return m > 0 ? `${m}分${s}秒` : `${s}秒`;
};

/** 生成 ObjectURL */
const objectUrl = (file: File) => URL.createObjectURL(file);

/** 是否有待上传文件 */
const hasPending = computed(() => state.value.fileList.some((f) => f.status === 'pending'));

defineExpose({ open, clear, submit });
</script>

<template>
  <div class="xui-upload" :class="className" :style="style">
    <input
      ref="fileInput"
      type="file"
      class="xui-upload__input"
      :accept="props.accept"
      :multiple="props.multiple"
      :disabled="state.disabled"
      style="display: none"
      @change="handleInputChange"
    />
    <div class="xui-upload__actions">
      <!-- 拖拽形态：虚线 dropzone（点击选择 + 拖入上传） -->
      <div
        v-if="props.drag"
        class="xui-upload__drag"
        :class="{ 'is-disabled': state.disabled, 'is-dragover': state.dragOver }"
        role="button"
        :aria-disabled="state.disabled || undefined"
        :aria-label="state.dragOver ? 'release to upload' : 'drag file here'"
        @click="open"
        @dragenter.prevent="handleDragEnter"
        @dragover.prevent
        @dragleave.prevent="handleDragLeave"
        @drop.prevent="handleDrop"
      >
        <slot name="trigger">
          <span class="xui-upload__drag-icon" aria-hidden="true">⇪</span>
          <span class="xui-upload__drag-text">
            {{ state.dragOver ? '松开即可上传' : '拖拽文件到此处，或点击上传' }}
          </span>
        </slot>
      </div>
      <template v-else>
        <slot name="trigger">
          <button
            type="button"
            class="xui-upload__trigger"
            :class="{ 'is-disabled': state.disabled }"
            :disabled="state.disabled"
            @click="open"
          >
            + 点击上传
          </button>
        </slot>
      </template>
      <!-- 手动上传按钮（autoUpload=false 时显示） -->
      <button
        v-if="!props.autoUpload && hasPending"
        type="button"
        class="xui-upload__submit-btn"
        @click="submit"
      >
        开始上传
      </button>
    </div>
    <ul
      v-if="state.fileList.length > 0"
      class="xui-upload__list"
      :class="`xui-upload__list--${props.listType}`"
    >
      <li
        v-for="file in state.fileList"
        :key="file.uid"
        class="xui-upload__item"
        :class="`is-${file.status}`"
      >
        <slot name="fileItem" :file="file">
          <div class="xui-upload__item-main">
            <img
              v-if="props.listType === 'picture' && file.raw"
              :src="objectUrl(file.raw)"
              :alt="file.name"
              class="xui-upload__thumbnail"
            />
            <span class="xui-upload__name" :title="file.name">{{ file.name }}</span>
            <span class="xui-upload__status">
              <template v-if="file.status === 'pending'">待上传</template>
              <template v-else-if="file.status === 'uploading'">
                {{ file.percent }}%
                <span v-if="file.speed" class="xui-upload__speed">{{
                  formatSpeed(file.speed)
                }}</span>
                <span v-if="file.remainingTime" class="xui-upload__remaining"
                  >剩余 {{ formatRemaining(file.remainingTime) }}</span
                >
              </template>
              <template v-else-if="file.status === 'done'">✓ 成功</template>
              <template v-else-if="file.status === 'error'">✗ 失败</template>
              <template v-else-if="file.status === 'cancelled'">已取消</template>
            </span>
          </div>
          <div v-if="file.status === 'uploading'" class="xui-upload__progress">
            <div class="xui-upload__progress-bar" :style="{ width: file.percent + '%' }" />
          </div>
          <div class="xui-upload__item-actions">
            <!-- 排序按钮 -->
            <button
              v-if="state.fileList.length > 1"
              type="button"
              class="xui-upload__sort-btn"
              aria-label="move up"
              :disabled="state.fileList[0]?.uid === file.uid"
              @click="logic.move(file.uid, -1)"
            >
              ↑
            </button>
            <button
              v-if="state.fileList.length > 1"
              type="button"
              class="xui-upload__sort-btn"
              aria-label="move down"
              :disabled="state.fileList[state.fileList.length - 1]?.uid === file.uid"
              @click="logic.move(file.uid, 1)"
            >
              ↓
            </button>
            <!-- 取消按钮（上传中） -->
            <button
              v-if="file.status === 'uploading'"
              type="button"
              class="xui-upload__cancel-btn"
              aria-label="cancel"
              @click="logic.cancel(file.uid)"
            >
              取消
            </button>
            <!-- 删除按钮 -->
            <button
              type="button"
              class="xui-upload__remove"
              aria-label="remove"
              @click="logic.remove(file.uid)"
            >
              ×
            </button>
          </div>
        </slot>
      </li>
    </ul>
  </div>
</template>
