<template>
   <!-- 难免压疮申报表 -->
   <div>
      <div style="overflow-x: auto;" class="PreDeclaration">
         <div>
            <h3 class="panel-title">难免压疮申报表</h3>
            <el-button @click="close()" type="primary">返回</el-button>
         </div>
         <table class="table table-bordered">
            <tbody>
               <tr>
                  <td>床号</td>
                  <td>姓名</td>
                  <td>性别</td>
                  <td>年龄</td>
                  <td>住院号</td>
               </tr>
               <tr>
                  <td>{{message.bedName}}</td>
                  <td>{{message.patientName}}</td>
                  <td>{{message.gender | sex}}</td>
                  <td>{{message.age}}</td>
                  <td>{{message.hospitalnumber}}</td>
               </tr>
               <tr class="left">
                  <td colspan="3">
                     <span class="width1">入院时间：</span>
                     <el-date-picker
                        v-model="form.timeOfAdmission"
                        type="datetime"
                        placeholder="选择日期时间"
                        class="width"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :picker-options="pickerOptions"
                        :disabled="flagnum == 3"
                     ></el-date-picker>
                  </td>
                  <td colspan="4">
                     <span class="width1">申报人：</span>
                     <el-input v-model="form.declarer" class="width" :disabled="flagnum == 3"></el-input>
                  </td>
               </tr>
               <tr class="left">
                  <td colspan="3">
                     <span class="width1">申报时间：</span>
                     <el-date-picker
                        v-model="form.declareTime"
                        type="datetime"
                        placeholder="选择日期时间"
                        class="width"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :picker-options="pickerOptions"
                        :disabled="flagnum == 3"
                     ></el-date-picker>
                  </td>
                  <td colspan="4">
                     <span class="width1">诊断：</span>
                     <el-input v-model="form.diagnosis" class="width" :disabled="flagnum == 3"></el-input>
                  </td>
               </tr>
               <tr class="left">
                  <td colspan="7">
                     <span>护理级别：</span>
                     <template>
                        <el-radio-group v-model="form.nursingLevel" :disabled="flagnum == 3">
                           <el-radio :label="0">特级</el-radio>
                           <el-radio :label="1">I 级</el-radio>
                           <el-radio :label="2">II 级</el-radio>
                           <el-radio :label="3">III 级</el-radio>
                        </el-radio-group>
                     </template>
                  </td>
               </tr>
               <tr class="left">
                  <td colspan="7">
                     <span class="weight">申报理由：</span>
                     <el-checkbox-group v-model="declareReason" :disabled="flagnum == 3">
                        <el-checkbox
                           v-for="state in declareReasons"
                           :label="state.value"
                           :key="state.value"
                        >{{state.label}}</el-checkbox>
                     </el-checkbox-group>
                     <br />
                     <span class="weight">注：符合难免压疮申报基本条件是具备并存条件至少2项或以上，才能申报。</span>
                  </td>
               </tr>
               <tr class="left">
                  <td colspan="7">
                     <div style="display:flex;align-items:center;flex-wrap: wrap;">
                        <span>采取预防护理措施：</span>
                        <el-radio-group
                           v-model="form.preventiveNursingMeasures"
                           :disabled="flagnum == 3"
                        >
                           <el-radio
                              :label="state.value"
                              v-for="state in preventiveNursingMeasures"
                              :key="state.value"
                              style="display:flex"
                           >{{state.label}}</el-radio>
                        </el-radio-group>
                     </div>
                  </td>
               </tr>
               <tr class="left">
                  <td colspan="3">
                     <span class="width1">压疮发生时间：</span>
                     <el-date-picker
                        v-model="form.occurrenceTime"
                        type="datetime"
                        placeholder="选择日期时间"
                        class="width"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :picker-options="pickerOptions"
                        :disabled="flagnum == 3"
                     ></el-date-picker>
                  </td>
                  <td colspan="4">
                     <span class="width1">压疮面积：</span>
                     <el-input v-model="form.soreRange" class="width" :disabled="flagnum == 3"></el-input>
                  </td>
               </tr>
               <tr class="left">
                  <td colspan="5">
                     <div style="display:flex;align-items:center;flex-wrap: wrap;">
                        <span style="width:95px">压疮部位：</span>
                        <el-radio-group v-model="form.prePosition" :disabled="flagnum == 3">
                           <el-radio
                              v-for="state in prePosition"
                              :label="state.value"
                              :key="state.value"
                           >{{state.label}}</el-radio>
                        </el-radio-group>
                     </div>
                  </td>
               </tr>
               <tr class="left">
                  <td colspan="5">
                     <div style="display:flex;align-items:center;flex-wrap: wrap;">
                        <span style="width:90px">压疮分期：</span>
                        <el-radio-group v-model="form.byStages" :disabled="flagnum == 3">
                           <el-radio
                              v-for="state in byStages"
                              :label="state.value"
                              :key="state.value"
                              style="display:flex"
                           >{{state.label}}：{{state.description}}</el-radio>
                        </el-radio-group>
                     </div>
                  </td>
               </tr>
               <tr class="left">
                  <td colspan="7">
                     <div style="display:flex;align-items:center;flex-wrap: wrap;">
                        <p>
                           <span>责任护士签名：</span>
                           <el-input
                              v-model="form.responsibleNurse"
                              style="width:150px"
                              :disabled="flagnum == 3"
                              @blur="responsibleNurseBlur"
                           ></el-input>
                        </p>
                        <p>
                           <span>责任护士签名时间：</span>
                           <el-date-picker
                              v-model="form.responsibleNurseTime"
                              type="datetime"
                              placeholder="选择日期时间"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              :disabled="flagnum == 3"
                              :picker-options="pickerOptions"
                           ></el-date-picker>
                        </p>
                        <p>
                           <span>护士长签名：</span>
                           <el-input
                              v-model="form.headNurse"
                              style="width:150px"
                              :disabled="flagnum == 3"
                           ></el-input>
                        </p>
                     </div>
                  </td>
               </tr>
               <tr class="left">
                  <td colspan="7">
                     <span>上级部门审核意见：</span>
                     <br />
                     <br />
                     <div style="display:flex;align-items:center;flex-wrap: wrap;">
                        <p>
                           <span style="padding:0 16px 0 10px">科护士长签名：</span>
                           <el-input
                              v-model="form.deptHeadNurse"
                              style="width:150px"
                              @blur="deptHeadNurseBlur"
                              :disabled="flagnum == 3"
                           ></el-input>
                        </p>
                        <p>
                           <span style="padding-left:10px">科护士签名时间：</span>
                           <el-date-picker
                              v-model="form.deptHeadNurseTime"
                              type="datetime"
                              placeholder="选择日期时间"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              :picker-options="pickerOptions"
                              :disabled="flagnum == 3"
                           ></el-date-picker>
                        </p>
                        <p>
                           <span style="padding-left:10px">难免压疮申报条件：</span>
                           <el-radio-group
                              v-model="form.deptHeadNurseDeclare"
                              :disabled="flagnum == 3"
                           >
                              <el-radio :label="0">是</el-radio>
                              <el-radio :label="1">否</el-radio>
                           </el-radio-group>
                        </p>
                     </div>
                     <div style="display:flex;align-items:center;flex-wrap: wrap;">
                        <p>
                           <span style="padding-left:10px">伤口管理组签名：</span>
                           <el-input
                              v-model="form.woundManagementGroup"
                              style="width:150px"
                              @blur="woundManagementGroupBlur"
                              :disabled="flagnum == 3"
                           ></el-input>
                        </p>
                        <p>
                           <span style="padding-left:10px">伤口管理时间：</span>
                           <el-date-picker
                              v-model="form.woundManagementGroupTime"
                              type="datetime"
                              placeholder="选择日期时间"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              :picker-options="pickerOptions"
                              :disabled="flagnum == 3"
                           ></el-date-picker>
                        </p>
                        <p>
                           <span style="padding-left:10px">难免压疮申报条件：</span>
                           <el-radio-group
                              v-model="form.woundManagementGroupDeclare"
                              :disabled="flagnum == 3"
                           >
                              <el-radio :label="1">是</el-radio>
                              <el-radio :label="2">否</el-radio>
                           </el-radio-group>
                        </p>
                     </div>
                  </td>
               </tr>

               <tr class="left">
                  <td colspan="7">
                     <el-radio-group
                        v-model="form.pressureSoreOutcome"
                        style="position:relative;top:5px"
                     >
                        <span class="weight">压疮转归情况：</span>
                        <el-radio :label="1" :disabled="flagnum == 3">未发生</el-radio>
                        <el-radio :label="2" :disabled="flagnum == 3">发生</el-radio>
                        <span>（</span>
                        <el-radio-group
                           v-model="form.pressureSoreOutcome"
                           style="position:relative;top:-5px"
                        >
                           <el-radio :label="3" :disabled="flagnum == 3">治愈</el-radio>
                           <el-radio :label="4" :disabled="flagnum == 3">好转</el-radio>
                           <el-radio :label="5" :disabled="flagnum == 3">未愈合</el-radio>
                        </el-radio-group>
                        <span>）</span>
                     </el-radio-group>
                  </td>
               </tr>

               <tr class="left">
                  <td colspan="7">
                     <span style="padding-left:10px">护理部签名：</span>
                     <el-input
                        v-model="form.nursingDepartment"
                        style="width:150px"
                        @blur="nursingDepartmentBlur"
                        :disabled="flagnum == 3"
                     ></el-input>
                     <span style="padding-left:10px">日期：</span>
                     <el-date-picker
                        v-model="form.nursingDepartmentTime"
                        type="datetime"
                        placeholder="选择日期时间"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :picker-options="pickerOptions"
                        :disabled="flagnum == 3"
                     ></el-date-picker>
                  </td>
               </tr>
               <tr class="left">
                  <td colspan="7">
                     <span class="weight">备注：</span>
                     <p
                        style="padding-left:10px"
                     >1、高危病人发生压疮时，病区护士长即在24小时填写此单，并电话通知科护士长、伤口管理组组长负责难免压疮的会诊及定性。</p>
                     <p style="padding-left:10px">2、发生难免性压疮后的病人，记录《伤口观察记录单》。</p>
                     <p style="padding-left:10px">3、填写时一式二份，一份交科护士长汇总护理部；一份科室留档。</p>
                  </td>
               </tr>
            </tbody>
         </table>
      </div>
      <div style="text-align:center;margin:20px 0px">
         <el-button @click="sub()" class="el-button el-button--primary" v-if="subFlag" :disabled="flagnum == 3">提交</el-button>
         <el-button @click="reset()" :disabled="flagnum == 3">重置</el-button>
         <el-button @click="close()">返回</el-button>
      </div>
   </div>
