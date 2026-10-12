import { Avatar } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function AvatarShapeDemo() {
  const isZh = useIsZh();
  return (
    <div className="demo-column">
      <div className="demo-row">
        <Avatar shape="square">{isZh ? '方' : 'Square'}</Avatar>
        <Avatar shape="circle">{isZh ? '圆' : 'Circle'}</Avatar>
      </div>
      <div className="demo-row">
        <Avatar src="/not-exist.png" onError={() => console.log('image load failed')}>
          {isZh ? '失败回退' : 'Fallback'}
        </Avatar>
        <Avatar src="/not-exist.png" />
      </div>
    </div>
  );
}
