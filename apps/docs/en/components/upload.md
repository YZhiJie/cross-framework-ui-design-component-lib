---
title: Upload
---

# Upload <span class="page-head__en">文件上传</span> <span class="doc-tag">Form</span>

Select and upload files by clicking; supports multiple files, count / size limits, picture list display, and pre-upload validation.

## Features

- Controlled and uncontrolled modes; the value is UploadFile[]; supports v-model:value on Vue
- action is the upload URL; requestUpload can override the default XMLHttpRequest (useful for SSR or custom requests)
- multiple for multi-file; maxCount limits the file count; maxSize limits each file size
- listType supports text (default) and picture (thumbnail list)
- beforeUpload returning false / a rejected promise aborts the upload; accept restricts selectable file types
- When autoUpload=false, files enter a "pending" state and are uploaded manually via submit() or the "Start Upload" button
- In-progress uploads can be cancelled (status becomes cancelled); list items support move up / down ordering
- Displays real-time progress percentage, upload speed (KB/s, MB/s), and estimated remaining time during upload
- Full state machine: pending / uploading / done / error / cancelled

### When to Use

- Form scenarios requiring file uploads such as attachments and images.

## Examples

Each demo can be switched between Vue and React tabs for live interaction, with source code available per framework.

### Basic Upload

Files upload automatically after selection (the demo uses a mocked requestUpload); multiple selection supported.

<ComponentDemo slug="upload" demo-id="basic" />

### Picture List &amp; Pre-upload Validation

listType="picture" shows thumbnails; beforeUpload allows only images; maxCount limits the count.

<ComponentDemo slug="upload" demo-id="state" />

### Manual Upload / Cancel / Order / Speed

With autoUpload=false files stay pending until manually started; in-progress uploads can be cancelled and reordered, with real-time speed and remaining time displayed.

<ComponentDemo slug="upload" demo-id="manual" />

## API

`@xui-design/core` ComponentSpec · single contract, identical on both frameworks

### Props

<ComponentApi slug="upload" kind="props" />

### Events / Callbacks

<ComponentApi slug="upload" kind="events" />

### Slots / Render Callbacks

<ComponentApi slug="upload" kind="slots" />

### Contract Types

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

Data structure of an uploaded file item; speed is the upload rate (bytes/s), remainingTime is the estimated remaining time (seconds).

**RequestUploadFn**

```ts
type RequestUploadFn = (
  file: UploadFile,
  options: { action: string; onProgress: (percent: number) => void; signal?: AbortSignal }
) => Promise<{ url?: string; response?: unknown }>
```

Signature of a custom upload request function; signal supports cancelling the upload.

## Notes

- The default uses XMLHttpRequest; for SSR or non-browser environments, provide an implementation via requestUpload.
- When beforeUpload returns false or a rejected promise, the file does not enter the upload flow.
- maxCount limits the total file count (including uploaded); excess files are ignored. Files exceeding maxSize are marked as error and not uploaded.
- When autoUpload=false, files enter pending state and require submit() or the "Start Upload" button; cancelled files must be removed and re-selected.

## Accessibility

- The upload trigger is a focusable native button; the disabled state passes through the disabled attribute.
