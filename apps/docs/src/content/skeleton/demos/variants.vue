<script setup lang="ts">
import { Skeleton } from '@xui-design/vue';
</script>

<template>
  <div class="demo-column">
    <Skeleton avatar :rows="2" />
    <Skeleton :rows="5" />
  </div>
</template>
