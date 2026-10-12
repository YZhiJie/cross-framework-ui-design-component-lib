/**
 * 文档站内容注册表
 *
 * - CATEGORIES：组件分类（驱动侧边栏与首页分组）
 * - COMPONENT_LIST：24 个组件全量规划清单，available 标记文档是否已上线
 * - componentMetas / componentMetaMap：已上线组件的结构化元数据
 */
import type { CategoryKey, ComponentEntry, ComponentMeta } from './types';
import type { LText } from '../i18n';

import { buttonMeta } from './button/meta';
import { switchMeta } from './switch/meta';
import { tableMeta } from './table/meta';
import { messageMeta } from './message/meta';
import { inputMeta } from './input/meta';
import { modalMeta } from './modal/meta';
import { checkboxMeta } from './checkbox/meta';
import { radioMeta } from './radio/meta';
import { selectMeta } from './select/meta';
import { datePickerMeta } from './date-picker/meta';
import { inputNumberMeta } from './input-number/meta';
import { tagMeta } from './tag/meta';
import { progressMeta } from './progress/meta';
import { badgeMeta } from './badge/meta';
import { avatarMeta } from './avatar/meta';
import { emptyMeta } from './empty/meta';
import { skeletonMeta } from './skeleton/meta';
import { tabsMeta } from './tabs/meta';
import { paginationMeta } from './pagination/meta';
import { breadcrumbMeta } from './breadcrumb/meta';
import { alertMeta } from './alert/meta';
import { tooltipMeta } from './tooltip/meta';
import { spinMeta } from './spin/meta';
import { popconfirmMeta } from './popconfirm/meta';

export const CATEGORIES: { key: CategoryKey; title: LText }[] = [
  { key: 'basic', title: { 'zh-CN': '基础组件', 'en-US': 'Basic' } },
  { key: 'form', title: { 'zh-CN': '表单交互', 'en-US': 'Form' } },
  { key: 'display', title: { 'zh-CN': '数据展示', 'en-US': 'Data Display' } },
  { key: 'navigation', title: { 'zh-CN': '导航布局', 'en-US': 'Navigation' } },
  { key: 'feedback', title: { 'zh-CN': '反馈提示', 'en-US': 'Feedback' } },
];

export const COMPONENT_LIST: ComponentEntry[] = [
  // 基础组件
  { name: 'Button', slug: 'button', title: '按钮', category: 'basic', available: true },
  { name: 'Input', slug: 'input', title: '输入框', category: 'basic', available: true },
  { name: 'Modal', slug: 'modal', title: '对话框', category: 'basic', available: true },
  // 表单交互
  { name: 'Switch', slug: 'switch', title: '开关', category: 'form', available: true },
  { name: 'Checkbox', slug: 'checkbox', title: '复选框', category: 'form', available: true },
  { name: 'Radio', slug: 'radio', title: '单选框', category: 'form', available: true },
  { name: 'Select', slug: 'select', title: '下拉选择', category: 'form', available: true },
  {
    name: 'DatePicker',
    slug: 'date-picker',
    title: '日期选择',
    category: 'form',
    available: true,
  },
  {
    name: 'InputNumber',
    slug: 'input-number',
    title: '数字输入框',
    category: 'form',
    available: true,
  },
  // 数据展示
  { name: 'Tag', slug: 'tag', title: '标签', category: 'display', available: true },
  { name: 'Progress', slug: 'progress', title: '进度条', category: 'display', available: true },
  { name: 'Badge', slug: 'badge', title: '徽标数', category: 'display', available: true },
  { name: 'Avatar', slug: 'avatar', title: '头像', category: 'display', available: true },
  { name: 'Empty', slug: 'empty', title: '空状态', category: 'display', available: true },
  { name: 'Skeleton', slug: 'skeleton', title: '骨架屏', category: 'display', available: true },
  { name: 'Table', slug: 'table', title: '表格', category: 'display', available: true },
  // 导航布局
  { name: 'Tabs', slug: 'tabs', title: '标签页', category: 'navigation', available: true },
  {
    name: 'Pagination',
    slug: 'pagination',
    title: '分页',
    category: 'navigation',
    available: true,
  },
  {
    name: 'Breadcrumb',
    slug: 'breadcrumb',
    title: '面包屑',
    category: 'navigation',
    available: true,
  },
  // 反馈提示
  { name: 'Alert', slug: 'alert', title: '警告提示', category: 'feedback', available: true },
  { name: 'Message', slug: 'message', title: '全局提示', category: 'feedback', available: true },
  { name: 'Tooltip', slug: 'tooltip', title: '文字提示', category: 'feedback', available: true },
  { name: 'Spin', slug: 'spin', title: '加载中', category: 'feedback', available: true },
  {
    name: 'Popconfirm',
    slug: 'popconfirm',
    title: '气泡确认',
    category: 'feedback',
    available: true,
  },
];

/** 已上线组件元数据（新增组件文档时在此注册） */
export const componentMetas: ComponentMeta[] = [
  buttonMeta,
  switchMeta,
  tableMeta,
  messageMeta,
  inputMeta,
  modalMeta,
  checkboxMeta,
  radioMeta,
  selectMeta,
  datePickerMeta,
  inputNumberMeta,
  tagMeta,
  progressMeta,
  badgeMeta,
  avatarMeta,
  emptyMeta,
  skeletonMeta,
  tabsMeta,
  paginationMeta,
  breadcrumbMeta,
  alertMeta,
  tooltipMeta,
  spinMeta,
  popconfirmMeta,
];

export const componentMetaMap: Map<string, ComponentMeta> = new Map(
  componentMetas.map((meta) => [meta.slug, meta]),
);

/** 按分类分组的组件清单（侧边栏 / 首页复用） */
export const getComponentsByCategory = () =>
  CATEGORIES.map((category) => ({
    category,
    components: COMPONENT_LIST.filter((item) => item.category === category.key),
  }));
