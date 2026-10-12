import { useRef, useState } from 'react';
import {
  Button,
  Input,
  Modal,
  Switch,
  Checkbox,
  Tag,
  Alert,
  RadioGroup,
  Radio,
  Progress,
  Badge,
  Avatar,
  Empty,
  Select,
  Tabs,
  Tooltip,
  DatePicker,
  Pagination,
  Table,
  Spin,
  Breadcrumb,
  Skeleton,
  InputNumber,
  Popconfirm,
  message,
} from '@xui-design/react';
import type { ModalRef } from '@xui-design/react';
import type { BreadcrumbItem, TableColumn } from '@xui-design/core';
import '@xui-design/styles';

export default function App() {
  const [name, setName] = useState('');
  const [visible, setVisible] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [switchValue, setSwitchValue] = useState(false);
  const [checkboxValue, setCheckboxValue] = useState(true);
  const [radioValue, setRadioValue] = useState('a');
  const [radioCity, setRadioCity] = useState('beijing');
  const [progressValue, setProgressValue] = useState(60);
  const [tabsValue, setTabsValue] = useState('a');
  const [dateValue, setDateValue] = useState('');
  const [pageValue, setPageValue] = useState(2);
  const [spinValue, setSpinValue] = useState(true);
  const [skeletonLoading, setSkeletonLoading] = useState(true);
  const [numberValue, setNumberValue] = useState<number | null>(2);
  const modalRef = useRef<ModalRef>(null);

  const radioCityOptions = [
    { label: 'Beijing', value: 'beijing' },
    { label: 'Shanghai', value: 'shanghai' },
    { label: 'Disabled', value: 'gz', disabled: true },
  ];

  const selectOptions = [
    { label: 'Beijing', value: 'beijing' },
    { label: 'Shanghai', value: 'shanghai', disabled: true },
    { label: 'Guangzhou', value: 'guangzhou' },
    { label: 'Shenzhen', value: 'shenzhen' },
  ];

  // 虚拟滚动演示：1000 项选项
  const bigSelectOptions = Array.from({ length: 1000 }, (_, i) => ({
    label: `Option ${i + 1}`,
    value: `opt-${i + 1}`,
  }));

  const tabsItems = [
    { label: 'Tab One', value: 'a' },
    { label: 'Tab Disabled', value: 'b', disabled: true },
    { label: 'Tab Two', value: 'c' },
  ];

  const tableColumns: TableColumn[] = [
    { key: 'name', title: '姓名' },
    { key: 'age', title: '年龄', sortable: true, width: 100, align: 'center' },
    { key: 'city', title: '城市' },
    {
      key: 'action',
      title: '操作',
      render: (record) => `查看 ${String(record.name)}`,
    },
  ];

  const tableRows = [
    { id: 1, name: '张三', age: 30, city: 'Beijing' },
    { id: 2, name: '李四', age: 25, city: 'Shanghai' },
    { id: 3, name: '王五', age: 28, city: 'Guangzhou' },
    { id: 4, name: '赵六', age: 32, city: 'Shenzhen' },
  ];

  // 虚拟滚动演示：1000 行数据
  const bigTableRows = Array.from({ length: 1000 }, (_, i) => ({
    id: i + 1,
    name: `用户${i + 1}`,
    age: 20 + (i % 40),
    city: `城市${(i % 20) + 1}`,
  }));

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: '首页', href: '#home' },
    { label: '组件', href: '#components' },
    { label: '当前页' },
  ];

  const pushLog = (msg: string) => {
    setLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 30));
  };

  return (
    <div className="playground">
      <h1>XUI - React Playground</h1>
      <p className="subtitle">跨框架组件库 · React 19 适配层集成验证</p>

      <section>
        <h2>Button</h2>
        <div className="row">
          <Button>default</Button>
          <Button type="primary">primary</Button>
          <Button type="danger">danger</Button>
          <Button type="link">link</Button>
        </div>
        <div className="row">
          <Button size="sm">small</Button>
          <Button size="md">medium</Button>
          <Button size="lg">large</Button>
        </div>
        <div className="row">
          <Button disabled>disabled</Button>
          <Button loading>loading</Button>
          <Button block>block (full width)</Button>
        </div>
        <div className="row">
          <Button type="primary" onClick={() => pushLog('button clicked')}>
            click me
          </Button>
          <Button onClick={() => setVisible(true)}>open modal</Button>
        </div>
      </section>

      <section>
        <h2>Input</h2>
        <div className="row">
          <Input
            value={name}
            placeholder="type something..."
            clearable
            onInput={(v) => {
              setName(v);
              pushLog(`input: ${v}`);
            }}
            onChange={(v) => pushLog(`change: ${v}`)}
            onClear={() => pushLog('cleared')}
          />
        </div>
        <div className="row">
          <Input value="disabled" disabled />
          <Input value="readonly" readonly />
          <Input placeholder="with prefix" renderPrefix={() => <span>🔍</span>} />
        </div>
      </section>

      <section>
        <h2>Switch</h2>
        <div className="row">
          <Switch
            value={switchValue}
            onChange={(v) => {
              setSwitchValue(v);
              pushLog(`switch: ${v}`);
            }}
          />
          <Switch defaultValue size="sm" />
          <Switch defaultValue />
          <Switch disabled />
          <Switch loading />
        </div>
        <p className="hint">controlled value = {String(switchValue)}</p>
      </section>

      <section>
        <h2>Checkbox</h2>
        <div className="row">
          <Checkbox
            value={checkboxValue}
            onChange={(v) => {
              setCheckboxValue(v);
              pushLog(`checkbox: ${v}`);
            }}
          >
            agree terms
          </Checkbox>
          <Checkbox indeterminate>indeterminate</Checkbox>
          <Checkbox disabled>disabled</Checkbox>
        </div>
        <p className="hint">controlled value = {String(checkboxValue)}</p>
      </section>

      <section>
        <h2>Tag</h2>
        <div className="row">
          <Tag>default</Tag>
          <Tag type="primary">primary</Tag>
          <Tag type="success">success</Tag>
          <Tag type="warning">warning</Tag>
          <Tag type="danger">danger</Tag>
          <Tag size="sm">small</Tag>
          <Tag closable onClose={() => pushLog('tag closed')}>
            closable
          </Tag>
        </div>
      </section>

      <section>
        <h2>Alert</h2>
        <div className="column">
          <Alert
            title="Info"
            description="This is an info alert."
            showIcon
            closable
            onClose={() => pushLog('alert closed')}
          />
          <Alert type="success" title="Success" description="Operation completed." showIcon />
          <Alert type="warning" title="Warning" description="Please check your input." showIcon />
          <Alert type="error" title="Error" description="Something went wrong." showIcon />
        </div>
      </section>

      <section>
        <h2>Modal</h2>
        <div className="row">
          <Button type="primary" onClick={() => setVisible(true)}>
            show modal
          </Button>
          <Button onClick={() => modalRef.current?.open()}>open via ref</Button>
        </div>
      </section>

      <Modal
        ref={modalRef}
        visible={visible}
        title="Hello XUI"
        width={480}
        closable
        maskClosable
        closeOnEsc
        // 受控同步：命令式 open() 触发 onOpen 后将受控值对齐，
        // 使 confirm/cancel/close 等关闭路径统一走受控 state（对齐 Vue v-model 回写行为）
        onOpen={() => {
          setVisible(true);
          pushLog('modal open');
        }}
        onClose={() => {
          setVisible(false);
          pushLog('modal close');
        }}
        onOk={() => pushLog('modal ok')}
        onCancel={() => pushLog('modal cancel')}
        renderFooter={() => (
          <>
            <Button
              onClick={() => {
                pushLog('modal cancel');
                setVisible(false);
              }}
            >
              cancel
            </Button>
            <Button
              type="primary"
              onClick={() => {
                pushLog('modal ok');
                setVisible(false);
              }}
            >
              confirm
            </Button>
          </>
        )}
      >
        <p>
          Modal content here. Value from input: <strong>{name || '(empty)'}</strong>
        </p>
      </Modal>

      <section>
        <h2>RadioGroup / Radio</h2>
        <div className="row">
          <RadioGroup
            value={radioValue}
            onChange={(v) => {
              setRadioValue(v);
              pushLog(`radio: ${v}`);
            }}
          >
            <Radio value="a">A</Radio>
            <Radio value="b">B</Radio>
            <Radio value="c" disabled>
              C (disabled)
            </Radio>
          </RadioGroup>
          <span className="hint">controlled value = {radioValue}</span>
        </div>
        <div className="row">
          <RadioGroup
            value={radioCity}
            options={radioCityOptions}
            onChange={(v) => {
              setRadioCity(v);
              pushLog(`radio city: ${v}`);
            }}
          />
          <span className="hint">options 渲染 = {radioCity}</span>
        </div>
        <div className="row">
          <RadioGroup disabled defaultValue="b">
            <Radio value="a">A</Radio>
            <Radio value="b">B</Radio>
          </RadioGroup>
          <span className="hint">整组禁用</span>
        </div>
      </section>

      <section>
        <h2>Progress</h2>
        <Progress percent={progressValue} />
        <Progress percent={100} />
        <Progress percent={72} status="error" />
        <Progress percent={45} strokeWidth={10} showText={false} />
        <div className="row">
          <Progress type="circle" percent={progressValue} />
          <Progress type="circle" percent={100} status="success" />
        </div>
        <div className="row">
          <Button size="sm" onClick={() => setProgressValue(Math.max(0, progressValue - 10))}>
            -10
          </Button>
          <Button size="sm" onClick={() => setProgressValue(Math.min(100, progressValue + 10))}>
            +10
          </Button>
          <span className="hint">percent = {progressValue}</span>
        </div>
      </section>

      <section>
        <h2>Badge / Avatar</h2>
        <div className="row">
          <Badge count={5}>
            <Button>inbox</Button>
          </Badge>
          <Badge count={120}>
            <Button>overflow 99+</Button>
          </Badge>
          <Badge dot>
            <Button>dot</Button>
          </Badge>
          <Badge count={0} showZero>
            <Button>showZero</Button>
          </Badge>
          <Badge count={9} />
          <span className="hint">独立模式 count=9 ↑</span>
        </div>
        <div className="row">
          <Avatar
            src="https://i.pravatar.cc/80?img=5"
            alt="user"
            onError={() => pushLog('avatar load error')}
          />
          <Avatar size="sm">S</Avatar>
          <Avatar size="lg">L</Avatar>
          <Avatar shape="square">SQ</Avatar>
        </div>
      </section>

      <section>
        <h2>Empty</h2>
        <Empty description="No data yet">
          <Button size="sm" type="primary" onClick={() => pushLog('empty action clicked')}>
            Create now
          </Button>
        </Empty>
      </section>

      <section>
        <h2>Select</h2>
        <div className="row">
          <Select
            options={selectOptions}
            placeholder="Select a city"
            clearable
            onChange={(v) => pushLog(`select: ${v}`)}
            onClear={() => pushLog('select cleared')}
          />
          <Select options={selectOptions} disabled placeholder="Disabled" />
        </div>
        <div className="row">
          <Select
            options={selectOptions}
            multiple
            defaultValue={['beijing']}
            placeholder="Multiple"
            onChange={(v) => pushLog(`select multi: ${JSON.stringify(v)}`)}
          />
          <Select
            options={selectOptions}
            searchable
            placeholder="Searchable"
            onChange={(v) => pushLog(`select search: ${v}`)}
          />
          <Select
            options={bigSelectOptions}
            virtual
            maxHeight={200}
            placeholder="Virtual 1000 items"
            onChange={(v) => pushLog(`select virtual: ${v}`)}
          />
        </div>
      </section>

      <section>
        <h2>Tabs</h2>
        <Tabs
          value={tabsValue}
          items={tabsItems}
          onChange={(v) => {
            setTabsValue(v);
            pushLog(`tabs: ${v}`);
          }}
          renderPanel={(item) => `Content of ${item.label}`}
        />
      </section>

      <section>
        <h2>Message</h2>
        <div className="row">
          <Button onClick={() => message.info('This is an info message')}>Info</Button>
          <Button type="primary" onClick={() => message.success('Saved successfully')}>
            Success
          </Button>
          <Button onClick={() => message.warning('Disk space is low')}>Warning</Button>
          <Button onClick={() => message.error('Failed to save')}>Error</Button>
          <Button
            onClick={() =>
              message.open({ content: 'Closable message', closable: true, duration: 0 })
            }
          >
            Closable
          </Button>
          <Button onClick={() => message.closeAll()}>Close all</Button>
        </div>
      </section>

      <section>
        <h2>Tooltip</h2>
        <div className="row">
          <Tooltip content="顶部提示（默认）">
            <Button>top</Button>
          </Tooltip>
          <Tooltip content="底部提示" placement="bottom">
            <Button>bottom</Button>
          </Tooltip>
          <Tooltip content="左侧提示" placement="left">
            <Button>left</Button>
          </Tooltip>
          <Tooltip content="右侧提示" placement="right">
            <Button>right</Button>
          </Tooltip>
          <Tooltip content="聚焦触发" trigger="focus">
            <Input placeholder="focus 触发" />
          </Tooltip>
          <Tooltip content="禁用状态" disabled>
            <Button>disabled</Button>
          </Tooltip>
        </div>
      </section>

      <section>
        <h2>DatePicker</h2>
        <div className="row">
          <DatePicker
            value={dateValue}
            placeholder="选择日期"
            clearable
            onChange={(v) => {
              setDateValue(v);
              pushLog(`date: ${v}`);
            }}
            onClear={() => {
              setDateValue('');
              pushLog('date cleared');
            }}
          />
          <DatePicker disabled placeholder="Disabled" />
        </div>
        <p className="hint">controlled value = {dateValue || '(未选择)'}</p>
      </section>

      <section>
        <h2>Pagination</h2>
        <Pagination
          value={pageValue}
          total={285}
          onChange={(p) => {
            setPageValue(p);
            pushLog(`page: ${p}`);
          }}
        />
        <div className="row">
          <Pagination total={50} disabled />
          <span className="hint">controlled value = {pageValue}</span>
        </div>
      </section>

      <section>
        <h2>Table</h2>
        <Table
          columns={tableColumns}
          dataSource={tableRows}
          rowKey="id"
          stripe
          border
          rowSelection={{
            onChange: (keys) => pushLog(`select rows: ${JSON.stringify(keys)}`),
          }}
          onRowClick={(row, index) => pushLog(`row click: ${String(row.name)} #${index}`)}
          onSortChange={(s) => pushLog(`sort: ${s.key} ${s.order ?? 'none'}`)}
        />
        <div style={{ marginTop: 12 }}>
          <Table
            columns={tableColumns}
            dataSource={[]}
            renderEmpty={() => <span>自定义空态：没有更多数据啦</span>}
          />
        </div>
        <div style={{ marginTop: 12 }}>
          <Table
            columns={tableColumns}
            dataSource={bigTableRows}
            rowKey="id"
            virtual
            height={320}
            rowHeight={40}
            stripe
          />
        </div>
      </section>

      <section>
        <h2>Spin</h2>
        <div className="row">
          <Spin size="sm" />
          <Spin />
          <Spin size="lg" />
          <Spin tip="加载中..." />
          <span className="hint">独立模式（三档尺寸 + tip）</span>
        </div>
        <div className="row">
          <Spin spinning={spinValue} tip="数据加载中">
            <div style={{ padding: 16, border: '1px dashed #d1d5db' }}>
              这里是被包裹的内容，加载时模糊化
            </div>
          </Spin>
          <Button onClick={() => setSpinValue((v) => !v)}>
            {spinValue ? '停止加载' : '开始加载'}
          </Button>
        </div>
      </section>

      <section>
        <h2>Breadcrumb</h2>
        <Breadcrumb
          items={breadcrumbItems}
          separator=">"
          onItemClick={(item, index) => pushLog(`breadcrumb: ${item.label} (index=${index})`)}
        />
      </section>

      <section>
        <h2>Skeleton</h2>
        <div className="row">
          <Button onClick={() => setSkeletonLoading((v) => !v)}>
            {skeletonLoading ? '显示内容' : '显示骨架'}
          </Button>
          <span className="hint">loading = {String(skeletonLoading)}</span>
        </div>
        <Skeleton loading={skeletonLoading} avatar rows={3}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Avatar size="lg">X</Avatar>
            <span>骨架屏内容加载完成，头像 + 文本正常渲染</span>
          </div>
        </Skeleton>
      </section>

      <section>
        <h2>InputNumber</h2>
        <div className="row">
          <InputNumber
            value={numberValue}
            min={0}
            max={10}
            step={0.5}
            precision={2}
            placeholder="0.00 ~ 10.00"
            onChange={(v) => {
              setNumberValue(v);
              pushLog(`input-number: ${v}`);
            }}
          />
          <span className="hint">controlled value = {numberValue ?? 'null'}</span>
        </div>
        <div className="row">
          <InputNumber defaultValue={5} disabled />
          <InputNumber defaultValue={3} min={1} max={5} />
          <span className="hint">disabled / 非受控（边界 clamp）</span>
        </div>
      </section>

      <section>
        <h2>Popconfirm</h2>
        <div className="row">
          <Popconfirm
            content="确定删除这条记录吗？"
            onConfirm={() => pushLog('popconfirm: 已删除')}
            onCancel={() => pushLog('popconfirm: 已取消')}
          >
            <Button type="danger">删除</Button>
          </Popconfirm>
          <Popconfirm
            content="右侧方位弹出，自定义按钮文本"
            placement="right"
            confirmText="好的"
            cancelText="再想想"
            onConfirm={() => pushLog('popconfirm: 确认执行')}
          >
            <Button>右侧 + 自定义文本</Button>
          </Popconfirm>
          <Popconfirm content="禁用状态不可触发" disabled>
            <Button disabled>disabled</Button>
          </Popconfirm>
        </div>
      </section>

      <section>
        <h2>Event log</h2>
        <pre className="log">{log.join('\n') || '(no events yet)'}</pre>
      </section>
    </div>
  );
}
