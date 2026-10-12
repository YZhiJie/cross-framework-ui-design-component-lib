import { useState } from 'react';
import { Button, Tag } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function TagClosableDemo() {
  const isZh = useIsZh();
  const buildTags = () =>
    isZh ? ['前端', 'Vue', 'React', 'TypeScript'] : ['Frontend', 'Vue', 'React', 'TypeScript'];
  const [tags, setTags] = useState(buildTags);
  const remove = (index: number) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="demo-column">
      <div className="demo-row">
        {tags.map((tag, index) => (
          <Tag key={tag} size="sm" closable onClose={() => remove(index)}>
            {tag}
          </Tag>
        ))}
      </div>
      <Button size="sm" onClick={() => setTags(buildTags)}>
        {isZh ? '重置标签' : 'Reset tags'}
      </Button>
    </div>
  );
}
