import type { ComponentMeta } from '../types';
import BasicVue from './demos/basic.vue';
import BasicTsx from './demos/basic';
import MultipleVue from './demos/multiple.vue';
import MultipleTsx from './demos/multiple';

import basicVueSource from './demos/basic.vue?raw';
import basicTsxSource from './demos/basic.tsx?raw';
import multipleVueSource from './demos/multiple.vue?raw';
import multipleTsxSource from './demos/multiple.tsx?raw';

/** TreeSelect 树选择文档元数据 */
export const treeSelectMeta: ComponentMeta = {
  name: 'TreeSelect',
  slug: 'tree-select',
  title: '树选择',
  category: 'form',
  summary: {
    'zh-CN':
      '以树形结构展示选项的下拉选择器，适用于层级数据选择场景。单选点击节点即选中；多选模式提供勾选框与级联勾选。',
    'en-US':
      'A dropdown selector that presents options in a tree structure for hierarchical data. Click a node to select in single mode; multiple mode offers checkboxes with cascade checking.',
  },
  features: [
    {
      'zh-CN': '单选：点击节点即选中并收起面板，选中后展示节点文案',
      'en-US': 'Single: click a node to select and close the panel',
    },
    {
      'zh-CN': '多选：勾选框 + 级联勾选，父级由后代叶子推导勾选态（半选），面板保持展开',
      'en-US':
        'Multiple: checkboxes with cascading; parent state derived from descendant leaves (indeterminate supported)',
    },
    {
      'zh-CN': 'checkStrictly 开启父子独立勾选，关闭级联',
      'en-US': 'checkStrictly disables cascading for independent checking',
    },
    {
      'zh-CN': '已勾选项以标签展示，标签可单个移除，支持一键清空',
      'en-US': 'Checked items render as removable tags with a clear-all button',
    },
    {
      'zh-CN': 'defaultExpandAll 默认展开全部节点',
      'en-US': 'Expand all nodes by default with defaultExpandAll',
    },
    {
      'zh-CN': '受控/非受控双模式（value + onChange 约定）',
      'en-US': 'Controlled and uncontrolled modes (value + onChange)',
    },
    {
      'zh-CN': '双端命令式 API：focus / toggleOpen / close',
      'en-US': 'Imperative API on both frameworks: focus / toggleOpen / close',
    },
    {
      'zh-CN': '内置国际化（请选择文案跟随组件库语言）',
      'en-US': 'Built-in i18n (placeholder follows the library locale)',
    },
  ],
  scenarios: [
    {
      'zh-CN': '组织架构、行政区划等层级数据选择',
      'en-US': 'Selecting from hierarchical data (org charts, regions)',
    },
    { 'zh-CN': '多级分类筛选、权限点勾选', 'en-US': 'Category filtering and permission checking' },
    {
      'zh-CN': '选项量大且具有明确父子关系的表单字段',
      'en-US': 'Form fields with many options that have clear parent-child relations',
    },
  ],
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '基础用法', 'en-US': 'Basic Usage' },
      description: {
        'zh-CN':
          '单选模式下点击节点即选中并收起面板，支持 clearable 一键清空，disabled 节点不可选中。',
        'en-US':
          'In single mode, clicking a node selects it and closes the panel. Clearable empties the value; disabled nodes are not selectable.',
      },
      vueComponent: BasicVue,
      reactComponent: BasicTsx,
      vueSource: basicVueSource,
      reactSource: basicTsxSource,
    },
    {
      id: 'multiple',
      title: { 'zh-CN': '多选与级联勾选', 'en-US': 'Multiple & Cascade' },
      description: {
        'zh-CN':
          'multiple 开启多选：面板内渲染勾选框，勾选父级自动级联全部非禁用后代（父级呈半选态），已勾选项以标签展示、可单个移除；checkStrictly 可关闭级联。',
        'en-US':
          'With multiple enabled, the panel renders checkboxes. Checking a parent cascades to all non-disabled descendants (parents show indeterminate state). Checked items appear as removable tags; set checkStrictly to disable cascading.',
      },
      vueComponent: MultipleVue,
      reactComponent: MultipleTsx,
      vueSource: multipleVueSource,
      reactSource: multipleTsxSource,
    },
  ],
  api: {
    props: [
      {
        name: 'treeData',
        type: 'TreeNode[]',
        default: '—',
        required: true,
        description: {
          'zh-CN': '树形数据（结构同 Tree 组件的 data）',
          'en-US': 'Tree data (same shape as Tree data)',
        },
      },
      {
        name: 'value',
        type: 'string | string[]',
        default: '—',
        description: {
          'zh-CN': '受控选中值（提供即受控）；单选 string，多选 string[]',
          'en-US': 'Controlled value; string in single mode, string[] in multiple mode',
        },
      },
      {
        name: 'defaultValue',
        type: 'string | string[]',
        default: '—',
        description: { 'zh-CN': '非受控初始选中值', 'en-US': 'Initial uncontrolled value' },
      },
      {
        name: 'multiple',
        type: 'boolean',
        default: 'false',
        description: {
          'zh-CN': '多选模式：勾选框 + 级联勾选，面板保持展开',
          'en-US': 'Multiple mode: checkboxes with cascade checking; panel stays open',
        },
      },
      {
        name: 'checkStrictly',
        type: 'boolean',
        default: 'false',
        description: {
          'zh-CN': '多选模式下勾选父子独立（true 时不做级联与勾选态推导）',
          'en-US': 'Check parent and child independently in multiple mode (no cascading)',
        },
      },
      {
        name: 'placeholder',
        type: 'string',
        default: 'locale.treeSelect.placeholder（请选择 / Please select）',
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
          'zh-CN': '显示清空按钮（仅已选中时；多选模式清空全部）',
          'en-US': 'Show clear button when selected; clears all in multiple mode',
        },
      },
      {
        name: 'defaultExpandAll',
        type: 'boolean',
        default: 'false',
        description: {
          'zh-CN': '非受控模式下默认展开全部节点',
          'en-US': 'Expand all nodes by default (uncontrolled)',
        },
      },
      {
        name: 'className',
        type: 'string',
        default: '—',
        description: {
          'zh-CN': '附加到根节点的自定义类名',
          'en-US': 'Extra class on the root element',
        },
      },
      {
        name: 'style',
        type: 'Record<string, string>',
        default: '—',
        description: {
          'zh-CN': '附加到根节点的内联样式（支持 CSS 自定义属性）',
          'en-US': 'Inline style on the root element (CSS custom properties supported)',
        },
      },
    ],
    events: [
      {
        vue: 'change',
        react: 'onChange',
        payload: 'string | string[]',
        description: {
          'zh-CN': '选中值变更时触发；单选载荷为节点 key，多选为勾选 keys（级联）',
          'en-US': 'Fires on value change; node key in single mode, cascaded keys in multiple mode',
        },
      },
      {
        vue: 'clear',
        react: 'onClear',
        payload: '—',
        description: {
          'zh-CN': '点击清空按钮时触发',
          'en-US': 'Fires when the clear button is clicked',
        },
      },
    ],
    slots: [
      {
        vue: 'clearIcon',
        react: 'renderClearIcon',
        description: { 'zh-CN': '自定义清空图标', 'en-US': 'Custom clear icon' },
      },
      {
        vue: 'suffixIcon',
        react: 'renderSuffixIcon',
        description: { 'zh-CN': '自定义下拉箭头图标', 'en-US': 'Custom dropdown arrow icon' },
      },
    ],
    methods: [
      {
        name: 'focus',
        signature: '() => void',
        description: { 'zh-CN': '聚焦触发器', 'en-US': 'Focus the trigger' },
      },
      {
        name: 'toggleOpen',
        signature: '() => void',
        description: {
          'zh-CN': '切换面板展开/收起（disabled 时忽略）',
          'en-US': 'Toggle the panel (ignored when disabled)',
        },
      },
      {
        name: 'close',
        signature: '() => void',
        description: { 'zh-CN': '收起面板', 'en-US': 'Close the panel' },
      },
    ],
    types: [
      {
        name: 'TreeNode',
        definition: `type TreeNode = {
  key: string;
  label: string;
  children?: TreeNode[];
  disabled?: boolean;
  disableCheckbox?: boolean;
};`,
        description: {
          'zh-CN': '树节点结构（与 Tree 组件一致）；disableCheckbox 仅禁用勾选框（多选模式生效）',
          'en-US':
            'Tree node shape (same as Tree); disableCheckbox disables only the checkbox (effective in multiple mode)',
        },
      },
    ],
  },
  notes: [
    {
      'zh-CN':
        '级联勾选口径与 Tree 组件一致：勾选父级联动全部非禁用后代，禁用后代计入父级勾选态推导分母（存在未勾选禁用后代时父级最多半选）。',
      'en-US':
        'Cascade semantics match the Tree component: checking a parent checks all non-disabled descendants, and disabled descendants count toward the parent check-state derivation (indeterminate at most).',
    },
    {
      'zh-CN': '单选模式点击父级节点同样会选中该父级（与 antd TreeSelect 口径一致）。',
      'en-US': 'In single mode, parent nodes are selectable (consistent with antd TreeSelect).',
    },
    {
      'zh-CN':
        '多选模式下标签列表展示全部勾选 keys（含级联产生的后代 keys），移除标签复用级联语义。',
      'en-US':
        'Tags show all checked keys (including cascaded descendants); removing a tag follows cascade semantics.',
    },
    {
      'zh-CN': "清空按钮触发 onChange（单选 ''、多选 []）与 onClear，受控模式下可正常响应。",
      'en-US':
        "The clear button fires onChange (single '', multiple []) plus onClear, working in controlled mode too.",
    },
  ],
  a11y: [
    {
      'zh-CN':
        '触发器使用 combobox 角色，aria-expanded 标注展开状态，Enter/Space 切换、Escape 收起。',
      'en-US':
        'Trigger uses the combobox role with aria-expanded; Enter/Space toggle and Escape closes.',
    },
    {
      'zh-CN':
        '面板使用 dialog 角色并通过 aria-controls 关联触发器；树节点使用 tree/treeitem/group 角色，勾选框 aria-checked 支持 mixed 半选。',
      'en-US':
        'Panel uses the dialog role linked via aria-controls; nodes use tree/treeitem/group roles with aria-checked mixed for indeterminate.',
    },
  ],
};
