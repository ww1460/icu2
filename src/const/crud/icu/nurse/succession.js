var DIC = {
  usingState: [{
    label: '女',
    value: 0
  }, {
    label: '男',
    value: 1
  }],
  useFlag: [{
    label: '未使用',
    value: 0
  }, {
    label: '使用中',
    value: 1
  }, {
    label: '维修中',
    value: 2
  }]
}

// 交班任务报表
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
  column: [{
    label: '患者姓名',
    prop: 'name'
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
    label: '住院号',
    prop: 'hospitalnumber'

  }, {
    label: '入院时间',
    prop: 'timeOfAdmission',
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


// 接班任务报表
export const already = {
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
  column: [{
    label: '患者姓名',
    prop: 'name'
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
    label: '住院号',
    prop: 'hospitalnumber'
  }, {
    label: '入院时间',
    prop: 'timeOfAdmission',
    type: 'datetime',
    addDisplay: false,
    editDisplay: false,
    format: 'MM-dd HH:mm',
    valueFormat: 'MM-dd HH:mm'
  }, {
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



// 床位
export const bads = {
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
  column: [{
    label: '病床编号',
    prop: 'bedCode'
  }, {
    label: '病床名称',
    prop: 'bedName'
  }, {
    label: '状态',
    prop: 'useFlag',
    dicData: DIC.useFlag
  }]
}


