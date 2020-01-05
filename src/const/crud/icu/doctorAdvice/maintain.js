
//  所有的数据拿到接口后都要重新替换
export const tableOption = {
   
    border: true,
    index: true,
    indexLabel: '序号',
    stripe: true,
    addBtn:false,
    editBtn:true,
    delBtn:true,
    viewBtn:true,
    menuAlign: 'center',
    align: 'center',
    // labelWidth:120,
    column: [
      {
        label: '医嘱内容',
        prop: 'doctorsAdviceContent',
        search:true,
        rules: [{
            required: true,
            message: '请输入医嘱内容',
            trigger: 'blur'
          }]
      },
    
      {
        label: '备注',
        prop: 'remarks',
      },
      {
        label: '医嘱简称',
        prop: 'shortName',
        rules: [{
          required: true,
          message: '请输入医嘱简称',
          trigger: 'blur'
        }]
      },
      {
        label: '创建时间',
        prop:'createTime',
        type:"datetime",
        addDisplay:false,
        cell:true,
        editDisabled:true,
        // editDisplay:false,
        format: 'MM-dd HH:mm',
        valueFormat: 'yyyy-MM-dd HH:mm:ss',
        rules: [{
            required: true,
            message: '请选择创建时间',
            trigger: 'blur'
          }]
      },
      
    ]
  }
  