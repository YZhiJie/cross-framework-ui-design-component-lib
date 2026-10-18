<script setup lang="ts">
import { Dropdown, Button } from '@xui-design/vue';
import type { DropdownOption } from '@xui-design/core';
import { isZh } from '../../../i18n';

const menu: DropdownOption[] = [
  { key: 'rename', label: isZh() ? '重命名' : 'Rename', icon: 'plus' },
  { key: 'share', label: isZh() ? '分享' : 'Share', disabled: true },
  { key: 'archive', label: isZh() ? '归档' : 'Archive', divided: true, icon: 'inbox' },
  { key: 'delete', label: isZh() ? '删除' : 'Delete', danger: true, icon: 'close' },
];

const disabledMenu: DropdownOption[] = [
  { key: 'copy', label: isZh() ? '复制' : 'Copy' },
  { key: 'cut', label: isZh() ? '剪切' : 'Cut' },
];
</script>

<template>
  <div class="demo-row">
    <Dropdown :menu="menu" trigger="click" placement="right">
      <Button>{{ isZh() ? '更多操作（点击）' : 'More Actions (click)' }}</Button>
    </Dropdown>
    <Dropdown :menu="disabledMenu" disabled>
      <Button>{{ isZh() ? '禁用状态' : 'Disabled' }}</Button>
    </Dropdown>
  </div>
</template>
