var DIC = {
  usingState: [{
    label: '科室',
    value: 1,
  }, {
    label: '个人',
    value: 0
  }],
  sourceDic: [
    {
      label: '普通',
      value: 8,
    }, {
      label: '医嘱',
      value: 5,
    }, {
      label: '快捷',
      value: 9,
    }]
}


//  所有的数据拿到接口后都要重新替换
export const tableOption = {

  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  addBtn: false,
  viewBtn: false,
  editBtn: false,
  delBtn: false,
  menuAlign: 'center',
  align: 'center',
  // labelWidth:120,
  column: [
    {
      label: '使用范围',
      prop: 'purpose',
      type: 'radio',
      dicData: DIC.usingState,
      // rules: {
      //     required: true,
      //     message: '请选择使用范围',
      //     trigger: 'change' 
      //   }
    },
    // {
    //   label: '模板类型',
    //   prop: 'projectName',
    //   rules: [{
    //       required: true,
    //       message: '请输入模板类型',
    //       trigger: 'blur'
    //     }]
    // },
    {
      label: '模板标题',
      prop: 'templateContent',
      rules: [{
        required: true,
        message: '请输入模板标题',
        trigger: 'blur'
      }]
    },
    {
      label: '模板描述',
      prop: 'templateDescribe',
      rules: [{
        required: true,
        message: '请输入模板描述',
        trigger: 'blur'
      }]
    },
    {
      label: '模板来源',
      prop: 'source',
      type: "select",
      dicData: DIC.sourceDic,
      rules: [{
        required: true,
        message: '请选择模板来源',
        trigger: 'blur'
      }]
    },
    // {
    //   label: '任务结果',
    //   prop:'result',
    //   rules: [{
    //       required: true,
    //       message: '请输入任务结果',
    //       trigger: 'blur'
    //     }]
    // },

  ]
}


export const subTaskOption = {

  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  addBtn: false,
  viewBtn: false,
  editBtn: false,
  delBtn: false,
  menuAlign: 'center',
  align: 'center',
  // labelWidth:120,
  column: [
    {
      label: '任务内容',
      prop: 'taskContent',
      rules: [{
        required: true,
        message: '请输入任务内容',
        trigger: 'blur'
      }]
    },
    {
      label: '任务描述',
      prop: 'taskDescribe',
      rules: [{
        required: true,
        message: '请输入任务描述',
        trigger: 'blur'
      }]
    },

    // {
    //   label: '任务结果',
    //   prop:'result',
    //   rules: [{
    //       required: true,
    //       message: '请输入任务结果',
    //       trigger: 'blur'
    //     }]
    // },

  ]
}