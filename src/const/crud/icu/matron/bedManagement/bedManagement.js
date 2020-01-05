
  var role = {
    usingState: [{
      label: '未使用',
      value: 0,
    }, {
      label: '使用中',
      value: 1
    },{
      label:'维护中',
      value:2
    }]
  }
  
//  所有的数据拿到接口后都要重新替换
export const tableOption = {
   
    border: true,
    index: true,
    indexLabel: '序号',
    stripe: true,
    addBtn:false,
    viewBtn:false,
    editBtn:false,
    delBtn:false,
    menuAlign: 'center',
    align: 'center',
    // labelWidth:120,
    column: [
    
      {
        label: '床位名',
        prop: 'bedName',
        rules: [{
            required: true,
            message: '请输入床位名',
            trigger: 'blur'
          }]
      },
      {
        label: '床位编号',
        prop: 'bedCode',
        search:true,
        rules: [{
            required: true,
            message: '请输入床位编号',
            trigger: 'blur'
          }]
      },
      {
        label: '床位状态',
        dicData: role.usingState,
        prop: 'useFlag',
        type:'radio',
        rules: [{
            required: true,
            message: '请选择床位状态',
            trigger: 'blur'
          }]
      },
      {
        label: '床位RFID',
        prop: 'rfid',
      },
    ]
  }
  