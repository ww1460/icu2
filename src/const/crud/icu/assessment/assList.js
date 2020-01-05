export const tableOption = {
  headerAlign: 'center',
  align: 'center',
  border: true,
  addBtn: false,
  editBtn: false,
  delBtn:false,
  rowKey:'Id',
  indexLabel: '序号',
  index: true,
  defaultExpandAll: true,
  column: [
    {
      label: '名称',
      prop: 'name',
      align: 'left',
      width: 400
    },

    {
      label: '层级',
      prop: 'level',
      dicData: [
        {
          label: '类型',
          value: 1
        },
        {
          label: '项目',
          value: 2
        },
        {
          label: '选项',
          value: 3
        },
      ]
      // type: 'select',
    },
    {
      label: '分值',
      prop: 'assessScore'
    },
    {
      label: '结果',
      prop: 'assessResult'
    },
    {
      label: '范围',
      prop: 'scoreRange'
    },
    //   {
    //     label: '自定义图标',
    //     prop: 'icon',
    //     slot: true,
    //   },
    //   {
    //     label: '备注',
    //     prop: 'comment'
    //   }
  ],
}
export const proListOption = {
  headerAlign: 'center',
  align: 'center',
  border: true,
  addBtn: false,
  indexLabel: '序号',
  index: true,
  // menuWidth:400,
  menuXsWidth:200,
  defaultExpandAll: true,
  column: [
    {
      label: '评估名称',
      prop: 'projectName',
      align: 'left',
      
      rules: [{
        required: true,
        message: '请输入评估名称',
        trigger: 'blur'
      }]
      // width: 200
    },
      {
        label: '评估简写',
        prop: 'projectCode',
        // dicData: [{
        //   label: '零',
        //   value: 0
        // }, {
        //   label: '一',
        //   value: 1
        // }, {
        //   label: '二',
        //   value: 2,
        // }]
      },
    //   {
    //         label: '创建时间',
    //         prop: 'createTime',

    //       },
    //   {
    //     label: '更新时间',
    //     prop: 'updateTime'
    //   },
    //   {
    //     label: '自定义图标',
    //     prop: 'icon',
    //     slot: true,
    //   },
    //   {
    //     label: '备注',
    //     prop: 'comment'
    //   }
  ],
}