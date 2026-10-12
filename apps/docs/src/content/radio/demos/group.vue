<script setup lang="ts">
import { ref } from 'vue';
import { RadioGroup, Radio } from '@xui-design/vue';
import { isZh } from '../../../i18n';

const value = ref('a');
</script>

<template>
  <div class="demo-column">
    <RadioGroup v-model:value="value">
      <Radio value="a">{{ isZh() ? '选项 A' : 'Option A' }}</Radio>
      <Radio value="b">{{ isZh() ? '选项 B' : 'Option B' }}</Radio>
      <Radio value="c" disabled>{{ isZh() ? '选项 C（禁用）' : 'Option C (disabled)' }}</Radio>
    </RadioGroup>
    <p class="demo-text">{{ isZh() ? '当前选中' : 'Selected' }}：{{ value }}</p>
  </div>
</template>
