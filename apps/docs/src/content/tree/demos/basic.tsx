import { useState } from 'react';
import { Tree } from '@xui-design/react';
import type { TreeNode } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

const data: TreeNode[] = [
  {
    key: 'src',
    label: 'src',
    children: [
      {
        key: 'components',
        label: 'components',
        children: [
          { key: 'button', label: 'Button.vue' },
          { key: 'input', label: 'Input.vue' },
        ],
      },
      { key: 'main', label: 'main.ts' },
    ],
  },
  { key: 'readme', label: 'README.md' },
];

export default function TreeBasicDemo() {
  const isZh = useIsZh();
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  return (
    <div className="demo-column">
      <Tree
        data={data}
        defaultExpandAll
        selectedKey={selectedKey}
        onSelect={(key) => setSelectedKey(key)}
      />
      <p className="demo-text">
        {isZh ? `选中节点：${selectedKey ?? '（未选中）'}` : `Selected: ${selectedKey ?? '(none)'}`}
      </p>
    </div>
  );
}
