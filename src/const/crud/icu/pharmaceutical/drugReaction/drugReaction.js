import { mapGetters, mapState } from "vuex";
var DIC = {
   usingState: [{
      label: '男',
      value: '1',
   }, {
      label: '女',
      value: '0'
   }]
}


//  所有的数据拿到接口后都要重新替换
export const tableOption = {

   border: true,
   index: true,
   indexLabel: '序号',
   stripe: true,
   addBtn: true,
   menuAlign: 'center',
   align: 'center',
   viewBtn: true,
   addBtn: false,
   labelWidth:120,
   column: [
      // {
      //    label: '床号',
      //    prop: 'bedName',
      //    editDisabled:true,
      // },
      {
         label: '姓名',
         prop: 'patientName',
         editDisabled:true,
      },

      {
         label: '性别',
         prop: 'gender',
         type: 'radio',
         dicData: DIC.usingState,
         editDisabled:true,
      },
      {
         label: '年龄',
         prop: 'age',
         editDisabled:true,
      },
      {
         label: '住院号',
         prop: 'hospitalnumber',
         width: "130px",
         editDisabled:true,
      },
      {
         label: '药品名称',
         prop: 'drugName',
         // search:true
         editDisabled:true,
      },
      {
         label: '用法用量',
         prop: 'dose',
         editDisabled:true,
      },
      {
         label: '用药开始时间',
         prop: 'startTime',
         type: 'datetime',
         format: "MM-dd HH:mm",
         width: "120px"
      },
      {
         label: '用药结束时间',
         prop: 'endTime',
         type: 'datetime',
         format: "MM-dd HH:mm",
         width: "120px"
      },
      {
         label: '事件发生时间',
         prop: 'occurrenceTime',
         type: 'datetime',
         format: "MM-dd HH:mm",
         width: "120px"
      }, {
         label: '不良反应名称',
         prop: 'adverseName',
         width: "120px"
      }, {
         label: '不良反应症状',
         prop: 'symptom',
         width: "120px"
      }, {
         label: '处理过程',
         prop: 'treatProcess',
         type:'textarea',
         span:24
      },

   ]
}
