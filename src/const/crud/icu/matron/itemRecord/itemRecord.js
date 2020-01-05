
//  所有的数据拿到接口后都要重新替换
export const tableOption = {

  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  addBtn: false,
  editBtn: false,
  delBtn: true,
  viewBtn: true,
  menuAlign: 'center',
  align: 'center',
  // labelWidth:120,
  column: [
    {
      label: '患者姓名',
      prop: 'patientName'
    },
    {
      label: '床位',
      prop: 'bedCode'
      // search: true,
    },
    {
      label: '项目',
      prop: 'projectName',
      search: true
    },

    {
      label: '项目数据',
      prop: 'projectValue'
    },
    {
      label: '项目数据描述',
      prop: 'projectSpecificRecord'
    },
    {
      label: '来源',
      prop: 'source',
      dicUrl: '/admin/dict/type/data_source_type'
    },


    {
      label: '创建时间',
      prop: 'createTime',
      type: 'datetime',
      format: 'MM-dd HH:mm',
      valueFormat: 'yyyy-MM-dd HH:mm:ss'
    }

  ]
}
