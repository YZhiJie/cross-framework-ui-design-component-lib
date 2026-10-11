<script setup lang="ts">
import { ref } from 'vue';
import { Popconfirm, Button } from '@xui/vue';

const result = ref('（待操作）');
</script>

<template>
  <div class="demo-column">
    <Popconfirm
      content="确定要删除这条记录吗？删除后不可恢复。"
      @confirm="result = '已确认删除'"
      @cancel="result = '已取消'"
    >
      <Button type="danger">删除记录</Button>
    </Popconfirm>
    <p class="demo-text">操作结果：{{ result }}</p>
  </div>
</template>
