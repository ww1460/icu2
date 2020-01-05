<template>
   <!-- 肌力评估 -->
   <basic-container>
      <div class="panel panel-default">
         <div class="panel-heading clearfix" v-if="!parentIf">
            <h3 class="panel-title">肌力评分</h3>
            <div class="perinfo">
               <span>姓名: &nbsp;{{patInfo.name}}</span>&nbsp;
               <span>性别：&nbsp;{{patInfo.denger == 1?'男':'女'}}</span>&nbsp;
               <span>年龄：&nbsp;{{patInfo.age}}</span>&nbsp;
               <span>入科日期：&nbsp;{{patInfo.entranceTime | timeFl}}</span>&nbsp;
            </div>
         </div>
         <div v-if="!parentIf">
            <el-dropdown class="avue-tags__menu">
               <el-button type="primary" size="mini" v-model="patInfo.patientId">
                  {{patInfo.name}} {{patInfo.bedName}}
                  <i class="el-icon-arrow-down el-icon--right" />
               </el-button>
               <el-dropdown-menu>
                  <div class="dropdownMenu">
                     <el-button
                        v-for="(item,index) in patientNames"
                        :title="item.patientName"
                        :key="index"
                        :class="['el-button--small',(item.patientId == patInfo.patientId?'el-button el-button--primary':'')]"
                        @click="patientNameClick(item.name,item.id,item.patientId,item)"
                     >{{ item.name }} {{item.bedName}}</el-button>
                  </div>
               </el-dropdown-menu>
            </el-dropdown>
         </div>
         <div
            v-if="!parentIf"
            id="main"
            style="width: '100%'; height: 300px;margin-bottom: 25px"
            class="main"
         ></div>
         <table class="table" id="basic-table" v-loading="loading">
            <tr>
               <th>评分类型</th>
               <th>评分项目</th>
               <th>条件</th>
               <th>分值</th>
            </tr>
            <tbody v-for="(item,index) in tableList" :key="index">
               <tr>
                  <td
                     :rowspan="item.assessProjects[index].projectConditions.length+1"
                  >{{item.assessType}}</td>
                  <td
                     v-for="(item1,index1) in item.assessProjects"
                     :key="index1"
                     :rowspan="item1.projectConditions.length+1"
                  >{{item1.projectName}}</td>
               </tr>
               <tr
                  v-for="(item2,index2) in item.assessProjects[index].projectConditions"
                  :key="index2"
               >
                  <td
                     @click="getId(item2,item.assessProjects[index].projectConditions,item,index)"
                     :class="item2.falg == true?'el-button--primary':''"
                  >{{ item2.assessCondition }}</td>
                  <td>{{ item2.assessResult }}</td>
               </tr>
               <tr>
                  <td colspan="4">
                     合计：
                     <span class="total">{{totalScore}}</span>
                  </td>
               </tr>
            </tbody>
         </table>
         <div class="content" v-if="!parentIf">
            <el-button @click="empty" size="medium">清空</el-button>
            <el-button @click="submit" size="medium" type="primary" :loading="loading">提交</el-button>
         </div>
      </div>
   </basic-container>
</template>

<script>
import { getAssess, addAss, getEch } from "@/api/icu/assessment/APACHE.js";
import { mapGetters, mapState } from "vuex";

