
//  所有的数据拿到接口后都要重新替换
export const tableOption = {

    border: true,
    index: true,
    indexLabel: '序号',
    stripe: true,
    addBtn: false,
    editBtn:false,
    delBtn:false,
    menuAlign: 'center',
    align: 'center',
    viewBtn: false,
    // labelWidth:120,
    column: [
        {
            label: '患者姓名',
            prop: 'patientName',
        },

        {
            label: '错误药品商品名',
            prop: 'drugTradeName',
            search: true,
        },
        {
            label: '报告人',
            prop: 'preparerName',
        },
        {
            label:'错误用药发生时间',
            prop:'occurrenceTime'
        }
    ]
}
