import type { ComponentMeta } from '../types';

import BasicVue from './demos/basic.vue';
import StateVue from './demos/state.vue';
import MultipleVue from './demos/multiple.vue';
import BasicReact from './demos/basic';
import StateReact from './demos/state';
import MultipleReact from './demos/multiple';

import basicVueSource from './demos/basic.vue?raw';
import stateVueSource from './demos/state.vue?raw';
import multipleVueSource from './demos/multiple.vue?raw';
import basicReactSource from './demos/basic.tsx?raw';
import stateReactSource from './demos/state.tsx?raw';
import multipleReactSource from './demos/multiple.tsx?raw';

export const cascaderMeta: ComponentMeta = {
  name: 'Cascader',
  slug: 'cascader',
  title: '级联选择',
  category: 'form',
  summary: {
    'zh-CN': '从逐级展开的树形选项中选择一条路径，支持选到叶子或任意层级即触发。',
    'en-US':
      'Pick a path from a progressively expanding tree of options, either requiring a leaf or firing on any level.',
  },
  features: [
    {
      'zh-CN':
        '受控 / 非受控双模式，值为 string[]（从根到选中节点的值路径），Vue 端支持 v-model:value',
      'en-US':
        'Controlled and uncontrolled modes; the value is a string[] (the value path from root to the selected node); supports v-model:value on Vue',
    },
    {
      'zh-CN': '树形 options：通过 children 递归定义层级，叶子节点无 children',
      'en-US':
        'Tree-shaped options: levels are defined recursively via children; leaf nodes have no children',
    },
    {
      'zh-CN': 'changeOnSelect 选中任意层级即触发 onChange（默认需选到叶子节点）',
      'en-US':
        'changeOnSelect fires onChange on any selected level (the default requires selecting a leaf)',
    },
    {
      'zh-CN': 'separator 自定义路径展示分隔符（默认 " / "）；clearable 已选中时显示清空按钮',
      'en-US':
        'separator customizes the path display separator (default " / "); clearable shows a clear button when a value is selected',
    },
    {
      'zh-CN': 'disabled 整体禁用；选项可单独禁用（disabled: true）',
      'en-US':
        'disabled disables the whole component; individual options can be disabled via disabled: true',
    },
    {
      'zh-CN':
        'multiple 多选模式：value 为 string[][]，支持级联勾选（父子联动）、半选状态、全选/清空、标签管理',
      'en-US':
        'multiple mode: value is string[][]; supports cascaded checking (parent-child linkage), indeterminate state, check all / clear, and tag management',
    },
    {
      'zh-CN': 'checkStrictly 允许多选时选到任意层级（默认仅叶子节点可勾选）',
      'en-US':
        'checkStrictly allows selecting any level in multiple mode (the default only allows leaf nodes)',
    },
  ],
  scenarios: [
    {
      'zh-CN': '省市区、分类目录等具有层级关系的选择场景。',
      'en-US': 'Hierarchical selection such as province / city / district or category trees.',
    },
  ],
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '基础用法', 'en-US': 'Basic' },
      description: {
        'zh-CN': '树形 options，选到叶子节点触发 onChange；支持 clearable 与单项 disabled。',
        'en-US':
          'Tree-shaped options; selecting a leaf fires onChange; supports clearable and per-option disabled.',
      },
      vueComponent: BasicVue,
      reactComponent: BasicReact,
      vueSource: basicVueSource,
      reactSource: basicReactSource,
    },
    {
      id: 'state',
      title: { 'zh-CN': '任意层级选中与分隔符', 'en-US': 'Any-level Selection & Separator' },
      description: {
        'zh-CN': 'changeOnSelect 选中任意层级即触发；separator 自定义路径分隔符。',
        'en-US':
          'changeOnSelect fires on any level; separator customizes the path display separator.',
      },
      vueComponent: StateVue,
      reactComponent: StateReact,
      vueSource: stateVueSource,
      reactSource: stateReactSource,
    },
    {
      id: 'multiple',
      title: { 'zh-CN': '多选模式', 'en-US': 'Multiple Selection' },
      description: {
        'zh-CN':
          'multiple 开启多选，value 为 string[][]；支持父子级联勾选、半选状态、全选/清空，已选项以标签展示可单独删除。',
        'en-US':
          'multiple enables multi-select with value as string[][]; supports parent-child cascaded checking, indeterminate state, check all / clear, and removable tags for selected items.',
      },
      vueComponent: MultipleVue,
      reactComponent: MultipleReact,
      vueSource: multipleVueSource,
      reactSource: multipleReactSource,
    },
  ],
  api: {
    props: [
      {
        name: 'value',
        type: 'string[] | string[][]',
        default: '—',
        description: {
          'zh-CN': '受控选中路径（单选 string[]，多选 string[][]；提供即受控）',
          'en-US':
            'Controlled selected path (string[] for single, string[][] for multiple; controlled when provided)',
        },
      },
      {
        name: 'defaultValue',
        type: 'string[]',
        default: '—',
        description: {
          'zh-CN': '非受控初始选中路径',
          'en-US': 'Uncontrolled initial selected path',
        },
      },
      {
        name: 'options',
        type: 'CascaderOption[]',
        default: '—',
        required: true,
        description: { 'zh-CN': '树形选项数据', 'en-US': 'Tree-shaped option data' },
      },
      {
        name: 'placeholder',
        type: 'string',
        default: '—',
        description: { 'zh-CN': '占位文案', 'en-US': 'Placeholder text' },
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: { 'zh-CN': '禁用状态', 'en-US': 'Disabled state' },
      },
      {
        name: 'clearable',
        type: 'boolean',
        default: 'false',
        description: {
          'zh-CN': '是否显示清空按钮（仅已选中时）',
          'en-US': 'Whether to show the clear button (only when a value is selected)',
        },
      },
      {
        name: 'separator',
        type: 'string',
        default: "' / '",
        description: {
          'zh-CN': '选中路径展示分隔符',
          'en-US': 'Separator for displaying the selected path',
        },
      },
      {
        name: 'changeOnSelect',
        type: 'boolean',
        default: 'false',
        description: {
          'zh-CN': '是否选中任意层级即触发 onChange（默认需选到叶子节点）',
          'en-US':
            'Whether firing onChange on any selected level (the default requires selecting a leaf)',
        },
      },
      {
        name: 'multiple',
        type: 'boolean',
        default: 'false',
        description: {
          'zh-CN': '是否多选模式（value 为 string[][]，支持级联勾选与标签管理）',
          'en-US':
            'Whether to enable multiple selection (value is string[][]; supports cascaded checking and tag management)',
        },
      },
      {
        name: 'checkStrictly',
        type: 'boolean',
        default: 'false',
        description: {
          'zh-CN': '多选模式下是否允许选到任意层级（默认仅叶子节点可勾选）',
          'en-US':
            'Whether to allow selecting any level in multiple mode (the default only allows leaf nodes)',
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
          'zh-CN': '附加到根节点的内联样式',
          'en-US': 'Custom inline styles appended to the root element',
        },
      },
      {
        name: 'onChange',
        type: '(value: string[] | string[][], labels: string[] | string[][]) => void',
        default: '—',
        description: {
          'zh-CN': '选中值变更回调（单选时为路径+文案，多选时为路径数组+文案数组）',
          'en-US':
            'Selected value change callback (path + labels for single; path array + label array for multiple)',
        },
      },
      {
        name: 'onClear',
        type: '() => void',
        default: '—',
        description: { 'zh-CN': '清空回调', 'en-US': 'Clear callback' },
      },
    ],
    events: [
      {
        vue: 'change',
        react: 'onChange',
        payload: 'value: string[], labels: string[]',
        description: {
          'zh-CN': '选中值变更（值路径与文案路径）',
          'en-US': 'Fired when the selected value changes (value path and label path)',
        },
      },
      {
        vue: 'clear',
        react: 'onClear',
        payload: '—',
        description: { 'zh-CN': '清空选中值', 'en-US': 'Fired when the selected value is cleared' },
      },
      {
        vue: 'update:value',
        react: '—',
        payload: 'string[]',
        description: { 'zh-CN': 'v-model:value 回写', 'en-US': 'Write-back for v-model:value' },
      },
    ],
    slots: [
      {
        vue: 'clearIcon',
        react: 'renderClearIcon',
        description: { 'zh-CN': '自定义清除图标', 'en-US': 'Custom clear icon' },
      },
      {
        vue: 'suffixIcon',
        react: 'renderSuffixIcon',
        description: {
          'zh-CN': '自定义后缀（下拉箭头）图标',
          'en-US': 'Custom suffix (dropdown arrow) icon',
        },
      },
    ],
    types: [
      {
        name: 'CascaderOption',
        definition: `interface CascaderOption {
  label: string
  value: string
  children?: CascaderOption[]
  disabled?: boolean
}`,
        description: {
          'zh-CN': '级联选项（树形结构，叶子节点无 children）。',
          'en-US': 'A cascader option (tree-shaped; leaf nodes have no children).',
        },
      },
    ],
  },
  notes: [
    {
      'zh-CN':
        'value 为值路径数组（如 ["east", "hangzhou"]）；空数组表示未选中。多选时 value 为 string[][]（如 [["east","hangzhou"], ["north","beijing"]]）。',
      'en-US':
        'value is a value-path array (e.g. ["east", "hangzhou"]); an empty array means nothing is selected. In multiple mode value is string[][] (e.g. [["east","hangzhou"], ["north","beijing"]]).',
    },
    {
      'zh-CN':
        '点击组件外部会收起面板；单选选中叶子节点后自动收起（changeOnSelect 时选中即收起）；多选面板保持展开。',
      'en-US':
        'Clicking outside closes the panel; selecting a leaf auto-closes in single mode (any selection auto-closes in changeOnSelect mode); the panel stays open in multiple mode.',
    },
    {
      'zh-CN':
        '多选模式下，勾选父节点会级联勾选所有可用后代叶子（禁用项不参与级联）；子级全选时父节点显示勾选，部分勾选时显示半选。存在未勾选的禁用子级时父级最多显示半选。checkStrictly=true 时取消级联，可勾选任意层级。',
      'en-US':
        'In multiple mode, checking a parent cascades to all enabled descendant leaves (disabled options are excluded); the parent shows checked when all children are checked, indeterminate when partially checked. An unchecked disabled child caps the parent at indeterminate. checkStrictly=true disables cascading and allows any level.',
    },
  ],
  a11y: [
    {
      'zh-CN': '触发器 role=combobox，面板 role=dialog；Enter/Space 展开，Esc 收起。',
      'en-US':
        'The trigger has role=combobox and the panel role=dialog; Enter/Space opens and Esc closes.',
    },
  ],
};
