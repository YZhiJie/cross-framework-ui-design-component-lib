import { useRef, useState } from 'react';
import { Button, Tree } from '@xui-design/react';
import type { TreeNode, TreeRef } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

const data: TreeNode[] = [
  {
    key: 'frontend',
    label: '前端',
    children: [
      { key: 'vue', label: 'Vue' },
      { key: 'react', label: 'React' },
    ],
  },
  {
    key: 'backend',
    label: '后端',
    children: [
      { key: 'node', label: 'Node.js' },
      { key: 'go', label: 'Go' },
    ],
  },
];

export default function TreeActionsDemo() {
  const isZh = useIsZh();
  const treeRef = useRef<TreeRef>(null);
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);

  return (
    <div className="demo-column">
      <div className="demo-row">
        <Button size="sm" onClick={() => treeRef.current?.expandAll()}>
          {isZh ? '全部展开' : 'Expand all'}
        </Button>
        <Button size="sm" onClick={() => treeRef.current?.collapseAll()}>
          {isZh ? '全部收起' : 'Collapse all'}
        </Button>
        <Button size="sm" onClick={() => treeRef.current?.checkAll()}>
          {isZh ? '全选' : 'Check all'}
        </Button>
        <Button size="sm" onClick={() => treeRef.current?.uncheckAll()}>
          {isZh ? '清空勾选' : 'Uncheck all'}
        </Button>
      </div>
      <Tree
        ref={treeRef}
        data={data}
        checkable
        defaultExpandAll
        checkedKeys={checkedKeys}
        onCheck={(keys) => setCheckedKeys(keys)}
      />
    </div>
  );
}
