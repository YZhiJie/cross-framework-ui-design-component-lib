import { useState } from 'react';
import { TreeSelect } from '@xui-design/react';
import type { TreeNode } from '@xui-design/core';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function TreeSelectBasicDemo() {
  const isZh = useIsZh();
  const [result, setResult] = useState('(pending)');

  const treeData: TreeNode[] = [
    {
      key: 'zj',
      label: isZh ? '浙江' : 'Zhejiang',
      children: [
        { key: 'hz', label: isZh ? '杭州' : 'Hangzhou' },
        {
          key: 'nb',
          label: isZh ? '宁波' : 'Ningbo',
          children: [{ key: 'yh', label: isZh ? '余杭' : 'Yuhang' }],
        },
      ],
    },
    { key: 'js', label: isZh ? '江苏' : 'Jiangsu' },
    { key: 'gd', label: isZh ? '广东' : 'Guangdong', disabled: true },
  ];

  return (
    <div className="demo-column">
      <TreeSelect
        treeData={treeData}
        defaultExpandAll
        clearable
        style={{ maxWidth: '280px' }}
        onChange={(value) =>
          setResult(isZh ? `已选择：${String(value)}` : `Selected: ${String(value)}`)
        }
      />
      <p className="demo-text">{result}</p>
    </div>
  );
}
