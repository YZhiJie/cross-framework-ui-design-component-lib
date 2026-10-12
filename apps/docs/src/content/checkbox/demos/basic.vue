<script setup lang="ts">
import { ref } from 'vue';
import { Checkbox } from '@xui-design/vue';
import { isZh } from '../../../i18n';

const checked = ref(true);
</script>

<template>
  <div class="demo-column">
    <Checkbox v-model:value="checked">{{
      isZh() ? '我已阅读并同意用户协议' : 'I have read and agree to the user agreement'
    }}</Checkbox>
    <p class="demo-text">
      {{ isZh() ? '当前选中' : 'Selected' }}：{{
        isZh() ? (checked ? '是' : '否') : checked ? 'Yes' : 'No'
      }}
    </p>
  </div>
</template>
