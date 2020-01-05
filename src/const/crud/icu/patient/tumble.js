export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  addBtn: false,
  viewBtn: false,
  editBtn: false,
  delBtn: false,
  searchShow: false,
  menuAlign: 'center',
  menuWidth: 150,
  align: 'center',
  column: [
    {
      label: '床位',
      prop: 'bedCode'
    },
    {
      label: '患者名字',
      prop: 'patientName'
    },
    {
      label: '评估时间',
      prop: 'createTime',
      type: 'datetime',
      format: 'yyyy-MM-dd HH:mm',
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
      width: 150
    },
    {
      label: '项目名称',
      prop: 'projectName',
      width: 120
    },
    {
      label: '结果',
      prop: 'assessResult',
      width: 50
    },

    {
      label: '评估护士',
      prop: 'nurseName'
    }
  ]
}

  
//  所有的数据拿到接口后都要重新替换
export const tableOptionTwo = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  viewBtn: false,
  addBtn: false,
  editBtn: false,
  delBtn: false,
  menuAlign: 'center',
  align: 'center',
  // labelWidth:120,
  column: [
    {
      label: '床位',
      prop: 'bedCode'
    },
    {
      label: '患者姓名',
      prop: 'patientName'
    },
    {
      label: '发生时间',
      prop: 'createTime',
      type: 'datetime',
      format: 'yyyy-MM-dd HH:mm',
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
      width: 150
    },
    {
      label: '患者病情',
      prop: 'patientDiagnose'
    }
  ]
}
