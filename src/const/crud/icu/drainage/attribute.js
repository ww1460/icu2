var DIC = {
  usingState: [{
    label: '正常',
    value: 0
  }, {
    label: '异常',
    value: 1
  }]
}
export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  addBtn: false,
  menuAlign: 'center',
  align: 'center',
  menuWidth: 150,
  menuXsWidth: 150,
  refreshBtn: false,
  showClomnuBtn: false,
  searchSize: 'mini',
  labelWidth: 100,
  column: [{
    label: '引流液名称',
    prop: 'drainageName'
  },
  {
    label: '属性名称',
    prop: 'attributeName',
    props: {
      label: 'label',
      value: 'value'
    },
    type: 'select',
    searchPlaceholder: '请选择属性名称',
    search: true,
    dicUrl: '/admin/dict/type/drainage_attribute'
  }, {
    label: '属性类型',
    prop: 'attributeType'

  }, {
    label: '状态',
    type: 'radio',
    prop: 'normal',
    dicData: DIC.usingState
  }, {
    label: '措施',
    prop: 'measures'

  }]
}
