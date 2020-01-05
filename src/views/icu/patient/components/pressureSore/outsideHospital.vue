<template>
   <!-- 院外带入压力性损伤 -->
   <div class="outHospital">
      <div>
         <h3 class="panel-title">院外带入压力性损伤</h3>
         <el-button @click="close()">返回</el-button>
         <table class="table table-bordered">
            <thead>
               <tr>
                  <td colspan="2">
                     <p>
                        <span>床号：</span>
                        {{form.admissionBeds}}
                     </p>
                  </td>
                  <td>
                     <p>
                        <span>姓名：</span>
                        {{form.name}}
                     </p>
                  </td>
                  <td>
                     <p>
                        <span>性别：</span>
                        {{form.gender | sex}}
                     </p>
                  </td>
                  <td>
                     <p>
                        <span>年龄：</span>
                        {{form.age}}岁
                     </p>
                  </td>
                  <td colspan="2">
                     <p>
                        <span>住院号：</span>
                        {{form.admissionBeds}}
                     </p>
                  </td>
               </tr>
               <tr>
                  <td colspan="7">
                     <p style="text-align:left">
                        <span>诊断：</span>
                        {{form.diagnosis}}
                     </p>
                  </td>
               </tr>
               <tr>
                  <th rowspan="2" style="text-align: center;">评分类型</th>
                  <th rowspan="2" style="text-align: center;">评分项目</th>
                  <th :colspan="range.length" style="text-align: center">分值</th>
                  <th rowspan="2" style="text-align: center;">得分</th>
               </tr>
               <tr style="background-color:#f5f7fa" v-if="rangeIf">
                  <th v-for="i in range" :key="i">{{i}}</th>
               </tr>
            </thead>
            <tbody v-for="(item,index) in questionArr" :key="index">
               <tr>
                  <td
                     :rowspan="item.assessProjects.length+1"
                     style="text-align: center;padding:0"
                  >{{item.assessType}}</td>
               </tr>

               <tr v-for="(i,index2) in item.assessProjects" :key="index2">
                  <td style="text-align: center;padding:0">{{i.projectName}}</td>
                  <td style="text-align: center;padding:0">
                     <span
                        v-for="(j,index3) in i.projectConditions"
                        :key="index3"
                        v-if="j.assessScore == 1"
                        :class="['td_span',(j.selected == true?'ActBtn':'')]"
                        @click="getId($event,j.id,j.assessScore,i,j.selected)"
                     >{{j.assessCondition}}</span>
                  </td>
                  <td style="text-align: center;padding:0">
                     <span
                        v-for="(j,index3) in i.projectConditions"
                        :key="index3"
                        v-if="j.assessScore == 2"
                        :class="['td_span',(j.selected == true?'ActBtn':'')]"
                        @click="getId($event,j.id,j.assessScore,i,j.selected)"
                     >{{j.assessCondition}}</span>
                  </td>
                  <td style="text-align: center;padding:0">
                     <span
                        v-for="(j,index3) in i.projectConditions"
                        :key="index3"
                        v-if="j.assessScore == 3"
                        :class="['td_span',(j.selected == true?'ActBtn':'')]"
                        @click="getId($event,j.id,j.assessScore,i,j.selected)"
                     >{{j.assessCondition}}</span>
                  </td>
                  <td style="text-align: center;padding:0">
                     <span
                        v-for="(j,index3) in i.projectConditions"
                        :key="index3"
                        v-if="j.assessScore == 4"
                        :class="['td_span',(j.selected == true?'ActBtn':'')]"
                        @click="getId($event,j.id,j.assessScore,i,j.selected)"
                     >{{j.assessCondition}}</span>
                  </td>
                  <td style="text-align: center;">{{i.number}}</td>
               </tr>
            </tbody>
            <tfoot>
               <tr style="background-color:#f5f7fa;height: 65px">
                  <td colspan="7">
                     合计：
                     <span class="total">{{ count}}</span>
                  </td>
               </tr>
               <tr>
                  <td colspan="5">
                     <el-radio-group v-model="form.newHairBringIn">
                        <el-radio
                           :label="state.value"
                           v-for="state in newHairBringIn"
                           :key="state.value"
                        >{{state.label}}</el-radio>
                     </el-radio-group>
                     <span style="padding-left:20px">压疮发生时间：</span>
                     <el-date-picker
                        v-model="form.occurrenceTime"
                        type="datetime"
                        placeholder="选择日期时间"
                        value-format="yyyy-MM-dd HH:mm:ss"
                     ></el-date-picker>
                  </td>
                  <td colspan="2">
                     <span>Branden评分 总分：0</span>
                  </td>
               </tr>
               <tr>
                  <td colspan="7">
                     <div>压疮情况：</div>
                     <div style="display:flex;align-items:center;flex-wrap: wrap;margin:20px 0">
                        <div>1.压疮部位：</div>
                        <el-radio-group v-model="form.prePosition">
                           <el-radio
                              v-for="state in prePosition"
                              :label="state.value"
                              :key="state.value"
                           >{{state.label}}</el-radio>
                        </el-radio-group>
                     </div>
                     <div style="display:flex;align-items:center;flex-wrap: wrap;margin:20px 0">
                        <div>2.压疮分期：</div>
                        <el-radio-group v-model="form.byStages">
                           <el-radio
                              v-for="state in byStages"
                              :label="state.value"
                              :key="state.value"
                              style="display:flex;padding:10px 0"
                           >{{state.label}}：{{state.description}}</el-radio>
                        </el-radio-group>
                     </div>
                     <div style="display:flex;align-items:center;flex-wrap: wrap;margin:20px 0">
                        <span>3.压疮创面：</span>
                        <el-radio-group v-model="form.wounds">
                           <el-radio
                              v-for="state in wounds"
                              :label="state.value"
                              :key="state.value"
                           >{{state.label}}</el-radio>
                        </el-radio-group>
                     </div>
                     <div style="display:flex;align-items:center;flex-wrap: wrap;margin:20px 0">
                        <span>4.分泌物：</span>
                        <el-radio-group v-model="form.secretion">
                           <el-radio
                              v-for="state in secretion"
                              :label="state.value"
                              :key="state.value"
                           >{{state.label}}</el-radio>
                        </el-radio-group>
                     </div>
                     <div style="display:flex;align-items:center;flex-wrap: wrap;margin:20px 0">
                        <span>5.伤口颜色：</span>
                        <el-radio-group v-model="form.color">
                           <el-radio
                              v-for="state in color"
                              :label="state.value"
                              :key="state.value"
                           >{{state.label}}</el-radio>
                        </el-radio-group>
                     </div>
                     <div style="display:flex;align-items:center;flex-wrap: wrap;margin:20px 0">
                        <span>6.压疮面积(长*宽*高)：</span>
                        <el-input v-model="form.area" style="width:70%"></el-input>
                     </div>
                  </td>
               </tr>
               <tr>
                  <td colspan="7">
                     <div style="display:flex;align-items:center;flex-wrap: wrap;margin:20px 0">
                        <span>压疮伤口处理及治疗措施</span>
                        <el-checkbox-group v-model="measures">
                           <el-checkbox
                              v-for="state in measure"
                              :label="state.value"
                              :key="state.value"
                           >{{state.label}}</el-checkbox>
                        </el-checkbox-group>
                     </div>
                     <div>
                        <span>是否急需会诊：</span>
                        <el-radio-group v-model="urgentConsultation">
                           <el-radio label="1">是</el-radio>
                           <el-radio label="0">否</el-radio>
                        </el-radio-group>
                     </div>
                  </td>
               </tr>
               <tr>
                  <td colspan="5">
                     <div>
                        <span>患者家属：</span>
                        <el-input v-model="form.patientsFamily" style="width:70%"></el-input>
                     </div>
                  </td>
                  <td colspan="2">
                     <div>
                        <span>日期：</span>
                        <el-date-picker
                           v-model="form.occurrenceTime"
                           type="datetime"
                           placeholder="选择日期时间"
                           value-format="yyyy-MM-dd HH:mm:ss"
                        ></el-date-picker>
                     </div>
                  </td>
               </tr>
               <tr>
                  <td colspan="5">
                     <div>
                        <span>报告护士：</span>
                        <el-input v-model="form.area" style="width:70%"></el-input>
                     </div>
                  </td>
                  <td colspan="2">
                     <div>
                        <span>日期：</span>
                        <el-date-picker
                           v-model="form.occurrenceTime"
                           type="datetime"
                           placeholder="选择日期时间"
                           value-format="yyyy-MM-dd HH:mm:ss"
                        ></el-date-picker>
                     </div>
                  </td>
               </tr>
               <tr>
                  <td colspan="5">
                     <div>
                        <span>护士长：</span>
                        <el-input v-model="form.area" style="width:70%"></el-input>
                     </div>
                  </td>
                  <td colspan="2">
                     <div>
                        <span>日期：</span>
                        <el-date-picker
                           v-model="form.occurrenceTime"
                           type="datetime"
                           placeholder="选择日期时间"
                           value-format="yyyy-MM-dd HH:mm:ss"
                        ></el-date-picker>
                     </div>
                  </td>
               </tr>
            </tfoot>
         </table>
         <div>备注：</div>
      </div>
      <div class="operation_top">
         <el-button @click="close()">返回</el-button>
         <el-button @click="sub()">提交</el-button>
      </div>
   </div>
