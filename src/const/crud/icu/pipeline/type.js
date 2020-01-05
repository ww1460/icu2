// var DIC = {
//   usingState: [{
//     label: '停用',
//     value: 0
//   }, {
//     label: '使用中',
//     value: 1
//   }, {
//     label: '未使用',
//     value: 2
//   }]
// }
export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  addBtn: false,
  menuAlign: 'center',
  align: 'center',
  refreshBtn: false,
  menuWidth: 150,
  menuXsWidth: 150,
  editBtn: false,
  delBtn: false,
  showClomnuBtn: false,
  searchSize: 'mini',
  labelWidth: 120,
  column: [
    {
      width: 120,
      label: '管道名称',
      prop: 'pipingName'
    }, {
      label: '管道分类',
      prop: 'pipingType',
      props: {
        label: 'label',
        value: 'value'
      },
      dicUrl: '/admin/dict/type/piping_type',
      type: 'select',
      'search': true,
      searchPlaceholder: '请选择管道分类'
    }, {
      width: 100,
      label: '引流液名称',
      prop: 'drainageName',
      type: 'button'
    }, {
      label: '风险水平',
      prop: 'risklevel',
      props: {
        label: 'label',
        value: 'value'
      },
      type: 'select',
      dicUrl: '/admin/dict/type/piping_risklevel'
    }, {
      width: 100,
      label: '入库时间',
      prop: 'dateOfStorage',
      type: 'datetime',
      format: 'MM-dd HH:mm',
      valueFormat: 'MM-dd HH:mm'
    }, {
      width: 100,
      label: '有效时间',
      prop: 'inDate',
      type: 'datetime',
      format: 'MM-dd HH:mm',
      valueFormat: 'MM-dd HH:mm'
    }, {
      label: '创造商',
      prop: 'manufacturer'
    },]
}



