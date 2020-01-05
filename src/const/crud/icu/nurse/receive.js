var DIC = {
  usingState: [{
    label: '女',
    value: '0'
  }, {
    label: '男',
    value: '1'
  }]
}
export const tableOption = {
    border: true,
    index: true,
    indexLabel: '序号',
    stripe: true,
    addBtn:false,
    editBtn:false,
    delBtn:false,
    menuAlign: 'center',
    align: 'center',
    column: [
      {
        label: '',
        prop: 'id',
        hide: true,
        editDisabled: true,
        addDisplay: false
      },
      {
        label: '床位',
        prop: 'bedName',
      
      },
      {
        label: '姓名',
        prop: 'patientName',
       
      },
      {
        label: '年龄',
        prop: 'patientAge',
       
      },
      {
        label: '性别',
        prop: 'patientGenter',
        dicData: DIC.usingState
      },
      {
        label: '入科病情',
        prop: 'patientDiagnosis',
       
      },
      {
        label: '入科时间',
        prop: 'entranceTime',
        type: 'datetime',
        format: 'yyyy-MM-dd',
      },
      {
        label: '交接班备注',
        prop: 'shiftDescribe',
      },
    ]
  }
  

export const taskOption = {
    border: true,
    index: true,
    indexLabel: '序号',
    stripe: true,
    addBtn:false,
    editBtn:false,
    delBtn:false,
    menu:false,
    menuAlign: 'center',
    align: 'center',
    column: [
      {
        label: '',
        prop: 'id',
        hide: true,
        editDisabled: true,
        addDisplay: false
      },
      {
        label:'任务名称',
        prop:"taskName"
      },
      {
        label:'任务描述',
        prop:"taskDescribe"
      },
      {
          label:"交班描述",
          prop:"shiftsTaskDescribe"
      },
      // {
      //   label: '姓名',
      //   prop: 'patientName',
       
      // },
      {
        label:'交班护士',
        prop:"realName"
      },
      
    //   {
    //     label: '入科时间',
    //     prop: 'entranceTime',
    //     type: 'datetime',
    //     format: 'yyyy-MM-dd',
    //   },
    ]
  }
  