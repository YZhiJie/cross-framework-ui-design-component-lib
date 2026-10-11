import { Button } from '@xui/react';

export default function ButtonTypeDemo() {
  return (
    <div className="demo-row">
      <Button>Default</Button>
      <Button type="primary">Primary</Button>
      <Button type="danger">Danger</Button>
      <Button type="link">Link</Button>
    </div>
  );
}