</template>

<script>
import { preDic, subForm, query } from "@/api/icu/patient/PreDeclaration";
import {
   delObj,
   fetchList,
   UpdateObj,
   recordDic
} from "@/api/icu/assessment/pressureListRecords";
import { upDateProcess } from "@/api/icu/patient/process";
import { dateFormat } from "@/util/date";
export default {
   name: "PreDeclaration",
   props: {
      message: Object,
      changeflag: Function,
      flagnum: Number
   },
   data() {
      return {
         // 申报理由
         declareReasons: [],
         declareReason: [],
         // 采取预防护理措施
         preventiveNursingMeasures: [],
         // 部位
         prePosition: [],
         byStages: [],
         form: {
            bedName: "",
            patientId: "",
            patientName: "",
            gender: "",
            age: "",
            hospitalnumber: "",
            timeOfAdmission: "",
            declareTime: "",
            declarer: "",
            diagnosis: "",
            nursingLevel: "",
            declareReason: "",
            preventiveNursingMeasures: "",

            // 压疮情况
            occurrenceTime: "",
            soreRange: "",
            prePosition: "",
            byStages: "",
            pressureSoreOutcome: "",
            responsibleNurse: "",
            responsibleNurseTime: "",
            headNurse: "",
            deptHeadNurseTime: "",
            deptHeadNurse: "",
            deptHeadNurseDeclare: "",

            woundManagementGroup: "",
            woundManagementGroupTime: "",
            woundManagementGroupDeclare: "",

            nursingDepartment: "",
            nursingDepartmentTime: ""
         },
         pickerOptions: {
            disabledDate(time) {
               return time.getTime() > Date.now();
            }
         },
         subFlag: true
      };
   },
   created() {
      this.getDic();
      this.dataBackFilling();
   },
   methods: {
      // 数据回填
      dataBackFilling() {
         this.form = this.message;
         this.declareReason = this.form.declareReason.split(",");
         for(let i  in this.declareReason){
            this.declareReason[i] = parseInt(this.declareReason[i])
         }
         this.form.pressureSoreOutcome = parseInt(this.form.pressureSoreOutcome)
         this.form.preventiveNursingMeasures = parseInt(this.form.preventiveNursingMeasures)
         
      },
      getDic() {
         recordDic("pre_position").then(response => {
            response.data.data.forEach(item => {
               this.prePosition.push(
                  Object.assign({ label: item.label, value: item.value })
               );
            });
         });
         recordDic("by_stages").then(response => {
            response.data.data.forEach(item => {
               this.byStages.push(
                  Object.assign({
                     label: item.label,
                     value: Number(item.value),
                     description: item.description
                  })
               );
            });
         });
         recordDic("preventive_nursing_measures").then(response => {
            response.data.data.forEach(item => {
               this.preventiveNursingMeasures.push(
                  Object.assign({
                     label: item.label,
                     value: Number(item.value),
                     description: item.description
                  })
               );
            });
         });
         recordDic("declare_reason").then(response => {
            response.data.data.forEach(item => {
               this.declareReasons.push(
                  Object.assign({
                     label: item.label,
                     value: Number(item.value),
                     description: item.description
                  })
               );
            });
         });
      },
      // 责任护士签名：
      responsibleNurseBlur() {
         if (this.form.responsibleNurse != "") {
            this.form.responsibleNurseTime = dateFormat(new Date());
         }
      },
      // 科护士
      deptHeadNurseBlur() {
         if (this.form.deptHeadNurse != "") {
            this.form.deptHeadNurseTime = dateFormat(new Date());
         }
      },
      // 伤口管理组
      woundManagementGroupBlur() {
         if (this.form.woundManagementGroup != "") {
            this.form.woundManagementGroupTime = dateFormat(new Date());
         }
      },
      nursingDepartmentBlur() {
         if (this.form.nursingDepartment != "") {
            this.form.nursingDepartmentTime = dateFormat(new Date());
         }
      },
      close() {
         this.reset();
         this.changeflag(this.message);
      },
      reset() {
         this.declareReason = [];
         this.form.timeOfAdmission = "";
         this.form.declareTime = "";
         this.form.declarer = "";
         this.form.diagnosis = "";
         this.form.nursingLevel = "";
         this.form.declareReason = "";
         this.form.preventiveNursingMeasures = "";

         // 压疮情况
         this.form.occurrenceTime = "";
         this.form.soreRange = "";
         this.form.prePosition = "";
         this.form.byStages = "";

         this.form.responsibleNurse = "";
         this.form.responsibleNurseTime = "";
         this.form.headNurse = "";
         this.form.deptHeadNurseTime = "";
         this.form.deptHeadNurse = "";
         this.form.deptHeadNurseDeclare = "";

         this.form.woundManagementGroup = "";
         this.form.woundManagementGroupTime = "";
         this.form.woundManagementGroupDeclare = "";
         this.form.pressureSoreOutcome = "";
         this.form.nursingDepartment = "";
         this.form.nursingDepartmentTime = "";
      },
      sub() {
         this.form.declareReason = this.declareReason.join(",");
         this.form.patientName = this.message.patientName;
         // console.log(this.form.declareReason);
         switch ("") {
            case this.form.declarer:
               this.$message({
                  message: "请填写申报人",
                  type: "warning"
               });
               break;
            case this.form.declarerTime:
               this.$message({
                  message: "请选择申报时间",
                  type: "warning"
               });
               break;
            case this.form.nursingLevel:
               this.$message({
                  message: "请选择护理级别",
                  type: "warning"
               });
               break;

            case this.form.declareReasonl:
               this.$message({
                  message: "请选择申报理由",
                  type: "warning"
               });
               break;
            case this.form.preventiveNursingMeasures:
               this.$message({
                  message: "请选择预防护理措施",
                  type: "warning"
               });
               break;
            case this.form.prePosition:
               this.$message({
                  message: "请选择压疮部位",
                  type: "warning"
               });
               break;
            case this.form.byStages:
               this.$message({
                  message: "请选择压疮分期",
                  type: "warning"
               });
               break;
            case this.form.soreRange:
               this.$message({
                  message: "请选择填写压疮面积",
                  type: "warning"
               });
               break;

            default:
               this.$confirm(
                  "是否提交患者“" +
                     this.form.patientName +
                     "”难免压疮申报表?",
                  {
                     confirmButtonText: "确定",
                     cancelButtonText: "取消",
                     type: "warning",
                     dialogFormVisible: true
                  }
               )
                  .then(() => {
                     return UpdateObj(this.form);
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
                     console.log("压疮难免申报表失败");
                  });
         }
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
.PreDeclaration {
   .el-input__inner {
      border-top: 0;
      border-left: 0;
      border-right: 0;
      border-radius: 0;
   }
   .el-upload--picture-card {
      width: 50px;
      height: 50px;
      line-height: 60px;
   }
}
.PreDeclaration .table-bordered th,
.PreDeclaration .table-bordered td,
.PreDeclaration .table-bordered tr {
   border: 1px solid #ebeef5;
   span {
      font-size: 16px;
   }
   p {
      margin: 20px 10px;
   }
}
.left {
   text-align: left;
}

.PreDeclaration .table-bordered td {
   padding: 10px;
}
.PreDeclaration .width {
   width: 60%;
}
.PreDeclaration .width1 {
   display: inline-block;
   width: 120px;
}

.PreDeclaration .el-checkbox {
   color: #606266;
   font-weight: 500;
   font-size: 14px !important;
   margin: 10px;
}
.PreDeclaration .el-radio {
   margin: 10px;
}
.PreDeclaration .weight {
   font-weight: 600;
   font-size: 16px;
}
.PreDeclaration .panel-title {
   font-size: 16px;
   font-weight: 600;
   float: left;
   margin-right: 15px;
   line-height: 30px;
   margin-bottom: 30px;
}
</style>


