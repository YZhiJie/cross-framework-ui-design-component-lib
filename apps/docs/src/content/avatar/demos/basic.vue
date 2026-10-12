<script setup lang="ts">
import { Avatar } from '@xui-design/vue';
import { isZh } from '../../../i18n';

const avatarSrc =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><rect width='80' height='80' fill='%236366f1'/><text x='40' y='52' font-size='36' fill='white' text-anchor='middle'>X</text></svg>";
</script>

<template>
  <div class="demo-row">
    <Avatar :src="avatarSrc" :alt="isZh() ? 'X 用户头像' : 'X user avatar'" />
    <Avatar>{{ isZh() ? '杨' : 'Yang' }}</Avatar>
    <Avatar size="sm">{{ isZh() ? '小' : 'Sm' }}</Avatar>
    <Avatar size="lg">{{ isZh() ? '大' : 'Lg' }}</Avatar>
  </div>
</template>
