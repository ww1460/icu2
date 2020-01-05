

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
    headerAlign: 'center',
    defaultExpandAll:true,
    expand:true,
    rowKey:'easilyConfusedParticularId',
    column: [
        {
            label: '药品易混淆的类别',
            prop: 'drugConfusedType',
            search: true,
            rules: [{
                required: true,
                message: '请输入药品易混淆的类别',
                trigger: 'blur'
            }],
            
        },

        {
            label: '混淆药品说明',
            prop: 'drugExplain',
            rules: [{
                required: true,
                message: '请选择输入混淆药品说明',
                trigger: 'blur'
            }]
            
        },
        {
            label:'说明',
            prop:'drugIndications'
        }
    ]
}
