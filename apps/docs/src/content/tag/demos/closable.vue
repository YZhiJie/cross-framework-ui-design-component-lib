<script setup lang="ts">
import { ref } from 'vue';
import { Button, Tag } from '@xui-design/vue';
import { isZh } from '../../../i18n';

const initialTags = () =>
  isZh() ? ['前端', 'Vue', 'React', 'TypeScript'] : ['Frontend', 'Vue', 'React', 'TypeScript'];

const tags = ref(initialTags());

const remove = (index: number) => {
  tags.value.splice(index, 1);
};

const reset = () => {
  tags.value = initialTags();
};
</script>

<template>
  <div class="demo-column">
    <div class="demo-row">
      <Tag v-for="(tag, index) in tags" :key="tag" size="sm" closable @close="remove(index)">
        {{ tag }}
      </Tag>
    </div>
    <Button size="sm" @click="reset">{{ isZh() ? '重置标签' : 'Reset tags' }}</Button>
  </div>
</template>
