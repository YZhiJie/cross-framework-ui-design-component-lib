/**
 * Upload 纯逻辑工厂
 *
 * 状态：fileList / disabled
 * 交互：selectFiles / remove / clear / submit / cancel / move
 * 受控模式：创建时提供 value 选项即进入受控模式，
 * 内部不再自行更新 fileList，由外部通过 updateOptions 同步。
 *
 * 上传流程：
 * 1. selectFiles 接收 FileList/File[]
 * 2. 校验 maxCount（超出截断）、maxSize（超出报错）、beforeUpload（false 则跳过）
 * 3. 通过校验的文件加入 fileList：
 *    - autoUpload=true（默认）：status='uploading'，立即发起上传
 *    - autoUpload=false：status='pending'，等待 submit() 手动触发
 * 4. 上传进度更新 percent + speed + remainingTime；成功 status='done'；失败 status='error'
 * 5. cancel(uid) 通过 AbortSignal 中止上传，status='cancelled'
 * 6. 每次状态变化触发 onChange
 *
 * 默认上传实现 defaultRequestUpload 使用 XMLHttpRequest（FormData + progress 事件），
 * 支持 signal 取消。适配层可通过 requestUpload 覆盖。
 */

import type { LogicInstance, StateListener } from '../../types';

/** 文件上传状态 */
export type UploadStatus = 'pending' | 'uploading' | 'done' | 'error' | 'cancelled';

/** 上传文件项 */
export type UploadFile = {
  uid: string;
  name: string;
  size: number;
  type: string;
  status: UploadStatus;
  percent: number;
  /** 上传速率（字节/秒） */
  speed?: number;
  /** 预估剩余时间（秒） */
  remainingTime?: number;
  response?: unknown;
  url?: string;
  raw?: File;
};

/** 上传请求函数 */
export type RequestUploadFn = (
  file: UploadFile,
  options: {
    action: string;
    onProgress: (percent: number) => void;
    signal?: AbortSignal;
  },
) => Promise<{ url?: string; response?: unknown }>;

/** Upload 逻辑配置 */
export type UploadLogicOptions = {
  action: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  maxCount?: number;
  maxSize?: number;
  listType?: 'text' | 'picture';
  autoUpload?: boolean;
  requestUpload?: RequestUploadFn;
  beforeUpload?: (file: File) => boolean | Promise<boolean>;
  value?: UploadFile[];
  defaultValue?: UploadFile[];
  onChange?: (fileList: UploadFile[]) => void;
  onRemove?: (file: UploadFile) => void;
};

/** Upload 状态快照 */
export type UploadState = {
  fileList: UploadFile[];
  disabled: boolean;
};

/** Upload 逻辑实例 */
export interface UploadLogicInstance extends LogicInstance<UploadLogicOptions, UploadState> {
  selectFiles: (files: FileList | File[]) => void;
  remove: (uid: string) => void;
  clear: () => void;
  submit: () => void;
  cancel: (uid: string) => void;
  move: (uid: string, direction: -1 | 1) => void;
}

/** 生成唯一 uid */
let uidCounter = 0;
function genUid(): string {
  uidCounter += 1;
  return `upload-${Date.now()}-${uidCounter}`;
}

/**
 * 默认上传实现：XMLHttpRequest + FormData
 * 支持 signal 取消。
 */
export function defaultRequestUpload(
  file: UploadFile,
  options: { action: string; onProgress: (percent: number) => void; signal?: AbortSignal },
): Promise<{ url?: string; response?: unknown }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', file.raw as Blob, file.name);

    xhr.open('POST', options.action, true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        options.onProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        let response: unknown = xhr.responseText;
        try {
          response = JSON.parse(xhr.responseText);
        } catch {
          // 非 JSON 响应保持文本
        }
        resolve({ response, url: undefined });
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during upload'));

    // 支持取消
    if (options.signal) {
      if (options.signal.aborted) {
        xhr.abort();
        reject(new DOMException('Aborted', 'AbortError'));
        return;
      }
      options.signal.addEventListener('abort', () => {
        xhr.abort();
        reject(new DOMException('Aborted', 'AbortError'));
      });
    }

    xhr.send(formData);
  });
}

