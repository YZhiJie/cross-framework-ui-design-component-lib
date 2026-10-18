<script setup lang="ts">
import { ref } from 'vue';
import { TimePicker } from '@xui-design/vue';
import { isZh } from '../../../i18n';

const value = ref('09:30');
</script>

<template>
  <div class="demo-column">
    <TimePicker v-model:value="value" format="HH:mm" :hour-step="2" :minute-step="10" clearable />
    <p class="demo-text">
      {{
        isZh()
          ? `format="HH:mm" 仅显示时分；hourStep=2，minuteStep=10`
          : `format="HH:mm" shows hours & minutes only; hourStep=2, minuteStep=10`
      }}
    </p>
  </div>
</template>
