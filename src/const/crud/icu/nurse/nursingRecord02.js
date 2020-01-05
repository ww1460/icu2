
export const tableOption = {
    border: true,
    index: true,
    addBtn:false,
    viewBtn:true,
    indexLabel: '序号',
    stripe: true,
    menuAlign: 'center',
    align: 'center',
    searchSize: 'mini',
    column: [{
      label: '护理内容',
      prop: 'type',
      rules: [{
        required: true,
        message: '请输入护理内容',
        trigger: 'blur'
      }]
    }, {
      label: '护理内容详情',
      prop: 'description',
      
    },  {
      label: '创建时间',
      prop: 'createTime',
      type: 'datetime',
      addVisdiplay: false,
      editDisabled: true,
      format: 'yyyy-MM-dd HH:mm',
      valueFormat: 'yyyy-MM-dd HH:mm:ss'
    },{
      label: '护理人',
      prop: 'remarks'
    },]
  }
  
  
  