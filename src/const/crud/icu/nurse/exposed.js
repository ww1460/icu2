
//  所有的数据拿到接口后都要重新替换
export const tableOption = {

  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  addBtn: false,
  editBtn: false,
  delBtn: false,
  menuAlign: 'center',
  align: 'center',
  // labelWidth:120,
  column: [

    {
      label: '姓名',
      prop: 'nurseName',
      // search: true,
    },

    {
      label: '接触部位',
      prop: 'exposurePart',

    }, {

      label: '发生地点',
      prop: 'occurrenceSite',
    },
    {
      label: '损伤程度',
      prop: 'injuryDegreeAndRisk',
    },
    {
      label: '来源患者姓名',
      prop: 'patientName',
    },
    {
      label: '发生时间',
      prop: 'occurrenceTime',
      type: "datetime",
      // editDisplay:false,
      format: 'MM-dd HH:mm',
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
    },

  ]
}
