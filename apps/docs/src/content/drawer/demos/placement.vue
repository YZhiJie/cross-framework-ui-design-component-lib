<script setup lang="ts">
import { ref } from 'vue';
import { Button, Drawer } from '@xui-design/vue';
import type { DrawerPlacement } from '@xui-design/vue';
import { isZh } from '../../../i18n';

const visible = ref(false);
const placement = ref<DrawerPlacement>('right');

const open = (next: DrawerPlacement) => {
  placement.value = next;
  visible.value = true;
};
</script>

<template>
  <div class="demo-column">
    <div class="demo-row">
      <Button @click="open('left')">{{ isZh() ? '左侧' : 'Left' }}</Button>
      <Button @click="open('right')">{{ isZh() ? '右侧' : 'Right' }}</Button>
      <Button @click="open('top')">{{ isZh() ? '顶部' : 'Top' }}</Button>
      <Button @click="open('bottom')">{{ isZh() ? '底部' : 'Bottom' }}</Button>
    </div>
    <Drawer
      v-model:visible="visible"
      :placement="placement"
      :title="isZh() ? '四方向抽屉' : 'Placements'"
      :size="placement === 'top' || placement === 'bottom' ? 240 : 320"
    >
      <p>
        {{
          isZh()
            ? 'placement 控制抽屉滑入方向：left / right / top / bottom。'
            : 'placement controls the slide-in edge: left / right / top / bottom.'
        }}
      </p>
    </Drawer>
  </div>
</template>
