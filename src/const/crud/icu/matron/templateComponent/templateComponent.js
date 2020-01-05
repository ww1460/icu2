var DIC = {
  usingState: [{
    label: '科室',
    value: 1
  }, {
    label: '个人',
    value: 0
  }]
}
var DICmy = {
  usingState: [{
    label: '不看自己',
    value: 1
  }, {
    label: '仅看自己',
    value: 0
  }]
}
//  所有的数据拿到接口后都要重新替换
export const tableOption = {
  
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  addBtn: false,
  delBtn: false,
  editBtn: false,
  menuAlign: 'center',
  align: 'center',
  // labelWidth:120,
  column: [
    {
      label: '模板标题',
      prop: 'templateTitle',
      search: true
  
    },
    {
      label: '模板描述',
      prop: 'templateDescription'
    },
    {
      label: '使用范围',
      prop: 'templateUseScope',
      search: true,
      type: 'radio',
      editDisplay: false,
      dicUrl: '/admin/dict/type/nurseing_template_type',
      dicData: DIC.usingState
    },
    {
      label: '创建人',
      prop: 'creator'
    },
    {
      label: '个人模板',
      prop: 'personal',
      search: true,
      hide: true,
      type: 'select',
      dicData: DICmy.usingState
    }
  ]
}
  
