export const tableOption = {
    viewBtn: true,
    align: 'center',
    addBtn: false,
    border: true,
    index: true,
    viewBtn:false,
    editBtn: false,
    delBtn:false,
    expandLevel: 3,
    headerAlign: 'center',
    align: 'center',
    tree: true,
    labelWidth: 100,
    column: [
        {
            label: '标题',
            prop: 'writTitle',
            overHidden:true,
            span:22,
        },
        {
            label: '描述',
            prop: 'writDescribe',
            overHidden:true,
            span:22,
        },
        // {
        //     label: '内容',
        //     prop: 'writContent',
        //     type:'textarea',
        //     overHidden:true,
        //     span:22,
        // },
    ]
}
