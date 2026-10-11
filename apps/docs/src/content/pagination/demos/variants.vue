<script setup lang="ts">
import { Pagination } from '@xui/vue';
</script>

<template>
  <div class="demo-column">
    <Pagination :default-value="1" :total="80" :page-size="20" />
    <Pagination :default-value="2" :total="50" disabled />
  </div>
</template>
