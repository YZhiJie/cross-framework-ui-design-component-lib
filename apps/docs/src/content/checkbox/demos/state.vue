<script setup lang="ts">
import { ref } from 'vue';
import { Checkbox } from '@xui-design/vue';
import { isZh } from '../../../i18n';

const indeterminate = ref(true);
</script>

<template>
  <div class="demo-column">
    <Checkbox v-model:indeterminate="indeterminate">{{
      isZh() ? '全选（半选态，点击后变全选）' : 'Select all (indeterminate, click to select all)'
    }}</Checkbox>
    <Checkbox value disabled>{{ isZh() ? '禁用未选' : 'Disabled unchecked' }}</Checkbox>
    <Checkbox :value="true" disabled>{{ isZh() ? '禁用已选' : 'Disabled checked' }}</Checkbox>
  </div>
</template>
