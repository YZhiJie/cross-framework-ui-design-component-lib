/**
 * Upload - React 19 适配层
 *
 * useSyncExternalStore 桥接 @xui-design/shared 逻辑。
 * 隐藏 input[type=file] 驱动文件选择，文件列表渲染由逻辑层状态驱动。
 * 默认上传使用 shared 的 defaultRequestUpload（XMLHttpRequest），可通过 requestUpload 覆盖。
 * 支持 autoUpload=false 手动上传、cancel 取消、move 排序、速率与剩余时间显示。
 */

import { useEffect, useImperativeHandle, useRef } from 'react';
import type { CSSProperties, ReactNode, Ref } from 'react';
import type { UploadFile, UploadProps } from '@xui-design/core';
import { createUploadLogic } from '@xui-design/shared';
import type { UploadLogicInstance } from '@xui-design/shared';
import { useLogicState } from '../../hooks/use-logic-state';
import { cn } from '../../utils/cn';

/** Upload 组件 Props */
export type UploadComponentProps = UploadProps & {
  renderTrigger?: () => ReactNode;
  renderFileItem?: (file: UploadFile) => ReactNode;
  ref?: Ref<UploadRef>;
};

/** 通过 ref 暴露的命令式 API */
export interface UploadRef {
  /** 打开文件选择对话框 */
  open: () => void;
  /** 清空所有文件 */
  clear: () => void;
  /** 手动上传所有 pending 文件 */
  submit: () => void;
}

/** 格式化速率 */
function formatSpeed(bps?: number): string {
  if (bps === undefined || bps <= 0) return '';
  if (bps < 1024) return `${bps.toFixed(0)} B/s`;
  if (bps < 1024 * 1024) return `${(bps / 1024).toFixed(1)} KB/s`;
  return `${(bps / (1024 * 1024)).toFixed(1)} MB/s`;
}

/** 格式化剩余时间 */
function formatRemaining(seconds?: number): string {
  if (seconds === undefined || seconds <= 0) return '';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return m > 0 ? `${m}分${s}秒` : `${s}秒`;
}

export function Upload(props: UploadComponentProps) {
  const {
    action,
    accept,
    multiple = false,
    disabled = false,
    maxCount,
    maxSize,
    listType = 'text',
    autoUpload = true,
    requestUpload,
    beforeUpload,
    value,
    defaultValue,
    onChange,
    onRemove,
    className,
    style,
    renderTrigger,
    renderFileItem,
    ref,
  } = props;

  const inputRef = useRef<HTMLInputElement>(null);

  const callbacksRef = useRef({ onChange, onRemove });
  callbacksRef.current = { onChange, onRemove };

  const logicRef = useRef<UploadLogicInstance | null>(null);
  if (logicRef.current === null) {
    logicRef.current = createUploadLogic({
      action,
      multiple,
      disabled,
      maxCount,
      maxSize,
      listType,
      autoUpload,
      requestUpload,
      beforeUpload,
      value,
      defaultValue,
      onChange: (files) => callbacksRef.current.onChange?.(files),
      onRemove: (file) => callbacksRef.current.onRemove?.(file),
    });
  }
  const logic = logicRef.current;

  useEffect(() => {
    logic.updateOptions({ value, disabled });
  }, [logic, value, disabled]);

  const state = useLogicState(logic.subscribe, logic.getState);

  useImperativeHandle(
    ref,
    () => ({
      open: () => inputRef.current?.click(),
      clear: () => logic.clear(),
      submit: () => logic.submit(),
    }),
    [logic],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      logic.selectFiles(files);
    }
    e.target.value = '';
  };

  const handleTriggerClick = () => {
    if (state.disabled) return;
    inputRef.current?.click();
  };

  const hasPending = state.fileList.some((f) => f.status === 'pending');

  return (
    <div className={cn('xui-upload', className)} style={style as CSSProperties}>
      <input
        ref={inputRef}
        type="file"
        className="xui-upload__input"
        accept={accept}
        multiple={multiple}
        disabled={state.disabled}
        style={{ display: 'none' }}
        onChange={handleInputChange}
      />
      <div className="xui-upload__actions">
        {renderTrigger ? (
          renderTrigger()
        ) : (
          <button
            type="button"
            className={cn('xui-upload__trigger', { 'is-disabled': state.disabled })}
            disabled={state.disabled}
            onClick={handleTriggerClick}
          >
            + 点击上传
          </button>
        )}
        {!autoUpload && hasPending && (
          <button type="button" className="xui-upload__submit-btn" onClick={() => logic.submit()}>
            开始上传
          </button>
        )}
      </div>
      {state.fileList.length > 0 && (
        <ul className={cn('xui-upload__list', `xui-upload__list--${listType}`)}>
          {state.fileList.map((file, index) =>
            renderFileItem ? (
              <li key={file.uid}>{renderFileItem(file)}</li>
            ) : (
              <li key={file.uid} className={cn('xui-upload__item', `is-${file.status}`)}>
                <div className="xui-upload__item-main">
                  {listType === 'picture' && file.raw && (
                    <img
                      src={URL.createObjectURL(file.raw)}
                      alt={file.name}
                      className="xui-upload__thumbnail"
                    />
                  )}
                  <span className="xui-upload__name" title={file.name}>
                    {file.name}
                  </span>
                  <span className="xui-upload__status">
                    {file.status === 'pending' && '待上传'}
                    {file.status === 'uploading' && (
                      <>
                        {file.percent}%
                        {file.speed ? (
                          <span className="xui-upload__speed">{formatSpeed(file.speed)}</span>
                        ) : null}
                        {file.remainingTime ? (
                          <span className="xui-upload__remaining">
                            剩余 {formatRemaining(file.remainingTime)}
                          </span>
                        ) : null}
                      </>
                    )}
                    {file.status === 'done' && '✓ 成功'}
                    {file.status === 'error' && '✗ 失败'}
                    {file.status === 'cancelled' && '已取消'}
                  </span>
                </div>
                {file.status === 'uploading' && (
                  <div className="xui-upload__progress">
                    <div
                      className="xui-upload__progress-bar"
                      style={{ width: `${file.percent}%` }}
                    />
                  </div>
                )}
                <div className="xui-upload__item-actions">
                  {state.fileList.length > 1 && (
                    <>
                      <button
                        type="button"
                        className="xui-upload__sort-btn"
                        aria-label="move up"
                        disabled={index === 0}
                        onClick={() => logic.move(file.uid, -1)}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        className="xui-upload__sort-btn"
                        aria-label="move down"
                        disabled={index === state.fileList.length - 1}
                        onClick={() => logic.move(file.uid, 1)}
                      >
                        ↓
                      </button>
                    </>
                  )}
                  {file.status === 'uploading' && (
                    <button
                      type="button"
                      className="xui-upload__cancel-btn"
                      aria-label="cancel"
                      onClick={() => logic.cancel(file.uid)}
                    >
                      取消
                    </button>
                  )}
                  <button
                    type="button"
                    className="xui-upload__remove"
                    aria-label="remove"
                    onClick={() => logic.remove(file.uid)}
                  >
                    ×
                  </button>
                </div>
              </li>
            ),
          )}
        </ul>
      )}
    </div>
  );
}