</template>

<script>
import { catheterScore, subAdd } from "@/api/icu/patient/pipelineStatus";
import { getEch, getAssess, addAss } from "@/api/icu/assessment/APACHE.js";
export default {
   name: "outsideHospital",
   props: {
      message: Object
   },
   watch: {
      message: {
         handler(newValue, oldValue) {
            this.close()
         }
      }
   },
   data() {
      return {
         projectCode: "Braden",
         questionArr: [],
         range: [],
         count: null,
         min: "",
         max: "",
         // 患者
         patientNames: [],
         rangeIf: true,
         combined: 0,

         prePosition: [],
         byStages: [],
         wounds: [],
         measure: [],
         measures: [],
         secretion: [],
         color: [],
         urgentConsultation: [],
         form: {
            admissionBeds: "",
            name: "",
            gender: "",
            gender: "",
            age: "",
            patientId: "",
            hospitalnumber: "",
            diagnosis: "",
            newHairBringIn: "",
            occurrenceTime: "",
            prePosition: "",
            byStages: "",
            wounds: "",
            area: "",
            measures: "",
            secretion: "",
            color: "",
            urgentConsultation: "",
            patientsFamily: "",
            nurseNmae: "",
            matronName: ""
         },
         newHairBringIn: [
            { label: "新发", value: "0" },
            { label: "带入", value: "1" }
         ]
      };
   },
   created() {
      this.prePosition = this.$parent.prePosition;
      this.byStages = this.$parent.byStages;
      this.form = this.$parent.patient;
      this.getList();
   },
   methods: {
      close() {
         this.$parent.returnMethod();
      },
      getList() {
         this.count = null;
         let params = {
            patientId: this.form.patientId,
            projectCode: this.projectCode
         };

         getAssess(params).then(response => {
            // console.log(response.data.data.data);
            this.questionArr = response.data.data.data;
            this.projectId = this.questionArr[0].projectId;
            for (let i in this.questionArr) {
               for (let j in this.questionArr[i].assessProjects) {
                  // this.questionArr[i].assessProjects[j].fliterNum = true;
                  //  没有评估记录的
                  if (this.questionArr[i].assessProjects[j].pitchOnId == null) {
                     this.questionArr[i].assessProjects[j].number = null;
                     this.questionArr[i].assessProjects[j].fliterNum = false;
                     for (let k in this.questionArr[i].assessProjects[j]
                        .projectConditions) {
                        this.questionArr[i].assessProjects[j].projectConditions[
                           k
                        ].selected = false;
                     }
                  } else {
                     this.questionArr[i].assessProjects[j].fliterNum = true;
                     for (let k in this.questionArr[i].assessProjects[j]
                        .projectConditions) {
                        // console.log(k)
                        //  有过评估记录后  将上次评估的结果渲染
                        if (
                           this.questionArr[i].assessProjects[j]
                              .projectConditions[k].assessConditionId ==
                           this.questionArr[i].assessProjects[j].pitchOnId
                        ) {
                           this.questionArr[i].assessProjects[
                              j
                           ].number = this.questionArr[i].assessProjects[
                              j
                           ].projectConditions[k].assessScore;

                           this.questionArr[i].assessProjects[
                              j
                           ].projectConditions[k].selected = true;
                        } else {
                           this.questionArr[i].assessProjects[
                              j
                           ].projectConditions[k].selected = false;
                        }
                     }
                     this.count =
                        this.count +
                        this.questionArr[i].assessProjects[j].number;
                  }
               }
               if (isNaN(this.count)) {
                  this.count = null;
               }
               //  如果没有设定范围就不显示具体分值  如果有就在表头显示具体分值
               if (
                  this.questionArr[0].scoreMin == null ||
                  this.questionArr[0].scoreMin == undefined ||
                  this.questionArr[0].scoreMax == null ||
                  this.questionArr[0].scoreMax == undefined
               ) {
                  this.rangeIf = false;
               } else {
                  this.min = this.questionArr[0].scoreMin * 1;
                  this.max = this.questionArr[0].scoreMax * 1;
                  this.range = [];
                  for (i = this.min; i <= this.max; i++) {
                     this.range.push(i);
                  }
               }
            }
         });
         getEch(params).then(response => {
            // console.log(response.data.data);
            this.AssessData = response.data.data;
            // console.log(this.AssessData)
            // this.AssessData=[]
            this.AssessTime = [];
            this.AssessCount = [];
            for (let i in this.AssessData) {
               this.AssessTime.push(this.AssessData[i].createTime);
               this.AssessCount.push(this.AssessData[i].assessResult);
            }
            // console.log(this.AssessTime);
            // console.log(this.AssessCount);
            // this.broken();
         });
      },
      patientNameClick(patientName, id, patientId, item) {
         this.form.patientId = patientId;
         this.patInfo = item.patient;
         this.getList();
      },
      patientIdChange(patName) {
         // console.log(this.patName)

         //  this.patInfo=item
         this.getList();
         for (let i in this.patientNames) {
            if (patName == this.patientNames[i].patientId) {
               this.patInfo = this.patientNames[i];
            }
         }
      },
      // 条件点击
      getId(e, id, score, items, index) {
         for (var i in items.projectConditions) {
            if (items.projectConditions[i].id == id) {
               if (items.projectConditions[i].selected == true) {
                  items.projectConditions[i].selected = false;
                  this.count = this.count - items.number;
                  if (this.count === 0) {
                     this.count = null;
                  }
                  items.fliterNum = false;
                  items.number = null;
               } else {
                  items.projectConditions[i].selected = true;
                  items.fliterNum = true;
                  if (items.number == null) {
                  } else {
                     this.count = this.count - items.number;
                  }

                  items.number = score;
                  this.count += items.number;
               }
            } else {
               items.projectConditions[i].selected = false;

               // }
            }
         }
         this.$forceUpdate();
      },
      sub() {
         console.log((this.$parent.ninthColor = true));
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
<style lang="scss">
.outHospital {
   .operation_top {
      text-align: center;
      padding: 50px 0;
      background-color: #fff !important;
   }
   .operation_top button:last-child {
      margin-left: 30px;
   }
   .table-bordered th,
   .table-bordered td,
   .table-bordered tr {
      border: 1px solid #ebeef5;
      text-align: left;
      padding: 20px;
      span {
         font-size: 14px;
      }
      .el-input__inner {
         border-top: 0;
         border-left: 0;
         border-right: 0;
         border-radius: 0;
      }
   }
   .panel-title {
      font-size: 16px;
      font-weight: 600;
      float: left;
      margin-right: 15px;
      line-height: 30px;
      margin-bottom: 30px;
   }
   .td_span {
      // display: inline-block;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 65px;
      // height: 100%;

      overflow: hidden;
   }
   .ActBtn {
      background: #409eff !important;
      color: #fff !important;
      text-align: center;
   }
}
</style>


