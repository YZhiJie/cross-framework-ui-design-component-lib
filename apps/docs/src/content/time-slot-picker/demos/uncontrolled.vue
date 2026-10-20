<script setup lang="ts">
import { ref } from 'vue';
import { TimeSlotPicker } from '@xui-design/vue';
import { isZh } from '../../../i18n';

const latest = ref<string[]>([]);
</script>

<template>
  <div class="demo-column">
    <TimeSlotPicker
      :default-value="['h:09', 'h:10', 'h:18']"
      granularity="day"
      :show-footer="false"
      @change="latest = $event"
    />
    <span class="demo-text">
      {{ isZh() ? 'onChange：' : 'onChange: ' }}{{ latest.length ? latest.join(', ') : '—' }}
    </span>
  </div>
</template>
