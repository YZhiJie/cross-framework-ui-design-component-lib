/**
 * 文档站内容注册表
 *
 * - CATEGORIES：组件分类（驱动侧边栏与首页分组）
 * - COMPONENT_LIST：24 个组件全量规划清单，available 标记文档是否已上线
 * - componentMetas / componentMetaMap：已上线组件的结构化元数据
 */
import type { CategoryKey, ComponentEntry, ComponentMeta } from './types';

import { buttonMeta } from './button/meta';
import { switchMeta } from './switch/meta';
import { tableMeta } from './table/meta';
import { messageMeta } from './message/meta';

export const CATEGORIES: { key: CategoryKey; title: string }[] = [
  { key: 'basic', title: '基础组件' },
  { key: 'form', title: '表单交互' },
  { key: 'display', title: '数据展示' },
  { key: 'navigation', title: '导航布局' },
  { key: 'feedback', title: '反馈提示' },
];

export const COMPONENT_LIST: ComponentEntry[] = [
  // 基础组件
  { name: 'Button', slug: 'button', title: '按钮', category: 'basic', available: true },
  { name: 'Input', slug: 'input', title: '输入框', category: 'basic', available: false },
  { name: 'Modal', slug: 'modal', title: '对话框', category: 'basic', available: false },
  // 表单交互
  { name: 'Switch', slug: 'switch', title: '开关', category: 'form', available: true },
  { name: 'Checkbox', slug: 'checkbox', title: '复选框', category: 'form', available: false },
  { name: 'Radio', slug: 'radio', title: '单选框', category: 'form', available: false },
  { name: 'Select', slug: 'select', title: '下拉选择', category: 'form', available: false },
  {
    name: 'DatePicker',
    slug: 'date-picker',
    title: '日期选择',
    category: 'form',
    available: false,
  },
  {
    name: 'InputNumber',
    slug: 'input-number',
    title: '数字输入',
    category: 'form',
    available: false,
  },
  // 数据展示
  { name: 'Tag', slug: 'tag', title: '标签', category: 'display', available: false },
  { name: 'Progress', slug: 'progress', title: '进度条', category: 'display', available: false },
  { name: 'Badge', slug: 'badge', title: '徽标数', category: 'display', available: false },
  { name: 'Avatar', slug: 'avatar', title: '头像', category: 'display', available: false },
  { name: 'Empty', slug: 'empty', title: '空状态', category: 'display', available: false },
  { name: 'Skeleton', slug: 'skeleton', title: '骨架屏', category: 'display', available: false },
  { name: 'Table', slug: 'table', title: '表格', category: 'display', available: true },
  // 导航布局
  { name: 'Tabs', slug: 'tabs', title: '标签页', category: 'navigation', available: false },
  {
    name: 'Pagination',
    slug: 'pagination',
    title: '分页',
    category: 'navigation',
    available: false,
  },
  {
    name: 'Breadcrumb',
    slug: 'breadcrumb',
    title: '面包屑',
    category: 'navigation',
    available: false,
  },
  // 反馈提示
  { name: 'Alert', slug: 'alert', title: '警告提示', category: 'feedback', available: false },
  { name: 'Message', slug: 'message', title: '全局提示', category: 'feedback', available: true },
  { name: 'Tooltip', slug: 'tooltip', title: '文字提示', category: 'feedback', available: false },
  { name: 'Spin', slug: 'spin', title: '加载中', category: 'feedback', available: false },
  {
    name: 'Popconfirm',
    slug: 'popconfirm',
    title: '气泡确认',
    category: 'feedback',
    available: false,
  },
];

/** 已上线组件元数据（新增组件文档时在此注册） */
export const componentMetas: ComponentMeta[] = [buttonMeta, switchMeta, tableMeta, messageMeta];

export const componentMetaMap: Map<string, ComponentMeta> = new Map(
  componentMetas.map((meta) => [meta.slug, meta]),
);

/** 按分类分组的组件清单（侧边栏 / 首页复用） */
export const getComponentsByCategory = () =>
  CATEGORIES.map((category) => ({
    category,
    components: COMPONENT_LIST.filter((item) => item.category === category.key),
  }));
