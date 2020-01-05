var DIC = {
  usingState: [{
    label: '已告知',
    value: '1'
  }, {
    label: '未告知',
    value: '0'
  }]
}
//  所有的数据拿到接口后都要重新替换
export const tableOption = {

  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  addBtn: false,
  viewBtn: true,
  menuAlign: 'center',
  align: 'center',
  labelWidth: 120,

  column: [
    {
      label: '患者姓名',
      prop: 'patientName',
      type: 'select',
      editDisabled: true
    },
    {
      label: '约束原因',
      prop: 'constraintCause'
    },
    {
      label: '约束带数量',
      editDisabled: true,
      prop: 'constraintNumber',
      width: 120
    },
    {
      label: '约束部位描述',
      prop: 'constraintPartDescribe',
      width: 120
    },
    {
      label: '是否告知',
      prop: 'ifKnowInform',
      type: 'radio',
      dicData: DIC.usingState

    },
    {
      label: '约束时间',
      prop: 'constraintTime',
      type: "datetime",
      format: 'MM-dd HH:mm',
      valueFormat: 'yyyy-MM-dd HH:mm:ss'
    },


    {
      label: '患者反映',
      prop: 'patientResponse',
      hide: true
    },
    {
      label: '患者并发症',
      prop: 'patientComplication',
      hide: true
    },

    {
      label: '并发症处理',
      prop: 'complicationManage',
      hide: true
    },
    {
      label: '执行护士',
      prop: 'executeNurse',
      editDisabled: true
    }
  ]
}
