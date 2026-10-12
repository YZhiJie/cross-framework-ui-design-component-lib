<script setup lang="ts">
import { Popconfirm, Button } from '@xui-design/vue';
import { isZh } from '../../../i18n';
</script>

<template>
  <div class="demo-row">
    <Popconfirm
      :content="isZh() ? '右侧弹出的气泡确认' : 'Popover confirm on the right'"
      placement="right"
      :confirm-text="isZh() ? '好的' : 'OK'"
      :cancel-text="isZh() ? '再想想' : 'Think again'"
    >
      <Button>{{ isZh() ? '右侧 + 自定义按钮' : 'Right + custom buttons' }}</Button>
    </Popconfirm>
    <Popconfirm :content="isZh() ? '禁用后点击无效' : 'No effect when disabled'" disabled>
      <Button>{{ isZh() ? '禁用' : 'Disabled' }}</Button>
    </Popconfirm>
  </div>
</template>
