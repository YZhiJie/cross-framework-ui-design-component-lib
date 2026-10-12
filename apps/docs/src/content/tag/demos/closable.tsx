import { useState } from 'react';
import { Button, Tag } from '@xui-design/react';

const INITIAL_TAGS = ['前端', 'Vue', 'React', 'TypeScript'];

export default function TagClosableDemo() {
  const [tags, setTags] = useState(INITIAL_TAGS);
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
      <Button size="sm" onClick={() => setTags(INITIAL_TAGS)}>
        重置标签
      </Button>
    </div>
  );
}
