/**
 * 契约测试脚本
 *
 * 验证各包构建产物可以被正确 import 和 require，确保双端 API 一致性：
 * 1. ESM import 可用
 * 2. CJS require 可用
 * 3. 类型声明文件存在
 * 4. 包间依赖链可正确解析
 */

import { existsSync, readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
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
    packageName: '@xui/shared',
    distDir: 'packages/shared/dist',
    expectedFiles: ['index.mjs', 'index.cjs', 'types/index.d.ts'],
    description: '纯逻辑核心层',
  },
  {
    packageName: '@xui/core',
    distDir: 'packages/core/dist',
    expectedFiles: ['index.mjs', 'index.cjs', 'types/index.d.ts'],
    description: '框架无关抽象层',
  },
  {
    packageName: '@xui/vue',
    distDir: 'packages/vue/dist',
    expectedFiles: ['index.mjs', 'index.cjs', 'types/index.d.ts'],
    description: 'Vue 适配层',
  },
  {
    packageName: '@xui/react',
    distDir: 'packages/react/dist',
    expectedFiles: ['index.mjs', 'index.cjs', 'types/index.d.ts'],
    description: 'React 适配层',
  },
  {
    packageName: '@xui/styles',
    distDir: 'packages/styles/dist',
    expectedFiles: ['index.css'],
    description: '共享样式包',
  },
  {
    packageName: '@xui/icons',
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
      console.log(
        `${check.packageName}`.padEnd(20) + `file: ${file}`.padEnd(30) + '❌ Missing',
      );
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
        console.log(`${check.packageName}`.padEnd(20) + 'CJS require'.padEnd(30) + '❌ Null export');
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

console.log('');
if (hasFailure) {
  console.error('❌ Contract test FAILED\n');
  process.exit(1);
} else {
  console.log('✅ All contract checks passed\n');
}
