var DIC = {
  usingState: [{
    label: '女',
    value: '0'
  }, {
    label: '男',
    value: '1'
  }]
}

// 等待出科
export const waiting = {
  border: true,
  index: true,
  addBtn: false,
  editBtn: false,
  delBtn: false,
  highlightCurrentRow: true,
  menuWidth: 120,
  indexLabel: '序号',
  menuAlign: 'center',
  align: 'center',
  column: [
    {
      label: '患者姓名',
      prop: 'name'
    }, {
      width: 140,
      label: '床位',
      prop: 'bedName'
    }, {
      width: 125,
      label: '住院号',
      prop: 'hospitalnumber'
    }, {
      width: 70,
      label: '性别',
      prop: 'gender',
      dicData: DIC.usingState
    }, {
      width: 70,
      label: '年龄',
      prop: 'age'
    }, {
      label: '患者状态',
      prop: 'entryState'
    }, {
      width: 120,
      label: '入院时间',
      prop: 'timeOfAdmission',
      type: 'datetime',
      addDisplay: false,
      editDisplay: false,
      format: 'MM-dd HH:mm',
      valueFormat: 'MM-dd HH:mm'
    }, {
      width: 120,
      label: '入科时间',
      prop: 'entranceTime',
      type: 'datetime',
      addDisplay: false,
      editDisplay: false,
      format: 'MM-dd HH:mm',
      valueFormat: 'MM-dd HH:mm'
    }, {
      label: '过敏史',
      prop: 'allergichistory'
    }, {
      width: 140,
      label: '病情描述',
      prop: 'diagnosis'
    }, {
      width: 140,
      label: '入住icu时间统计',
      prop: 'timer'
    }]
}

// 已经出科
export const already = {
  border: true,
  index: true,
  addBtn: false,
  editBtn: false,
  delBtn: false,
  highlightCurrentRow: true,
  menuWidth: 120,
  menu: false,
  indexLabel: '序号',
  menuAlign: 'center',
  align: 'center',
  column: [
    {
      label: '患者姓名',
      prop: 'name'
    }, {
      width: 125,
      label: '住院号',
      prop: 'hospitalnumber'
    }, {
      width: 70,
      label: '性别',
      prop: 'gender',
      dicData: DIC.usingState
    }, {
      width: 70,
      label: '年龄',
      prop: 'age'
    }, {
      label: '患者状态',
      prop: 'entryState'
    }, {
      width: 120,
      label: '入院时间',
      prop: 'timeOfAdmission',
      type: 'datetime',
      addDisplay: false,
      editDisplay: false,
      format: 'MM-dd HH:mm',
      valueFormat: 'MM-dd HH:mm'
    }, {
      width: 120,
      label: '入科时间',
      prop: 'entranceTime',
      type: 'datetime',
      addDisplay: false,
      editDisplay: false,
      format: 'MM-dd HH:mm',
      valueFormat: 'MM-dd HH:mm'
    }, {
      label: '过敏史',
      prop: 'allergichistory'
    }, {
      width: 140,
      label: '病情描述',
      prop: 'diagnosis'
    }]
}
