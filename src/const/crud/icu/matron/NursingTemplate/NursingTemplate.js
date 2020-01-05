
//  所有的数据拿到接口后都要重新替换
export const tableOption = {
   
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  addBtn: true,
  menuAlign: 'center',
  align: 'center',
  // labelWidth:120,
  column: [
    {
      label: '模板范围',
      prop: 'realName',
      search: true,
      rules: [{
        required: true,
        message: '请输入姓名',
        trigger: 'blur'
      }]
    },
    
    {
      label: '模板描述',
      prop: 'gender',
      type: 'radio',
      rules: [{
        required: true,
        message: '请选择性别',
        trigger: 'blur'
      }]
    },
    {
      label: '模板内容',
      prop: 'roleFlag',
      type: 'radio',
      editDisabled: true,
      rules: [{
        required: true,
        message: '请选择角色',
        trigger: 'blur'
      }]
    },
    {
      label: '使用范围',
      prop: 'nurseGrade',        
      search: true,
      rules: [{
        required: true,
        message: '请输入等级',
        trigger: 'blur'
      }]
    },
    {
      label: '创建时间',
      prop: 'createTime',
      type: 'datetime',
      addDisplay: false,
      cell: true,
      editDisabled: true,
      // editDisplay:false,
      format: 'yyyy-MM-dd HH:mm',
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
      rules: [{
        required: true,
        message: '请选择创建时间',
        trigger: 'blur'
      }]
    }
      
  ]
}
  
