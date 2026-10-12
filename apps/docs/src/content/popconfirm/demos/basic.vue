<script setup lang="ts">
import { ref } from 'vue';
import { Popconfirm, Button } from '@xui-design/vue';
import { isZh } from '../../../i18n';

const result = ref(isZh() ? '（待操作）' : '(pending)');
</script>

<template>
  <div class="demo-column">
    <Popconfirm
      :content="
        isZh()
          ? '确定要删除这条记录吗？删除后不可恢复。'
          : 'Are you sure you want to delete this record? This cannot be undone.'
      "
      @confirm="result = isZh() ? '已确认删除' : 'Deletion confirmed'"
      @cancel="result = isZh() ? '已取消' : 'Cancelled'"
    >
      <Button type="danger">{{ isZh() ? '删除记录' : 'Delete record' }}</Button>
    </Popconfirm>
    <p class="demo-text">{{ isZh() ? '操作结果：' : 'Result: ' }}{{ result }}</p>
  </div>
</template>
