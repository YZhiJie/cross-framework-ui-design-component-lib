import type { ComponentMeta } from '../types';

import GroupVue from './demos/group.vue';
import OptionsVue from './demos/options.vue';
import GroupReact from './demos/group';
import OptionsReact from './demos/options';

import groupVueSource from './demos/group.vue?raw';
import optionsVueSource from './demos/options.vue?raw';
import groupReactSource from './demos/group.tsx?raw';
import optionsReactSource from './demos/options.tsx?raw';

export const radioMeta: ComponentMeta = {
  name: 'Radio',
  slug: 'radio',
  title: '单选框',
  category: 'form',
  summary:
    '在一组互斥选项中选择一个，由 RadioGroup 管理选中值，Radio 作为子项；也支持 options 数组配置。',
  features: [
    'RadioGroup 受控 / 非受控双模式，Vue 端支持 v-model:value',
    '两种渲染方式：Radio 子组件插槽，或 options 配置数组（二者取其一，options 优先）',
    '支持整组 disabled 与单个选项 disabled（叠加生效）',
    'Radio 自身不维护状态、不发事件，选中统一由组上下文派生',
  ],
  scenarios: ['互斥条件选择、设置项中的单一选择、表单枚举字段等场景。'],
  demos: [
    {
      id: 'group',
      title: 'Radio 子组件',
      description: '在 RadioGroup 默认插槽中放置 Radio，value 为选项取值。',
      vueComponent: GroupVue,
      reactComponent: GroupReact,
      vueSource: groupVueSource,
      reactSource: groupReactSource,
    },
    {
      id: 'options',
      title: 'options 配置与整组禁用',
      description: '传入 options 数组即可渲染；disabled 作用于整组。',
      vueComponent: OptionsVue,
      reactComponent: OptionsReact,
      vueSource: optionsVueSource,
      reactSource: optionsReactSource,
    },
  ],
  api: {
    props: [
      {
        name: 'value',
        type: 'string',
        default: '—',
        description: '【Group】受控选中值（提供即受控）',
      },
      {
        name: 'defaultValue',
        type: 'string',
        default: '—',
        description: '【Group】非受控初始选中值',
      },
      { name: 'disabled', type: 'boolean', default: 'false', description: '【Group】禁用整组' },
      {
        name: 'options',
        type: 'RadioOption[]',
        default: '—',
        description: '【Group】选项数组（提供后忽略子组件插槽）',
      },
      {
        name: 'onChange',
        type: '(value: string) => void',
        default: '—',
        description: '【Group】选中值变更回调',
      },
      {
        name: 'Radio.value',
        type: 'string',
        default: '—',
        required: true,
        description: '【Radio 子项】选项取值（必填，组内唯一）',
      },
      {
        name: 'Radio.disabled',
        type: 'boolean',
        default: 'false',
        description: '【Radio 子项】禁用当前选项（与组禁用叠加）',
      },
    ],
    events: [
      {
        vue: 'change',
        react: 'onChange',
        payload: 'value: string',
        description: '选中值变更（由 Group 触发）',
      },
      { vue: 'update:value', react: '—', payload: 'string', description: 'v-model:value 回写' },
    ],
    slots: [
      {
        vue: 'default',
        react: 'children',
        description:
          '【Group】自定义选项（渲染 Radio 子项，options 存在时忽略）；【Radio 子项】选项文案',
      },
    ],
    types: [
      {
        name: 'RadioOption',
        definition: `interface RadioOption {
  label: string
  value: string
  disabled?: boolean
}`,
        description: 'options 数组中的单项配置。',
      },
    ],
  },
  notes: [
    'Radio 必须放在 RadioGroup 内使用，其选中态由组上下文决定，不要单独给 Radio 传 value 受控。',
    'options 模式下单项禁用通过该选项的 disabled: true 配置；插槽模式下在 <Radio> 上设置 disabled。',
  ],
  a11y: ['组内选项使用原生 radio 语义并共享同一分组名，方向键可在组内移动选择。'],
};
