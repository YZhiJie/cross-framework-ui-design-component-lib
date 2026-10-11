<script setup lang="ts">
import { computed, ref } from 'vue';
import { Button, Progress } from '@xui/vue';

const percent = ref(35);
const add = (delta: number) => {
  percent.value = Math.min(100, Math.max(0, percent.value + delta));
};
const circlePercent = computed(() => percent.value);
</script>

<template>
  <div class="demo-column">
    <Progress :percent="percent" />
    <Progress type="circle" :percent="circlePercent" :stroke-width="8" />
    <div class="demo-row">
      <Button size="sm" @click="add(-10)">-10%</Button>
      <Button size="sm" type="primary" @click="add(10)">+10%</Button>
    </div>
  </div>
</template>
