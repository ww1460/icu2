
export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  labelWidth: 120,
  menuWidth: 150,
  menuXsWidth: 150,
  stripe: true,
  addBtn: false,
  editBtn: false,
  viewBtn: true,
  menuAlign: 'center',
  align: 'center',
  column: [{
    width: 150,
    label: '患者名称',
    prop: 'patientName',
    editDisabled: true
  },
  {
    label: '设备名称',
    prop: 'deviceName',
    editDisabled: true,
    addDisplay: false
  },
  {
    width: 200,
    label: '开始时间',
    prop: 'startTime',
    type: 'datetime',
    format: 'yyyy-MM-dd HH:mm:ss',
    valueFormat: 'yyyy-MM-dd HH:mm:ss'
  },
  {
    width: 200,
    label: '结束时间',
    prop: 'endTime',
    type: 'datetime',
    format: 'yyyy-MM-dd HH:mm:ss',
    valueFormat: 'yyyy-MM-dd HH:mm:ss'
  },
  {
    width: 150,
    label: '使用时长/分钟',
    prop: 'totalLengthOfTime',
    addDisplay: false,
    editDisplay: false,
    rules: [
      {
        pattern: /^[0-9]*$/,
        message: '请输入数字',
        trigger: 'blur'
      }]
  },
  ]
}
