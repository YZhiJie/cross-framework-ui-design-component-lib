/**
 * Avatar 组件规格
 *
 * useLogic 指向 @xui/shared 的 createAvatarLogic 逻辑工厂，
 * Vue / React 适配层通过同一份规格驱动组件状态。
 */

import { createAvatarLogic } from '@xui/shared';

import type { ComponentSpec } from '../../spec';
import type { AvatarEvents, AvatarLogic, AvatarProps, AvatarSlots } from './types';

export const avatarSpec = {
  name: 'Avatar',
  props: {
    type: {
      size: String,
      shape: String,
      src: String,
      alt: String,
      className: String,
      style: Object,
      onError: Function,
    },
    defaults: {
      size: 'md',
      shape: 'circle',
    },
  },
  events: {
    error: { description: '图片加载失败时触发' },
  },
  slots: {
    default: { description: '自定义内容（文案 / 图标）' },
    icon: { description: '自定义占位图标（无图片/加载失败时）' },
  },
  useLogic: (props: AvatarProps) =>
    createAvatarLogic({
      src: props.src,
      onError: props.onError,
    }),
} satisfies ComponentSpec<AvatarProps, AvatarEvents, AvatarSlots, AvatarLogic>;
