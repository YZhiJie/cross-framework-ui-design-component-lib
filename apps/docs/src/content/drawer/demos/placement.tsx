import { useState } from 'react';
import { Button, Drawer } from '@xui-design/react';
import type { DrawerPlacement } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function DrawerPlacementDemo() {
  const isZh = useIsZh();
  const [visible, setVisible] = useState(false);
  const [placement, setPlacement] = useState<DrawerPlacement>('right');

  const open = (next: DrawerPlacement) => {
    setPlacement(next);
    setVisible(true);
  };

  return (
    <div className="demo-column">
      <div className="demo-row">
        <Button onClick={() => open('left')}>{isZh ? '左侧' : 'Left'}</Button>
        <Button onClick={() => open('right')}>{isZh ? '右侧' : 'Right'}</Button>
        <Button onClick={() => open('top')}>{isZh ? '顶部' : 'Top'}</Button>
        <Button onClick={() => open('bottom')}>{isZh ? '底部' : 'Bottom'}</Button>
      </div>
      <Drawer
        visible={visible}
        placement={placement}
        title={isZh ? '四方向抽屉' : 'Placements'}
        size={placement === 'top' || placement === 'bottom' ? 240 : 320}
        onClose={() => setVisible(false)}
      >
        <p>
          {isZh
            ? 'placement 控制抽屉滑入方向：left / right / top / bottom。'
            : 'placement controls the slide-in edge: left / right / top / bottom.'}
        </p>
      </Drawer>
    </div>
  );
}
