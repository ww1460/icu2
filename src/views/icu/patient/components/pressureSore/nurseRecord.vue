<template>
   <!-- 压疮护理记录单 -->
   <div>
      <div class="nurseRecord">
         <div>
            <h3 class="panel-title">压疮护理记录单</h3>
            <el-button @click="close()">返回</el-button>
         </div>
         <table class="table table-bordered">
            <tr>
               <td style="width:20%">
                  <span class="size">姓名：</span>
                  {{form.patientName}}
               </td>
               <td>
                  <span class="size">床号：</span>
                  {{form.bedName}}
               </td>
               <td>
                  <span class="size">性别：</span>
                  {{form.gender|sex}}
               </td>
               <td>
                  <span class="size">年龄：</span>
                  {{form.age}}
               </td>
            </tr>
            <tr>
               <td colspan="2">
                  <span class="size">住院号：</span>
                  {{form.hospitalnumber}}
               </td>
               <td colspan="2">
                  <span class="size">评估结果：</span>
                  {{form.assessmentResults}}
               </td>
            </tr>
            <tr>
               <td colspan="1">
                  <span class="size">压疮分期：</span>
               </td>
               <td colspan="3" class="byStages">
                  <el-radio-group v-model="form.byStages">
                     <el-radio
                        :label="state.value"
                        v-for="state in byStages"
                        :key="state.value"
                        style="display:flex"
                     >{{state.label}}：{{state.description}}</el-radio>
                  </el-radio-group>
               </td>
            </tr>
            <tr>
               <td colspan="1">
                  <span class="size">压疮部位：</span>
               </td>
               <td colspan="3">
                  <div>
                     <el-radio-group
                        v-model="form.prePosition"
                        style="display:flex;flex-wrap: wrap;"
                     >
                        <el-radio
                           :label="state.value"
                           v-for="state in prePosition"
                           :key="state.id"
                        >{{state.label}}</el-radio>
                     </el-radio-group>
                  </div>
               </td>
            </tr>
            <tr>
               <td colspan="1">
                  <photoGraph ref="photoGraphChild" />
               </td>
               <td colspan="3">
                  <span class="size">局部部位皮肤情况：</span>
                  <el-input v-model="form.skinCondition" style="width:70%"></el-input>
               </td>
            </tr>
            <tr>
               <td colspan="4">
                  <div>
                     <p>
                        <span class="size">一.皮肤改变/伤口状况：</span>
                     </p>
                  </div>
                  <div class="clearfix">
                     <p class="float">
                        <span class="size">范围（长 x 宽 x 深）：</span>
                        <el-input v-model="form.soreRange" style="width:150px"></el-input>
                     </p>
                     <p class="float">
                        <span class="size">皮肤颜色：</span>
                        <el-input v-model="form.skinColor" style="width:150px"></el-input>
                     </p>
                     <p class="float">
                        <span class="size">渗出液体：</span>
                        <el-input v-model="form.exudate" style="width:150px"></el-input>
                     </p>
                  </div>
                  <div>
                     <p style="margin-left:20px">
                        <span class="size">周围皮肤情况：</span>
                        <el-input v-model="form.skinSituation" style="width:70%"></el-input>
                     </p>
                  </div>
               </td>
            </tr>
            <tr>
               <td colspan="4">
                  <div>
                     <p>
                        <span class="size">二.处理：</span>
                     </p>
                  </div>
                  <div>
                     <p style="margin-left:20px">
                        <el-checkbox-group v-model="localProcessing">
                           <span class="size" style="display:inline-block;width:160px">局部处理：</span>
                           <el-checkbox
                              v-for="state in localPro"
                              :label="state.value"
                              :key="state.value"
                           >{{state.label}}</el-checkbox>
                        </el-checkbox-group>
                     </p>
                  </div>
                  <div class="clearfix">
                     <p class="float">
                        <span class="size" style="display:inline-block;width:160px">敷料粘贴是否良好：</span>
                        <el-radio-group v-model="form.dressingPasteIfGood">
                           <el-radio :label="0" style="margin-left:10px">良好</el-radio>
                           <el-radio :label="1" style="margin-left:10px">不好</el-radio>
                        </el-radio-group>
                     </p>
                     <p class="float">
                        <span class="size">敷料表面有无渗液：</span>
                        <el-radio-group v-model="form.ifExudate">
                           <el-radio :label="0" style="margin-left:10px">没有</el-radio>
                           <el-radio :label="1" style="margin-left:10px">有</el-radio>
                        </el-radio-group>
                     </p>
                  </div>
                  <div>
                     <p style="margin-left:20px">
                        <el-checkbox-group v-model="preventiveMeasures">
                           <span class="size" style="display:inline-block;width:160px">防范措施：</span>
                           <el-checkbox
                              v-for="state in preventiveMeasure"
                              :label="state.value"
                              :key="state.value"
                           >{{state.label}}</el-checkbox>
                        </el-checkbox-group>
                     </p>
                  </div>
                  <div>
                     <p style="margin-left:20px">
                        <span class="size" style="display:inline-block;width:160px">护理措施：</span>
                        <el-input v-model="form.nursingMeasures" style="width:70%"></el-input>
                     </p>
                  </div>
                  <div>
                     <p style="margin-left:20px">
                        <span class="size" style="display:inline-block;width:160px">压疮发生时间：</span>
                        <el-date-picker
                           v-model="form.occurrenceTime"
                           type="datetime"
                           placeholder="选择日期时间"
                           value-format="yyyy-MM-dd HH:mm:ss"
                           :picker-options="pickerOptions"
                        ></el-date-picker>
                     </p>
                  </div>
               </td>
            </tr>
         </table>
         <div style="margin:10px 0;padding-left:15px" class="clearfix">
            <p class="float">
               <span style="padding-left:10px;" class="size">记录人：</span>
               <el-input v-model="form.noteTaker" style="width:120px" @blur="noteTakerBlur"></el-input>
            </p>
            <p class="float">
               <span style="padding-left:10px" class="size">填表日期：</span>
               <el-date-picker
                  v-model="form.noteTime"
                  type="datetime"
                  placeholder="选择日期时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :picker-options="pickerOptions"
               ></el-date-picker>
            </p>
         </div>
      </div>
      <div class="operation_top">
         <el-button @click="sub()" class="el-button el-button--primary">提交</el-button>
         <el-button @click="reset()">重置</el-button>
         <el-button @click="close()">返回</el-button>
      </div>
   </div>
