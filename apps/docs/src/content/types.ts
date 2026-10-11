/**
 * 文档站内容元数据类型
 *
 * 每个组件一份 meta.ts，结构化描述组件的特性、演示与 API 表格，
 * 由 ComponentPage / DemoBlock / ApiSection 等通用组件统一渲染。
 * API 口径必须与 @xui/core 的 ComponentSpec 契约保持一致。
 */
import type { Component } from 'vue';
import type { ComponentType } from 'react';

/** 组件分类 key（驱动侧边栏分组与首页总览） */
export type CategoryKey = 'basic' | 'form' | 'display' | 'navigation' | 'feedback';

/** Props API 表格行 */
export interface ApiPropRow {
  /** 属性名 */
  name: string;
  /** TS 类型（字符串展示） */
  type: string;
  /** 默认值（无默认值用 '—'） */
  default: string;
  /** 说明 */
  description: string;
  /** 是否必填 */
  required?: boolean;
}

/** Events API 表格行（Vue 事件 ↔ React 回调映射） */
export interface ApiEventRow {
  /** Vue 事件名（如 change） */
  vue: string;
  /** React 回调名（如 onChange），无对应回调用 '—' */
  react: string;
  /** 载荷类型 */
  payload: string;
  /** 说明 */
  description: string;
}

/** Slots API 表格行（Vue 插槽 ↔ React 渲染回调映射） */
export interface ApiSlotRow {
  /** Vue 插槽名 */
  vue: string;
  /** React 对应回调名（如 renderTitle），无用 '—' */
  react: string;
  /** 说明 */
  description: string;
}

/** 命令式方法表格行（Message 等命令式 API） */
export interface ApiMethodRow {
  /** 方法名 */
  name: string;
  /** 函数签名 */
  signature: string;
  /** 说明 */
  description: string;
}

/** 附加契约类型块（TableColumn / MessageOptions 等） */
export interface ApiTypeBlock {
  /** 类型名 */
  name: string;
  /** 类型定义（TS 源码文本） */
  definition: string;
  /** 说明 */
  description?: string;
}

/** 单个可交互 demo（双端各一份真实组件 + 源码） */
export interface DemoDefinition {
  /** demo 唯一 id（锚点用） */
  id: string;
  /** demo 标题 */
  title: string;
  /** demo 说明 */
  description?: string;
  /** Vue 端 demo 组件（实时挂载） */
  vueComponent: Component;
  /** React 端 demo 组件（实时挂载） */
  reactComponent: ComponentType;
  /** Vue demo 源码（?raw 导入） */
  vueSource: string;
  /** React demo 源码（?raw 导入） */
  reactSource: string;
}

/** 组件完整元数据 */
export interface ComponentMeta {
  /** 组件英文名（Button） */
  name: string;
  /** 路由 slug（button） */
  slug: string;
  /** 中文名（按钮） */
  title: string;
  /** 分类 */
  category: CategoryKey;
  /** 一句话摘要 */
  summary: string;
  /** 功能特性列表 */
  features: string[];
  /** 使用场景 */
  scenarios?: string[];
  /** demo 列表 */
  demos: DemoDefinition[];
  /** API 表格数据 */
  api: {
    props?: ApiPropRow[];
    events?: ApiEventRow[];
    slots?: ApiSlotRow[];
    methods?: ApiMethodRow[];
    types?: ApiTypeBlock[];
  };
  /** 边界场景 / 注意事项 */
  notes?: string[];
  /** 无障碍说明 */
  a11y?: string[];
}

/** 组件清单条目（驱动导航与首页卡片，含尚未落地文档的组件） */
export interface ComponentEntry {
  /** 组件英文名 */
  name: string;
  /** slug */
  slug: string;
  /** 中文名 */
  title: string;
  /** 分类 */
  category: CategoryKey;
  /** 文档是否已上线 */
  available: boolean;
}
