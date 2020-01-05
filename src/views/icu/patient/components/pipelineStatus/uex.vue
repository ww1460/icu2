<template>
   <!-- uex登记表 -->
   <div class="uex">
      <div class="panel-heading">
         <h3 class="panel-title">uex登记表</h3>
         <el-button @click="close()">返回</el-button>
      </div>
      <table class="table table-bordered">
         <tbody>
            <tr>
               <td>
                  <span class="size">患者姓名：</span>
                  {{form.patientName}}
               </td>
               <td>
                  <span class="size">病案号：</span>
                  {{form.hospitalnumber}}
               </td>
               <td>
                  <span class="size">性别：</span>
                  {{form.gender | sex}}
               </td>
               <td>
                  <span class="size">年龄：</span>
                  {{form.age}}
               </td>
            </tr>
            <tr>
               <td colspan="4">
                  <span class="size">诊断：</span>
                  {{form.diagnosis}}
               </td>
            </tr>
            <tr>
               <td colspan="4">
                  <span class="size">{{description}}：</span>
                  <el-radio-group v-model="form.educationLevel" :disabled="!viewFlag">
                     <el-radio
                        :label="state.value"
                        v-for="state in eduList"
                        :key="state.value"
                     >{{state.label}}</el-radio>
                  </el-radio-group>
               </td>
            </tr>
            <tr>
               <td colspan="4">
                  <div>
                     <p>
                        <span class="size">一.导管类型：</span>
                     </p>
                  </div>
                  <div class="clearfix rideo">
                     <p class="float">
                        <el-radio-group v-model="form.pipingId">
                           <el-radio
                              v-for="state in pipingNames"
                              :label="state.pipingId"
                              :key="state.id"
                              :disabled="true"
                           >{{state.pipingName}}</el-radio>
                        </el-radio-group>
                     </p>
                     <!-- <p class="float">
                        <span class="size">更多：</span>
                        <el-input v-model="form.pipingDescribe" style="width:120px"></el-input>
                     </p>-->
                  </div>
                  <div>
                     <p>
                        <span class="size">二.发生时间：</span>
                        <el-date-picker
                           v-model="form.pipingSlippageTime"
                           type="datetime"
                           placeholder="选择日期时间"
                           value-format="yyyy-MM-dd HH:mm:ss"
                           :disabled="!viewFlag"
                        ></el-date-picker>
                     </p>
                  </div>
                  <div class="clearfix">
                     <p class="float" style="margin-left:0">
                        <span class="size">三.置管时间：</span>
                        <el-date-picker
                           v-model="form.pipingStartTime"
                           type="datetime"
                           placeholder="选择日期时间"
                           format="MM-dd hh-mm"
                           value-format="yyyy-MM-dd HH:mm:ss"
                           :disabled="!viewFlag"
                        ></el-date-picker>
                     </p>
                     <p class="float">
                        <span style="padding-left:10px" class="size">手术日期：</span>
                        <el-date-picker
                           v-model="form.operationTime"
                           type="datetime"
                           placeholder="选择日期时间"
                           value-format="yyyy-MM-dd HH:mm:ss"
                           :disabled="!viewFlag"
                        ></el-date-picker>
                     </p>
                  </div>
                  <div>
                     <p>
                        <span class="size">四.患者身体状况：</span>
                     </p>
                  </div>
                  <div class="rideo">
                     <p style="margin-left:20px">
                        <span class="size">护理级别：</span>
                        <el-radio-group v-model="form.nursingLevel" :disabled="!viewFlag">
                           <el-radio :label="0">特级护理</el-radio>
                           <el-radio :label="1">一级护理</el-radio>
                           <el-radio :label="2">二级护理</el-radio>
                           <el-radio :label="3">三级护理</el-radio>
                        </el-radio-group>
                     </p>
                  </div>
                  <!-- 意识状态 -->
                  <div class="clearfix rideo">
                     <p class="float">
                        <el-radio-group v-model="form.consciousness" :disabled="!viewFlag">
                           <span class="size">意识状态：</span>
                           <el-radio
                              v-for="state in consciousness"
                              :label="state.value"
                              :key="state.value"
                           >{{state.label}}</el-radio>
                        </el-radio-group>
                     </p>
                     <p class="float">
                        <span class="size">意识状态记录时间：</span>
                        <el-date-picker
                           v-model="form.consciousnessTime"
                           type="datetime"
                           placeholder="选择日期时间"
                           value-format="yyyy-MM-dd HH:mm:ss"
                           :disabled="!viewFlag"
                        ></el-date-picker>
                     </p>
                  </div>
                  <!-- 精神状态 -->
                  <div class="clearfix rideo">
                     <p class="float">
                        <el-radio-group
                           v-model="form.mentality"
                           class="rideo"
                           :disabled="!viewFlag"
                        >
                           <span class="size">精神状态：</span>
                           <el-radio
                              v-for="state in spirit"
                              :label="state.value"
                              :key="state.value"
                           >{{state.label}}</el-radio>
                        </el-radio-group>
                     </p>
                     <p class="float">
                        <span class="size">精神状态记录时间：</span>
                        <el-date-picker
                           v-model="form.mentalityTime"
                           type="datetime"
                           placeholder="选择日期时间"
                           value-format="yyyy-MM-dd HH:mm:ss"
                           :disabled="!viewFlag"
                        ></el-date-picker>
                     </p>
                  </div>
                  <!-- 活动能力 -->
                  <div class="clearfix rideo">
                     <p class="float">
                        <template>
                           <el-radio-group
                              v-model="form.activityAbility"
                              class="rideo"
                              :disabled="!viewFlag"
                           >
                              <span class="size">活动能力：</span>
                              <el-radio
                                 v-for="state in activity"
                                 :label="state.value"
                                 :key="state.value"
                              >{{state.label}}</el-radio>
                           </el-radio-group>
                        </template>
                     </p>
                     <p class="float">
                        <span class="size">活动能力记录时间：</span>
                        <el-date-picker
                           v-model="form.activityAbilityTime"
                           type="datetime"
                           placeholder="选择日期时间"
                           value-format="yyyy-MM-dd HH:mm:ss"
                           :disabled="!viewFlag"
                        ></el-date-picker>
                     </p>
                  </div>
                  <!-- 脱管原因 -->
                  <div>
                     <p>
                        <span class="size">五.脱管原因</span>
                     </p>
                     <p style="margin-left:20px">
                        <template>
                           <!-- <el-checkbox-group v-model="pipingCausesOfSlippage">
                              <el-checkbox
                                 v-for="state in control"
                                 :label="state.value"
                                 :key="state.value"
                              >{{state.label}}</el-checkbox>
                           </el-checkbox-group>-->
                           <el-radio-group
                              v-model="form.pipingCausesOfSlippage"
                              :disabled="!viewFlag"
                           >
                              <!-- <span class="size">活动能力：</span> -->
                              <el-radio
                                 v-for="state in control"
                                 :label="state.value"
                                 :key="state.value"
                              >{{state.label}}</el-radio>
                           </el-radio-group>
                        </template>
                     </p>
                  </div>
                  <!-- 固定法 -->
                  <div class="clearfix">
                     <p>
                        <span class="size">六.固定法</span>
                     </p>
                     <p class="float rideo">
                        <!-- <el-checkbox-group v-model="pipingFixedMethod">
                           <el-checkbox
                              v-for="state in fixed"
                              :label="state.value"
                              :key="state.value"
                           >{{state.label}}</el-checkbox>
                        </el-checkbox-group>-->
                        <el-radio-group v-model="form.pipingFixedMethod" :disabled="!viewFlag">
                           <!-- <span class="size">活动能力：</span> -->
                           <el-radio
                              v-for="state in fixed"
                              :label="state.value"
                              :key="state.value"
                           >{{state.label}}</el-radio>
                        </el-radio-group>
                     </p>
                     <!-- <p class="float" style="position: relative;top:5px">
                        <span class="size">其他：</span>
                        <el-input v-model="form.fixedInput" style="width:100px"></el-input>
                     </p>-->
                  </div>
                  <!-- 相关因素 -->
                  <div class="rideo">
                     <p>
                        <span class="size">七.相关因素</span>
                     </p>
                     <p>
                        <template>
                           <span class="size" style="display:inline-block;width:160px">健康宣传：</span>
                           <el-radio-group v-model="form.healthEducation" :disabled="!viewFlag">
                              <el-radio :label="0">未做</el-radio>
                              <el-radio :label="1">已做</el-radio>
                           </el-radio-group>
                           <span style="padding-left:30px" class="size">宣教时间：</span>
                           <el-date-picker
                              v-model="form.healthEducationTime"
                              type="datetime"
                              placeholder="选择日期时间"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              :disabled="!viewFlag"
                           ></el-date-picker>
                        </template>
                     </p>
                     <p>
                        <span class="size" style="display:inline-block;width: 160px;">约束带使用：</span>
                        <el-radio-group v-model="form.restraintZone" :disabled="!viewFlag">
                           <el-radio :label="0">无</el-radio>
                           <el-radio :label="1">有</el-radio>
                        </el-radio-group>
                        <span style="padding-left:30px" class="size">约束时间：</span>
                        <el-date-picker
                           v-model="form.restraintZoneTime"
                           type="datetime"
                           placeholder="选择日期时间"
                           value-format="yyyy-MM-dd HH:mm:ss"
                           :disabled="!viewFlag"
                        ></el-date-picker>
                     </p>
                     <p>
                        <span class="size" style="display:inline-block;">管路滑脱时工作人员：</span>
                        <el-radio-group v-model="form.ifSomeone" :disabled="!viewFlag">
                           <el-radio :label="0">不在患者身边</el-radio>
                           <el-radio :label="1">在患者身边</el-radio>
                        </el-radio-group>
                     </p>
                  </div>
                  <!-- 处理 -->
                  <div class="clearfix rideo">
                     <p>
                        <span class="size">八.处理</span>
                     </p>
                     <p class="float">
                        <template>
                           <el-checkbox-group
                              v-model="pipingTreatmentMeasures"
                              :disabled="!viewFlag"
                           >
                              <el-checkbox
                                 v-for="state in handle"
                                 :label="state.value"
                                 :key="state.value"
                              >{{state.label}}</el-checkbox>
                           </el-checkbox-group>
                        </template>
                     </p>
                     <p class="float" style="position: relative;top:4px">
                        <template>
                           <el-checkbox v-model="form.medicine" :disabled="!viewFlag">药物</el-checkbox>
                           <span class="size">药物名称：</span>
                           <el-input
                              v-model="form.medicineName"
                              style="width:120px"
                              :disabled="!viewFlag"
                           ></el-input>
                        </template>
                     </p>
                  </div>
                  <!-- 并发症 -->
                  <div class="clearfix rideo">
                     <p>
                        <span class="size">九.并发症</span>
                     </p>
                     <p class="float">
                        <template>
                           <el-checkbox-group
                              v-model="pipelineSlipComplication"
                              :disabled="!viewFlag"
                           >
                              <el-checkbox
                                 :label="state.value"
                                 v-for="state in complication"
                                 :key="state.value"
                              >{{state.label}}</el-checkbox>
                           </el-checkbox-group>
                        </template>
                     </p>
                     <p class="float" style="position: relative;top:5px">
                        <span class="size">并发症描述：</span>
                        <el-input
                           v-model="form.complicationDescribe"
                           style="width:120px"
                           :disabled="!viewFlag"
                        ></el-input>
                     </p>
                  </div>
               </td>
            </tr>
         </tbody>
      </table>
      <div style="margin:10px 0;padding-left:20px" class="clearfix">
         <!-- <p class="float" style="margin:0">
            <span class="size">科室：</span>
            <el-input v-model="form.deptId" style="width:120px"></el-input>
         </p>-->
         <p class="float" v-if="true">
            <span style="padding-left:10px;" class="size">填表人：</span>
            <el-input v-model="form.filler" style="width:120px" :disabled="true"></el-input>
         </p>
         <p class="float">
            <span style="padding-left:10px" class="size">填表日期：</span>
            <el-date-picker
               v-model="form.fillerDate"
               type="datetime"
               placeholder="选择日期时间"
               :disabled="!viewFlag"
               value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
         </p>
      </div>
      <div class="operation">
         <el-button @click="sub()" class="el-button el-button--primary" v-if="viewFlag">提交</el-button>
         <el-button @click="close()">返回</el-button>
      </div>
   </div>
