<script setup lang="ts">
import { ref } from 'vue';
import { Switch } from '@xui-design/vue';
import { isZh } from '../../../i18n';

const value = ref(true);
</script>

<template>
  <div class="demo-column">
    <div class="demo-row">
      <Switch
        v-model:value="value"
        :checked-text="isZh() ? '开启' : 'On'"
        :unchecked-text="isZh() ? '关闭' : 'Off'"
      />
      <Switch default-value checked-text="ON" unchecked-text="OFF" />
      <Switch
        size="sm"
        default-value
        :checked-text="isZh() ? '是' : 'Yes'"
        :unchecked-text="isZh() ? '否' : 'No'"
      />
    </div>
    <div class="demo-row">
      <Switch
        default-value
        :checked-text="isZh() ? '启用超长文本展示' : 'Enabled long text'"
        :unchecked-text="isZh() ? '禁用超长文本展示' : 'Disabled long text'"
      />
    </div>
  </div>
</template>
