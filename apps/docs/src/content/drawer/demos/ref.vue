<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { Button, Drawer } from '@xui-design/vue';
import type { DrawerRef } from '@xui-design/vue';
import { isZh } from '../../../i18n';

const drawerRef = useTemplateRef<DrawerRef>('drawer');
</script>

<template>
  <div class="demo-column">
    <div class="demo-row">
      <Button type="primary" @click="drawerRef?.open()">{{
        isZh() ? 'ref 打开' : 'Open via ref'
      }}</Button>
      <Button @click="drawerRef?.toggle()">{{ isZh() ? '切换' : 'Toggle' }}</Button>
    </div>
    <Drawer ref="drawer" :title="isZh() ? '命令式抽屉' : 'Imperative drawer'">
      <p>
        {{
          isZh()
            ? '无需维护 visible，直接调用实例 open() / close() / toggle()。'
            : 'No need to maintain visible; call open() / close() / toggle() on the instance.'
        }}
      </p>
      <template #footer>
        <Button type="primary" @click="drawerRef?.close()">{{ isZh() ? '关闭' : 'Close' }}</Button>
      </template>
    </Drawer>
  </div>
</template>
