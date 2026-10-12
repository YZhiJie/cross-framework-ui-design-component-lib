import { Badge } from '@xui-design/react';

const anchorStyle = {
  padding: '6px 12px',
  background: '#f1f5f9',
  borderRadius: '6px',
};

export default function BadgeVariantsDemo() {
  return (
    <div className="demo-row">
      <Badge dot>
        <span style={anchorStyle}>小红点</span>
      </Badge>
      <Badge count={0} showZero>
        <span style={anchorStyle}>showZero</span>
      </Badge>
      <Badge count={0}>
        <span style={anchorStyle}>零值隐藏</span>
      </Badge>
      <Badge count={8} />
    </div>
  );
}
