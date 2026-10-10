/**
 * 提交消息验证脚本
 *
 * 遵循 Conventional Commits 规范：
 * <type>(<scope>): <subject>
 *
 * 允许的 type: feat, fix, docs, style, refactor, perf, test, chore, build, ci, revert
 */

const msg = process.argv[2] || '';

const types = [
  'feat',
  'fix',
  'docs',
  'style',
  'refactor',
  'perf',
  'test',
  'chore',
  'build',
  'ci',
  'revert',
];

const pattern = new RegExp(`^(?:${types.join('|')})(?:\\(.+\\))?: .{1,100}`);

if (!pattern.test(msg)) {
  console.error('\n❌ Invalid commit message format!\n');
  console.error('Expected: <type>(<scope>): <subject>');
  console.error(`Allowed types: ${types.join(', ')}\n`);
  console.error(`Got: "${msg}"\n`);
  process.exit(1);
}

console.log('✅ Commit message format valid');
