import { useState } from 'react';
import { TreeSelect } from '@xui-design/react';
import type { TreeNode } from '@xui-design/core';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function TreeSelectMultipleDemo() {
  const isZh = useIsZh();
  const [result, setResult] = useState('(pending)');

  const treeData: TreeNode[] = [
    {
      key: 'frontend',
      label: isZh ? '前端' : 'Frontend',
      children: [
        { key: 'vue', label: 'Vue' },
        { key: 'react', label: 'React' },
      ],
    },
    {
      key: 'backend',
      label: isZh ? '后端' : 'Backend',
      children: [{ key: 'node', label: 'Node.js' }],
    },
  ];

  return (
    <div className="demo-column">
      <TreeSelect
        treeData={treeData}
        multiple
        defaultExpandAll
        clearable
        style={{ maxWidth: '280px' }}
        onChange={(value) =>
          setResult(
            isZh
              ? `已勾选：${(value as string[]).join(', ') || '无'}`
              : `Checked: ${(value as string[]).join(', ') || 'none'}`,
          )
        }
      />
      <p className="demo-text">{result}</p>
    </div>
  );
}
