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
   viewBtn: false,
   addBtn: false,
   editBtn: false,
   delBtn: false,
   menuAlign: 'center',
   align: 'center',
   // labelWidth:120,
   column: [
      {
         label: '患者姓名',
         prop: 'patientName',
      },
      {
         label: '床位',
         prop: 'bedName',
      },
      {
         label: '申报人',
         prop: 'declarer',
      },

      {
         label: '申报时间',
         prop: 'declareTime',
         type: "datetime",
         // editDisplay:false,
         format: 'yyyy-MM-dd HH:mm',
         valueFormat: 'yyyy-MM-dd HH:mm:ss',
      },
   ]
}
