

//  所有的数据拿到接口后都要重新替换
export const tableOption = {

  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  viewBtn: true,
  addBtn: false,
  editBtn: false,
  delBtn: false,
  menuAlign: 'center',
  align: 'center',
  // labelWidth:120,
  column: [
    {
      label: '患者姓名',
      prop: 'patientName',
      width: 120
    },
    {
      label: '床位',
      prop: 'bedCode',
      width: 80
    },
    {
      label: '项目',
      prop: 'projectName',
      search: true,
      width: 100
    },

    {
      label: '项目数据',
      prop: 'intakeOutputValue'
    },
    {
      label: '24小时内平均值',
      prop: 'equilibriumAmount'
    },


    {
      label: '创建人',
      prop: 'createName',
      hide: true
    },
    {
      label: '创建时间',
      prop: 'createTime',
      type: 'datetime',
      // editDisplay:false,
      format: 'yyyy-MM-dd HH:mm',
      valueFormat: 'yyyy-MM-dd HH:mm:ss'
    },
    {
      label: '出入量描述',
      prop: 'valueDescription',
      hide: true
    }
  ]
}
