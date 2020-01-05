

export const tableOption = {
    border: true,
    // index: true,
    // indexLabel: '序号',
    stripe: true,
    addBtn:false,
    viewBtn:false,
    editBtn:false,
    delBtn:false,
    menuAlign: 'center',
    align: 'center',
    column: [
    //   {
    //     label: '租户id',
    //     prop: 'id',
    //     hide: true,
    //     editDisabled: true,
    //     addDisplay: false
    //   },
    {
      label: '床位',
      prop: 'bedCode',
      width:"60"
    },
    {
      label: '患者名字',
      prop: 'patientName',
      rules: [{
        required: true,
        message: '请输入租户编号',
        trigger: 'blur'
      }],
      width:"120"
    },
      {
        label: '项目名称',
        prop: 'projectName',
        search:true
        // rules: [{
        //   required: true,
        //   message: '请输入租户名称',
        //   trigger: 'blur'
        // }]
      },
      {
        label: '结果',
        prop: 'assessResult',
      },
     
      {
        label: '评估护士',
        prop: 'nurseName',
        width:"120"
        // type: 'select',
        // dicUrl: '/admin/dict/type/status_type',
        // search: true,
        // rules: [{
        //   required: true,
        //   message: '请输入租户编号',
        //   trigger: 'blur'
        // }]
      },
      {
        label: '评估时间',
        prop: 'createTime',
        type: 'datetime',
        width:"160",
        rules: [{
          required: true,
          message: '请输入结束时间',
          trigger: 'blur'
        }]
      },
      
     
    ]
  }
  