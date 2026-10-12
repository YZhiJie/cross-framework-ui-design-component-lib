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
  summary: {
    'zh-CN':
      '在一组互斥选项中选择一个，由 RadioGroup 管理选中值，Radio 作为子项；也支持 options 数组配置。',
    'en-US':
      'Select one option from a mutually exclusive set. RadioGroup manages the selected value with Radio as the child item; an options array is also supported.',
  },
  features: [
    {
      'zh-CN': 'RadioGroup 受控 / 非受控双模式，Vue 端支持 v-model:value',
      'en-US': 'Controlled and uncontrolled modes for RadioGroup; v-model:value on Vue',
    },
    {
      'zh-CN': '两种渲染方式：Radio 子组件插槽，或 options 配置数组（二者取其一，options 优先）',
      'en-US':
        'Two rendering approaches: Radio child components via slot, or an options config array (choose one; options takes precedence)',
    },
    {
      'zh-CN': '支持整组 disabled 与单个选项 disabled（叠加生效）',
      'en-US': 'Supports disabling the whole group or individual options (effects stack)',
    },
    {
      'zh-CN': 'Radio 自身不维护状态、不发事件，选中统一由组上下文派生',
      'en-US':
        'Radio itself holds no state and emits no events; selection is derived from the group context',
    },
  ],
  scenarios: [
    {
      'zh-CN': '互斥条件选择、设置项中的单一选择、表单枚举字段等场景。',
      'en-US':
        'Mutually exclusive choices, single-choice settings, enum form fields, and similar scenarios.',
    },
  ],
  demos: [
    {
      id: 'group',
      title: { 'zh-CN': 'Radio 子组件', 'en-US': 'Radio Children' },
      description: {
        'zh-CN': '在 RadioGroup 默认插槽中放置 Radio，value 为选项取值。',
        'en-US': 'Place Radio in the RadioGroup default slot; value is the option value.',
      },
      vueComponent: GroupVue,
      reactComponent: GroupReact,
      vueSource: groupVueSource,
      reactSource: groupReactSource,
    },
    {
      id: 'options',
      title: { 'zh-CN': 'options 配置与整组禁用', 'en-US': 'options Config & Group Disabled' },
      description: {
        'zh-CN': '传入 options 数组即可渲染；disabled 作用于整组。',
        'en-US': 'Pass an options array to render the group; disabled applies to the whole group.',
      },
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
        description: {
          'zh-CN': '【Group】受控选中值（提供即受控）',
          'en-US': '[Group] Controlled selected value (controlled when provided)',
        },
      },
      {
        name: 'defaultValue',
        type: 'string',
        default: '—',
        description: {
          'zh-CN': '【Group】非受控初始选中值',
          'en-US': '[Group] Uncontrolled initial selected value',
        },
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: {
          'zh-CN': '【Group】禁用整组',
          'en-US': '[Group] Disable the whole group',
        },
      },
      {
        name: 'options',
        type: 'RadioOption[]',
        default: '—',
        description: {
          'zh-CN': '【Group】选项数组（提供后忽略子组件插槽）',
          'en-US': '[Group] Options array (the child component slot is ignored when provided)',
        },
      },
      {
        name: 'onChange',
        type: '(value: string) => void',
        default: '—',
        description: {
          'zh-CN': '【Group】选中值变更回调',
          'en-US': '[Group] Selected value change callback',
        },
      },
      {
        name: 'Radio.value',
        type: 'string',
        default: '—',
        required: true,
        description: {
          'zh-CN': '【Radio 子项】选项取值（必填，组内唯一）',
          'en-US': '[Radio item] Option value (required, unique within the group)',
        },
      },
      {
        name: 'Radio.disabled',
        type: 'boolean',
        default: 'false',
        description: {
          'zh-CN': '【Radio 子项】禁用当前选项（与组禁用叠加）',
          'en-US': '[Radio item] Disable this option (stacks with group disabled)',
        },
      },
      {
        name: 'className',
        type: 'string',
        default: '—',
        description: {
          'zh-CN': '附加到根节点的自定义类名',
          'en-US': 'Custom class name appended to the root element',
        },
      },
      {
        name: 'style',
        type: 'Record<string, string>',
        default: '—',
        description: {
          'zh-CN': '附加到根节点的自定义样式',
          'en-US': 'Custom styles appended to the root element',
        },
      },
    ],
    events: [
      {
        vue: 'change',
        react: 'onChange',
        payload: 'value: string',
        description: {
          'zh-CN': '选中值变更（由 Group 触发）',
          'en-US': 'Fired when the selected value changes (emitted by the Group)',
        },
      },
      {
        vue: 'update:value',
        react: '—',
        payload: 'string',
        description: { 'zh-CN': 'v-model:value 回写', 'en-US': 'Write-back for v-model:value' },
      },
    ],
    slots: [
      {
        vue: 'default',
        react: 'children',
        description: {
          'zh-CN':
            '【Group】自定义选项（渲染 Radio 子项，options 存在时忽略）；【Radio 子项】选项文案',
          'en-US':
            '[Group] Custom options (renders Radio children; ignored when options is present); [Radio item] option label',
        },
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
        description: {
          'zh-CN': 'options 数组中的单项配置。',
          'en-US': 'Configuration of a single item in the options array.',
        },
      },
    ],
  },
  notes: [
    {
      'zh-CN':
        'Radio 必须放在 RadioGroup 内使用，其选中态由组上下文决定，不要单独给 Radio 传 value 受控。',
      'en-US':
        'Radio must be used inside a RadioGroup; its checked state comes from the group context, so do not control Radio with its own value.',
    },
    {
      'zh-CN':
        'options 模式下单项禁用通过该选项的 disabled: true 配置；插槽模式下在 <Radio> 上设置 disabled。',
      'en-US':
        'In options mode, disable an item via disabled: true on that option; in slot mode, set disabled on the <Radio> itself.',
    },
  ],
  a11y: [
    {
      'zh-CN': '组内选项使用原生 radio 语义并共享同一分组名，方向键可在组内移动选择。',
      'en-US':
        'Options use native radio semantics and share one group name; arrow keys move the selection within the group.',
    },
  ],
};
