/**
 * Button 组件测试（React 19 适配层）
 *
 * 覆盖：渲染类名与修饰类、type/size 传值、disabled、loading、onClick、
 * children、renderIcon、ref 命令式 API（focus / setLoading）。
 */

import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Button } from '../index';
import type { ButtonRef } from '../index';

describe('Button 组件', () => {
  afterEach(() => {
    cleanup();
  });

  describe('渲染', () => {
    it('渲染原生 button 元素，role 为 button', () => {
      render(<Button>按钮</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('默认类名为 xui-button，默认 type/size 修饰类为 default/md', () => {
      render(<Button>按钮</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('xui-button', 'xui-button--default', 'xui-button--md');
    });

    it('type 与 size 传值生效', () => {
      render(
        <Button type="primary" size="lg">
          按钮
        </Button>,
      );
      const button = screen.getByRole('button');
      expect(button).toHaveClass('xui-button--primary', 'xui-button--lg');
    });

    it('渲染 children 内容', () => {
      render(<Button>主要操作</Button>);
      expect(screen.getByText('主要操作')).toBeInTheDocument();
    });

    it('block 为 true 时追加 is-block 类', () => {
      render(<Button block>按钮</Button>);
      expect(screen.getByRole('button')).toHaveClass('is-block');
    });

    it('renderIcon 自定义前置图标渲染', () => {
      render(<Button renderIcon={() => <i>icon</i>}>按钮</Button>);
      expect(screen.getByText('icon')).toBeInTheDocument();
    });
  });

  describe('交互', () => {
    it('点击触发 onClick', () => {
      const onClick = vi.fn();
      render(<Button onClick={onClick}>按钮</Button>);
      fireEvent.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('disabled 时点击不触发 onClick', () => {
      const onClick = vi.fn();
      render(
        <Button disabled onClick={onClick}>
          按钮
        </Button>,
      );
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('is-disabled');
      fireEvent.click(button);
      expect(onClick).not.toHaveBeenCalled();
    });

    it('loading 时渲染加载图标（默认内联 Spinner）并禁用点击', () => {
      const onClick = vi.fn();
      render(
        <Button loading onClick={onClick}>
          按钮
        </Button>,
      );
      const button = screen.getByRole('button');
      expect(button).toHaveClass('is-loading');
      expect(button.querySelector('.xui-button__loading-icon')).not.toBeNull();
      expect(button.querySelector('svg')).not.toBeNull();
      fireEvent.click(button);
      expect(onClick).not.toHaveBeenCalled();
    });

    it('props 变更同步逻辑层：disabled 动态生效', () => {
      const onClick = vi.fn();
      const { rerender } = render(<Button onClick={onClick}>按钮</Button>);
      fireEvent.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);

      rerender(
        <Button disabled onClick={onClick}>
          按钮
        </Button>,
      );
      fireEvent.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('renderLoadingIcon 自定义加载图标渲染，且不渲染前置图标', () => {
      render(
        <Button loading renderIcon={() => <i>icon</i>} renderLoadingIcon={() => <i>spin</i>}>
          按钮
        </Button>,
      );
      expect(screen.getByText('spin')).toBeInTheDocument();
      expect(screen.queryByText('icon')).not.toBeInTheDocument();
    });
  });

  describe('ref 命令式 API', () => {
    it('focus 使按钮获得焦点', () => {
      const ref: { current: ButtonRef | null } = { current: null };
      render(<Button ref={ref}>按钮</Button>);
      act(() => {
        ref.current?.focus();
      });
      expect(screen.getByRole('button')).toHaveFocus();
    });

    it('setLoading(true) 切换加载态', () => {
      const ref: { current: ButtonRef | null } = { current: null };
      render(<Button ref={ref}>按钮</Button>);
      act(() => {
        ref.current?.setLoading(true);
      });
      expect(screen.getByRole('button')).toHaveClass('is-loading');
    });
  });
});
