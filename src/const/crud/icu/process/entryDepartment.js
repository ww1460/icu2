var DIC = {
  usingState: [{
    label: '女',
    value: '0'
  }, {
    label: '男',
    value: '1'
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

// 等待入科
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
      width: 125,
      label: '住院号',
      prop: 'hospitalnumber'

    }, {
      width: 70,
      label: '性别',
      prop: 'gender',
      dicData: DIC.usingState
    }, {
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
      width: 200,
      label: '过敏史',
      prop: 'allergichi'
    }, {
      label: '病情描述',
      prop: 'diagnosis'
    }]
}


// 已经入科
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
  column: [
    {
      label: '患者姓名',
      prop: 'name'
    }, {
      width: 100,
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
      label: '年龄',
      prop: 'age'
    }, {
      label: '患者状态',
      prop: 'entryState'
    },
    //  {
    //   label: '责任护士',
    //   prop: 'nurseName'
    // },
    {
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
      width: 200,
      label: '过敏史',
      prop: 'allergichistory'
    }, {
      label: '病情描述',
      prop: 'diagnosis'
    }]
}



// 床位
export const bads = {
  border: true,
  addBtn: false,
  editBtn: false,
  delBtn: false,
  highlightCurrentRow: true,
  menuWidth: 120,
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
