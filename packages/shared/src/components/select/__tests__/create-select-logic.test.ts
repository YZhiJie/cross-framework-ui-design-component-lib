import { describe, expect, it, vi } from 'vitest';
import { createSelectLogic } from '../create-select-logic';
import type { SelectOption } from '../create-select-logic';

const OPTIONS: SelectOption[] = [
  { label: '北京', value: 'beijing' },
  { label: '上海', value: 'shanghai', disabled: true },
  { label: '广州', value: 'guangzhou' },
  { label: '深圳', value: 'shenzhen' },
];

describe('createSelectLogic', () => {
  it('初始状态正确：未选中、面板收起、无高亮', () => {
    const logic = createSelectLogic({ options: OPTIONS });
    expect(logic.getState()).toEqual({
      value: null,
      open: false,
      activeIndex: -1,
      disabled: false,
      searchQuery: '',
      filteredOptions: OPTIONS,
    });
  });

  it('defaultValue 提供非受控初始值', () => {
    const logic = createSelectLogic({ options: OPTIONS, defaultValue: 'beijing' });
    expect(logic.getState().value).toBe('beijing');
  });

  it('toggleOpen 展开 / 收起循环', () => {
    const logic = createSelectLogic({ options: OPTIONS });
    logic.toggleOpen();
    expect(logic.getState().open).toBe(true);
    logic.toggleOpen();
    expect(logic.getState().open).toBe(false);
    expect(logic.getState().activeIndex).toBe(-1);
  });

  it('disabled 时 toggleOpen 忽略', () => {
    const logic = createSelectLogic({ options: OPTIONS, disabled: true });
    logic.toggleOpen();
    expect(logic.getState().open).toBe(false);
  });

  it('展开时高亮当前选中项', () => {
    const logic = createSelectLogic({ options: OPTIONS, defaultValue: 'guangzhou' });
    logic.toggleOpen();
    expect(logic.getState().activeIndex).toBe(2);
  });

  it('展开时未选中则高亮第一个可用项（跳过首项禁用）', () => {
    const logic = createSelectLogic({
      options: [{ label: 'A', value: 'a', disabled: true }, ...OPTIONS],
    });
    logic.toggleOpen();
    // index 0 禁用，第一个可用项是 beijing（index 1）
    expect(logic.getState().activeIndex).toBe(1);
  });

  it('select 非受控：更新值、收起面板、触发 onChange', () => {
    const onChange = vi.fn();
    const listener = vi.fn();
    const logic = createSelectLogic({ options: OPTIONS, onChange });
    logic.subscribe(listener);
    logic.select('guangzhou');
    expect(logic.getState().value).toBe('guangzhou');
    expect(logic.getState().open).toBe(false);
    expect(onChange).toHaveBeenCalledWith('guangzhou');
    expect(listener).toHaveBeenCalled();
  });

  it('select 相同值：仅收起面板，不触发 onChange', () => {
    const onChange = vi.fn();
    const logic = createSelectLogic({ options: OPTIONS, defaultValue: 'beijing', onChange });
    logic.toggleOpen();
    logic.select('beijing');
    expect(logic.getState().value).toBe('beijing');
    expect(logic.getState().open).toBe(false);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('select 禁用项忽略（面板保持展开）', () => {
    const onChange = vi.fn();
    const logic = createSelectLogic({ options: OPTIONS, onChange });
    logic.toggleOpen();
    logic.select('shanghai');
    expect(logic.getState().value).toBeNull();
    expect(logic.getState().open).toBe(true);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('select 不存在的值忽略', () => {
    const onChange = vi.fn();
    const logic = createSelectLogic({ options: OPTIONS, onChange });
    logic.select('hangzhou');
    expect(logic.getState().value).toBeNull();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('受控模式：select 仅回调，不改内部值；外部 updateOptions 同步', () => {
    const onChange = vi.fn();
    const logic = createSelectLogic({ options: OPTIONS, value: 'beijing', onChange });
    logic.select('guangzhou');
    expect(logic.getState().value).toBe('beijing');
    expect(onChange).toHaveBeenCalledWith('guangzhou');

    logic.updateOptions({ value: 'guangzhou' });
    expect(logic.getState().value).toBe('guangzhou');
  });

  it('clear：非受控置 null 并触发 onClear', () => {
    const onClear = vi.fn();
    const logic = createSelectLogic({
      options: OPTIONS,
      defaultValue: 'beijing',
      clearable: true,
      onClear,
    });
    logic.clear();
    expect(logic.getState().value).toBeNull();
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('clear：未开 clearable 或无选中值时忽略', () => {
    const onClear = vi.fn();
    const noClearable = createSelectLogic({ options: OPTIONS, defaultValue: 'beijing', onClear });
    noClearable.clear();
    expect(noClearable.getState().value).toBe('beijing');
    expect(onClear).not.toHaveBeenCalled();

    const noValue = createSelectLogic({ options: OPTIONS, clearable: true, onClear });
    noValue.clear();
    expect(onClear).not.toHaveBeenCalled();
  });

  it('clear：受控模式不置 null，仅触发 onClear', () => {
    const onClear = vi.fn();
    const logic = createSelectLogic({
      options: OPTIONS,
      value: 'beijing',
      clearable: true,
      onClear,
    });
    logic.clear();
    expect(logic.getState().value).toBe('beijing');
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('moveHighlight：向下跳过禁用项', () => {
    const logic = createSelectLogic({ options: OPTIONS });
    logic.toggleOpen();
    expect(logic.getState().activeIndex).toBe(0);
    logic.moveHighlight(1);
    // shanghai（index 1）禁用，跳到 guangzhou（index 2）
    expect(logic.getState().activeIndex).toBe(2);
  });

  it('moveHighlight：循环（从尾向下回首项，从首向上回尾项）', () => {
    const logic = createSelectLogic({ options: OPTIONS });
    logic.toggleOpen();
    logic.moveHighlight(-1);
    // 从 beijing（index 0）向上，循环到深圳（index 3）
    expect(logic.getState().activeIndex).toBe(3);
    logic.moveHighlight(1);
    // 从深圳向下，循环回首项
    expect(logic.getState().activeIndex).toBe(0);
  });

  it('moveHighlight：面板收起时忽略', () => {
    const logic = createSelectLogic({ options: OPTIONS });
    logic.moveHighlight(1);
    expect(logic.getState().activeIndex).toBe(-1);
  });

  it('moveHighlight：全部禁用时不动', () => {
    const logic = createSelectLogic({
      options: OPTIONS.map((option) => ({ ...option, disabled: true })),
    });
    logic.toggleOpen();
    expect(logic.getState().activeIndex).toBe(-1);
    logic.moveHighlight(1);
    expect(logic.getState().activeIndex).toBe(-1);
  });

  it('confirmHighlight：确认高亮项并收起面板', () => {
    const onChange = vi.fn();
    const logic = createSelectLogic({ options: OPTIONS, onChange });
    logic.toggleOpen();
    logic.moveHighlight(1); // 跳过禁用项到 guangzhou
    logic.confirmHighlight();
    expect(logic.getState().value).toBe('guangzhou');
    expect(logic.getState().open).toBe(false);
    expect(onChange).toHaveBeenCalledWith('guangzhou');
  });

  it('confirmHighlight：无高亮时忽略', () => {
    const onChange = vi.fn();
    const logic = createSelectLogic({ options: OPTIONS, onChange });
    logic.confirmHighlight();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('updateOptions：disabled 置真时收起面板', () => {
    const logic = createSelectLogic({ options: OPTIONS });
    logic.toggleOpen();
    logic.updateOptions({ disabled: true });
    expect(logic.getState()).toMatchObject({ disabled: true, open: false, activeIndex: -1 });
  });

  it('updateOptions：替换 options 后按新列表校验与移动高亮', () => {
    const logic = createSelectLogic({ options: OPTIONS });
    logic.toggleOpen();
    logic.updateOptions({ options: [{ label: '杭州', value: 'hangzhou' }] });
    logic.confirmHighlight();
    expect(logic.getState().value).toBe('hangzhou');
  });
});

describe('createSelectLogic 多选模式', () => {
  it('初始 value 为空数组；defaultValue 数组生效', () => {
    const empty = createSelectLogic({ options: OPTIONS, multiple: true });
    expect(empty.getState().value).toEqual([]);

    const initial = createSelectLogic({
      options: OPTIONS,
      multiple: true,
      defaultValue: ['beijing', 'guangzhou'],
    });
    expect(initial.getState().value).toEqual(['beijing', 'guangzhou']);
  });

  it('select 切换语义：追加选中、再次点击取消，面板保持展开', () => {
    const onChange = vi.fn();
    const logic = createSelectLogic({ options: OPTIONS, multiple: true, onChange });
    logic.toggleOpen();
    logic.select('beijing');
    expect(logic.getState().value).toEqual(['beijing']);
    expect(logic.getState().open).toBe(true);
    expect(onChange).toHaveBeenLastCalledWith(['beijing']);

    logic.select('guangzhou');
    expect(logic.getState().value).toEqual(['beijing', 'guangzhou']);
    expect(onChange).toHaveBeenLastCalledWith(['beijing', 'guangzhou']);

    logic.select('beijing');
    expect(logic.getState().value).toEqual(['guangzhou']);
    expect(onChange).toHaveBeenLastCalledWith(['guangzhou']);
  });

  it('select 禁用项忽略；onChange 载荷为数组', () => {
    const onChange = vi.fn();
    const logic = createSelectLogic({ options: OPTIONS, multiple: true, onChange });
    logic.select('shanghai');
    expect(logic.getState().value).toEqual([]);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('受控多选：select 仅回调最新数组，不改内部值', () => {
    const onChange = vi.fn();
    const logic = createSelectLogic({
      options: OPTIONS,
      multiple: true,
      value: ['beijing'],
      onChange,
    });
    logic.select('guangzhou');
    expect(onChange).toHaveBeenCalledWith(['beijing', 'guangzhou']);
    expect(logic.getState().value).toEqual(['beijing']);

    logic.updateOptions({ value: ['beijing', 'guangzhou'] });
    expect(logic.getState().value).toEqual(['beijing', 'guangzhou']);
  });

  it('多选 clear：清空全部并触发 onClear；空数组时忽略', () => {
    const onClear = vi.fn();
    const logic = createSelectLogic({
      options: OPTIONS,
      multiple: true,
      defaultValue: ['beijing', 'guangzhou'],
      onClear,
    });
    logic.clear();
    expect(logic.getState().value).toEqual([]);
    expect(onClear).toHaveBeenCalledTimes(1);

    logic.clear();
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('confirmHighlight 多选：确认高亮项为切换语义', () => {
    const logic = createSelectLogic({ options: OPTIONS, multiple: true });
    logic.toggleOpen();
    logic.confirmHighlight();
    expect(logic.getState().value).toEqual(['beijing']);
  });
});

describe('createSelectLogic 可搜索模式', () => {
  it('setSearch 过滤选项并重置高亮到第一个可用项', () => {
    const logic = createSelectLogic({ options: OPTIONS, searchable: true });
    logic.toggleOpen();
    logic.setSearch('广');
    expect(logic.getState().filteredOptions.map((option) => option.value)).toEqual(['guangzhou']);
    expect(logic.getState().activeIndex).toBe(0);
    expect(logic.getState().searchQuery).toBe('广');
  });

  it('搜索大小写不敏感且按 label 匹配（value 不参与匹配）', () => {
    const logic = createSelectLogic({
      options: [
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana' },
      ],
      searchable: true,
    });
    logic.setSearch('APP');
    expect(logic.getState().filteredOptions).toHaveLength(1);
    logic.setSearch('apple');
    expect(logic.getState().filteredOptions.map((option) => option.value)).toEqual(['apple']);
  });

  it('无匹配时高亮 -1，select 不存在的过滤项仍按全量列表校验', () => {
    const onChange = vi.fn();
    const logic = createSelectLogic({ options: OPTIONS, searchable: true, onChange });
    logic.setSearch('不存在');
    expect(logic.getState().filteredOptions).toEqual([]);
    expect(logic.getState().activeIndex).toBe(-1);

    // 过滤后键盘确认不触发（无高亮）
    logic.confirmHighlight();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('confirmHighlight 确认过滤后列表的高亮项；单选确认后清空搜索并收起', () => {
    const logic = createSelectLogic({ options: OPTIONS, searchable: true });
    logic.toggleOpen();
    logic.setSearch('深');
    logic.confirmHighlight();
    expect(logic.getState().value).toBe('shenzhen');
    expect(logic.getState().open).toBe(false);
    expect(logic.getState().searchQuery).toBe('');
    expect(logic.getState().filteredOptions.map((option) => option.value)).toEqual(
      OPTIONS.map((option) => option.value),
    );
  });

  it('close 重置搜索词与过滤列表', () => {
    const logic = createSelectLogic({ options: OPTIONS, searchable: true });
    logic.toggleOpen();
    logic.setSearch('广');
    logic.close();
    expect(logic.getState().searchQuery).toBe('');
    expect(logic.getState().filteredOptions).toHaveLength(OPTIONS.length);
  });

  it('搜索词为空白串时不过滤', () => {
    const logic = createSelectLogic({ options: OPTIONS, searchable: true });
    logic.setSearch('   ');
    expect(logic.getState().filteredOptions).toHaveLength(OPTIONS.length);
  });

  it('非 searchable 模式 setSearch 不生效', () => {
    const logic = createSelectLogic({ options: OPTIONS });
    logic.setSearch('广');
    expect(logic.getState().searchQuery).toBe('');
    expect(logic.getState().filteredOptions).toHaveLength(OPTIONS.length);
  });

  it('updateOptions 替换 options 后过滤列表同步重算', () => {
    const logic = createSelectLogic({ options: OPTIONS, searchable: true });
    logic.setSearch('广');
    logic.updateOptions({ options: [{ label: '杭州', value: 'hangzhou' }] });
    expect(logic.getState().filteredOptions).toEqual([]);
  });
});
