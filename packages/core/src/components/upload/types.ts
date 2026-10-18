/** Upload 契约类型
 *
 * Props / Events / Slots / State / Logic
 * 使用 type 别名（而非 interface）以保证与 Record 约束的结构兼容性。
 *
 * 契约约定：
 * - value 为 UploadFile[]，每文件含 uid/name/size/status/percent/speed/remainingTime
 * - 上传请求由逻辑层发起（默认 XMLHttpRequest，可通过 requestUpload 覆盖）
 * - beforeUpload 返回 false 或 reject 时中止上传
 * - autoUpload=false 时文件进入 pending 状态，由 submit() 手动触发上传
 */

import type { LogicInstance } from '../../types';

/** 文件上传状态 */
export type UploadStatus = 'pending' | 'uploading' | 'done' | 'error' | 'cancelled';

/** 上传文件项（双端共用的数据结构） */
export type UploadFile = {
  /** 唯一标识（由逻辑层生成） */
  uid: string;
  /** 文件名 */
  name: string;
  /** 文件大小（字节） */
  size: number;
  /** MIME 类型 */
  type: string;
  /** 上传状态 */
  status: UploadStatus;
  /** 上传进度（0-100） */
  percent: number;
  /** 上传速率（字节/秒，上传中实时计算） */
  speed?: number;
  /** 预估剩余时间（秒，上传中实时计算） */
  remainingTime?: number;
  /** 服务器响应 */
  response?: unknown;
  /** 上传成功后的访问 URL */
  url?: string;
  /** 原始 File 对象引用（仅内存，不序列化） */
  raw?: File;
};

/** 上传请求函数（由适配层或默认实现提供）
 *
 * 通过 signal 支持取消：适配层在 cancel 时调用 AbortController.abort()。
 */
export type RequestUploadFn = (
  file: UploadFile,
  options: {
    action: string;
    onProgress: (percent: number) => void;
    signal?: AbortSignal;
  },
) => Promise<{ url?: string; response?: unknown }>;

/** Upload Props（Vue 与 React 共用） */
export type UploadProps = {
  /** 上传地址（必填） */
  action: string;
  /** 接受的文件类型（input accept） */
  accept?: string;
  /** 是否多选 */
  multiple?: boolean;
  /** 禁用状态 */
  disabled?: boolean;
  /** 最大文件数（超出则忽略多余） */
  maxCount?: number;
  /** 单文件最大字节数（超出则报错不上传） */
  maxSize?: number;
  /** 文件列表展示样式 */
  listType?: 'text' | 'picture';
  /** 是否自动上传（默认 true；false 时文件进入 pending，由 submit() 手动触发） */
  autoUpload?: boolean;
  /** 自定义上传请求（覆盖默认 XMLHttpRequest 实现） */
  requestUpload?: RequestUploadFn;
  /** 上传前钩子：返回 false / reject 中止上传 */
  beforeUpload?: (file: File) => boolean | Promise<boolean>;
  /** 受控文件列表 */
  value?: UploadFile[];
  /** 非受控初始文件列表 */
  defaultValue?: UploadFile[];
  /** 文件列表变更回调 */
  onChange?: (fileList: UploadFile[]) => void;
  /** 删除文件回调 */
  onRemove?: (file: UploadFile) => void;
  /** 自定义类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: Record<string, string>;
};

/** Upload 事件契约 */
export type UploadEvents = {
  change: (fileList: UploadFile[]) => void;
  remove: (file: UploadFile) => void;
};

/** Upload 插槽契约 */
export type UploadSlots = {
  /** 自定义上传按钮内容 */
  trigger: Record<string, never>;
  /** 自定义文件列表项 */
  fileItem: { file: UploadFile };
};

/** Upload 状态快照 */
export type UploadState = {
  /** 当前文件列表 */
  fileList: UploadFile[];
  disabled: boolean;
};

/** Upload 逻辑实例 */
export type UploadLogic = LogicInstance<UploadProps, UploadState> & {
  /** 选中文件（由适配层从 input change 事件传入） */
  selectFiles: (files: FileList | File[]) => void;
  /** 删除文件 */
  remove: (uid: string) => void;
  /** 清空所有文件 */
  clear: () => void;
  /** 手动上传所有 pending 状态的文件（autoUpload=false 时使用） */
  submit: () => void;
  /** 取消上传中（uploading）的文件 */
  cancel: (uid: string) => void;
  /** 移动文件顺序（direction: -1 上移 / 1 下移） */
  move: (uid: string, direction: -1 | 1) => void;
};
