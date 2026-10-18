/**
 * 文档站内容注册表
 *
 * - CATEGORIES：组件分类（驱动侧边栏与首页分组）
 * - COMPONENT_LIST：24 个组件全量规划清单，available 标记文档是否已上线
 * - componentMetas / componentMetaMap：已上线组件的结构化元数据
 */
import type { ComponentMeta } from './types';
import { CATEGORIES, COMPONENT_LIST } from './component-list';

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
import { formMeta } from './form/meta';
import { cascaderMeta } from './cascader/meta';
import { timePickerMeta } from './time-picker/meta';
import { uploadMeta } from './upload/meta';
import { treeMeta } from './tree/meta';
import { drawerMeta } from './drawer/meta';
import { dropdownMeta } from './dropdown/meta';

export { CATEGORIES, COMPONENT_LIST };

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
  formMeta,
  cascaderMeta,
  timePickerMeta,
  uploadMeta,
  treeMeta,
  drawerMeta,
  dropdownMeta,
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
