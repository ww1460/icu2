
//  所有的数据拿到接口后都要重新替换
export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  addBtn: false,
  view: true,
  editBtn: false,
  delBtn: false,
  menuAlign: 'center',
  align: 'center',
  // labelWidth:120,
  column: [
    {
      label: '患者姓名',
      prop: 'patientName'
    },
    {
      label: '床位',
      prop: 'bedCode'
    },
    {
      label: '护理人',
      prop: 'realName'
    },
    {
      label: '来源',
      prop: 'source',
      dicUrl: '/admin/dict/type/data_source_type'
    },
    {
      width: 450,
      label: '护理内容',
      prop: 'recordContent',
      // search:true,
      rules: [{
        required: true,
        message: '请输入姓名',
        trigger: 'blur'
      }]
    },

  
    {
      width: 120,
      label: '护理时间',
      prop: 'createTime',
      type: 'datetime',
      format: 'MM-dd HH:mm',
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
      search: true
    }
      
  ]
}
  
