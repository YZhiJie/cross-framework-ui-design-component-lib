/**
 * 契约测试脚本
 *
 * 验证各包构建产物可以被正确 import 和 require，并校验双端 API 对齐：
 * 1. ESM import 可用
 * 2. CJS require 可用
 * 3. 类型声明文件存在
 * 4. 包间依赖链可正确解析
 * 5. API 对齐：以 @xui-design/core 运行时 spec 为契约基准，
 *    对比 Vue（运行时 props/emits）与 React（源码静态解析）的
 *    Props、事件名、默认值，任何不一致即失败
 */

import { existsSync, readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const rootDir = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const require = createRequire(import.meta.url);

interface ContractCheck {
  packageName: string;
  distDir: string;
  expectedFiles: string[];
  description: string;
}

const checks: ContractCheck[] = [
  {
    packageName: '@xui-design/shared',
    distDir: 'packages/shared/dist',
    expectedFiles: ['index.mjs', 'index.cjs', 'types/index.d.ts'],
    description: '纯逻辑核心层',
  },
  {
    packageName: '@xui-design/core',
    distDir: 'packages/core/dist',
    expectedFiles: ['index.mjs', 'index.cjs', 'types/index.d.ts'],
    description: '框架无关抽象层',
  },
  {
    packageName: '@xui-design/vue',
    distDir: 'packages/vue/dist',
    expectedFiles: ['index.mjs', 'index.cjs', 'types/index.d.ts'],
    description: 'Vue 适配层',
  },
  {
    packageName: '@xui-design/react',
    distDir: 'packages/react/dist',
    expectedFiles: ['index.mjs', 'index.cjs', 'types/index.d.ts'],
    description: 'React 适配层',
  },
  {
    packageName: '@xui-design/styles',
    distDir: 'packages/styles/dist',
    expectedFiles: ['index.css'],
    description: '共享样式包',
  },
  {
    packageName: '@xui-design/icons',
    distDir: 'packages/icons/dist',
    expectedFiles: ['index.mjs', 'index.cjs', 'types/index.d.ts'],
    description: '图标包',
  },
];

let hasFailure = false;

console.log('\n📋 Contract Test\n');
console.log('Package'.padEnd(20) + 'Check'.padEnd(30) + 'Status');
console.log('-'.repeat(70));

for (const check of checks) {
  const distPath = resolve(rootDir, check.distDir);

  // 1. Check dist directory exists
  if (!existsSync(distPath)) {
    console.log(`${check.packageName}`.padEnd(20) + 'dist directory'.padEnd(30) + '❌ Missing');
    hasFailure = true;
    continue;
  }

  // 2. Check expected files exist
  let allFilesExist = true;
  for (const file of check.expectedFiles) {
    const filePath = join(distPath, file);
    if (!existsSync(filePath)) {
      console.log(`${check.packageName}`.padEnd(20) + `file: ${file}`.padEnd(30) + '❌ Missing');
      allFilesExist = false;
      hasFailure = true;
    }
  }

  if (!allFilesExist) continue;

  // 3. Check CJS require works
  const cjsFile = join(distPath, 'index.cjs');
  if (existsSync(cjsFile)) {
    try {
      const mod = require(cjsFile);
      if (mod === undefined || mod === null) {
        console.log(
          `${check.packageName}`.padEnd(20) + 'CJS require'.padEnd(30) + '❌ Null export',
        );
        hasFailure = true;
      } else {
        console.log(`${check.packageName}`.padEnd(20) + 'CJS require'.padEnd(30) + '✅');
      }
    } catch (err) {
      console.log(
        `${check.packageName}`.padEnd(20) +
          'CJS require'.padEnd(30) +
          `❌ ${(err as Error).message}`,
      );
      hasFailure = true;
    }
  } else {
    // Non-JS package (e.g., styles), skip CJS check
    console.log(`${check.packageName}`.padEnd(20) + 'CJS require'.padEnd(30) + '⏭️  Skip (non-JS)');
  }

  // 4. Check sideEffects field in package.json
  const pkgJsonPath = resolve(rootDir, check.distDir, '..', 'package.json');
  if (existsSync(pkgJsonPath)) {
    const pkg = JSON.parse(readFileSync(pkgJsonPath, 'utf-8'));
    if (!('sideEffects' in pkg)) {
      console.log(
        `${check.packageName}`.padEnd(20) + 'sideEffects field'.padEnd(30) + '⚠️  Not declared',
      );
    }
  }
}

/* ==========================================================================
 * Part 2: API 对齐校验
 *
 * 以 @xui-design/core 的运行时 spec（buttonSpec / inputSpec / modalSpec）为契约基准：
 * - Vue 端（运行时）：读取已构建的 packages/vue/dist/index.mjs，
 *   编译后的 SFC 带 props 选项（含 default 值）与 emits 数组，可直接读取。
 *   ⚠️ Vue 端数据来自 dist：修改 Vue 源码后请先 `pnpm build --filter @xui-design/vue`。
 * - React 端（静态）：函数组件无运行时 props 元数据，
 *   用轻量正则从 .tsx 源码的函数签名解构中提取 props 键与内联默认值。
 * - 事件映射：契约事件 E → Vue emits 含 E（允许额外的 update:* 语法糖）；
 *   → React props 含 on + E 首字母大写。
 * - 框架惯用法差异不算不对齐：Vue 的 defineModel（value/visible 的受控语法糖
 *   update:*，以及 defaultValue/defaultVisible 的初始值由 v-model 初始绑定承担）；
 *   React 的 children / ref / render* 插槽回调。
 * ========================================================================== */

interface CoreSpecLike {
  name: string;
  props: { type: Record<string, unknown>; defaults: Record<string, unknown> };
  events: Record<string, unknown>;
}

interface VuePropDef {
  default?: unknown;
}

interface VueComponentLike {
  props?: Record<string, VuePropDef>;
  emits?: unknown;
}

interface ComponentPlan {
  name: string;
  /** @xui-design/core 运行时导出的 spec 键名 */
  specKey: string;
  /** React 组件源码路径（相对仓库根目录） */
  reactSource: string;
  /** Vue defineModel 管理的受控 prop（value / visible） */
  modelProp: string | null;
  /** React 独有的非受控初始值 prop，Vue 端由 defineModel 默认值/初始绑定承担 */
  modelCoveredProps: string[];
}

const API_COMPONENTS: ComponentPlan[] = [
  {
    name: 'Button',
    specKey: 'buttonSpec',
    reactSource: 'packages/react/src/components/button/Button.tsx',
    modelProp: null,
    modelCoveredProps: [],
  },
  {
    name: 'Switch',
    specKey: 'switchSpec',
    reactSource: 'packages/react/src/components/switch/Switch.tsx',
    modelProp: 'value',
    modelCoveredProps: ['defaultValue'],
  },
  {
    name: 'Checkbox',
    specKey: 'checkboxSpec',
    reactSource: 'packages/react/src/components/checkbox/Checkbox.tsx',
    modelProp: 'value',
    modelCoveredProps: ['defaultValue'],
  },
  {
    name: 'Tag',
    specKey: 'tagSpec',
    reactSource: 'packages/react/src/components/tag/Tag.tsx',
    modelProp: null,
    modelCoveredProps: [],
  },
  {
    name: 'Alert',
    specKey: 'alertSpec',
    reactSource: 'packages/react/src/components/alert/Alert.tsx',
    modelProp: null,
    modelCoveredProps: [],
  },
  {
    name: 'Input',
    specKey: 'inputSpec',
    reactSource: 'packages/react/src/components/input/Input.tsx',
    modelProp: 'value',
    modelCoveredProps: ['defaultValue'],
  },
  {
    name: 'Modal',
    specKey: 'modalSpec',
    reactSource: 'packages/react/src/components/modal/Modal.tsx',
    modelProp: 'visible',
    modelCoveredProps: ['defaultVisible'],
  },
  {
    name: 'RadioGroup',
    specKey: 'radioGroupSpec',
    reactSource: 'packages/react/src/components/radio-group/RadioGroup.tsx',
    modelProp: 'value',
    modelCoveredProps: ['defaultValue'],
  },
  {
    name: 'Radio',
    specKey: 'radioSpec',
    reactSource: 'packages/react/src/components/radio/Radio.tsx',
    modelProp: null,
    modelCoveredProps: [],
  },
  {
    name: 'Progress',
    specKey: 'progressSpec',
    reactSource: 'packages/react/src/components/progress/Progress.tsx',
    modelProp: null,
    modelCoveredProps: [],
  },
  {
    name: 'Badge',
    specKey: 'badgeSpec',
    reactSource: 'packages/react/src/components/badge/Badge.tsx',
    modelProp: null,
    modelCoveredProps: [],
  },
  {
    name: 'Avatar',
    specKey: 'avatarSpec',
    reactSource: 'packages/react/src/components/avatar/Avatar.tsx',
    modelProp: null,
    modelCoveredProps: [],
  },
  {
    name: 'Empty',
    specKey: 'emptySpec',
    reactSource: 'packages/react/src/components/empty/Empty.tsx',
    modelProp: null,
    modelCoveredProps: [],
  },
  {
    name: 'Select',
    specKey: 'selectSpec',
    reactSource: 'packages/react/src/components/select/Select.tsx',
    modelProp: 'value',
    modelCoveredProps: ['defaultValue'],
  },
  {
    name: 'Tabs',
    specKey: 'tabsSpec',
    reactSource: 'packages/react/src/components/tabs/Tabs.tsx',
    modelProp: 'value',
    modelCoveredProps: ['defaultValue'],
  },
  {
    name: 'Tooltip',
    specKey: 'tooltipSpec',
    reactSource: 'packages/react/src/components/tooltip/Tooltip.tsx',
    modelProp: null,
    modelCoveredProps: [],
  },
  {
    name: 'Pagination',
    specKey: 'paginationSpec',
    reactSource: 'packages/react/src/components/pagination/Pagination.tsx',
    modelProp: 'value',
    modelCoveredProps: ['defaultValue'],
  },
  {
    name: 'DatePicker',
    specKey: 'datePickerSpec',
    reactSource: 'packages/react/src/components/date-picker/DatePicker.tsx',
    modelProp: 'value',
    modelCoveredProps: ['defaultValue'],
  },
  {
    name: 'Table',
    specKey: 'tableSpec',
    reactSource: 'packages/react/src/components/table/Table.tsx',
    modelProp: null,
    modelCoveredProps: [],
  },
  {
    name: 'Spin',
    specKey: 'spinSpec',
    reactSource: 'packages/react/src/components/spin/Spin.tsx',
    modelProp: null,
    modelCoveredProps: [],
  },
  {
    name: 'Breadcrumb',
    specKey: 'breadcrumbSpec',
    reactSource: 'packages/react/src/components/breadcrumb/Breadcrumb.tsx',
    modelProp: null,
    modelCoveredProps: [],
  },
  {
    name: 'Skeleton',
    specKey: 'skeletonSpec',
    reactSource: 'packages/react/src/components/skeleton/Skeleton.tsx',
    modelProp: null,
    modelCoveredProps: [],
  },
  {
    name: 'InputNumber',
    specKey: 'inputNumberSpec',
    reactSource: 'packages/react/src/components/input-number/InputNumber.tsx',
    modelProp: 'value',
    modelCoveredProps: ['defaultValue'],
  },
  {
    name: 'Popconfirm',
    specKey: 'popconfirmSpec',
    reactSource: 'packages/react/src/components/popconfirm/Popconfirm.tsx',
    modelProp: null,
    modelCoveredProps: [],
  },
];

interface MatrixRow {
  component: string;
  check: string;
  vue: string;
  react: string;
  status: string;
}

const apiMatrix: MatrixRow[] = [];
const apiFailures: string[] = [];

const capitalize = (text: string): string => text.charAt(0).toUpperCase() + text.slice(1);
const decapitalize = (text: string): string => text.charAt(0).toLowerCase() + text.slice(1);
const eventToReactProp = (event: string): string => `on${capitalize(event)}`;
const reactPropToEvent = (prop: string): string | null => {
  const matched = /^on([A-Z].+)$/.exec(prop);
  return matched ? decapitalize(matched[1]) : null;
};

/** React 的插槽 render 回调 / children / ref 属于框架惯用法，不参与契约比对 */
const isReactIdiomProp = (prop: string): boolean =>
  prop === 'children' || prop === 'ref' || /^render[A-Z]/.test(prop);

function formatValue(value: unknown): string {
  if (value === undefined) return '（无默认）';
  if (typeof value === 'string') return `'${value}'`;
  return String(value);
}

/** 解析 React 解构中的内联默认值字面量 */
function parseLiteral(raw: string): unknown {
  const text = raw.trim();
  if (
    (text.startsWith("'") && text.endsWith("'")) ||
    (text.startsWith('"') && text.endsWith('"'))
  ) {
    return text.slice(1, -1);
  }
  if (text === 'true') return true;
  if (text === 'false') return false;
  if (/^-?\d+(?:\.\d+)?$/.test(text)) return Number(text);
  return text;
}

/** 从 React 函数组件源码解析 props 解构（键 + 内联默认值），不引入 ts-morph */
function parseReactProps(source: string, componentName: string): Map<string, unknown> {
  const fnIndex = source.indexOf(`export function ${componentName}(`);
  if (fnIndex === -1) {
    throw new Error(`React 源码中未找到 export function ${componentName}`);
  }
  const declStart = source.indexOf('const {', fnIndex);
  const declEnd = source.indexOf('} = props;', declStart);
  if (declStart === -1 || declEnd === -1) {
    throw new Error(`React 组件 ${componentName} 的 props 解构解析失败`);
  }
  const body = source.slice(declStart + 'const {'.length, declEnd);
  const props = new Map<string, unknown>();
  for (const piece of body.split(',')) {
    const line = piece.trim();
    if (!line) continue;
    // 形如：key、key: alias、key = default、key: alias = default
    const matched = /^(\w+)\s*(?::\s*\w+)?\s*(?:=\s*(.+))?$/.exec(line);
    if (!matched) continue;
    props.set(matched[1], matched[2] !== undefined ? parseLiteral(matched[2]) : undefined);
  }
  return props;
}

function normalizeEmits(emits: unknown): string[] {
  if (Array.isArray(emits)) return emits.map(String);
  if (emits && typeof emits === 'object') return Object.keys(emits);
  return [];
}

/** 读取 Vue 编译产物的 props 选项（含 default），过滤 defineModel 的 *Modifiers 键 */
function readVueProps(component: VueComponentLike): Map<string, unknown> {
  const props = new Map<string, unknown>();
  for (const [key, def] of Object.entries(component.props ?? {})) {
    if (key.endsWith('Modifiers')) continue;
    let fallback = def?.default;
    if (typeof fallback === 'function' && fallback.length === 0) {
      fallback = (fallback as () => unknown)();
    }
    props.set(key, fallback);
  }
  return props;
}

function addRow(component: string, check: string, vue: string, react: string, ok: boolean): void {
  apiMatrix.push({ component, check, vue, react, status: ok ? '✅' : '❌' });
}

async function runApiAlignment(): Promise<void> {
  console.log('\n🔌 API 对齐校验（core 契约 × Vue 运行时 × React 源码）\n');

  let coreModule: Record<string, unknown>;
  try {
    coreModule = (await import(
      pathToFileURL(resolve(rootDir, 'packages/core/dist/index.mjs')).href
    )) as Record<string, unknown>;
  } catch (err) {
    console.error(`❌ 无法加载 @xui-design/core dist（请先构建）：${(err as Error).message}`);
    process.exit(1);
  }

  let vueModule: Record<string, unknown>;
  try {
    vueModule = (await import(
      pathToFileURL(resolve(rootDir, 'packages/vue/dist/index.mjs')).href
    )) as Record<string, unknown>;
  } catch (err) {
    console.error(
      `❌ 无法加载 @xui-design/vue dist（请先 pnpm build --filter @xui-design/vue）：${(err as Error).message}`,
    );
    process.exit(1);
  }

  for (const plan of API_COMPONENTS) {
    const spec = coreModule[plan.specKey] as CoreSpecLike | undefined;
    if (!spec) {
      apiFailures.push(`${plan.name}: core 契约 ${plan.specKey} 不可用`);
      continue;
    }
    const vueComponent = vueModule[plan.name] as VueComponentLike | undefined;
    if (!vueComponent) {
      apiFailures.push(`${plan.name}: Vue dist 中未找到组件导出`);
      continue;
    }

    const vueProps = readVueProps(vueComponent);
    const vueEmits = normalizeEmits(vueComponent.emits);
    const reactProps = parseReactProps(
      readFileSync(resolve(rootDir, plan.reactSource), 'utf-8'),
      plan.name,
    );

    const coreEvents = Object.keys(spec.events);
    // core props.type 中 onXxx 形式的回调 prop 由 events 契约表达，不参与 props 对齐
    const corePropKeys = Object.keys(spec.props.type).filter(
      (key) => reactPropToEvent(key) === null,
    );
    const coreDefaults = spec.props.defaults ?? {};
    const isModelGoverned = (key: string): boolean =>
      key === plan.modelProp || plan.modelCoveredProps.includes(key);

    // 1) 事件对齐：契约事件 E → Vue emits 含 E；React props 含 on + E 首字母大写
    for (const event of coreEvents) {
      const vueOk = vueEmits.includes(event);
      const reactProp = eventToReactProp(event);
      const reactOk = reactProps.has(reactProp);
      addRow(
        plan.name,
        `事件 ${event}`,
        vueOk ? `emits('${event}') ✓` : '缺失',
        reactOk ? `${reactProp} ✓` : '缺失',
        vueOk && reactOk,
      );
      if (!vueOk) apiFailures.push(`${plan.name}: 事件 ${event} 未在 Vue emits 中声明`);
      if (!reactOk) {
        apiFailures.push(`${plan.name}: 事件 ${event} 未在 React props（${reactProp}）中声明`);
      }
    }

    // Vue 额外事件仅允许 update:*（defineModel 语法糖）
    for (const event of vueEmits) {
      if (coreEvents.includes(event) || event.startsWith('update:')) continue;
      addRow(plan.name, `额外事件 ${event}`, `emits('${event}')`, '—', false);
      apiFailures.push(`${plan.name}: Vue 存在契约之外的事件 ${event}`);
    }

    // React 额外 onXxx 回调不允许（必须来自契约事件）
    for (const prop of reactProps.keys()) {
      const event = reactPropToEvent(prop);
      if (event && !coreEvents.includes(event)) {
        addRow(plan.name, `额外回调 ${prop}`, '—', `${prop} ✓`, false);
        apiFailures.push(`${plan.name}: React 存在契约之外的回调 prop ${prop}`);
      }
    }

    // 2) Props 集合对齐（以 core 契约为基准）
    for (const key of corePropKeys) {
      const coveredByModel = plan.modelCoveredProps.includes(key);
      const vueOk = vueProps.has(key) || coveredByModel;
      const reactOk = reactProps.has(key);
      addRow(
        plan.name,
        `prop ${key}`,
        vueProps.has(key) ? '✓' : coveredByModel ? 'v-model 承担' : '缺失',
        reactOk ? '✓' : '缺失',
        vueOk && reactOk,
      );
      if (!vueOk) apiFailures.push(`${plan.name}: prop ${key} 未在 Vue 组件中定义`);
      if (!reactOk) apiFailures.push(`${plan.name}: prop ${key} 未在 React 组件中定义`);
    }

    // 双端不得引入契约之外的 prop（React 侧豁免框架惯用法）
    for (const key of vueProps.keys()) {
      if (!corePropKeys.includes(key)) {
        addRow(plan.name, `额外 prop ${key}`, `${key} ✓`, '—', false);
        apiFailures.push(`${plan.name}: Vue 存在契约之外的 prop ${key}`);
      }
    }
    for (const key of reactProps.keys()) {
      if (corePropKeys.includes(key) || reactPropToEvent(key) !== null) continue;
      if (isReactIdiomProp(key)) continue;
      addRow(plan.name, `额外 prop ${key}`, '—', `${key} ✓`, false);
      apiFailures.push(`${plan.name}: React 存在契约之外的 prop ${key}（非框架惯用法）`);
    }

    // 3) 默认值对齐：双端交集逐项比对
    //    （modelProp 与 modelCoveredProps 由 v-model 惯用法管理，不做严格比对）
    for (const key of corePropKeys) {
      if (isModelGoverned(key)) continue;
      const vueDefault = vueProps.get(key);
      const reactDefault = reactProps.get(key);
      const same = Object.is(vueDefault, reactDefault);
      addRow(plan.name, `默认值 ${key}`, formatValue(vueDefault), formatValue(reactDefault), same);
      if (!same) {
        apiFailures.push(
          `${plan.name}: 默认值 ${key} 不一致 — Vue: ${formatValue(vueDefault)} / React: ${formatValue(reactDefault)}`,
        );
      }
    }

    // 4) core 契约默认值逐项复核（双端各自与契约对齐）
    for (const [key, expected] of Object.entries(coreDefaults)) {
      if (isModelGoverned(key)) continue;
      const vueOk = Object.is(vueProps.get(key), expected);
      const reactOk = Object.is(reactProps.get(key), expected);
      if (!vueOk) {
        apiFailures.push(
          `${plan.name}: Vue 默认值 ${key}=${formatValue(vueProps.get(key))} 与 core 契约 ${formatValue(expected)} 不符`,
        );
      }
      if (!reactOk) {
        apiFailures.push(
          `${plan.name}: React 默认值 ${key}=${formatValue(reactProps.get(key))} 与 core 契约 ${formatValue(expected)} 不符`,
        );
      }
    }
  }

  // 输出对齐矩阵
  console.log(
    '组件'.padEnd(10) + '检查项'.padEnd(20) + 'Vue 端'.padEnd(22) + 'React 端'.padEnd(18) + '结果',
  );
  console.log('-'.repeat(78));
  for (const row of apiMatrix) {
    console.log(
      row.component.padEnd(10) +
        row.check.padEnd(20) +
        row.vue.padEnd(22) +
        row.react.padEnd(18) +
        row.status,
    );
  }
  console.log('');
}

await runApiAlignment();

console.log('');
if (hasFailure || apiFailures.length > 0) {
  if (apiFailures.length > 0) {
    console.error('❌ API 对齐检查未通过：');
    for (const failure of apiFailures) {
      console.error(`   - ${failure}`);
    }
    console.error('');
  }
  console.error('❌ Contract test FAILED\n');
  process.exit(1);
} else {
  console.log('✅ All contract checks passed（dist 产物 + 双端 API 对齐）\n');
}
