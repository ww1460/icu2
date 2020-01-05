var DIC = {
    stateFl: [ {
        label: '待执行',
        value: '1',
    }, {
        label: '执行中',
        value: '2',
    }, {
        label: '已完成',
        value: '3',
    }, {
        label: '已暂停',
        value: '4',
    }],
};
export const reportOption = {
    border: true,
    index: true,
    indexLabel: '序号',
    stripe: true,
    editBtn: false,
    delBtn: false,
    addBtn: false,
    menu:false,
    cellBtn:true,
    keyId:'id',
    menuAlign: 'center',
    align: 'center',
    column: [
          {
            label: 'Id',
            prop: 'id',
            hide: true,
          },
        {
            label: '时间',
            prop: 'createTime',

        },
        {
            label: '患者',
            prop: 'patientName',

        },
        // {
        //     label: '计划时间',
        //     prop: 'startTime',

        // },
        {
            label: '结果',
            prop: 'recordContent',
        },
        {
            label:'护士',
            prop:'realName',
        }
    ]
}
export const tableOption = {
    border: true,
    index: true,
    indexLabel: '序号',
    stripe: true,
    editBtn: false,
    delBtn: false,
    addBtn: false,
    menu:false,
    cellBtn:true,
    keyId:'id',
    selection: true,
    menuAlign: 'center',
    align: 'center',
    column: [
          {
            label: 'Id',
            prop: 'id',
            hide: true,
          },
        {
            label: '任务名称',
            prop: 'taskName',

        },
        {
            label: '任务描述',
            prop: 'taskDescribe',

        },
        // {
        //     label: '计划时间',
        //     prop: 'startTime',

        // },
        {
            label: '状态',
            prop: 'taskState',
            dicData: DIC.stateFl,
        },
        {
            label:'交接班描述',
            prop:'shiftsTaskDescribe',
            slot:true
        }
    ]
}
