
//  设置使用状态单选框内容
var DIC = {
  usingState: [{
    label: '停用',
    value: 0
  }, {
    label: '使用中',

    value: 1
  }, {
    label: '未使用',

    value: 2
  }]


}
export const tableOption = {
  border: true,
  index: true,
  viewBtn: true,
  indexLabel: '序号',
  labelWidth: 110,
  menuWidth: 250,
  menuXsWidth: 250,
  addBtn: false,
  editBtn: false,
  delBtn: false,
  stripe: true,
  menuAlign: 'center',
  align: 'center',
  column: [
    {
      label: '设备名称',
      prop: 'name',
      rules: [{
        required: true,
        message: '请输入患者名称',
        trigger: 'blur'
      }]
    },
    {
      label: '设备型号',
      prop: 'model',
      rules: [{
        required: true,
        message: '请输入设备型号',
        trigger: 'blur'
      }]
    },
    {
      label: '编码',
      prop: 'deviceNumber'
    },
    {
      width: 150,
      label: '设备RFID编号',
      prop: 'rfidId'

    },
    {
      // span: 24,
      label: '使用状态',
      prop: 'state',
      type: 'radio',
      addDisplay: false,
      dicData: DIC.usingState
    },
    // {
    //   label: '床位',
    //   prop: 'position',
    // },
    {
      width: 180,
      label: '设备已使用时长/分钟',
      prop: 'useTime',
      editDisplay: false,
      rules: [
        {
          pattern: /^[0-9]*$/,
          message: '请输入数字',
          trigger: 'blur'
        }]
    },
    {
      label: '厂家',
      prop: 'factory'
    },
    {
      label: '联系人',
      prop: 'contacts'
    },
    {
      width: 120,
      label: '联系人手机号',
      prop: 'cellPhoneNumber',
      rules: [
        {
          pattern: /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/,
          message: '请输入正确的手机号',
          trigger: 'blur'
        }]
    },
    {
      label: '营销商',
      prop: 'dealer'
    }
  ]
}

export const tableDictItemOption = {

  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  align: 'center',
  refreshBtn: false,
  addBtn: false,
  editBtn: false,
  delBtn: false,
  showClomnuBtn: false,
  searchSize: 'mini',
  column: [{
    label: '型号',
    prop: 'devModel',
    addDisabled: true,
    editDisabled: true
  }, {
    label: '参数编号',
    prop: 'parameterCode'
  }, {
    label: '项目名',
    prop: 'parameterName'
  }]
}
