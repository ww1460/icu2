
// var validateStartTime = (rule, value, callback) => {
//   // if (value === '') {
//   //   callback(new Error('请输入密码'));
//   // } else {
//   //   callback();
//   // }
//   console.log(value)
//   console.log(window)
// };
// var validateEndTime = (rule, value, callback) => {
//   // if (value === '') {
//   //   callback(new Error('请输入密码'));
//   // } else {
//   //   callback();
//   // }
//   console.log(value)
// };

export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  align: 'center',
  menuWidth: 150,
  menuXsWidth: 150,
  refreshBtn: false,
  addBtn: false,
  showClomnuBtn: false,
  searchSize: 'mini',
  labelWidth: 120,
  column: [{
    label: '患者名称',
    prop: 'patientName'
  }, {
    label: '管道部位',
    prop: 'bodyParts',
    type: 'select',
    props: {
      label: 'label',
      value: 'value'
    },
    dicUrl: '/admin/dict/type/piping_position'
  }, {
    width: 120,
    label: '固定方式方法',
    prop: 'fixed',
    type: 'select',
    props: {
      label: 'label',
      value: 'value'
    },
    dicUrl: '/admin/dict/type/piping_fixed_method'
  },
  {
    label: '插入长度',
    prop: 'lengthBuiltin'
  }, {
    label: '外露长度',
    prop: 'lengthExposure'
  }, {
    width: 120,
    label: '开始插管时间',
    prop: 'startTime',
    type: 'datetime',
    format: 'MM-dd HH:mm',
    valueFormat: 'yyyy-MM-dd HH:mm:ss',
    // rules: [{ validator: validateStartTime, trigger: 'blur' }]
  }, {
    width: 120,
    label: '结束插管时间',
    prop: 'endTime',
    type: 'datetime',
    format: 'MM-dd HH:mm',
    valueFormat: 'yyyy-MM-dd HH:mm:ss',
    // rules: [{ validator: validateEndTime, trigger: 'blur' }]
  }, {
    label: '标签名称',
    prop: 'signName'
  }, {
    label: '标签颜色',
    prop: 'signColor',
    type: 'select',
    props: {
      label: 'label',
      value: 'value'
    },
    dicUrl: '/admin/dict/type/piping_sign_color'

  }, {
    width: 120,
    label: '皮肤局部情况',
    prop: 'localCondition'
  }, {
    label: '护理措施',
    prop: 'nursingMeasures'
  }, {
    label: '评论',
    prop: 'remark'
  }]
}

