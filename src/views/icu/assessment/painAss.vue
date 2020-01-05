<template>
   <!-- 疼痛评估 -->
   <div class="painAss">
      <basic-container>
         <div class="panel panel-default">
            <div class="createPer clearfix" v-if="!parentIf">
               <h3>疼痛综合评分</h3>
               <div class="patInfo">
                  <span>姓名: &nbsp;{{patInfo.name}}</span>&nbsp;
                  <span>性别：&nbsp;{{patInfo.denger == 1?'男':'女'}}</span>&nbsp;
                  <span>年龄：&nbsp;{{patInfo.age}}</span>&nbsp;
                  <span>入科日期：&nbsp;{{patInfo.entranceTime | timeFl}}</span>&nbsp;
               </div>
            </div>
            <div v-if="!parentIf">
               <el-dropdown class="avue-tags__menu">
                  <el-button type="primary" size="mini" v-model="patInfo.patientId">
                     {{patInfo.patientName}} {{patInfo.bedName}}
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
            <!-- 折线图 -->
            <!-- <div width="100%"> -->
            <div v-if="!parentIf" id="my-echarts"></div>

            <!-- </div> -->
            <div class="assTable">
               <table class="table table-bordered" id="basic-table" v-loading="loading">
                  <thead style="background-color:#f5f7fa">
                     <tr>
                        <th colspan="6" class="table-title">疼痛等级</th>
                     </tr>
                     <tr>
                        <th>评分类型</th>
                        <th colspan="2">评分项目</th>
                        <th>分值</th>
                     </tr>
                  </thead>
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
            </div>
            <div class="content" v-if="!parentIf">
               <el-button @click="reset">清空</el-button>
               <el-button
                  style="margin-left:5%"
                  type="primary"
                  @click="submit()"
                  :loading="loading"
               >提交</el-button>
            </div>
         </div>
      </basic-container>
   </div>
</template>


<script>
import { getAssess, addAss, getEch } from "@/api/icu/assessment/APACHE.js";
import { mapGetters, mapState } from "vuex";
import { constants } from "crypto";

export default {
   name: "painAss",
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
                              this.falgTrue = true;
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
            this.patientNameClick(newValue.patientName,newValue.id,newValue.patientId,newValue);
         }
      
  },
   },
   filters: {
      timeFl: data => {
         if (data) {
            data = data.substr(0, 11);
         }

         return data;
      }
   },
   // name: "painAss",
   data() {
      return {
         parentIf: false,
         patientName: "",
         // 折线图
         lineChart: "",
         //折线图数据
         AssessData: [], //y轴
         AssessTime: [], //x轴
         screenHeight: window.innerHeight,
         timer: "",
         loading: false,
         // 模拟数据
         patName: "",
         question: "临床表现",
         patientNames: [],
         count: 0,
         tableList: [],
         patInfo: [],
         totalScore: 0,
         assessProjectRecords: [],
         assessRecord: {},
         submitItem: {},
         submitItem2: {},
         submitIndex: "",
         falgTrue: ""
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
   mounted() {
      // this.getEcharts();
   },
   methods: {
      // 折线图请求
      getEchRep() {
         let query = {
            patientId: this.patName,
            projectCode: "CPOT"
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
            this.getEcharts();
         });
      },
      // 数据请求
      getRequest() {
         this.totalScore = 0;
         let query = {
            patientId: this.patName,
            projectCode: "CPOT"
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
                              this.falgTrue = true;
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
         this.patName = patientId;
         this.patientName = item.name;
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
      // 点击高亮变色 同时其余元素恢复正常
      // 原生js获取节点数组
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
      reset() {
         for (const i in this.tableList[0].assessProjects[0]
            .projectConditions) {
            this.tableList[0].assessProjects[0].projectConditions[
               i
            ].falg = false;
            this.totalScore = 0;
            this.falgTrue = false;
         }
         this.totalScore = 0;
         this.falgTrue = false;
         this.assessProjectRecords = [];
         this.assessRecord = {};
         this.submitItem = {};
         this.submitItem2 = {};
         this.submitIndex = "";
      },
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
               this.$forceUpdate(); //强制页面进行刷新
            })
            .catch(() => {
               this.$message({
                  type: "info",
                  message: "已取消提交"
               });
            });
      },
      getEcharts() {
         var myChart = this.$echarts.init(
            document.getElementById("my-echarts")
         );
         window.onresize = function() {
            myChart.resize();
         };
         myChart.setOption({
            tooltip: {
               trigger: "axis",
               axisPointer: {
                  // 坐标轴指示器，坐标轴触发有效
                  type: "line" // 默认为直线，可选为：'line' | 'shadow'
                  // animation: true
               }
            },
            dataZoom: [
               {
                  type: "inside"
               },
               {
                  type: "slider"
               }
            ],
            legend: {
               data: []
            },
            grid: {
               left: "3%",
               right: "4%",
               bottom: "8%",
               // width:'90%',
               containLabel: true
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
.createPer {
   width: 97%;
   border-bottom: #d4d4d4 solid 1px;
}
.createPer > h3 {
   display: inline-block;
}
.patInfo {
   margin-right: 100px;
   line-height: 30px;
   font-size: 12px;
   float: right;
}
.patient_name {
   margin-left: 2%;
}
.patientBtn {
   text-align: center;
   // padding: 10px;
   // margin-left: 2px;
   overflow: hidden;
}
.ActBtn {
   background: #409eff !important;
   color: #fff !important;
   text-align: center;
}
.content {
   margin: 30px;
   width: 100%;
   height: 34px;
   text-align: center;
}
.painAss .btn-cancle,
.painAss.btn-submit {
   margin: 0px 60px;
   display: inline-block;
   cursor: pointer;
}

/* table */
.painAss td,
.painAss th {
   text-align: center;
   vertical-align: middle;
   border: #ebeef5 solid 1px;
   // height: 40px !important;
   padding: 10px;
}
.painAss .panel-body th {
   background: #f7f7f7;
   font-size: 12px;
}
.painAss .panel-body td {
   color: #8b8b8b;
}
.total {
   margin-right: 30px;
   color: #e66a60;
}
#my-echarts {
   min-height: 500px;
   width: 98%;
   margin-right: 0;
}
.createPer {
   padding: 10px 15px;
   border-bottom: 1px solid transparent;
   border-top-left-radius: 3px;
   border-top-right-radius: 3px;
   border-color: #ddd;
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
.assTable {
   margin-top: 10px;
}
</style>
