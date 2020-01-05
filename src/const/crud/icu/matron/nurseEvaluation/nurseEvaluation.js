
  
//  所有的数据拿到接口后都要重新替换
export const tableOption = {
   
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  viewBtn: true,
  addBtn: true,
  menuAlign: 'center',
  align: 'center',
  column: [
    {
      label: '评估项目',
      prop: 'indicator'
    },
    
    {
      label: '项目描述',
      prop: 'indicatorScript'
    },
    {
      label: '最大值',
      prop: 'upperLimit',
      type: 'number'
    },
    {
      label: '最小值',
      prop: 'lowerLimit',  
      type: 'number'      
    },
    {
      label: '创建时间',
      prop: 'createTime',
      type: 'datetime',
      format: 'MM-dd HH:mm',
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
      rules: [{
        required: true,
        message: '请选择创建时间',
        trigger: 'blur'
      }]
    }
      
  ]
}
  
