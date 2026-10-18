<script setup lang="ts">
import { ref } from 'vue';
import { Dropdown, Button } from '@xui-design/vue';
import type { DropdownOption } from '@xui-design/core';
import { isZh } from '../../../i18n';

const menu: DropdownOption[] = [
  { key: 'profile', label: isZh() ? '个人中心' : 'Profile', icon: 'user' },
  { key: 'schedule', label: isZh() ? '我的日程' : 'My Schedule', icon: 'calendar' },
  { key: 'logout', label: isZh() ? '退出登录' : 'Sign out', icon: 'close' },
];

const result = ref(isZh() ? '（等待选择）' : '(pending)');

function handleSelect(key: string) {
  result.value = isZh() ? `已选择：${key}` : `Selected: ${key}`;
}

function handleVisibleChange(open: boolean) {
  if (open) result.value = isZh() ? '菜单已展开' : 'Menu opened';
}
</script>

<template>
  <div class="demo-column">
    <Dropdown :menu="menu" @select="handleSelect" @visible-change="handleVisibleChange">
      <Button>{{ isZh() ? '用户菜单' : 'User Menu' }}</Button>
    </Dropdown>
    <p class="demo-text">{{ result }}</p>
  </div>
</template>
