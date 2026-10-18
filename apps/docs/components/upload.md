---
title: 文件上传 Upload
---

# 文件上传 <span class="page-head__en">Upload</span> <span class="doc-tag">表单交互</span>

通过点击选择文件并上传，支持多文件、数量 / 大小限制、图片列表展示与上传前校验。

## 功能特性

- 受控 / 非受控双模式，值为 UploadFile[]，Vue 端支持 v-model:value
- action 上传地址；requestUpload 可覆盖默认 XMLHttpRequest 实现（便于 SSR 或自定义请求）
- multiple 多选；maxCount 限制文件数；maxSize 限制单文件大小
- listType 支持 text（默认）与 picture（缩略图列表）
- beforeUpload 返回 false / reject 时中止上传；accept 限制可选文件类型
- autoUpload=false 时文件进入「待上传」状态，通过 submit() 或「开始上传」按钮手动触发
- 上传中可取消（cancel），状态变为 cancelled；列表项支持上移/下移排序
- 上传中实时显示进度百分比、上传速率（KB/s、MB/s）与预估剩余时间
- 完整状态机：pending / uploading / done / error / cancelled
- drag 开启拖拽上传形态：虚线 dropzone 支持拖入文件与点击选择，悬停高亮

### 使用场景

- 表单中需要上传附件、图片等文件的场景。

## 代码演示

每个 demo 均可切换 Vue / React 标签页实时交互，并可展开查看对应框架源码。

### 基础上传

点击选择文件后自动上传（示例使用模拟 requestUpload），支持多选。

<ComponentDemo slug="upload" demo-id="basic" />

### 图片列表与上传前校验

listType="picture" 展示缩略图；beforeUpload 仅允许图片；maxCount 限制数量。

<ComponentDemo slug="upload" demo-id="state" />

### 手动上传 / 取消 / 排序 / 速率

autoUpload=false 时文件进入待上传状态，可手动开始上传；上传中可取消、可排序，实时显示速率与剩余时间。

<ComponentDemo slug="upload" demo-id="manual" />

### 拖拽上传

drag 开启拖拽形态：虚线 dropzone 支持拖入文件与点击选择，悬停时高亮；accept 与多选约束同样生效。

<ComponentDemo slug="upload" demo-id="drag" />

## API 文档

`@xui-design/core` ComponentSpec · 唯一契约基准，双端一致

### Props

<ComponentApi slug="upload" kind="props" />

### Events / 回调

<ComponentApi slug="upload" kind="events" />

### Slots / 渲染回调

<ComponentApi slug="upload" kind="slots" />

### 契约类型

**UploadFile**

```ts
interface UploadFile {
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
}
```

上传文件项数据结构；speed 为上传速率（字节/秒），remainingTime 为预估剩余时间（秒）。

**RequestUploadFn**

```ts
type RequestUploadFn = (
  file: UploadFile,
  options: { action: string; onProgress: (percent: number) => void; signal?: AbortSignal }
) => Promise<{ url?: string; response?: unknown }>
```

自定义上传请求函数签名；signal 用于支持取消上传。

## 注意事项

- 默认使用 XMLHttpRequest 上传；SSR 或非浏览器环境需通过 requestUpload 提供实现。
- beforeUpload 返回 false 或 reject 的 Promise 时，文件不会进入上传流程。
- maxCount 限制文件总数（含已上传），超出部分直接忽略；maxSize 超限的文件标记为 error 不上传。
- autoUpload=false 时，文件进入 pending 状态，需调用 submit() 或点击「开始上传」触发；cancelled 状态的文件需删除后重新选择。

## 无障碍

- 上传触发区域为可聚焦的原生按钮，禁用状态透传 disabled。
