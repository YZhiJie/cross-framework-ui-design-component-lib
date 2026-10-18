import type { ComponentMeta } from '../types';
import BasicVue from './demos/basic.vue';
import BasicTsx from './demos/basic';
import VerticalVue from './demos/vertical.vue';
import VerticalTsx from './demos/vertical';

import basicVueSource from './demos/basic.vue?raw';
import basicTsxSource from './demos/basic.tsx?raw';
import verticalVueSource from './demos/vertical.vue?raw';
import verticalTsxSource from './demos/vertical.tsx?raw';

/** Steps 步骤条文档元数据 */
export const stepsMeta: ComponentMeta = {
  name: 'Steps',
  slug: 'steps',
  title: '步骤条',
  category: 'navigation',
  summary: {
    'zh-CN':
      '引导用户按流程完成任务的导航条，支持水平/垂直两种布局、点击切换步骤与 error 状态标记。',
    'en-US':
      'A navigation bar that guides users through a task flow, with horizontal/vertical layouts, click-to-navigate and error status marking.',
  },
  features: [
    { 'zh-CN': '状态自动推导：小于当前 finish（对勾）、等于 process、大于 wait', 'en-US': 'Auto status derivation: finish (check) before current, process at current, wait after' },
    { 'zh-CN': 'status 覆盖当前步骤状态（error 标记出错步骤）', 'en-US': 'status prop overrides current step state (error marking)' },
    { 'zh-CN': '水平 / 垂直两种布局方向', 'en-US': 'Horizontal and vertical layouts' },
    { 'zh-CN': '点击非禁用步骤切换，配合受控 value 驱动外部流程', 'en-US': 'Click non-disabled steps to navigate; controlled value drives external flow' },
    { 'zh-CN': '双端命令式 API：next / prev / goTo（禁用目标 no-op）', 'en-US': 'Imperative API on both frameworks: next / prev / goTo (disabled targets no-op)' },
    { 'zh-CN': '受控/非受控双模式（value + onChange 约定）', 'en-US': 'Controlled and uncontrolled modes (value + onChange)' },
  ],
  scenarios: [
    { 'zh-CN': '注册、支付等多步流程引导', 'en-US': 'Multi-step flows such as signup and checkout' },
    { 'zh-CN': '物流跟踪、审批流等垂直时间线展示', 'en-US': 'Vertical timelines such as logistics tracking and approval flows' },
    { 'zh-CN': '向导式表单分步填写', 'en-US': 'Wizard-style step-by-step forms' },
  ],
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '基础用法', 'en-US': 'Basic Usage' },
      description: {
        'zh-CN': '受控 value 驱动当前步骤，点击步骤标题亦可切换；status="error" 将当前步骤标记为出错（渲染叉图标）。',
        'en-US':
          'Controlled value drives the current step; clicking a step title also navigates. status="error" marks the current step as failed (cross icon).',
      },
      vueComponent: BasicVue,
      reactComponent: BasicTsx,
      vueSource: basicVueSource,
      reactSource: basicTsxSource,
    },
    {
      id: 'vertical',
      title: { 'zh-CN': '垂直步骤条', 'en-US': 'Vertical Steps' },
      description: {
        'zh-CN': 'direction="vertical" 切换为垂直布局，连接线转为纵向，适合时间线类展示。',
        'en-US':
          'direction="vertical" switches to vertical layout with a vertical connector — suitable for timeline displays.',
      },
      vueComponent: VerticalVue,
      reactComponent: VerticalTsx,
      vueSource: verticalVueSource,
      reactSource: verticalTsxSource,
    },
  ],
  api: {
    props: [
      {
        name: 'items',
        type: 'StepItem[]',
        default: '—',
        required: true,
        description: {
          'zh-CN': '步骤数据（key/title/description/disabled）',
          'en-US': 'Step data (key/title/description/disabled)',
        },
      },
      {
        name: 'value',
        type: 'number',
        default: '—',
        description: {
          'zh-CN': '受控当前步骤索引（提供即受控，0 起）',
          'en-US': 'Controlled current step index (0-based)',
        },
      },
      {
        name: 'defaultValue',
        type: 'number',
        default: '0',
        description: { 'zh-CN': '非受控初始步骤索引（负数回退 0）', 'en-US': 'Initial uncontrolled index (negative falls back to 0)' },
      },
      {
        name: 'status',
        type: "'wait' | 'process' | 'finish' | 'error'",
        default: "'process'",
        description: {
          'zh-CN': '当前步骤的状态覆盖（error 渲染叉图标）',
          'en-US': 'Status override for the current step (error renders a cross icon)',
        },
      },
      {
        name: 'direction',
        type: "'horizontal' | 'vertical'",
        default: "'horizontal'",
        description: { 'zh-CN': '布局方向', 'en-US': 'Layout direction' },
      },
      {
        name: 'className',
        type: 'string',
        default: '—',
        description: { 'zh-CN': '附加到根节点的自定义类名', 'en-US': 'Extra class on the root element' },
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
        payload: 'number',
        description: {
          'zh-CN': '当前步骤变更时触发（点击非禁用步骤或命令式 API）',
          'en-US': 'Fires when the current step changes (click or imperative API)',
        },
      },
    ],
    slots: [],
    methods: [
      {
        name: 'next',
        signature: '() => void',
        description: {
          'zh-CN': '切换到下一步（越界或目标项禁用时 no-op）',
          'en-US': 'Go to the next step (no-op when out of range or target disabled)',
        },
      },
      {
        name: 'prev',
        signature: '() => void',
        description: {
          'zh-CN': '切换到上一步（越界或目标项禁用时 no-op）',
          'en-US': 'Go to the previous step (no-op when out of range or target disabled)',
        },
      },
      {
        name: 'goTo',
        signature: '(index: number) => void',
        description: {
          'zh-CN': '切换到指定步骤（越界或目标项禁用时 no-op）',
          'en-US': 'Go to the given step (no-op when out of range or target disabled)',
        },
      },
    ],
    types: [
      {
        name: 'StepItem',
        definition: `type StepItem = {
  key: string;
  title: string;
  description?: string;
  disabled?: boolean;
};`,
        description: {
          'zh-CN': '步骤项结构；disabled 步骤点击与命令式切换均 no-op',
          'en-US': 'Step item shape; disabled steps ignore clicks and imperative navigation',
        },
      },
    ],
  },
  notes: [
    {
      'zh-CN': '点击当前步骤本身不触发 change（重复选中 no-op）。',
      'en-US': 'Clicking the current step does not fire change (duplicate selection is a no-op).',
    },
    {
      'zh-CN': 'next/prev 不会自动跳过禁用步骤：目标被禁用时保持不动，由业务层决定绕行。',
      'en-US':
        'next/prev do not skip disabled steps automatically: navigation stops at a disabled target for the business layer to reroute.',
    },
    {
      'zh-CN': '连接线仅在相邻步骤间渲染，最后一项不渲染出线。',
      'en-US': 'Connectors render only between adjacent steps; the last item has no outgoing line.',
    },
  ],
  a11y: [
    {
      'zh-CN': '根节点为 list 角色，步骤项为 listitem；当前步骤带 aria-current="step"，禁用步骤带 aria-disabled。',
      'en-US':
        'Root uses the list role with listitem steps; current step has aria-current="step" and disabled steps aria-disabled.',
    },
  ],
};
