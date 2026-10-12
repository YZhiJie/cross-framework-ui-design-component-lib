<script setup lang="ts">
import { InputNumber } from '@xui-design/vue';
import { isZh } from '../../../i18n';
</script>

<template>
  <div class="demo-column">
    <InputNumber
      :default-value="3"
      :min="1"
      :max="5"
      :placeholder="isZh() ? '非受控，1 - 5' : 'Uncontrolled, 1 - 5'"
    />
    <InputNumber :default-value="8" disabled :placeholder="isZh() ? '禁用态' : 'Disabled'" />
  </div>
</template>