export default {
   name: "strengthAss",
   props: {
      messages: Array
   },
   watch: {
      messages: {
         handler(newValue, oldValue) {
            if (newValue == undefined) {
               return;
            }
            // console.log(newValue[0].patientId)
            this.tableList = newValue;
            this.parentIf = true;
            for (const i in this.tableList[0].assessProjects[0]
               .projectConditions) {
               this.tableList[0].assessProjects[0].projectConditions[
                  i
               ].falg = false;
            }
            this.projectId = this.tableList[0].projectId;
            for (let i in this.tableList) {
               if (this.tableList[0].assessProjects[0].pitchOnId == null) {
                  // 第一次评估
                  for (let j in this.tableList[i].assessProjects) {
                     for (let k in this.tableList[i].assessProjects[j]
                        .projectConditions) {
                        this.falg = "";
                     }
                  }
               } else {
                  //  有过评估记录后  将上次评估的结果渲染
                  for (let j in this.tableList[i].assessProjects) {
                     for (let k in this.tableList[i].assessProjects[j]
                        .projectConditions) {
                        for (const v in this.tableList[i].assessProjects[j]
                           .pitchOnId) {
                           if (
                              this.tableList[i].assessProjects[j]
                                 .projectConditions[k].assessConditionId ==
                              this.tableList[i].assessProjects[j].pitchOnId[v]
                           ) {
                              this.tableList[i].assessProjects[
                                 j
                              ].projectConditions[k].falg = true;
                              this.submitItem = this.tableList[i];
                              this.submitItem2 = this.tableList[
                                 i
                              ].assessProjects[j].projectConditions[k];
                              this.submitIndex = Number(i);
                              this.totalScore = this.tableList[
                                 i
                              ].assessProjects[j].projectConditions[
                                 k
                              ].assessScore;
                           }
                        }
                     }
                  }
               }
            }
         },
         deep: true,
         immediate: true
      },

      patientMessage: {
         handler(newValue, oldValue) {
            this.patientNameClick(
               newValue.patientName,
               newValue.id,
               newValue.patientId,
               newValue
            );
         }
      }
   },
   filters: {
      timeFl: data => {
         if (data) {
            data = data.substr(0, 11);
         }

         return data;
      }
   },
   data() {
      return {
         parentIf: false,
         // 患者
         patName: "",
         patientNames: [],
         patientName: "",
         //折线图数据
         AssessData: [], //y轴
         AssessTime: [], //x轴
         flagAct: "",
         patInfo: [],
         // 条件 分值
         tableList: [],
         // 总分
         totalScore: 0,
         assessProjectRecords: [],
         assessRecord: {},
         submitItem: {},
         submitItem2: {},
         submitIndex: "",
         loading: false,
         // 折线图
         lineChart: ""
      };
   },
   computed: {
      ...mapGetters([
         "permissions",
         "nurse_patients",
         "dep_patients",
         "patientMessage"
      ]),
      ...mapState({
         roleCodes: state => state.user.roleCodes
      }),
      permissionList() {
         return {};
      }
   },
   created() {
      if (this.parentIf == false) {
         this.getNursePatients();
      }
   },
   activated() {
      if (this.parentIf == false) {
         this.getNursePatients();
      }
   },
   mounted() {},
   methods: {
      //折线图
      broken() {
         var myChart = this.$echarts.init(document.getElementById("main"));
         window.onresize = function() {
            myChart.resize();
            //  console.log(3)
         };
         myChart.setOption({
            dataZoom: [
               {
                  type: "inside",
                  xAxisIndex: 0,
                  filterMode: "empty",
                  show: true,
                  realtime: true,
                  top: "55%"
               },
               {
                  type: "slider",
                  xAxisIndex: 0,
                  filterMode: "empty"
               }
            ],
            grid: {
               left: "5%",
               right: "5%",
               bottom: "15%",
               containLabel: true
            },
            tooltip: {
               trigger: "axis",
               axisPointer: {
                  type: "line",
                  animation: true
               }
               // position: ['50%', '50%']
            },
            xAxis: {
               type: "category",
               data: this.AssessTime
            },
            yAxis: {
               type: "value"
            },
            series: [
               {
                  data: this.AssessData,
                  type: "line"
               }
            ]
         });
      },
      // 请求患者列表
      getNursePatients() {
         let data = JSON.parse(sessionStorage.getItem("pigx-all_patients"))
            .content;
         this.patInfo = JSON.parse(
            sessionStorage.getItem("pigx-patientMessage")
         ).content;
         this.patientNames = data;
         this.patName = this.patInfo.patientId;
         this.patientName = this.patInfo.name;
         this.getRequest();
         this.getEchRep();
      },

      patientNameClick(patientName, id, patientId, item) {
         this.totalScore = 0;
         this.patName = patientId;
         this.patientName = patientName;
         this.$store.commit("SET_MESSAGE", item);
         this.patInfo = this.patientMessage;
         this.getRequest();
         this.getEchRep();
      },
      patient(name, id, patientId) {
         this.patName = patientId;
         for (const i in this.patientNames) {
            if (this.patientNames[i].id == id) {
               this.patientName = this.patientNames[i].name;
               this.patInfo = this.patientNames[i];
            }
         }
         this.getRequest();
         this.getEchRep();
      },
      // 请求折线图数据
      getEchRep() {
         let query = {
            patientId: this.patName,
            projectCode: "MuscleForce"
         };
         getEch(query).then(response => {
            this.lineChart = response.data.data;
            this.AssessTime = [];
            this.AssessData = [];
            for (let i in this.lineChart) {
               this.AssessTime.unshift(this.lineChart[i].createTime);
               this.AssessData.unshift(this.lineChart[i].assessResult);
            }
            this.AssessTime = this.AssessTime.map(function(str) {
               return str.replace(" ", "\n");
            });
            this.broken();
         });
      },
      // 初始查询是否评估过
      getRequest() {
         let query = {
            patientId: this.patName,
            projectCode: "MuscleForce"
         };
         this.loading = true;
         getAssess(query).then(response => {
            this.tableList = response.data.data.data;
            for (const i in this.tableList[0].assessProjects[0]
               .projectConditions) {
               this.tableList[0].assessProjects[0].projectConditions[
                  i
               ].falg = false;
            }
            this.projectId = this.tableList[0].projectId;
            for (let i in this.tableList) {
               if (this.tableList[0].assessProjects[0].pitchOnId == null) {
                  // 第一次评估
                  for (let j in this.tableList[i].assessProjects) {
                     for (let k in this.tableList[i].assessProjects[j]
                        .projectConditions) {
                        this.falg = "";
                     }
                  }
               } else {
                  //  有过评估记录后  将上次评估的结果渲染
                  for (let j in this.tableList[i].assessProjects) {
                     for (let k in this.tableList[i].assessProjects[j]
                        .projectConditions) {
                        for (const v in this.tableList[i].assessProjects[j]
                           .pitchOnId) {
                           if (
                              this.tableList[i].assessProjects[j]
                                 .projectConditions[k].assessConditionId ==
                              this.tableList[i].assessProjects[j].pitchOnId[v]
                           ) {
                              this.tableList[i].assessProjects[
                                 j
                              ].projectConditions[k].falg = true;
                              this.submitItem = this.tableList[i];
                              this.submitItem2 = this.tableList[
                                 i
                              ].assessProjects[j].projectConditions[k];
                              this.submitIndex = Number(i);
                              this.totalScore = this.tableList[
                                 i
                              ].assessProjects[j].projectConditions[
                                 k
                              ].assessScore;
                           }
                        }
                     }
                  }
               }
            }
            this.loading = false;
         });
      },
      // 条件点击
      getId(item2, item1, item, index) {
         if (this.parentIf == true) {
            return;
         }
         this.submitItem = {};
         this.submitItem2 = {};
         this.submitIndex = "";
         for (const i in item1) {
            if (item1[i].id == item2.id) {
               if (item2.falg == true) {
                  this.tableList[0].assessProjects[0].projectConditions[
                     i
                  ].falg = false;
                  this.totalScore = 0;
                  this.falgTrue = false;
               } else {
                  this.tableList[0].assessProjects[0].projectConditions[
                     i
                  ].falg = true;
                  this.totalScore = item2.assessScore;
                  this.falgTrue = true;
               }
            } else {
               this.tableList[0].assessProjects[0].projectConditions[
                  i
               ].falg = false;
            }
         }

         this.submitItem = item;
         this.submitItem2 = item2;
         this.submitIndex = index;
         this.$forceUpdate();
      },
      // 提交
      submit() {
         this.$confirm("是否确认提交", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
         })
            .then(() => {
               if (this.falgTrue == false) {
                  this.$message.error("请选择一项条件");
               } else {
                  let _this = this;
                  let assessProjectRecords = [
                     {
                        assessConditionId: this.submitItem2.assessConditionId,
                        assessProjectId: this.submitItem.assessProjects[
                           _this.submitIndex
                        ].assessProjectId,
                        patientId: this.patName
                     }
                  ];
                  let assessRecord = {
                     assessResult: this.totalScore,
                     projectId: this.submitItem.projectId,
                     patientId: this.patName
                  };
                  let params = {
                     assessProjectRecords: assessProjectRecords,
                     assessRecord: assessRecord
                  };
                  addAss(params).then(response => {
                     this.$message({
                        type: "success",
                        showClose: true,
                        message: "提交成功"
                     });
                     this.getEchRep();
                     this.getRequest();
                  });
                  this.totalScore = 0;
                  this.assessProjectRecords = [];
                  this.assessRecord = {};
                  this.submitItem = {};
                  this.submitItem2 = {};
                  this.submitIndex = "";
               }
            })
            .catch(() => {
               this.$message({
                  type: "info",
                  message: "已取消提交"
               });
            });
      },
      // 清空页面已经选择的数据
      empty() {
         for (const i in this.tableList[0].assessProjects[0]
            .projectConditions) {
            this.tableList[0].assessProjects[0].projectConditions[
               i
            ].falg = false;
            this.totalScore = 0;
            this.falgTrue = false;
         }
         this.totalScore = 0;
         this.assessProjectRecords = [];
         this.assessRecord = {};
         this.submitItem = {};
         this.submitItem2 = {};
         this.submitIndex = "";
      }
   }
};
</script>

