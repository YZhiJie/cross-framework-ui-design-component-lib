import type { ComponentMeta } from '../types';

import BasicVue from './demos/basic.vue';
import StateVue from './demos/state.vue';
import ManualVue from './demos/manual.vue';
import BasicReact from './demos/basic';
import StateReact from './demos/state';
import ManualReact from './demos/manual';

import basicVueSource from './demos/basic.vue?raw';
import stateVueSource from './demos/state.vue?raw';
import manualVueSource from './demos/manual.vue?raw';
import basicReactSource from './demos/basic.tsx?raw';
import stateReactSource from './demos/state.tsx?raw';
import manualReactSource from './demos/manual.tsx?raw';

export const uploadMeta: ComponentMeta = {
  name: 'Upload',
  slug: 'upload',
  title: '文件上传',
  category: 'form',
  summary: {
    'zh-CN': '通过点击选择文件并上传，支持多文件、数量 / 大小限制、图片列表展示与上传前校验。',
    'en-US':
      'Select and upload files by clicking; supports multiple files, count / size limits, picture list display, and pre-upload validation.',
  },
  features: [
    {
      'zh-CN': '受控 / 非受控双模式，值为 UploadFile[]，Vue 端支持 v-model:value',
      'en-US':
        'Controlled and uncontrolled modes; the value is UploadFile[]; supports v-model:value on Vue',
    },
    {
      'zh-CN':
        'action 上传地址；requestUpload 可覆盖默认 XMLHttpRequest 实现（便于 SSR 或自定义请求）',
      'en-US':
        'action is the upload URL; requestUpload can override the default XMLHttpRequest (useful for SSR or custom requests)',
    },
    {
      'zh-CN': 'multiple 多选；maxCount 限制文件数；maxSize 限制单文件大小',
      'en-US':
        'multiple for multi-file; maxCount limits the file count; maxSize limits each file size',
    },
    {
      'zh-CN': 'listType 支持 text（默认）与 picture（缩略图列表）',
      'en-US': 'listType supports text (default) and picture (thumbnail list)',
    },
    {
      'zh-CN': 'beforeUpload 返回 false / reject 时中止上传；accept 限制可选文件类型',
      'en-US':
        'beforeUpload returning false / a rejected promise aborts the upload; accept restricts selectable file types',
    },
    {
      'zh-CN':
        'autoUpload=false 时文件进入「待上传」状态，通过 submit() 或「开始上传」按钮手动触发',
      'en-US':
        'When autoUpload=false, files enter a "pending" state and are uploaded manually via submit() or the "Start Upload" button',
    },
    {
      'zh-CN': '上传中可取消（cancel），状态变为 cancelled；列表项支持上移/下移排序',
      'en-US':
        'In-progress uploads can be cancelled (status becomes cancelled); list items support move up / down ordering',
    },
    {
      'zh-CN': '上传中实时显示进度百分比、上传速率（KB/s、MB/s）与预估剩余时间',
      'en-US':
        'Displays real-time progress percentage, upload speed (KB/s, MB/s), and estimated remaining time during upload',
    },
    {
      'zh-CN': '完整状态机：pending / uploading / done / error / cancelled',
      'en-US': 'Full state machine: pending / uploading / done / error / cancelled',
    },
  ],
  scenarios: [
    {
      'zh-CN': '表单中需要上传附件、图片等文件的场景。',
      'en-US': 'Form scenarios requiring file uploads such as attachments and images.',
    },
  ],
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '基础上传', 'en-US': 'Basic Upload' },
      description: {
        'zh-CN': '点击选择文件后自动上传（示例使用模拟 requestUpload），支持多选。',
        'en-US':
          'Files upload automatically after selection (the demo uses a mocked requestUpload); multiple selection supported.',
      },
      vueComponent: BasicVue,
      reactComponent: BasicReact,
      vueSource: basicVueSource,
      reactSource: basicReactSource,
    },
    {
      id: 'state',
      title: { 'zh-CN': '图片列表与上传前校验', 'en-US': 'Picture List & Pre-upload Validation' },
      description: {
        'zh-CN': 'listType="picture" 展示缩略图；beforeUpload 仅允许图片；maxCount 限制数量。',
        'en-US':
          'listType="picture" shows thumbnails; beforeUpload allows only images; maxCount limits the count.',
      },
      vueComponent: StateVue,
      reactComponent: StateReact,
      vueSource: stateVueSource,
      reactSource: stateReactSource,
    },
    {
      id: 'manual',
      title: {
        'zh-CN': '手动上传 / 取消 / 排序 / 速率',
        'en-US': 'Manual Upload / Cancel / Order / Speed',
      },
      description: {
        'zh-CN':
          'autoUpload=false 时文件进入待上传状态，可手动开始上传；上传中可取消、可排序，实时显示速率与剩余时间。',
        'en-US':
          'With autoUpload=false files stay pending until manually started; in-progress uploads can be cancelled and reordered, with real-time speed and remaining time displayed.',
      },
      vueComponent: ManualVue,
      reactComponent: ManualReact,
      vueSource: manualVueSource,
      reactSource: manualReactSource,
    },
  ],
  api: {
    props: [
      {
        name: 'action',
        type: 'string',
        default: '—',
        required: true,
        description: { 'zh-CN': '上传地址', 'en-US': 'Upload URL' },
      },
      {
        name: 'accept',
        type: 'string',
        default: '—',
        description: {
          'zh-CN': '接受的文件类型（input accept）',
          'en-US': 'Accepted file types (input accept)',
        },
      },
      {
        name: 'multiple',
        type: 'boolean',
        default: 'false',
        description: { 'zh-CN': '是否多选', 'en-US': 'Whether to allow multiple files' },
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: { 'zh-CN': '禁用状态', 'en-US': 'Disabled state' },
      },
      {
        name: 'maxCount',
        type: 'number',
        default: '—',
        description: {
          'zh-CN': '最大文件数（超出则忽略多余）',
          'en-US': 'Maximum file count (excess files are ignored)',
        },
      },
      {
        name: 'maxSize',
        type: 'number',
        default: '—',
        description: {
          'zh-CN': '单文件最大字节数（超出则报错不上传）',
          'en-US': 'Maximum size per file in bytes (excess files are rejected)',
        },
      },
      {
        name: 'listType',
        type: "'text' | 'picture'",
        default: "'text'",
        description: {
          'zh-CN': '文件列表展示样式',
          'en-US': 'File list display style',
        },
      },
      {
        name: 'autoUpload',
        type: 'boolean',
        default: 'true',
        description: {
          'zh-CN': '是否自动上传；false 时文件进入 pending，由 submit() 手动触发',
          'en-US':
            'Whether to upload automatically; when false, files stay pending and are uploaded via submit()',
        },
      },
      {
        name: 'requestUpload',
        type: 'RequestUploadFn',
        default: '默认 XMLHttpRequest',
        description: {
          'zh-CN': '自定义上传请求（覆盖默认 XMLHttpRequest 实现）',
          'en-US': 'Custom upload request (overrides the default XMLHttpRequest implementation)',
        },
      },
      {
        name: 'beforeUpload',
        type: '(file: File) => boolean | Promise<boolean>',
        default: '—',
        description: {
          'zh-CN': '上传前钩子：返回 false / reject 中止上传',
          'en-US': 'Pre-upload hook: returning false / a rejected promise aborts the upload',
        },
      },
      {
        name: 'value',
        type: 'UploadFile[]',
        default: '—',
        description: {
          'zh-CN': '受控文件列表',
          'en-US': 'Controlled file list',
        },
      },
      {
        name: 'defaultValue',
        type: 'UploadFile[]',
        default: '—',
        description: { 'zh-CN': '非受控初始文件列表', 'en-US': 'Uncontrolled initial file list' },
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
        type: '(fileList: UploadFile[]) => void',
        default: '—',
        description: {
          'zh-CN': '文件列表变更回调',
          'en-US': 'File list change callback',
        },
      },
      {
        name: 'onRemove',
        type: '(file: UploadFile) => void',
        default: '—',
        description: {
          'zh-CN': '删除文件回调',
          'en-US': 'File remove callback',
        },
      },
    ],
    events: [
      {
        vue: 'change',
        react: 'onChange',
        payload: 'fileList: UploadFile[]',
        description: {
          'zh-CN': '文件列表变更',
          'en-US': 'Fired when the file list changes',
        },
      },
      {
        vue: 'remove',
        react: 'onRemove',
        payload: 'file: UploadFile',
        description: { 'zh-CN': '删除文件', 'en-US': 'Fired when a file is removed' },
      },
      {
        vue: 'update:value',
        react: '—',
        payload: 'UploadFile[]',
        description: { 'zh-CN': 'v-model:value 回写', 'en-US': 'Write-back for v-model:value' },
      },
    ],
    slots: [
      {
        vue: 'trigger',
        react: 'renderTrigger',
        description: { 'zh-CN': '自定义上传按钮内容', 'en-US': 'Custom upload trigger content' },
      },
      {
        vue: 'fileItem',
        react: 'renderFileItem',
        description: {
          'zh-CN': '自定义文件列表项（作用域参数：file）',
          'en-US': 'Custom file list item (scoped param: file)',
        },
      },
    ],
    types: [
      {
        name: 'UploadFile',
        definition: `interface UploadFile {
  uid: string
  name: string
  size: number
  type: string
  status: 'pending' | 'uploading' | 'done' | 'error' | 'cancelled'
  percent: number
  speed?: number
  remainingTime?: number
  response?: unknown
  url?: string
  raw?: File
}`,
        description: {
          'zh-CN':
            '上传文件项数据结构；speed 为上传速率（字节/秒），remainingTime 为预估剩余时间（秒）。',
          'en-US':
            'Data structure of an uploaded file item; speed is the upload rate (bytes/s), remainingTime is the estimated remaining time (seconds).',
        },
      },
      {
        name: 'RequestUploadFn',
        definition: `type RequestUploadFn = (
  file: UploadFile,
  options: { action: string; onProgress: (percent: number) => void; signal?: AbortSignal }
) => Promise<{ url?: string; response?: unknown }>`,
        description: {
          'zh-CN': '自定义上传请求函数签名；signal 用于支持取消上传。',
          'en-US':
            'Signature of a custom upload request function; signal supports cancelling the upload.',
        },
      },
    ],
  },
  notes: [
    {
      'zh-CN': '默认使用 XMLHttpRequest 上传；SSR 或非浏览器环境需通过 requestUpload 提供实现。',
      'en-US':
        'The default uses XMLHttpRequest; for SSR or non-browser environments, provide an implementation via requestUpload.',
    },
    {
      'zh-CN': 'beforeUpload 返回 false 或 reject 的 Promise 时，文件不会进入上传流程。',
      'en-US':
        'When beforeUpload returns false or a rejected promise, the file does not enter the upload flow.',
    },
    {
      'zh-CN':
        'maxCount 限制文件总数（含已上传），超出部分直接忽略；maxSize 超限的文件标记为 error 不上传。',
      'en-US':
        'maxCount limits the total file count (including uploaded); excess files are ignored. Files exceeding maxSize are marked as error and not uploaded.',
    },
    {
      'zh-CN':
        'autoUpload=false 时，文件进入 pending 状态，需调用 submit() 或点击「开始上传」触发；cancelled 状态的文件需删除后重新选择。',
      'en-US':
        'When autoUpload=false, files enter pending state and require submit() or the "Start Upload" button; cancelled files must be removed and re-selected.',
    },
  ],
  a11y: [
    {
      'zh-CN': '上传触发区域为可聚焦的原生按钮，禁用状态透传 disabled。',
      'en-US':
        'The upload trigger is a focusable native button; the disabled state passes through the disabled attribute.',
    },
  ],
};