</template>

<script>
import {
   uexDic,
   uexSub,
   slippagDataBack,
   connected,
   uexOpen,
   putObj
} from "@/api/icu/patient/pipelineStatus";
import { dateFormat, calcDate } from "@/util/date";

export default {
   name: "uex",
   props: {
      patientInfos: Object,
      dicDatas: Array,
      catheterName: Array,
      Piprow: Object
   },

   watch: {
      patientInfos: {
         handler(newValue, oldValue) {
            // console.log(newValue);
            this.patientInfos = newValue;
            this.close();
            this.formData();
         },
         deep: true
      }

      // 导管类型
      // form: {
      //    handler(newValue, oldValue) {
      //       if (newValue.pipingDescribe != "") {
      //          // this.form.pipingId = 9999;
      //          this.form.pipingName = "";
      //       } else {
      //          this.form.pipingId = this.pipingId;
      //          this.form.pipingName = this.pipingName;
      //       }
      //    },
      //    deep: true
      // }
   },
   data() {
      return {
         // 患者id
         patientId: "13213",
         // 导管类型
         pipingNames: [],
         pipingId: "",
         pipingName: "",
         //意识状态
         consciousness: [
            { label: "清醒", value: 0 },
            { label: "嗜睡", value: 1 },
            { label: "朦胧", value: 2 },
            { label: "躁动", value: 3 }
         ],
         // 精神状态
         spirit: [
            { label: "平静", value: 0 },
            { label: "烦躁", value: 1 },
            { label: "焦虑", value: 2 },
            { label: "恐惧", value: 3 }
         ],
         activity: [
            { label: "行动正常", value: 0 },
            { label: "使用助行器", value: 1 },
            { label: "残肢", value: 2 },
            { label: "无法行动", value: 3 }
         ],
         // 脱管原因
         control: [],
         pipingCausesOfSlippage: [],
         // 固定法
         fixed: [],
         pipingFixedMethod: [],
         // 处理
         pipingTreatmentMeasures: [],
         // 并发症
         complication: [],
         pipelineSlipComplication: [],
         healthy: ["已做", "未做"],
         handle: [],
         // 字典 type+
         dicList: [],
         form: {
            patientId: "",
            patientName: "",
            hospitalnumber: "",
            gender: "",
            age: "",
            diagnosis: "",
            // 学历程度
            educationLevel: "",
            // 管道类型
            pipingDescribe: "",
            // pipingName: "",
            pipingId: "",
            // 护理级别
            nursingLevel: "",
            // 意识状态
            consciousness: "",
            consciousnessTime: "",
            activityAbilityTime: "",
            // 发生时间
            pipingSlippageTime: dateFormat(new Date()),
            // 置管时间
            pipingStartTime: "",
            // 手术日期
            operationTime: "",

            mentality: "",
            mentalityTime: "",
            // 活动能力
            activityAbility: "",
            activityInput: "",
            // 脱管原因
            pipingCausesOfSlippage: "",
            // 固定法
            pipingFixedMethod: "",
            // 固定法 -> 其他
            // fixedInput: "",
            factorList: [],
            // 健康宣教
            healthEducation: "",
            healthEducationTime: "",
            // 约束带
            restraintZone: "",
            restraintZoneTime: "",
            // 是否有工作人员
            ifSomeone: "",
            // 处理
            pipingTreatmentMeasures: "",
            // 处理 -> 药物名称
            medicine: "",
            medicineName: "",
            // 并发症
            pipelineSlipComplication: "",
            complicationDescribe: "",
            filler: "",
            deptId: "",
            fillerDate: dateFormat(new Date())
         },
         // 学历程度
         description: "",
         eduList: [],
         viewFlag: true
      };
   },
   mounted() {
      // console.log(this.Piprow);
      let parmars = {};
      if (this.Piprow) {
         // 登记表编辑查看时操作
         parmars = { patientId: this.Piprow.patientId };
         this.getPatData();
      } else {
         parmars = { patientId: this.patientInfos.patientId };
         this.formData();
      }
      this.getList(parmars);
   },
   methods: {
      
      getList(parmars) {
         uexOpen(parmars).then(response => {
            this.dicList = response.data.data.dictionaries;
            this.pipingNames = response.data.data.pipingVos;
            // 请求字典表中的数据
            this.dicList.forEach(item => {
               if (item == "education_level") {
                  var education_level = this.dicUrl(item);
                  education_level.then(value => {
                     this.education(value);
                  });
               } else if (item == "piping_causes_of_slippage") {
                  var piping_causes_of_slippage = this.dicUrl(item);
                  piping_causes_of_slippage.then(value => {
                     this.causes(value);
                  });
               } else if (item == "piping_fixed_method") {
                  var piping_fixed_method = this.dicUrl(item);
                  piping_fixed_method.then(value => {
                     this.pipingFixed(value);
                  });
               } else if (item == "piping_treatment_measures") {
                  var piping_treatment_measures = this.dicUrl(item);
                  piping_treatment_measures.then(value => {
                     this.treatment(value);
                  });
               } else if (item == "complication_describe") {
                  var complication_describe = this.dicUrl(item);
                  complication_describe.then(value => {
                     this.describe(value);
                  });
               }
            });
         });
      },
      // 修改数据回填
      getPatData() {
         this.form = this.Piprow;
         // 提交按钮是否显示
         if (this.Piprow.viewFlag) {
            this.viewFlag = true;
         } else {
            this.viewFlag = false;
         }
         this.form.pipingId = this.Piprow.pipingId;
         this.pipingId = this.form.pipingId;
         this.pipingNames.forEach(i => {
            if (i.pipingId == this.pipingId) {
               this.form.pipingDescribe = i.pipingName;
            }
         });
         // console.log(this.form.pipingId)
         if (this.form.medicine) {
            this.form.medicine = true;
         } else {
            this.form.medicine = false;
         }
         this.form.ifSomeone = parseInt(this.Piprow.ifSomeone);

         // console.log(this.form.pipingCausesOfSlippage[0]);
         this.pipingCausesOfSlippage = this.form.pipingCausesOfSlippage;
         this.pipingFixedMethod = this.form.pipingFixedMethod;
         if (this.form.pipingTreatmentMeasures) {
            this.pipingTreatmentMeasures = this.form.pipingTreatmentMeasures.split(",")
         }
         if (this.form.pipelineSlipComplication) {
            this.pipelineSlipComplication = this.form.pipelineSlipComplication.split(",")
         }
         
         // if (parseInt(this.form.pipingCausesOfSlippage[0])) {
         //    this.pipingCausesOfSlippage = this.form.pipingCausesOfSlippage
         //       .split(",")
         //       .map(Number);
         // }
         // if (parseInt(this.form.pipingFixedMethod[0])) {
         //    this.pipingFixedMethod = this.form.pipingFixedMethod
         //       .split(",")
         //       .map(Number);
         // }
         // if (parseInt(this.form.pipingTreatmentMeasures[0])) {
         //    this.pipingTreatmentMeasures = this.form.pipingTreatmentMeasures
         //       .split(",")
         //       .map(Number);
         // }
         // if (parseInt(this.form.pipelineSlipComplication[0])) {
         //    this.pipelineSlipComplication = this.form.pipelineSlipComplication
         //       .split(",")
         //       .map(Number);
         // }
      },
      // 管路新增时
      formData() {
         // 置管时间
         this.form.pipingStartTime = this.patientInfos.rawDatastartTime;
         this.form.patientName = this.patientInfos.name;
         this.form.hospitalnumber = this.patientInfos.hospitalnumber;
         this.form.age = this.patientInfos.age;
         this.form.gender = this.patientInfos.gender;
         this.form.diagnosis = this.patientInfos.diagnosis;
         // 患者id
         this.form.patientId = this.patientInfos.patientId;
         // 管道id
         this.form.pipingId = this.patientInfos.pipingId;

         this.pipingId = this.patientInfos.pipingId;
         // this.form.pipingName = this.patientInfos.pipingName;
         this.pipingName = this.patientInfos.pipingName;
         this.form.pipingDescribe = this.patientInfos.pipingName;
         this.form.pipingFixedMethod = this.patientInfos.fixed;
      },
      // 同步请求
      dicUrl(item) {
         return new Promise((resolve, reject) => {
            uexDic(item)
               .then(response => {
                  let data = response.data.data;
                  // console.log(data);
                  resolve(data);
               })
               .catch(error => {
                  reject(error);
               });
         });
      },
      // 学历程度
      education(value) {
         value.forEach(item => {
            this.description = item.description;
            this.eduList.push(
               Object.assign({ label: item.label, value: Number(item.value) })
            );
         });
      },
      // 脱管原因
      causes(value) {
         value.forEach(item => {
            this.control.push(
               Object.assign({ label: item.label, value: item.value })
            );
         });
      },
      // 固定法
      pipingFixed(value) {
         // console.log(value);
         value.forEach(item => {
            this.fixed.push(
               Object.assign({ label: item.label, value: item.value })
            );
         });
      },
      // 处理
      treatment(value) {
         value.forEach(item => {
            this.handle.push(
               Object.assign({ label: item.label, value: item.value })
            );
         });
      },
      // 并发症
      describe(value) {
         value.forEach(item => {
            this.complication.push(
               Object.assign({ label: item.label, value: item.value })
            );
         });
      },
      close() {
         // this.eduList = [];
         // this.control = [];
         // this.fixed = [];
         // this.handle = [];
         // this.complication = [];
         
         if (this.Piprow) {
            this.$emit("fatherMethod");
         }else{
            this.$parent.parentMethod();
         }
      },
      sub() {
         // console.log(this.form);
         // 用药
         if (this.form.medicine) {
            this.form.medicine = 1;
         } else {
            this.form.medicine = 0;
         }
         // this.form.pipingCausesOfSlippage = this.pipingCausesOfSlippage.join(
         //    ","
         // );
         // this.form.pipingFixedMethod = this.pipingFixedMethod.join(",");
         this.form.pipingTreatmentMeasures = this.pipingTreatmentMeasures.join(
            ","
         );
         this.form.pipelineSlipComplication = this.pipelineSlipComplication.join(
            ","
         );
         // console.log(this.form);
         var form = this.form;
         this.$confirm(
            "是否提交患者“" + this.form.patientName + "”管路滑脱登记表?",
            {
               confirmButtonText: "确定",
               cancelButtonText: "取消",
               type: "warning",
               dialogFormVisible: true
            }
         )
            .then(() => {
               if (this.Piprow) {
                  putObj(form);
               } else {
                  uexSub(form);
               }
            })
            .then(() => {
               this.$message({
                  showClose: true,
                  message: "提交成功",
                  type: "success"
               });
               this.close();
            })
            .catch(() => {
               console.log("uex登记表提交失败");
            });
      }
   },
   filters: {
      sex: data => {
         switch (data) {
            case "0":
               return "女";

            case "1":
               return "男";

            default:
         }
      }
   }
};
</script>
<style  lang="scss">
.uex {
   .el-input__inner {
      border-top: 0;
      border-left: 0;
      border-right: 0;
      border-radius: 0;
   }
}
.uex .table-bordered th,
.uex .table-bordered td,
.uex .table-bordered tr {
   border: 1px solid #ebeef5;
   text-align: left;
   span {
      font-size: 14px;
   }
   div {
      margin: 10px 0;
   }
}
.uex .size {
   font-size: 16px !important;
   font-weight: 530;
   padding-left: 10px;
}
.uex .table-bordered td {
   padding: 15px 20px;
}
.operation {
   text-align: center;
   padding: 50px 0;
   background-color: #fff !important;
}
.operation button:last-child {
   margin-left: 30px;
}
.uex .el-checkbox {
   color: #606266;
   font-weight: 500;
   font-size: 14px !important;
   margin: 10px;
}
.uex .rideo .el-radio {
   margin: 10px;
   width: 95px;
}
.uex .float {
   float: left;
}
.clearfix:after {
   content: "";
   display: table;
   clear: both;
}
.uex .panel-title {
   font-size: 16px;
   font-weight: 600;
   float: left;
   margin-right: 15px;
   line-height: 30px;
   margin-bottom: 30px;
}
</style>


