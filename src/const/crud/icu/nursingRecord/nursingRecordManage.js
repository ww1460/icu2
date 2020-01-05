var DIC = {
  usingState: [{
    label: '固定值编号',
    value: 0,
  }, {
    label: '√',
    value: 1
  }, {
    label: '具体值',
    value: 2
  }, {
    label: '固定值内容',
    value: 3
  }]
}
//  所有的数据拿到接口后都要重新替换
export const tableOption = {

  sortable:true,
  dragHandler:true,
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  addBtn: false,
  editBtn: false,
  delBtn: false,
  menu: true,
  menuAlign: 'center',
  align: 'center',
  // labelWidth:120,
  column: [

    {
      label: '项目名',
      prop: 'projectName',
      rules: [{
        required: true,
        message: '请输入项目名',
        trigger: 'blur'
      }]
    },
    {
      label: '项目简称',
      prop: 'projectCode',
      rules: [{
        required: true,
        message: '请输入项目简称',
        trigger: 'blur'
      }],

    },
    {
      label: '展示方式',
      prop: 'showWayFlag',
      type: 'radio',
      dicData: DIC.usingState,
    }
    // {
    //   label: '项目类型',
    //   prop: 'projectType',
    //   rules: [{
    //     required: true,
    //     message: '请输入项目简称',
    //     trigger: 'blur'
    //   }],
    //   props: {
    //     label: 'label',
    //     value: 'value'
    //   },
    //   dicUrl: '/admin/dict/type/project_type',
    // },


  ]
}
