import { Alert } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function AlertBasicDemo() {
  const isZh = useIsZh();
  return (
    <div className="demo-column">
      <Alert
        type="info"
        title={isZh ? '信息提示' : 'Info'}
        description={isZh ? '这是一条普通的信息性说明。' : 'A normal informational message.'}
      />
      <Alert
        type="success"
        title={isZh ? '成功提示' : 'Success'}
        description={isZh ? '操作已成功完成。' : 'The operation completed successfully.'}
      />
      <Alert
        type="warning"
        title={isZh ? '警告提示' : 'Warning'}
        description={
          isZh
            ? '请注意当前操作可能产生的影响。'
            : 'Note the potential impact of the current operation.'
        }
      />
      <Alert
        type="error"
        title={isZh ? '错误提示' : 'Error'}
        description={isZh ? '操作失败，请稍后重试。' : 'Operation failed, please retry later.'}
      />
    </div>
  );
}
