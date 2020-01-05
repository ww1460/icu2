var DIC = {
    usingState: [{
        label: '男',
        value: 1,
    }, {
        label: '女',
        value: 0
    }]
}


//  所有的数据拿到接口后都要重新替换
export const tableOption = {

    border: true,
    index: true,
    indexLabel: '序号',
    stripe: true,
    addBtn: false,
    editBtn: true,
    delBtn: true,
    viewBtn: true,
    menuAlign: 'center',
    align: 'center',
    // labelWidth:120,
    column: [
        {
            label: '药品不良反应',
            prop: 'adverseReaction',
            rules: [{
                required: true,
                message: '请输入药品不良反应',
                trigger: 'blur'
            }]
        },

        {
            label: '药品名称',
            prop: 'drugName',
            search: true,
            rules: [{
                required: true,
                message: '请输入药品名称',
                trigger: 'blur'
            }]
        },
        {
            label: '药品类别',
            prop: 'drugType',
            rules: [{
                required: true,
                message: '请输入药品类别',
                trigger: 'blur'
            }]
        },
        {
            label: '药品规格',
            prop: 'drugSpecification',
            rules: [{
                required: true,
                message: '请输入药品规格',
                trigger: 'blur'
            }]
        },
        {
            label: '药品分级',
            prop: 'drugLevel',
            rules: [{
                required: true,
                message: '请输入药品分级',
                trigger: 'blur'
            }]
        },
        {
            label: '禁忌',
            prop: 'drugTaboo',
        },
        {
            label: '药理作用',
            prop: 'pharmacologicalAction',
            hide: true,
        },
        {
            label: '药品说明',
            prop: 'remarks',
            hide: true,
        },

        {
            width:120,
            label: '登记时间',
            prop:'createTime',
            type:"datetime",
            format: 'MM-dd HH:mm',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
          },

    ]
}
