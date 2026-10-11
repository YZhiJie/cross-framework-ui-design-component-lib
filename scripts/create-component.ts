/**
 * 新组件接入脚手架
 *
 * 用法：pnpm exec tsx scripts/create-component.ts <Name>
 * 例如：pnpm exec tsx scripts/create-component.ts Select
 *
 * 按既有组件（Button/Input/Modal）的固定模式，在四层生成骨架并自动注册导出：
 *   1. @xui/core    契约（types + spec）
 *   2. @xui/shared  纯逻辑工厂 + 逻辑测试
 *   3. @xui/vue     SFC 适配 + 组件测试
 *   4. @xui/react   适配层 + 组件测试
 *   5. @xui/styles  BEM 样式占位注释（样式需在 components.scss 中补充）
 *
 * 生成的骨架立即可通过 lint / type-check / test，业务字段按 TODO 注释扩展。
 * 完成后请同步更新 scripts/contract-test.ts 的双端对齐矩阵。
 *
 * 接入流程详见 docs/07-可执行实施步骤.md「新组件接入」章节。
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(new URL('..', import.meta.url)));

function fail(message: string): never {
  console.error(`✗ ${message}`);
  process.exit(1);
}

// ---------- 参数解析 ----------

const raw = process.argv[2];
if (!raw) fail('请提供组件名（PascalCase），例如：tsx scripts/create-component.ts Select');
if (!/^[A-Z][a-zA-Z0-9]*$/.test(raw)) fail(`"${raw}" 不是合法的 PascalCase 组件名`);

const Name = raw;
const kebab = Name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const logicName = `create${Name}Logic`;

for (const pkg of ['core', 'shared', 'vue', 'react']) {
  const dir = join(ROOT, `packages/${pkg}/src/components/${kebab}`);
  if (existsSync(dir)) fail(`组件已存在：packages/${pkg}/src/components/${kebab}`);
}

function p(pkg: string, ...parts: string[]): string {
  return join(ROOT, `packages/${pkg}/src/components/${kebab}`, ...parts);
}

function write(path: string, content: string): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
  console.log(`  + ${path.replace(ROOT + '/', '')}`);
}

/** 在文件的目标注释标记后追加一行（带自动缩进） */
function appendAfterMarker(file: string, marker: string, line: string): void {
  if (!existsSync(file)) fail(`注册目标不存在：${file}`);
  const source = readFileSync(file, 'utf8');
  const index = source.indexOf(marker);
  if (index === -1) fail(`${file} 中未找到标记 "${marker.trim()}"`);
  const lineStart = source.lastIndexOf('\n', index) + 1;
  const indent = /^\s*/.exec(source.slice(lineStart))?.[0] ?? '';
  writeFileSync(file, `${source.slice(0, index)}${line}\n${indent}${source.slice(index)}`);
}

// ---------- 1. @xui/core 契约 ----------

write(
  p('core', 'types.ts'),
  `/** ${Name} 契约类型
 *
 * Props / Events / Slots / State / Logic
 * 使用 type 别名（而非 interface）以保证与 Record 约束的结构兼容性。
 * TODO：按业务扩展 Props / Events / Slots（参照 packages/core/src/components/button/types.ts）。
 */

import type { LogicInstance } from '../../types';

/** ${Name} Props（Vue 与 React 共用） */
export type ${Name}Props = {
  /** 禁用状态 */
  disabled?: boolean;
  /** 激活回调（由适配层桥接为框架事件） */
  onActivate?: () => void;
};

/** ${Name} 事件契约 */
export type ${Name}Events = {
  activate: () => void;
};

/** ${Name} 插槽契约 */
export type ${Name}Slots = {
  /** 内容 */
  default: Record<string, never>;
};

/** ${Name} 状态快照（由逻辑层暴露） */
export type ${Name}State = {
  disabled: boolean;
};

/** ${Name} 逻辑实例（通用接口 + 交互方法） */
export type ${Name}Logic = LogicInstance<${Name}Props, ${Name}State> & {
  handleActivate: () => void;
};
`,
);