<style lang="scss" scoped>
.clearfix:after {
   content: "";
   display: block;
   clear: both;
}
.total {
   margin-left: 30px;
}
.panel-heading {
   padding: 10px 15px;
   border-bottom: 1px solid transparent;
   border-top-left-radius: 3px;
   border-top-right-radius: 3px;
   border-color: #ddd;
}
.panel-title {
   float: left;
   font-size: 16px;
   font-weight: 600;
}
.perinfo {
   margin-right: 100px;
   line-height: 30px;
   font-size: 12px;
   float: right;
}
.patient_name {
   margin-top: 5px;
   margin-left: 1%;
}
.ActBtn {
   background: #409eff !important;
   color: #fff !important;
   text-align: center;
}
.patientBtn {
   text-align: center;
   overflow: hidden;
}
#basic-table {
   width: 96%;
   margin-left: 2%;
   border: 1px solid #ddd;
}
#basic-table td,
#basic-table th {
   line-height: 45px;
   border: 1px solid #ddd;
   text-align: center;
   vertical-align: middle;
}
.content {
   margin-top: 20px;
   text-align: center;
}
.submit {
   background: #409eff !important;
   color: #fff !important;
   text-align: center;
   margin-left: 5%;
}
.avue-tags__menu {
   line-height: 40px;
   padding-right: 10px;
   margin-top: 18px;
   margin-right: 1%;
   z-index: 900;
}
.patientBtn {
   width: 90px;
   margin: 3%;
   // padding: 10px;
   // margin-left: 2px;
   overflow: hidden;
}
.patientBtn span {
   text-align: center;
}
.ActBtn {
   background: #409eff !important;
   color: #fff !important;
}
// @media screen and (max-width: 1024px) {
//   .main {
//     width: 830px;
//   }
// }
// @media screen and (max-width: 768px) {
//   .main {
//     width: 600px;
//   }
// }
</style>