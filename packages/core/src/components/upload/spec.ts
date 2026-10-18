/**
 * Upload 组件规格
 *
 * useLogic 指向 @xui-design/shared 的 createUploadLogic 逻辑工厂，
 * Vue / React 适配层通过同一份规格驱动组件状态。
 */

import { createUploadLogic } from '@xui-design/shared';

import type { ComponentSpec } from '../../spec';
import type { UploadEvents, UploadLogic, UploadProps, UploadSlots } from './types';

export const uploadSpec = {
  name: 'Upload',
  props: {
    type: {
      action: String,
      accept: String,
      multiple: Boolean,
      disabled: Boolean,
      maxCount: Number,
      maxSize: Number,
      listType: String,
      autoUpload: Boolean,
      requestUpload: Function,
      beforeUpload: Function,
      value: Array,
      defaultValue: Array,
      onChange: Function,
      onRemove: Function,
      className: String,
      style: Object,
    },
    defaults: {
      multiple: false,
      disabled: false,
      listType: 'text',
      autoUpload: true,
    },
  },
  events: {
    change: { description: '文件列表变更时触发', payloadType: 'UploadFile[]' },
    remove: { description: '删除文件时触发', payloadType: 'UploadFile' },
  },
  slots: {
    trigger: { description: '自定义上传按钮' },
    fileItem: { description: '自定义文件列表项' },
  },
  useLogic: (props: UploadProps) =>
    createUploadLogic({
      action: props.action,
      multiple: props.multiple,
      disabled: props.disabled,
      maxCount: props.maxCount,
      maxSize: props.maxSize,
      listType: props.listType,
      autoUpload: props.autoUpload,
      requestUpload: props.requestUpload,
      beforeUpload: props.beforeUpload,
      value: props.value,
      defaultValue: props.defaultValue,
      onChange: props.onChange,
      onRemove: props.onRemove,
    }),
} satisfies ComponentSpec<UploadProps, UploadEvents, UploadSlots, UploadLogic>;
