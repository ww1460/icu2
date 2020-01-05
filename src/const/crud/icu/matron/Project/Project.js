var DIC = {
  usingState: [{
    label: '不存在',
    value: 1
  }, {
    label: '存在',
    value: 0
  }]
}
var flag = {
  usingState: [{
    label: '是',
    value: 0
  }, {
    label: '否',
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
  delBtn: false,
  editBtn: false,
  // viewBtn:true,
  menuAlign: 'center',
  align: 'center',
  labelWidth: 120,

  column: [
    {
      label: '项目名称',
      prop: 'projectName',
      search: true,
      rules: [{
        required: true,
        message: '请输入项目名称',
        trigger: 'blur'
      }]
    },
    {
      label: '项目简写',
      prop: 'projectCode',
      search: true,
      rules: [{
        required: true,
        message: '请输入简写',
        trigger: 'blur'
      }]
    },
    {
      label: '项目类型',
      prop: 'projectType',
      type: 'select',
      search: true,
      props: {
        label: 'label',
        value: 'value'
      },
      dicUrl: '/admin/dict/type/project_type',
      rules: [{
        required: true,
        message: '请选择项目类型',
        trigger: 'change'
      }]
    },

    {
      label: '固定值',
      prop: 'projectRecordValueFlag',
      dicData: DIC.usingState,
      type: 'radio'
      // rules: [{
      //   required: true,
      //   message: '请选择是否存在固定值',
      //   // trigger: 'change'
      // }]
    },
    {
      label: '预警值',
      prop: 'projectWarmFlag',
      type: 'radio',
      dicData: DIC.usingState
      // rules: [{
      //   required: true,
      //   message: '请选择是否存在预警值',
      //   // trigger: 'change'
      // }]
    },

    {
      label: '病情护理项',
      prop: 'illnessNursingFlag',
      type: 'radio',
      dicData: flag.usingState,
      search: true
      // rules: [{
      //   required: true,
      //   message: '请选择是否为病情护理项',
      //   // trigger: 'change'
      // }]
    },
    {
      hide: true,
      label: '创建时间',
      prop: 'createTime',
      type: 'datetime',
      addDisplay: false,
      cell: true,
      editDisabled: true,
      // editDisplay:false,
      format: 'MM-dd HH:mm',
      valueFormat: 'MM-dd HH:mm:ss',
      rules: [{
        required: true,
        message: '请选择创建时间',
        trigger: 'blur'
      }]
    }
  ]
}
export const profixdOption = {

  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  // viewBtn:true,
  menuAlign: 'center',
  align: 'center',
  // labelWidth:120,

  column: [
    {
      label: '项目ID',
      prop: 'projectId',
      hide: true,
      addDisplay: false,
      editDisplay: false
    },
    {
      label: '固定值',
      prop: 'recordValue',
      rules: [{
        required: true,
        message: '请输入固定值',
        trigger: 'blur'
      }]
    }

  ]
}

