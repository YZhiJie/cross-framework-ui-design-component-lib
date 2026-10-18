import { useState } from 'react';
import { Tree } from '@xui-design/react';
import type { TreeNode } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function TreeCheckableDemo() {
  const isZh = useIsZh();
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);

  const data: TreeNode[] = [
    {
      key: 'fruit',
      label: isZh ? '水果' : 'Fruits',
      children: [
        { key: 'apple', label: isZh ? '苹果' : 'Apple' },
        { key: 'banana', label: isZh ? '香蕉' : 'Banana' },
        { key: 'durian', label: isZh ? '榴莲（缺货）' : 'Durian (sold out)', disabled: true },
      ],
    },
    {
      key: 'veggie',
      label: isZh ? '蔬菜' : 'Vegetables',
      children: [
        { key: 'carrot', label: isZh ? '胡萝卜' : 'Carrot' },
        { key: 'tomato', label: isZh ? '番茄' : 'Tomato' },
      ],
    },
  ];

  return (
    <div className="demo-column">
      <Tree
        data={data}
        checkable
        defaultExpandAll
        checkedKeys={checkedKeys}
        onCheck={(keys) => setCheckedKeys(keys)}
      />
      <p className="demo-text">
        {isZh
          ? `已勾选：${checkedKeys.length ? checkedKeys.join(', ') : '（无）'}`
          : `Checked: ${checkedKeys.length ? checkedKeys.join(', ') : '(none)'}`}
      </p>
    </div>
  );
}
