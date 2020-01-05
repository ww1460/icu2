
//  所有的数据拿到接口后都要重新替换
export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  addBtn: false,
  delBtn: false,
  editBtn: false,
  // editBtn:false,
  menuAlign: 'center',
  align: 'center',
  // labelWidth:120,
  column: [
    {
      label: '姓名',
      prop: 'nurseName',
      editDisplay: false,
      width: 90
        
    },
    
    {
      label: '评估项目',
      prop: 'indicator',
      editDisplay: false,
      width: 100
    },
    {
      label: '评估描述',
      prop: 'indicatorScript',
      editDisplay: false
    },
    {
      label: '评估结果',
      prop: 'indicatorValue',
      editDisplay: false,
      width: 80
    },
    {
      label: '评估时间',
      prop: 'assessTime',
      editDisplay: false,
      type: 'datetime',
      format: 'MM-dd HH:mm',
      valueFormat: 'MM-dd HH:mm:ss',
      width: 120
    },
    {
      label: '评估评价',
      prop: 'indicatorValueOfMatron',      
      type: 'textarea'  
       
    },
    {
      label: '评价人',
      prop: 'matronName',
      editDisplay: false,
      width: 90
    }
      
  ]
}
  