</template>

<script>
import {
   recordDic,
   addRecord,
   query,
   addNurseRecord
} from "@/api/icu/patient/pressureSore";
import { upDateProcess } from "@/api/icu/patient/process";
import { dateFormat } from "@/util/date";
import photoGraph from "@/views/icu/patient/components/pressureSore/photoGraph";
import { mapGetters } from "vuex";
export default {
   name: "nurseRecord",
   components: {
      photoGraph
   },
   props: {
      patientConditions: Object,
      nurseRecordDics: Array
   },
   computed: {
      ...mapGetters(["processArr"])
   },
   data() {
      return {
         patientId: "",
         // 上传图片
         fileList3: [],
         // 压疮分期
         byStages: [],
         // 局部清理
         localPro: [],
         localProcessing: [],
         // 防范措施
         preventiveMeasure: [],
         preventiveMeasures: [],
         // 护理措施
         nursingMeasures: [],
         // 压疮部位
         prePosition: [],
         form: {
            patientId: "",
            // 患者信息
            patientName: "",
            age: "",
            gender: "",
            hospitalnumber: "",
            bedName: "",
            // 评估结果
            assessmentResults: "",
            // 压疮分期
            byStages: "",
            prePosition: "",
            // 周围皮肤情况
            skinCondition: "",
            // 照片
            skinConditionPicture: "",
            soreRange: "",
            skinColor: "",
            exudate: "",
            skinSituation: "",
            // 敷料
            dressingPasteIfGood: "",
            // 渗液
            ifExudate: "",
            localProcessing: "",
            // 防范措施
            preventiveMeasures: "",
            // 护理措施
            nursingMeasures: "",
            noteTaker: "",
            noteTime: "",
            occurrenceTime: "",
            preSource: "0"
         },
         assessResult: "",
         pickerOptions: {
            disabledDate(time) {
               return time.getTime() > Date.now();
            }
         }
      };
   },
   watch: {
      patientConditions: {
         handler(newValue, oldValue) {
            this.patientConditions = newValue;
            this.getList();
            this.close();
         },
         deep: true
      }
   },
   mounted() {
      this.getList();
      this.getDic();
   },
   methods: {
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
         recordDic("preventive_measures").then(res => {
            res.data.data.forEach(item => {
               this.preventiveMeasure.push(
                  Object.assign({
                     label: item.label,
                     value: Number(item.value)
                  })
               );
            });
         });
         recordDic("local_processing").then(res => {
            res.data.data.forEach(item => {
               this.localPro.push(
                  Object.assign({
                     label: item.label,
                     value: Number(item.value)
                  })
               );
            });
         });
         if (localStorage.getItem("occurrence")) {
            this.form.occurrenceTime = localStorage.getItem("occurrence");
            this.form.preSource = "1";
         }
      },
      getList() {
         this.form.patientId = this.patientConditions.patientId;
         // 患者信息
         this.form.patientName = this.patientConditions.patientName;
         this.form.age = this.patientConditions.age;
         this.form.gender = this.patientConditions.gender;
         this.form.hospitalnumber = this.patientConditions.hospitalnumber;
         this.form.bedName = this.patientConditions.bedName;
         this.form.assessmentResults = this.patientConditions.assessmentResults;
         // console.log(this.processArr)
         if (this.processArr.indexOf("11") == -1) {
            this.reset();
         } else {
            query({ patientId: this.patientConditions.patientId }).then(
               response => {
                  // console.log(response);
                  if (response.data.data.records.length > 0) {
                     let data = response.data.data.records[0];
                     // 压疮分期
                     this.form.byStages = data.byStages;
                     this.form.prePosition = data.prePosition;
                     // 周围皮肤情况
                     this.form.skinCondition = data.skinCondition;
                     // 照片
                     this.form.skinConditionPicture = data.skinConditionPicture;
                     this.form.soreRange = data.soreRange;
                     this.form.skinColor = data.skinColor;
                     this.form.exudate = data.exudate;
                     this.form.skinSituation = data.skinSituation;
                     // 敷料
                     this.form.dressingPasteIfGood = data.dressingPasteIfGood;
                     // 渗液
                     this.form.ifExudate = data.ifExudate;
                     this.form.localProcessing = data.localProcessing;
                     // 防范措施
                     this.form.preventiveMeasures = data.preventiveMeasures;
                     // 护理措施
                     this.form.nursingMeasures = data.nursingMeasures;
                     this.form.noteTaker = data.noteTaker;
                     this.form.noteTime = data.noteTime;
                     this.form.occurrenceTime = data.occurrenceTime;
                     this.form.preSource = "0";
                     this.form.byStages = parseInt(this.form.byStages);
                     this.form.gender = String(this.form.gender);
                     // console.log(this.form);
                     if (this.form.preventiveMeasures) {
                        this.form.preventiveMeasures.split(",").forEach(i => {
                           i = parseInt(i);
                           this.preventiveMeasures.push(i);
                        });
                     }
                     if (this.form.localProcessing) {
                        this.form.localProcessing.split(",").forEach(i => {
                           i = parseInt(i);
                           this.localProcessing.push(i);
                        });
                     }
                  } else {
                     this.reset();
                  }
               }
            );
         }
      },
      clearForm() {
         this.$parent.newRecords = [];
         this.form = this.$parent.newRecords;
      },
      noteTakerBlur() {
         if (this.form.noteTaker != "") {
            this.form.noteTime = dateFormat(new Date());
         }
      },
      close() {
         this.reset();
         this.$parent.returnMethod();
         this.$refs.photoGraphChild.deleteImg();
      },
      reset() {
         this.localProcessing = [];
         this.preventiveMeasures = [];
         // 压疮分期
         this.form.byStages = "";
         this.form.prePosition = "";
         // 周围皮肤情况
         this.form.skinCondition = "";
         // 照片
         this.form.skinConditionPicture = "";
         this.form.soreRange = "";
         this.form.skinColor = "";
         this.form.exudate = "";
         this.form.skinSituation = "";
         // 敷料
         this.form.dressingPasteIfGood = "";
         // 渗液
         this.form.ifExudate = "";
         this.form.localProcessing = "";
         // 防范措施
         this.form.preventiveMeasures = "";
         // 护理措施
         this.form.nursingMeasures = "";
         this.form.noteTaker = "";
         this.form.noteTime = "";
         this.form.occurrenceTime = "";
         this.form.preSource = "0";
         this.$refs.photoGraphChild.deleteImg();
      },
      sub() {
         this.form.preventiveMeasures = this.preventiveMeasures.join(",");
         this.form.localProcessing = this.localProcessing.join(",");
         this.form.skinConditionPicture = this.$refs.photoGraphChild.fileName;
         var form = this.form;
         // console.log(form);
         switch ("") {
            case this.form.byStages:
               this.$message({
                  message: "请选择压疮分期",
                  type: "warning"
               });
               break;
            case this.form.prePosition:
               this.$message({
                  message: "请选择压疮部位",
                  type: "warning"
               });
               break;
            case this.form.soreRange:
               this.$message({
                  message: "请选择填写伤口范围",
                  type: "warning"
               });
               break;
            case this.form.skinColor:
               this.$message({
                  message: "请填写皮肤颜色",
                  type: "warning"
               });
               break;
            case this.form.exudate:
               this.$message({
                  message: "请填写渗出液体",
                  type: "warning"
               });
               break;
            case this.form.skinCondition:
               this.$message({
                  message: "请填写皮肤部位局部情况",
                  type: "warning"
               });
               break;
            case this.form.occurrenceTime:
               this.$message({
                  message: "请选择压疮发生时间",
                  type: "warning"
               });
               break;
            case this.form.nursingMeasures:
               this.$message({
                  message: "请填写护理措施",
                  type: "warning"
               });
               break;
            case this.form.noteTaker:
               this.$message({
                  message: "请填写记录人姓名",
                  type: "warning"
               });
               break;
            case this.form.noteTime:
               this.$message({
                  message: "请填写记录日期",
                  type: "warning"
               });
               break;
            default:
               this.$confirm(
                  "是否提交患者“" + form.patientName + "”压疮护理记录单?",
                  {
                     confirmButtonText: "确定",
                     cancelButtonText: "取消",
                     type: "warning",
                     dialogFormVisible: true
                  }
               )
                  .then(function() {
                     return addRecord(form);
                  })
                  .then(() => {
                     this.$message({
                        showClose: true,
                        message: "提交成功",
                        type: "success"
                     });
                     if (this.processArr.indexOf("11") == -1) {
                        // console.log(1);
                        upDateProcess({
                           flowName: 3,
                           specificStepId: 11,
                           patientId: form.patientId,
                           id: this.$parent.processId
                        });
                     }
                     // 提交后流程高亮
                     this.$parent.eleventhColor = true;
                     this.$parent.addGetList();
                     this.close();
                     this.$refs.photoGraphChild.deleteImg();
                  })
                  .catch(() => {
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
.nurseRecord {
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
.nurseRecord .table-bordered th,
.nurseRecord .table-bordered td,
.nurseRecord .table-bordered tr {
   border: 1px solid #ebeef5;
   text-align: left;
   padding: 15px 20px;
   span {
      font-size: 14px;
      // padding-left: 10px;
   }
   div {
      margin: 15px 0;
   }
}

.size {
   font-size: 16px !important;
   font-weight: 530;
}
.operation_top {
   text-align: center;
   padding: 50px 0;
   background-color: #fff !important;
}
// .operation_top button:last-child {
//   // margin-left: 30px;
// }
.nurseRecord .table-bordered .el-input--medium {
   margin: 0px 0 !important;
}
.nurseRecord .table-bordered .el-radio-group {
   margin: 0px 0 !important;
}
.nurseRecord .table-bordered .el-radio {
   margin: 30px 10px !important;
}

.nurseRecord .el-checkbox {
   color: #606266;
   font-weight: 500;
   font-size: 14px !important;
   margin: 10px;
}
.nurseRecord .el-radio {
   margin: 10px;
}
.byStages .el-radio-group {
   width: 100%;
}
.byStages .el-radio {
   margin: 30px 0 !important;
}
.float {
   float: left;
   margin-left: 20px;
}
.clearfix:after {
   content: "";
   display: table;
   clear: both;
}

// 上传图片

.nurseRecord .upload .el-upload {
   margin: 0 auto;
   display: block;
}
.nurseRecord .upload .el-upload__tip {
   text-align: center;
}
.nurseRecord .panel-title {
   font-size: 16px;
   font-weight: 600;
   float: left;
   margin-right: 15px;
   line-height: 30px;
   margin-bottom: 30px;
}
</style>


