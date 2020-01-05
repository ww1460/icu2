
var DIC = {
  usingState: [{
    label: '正常',
    value: 0
  }, {
    label: '异常',
    value: 1
  }]
}
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
      label: '项目类型',
      prop: 'label',
      rules: [{
        required: true,
        message: '请输入项目名',
        trigger: 'blur'
      }]
    }
  ]
}



//  所有的数据拿到接口后都要重新替换
export const tableOption1 = {

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
        message: '请输入项目名',
        trigger: 'blur'
      }]
    } 
  ]
}

export const tableOption2 = {

  border: true,
  index: true, 
  indexLabel: '序号',
  stripe: true,
  addBtn: false,
  editBtn: false,
  delBtn: false,
  view: false,
  menuAlign: 'center',
  align: 'center',
  // labelWidth:120,
  column: [
    {
      label: '项目',
      prop: 'projectName',
      addDisplay: true,
      rules: [{
        required: true,
        message: '请输入项目',
        trigger: 'blur'
      }]
    },
    {
      label: '状态',
      prop: 'projectStateFlag',
      type: 'radio',
      dicData: DIC.usingState,
      rules: [{
        required: true,
        message: '请选择项目状态',
        trigger: 'change'
      }]
    },
    {
      label: '描述',
      prop: 'projectState',
      rules: [{
        required: true,
        message: '请输入描述',
        trigger: 'blur'
      }]
    }
  ]
}

export const tableOption3 = {

  border: true,
  index: true, 
  indexLabel: '序号',
  stripe: true,
  addBtn: true,
  editBtn: true,
  delBtn: true,
  view: false,
  menuWidth: 200,
  menuAlign: 'center',
  align: 'center',
  // labelWidth:120,
  column: [
    {
      width: 150,
      label: '状态',
      prop: 'illnessState',
      type: 'radio',
      dicData: DIC.usingState,
      rules: [{
        required: true,
        message: '请选择项目状态',
        trigger: 'blur'
      }]
    },

    {
      label: '建议',
      prop: 'nursingAdvice',
      type: 'textarea',
      rules: [{
        required: true,
        message: '请输入建议',
        trigger: 'blur'
      }]
    }
  ]
}

