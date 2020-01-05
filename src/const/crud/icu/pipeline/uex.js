export const tableOption = {
   border: true,
   index: true,
   indexLabel: '序号',
   stripe: true,
   menuAlign: 'center',
   align: 'center',
   viewBtn: false,
   editBtn: false,
   delBtn: false,
   addBtn: false,
   
   column: [
      {
         label: '患者姓名',
         prop: 'patientName',
   
      },
      {
      label: '管道名称',
      prop: 'pipingDescribe',

   },
   {
      label: '滑脱发生时间',
      prop: 'pipingSlippageTime',
      type: 'datetime',
      format: 'MM-dd HH:mm',
      valueFormat: 'MM-dd HH:mm'
   },
   {
      label: '置管时间',
      prop: 'pipingStartTime',
      type: 'datetime',
      format: 'MM-dd HH:mm',
      valueFormat: 'MM-dd HH:mm'
   },
   {
      label: '并发症描述',
      prop: 'complicationDescribe'
   },
   ]
}

