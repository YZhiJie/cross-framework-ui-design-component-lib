import type { ComponentMeta } from '../types';

import BasicVue from './demos/basic.vue';
import CheckableVue from './demos/checkable.vue';
import ActionsVue from './demos/actions.vue';
import BasicReact from './demos/basic';
import CheckableReact from './demos/checkable';
import ActionsReact from './demos/actions';

import basicVueSource from './demos/basic.vue?raw';
import checkableVueSource from './demos/checkable.vue?raw';
import actionsVueSource from './demos/actions.vue?raw';
import basicReactSource from './demos/basic.tsx?raw';
import checkableReactSource from './demos/checkable.tsx?raw';
import actionsReactSource from './demos/actions.tsx?raw';

export const treeMeta: ComponentMeta = {
  name: 'Tree',
  slug: 'tree',
  title: '树形控件',
  category: 'display',
  summary: {
    'zh-CN': '以树形结构展示层级数据，支持展开/收起、单选选中与级联勾选。',
    'en-US':
      'Display hierarchical data as a tree, with expand/collapse, single selection, and cascaded checking.',
  },
  features: [
    {
      'zh-CN': '树形 data：通过 children 递归定义层级，节点 key 全树唯一，叶子节点无 children',
      'en-US':
        'Tree-shaped data: levels are defined recursively via children; node keys are unique across the tree; leaf nodes have no children',
    },
    {
      'zh-CN':
        'expandedKeys / checkedKeys / selectedKey 三组状态均支持受控与非受控，Vue 端支持 v-model:expanded-keys / v-model:checked-keys / v-model:selected-key',
      'en-US':
        'expandedKeys / checkedKeys / selectedKey all support controlled and uncontrolled modes; Vue supports v-model:expanded-keys / v-model:checked-keys / v-model:selected-key',
    },
    {
      'zh-CN': 'defaultExpandAll 默认展开全部非叶子节点；defaultExpandedKeys 指定初始展开集合',
      'en-US':
        'defaultExpandAll expands all non-leaf nodes by default; defaultExpandedKeys specifies the initial expanded set',
    },
    {
      'zh-CN':
        'checkable 显示勾选框：父子级联勾选（禁用节点不参与）、半选状态推导、checkStrictly 父子独立',
      'en-US':
        'checkable shows checkboxes: parent-child cascaded checking (disabled nodes excluded), indeterminate state derivation, and checkStrictly for independent checking',
    },
    {
      'zh-CN': 'disabled 整体禁用；节点可单独 disabled（整节点）或 disableCheckbox（仅勾选框）',
      'en-US':
        'disabled disables the whole tree; individual nodes support disabled (entire node) or disableCheckbox (checkbox only)',
    },
    {
      'zh-CN': 'ref 命令式 API：expandAll / collapseAll / checkAll / uncheckAll，双端一致',
      'en-US':
        'Imperative ref API: expandAll / collapseAll / checkAll / uncheckAll, identical on both frameworks',
    },
  ],
  scenarios: [
    {
      'zh-CN': '文件目录、组织架构、分类树等层级数据的展示与选择场景。',
      'en-US':
        'Display and selection of hierarchical data such as file directories, org charts, and category trees.',
    },
  ],
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '基础用法', 'en-US': 'Basic' },
      description: {
        'zh-CN': '树形 data 渲染层级结构，defaultExpandAll 展开全部，点击标题选中节点。',
        'en-US':
          'Tree-shaped data renders the hierarchy; defaultExpandAll expands everything; clicking a title selects the node.',
      },
      vueComponent: BasicVue,
      reactComponent: BasicReact,
      vueSource: basicVueSource,
      reactSource: basicReactSource,
    },
    {
      id: 'checkable',
      title: { 'zh-CN': '勾选模式', 'en-US': 'Checkable' },
      description: {
        'zh-CN':
          'checkable 开启勾选框，勾选父级级联勾选全部非禁用后代；禁用节点不参与级联且计入父级半选推导。',
        'en-US':
          'checkable enables checkboxes; checking a parent cascades to all enabled descendants; disabled nodes are excluded from cascading but counted in parent indeterminate derivation.',
      },
      vueComponent: CheckableVue,
      reactComponent: CheckableReact,
      vueSource: checkableVueSource,
      reactSource: checkableReactSource,
    },
    {
      id: 'actions',
      title: { 'zh-CN': '命令式操作', 'en-US': 'Imperative API' },
      description: {
        'zh-CN':
          '通过 ref 调用 expandAll / collapseAll / checkAll / uncheckAll，受控 checkedKeys 配合 v-model 同步。',
        'en-US':
          'Call expandAll / collapseAll / checkAll / uncheckAll via ref; controlled checkedKeys sync via v-model.',
      },
      vueComponent: ActionsVue,
      reactComponent: ActionsReact,
      vueSource: actionsVueSource,
      reactSource: actionsReactSource,
    },
  ],
  api: {
    props: [
      {
        name: 'data',
        type: 'TreeNode[]',
        default: '—',
        required: true,
        description: { 'zh-CN': '树形数据', 'en-US': 'Tree-shaped data' },
      },
      {
        name: 'expandedKeys',
        type: 'string[]',
        default: '—',
        description: {
          'zh-CN': '受控展开的 key 列表（提供即受控）',
          'en-US': 'Controlled expanded keys (controlled when provided)',
        },
      },
      {
        name: 'defaultExpandedKeys',
        type: 'string[]',
        default: '—',
        description: {
          'zh-CN': '非受控初始展开的 key 列表',
          'en-US': 'Uncontrolled initial expanded keys',
        },
      },
      {
        name: 'checkedKeys',
        type: 'string[]',
        default: '—',
        description: {
          'zh-CN': '受控勾选的 key 列表（提供即受控；仅 checkable 时生效）',
          'en-US':
            'Controlled checked keys (controlled when provided; only effective with checkable)',
        },
      },
      {
        name: 'defaultCheckedKeys',
        type: 'string[]',
        default: '—',
        description: {
          'zh-CN': '非受控初始勾选的 key 列表',
          'en-US': 'Uncontrolled initial checked keys',
        },
      },
      {
        name: 'selectedKey',
        type: 'string | null',
        default: '—',
        description: {
          'zh-CN': '受控选中的 key（提供即受控；null 表示未选中）',
          'en-US': 'Controlled selected key (controlled when provided; null means none selected)',
        },
      },
      {
        name: 'defaultSelectedKey',
        type: 'string | null',
        default: '—',
        description: {
          'zh-CN': '非受控初始选中的 key',
          'en-US': 'Uncontrolled initial selected key',
        },
      },
      {
        name: 'checkable',
        type: 'boolean',
        default: 'false',
        description: {
          'zh-CN': '是否显示勾选框（支持级联勾选与半选推导）',
          'en-US':
            'Whether to show checkboxes (supports cascaded checking and indeterminate derivation)',
        },
      },
      {
        name: 'checkStrictly',
        type: 'boolean',
        default: 'false',
        description: {
          'zh-CN': '勾选父子独立（true 时不做级联勾选与勾选态推导）',
          'en-US': 'Parent-child independent checking (no cascading or state derivation when true)',
        },
      },
      {
        name: 'defaultExpandAll',
        type: 'boolean',
        default: 'false',
        description: {
          'zh-CN': '非受控模式下默认展开全部节点',
          'en-US': 'Expand all nodes by default in uncontrolled mode',
        },
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: { 'zh-CN': '禁用整棵树', 'en-US': 'Disable the whole tree' },
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
        name: 'onExpand',
        type: '(expandedKeys: string[], info: { key: string; expanded: boolean }) => void',
        default: '—',
        description: { 'zh-CN': '展开状态变更回调', 'en-US': 'Expanded state change callback' },
      },
      {
        name: 'onCheck',
        type: '(checkedKeys: string[], info: { key: string; checked: boolean }) => void',
        default: '—',
        description: { 'zh-CN': '勾选状态变更回调', 'en-US': 'Checked state change callback' },
      },
      {
        name: 'onSelect',
        type: '(selectedKey: string | null, info: { key: string }) => void',
        default: '—',
        description: { 'zh-CN': '选中状态变更回调', 'en-US': 'Selected state change callback' },
      },
    ],
    events: [
      {
        vue: 'expand',
        react: 'onExpand',
        payload: 'expandedKeys: string[], info: { key: string; expanded: boolean }',
        description: {
          'zh-CN': '节点展开/收起时触发',
          'en-US': 'Fired when a node is expanded or collapsed',
        },
      },
      {
        vue: 'check',
        react: 'onCheck',
        payload: 'checkedKeys: string[], info: { key: string; checked: boolean }',
        description: {
          'zh-CN': '节点勾选状态变更时触发',
          'en-US': 'Fired when a node checked state changes',
        },
      },
      {
        vue: 'select',
        react: 'onSelect',
        payload: 'selectedKey: string | null, info: { key: string }',
        description: { 'zh-CN': '节点选中时触发', 'en-US': 'Fired when a node is selected' },
      },
      {
        vue: 'update:expandedKeys / update:checkedKeys / update:selectedKey',
        react: '—',
        payload: 'string[] / string[] / string | null',
        description: {
          'zh-CN': '对应 v-model:expanded-keys / v-model:checked-keys / v-model:selected-key 回写',
          'en-US':
            'Write-back for v-model:expanded-keys / v-model:checked-keys / v-model:selected-key',
        },
      },
    ],
    slots: [
      {
        vue: 'title',
        react: 'renderTitle',
        description: {
          'zh-CN': '自定义节点标题（Vue scope 含 node；React 为 (node) => ReactNode）',
          'en-US': 'Custom node title (Vue scope receives node; React is (node) => ReactNode)',
        },
      },
    ],
    methods: [
      {
        name: 'expandAll',
        signature: 'expandAll(): void',
        description: { 'zh-CN': '展开全部非叶子节点', 'en-US': 'Expand all non-leaf nodes' },
      },
      {
        name: 'collapseAll',
        signature: 'collapseAll(): void',
        description: { 'zh-CN': '收起全部节点', 'en-US': 'Collapse all nodes' },
      },
      {
        name: 'checkAll',
        signature: 'checkAll(): void',
        description: {
          'zh-CN': '勾选全部非禁用节点（disabled / disableCheckbox 除外）',
          'en-US': 'Check all enabled nodes (excluding disabled / disableCheckbox)',
        },
      },
      {
        name: 'uncheckAll',
        signature: 'uncheckAll(): void',
        description: { 'zh-CN': '清空全部勾选', 'en-US': 'Clear all checks' },
      },
    ],
    types: [
      {
        name: 'TreeNode',
        definition: `interface TreeNode {
  key: string
  label: string
  children?: TreeNode[]
  disabled?: boolean
  disableCheckbox?: boolean
}`,
        description: {
          'zh-CN':
            '树节点（key 全树唯一；children 非空表示非叶子；disabled 禁用整节点；disableCheckbox 仅禁用勾选框）。',
          'en-US':
            'A tree node (key is unique across the tree; non-empty children means non-leaf; disabled disables the entire node; disableCheckbox disables only the checkbox).',
        },
      },
    ],
  },
  notes: [
    {
      'zh-CN':
        '三组状态（expandedKeys / checkedKeys / selectedKey）各自独立受控：提供对应 prop 即进入受控模式，未提供则内部自维护（可用 defaultXxx 指定初始值）。',
      'en-US':
        'The three state groups (expandedKeys / checkedKeys / selectedKey) are independently controlled: providing the prop enters controlled mode; otherwise the component maintains internal state (defaultXxx sets the initial value).',
    },
    {
      'zh-CN':
        '级联勾选口径：勾选父级会勾选全部非禁用后代（含中间节点）；半选父级点击后勾选全部非禁用后代；取消已全选父级会移除全部后代勾选。禁用节点不参与级联勾选，但计入父级勾选态推导的分母——存在未勾选的禁用后代时父级最多显示半选。',
      'en-US':
        'Cascade semantics: checking a parent checks all enabled descendants (including intermediate nodes); clicking an indeterminate parent checks all enabled descendants; unchecking a fully-checked parent removes all descendant checks. Disabled nodes are excluded from cascading but counted in the parent state derivation—an unchecked disabled descendant caps the parent at indeterminate.',
    },
    {
      'zh-CN': 'checkStrictly=true 时勾选父子完全独立，仅按自身 key 精确匹配，无级联与半选态。',
      'en-US':
        'With checkStrictly=true, checking is fully independent per node, matched by its own key only, with no cascading or indeterminate state.',
    },
  ],
  a11y: [
    {
      'zh-CN':
        '根容器 role=tree，节点 role=treeitem，子级容器 role=group；勾选框 role=checkbox（aria-checked 支持 mixed 半选态）；非叶子节点 aria-expanded 反映展开状态。',
      'en-US':
        'The root has role=tree, nodes role=treeitem, child groups role=group; checkboxes use role=checkbox (aria-checked supports mixed for indeterminate); non-leaf nodes reflect expansion via aria-expanded.',
    },
  ],
};