/** 文件列表等价比较 */
function fileListEquals(a: UploadFile[], b: UploadFile[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    const x = a[i];
    const y = b[i];
    if (
      x.uid !== y.uid ||
      x.name !== y.name ||
      x.size !== y.size ||
      x.status !== y.status ||
      x.percent !== y.percent
    ) {
      return false;
    }
  }
  return true;
}

export function createUploadLogic(options: UploadLogicOptions): UploadLogicInstance {
  const {
    action,
    maxCount,
    maxSize,
    autoUpload = true,
    beforeUpload,
    requestUpload = defaultRequestUpload,
  } = options;

  const state: UploadState = {
    fileList: options.value
      ? [...options.value]
      : options.defaultValue
        ? [...options.defaultValue]
        : [],
    disabled: options.disabled ?? false,
  };

  let onChange = options.onChange;
  let onRemove = options.onRemove;
  const listeners = new Set<StateListener<UploadState>>();

  /** 每个 uid 对应的 AbortController（上传中可取消） */
  const abortControllers = new Map<string, AbortController>();
  /** 每个 uid 的速率采样：{ lastLoaded, lastTime } */
  const speedSamples = new Map<string, { lastLoaded: number; lastTime: number }>();

  const notify = () => {
    const snapshot = { ...state, fileList: [...state.fileList] };
    listeners.forEach((listener) => listener(snapshot));
  };

  /** 触发 onChange（浅拷贝） */
  const emitChange = () => {
    onChange?.(state.fileList.map((f) => ({ ...f })));
  };

  /** 更新某文件的状态字段 */
  const updateFile = (uid: string, patch: Partial<UploadFile>) => {
    state.fileList = state.fileList.map((f) => (f.uid === uid ? { ...f, ...patch } : f));
  };

  /** 移除文件并清理关联资源 */
  const removeFile = (uid: string): UploadFile | undefined => {
    const target = state.fileList.find((f) => f.uid === uid);
    state.fileList = state.fileList.filter((f) => f.uid !== uid);
    // 清理 abort controller
    const ac = abortControllers.get(uid);
    if (ac) {
      ac.abort();
      abortControllers.delete(uid);
    }
    speedSamples.delete(uid);
    return target;
  };

  /** 上传单个文件 */
  const uploadSingle = (file: UploadFile) => {
    const controller = new AbortController();
    abortControllers.set(file.uid, controller);

    // 初始化速率采样
    speedSamples.set(file.uid, { lastLoaded: 0, lastTime: Date.now() });

    const setProgress = (percent: number) => {
      const now = Date.now();
      const sample = speedSamples.get(file.uid);
      let speed: number | undefined;
      let remainingTime: number | undefined;

      if (sample && file.size > 0) {
        const loaded = (percent / 100) * file.size;
        const elapsed = (now - sample.lastTime) / 1000;
        if (elapsed > 0) {
          speed = (loaded - sample.lastLoaded) / elapsed;
          if (speed > 0) {
            remainingTime = (file.size - loaded) / speed;
          }
        }
        speedSamples.set(file.uid, { lastLoaded: loaded, lastTime: now });
      }

      updateFile(file.uid, { percent, status: 'uploading', speed, remainingTime });
      notify();
      emitChange();
    };

    requestUpload(file, { action, onProgress: setProgress, signal: controller.signal })
      .then((result) => {
        updateFile(file.uid, {
          status: 'done',
          percent: 100,
          speed: undefined,
          remainingTime: undefined,
          response: result.response,
          url: result.url,
        });
        abortControllers.delete(file.uid);
        speedSamples.delete(file.uid);
        notify();
        emitChange();
      })
      .catch((err) => {
        // 判断是否为主动取消
        if (err instanceof DOMException && err.name === 'AbortError') {
          updateFile(file.uid, {
            status: 'cancelled',
            speed: undefined,
            remainingTime: undefined,
          });
        } else {
          updateFile(file.uid, {
            status: 'error',
            percent: 0,
            speed: undefined,
            remainingTime: undefined,
            response: err instanceof Error ? err.message : String(err),
          });
        }
        abortControllers.delete(file.uid);
        speedSamples.delete(file.uid);
        notify();
        emitChange();
      });
  };

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },

    getState: () => ({ ...state, fileList: [...state.fileList] }),

    updateOptions(next) {
      let changed = false;

      const nextDisabled = next.disabled ?? state.disabled;
      if (nextDisabled !== state.disabled) {
        state.disabled = nextDisabled;
        changed = true;
      }

      if (next.value !== undefined) {
        if (!fileListEquals(next.value, state.fileList)) {
          state.fileList = next.value.map((f) => ({ ...f }));
          changed = true;
        }
      }

      if (next.onChange !== undefined) onChange = next.onChange;
      if (next.onRemove !== undefined) onRemove = next.onRemove;

      if (changed) notify();
    },

    async selectFiles(files) {
      if (state.disabled) return;

      const fileArray = Array.from(files);

      // maxCount 限制
      let candidates = fileArray;
      if (maxCount !== undefined) {
        const remaining = maxCount - state.fileList.length;
        if (remaining <= 0) return;
        candidates = fileArray.slice(0, remaining);
      }

      // 依次校验 beforeUpload + maxSize
      const accepted: UploadFile[] = [];
      for (const raw of candidates) {
        // maxSize 校验
        if (maxSize !== undefined && raw.size > maxSize) {
          const errFile: UploadFile = {
            uid: genUid(),
            name: raw.name,
            size: raw.size,
            type: raw.type,
            status: 'error',
            percent: 0,
            raw,
          };
          accepted.push(errFile);
          continue;
        }

        // beforeUpload 校验
        if (beforeUpload) {
          try {
            const result = await beforeUpload(raw);
            if (result === false) continue;
          } catch {
            continue;
          }
        }

        accepted.push({
          uid: genUid(),
          name: raw.name,
          size: raw.size,
          type: raw.type,
          // autoUpload=true 直接上传；否则 pending 等待 submit
          status: autoUpload ? 'uploading' : 'pending',
          percent: 0,
          raw,
        });
      }

      if (accepted.length === 0) return;

      // 无论受控与否，都需要将 accepted 加入 state.fileList 以跟踪上传状态；
      // 受控模式下外部通过 onChange 收到新列表后回写 value，updateOptions 会同步。
      state.fileList = [...state.fileList, ...accepted];

      notify();
      emitChange();

      // 发起上传（仅 autoUpload=true 且 status=uploading 的文件）
      accepted.forEach((file) => {
        if (file.status === 'uploading') {
          uploadSingle(file);
        }
      });
    },

    remove(uid) {
      const target = removeFile(uid);
      if (!target) return;

      notify();
      onRemove?.(target);
      emitChange();
    },

    clear() {
      if (state.fileList.length === 0) return;
      // 清理所有 abort controller
      abortControllers.forEach((ac) => ac.abort());
      abortControllers.clear();
      speedSamples.clear();
      state.fileList = [];
      notify();
      emitChange();
    },

    submit() {
      if (state.disabled) return;
      // 上传所有 pending 状态的文件
      const pending = state.fileList.filter((f) => f.status === 'pending');
      pending.forEach((file) => {
        updateFile(file.uid, { status: 'uploading' });
        uploadSingle(file);
      });
      notify();
      emitChange();
    },

    cancel(uid) {
      const file = state.fileList.find((f) => f.uid === uid);
      if (!file || file.status !== 'uploading') return;
      const ac = abortControllers.get(uid);
      if (ac) {
        ac.abort();
      }
    },

    move(uid, direction) {
      const index = state.fileList.findIndex((f) => f.uid === uid);
      if (index === -1) return;
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= state.fileList.length) return;

      const next = [...state.fileList];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      state.fileList = next;
      notify();
      emitChange();
    },
  };
}
