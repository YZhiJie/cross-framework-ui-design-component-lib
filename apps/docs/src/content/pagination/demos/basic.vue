<script setup lang="ts">
import { ref } from 'vue';
import { Pagination } from '@xui-design/vue';
import { isZh } from '../../../i18n';

const page = ref(3);
</script>

<template>
  <div class="demo-column">
    <Pagination v-model:value="page" :total="285" />
    <p class="demo-text">
      {{
        isZh()
          ? `第 ${page} 页 / 共 29 页（每页 10 条，共 285 条）`
          : `Page ${page} / 29 pages (10 per page, 285 total)`
      }}
    </p>
  </div>
</template>
