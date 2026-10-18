<script setup lang="ts">
import { ref } from 'vue';
import { Button, Drawer } from '@xui-design/vue';
import { isZh } from '../../../i18n';

const visible = ref(false);
</script>

<template>
  <div class="demo-column">
    <Button type="primary" @click="visible = true">{{
      isZh() ? '打开抽屉' : 'Open drawer'
    }}</Button>
    <Drawer
      v-model:visible="visible"
      :title="isZh() ? '编辑资料' : 'Edit profile'"
      @close="visible = false"
    >
      <p>
        {{
          isZh()
            ? '这是一段抽屉内容，可承载表单或详情信息。'
            : 'Drawer body text. Use it for forms or detail information.'
        }}
      </p>
      <template #footer>
        <Button @click="visible = false">{{ isZh() ? '取消' : 'Cancel' }}</Button>
        <Button type="primary" @click="visible = false">{{ isZh() ? '确认' : 'Confirm' }}</Button>
      </template>
    </Drawer>
  </div>
</template>
