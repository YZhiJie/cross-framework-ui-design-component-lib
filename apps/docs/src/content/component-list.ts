/**
 * 组件清单（纯数据，零组件依赖）
 *
 * 独立于 registry.ts：registry 需要导入全部 meta（连带 .vue/.tsx demo 组件），
 * 只能在浏览器/Vite 上下文使用；本模块可被 .vitepress/config.mts 在 Node 端
 * 直接导入，用于程序化生成侧边栏 / 导航 / 上一页下一页。
 */
import type { CategoryKey, ComponentEntry } from './types';
import type { LText } from '../i18n';

/** 组件分类（驱动侧边栏分组与首页总览） */
export const CATEGORIES: { key: CategoryKey; title: LText }[] = [
  { key: 'basic', title: { 'zh-CN': '基础组件', 'en-US': 'Basic' } },
  { key: 'form', title: { 'zh-CN': '表单交互', 'en-US': 'Form' } },
  { key: 'display', title: { 'zh-CN': '数据展示', 'en-US': 'Data Display' } },
  { key: 'navigation', title: { 'zh-CN': '导航布局', 'en-US': 'Navigation' } },
  { key: 'feedback', title: { 'zh-CN': '反馈提示', 'en-US': 'Feedback' } },
];

/** 24 个组件全量规划清单，available 标记文档是否已上线 */
export const COMPONENT_LIST: ComponentEntry[] = [
  // 基础组件
  { name: 'Button', slug: 'button', title: '按钮', category: 'basic', available: true },
  { name: 'Input', slug: 'input', title: '输入框', category: 'basic', available: true },
  { name: 'Modal', slug: 'modal', title: '对话框', category: 'basic', available: true },
  { name: 'Drawer', slug: 'drawer', title: '抽屉', category: 'basic', available: true },
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
  { name: 'Form', slug: 'form', title: '表单', category: 'form', available: true },
  { name: 'Cascader', slug: 'cascader', title: '级联选择', category: 'form', available: true },
  { name: 'TimePicker', slug: 'time-picker', title: '时间选择', category: 'form', available: true },
  {
    name: 'TreeSelect',
    slug: 'tree-select',
    title: '树选择',
    category: 'form',
    available: true,
  },
  { name: 'Upload', slug: 'upload', title: '文件上传', category: 'form', available: true },
  // 数据展示
  { name: 'Tag', slug: 'tag', title: '标签', category: 'display', available: true },
  { name: 'Progress', slug: 'progress', title: '进度条', category: 'display', available: true },
  { name: 'Badge', slug: 'badge', title: '徽标数', category: 'display', available: true },
  { name: 'Avatar', slug: 'avatar', title: '头像', category: 'display', available: true },
  { name: 'Empty', slug: 'empty', title: '空状态', category: 'display', available: true },
  { name: 'Skeleton', slug: 'skeleton', title: '骨架屏', category: 'display', available: true },
  { name: 'Table', slug: 'table', title: '表格', category: 'display', available: true },
  { name: 'Tree', slug: 'tree', title: '树形控件', category: 'display', available: true },
  // 导航布局
  { name: 'Tabs', slug: 'tabs', title: '标签页', category: 'navigation', available: true },
  {
    name: 'Dropdown',
    slug: 'dropdown',
    title: '下拉菜单',
    category: 'navigation',
    available: true,
  },
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
