<template>
   <!-- 跌倒/坠床评分 -->
   <basic-container>
      <div class="panel panel-default">
         <div class="panel-heading clearfix" v-if="flagpage != 2 && !parentIf">
            <h3 class="panel-title">跌倒/坠床评分</h3>
            <div class="perinfo" v-if="flagpage != 2">
               <span>姓名: &nbsp;{{patInfo.name}}</span>&nbsp;
               <span>性别：&nbsp;{{patInfo.gender| genderFl }}</span>&nbsp;
               <span>年龄：&nbsp;{{patInfo.age}}</span>&nbsp;
               <span>入科日期：&nbsp;{{patInfo.entranceTime | timeFl}}</span>&nbsp;
            </div>
         </div>
         <div v-if="!parentIf">
            <el-dropdown class="avue-tags__menu">
               <el-button type="primary" size="mini" v-model="patInfo.patientId">
                  {{patInfo.patientName}} {{patInfo.bedName}}
                  <i
                     class="el-icon-arrow-down el-icon--right"
                  />
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
         <div v-if="!parentIf" id="main" style="height: 300px;margin-bottom: 25px" class="main"></div>
         <div class="assTable" style="margin-top:1%">
            <table class="table table-bordered" id="basic-table" v-loading="loading">
               <thead>
                  <tr style="background-color:#f5f7fa">
                     <th rowspan="2">评分类型</th>
                     <th rowspan="2">评分项目</th>
                     <th style="width:350px">条件</th>
                     <th>分值</th>
                     <!-- <th rowspan="2">测量值</th> -->
                     <!-- <th rowspan="2">得分</th> -->
                  </tr>
                  <!-- <tr style="background-color:#f5f7fa" v-if="rangeIf">
              <th v-for="i in range" :key="i">{{i}}</th>
                  </tr>-->
               </thead>
               <tbody v-for="(item,index) in questionArr" :key="index">
                  <tr>
                     <td :rowspan="item.assessProjects.length+1" id="typeTd">{{item.assessType}}</td>
                  </tr>

                  <tr v-for="(i,index2) in item.assessProjects" :key="index2">
                     <!-- <td>{{item.assessType}}</td> -->
                     <td>{{i.projectName}}</td>
                     <td>
                        <span
                           v-for="(j,index3) in i.projectConditions"
                           :key="index3"
                           :class="['td_span',(j.selected === true?'ActBtn':'')]"
                           @click="getId($event,j.id,j.assessScore,i,j.selected)"
                        >{{j.assessCondition}}</span>
                     </td>
                     <td>
                        <span
                           v-for="(j,index3) in i.projectConditions"
                           :key="index3"
                           :class="['td_span']"
                        >{{j.assessScore}}</span>
                     </td>
                  </tr>
               </tbody>
               <tfoot>
                  <tr style="background-color:#f5f7fa">
                     <td colspan="9">
                        合计：
                        <span class="total">{{ count }}</span>
                     </td>
                  </tr>
               </tfoot>
            </table>
         </div>
         <div class="content" v-if="!parentIf">
            <el-button v-if="flagpage" @click="changeflag(1)">返回</el-button>
            <el-button style="margin-left:5%" @click="reset">清空</el-button>
            <el-button style="margin-left:5%" type="primary" @click="submit()" :loading="loading">提交</el-button>
         </div>
      </div>
   </basic-container>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import {
   getEch,
   getAssess,
   addAss,
   putflow
} from "@/api/icu/assessment/APACHE.js";
export default {
   props: {
      messages: Array,
      flagpage: {
         type: Number
      },
      changeflagpage: {
         type: Function
      },
      sub: {
         type: Function
      },
      mess: {
         type: Object
      },
      flowDateId: {
         type: Number
      },
      getAssess: {
         type: Function
      }
   },
   name: "fallBed",
   watch: {
      messages: {
         handler(newValue, oldValue) {
            if (newValue == undefined) {
               return;
            }
            this.questionArr = newValue;
            this.parentIf = true;
            for (let i in this.questionArr) {
               for (let j in this.questionArr[i].assessProjects) {
                  // this.questionArr[i].assessProjects[j].fliterNum = true;
                  //  没有评估记录的
                  if (
                     this.questionArr[i].assessProjects[j].pitchOnId == null ||
                     this.questionArr[i].assessProjects[j].pitchOnId.length == 0
                  ) {
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
                  this.questionArr[0].scoreMin === null ||
                  this.questionArr[0].scoreMin === undefined ||
                  this.questionArr[0].scoreMax === null ||
                  this.questionArr[0].scoreMax === undefined
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
            this.loading = false;
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
      },
      genderFl: data => {
         switch (data) {
            case "0":
               return "女";

            case "1":
               return "男";
         }
      }
   },
   data() {
      return {
         parentIf: false,
         projectCode: "Morse",
         projectId: "",
         min: "",
         max: "",
         range: [],
         name: "",
         // 合计
         combined: 0,
         total: [],
         // 患者
         patName: "",
         patientNames: [],
         //折线图数据
         AssessData: [], //数据列表
         AssessTime: [], //x轴  时间
         AssessCount: [], //  Y轴 总分
         flagAct: "",
         patInfo: {},
         rangeIf: true,
         loading: false,
         num: "",
         watchArr: [],
         // 模拟数据
         count: 0,
         questionArr: [],
         // 总分
         totalScore: "",
         falg: {},
         message: ""
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
      // console.log(this.flagpage);
   },
   activated() {
      if (this.parentIf == false) {
         this.getNursePatients();
      }
   },
   methods: {
      //返回
      changeflag(flag) {
         this.changeflagpage(flag);
      },
      //折线图
      broken() {
         var myChart = this.$echarts.init(document.getElementById("main"));
         window.onresize = function() {
            myChart.resize();
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
                  data: this.AssessCount,
                  connectNulls: true,

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
         this.name = this.patInfo.name;
         this.getList();
      },
      patientNameClick(patientName, id, patientId, item) {
         this.patName = patientId;
         this.name = patientName;
         this.$store.commit("SET_MESSAGE", item);
         this.patInfo = this.patientMessage;
         this.getList();
      },
      patientIdChange(name, id, patientId, item) {
         this.patName = patientId;
         this.name = name;
         this.patInfo = item;
         this.getList();
      },
      getList() {
         if (this.mess) {
            this.patName = this.mess.patientId;
         }
         

         let params = {
            patientId: this.patName,
            projectCode: this.projectCode
         };
         this.loading = true;
         this.count = 0;
         getAssess(params).then(response => {
            this.questionArr = response.data.data.data;
            this.projectId = this.questionArr[0].projectId;
            this.count = 0;
            for (let i in this.questionArr) {
               for (let j in this.questionArr[i].assessProjects) {
                  //  没有评估记录的
                  if (
                     this.questionArr[i].assessProjects[j].pitchOnId == null ||
                     this.questionArr[i].assessProjects[j].pitchOnId.length == 0
                  ) {
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
                  this.count = 0;
               }
               //  如果没有设定范围就不显示具体分值  如果有就在表头显示具体分值
               if (
                  this.questionArr[0].scoreMin === null ||
                  this.questionArr[0].scoreMin === undefined ||
                  this.questionArr[0].scoreMax === null ||
                  this.questionArr[0].scoreMax === undefined
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
            this.loading = false;
         });
         getEch(params).then(response => {
            this.AssessData = response.data.data.reverse();
            this.AssessTime = [];
            this.AssessCount = [];
            for (let i in this.AssessData) {
               this.AssessTime.push(this.AssessData[i].createTime);

               this.AssessCount.push(this.AssessData[i].assessResult);
            }
            this.AssessTime = this.AssessTime.map(function(str) {
               return str.replace(" ", "\n");
            });
            this.broken();
         });
      },
      // 条件点击
      getId(e, id, score, items, index) {
         if (this.parentIf == true) {
            return;
         }
         this.watchArr = items.projectConditions;
         for (var i in items.projectConditions) {
            if (items.projectConditions[i].id == id) {
               if (items.projectConditions[i].selected == true) {
                  items.projectConditions[i].selected = false;
                  this.count = this.count - items.number;
                  if (this.count === 0) {
                     this.count = 0;
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
            }
         }
         this.$forceUpdate();
      },
      reset() {
         this.count = 0;
         for (let i in this.questionArr) {
            for (let j in this.questionArr[i].assessProjects) {
               this.questionArr[i].assessProjects[j].number = null;
               this.questionArr[i].assessProjects[j].fliterNum = false;
               for (let k in this.questionArr[i].assessProjects[j]
                  .projectConditions) {
                  this.questionArr[i].assessProjects[j].projectConditions[
                     k
                  ].selected = false;
               }
            }
         }
         this.$forceUpdate();
      },
      submit() {
         this.$confirm("是否确认提交", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
         })
            .then(() => {
               let submitIf = "";
               let submitArr = [];
               let submitObj = {
                  patientId: this.patName,
                  projectId: this.projectId,
                  assessResult: this.count
               };
               for (let i in this.questionArr) {
                  for (let j in this.questionArr[i].assessProjects) {
                     for (let k in this.questionArr[i].assessProjects[j]
                        .projectConditions) {
                        if (
                           this.questionArr[i].assessProjects[j]
                              .projectConditions[k].selected == true
                        ) {
                           submitArr.push({
                              assessProjectId: this.questionArr[i]
                                 .assessProjects[j].projectConditions[k]
                                 .assessProjectId,
                              assessConditionId: this.questionArr[i]
                                 .assessProjects[j].projectConditions[k]
                                 .assessConditionId,
                              patientId: this.patName
                           });
                        }
                     }
                  }
               }
               if (submitArr.length == 0) {
                  this.$message({
                     type: "warning",
                     showClose: true,
                     message: "未进行评估"
                  });
                  return;
               }
               let params = {
                  assessProjectRecords: submitArr,
                  assessRecord: submitObj
               };
               addAss(params).then(response => {
                  this.$message({
                     type: "success",
                     showClose: true,
                     message: "提交成功"
                  });
                  this.getList();

                  if (this.flagpage) {
                     let params = {
                        id: this.flowDateId,
                        specificStepId: 2
                     };
                     putflow(params).then(res => {});
                     this.getAssess(this.mess.patientId);
                     this.changeflagpage(2);
                     this.sub()
                  }
               });
            })
            .catch(() => {
               this.$message({
                  type: "info",
                  message: "已取消提交"
               });
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
.panel-heading {
   padding: 10px 15px;
   border-bottom: 1px solid transparent;
   border-top-left-radius: 3px;
   border-top-right-radius: 3px;
   border-color: #ddd;
}
.panel-title {
   font-size: 16px;
   font-weight: 600;
   float: left;
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
   // line-height: 30px;
   width: 115px;
   height: 47.5px;
   padding: 0;
   border: 1px solid #ddd;
   // text-align: center;
   // vertical-align: middle;
}
.content {
   margin-top: 20px;
   text-align: center;
}
.submit {
   background: #409eff !important;
   color: #fff !important;
   text-align: center;
}
.combined {
   display: inline-block;
   width: 24%;
   margin-right: 33%;
}
.total {
   display: inline-block;
   width: 9.4%;
   margin-left: 33.4%;
}
#input {
   width: 15%;
}
#typeTd {
   width: 20%;
}
@media screen and (max-width: 1024px) {
   .main {
      width: 830px;
   }
}
@media screen and (max-width: 768px) {
   .main {
      width: 600px;
   }
}
.td_span {
   // display: inline-block;
   width: 100%;
   display: flex;
   align-items: center;
   justify-content: center;
   height: 47.5px;
   // height: 100%;
   border-bottom: 1px solid #dddddd;
   overflow: hidden;
}
// .cond_td>span{
//   border-bottom: 1px solid #dddddd;
// }
.td_span:last-child {
   border-bottom: none !important;
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
</style>