write(
  p('core', 'spec.ts'),
  `/**
 * ${Name} 组件规格
 *
 * useLogic 指向 @xui/shared 的 ${logicName} 逻辑工厂，
 * Vue / React 适配层通过同一份规格驱动组件状态。
 */

import { ${logicName} } from '@xui/shared';

import type { ComponentSpec } from '../../spec';
import type { ${Name}Events, ${Name}Logic, ${Name}Props, ${Name}Slots } from './types';

export const ${kebab}Spec = {
  name: '${Name}',
  props: {
    type: {
      disabled: Boolean,
      onActivate: Function,
    },
    defaults: {
      disabled: false,
    },
  },
  events: {
    activate: { description: '激活时触发' },
  },
  slots: {
    default: { description: '内容' },
  },
  useLogic: (props: ${Name}Props) =>
    ${logicName}({
      disabled: props.disabled,
      onActivate: props.onActivate,
    }),
} satisfies ComponentSpec<${Name}Props, ${Name}Events, ${Name}Slots, ${Name}Logic>;
`,
);

write(p('core', 'index.ts'), `export * from './types';\nexport * from './spec';\n`);

// ---------- 2. @xui/shared 逻辑工厂 ----------

write(
  p('shared', `create-${kebab}-logic.ts`),
  `/**
 * ${Name} 纯逻辑工厂
 *
 * 状态：disabled
 * 交互：handleActivate（禁用时静默忽略）
 * TODO：按业务扩展状态与交互（参照 create-button-logic.ts / create-modal-logic.ts）。
 * 通过 subscribe 通知状态变更，getState 返回不可变快照。
 */

import type { LogicInstance, StateListener } from '../../types';

/** ${Name} 逻辑配置（由适配层从 Props 中提取注入） */
export type ${Name}LogicOptions = {
  disabled?: boolean;
  onActivate?: () => void;
};

/** ${Name} 状态快照 */
export type ${Name}State = {
  disabled: boolean;
};

/** ${Name} 逻辑实例 */
export interface ${Name}LogicInstance
  extends LogicInstance<${Name}LogicOptions, ${Name}State> {
  /** 激活处理：disabled 时不触发回调 */
  handleActivate: () => void;
}

export function ${logicName}(options: ${Name}LogicOptions = {}): ${Name}LogicInstance {
  const state: ${Name}State = {
    disabled: options.disabled ?? false,
  };

  let onActivate = options.onActivate;
  const listeners = new Set<StateListener<${Name}State>>();

  const notify = () => {
    const snapshot = { ...state };
    listeners.forEach((listener) => listener(snapshot));
  };

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },

    getState: () => ({ ...state }),

    updateOptions(next) {
      let changed = false;

      if (next.disabled !== undefined && next.disabled !== state.disabled) {
        state.disabled = next.disabled;
        changed = true;
      }
      if (next.onActivate !== undefined) {
        onActivate = next.onActivate;
      }

      if (changed) notify();
    },

    handleActivate() {
      if (state.disabled) return;
      onActivate?.();
    },
  };
}
`,
);

write(
  p('shared', '__tests__', `create-${kebab}-logic.test.ts`),
  `import { describe, expect, it, vi } from 'vitest';
import { ${logicName} } from '../create-${kebab}-logic';

describe('${logicName}', () => {
  it('初始状态正确', () => {
    const logic = ${logicName}({ disabled: true });
    expect(logic.getState()).toEqual({ disabled: true });
  });

  it('disabled 时 handleActivate 不触发回调', () => {
    const onActivate = vi.fn();
    const logic = ${logicName}({ disabled: true, onActivate });
    logic.handleActivate();
    expect(onActivate).not.toHaveBeenCalled();
  });

  it('激活触发回调，updateOptions 可变更状态', () => {
    const onActivate = vi.fn();
    const listener = vi.fn();
    const logic = ${logicName}({ onActivate });
    logic.subscribe(listener);
    logic.handleActivate();
    expect(onActivate).toHaveBeenCalledTimes(1);
    logic.updateOptions({ disabled: true });
    expect(logic.getState().disabled).toBe(true);
    expect(listener).toHaveBeenCalled();
    logic.handleActivate();
    expect(onActivate).toHaveBeenCalledTimes(1);
  });
});
`,
);

