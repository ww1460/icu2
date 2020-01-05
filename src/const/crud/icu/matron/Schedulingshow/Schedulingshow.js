
var flag = {
  usingState: [{
    label: '正常',
    value: '0'
  }, {
    label: '停用',
    value: '9'
  }]
}   

var role = {
  usingState: [{
    label: '护士',
    value: 0
  }, {
    label: '护士长',
    value: 1
  }]
}
  
//  所有的数据拿到接口后都要重新替换
export const tableOption = {
   
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  addBtn: true,
  editBtn: false,
  delBtn: false,
  menuAlign: 'center',
  align: 'center',
  // labelWidth:120,
  column: [
    {
      label: '姓名',
      prop: 'realName',
      search: true,
      rules: [{
        required: true,
        message: '请输入姓名',
        trigger: 'blur'
      }]
    },
    
    {
      label: '角色',
      dicData: role.usingState,
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
      label: '等级',
      prop: 'nurseGrade',        
      search: true,
      rules: [{
        required: true,
        message: '请输入等级',
        trigger: 'blur'
      }]
    },
    {
      label: 'RFID',
      prop: 'nurseRfid',
      rules: [{
        required: true,
        message: '请输入RFID',
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
    },
    {
      label: '用户状态',
      addDisplay: false,
      prop: 'lockFlag',
      type: 'radio',
      hide: true,
      dicData: flag.usingState,
      rules: [{
        required: true,
        message: '请输入RFID',
        trigger: 'blur'
      }]
    }
      
  ]
}
  
