<script setup lang="ts">
import { Progress } from '@xui/vue';
</script>

<template>
  <div class="demo-column">
    <Progress :percent="100" />
    <Progress :percent="100" status="error" />
    <Progress :percent="60" />
  </div>
</template>
