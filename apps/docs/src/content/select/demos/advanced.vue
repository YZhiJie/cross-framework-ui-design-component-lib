<script setup lang="ts">
import { ref, computed } from 'vue';
import { Select } from '@xui-design/vue';
import type { SelectOption } from '@xui-design/core';
import { isZh } from '../../../i18n';

const basicOptions = computed<SelectOption[]>(() =>
  isZh()
    ? [
        { label: '北京', value: 'beijing' },
        { label: '上海', value: 'shanghai' },
        { label: '广州', value: 'guangzhou' },
        { label: '深圳', value: 'shenzhen' },
      ]
    : [
        { label: 'Beijing', value: 'beijing' },
        { label: 'Shanghai', value: 'shanghai' },
        { label: 'Guangzhou', value: 'guangzhou' },
        { label: 'Shenzhen', value: 'shenzhen' },
      ],
);

const bigOptions = computed<SelectOption[]>(() =>
  Array.from({ length: 1000 }, (_, i) => ({
    label: isZh() ? `选项 ${i + 1}` : `Option ${i + 1}`,
    value: `opt-${i + 1}`,
  })),
);

const cities = ref<string[]>(['beijing']);
const searched = ref('');
const virtualValue = ref('');
</script>

<template>
  <div class="demo-column">
    <Select
      v-model:value="cities"
      :options="basicOptions"
      multiple
      :placeholder="isZh() ? '多选城市' : 'Multi-select cities'"
    />
    <p class="demo-text">
      {{ isZh() ? '多选已选' : 'Multi-selected' }}：{{
        cities.join(isZh() ? '、' : ', ') || (isZh() ? '（无）' : '(none)')
      }}
    </p>

    <Select
      v-model:value="searched"
      :options="basicOptions"
      searchable
      clearable
      :placeholder="isZh() ? '输入关键字过滤' : 'Type a keyword to filter'"
    />
    <p class="demo-text">
      {{ isZh() ? '可搜索当前选中' : 'Searchable selected' }}：{{
        searched || (isZh() ? '（未选择）' : '(none)')
      }}
    </p>

    <Select
      v-model:value="virtualValue"
      :options="bigOptions"
      virtual
      :max-height="200"
      :placeholder="isZh() ? '虚拟滚动 · 1000 项' : 'Virtual scroll · 1000 items'"
    />
    <p class="demo-text">
      {{ isZh() ? '虚拟滚动当前选中' : 'Virtual scroll selected' }}：{{
        virtualValue || (isZh() ? '（未选择）' : '(none)')
      }}
    </p>
  </div>
</template>
