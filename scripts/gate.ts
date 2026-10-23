/**
 * 统一门禁脚本 —— 一条命令走完所有发布前检查
 *
 * 执行顺序（依赖链决定：后一个需要前一个的产物）：
 *   1. lint         代码风格 + ESLint
 *   2. type-check   全仓 TypeScript 编译检查（含 noUnusedLocals/noUnusedParameters）
 *   3. knip         未使用文件 / 导出 / 类型 / 依赖（阻断）
 *   4. build        构建所有包（契约测试 + 体积检查依赖 dist/types）
 *   5. contract-test 双端 API 对齐
 *   6. test         所有单元测试
 *   7. check-bundle-size 体积预算
 *
 * 用法：
 *   pnpm gate                # 跑全部门禁
 *   pnpm gate --skip e2e     # 跳过 e2e（耗时，默认不跑）
 *   pnpm gate --only type-check   # 只跑指定步骤
 *
 * 失败即退出，返回第一个非零退出码，CI 可以直接 `pnpm gate` 作为 quality job。
 */

import { spawnSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// ANSI 颜色
const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

interface GateStep {
  name: string;
  label: string;
  cmd: string;
  args: string[];
  cwd?: string;
  // 是否允许失败后继续（contract-test 是硬依赖，必须 build 先成功）
  required: boolean;
}

const steps: GateStep[] = [
  {
    name: 'lint',
    label: '代码风格 + ESLint',
    cmd: 'pnpm',
    args: ['lint'],
    required: true,
  },
  {
    name: 'type-check',
    label: 'TypeScript 类型检查（含 noUnusedLocals/noUnusedParameters）',
    cmd: 'pnpm',
    args: ['type-check'],
    required: true,
  },
  {
    // 公开 API 面已在 knip.json 的 ignoreIssues 中白名单化，其余未使用导出/类型阻断
    name: 'knip',
    label: '未使用文件 / 导出 / 类型 / 依赖（knip）',
    cmd: 'pnpm',
    args: ['knip'],
    required: true,
  },
  {
    name: 'build',
    label: '构建所有包（contract-test / bundle-size 依赖 dist/types）',
    cmd: 'pnpm',
    args: ['build'],
    required: true,
  },
  {
    name: 'contract-test',
    label: '双端 API 契约对齐（dist 产物 + Vue/React 源码比对）',
    cmd: 'pnpm',
    args: ['exec', 'tsx', 'scripts/contract-test.ts'],
    required: true,
  },
  {
    name: 'test',
    label: '单元测试（vitest）',
    cmd: 'pnpm',
    args: ['test'],
    required: true,
  },
  {
    name: 'bundle-size',
    label: '包体积预算',
    cmd: 'pnpm',
    args: ['exec', 'tsx', 'scripts/check-bundle-size.ts'],
    required: true,
  },
];

function runStep(step: GateStep): { ok: boolean; durationMs: number } {
  const header = `${C.bold}${C.cyan}▶ ${step.label}${C.reset}`;
  console.log(`\n${header}`);

  const t0 = Date.now();
  const result = spawnSync(step.cmd, step.args, {
    cwd: step.cwd ?? rootDir,
    stdio: 'inherit',
    shell: false,
  });
  const durationMs = Date.now() - t0;

  const ok = result.status === 0;
  const status = ok ? `${C.bold}${C.green}✓ PASS${C.reset}` : `${C.bold}${C.red}✗ FAIL${C.reset}`;
  const requiredTag = step.required ? '' : ` ${C.yellow}(non-fatal)${C.reset}`;
  console.log(
    `${status}${requiredTag}  ${C.bold}${step.name}${C.reset}  ${C.cyan}${(durationMs / 1000).toFixed(1)}s${C.reset}`,
  );

  return { ok, durationMs };
}

function parseFlags(args: string[]): { only?: string; skip: Set<string>; help: boolean } {
  const onlyIdx = args.findIndex((a) => a === '--only' || a === '-o');
  const skipIdx = args.findIndex((a) => a === '--skip' || a === '-s');
  const help = args.includes('--help') || args.includes('-h');

  const only = onlyIdx !== -1 ? args[onlyIdx + 1] : undefined;
  const skip = new Set<string>();
  if (skipIdx !== -1) {
    args[skipIdx + 1]?.split(',').forEach((n) => skip.add(n.trim()));
  }
  return { only, skip, help };
}

function printHelp() {
  console.log(`
${C.bold}pnpm gate${C.reset} — 统一门禁脚本

${C.bold}用法${C.reset}:
  pnpm gate                      跑全部门禁
  pnpm gate --only type-check     只跑指定步骤
  pnpm gate --skip test,e2e       跳过指定步骤

${C.bold}当前步骤${C.reset}:
  type-check      TypeScript 编译检查（含 noUnusedLocals/noUnusedParameters）
  knip            未使用文件 / 导出 / 类型 / 依赖检查（阻断）
  build           构建所有包
  contract-test   双端 API 契约对齐
  test            单元测试
  bundle-size     包体积预算

${C.bold}退出码${C.reset}: 任一 required 步骤失败 → 对应非零退出码
  CI 可以直接在 workflow 里跑 \`pnpm gate\` 作为 quality job。
`);
}

// ---------- 主流程 ----------

const flags = parseFlags(process.argv.slice(2));
if (flags.help) {
  printHelp();
  process.exit(0);
}

// 过滤步骤
let runList = steps;
if (flags.only) {
  runList = steps.filter((s) => s.name === flags.only);
  if (runList.length === 0) {
    console.error(`${C.red}✗ 未知步骤: ${flags.only}${C.reset}`);
    printHelp();
    process.exit(1);
  }
} else {
  runList = steps.filter((s) => !flags.skip.has(s.name));
}

console.log(`\n${C.bold}${C.yellow}╔══════════════════════════════════════════════════╗${C.reset}`);
console.log(
  `${C.bold}${C.yellow}║  ${C.cyan}🚪 cross-framework-ui 发布门禁${C.yellow}                         ║${C.reset}`,
);
console.log(`${C.bold}${C.yellow}╚══════════════════════════════════════════════════╝${C.reset}`);
console.log(
  `${C.cyan}共 ${runList.length} / ${steps.length} 个步骤${C.reset}${
    flags.only ? `  ${C.yellow}(--only ${flags.only})${C.reset}` : ''
  }${flags.skip.size ? `  ${C.yellow}(--skip ${[...flags.skip].join(',')})${C.reset}` : ''}`,
);

const results = [] as { step: GateStep; ok: boolean; durationMs: number }[];
let firstFailExit = 0;

for (const step of runList) {
  const r = runStep(step);
  results.push({ step, ...r });
  if (!r.ok && step.required) {
    firstFailExit = 1;
    break; // 硬失败立即停止，后续步骤依赖前面的产物
  }
}

// 汇总表
const totalMs = results.reduce((a, r) => a + r.durationMs, 0);
const passed = results.filter((r) => r.ok).length;
const failedCount = results.filter((r) => !r.ok && r.step.required).length;

console.log(
  `\n${C.bold}${failedCount > 0 ? C.red : C.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}`,
);
console.log(
  `${C.bold}${failedCount > 0 ? C.red : C.green}门禁结果: ${C.reset}` +
    `${C.green}${passed} passed${C.reset}  ` +
    `${C.red}${failedCount > 0 ? `${failedCount} failed` : '0 failed'}${C.reset}  ` +
    `${C.cyan}${(totalMs / 1000).toFixed(1)}s${C.reset}`,
);
if (failedCount > 0) {
  console.log(`${C.bold}${C.red}❌ 门禁失败 — 修复后重跑 ${C.cyan}pnpm gate${C.red}${C.reset}`);
} else {
  console.log(`${C.bold}${C.green}✅ 全部通过，可以 commit / push${C.reset}`);
}

process.exit(firstFailExit);
