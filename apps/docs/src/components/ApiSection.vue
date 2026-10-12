<script setup lang="ts">
/**
 * 组件 API 文档区
 *
 * 按 Props / Events / Slots / 命令式方法 / 契约类型分块渲染表格，
 * 数据全部来自组件 meta.ts，口径对齐 @xui-design/core 的 ComponentSpec。
 */
import type { ComponentMeta } from '../content/types';
import CodeBlock from './CodeBlock.vue';

defineProps<{ api: ComponentMeta['api'] }>();
</script>

<template>
  <div>
    <template v-if="api.props && api.props.length > 0">
      <h3 class="docs-subsection-title">Props</h3>
      <div class="api-table-wrap">
        <table class="api-table">
          <thead>
            <tr>
              <th>属性</th>
              <th>类型</th>
              <th>默认值</th>
              <th>说明</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in api.props" :key="row.name">
              <td class="api-table__name">
                {{ row.name
                }}<span v-if="row.required" class="api-table__required" title="必填">*</span>
              </td>
              <td class="api-table__type">{{ row.type }}</td>
              <td class="api-table__default">{{ row.default }}</td>
              <td>{{ row.description }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <template v-if="api.events && api.events.length > 0">
      <h3 class="docs-subsection-title">Events / 回调</h3>
      <div class="api-table-wrap">
        <table class="api-table">
          <thead>
            <tr>
              <th>Events（Vue）</th>
              <th>回调（React）</th>
              <th>载荷</th>
              <th>说明</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in api.events" :key="row.vue">
              <td class="api-table__name">{{ row.vue }}</td>
              <td class="api-table__name">{{ row.react }}</td>
              <td class="api-table__type">{{ row.payload }}</td>
              <td>{{ row.description }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <template v-if="api.slots && api.slots.length > 0">
      <h3 class="docs-subsection-title">Slots / 渲染回调</h3>
      <div class="api-table-wrap">
        <table class="api-table">
          <thead>
            <tr>
              <th>插槽（Vue）</th>
              <th>回调（React）</th>
              <th>说明</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in api.slots" :key="row.vue">
              <td class="api-table__name">{{ row.vue }}</td>
              <td class="api-table__name">{{ row.react }}</td>
              <td>{{ row.description }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <template v-if="api.methods && api.methods.length > 0">
      <h3 class="docs-subsection-title">命令式方法</h3>
      <div class="api-table-wrap">
        <table class="api-table">
          <thead>
            <tr>
              <th>方法</th>
              <th>签名</th>
              <th>说明</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in api.methods" :key="row.name">
              <td class="api-table__name">{{ row.name }}</td>
              <td class="api-table__type">{{ row.signature }}</td>
              <td>{{ row.description }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <template v-if="api.types && api.types.length > 0">
      <h3 class="docs-subsection-title">契约类型</h3>
      <div v-for="typeBlock in api.types" :key="typeBlock.name" class="api-type-block">
        <div class="api-type-block__head">
          <span class="api-type-block__name">{{ typeBlock.name }}</span>
          <span v-if="typeBlock.description" class="api-type-block__desc">{{
            typeBlock.description
          }}</span>
        </div>
        <CodeBlock :code="typeBlock.definition" lang="react" />
      </div>
    </template>
  </div>
</template>
