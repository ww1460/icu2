// var attribute = this.drainageName
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
  delBtn: false,
  menuAlign: 'center',
  align: 'center',
  menuWidth: 250,
  menuXsWidth: 250,
  refreshBtn: false,
  showClomnuBtn: false,
  searchSize: 'mini',
  labelWidth: 120,
  column: [{
    span: 22,
    label: '引流液类型名称',
    prop: 'drainageName',
    searchPlaceholder: '请输入引流液类型名称',
    search: true
    // dicUrl: '/icu/drainage/type/drainageName',
  }, {
    label: '描述',
    prop: 'drainageDescribe',
    type: 'textarea',
    span: 22
  }]
}

export const tableOptionAttribute = {
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
    prop: 'drainageName',
    editDisabled: true
  },
  {
    label: '属性名称',
    prop: 'attributeName',
    props: {
      label: 'label',
      value: 'value'
    },
    type: 'select',
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
