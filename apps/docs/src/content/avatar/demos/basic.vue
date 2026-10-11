<script setup lang="ts">
import { Avatar } from '@xui/vue';

const avatarSrc =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><rect width='80' height='80' fill='%236366f1'/><text x='40' y='52' font-size='36' fill='white' text-anchor='middle'>X</text></svg>";
</script>

<template>
  <div class="demo-row">
    <Avatar :src="avatarSrc" alt="X 用户头像" />
    <Avatar>杨</Avatar>
    <Avatar size="sm">小</Avatar>
    <Avatar size="lg">大</Avatar>
  </div>
</template>
