export const tableOption = {
    border: true,
    index: true,
    indexLabel: '序号',
    stripe: true,
    menuAlign: 'center',
    align: 'center',
    refreshBtn: false,
    addBtn: false,
    menu:false,
    showClomnuBtn: false,
    searchSize: 'mini',
    labelWidth: 120,
    column: [{
        label: '设备名称',
        prop: 'bodyParts',
        props: {
            label: 'label',
            value: 'value'
          },
          dicUrl: '/admin/dict/type/piping_position',
    }, {
        label: '患者',
        prop: 'patientName',
    },{
        label: '连接时长',
        prop: 'endTime',
    }, ]
}