<script setup lang="ts">
import { ref } from 'vue';
import { Button, Tag } from '@xui/vue';

const tags = ref(['前端', 'Vue', 'React', 'TypeScript']);

const remove = (index: number) => {
  tags.value.splice(index, 1);
};

const reset = () => {
  tags.value = ['前端', 'Vue', 'React', 'TypeScript'];
};
</script>

<template>
  <div class="demo-column">
    <div class="demo-row">
      <Tag v-for="(tag, index) in tags" :key="tag" size="sm" closable @close="remove(index)">
        {{ tag }}
      </Tag>
    </div>
    <Button size="sm" @click="reset">重置标签</Button>
  </div>
</template>
