import { Avatar } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

const avatarSrc =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><rect width='80' height='80' fill='%236366f1'/><text x='40' y='52' font-size='36' fill='white' text-anchor='middle'>X</text></svg>";

export default function AvatarBasicDemo() {
  const isZh = useIsZh();
  return (
    <div className="demo-row">
      <Avatar src={avatarSrc} alt={isZh ? 'X 用户头像' : 'X user avatar'} />
      <Avatar>{isZh ? '杨' : 'Yang'}</Avatar>
      <Avatar size="sm">{isZh ? '小' : 'Sm'}</Avatar>
      <Avatar size="lg">{isZh ? '大' : 'Lg'}</Avatar>
    </div>
  );
}
