import { Avatar } from '@xui-design/react';

export default function AvatarShapeDemo() {
  return (
    <div className="demo-column">
      <div className="demo-row">
        <Avatar shape="square">方</Avatar>
        <Avatar shape="circle">圆</Avatar>
      </div>
      <div className="demo-row">
        <Avatar src="/not-exist.png" onError={() => console.log('image load failed')}>
          失败回退
        </Avatar>
        <Avatar src="/not-exist.png" />
      </div>
    </div>
  );
}
