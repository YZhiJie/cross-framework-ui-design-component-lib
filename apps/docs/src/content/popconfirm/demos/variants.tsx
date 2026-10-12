import { Popconfirm, Button } from '@xui-design/react';

export default function PopconfirmVariantsDemo() {
  return (
    <div className="demo-row">
      <Popconfirm
        content="右侧弹出的气泡确认"
        placement="right"
        confirmText="好的"
        cancelText="再想想"
      >
        <Button>右侧 + 自定义按钮</Button>
      </Popconfirm>
      <Popconfirm content="禁用后点击无效" disabled>
        <Button>禁用</Button>
      </Popconfirm>
    </div>
  );
}
