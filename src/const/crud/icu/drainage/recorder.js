/* eslint-disable no-dupe-keys */
var DIC = {
  usingState: [{
    label: '正常',
    value: 0
  }, {
    label: '异常',
    value: 1
  }]
}
export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  indexWidth: 60,
  stripe: true,
  addBtn: false,
  menuWidth: 150,
  menuXsWidth: 150,
  menuAlign: 'center',
  align: 'center',
  refreshBtn: false,
  showClomnuBtn: false,
  searchSize: 'mini',
  labelWidth: 100,
  menuWidth: 180,
  column: [{
    width: 80,
    label: '患者',
    prop: 'patientName',
    editDisabled: true
  }, {
    width: 100,
    label: '管道设备',
    prop: 'pipingName',
    editDisabled: true
  }, {
    label: '引流液',
    prop: 'drainageName',
    editDisabled: true
  },
  {
    label: '引流液属性',
    prop: 'drainageAttributeId',
    editDisabled: true
  }, {
    width: 80,
    label: '引流液值',
    prop: 'value'
  }, {
    width: 80,
    label: '是否正常',
    prop: 'normal',
    type: 'radio',
    dicData: DIC.usingState

  }, {
    width: 200,
    label: '措施',
    prop: 'measures'
  }, {
    width: 120,
    label: '记录时间',
    prop: 'createTime',
    type: 'datetime',
    addDisplay: true,
    editDisabled: true,
    format: 'MM-dd HH:mm',
    valueFormat: 'MM-dd HH:mm'
  }, {
    label: '护士',
    prop: 'nurseName',
    editDisplay: false
  }]
}
