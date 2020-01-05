import { getsection } from "@/api/icu/patient/index";
var administrative = []
getsection().then(res => {
   res.data.data.forEach(i => {
      administrative.push({ label: i.name, value: String(i.deptId) });
   });
});
var sex = {
   usingState: [{
      label: '女',
      value: '0',
   }, {
      label: '男',
      value: '1'
   }]
}

export const tableOption = {
   border: true,
   index: false,
   viewBtn: true,
   indexLabel: '序号',
   indexWidth: 60,
   labelWidth: 100,
   stripe: true,
   fontSize: 12,
   menuAlign: 'center',
   align: 'center',
   addBtn:false,
   menuForm:false,
   delBtn: false,
   menuWidth:140,
   column: [
      {  
         width: 80,
         label: '床位',
         prop: 'bedName',
         fixed:true
      },
      {
         label: '患者姓名',
         prop: 'name',
         rules: [{
            required: true,
            message: '请输入患者姓名',
            trigger: 'blur'
         }]
      },
      {
         width: 130,
         label: '住院号',
         prop: 'hospitalnumber',
         rules: [{
            required: true,
            message: '请输入患者住院号',
            trigger: 'blur'
         }]
      },
      {
         label: '性别',
         prop: 'gender',
         type: 'radio',
         dicData: sex.usingState,
         rules: [{
            required: true,
            message: '请选择性别',
            trigger: 'blur'
         }]
      },
      {
         label: '年龄',
         prop: 'age',
         // rules: [{
         //    pattern: /^(?:[1-9][0-9]?|1[01][0-9]|120)$/,
         //    message: '请输入正确格式的年龄',
         //    trigger: 'blur'
         // }],
      },
      // {
      //    label: '月龄',
      //    prop: 'monthage',
      //    hide: true,
      // },
      {
         label: '出生日期',
         prop: 'birthday',
         hide: true,
         type: 'date',
         format: 'yyyy-MM-dd hh:mm:ss',
         valueFormat: 'yyyy-MM-dd hh:mm:ss',
         // rules: [{
         //    message: '请输入出生日期',
         //    required: true,

         // }]
      },
  
      {
         width: 160,
         label: '入院时间',
         prop: 'timeOfAdmission',
         rules: [{
            required: true,
            message: '请输入入院时间',
            trigger: 'blur'
         }],
         type: 'datetime',
         format: 'yyyy-MM-dd hh:mm',
         valueFormat: 'yyyy-MM-dd hh:mm',
      },
      {
         width: 160,
         label: '入科时间',
         prop: 'entranceTime',
         rules: [{
            required: true,
            message: '请输入入科时间',
            trigger: 'blur'
         }],
         type: 'datetime',
         format: 'yyyy-MM-dd hh:mm',
         valueFormat: 'yyyy-MM-dd hh:mm',
      },

      // {
      //    width: 120,
      //    label: 'RfidId编号',
      //    prop: 'rfidId',
      //    rules: [{
      //       required: true,
      //       message: '请输入RfidId编号',
      //       trigger: 'blur'
      //    }]
      // },
      {
         label: '过敏史',
         prop: 'allergichistory',
         rules: [{
            required: true,
            message: '请输入过敏史',
            trigger: 'blur'
         }],
         width: 200,
      },
      {
         label: '手机号',
         hide: true,
         prop: 'phone',
         rules: [
            {
               message: '请输入手机号',
               trigger: 'blur',
            },
            {
               pattern: /^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/,
               message: '手机号格式不对',
               trigger: 'blur',

            }
         ]
      },
      {
         label: '联系人电话',
         prop: 'contactphone',
         hide: true,
         rules: [
            {
               message: '请输入手机号',
               trigger: 'blur',
            },
            {
               pattern: /^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/,
               message: '手机号格式不对',
               trigger: 'blur',

            }
         ]
      },
      {
         label: '新生儿体重',
         prop: 'birthweight',
         hide: true,
         placeholder: '请输入 新生儿出生体重(kg)',
      },
      {
         label: '血型',
         prop: 'blood',
         hide: true,
         type: 'select',
         dicUrl: '/admin/dict/type/blood_type',
      },
      {
         label: '职业',
         prop: 'career',
         hide: true,
      },
      {
         label: '现居住城市',
         prop: 'currentaddresscity',

         hide: true,
      },
      {
         label: '现居地址区县',
         prop: 'currentaddresscounty',
         hide: true,
         placeholder: '请输入 现居住地址区县'
      },


      {
         label: '现住省份',
         prop: 'currentaddressprovince',
         hide: true,
      },
      {
         label: '联系人详情地址',
         prop: 'contactlocation',
         hide: true,
         placeholder: '请输入 联系人所在详情地址'
      },
      {
         label: '患者其他联系人',
         prop: 'contactperson',
         hide: true,
      },
      {
         label: '住院次数',
         prop: 'frequency',
         hide: true,
         rules: [
            {
               type: 'number',
               transform: value => Number(value),
               message: '必须是数字',
            }
         ]
      },
      {
         label: '新生入院体重',
         prop: 'hospitalweight',
         hide: true,
         placeholder: '请输入 新生儿入院体重(kg)'
      },
      {
         label: '身份证件号',
         prop: 'idNumber',
         hide: true,
         rules: [
            { message: '请填写证件号码', trigger: 'blur' },
            // {
            //    pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
            //    message: '证件号码格式有误！',
            //    trigger: 'blur'
            // }
         ]
      },
      {
         label: '身份证件类型',
         prop: 'idType',
         hide: true,
         placeholder: '请输入 患者身份证件类型'
      },
      {
         label: '婚姻状况',
         prop: 'marriage',
         hide: true,
      },
      {
         label: '病历号',
         prop: 'medicalRecords',
         hide: true,
      },
      {
         label: '教育水平',
         prop: 'educationLevel',
         hide: true,
      },

      {
         label: '民族',
         prop: 'nation',
         hide: true,
      },
      {
         label: '国籍',
         prop: 'nationality',
         hide: true,
      },
      {
         label: '健康卡号',
         prop: 'ohip',
         hide: true,
      },
      {
         label: '门诊号',
         prop: 'outpatient',
         hide: true,
      },
      {
         label: '就诊卡号',
         prop: 'seedoctor',
         hide: true,
      },
      {
         label: '入科科室',
         prop: 'admissionDepartment',
         hide: true,
         addDisplay: false,
         type: 'select',
         dicData: administrative

      },
      {
         width: 150,
         label: '病情描述',
         prop: 'diagnosis',
         type: 'textarea',
         overHidden: true,
         span: 24,
         rules: [{
            required: true,
            message: '请输入病情描述',
            trigger: 'blur'
         }]
      },
      {
         label: '在科天数',
         prop: 'sectionTime',
         hide: true,
      },
      {
         label: '转科科室',
         prop: 'turndepartment',
         hide: true,
         addDisplay: false,
         editDisabled:true,
      },
      {
         label: '与联系人关系',
         prop: 'relation',
         hide: true,
         placeholder: '请输入 患者与联系人关系',
         addDisplay: false,
      },
      {
         label: '出科科室',
         prop: 'dischargeDepartment',
         hide: true,
         addDisplay: false,
         editDisabled:true,
      }, {
         label: '出科时间',
         prop: 'dischargeTime',
         hide: true,
         type: 'datetime',
         format: 'yyyy-MM-dd hh:mm:ss',
         valueFormat: 'yyyy-MM-dd hh:mm:ss',
         addDisplay: false,
         editDisabled:true,
      },
      {
         label: '出科病房',
         prop: 'dischargeWard',
         hide: true,
         addDisplay: false,
         editDisabled:true,
      },
      {
         label: '入科结束时间',
         prop: 'entryEndTime',
         hide: true,
         type: 'datetime',
         format: 'yyyy-MM-dd hh:mm:ss',
         valueFormat: 'yyyy-MM-dd hh:mm:ss',
         addDisplay: false,
      },
      {
         label: '入科开始时间',
         prop: 'entryStartTime',
         hide: true,
         type: 'datetime',
         format: 'yyyy-MM-dd hh:mm:ss',
         valueFormat: 'yyyy-MM-dd hh:mm:ss',
         addDisplay: false,
      },
      {
         label: '评估时间',
         prop: 'fadvicetime',
         hide: true,
         type: 'datetime',
         format: 'yyyy-MM-dd hh:mm:ss',
         valueFormat: 'yyyy-MM-dd hh:mm:ss',
         addDisplay: false,
      },
      {
         label: '评估医生姓名',
         prop: 'fadviceusername',
         hide: true,
         addDisplay: false,
      },


      {
         label: '创建数据时间',
         prop: 'createTime',
         hide: true,
         type: 'datetime',
         format: 'yyyy-MM-dd hh:mm:ss',
         valueFormat: 'yyyy-MM-dd hh:mm:ss',
         addDisplay: false,
      }, {
         label: '创建数据用户',
         prop: 'createUserId',
         hide: true,
         addDisplay: false,
      },
      {
         label: '现住详细地址',
         prop: 'currentaddress',
         hide: true,
         addDisplay: false,
      },

      {
         label: '入科病房',
         prop: 'admissionWard',
         hide: true,
         addDisplay: false,
      },
      {
         label: '入科床位',
         prop: 'admissionBeds',
         hide: true,
         addDisplay: false,
      },

      {
         label: '入科途径',
         prop: 'admissionPath',
         hide: true,
         addDisplay: false,
      },
   ]
}
