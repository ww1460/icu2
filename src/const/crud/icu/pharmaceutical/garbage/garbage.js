export const tableOption = {

    border: true,
    index: true,
    indexLabel: '序号',
    stripe: true,
    addBtn: false,
    editBtn: false,
    delBtn: false,
    viewBtn: false,
    menuAlign: 'center',
    align: 'center',
    // labelWidth:120,
    column: [
        {
            label: '床位',
            prop: 'bed',
            width: '50'
        },
        {
            label: '医嘱名称',
            prop: 'hisDoctorsAdvice',
            // search: true,
        },
        {
            label: '患者姓名',
            prop: 'transfusePatient',
        },

        {
            label: '药品名称',
            prop: 'drugName',
            // search: true,
        },
        {
            width: 120,
            label: '配药时间',
            prop: 'dispensingDrugTime',
            type: "datetime",
            format: 'MM-dd HH:mm',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
        },
        {
            label: '配药护士',
            prop: 'dispensingDrugNurse',
        },
        {
            width: 120,
            label: '输液开始时间',
            prop: 'transfuseStartTime',
            type: "datetime",
            format: 'MM-dd HH:mm',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
        },
        {
            width: 120,
            label: '输液结束时间',
            prop: 'transfuseEndTime',
            type: "datetime",
            format: 'MM-dd HH:mm',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
        },
        {
            label: '输液护士',
            prop: 'transfuseNurse',
        },
        {
            width: 120,
            label: '废弃时间',
            prop: 'discardTime',
            type: "datetime",
            format: 'MM-dd HH:mm',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
        },
        {
            label: '废弃护士',
            prop: 'discardNurse',
        },




    ]
}