write(p('shared', 'index.ts'), `export * from './create-${kebab}-logic';\n`);

// ---------- 3. @xui/vue SFC ----------

write(
  p('vue', `${Name}.vue`),
  `<script setup lang="ts">
// TODO：按业务扩展（参照 packages/vue/src/components/modal/Modal.vue 的受控/命令式模式）
import { onUnmounted, ref, watchEffect } from 'vue';
import { ${logicName} } from '@xui/shared';
import type { ${Name}Props } from '@xui/core';

const props = withDefaults(defineProps<Omit<${Name}Props, 'onActivate'>>(), {
  disabled: false,
});

const emit = defineEmits<{ activate: [] }>();

const logic = ${logicName}({
  disabled: props.disabled,
  onActivate: () => emit('activate'),
});

const state = ref(logic.getState());
const unsubscribe = logic.subscribe((next) => {
  state.value = next;
});
onUnmounted(unsubscribe);

// Props 变更同步到逻辑层
watchEffect(() => {
  logic.updateOptions({ disabled: props.disabled });
});
</script>

<template>
  <div
    class="xui-${kebab}"
    :class="{ 'is-disabled': state.disabled }"
    @click="logic.handleActivate()"
  >
    <slot />
  </div>
</template>
<!-- 组件样式统一维护在 packages/styles/src/components.scss（单一来源），SFC 不再内联样式 -->
`,
);

write(p('vue', 'index.ts'), `export { default as ${Name} } from './${Name}.vue';\n`);

write(
  p('vue', '__tests__', `${Name}.test.ts`),
  `import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import ${Name} from '../${Name}.vue';

describe('${Name} (vue)', () => {
  it('渲染默认内容与 BEM 类名', () => {
    const wrapper = mount(${Name}, { slots: { default: 'content' } });
    expect(wrapper.classes()).toContain('xui-${kebab}');
    expect(wrapper.text()).toBe('content');
  });

  it('disabled 时不触发 activate 事件', async () => {
    const wrapper = mount(${Name}, { props: { disabled: true } });
    await wrapper.trigger('click');
    expect(wrapper.emitted('activate')).toBeUndefined();
  });

  it('点击触发 activate 事件', async () => {
    const wrapper = mount(${Name});
    await wrapper.trigger('click');
    expect(wrapper.emitted('activate')).toHaveLength(1);
  });
});
`,
);

// ---------- 4. @xui/react 适配层 ----------

write(
  p('react', `${Name}.tsx`),
  `/**
 * ${Name} - React 19 适配层
 *
 * useSyncExternalStore 桥接 @xui/shared 逻辑，回调 latest-ref 化避免受控回退竞态。
 * TODO：按业务扩展（参照 packages/react/src/components/modal/Modal.tsx 的受控/ref 模式）。
 */

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import type { ${Name}Props } from '@xui/core';
import { ${logicName} } from '@xui/shared';
import type { ${Name}LogicInstance } from '@xui/shared';
import { useLogicState } from '../../hooks/use-logic-state';
import { cn } from '../../utils/cn';

/** ${Name} 组件 Props（在契约 Props 基础上扩展 React 专属属性） */
export type ${Name}ComponentProps = ${Name}Props & {
  /** 内容 */
  children?: ReactNode;
};

export function ${Name}(props: ${Name}ComponentProps) {
  const { disabled = false, onActivate, children } = props;

  // 回调 latest-ref：避免回调引用变化触发 updateOptions 重跑（见 Modal.tsx 注释）
  const callbacksRef = useRef({ onActivate });
  callbacksRef.current = { onActivate };

  const logicRef = useRef<${Name}LogicInstance | null>(null);
  if (logicRef.current === null) {
    logicRef.current = ${logicName}({
      disabled,
      onActivate: () => callbacksRef.current.onActivate?.(),
    });
  }
  const logic = logicRef.current;

  useEffect(() => {
    logic.updateOptions({ disabled });
  }, [logic, disabled]);

  const state = useLogicState(logic.subscribe, logic.getState);

  return (
    <div
      className={cn('xui-${kebab}', { 'is-disabled': state.disabled })}
      onClick={() => logic.handleActivate()}
    >
      {children}
    </div>
  );
}
`,
);

