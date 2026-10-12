<script setup lang="ts">
/**
 * 组件 API 文档区
 *
 * 按 Props / Events / Slots / 命令式方法 / 契约类型分块渲染表格，
 * 数据全部来自组件 meta.ts，口径对齐 @xui-design/core 的 ComponentSpec。
 * description 为 LText 双语结构，经 t() 按当前语言取值。
 */
import type { ComponentMeta } from '../content/types';
import CodeBlock from './CodeBlock.vue';
import { t } from '../i18n';
import { useUiMessages } from '../i18n/ui-messages';

defineProps<{ api: ComponentMeta['api'] }>();

const ui = useUiMessages();
</script>

<template>
  <div>
    <template v-if="api.props && api.props.length > 0">
      <h3 class="docs-subsection-title">Props</h3>
      <div class="api-table-wrap">
        <table class="api-table">
          <thead>
            <tr>
              <th>{{ ui.api.prop }}</th>
              <th>{{ ui.api.type }}</th>
              <th>{{ ui.api.default }}</th>
              <th>{{ ui.api.description }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in api.props" :key="row.name">
              <td class="api-table__name">
                {{ row.name
                }}<span v-if="row.required" class="api-table__required" :title="ui.api.required"
                  >*</span
                >
              </td>
              <td class="api-table__type">{{ row.type }}</td>
              <td class="api-table__default">{{ row.default }}</td>
              <td>{{ t(row.description) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <template v-if="api.events && api.events.length > 0">
      <h3 class="docs-subsection-title">{{ ui.api.eventsTitle }}</h3>
      <div class="api-table-wrap">
        <table class="api-table">
          <thead>
            <tr>
              <th>{{ ui.api.vueEvent }}</th>
              <th>{{ ui.api.reactCallback }}</th>
              <th>{{ ui.api.payload }}</th>
              <th>{{ ui.api.description }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in api.events" :key="row.vue">
              <td class="api-table__name">{{ row.vue }}</td>
              <td class="api-table__name">{{ row.react }}</td>
              <td class="api-table__type">{{ row.payload }}</td>
              <td>{{ t(row.description) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <template v-if="api.slots && api.slots.length > 0">
      <h3 class="docs-subsection-title">{{ ui.api.slotsTitle }}</h3>
      <div class="api-table-wrap">
        <table class="api-table">
          <thead>
            <tr>
              <th>{{ ui.api.vueSlot }}</th>
              <th>{{ ui.api.reactCallback }}</th>
              <th>{{ ui.api.description }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in api.slots" :key="row.vue">
              <td class="api-table__name">{{ row.vue }}</td>
              <td class="api-table__name">{{ row.react }}</td>
              <td>{{ t(row.description) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <template v-if="api.methods && api.methods.length > 0">
      <h3 class="docs-subsection-title">{{ ui.api.methodsTitle }}</h3>
      <div class="api-table-wrap">
        <table class="api-table">
          <thead>
            <tr>
              <th>{{ ui.api.method }}</th>
              <th>{{ ui.api.signature }}</th>
              <th>{{ ui.api.description }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in api.methods" :key="row.name">
              <td class="api-table__name">{{ row.name }}</td>
              <td class="api-table__type">{{ row.signature }}</td>
              <td>{{ t(row.description) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <template v-if="api.types && api.types.length > 0">
      <h3 class="docs-subsection-title">{{ ui.api.typesTitle }}</h3>
      <div v-for="typeBlock in api.types" :key="typeBlock.name" class="api-type-block">
        <div class="api-type-block__head">
          <span class="api-type-block__name">{{ typeBlock.name }}</span>
          <span v-if="typeBlock.description" class="api-type-block__desc">{{
            t(typeBlock.description)
          }}</span>
        </div>
        <CodeBlock :code="typeBlock.definition" lang="react" />
      </div>
    </template>
  </div>
</template>
