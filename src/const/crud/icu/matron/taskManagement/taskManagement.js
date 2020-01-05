

//  所有的数据拿到接口后都要重新替换
export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  addBtn: false,
  menuAlign: 'center',
  align: 'center',
  viewBtn: true,
  delBtn: true,
  labelWidth: 120,
  column: [
    {
      label: '患者姓名',
      prop: 'patientName'
    },
    {
      label: '任务名称',
      prop: 'taskName',
      rules: [{
        required: true,
        message: '请输入任务名称',
        trigger: 'blur'
      }]
    },
    {
      label: '间隔小时',
      prop: 'intervalTimes',
      rules: [{
        required: true,
        message: '请输入任务结果',
        trigger: 'blur'
      }]
    },

    {
      label: '创建人',
      prop: 'nurseName',
      addDisplay: false,
      editDisplay: false
    },
    {
      label: '预开始时间',
      prop: 'preStartTime',
      type: 'datetime',
      format: 'MM-dd HH:mm',
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
      rules: [{
        required: true,
        message: '请选择创建时间',
        trigger: 'blur'
      }]
    },
    {
      label: '预结束时间',
      prop: 'preEndTime',
      type: 'datetime',
      format: 'MM-dd HH:mm',
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
      rules: [{
        required: true,
        message: '请选择创建时间',
        trigger: 'blur'
      }]
    }
  ]
}