write(
  p('react', 'index.ts'),
  `export { ${Name} } from './${Name}';\nexport type { ${Name}ComponentProps } from './${Name}';\n`,
);

write(
  p('react', '__tests__', `${Name}.test.tsx`),
  `import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ${Name} } from '../${Name}';

describe('${Name} (react)', () => {
  it('渲染默认内容与 BEM 类名', () => {
    render(<${Name}>content</${Name}>);
    const el = screen.getByText('content');
    expect(el.className).toContain('xui-${kebab}');
  });

  it('disabled 时不触发 onActivate', () => {
    const onActivate = vi.fn();
    render(<${Name} disabled onActivate={onActivate}>disabled-text</${Name}>);
    fireEvent.click(screen.getByText('disabled-text'));
    expect(onActivate).not.toHaveBeenCalled();
  });

  it('点击触发 onActivate', () => {
    const onActivate = vi.fn();
    render(<${Name} onActivate={onActivate}>clickable-text</${Name}>);
    fireEvent.click(screen.getByText('clickable-text'));
    expect(onActivate).toHaveBeenCalledTimes(1);
  });
});
`,
);

// ---------- 5. 注册导出 ----------

appendAfterMarker(
  join(ROOT, 'packages/core/src/index.ts'),
  `export * from './components/modal';`,
  `export * from './components/${kebab}';`,
);
console.log(`  ~ packages/core/src/index.ts`);

appendAfterMarker(
  join(ROOT, 'packages/shared/src/index.ts'),
  `export * from './components/modal';`,
  `export * from './components/${kebab}';`,
);
console.log(`  ~ packages/shared/src/index.ts`);

const vueIndex = join(ROOT, 'packages/vue/src/index.ts');
appendAfterMarker(
  vueIndex,
  `import { Modal } from './components/modal';`,
  `import { ${Name} } from './components/${kebab}';`,
);
appendAfterMarker(vueIndex, `export { Button, Input, Modal };`, `export { ${Name} };`);
appendAfterMarker(
  vueIndex,
  `app.component(Modal.name ?? 'Modal', Modal);`,
  `app.component(${Name}.name ?? '${Name}', ${Name});`,
);
console.log(`  ~ packages/vue/src/index.ts`);

const reactIndex = join(ROOT, 'packages/react/src/index.ts');
appendAfterMarker(
  reactIndex,
  `export { Button } from './components/button';`,
  `export { ${Name} } from './components/${kebab}';`,
);
appendAfterMarker(
  reactIndex,
  `export type { ButtonComponentProps, ButtonRef } from './components/button';`,
  `export type { ${Name}ComponentProps } from './components/${kebab}';`,
);
console.log(`  ~ packages/react/src/index.ts`);

appendAfterMarker(
  join(ROOT, 'packages/styles/src/components.scss'),
  `/* ===================== Modal ===================== */`,
  `\n/* TODO ${Name}：按上方 Button/Input/Modal 的 BEM + CSS 变量模式补充样式 */\n\n.xui-${kebab} {\n  display: block;\n}\n`,
);
console.log(`  ~ packages/styles/src/components.scss`);

console.log(`\n✓ ${Name} 骨架已生成。接下来：`);
console.log(`  1. 按各文件 TODO 注释实现业务（样式记得去掉 styles 中的 TODO 包裹注释）`);
console.log(`  2. 更新 scripts/contract-test.ts 双端对齐矩阵`);
console.log(`  3. 验证：pnpm lint && pnpm type-check && pnpm test && pnpm build --force`);
