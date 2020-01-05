var DIC = {
  usingState: [{
    label: '男',
    value: 1
  }, {
    label: '女',
    value: 0
  }]
}

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
  addBtn: false,
  editBtn: false,
  delBtn: false,
  menuAlign: 'center',
  align: 'center',
  // labelWidth:120,
  column: [
    {
      label: '登录名',
      hide: true,
      prop: 'username',
      rules: [
        { required: true, message: '请输入登录名', trigger: 'blur' },
        { pattern: /^[0-9a-zA-Z]+$/, message: '只能输入数字、字母' }
      ]
    },
    {
      label: '登录密码',
      hide: true,
      editDisplay: false,
      viewDisplay: false,
      prop: 'password',
      type: 'show-password',
      rules: [
        { required: true, message: '请输入登录密码', trigger: 'blur' } 
        // { type:'show-password', message: '请输入正确格式手机号' }
      ]
    },
    {
            
      label: '手机号',
      hide: true,
      prop: 'phone',
      rules: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1([39]\d|5[0-35-9]|7[3678])\d{8}$/, message: '请输入正确格式手机号' }
      ]
    },
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
      label: '性别',
      prop: 'gender',
      type: 'radio',
      dicData: DIC.usingState,
      rules: [{
        required: true,
        message: '请选择性别',
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
      rules: [{
        required: true,
        message: '请输入等级',
        trigger: 'blur'
      }],
      // props: {
      //   label: 'nurseGrade',
      //   value: 'value'
      // },
      dicUrl: '/admin/dict/type/nurse_grade'
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
      format: 'MM-dd HH:mm',
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
  
