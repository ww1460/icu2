<template>
   <!-- 管路评分 -->
   <basic-container>
      <div class="pipelineScore">
         <div class="clearfix panel-heading" v-if="!parentIf">
            <h3 class="panel-title">导管评分</h3>
            <div class="perinfo">
               <span>姓名: &nbsp;{{patInfo.name}}</span>&nbsp;
               <span>性别：&nbsp;{{patInfo.gender| genderFl }}</span>&nbsp;
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
         <div v-if="!parentIf" id="main" style="height: 300px;margin-bottom: 25px" class="main"></div>
         <table class="table table-bordered" v-loading="loading">
            <thead>
               <tr>
                  <td colspan="2" style="text-align: center;">导管滑脱风险项目</td>
                  <td>分值</td>
                  <td>得分</td>
               </tr>
            </thead>
            <tbody v-for="(item,index) in projects" :key="index">
               <tr>
                  <td :rowspan="item.assessProjects.length +1">{{item.assessType}}</td>
               </tr>
               <tr v-for="(i,index1) in item.assessProjects" :key="index1">
                  <td>
                     <!-- <span v-for="(j,index2) in i.projectConditions" :key="index2">{{j.assessCondition}}</span> -->
                     <div style="display:flex;align-items: center;flex-wrap: wrap;">
                        <el-checkbox-group
                           v-model="project"
                           v-for="(j,index2) in i.projectConditions"
                           :key="index2"
                           @change="change(item,i,j)"
                           :disabled="i.lightflagPro"
                        >
                           <el-checkbox
                              :label="j.assessCondition"
                              :value="j.assessConditionId"
                              style="padding-left:10px"
                              :disabled="parentIf"
                           ></el-checkbox>
                        </el-checkbox-group>
                     </div>
                  </td>
                  <td>{{i.projectConditions[0].assessScore}}</td>
                  <td>{{i.number}}</td>
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
         <!-- <div style="padding:15px 5px;">
            <p>
               <strong>说明</strong>：护士根据患者病情在相应栏内进行勾选或填写代号。管道种类栏内填写管道代号及分值。评估患者得分越高表示导管滑脱风险性越高。
            </p>
            <p
               style="text-indent: 2em"
            >1.导管滑脱风险度分为：Ⅰ度、Ⅱ度、Ⅲ度，多条管道按危险度累加（如2条中危管道为4分）。Ⅰ度：评分＜8分，有发生导管滑脱的可能，但风险较低，需采取相应的预防措施；Ⅱ度：评分为8-12分，容易发生导管滑脱；Ⅲ度：评分＞12分，随时可能发生导管滑脱，躁动患者应列入高度危险。</p>
            <p
               style="text-indent: 2em"
            >2.评估时机：入院时、转入时、手术后留置各种导管的，进行首次评估，以后高危（Ⅲ度）导管每班评估，中危（Ⅱ度）导管每天评估，低危（Ⅰ度）导管每周评估2次，有异常情况随时评估，直至拔管。</p>
            <p
               style="text-indent: 2em"
            >3.护理措施：评分＜8分：导管明确标识，妥善固定，保持通畅，加强宣教；评分≥8分：在上述措施的基础上，挂警示标识，加强巡视，床头交班，强化患者及家属的宣教，直至掌握。</p>
         </div>-->
         <div class="content" v-if="!parentIf">
            <el-button @click="reset()">清空</el-button>
            <el-button style="margin-left:5%" type="primary" @click="sub()" :loading="loading">提交</el-button>
         </div>
      </div>
   </basic-container>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { getEch, getAssess, addAss } from "@/api/icu/assessment/APACHE.js";
export default {
   name: "slipAss",
   props: {
      messages: Array
   },
   watch: {
      patientInfos: {
         handler(newValue, oldValue) {
            if (newValue == undefined) {
               return;
            }
            // console.log(newValue);
            this.form.patientName = newValue.name;
            this.form.hospitalnumber = newValue.hospitalnumber;
            this.form.age = newValue.age;
            this.form.gender = newValue.gender;
            this.form.diagnosis = newValue.diagnosis;
            // 患者id
            this.form.patientId = newValue.patientId;
            this.getList();
         },
         deep: true
      },
      messages: {
         handler(newValue, oldValue) {
            if (newValue == undefined) {
               return;
            }
            this.projects = newValue;
            console.log(this.projects);
            this.parentIf = true;
            this.projects.forEach(item => {
               item.assessProjects.forEach(items => {
                  Object.assign(items, {
                     number: null,
                     flagPro: false,
                     lightflagPro: true
                  });

                  // 根据年龄默认选择
                  items.projectConditions.forEach(items1 => {
                     // console.log(items1.assessConditionId)
                     // console.log(items1.assessConditionId)
                     items.pitchOnId.forEach(OnId => {
                        if (items1.assessConditionId == OnId) {
                           if (items.lightflagPro == true) {
                              this.count += items1.assessScore;
                           }
                           items.lightflagPro = false;
                           this.project.push(items1.assessCondition);
                           // console.log(this.project)
                        }
                     });
                     // console.log(items.pitchOnId[0]);
                     if (items.pitchOnId[0] == items1.assessConditionId) {
                        items.number = items1.assessResult;
                     }
                     // Object.assign(items1, { flag: false });
                     // 根据年龄默认选择
                  });
               });
            });
            console.log(this.project);
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
         projects: [],
         project: [],
         projectId: "",
         form: {
            patientId: "",
            patientName: "",
            hospitalnumber: "",
            gender: "",
            age: "",
            diagnosis: ""
         },
         loading: false,
         count: null,
         formFlur: [],
         projectCode: "slippage",
         projectId: "",
         min: "",
         max: "",
         name: "",
         range: [],
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
         num: "",
         watchArr: []
      };
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
   methods: {
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
      getList() {
         this.count = null;
         this.formFlur = [];
         this.project = [];
         this.loading = true;
         getAssess({ projectCode: "slippage", patientId: this.patName })
            .then(response => {
               this.projects = response.data.data.data;
               this.projectId = response.data.data.data[0].projectId;
               this.projects.forEach(item => {
                  item.assessProjects.forEach(items => {
                     Object.assign(items, {
                        number: null,
                        flagPro: false,
                        lightflagPro: false
                     });
                     // 根据年龄默认选择
                     items.projectConditions.forEach(items1 => {
                        Object.assign(items1, { flag: false });
                        // 有无年龄
                        if (this.patInfo.age) {
                           // 年龄一
                           if (items.projectName == "年龄一") {
                              if (this.patInfo.age < 7) {
                                 this.project.push(items1.assessCondition);
                                 items.flagPro = true;
                                 items.lightflagPro = false;
                                 items1.flag = true;
                                 this.count = items.number = items1.assessScore;
                                 let fliter = item.assessProjects.some(
                                    (value, index) => {
                                       return value.flagPro == true;
                                    }
                                 );
                                 setTimeout(() => {
                                    item.assessProjects.forEach(state => {
                                       if (fliter) {
                                          console.log(state);
                                          if (state.flagPro == false) {
                                             state.lightflagPro = true;
                                          } else {
                                             state.lightflagPro = false;
                                          }
                                       }
                                    });
                                    this.formFlur.push({
                                       assessProjectId:
                                          item.assessProjects[0]
                                             .assessProjectId,
                                       projectId: item.projectId,
                                       assessConditionId:
                                          item.assessProjects[0]
                                             .projectConditions[0]
                                             .assessConditionId
                                    });
                                    console.log(this.projects);
                                    this.$forceUpdate();
                                 }, 0);
                              }
                           }
                           // 年龄二
                           if (items.projectName == "年龄二") {
                              if (this.patInfo.age > 70) {
                                 this.project.push(items1.assessCondition);
                                 items.flagPro = true;
                                 items.lightflagPro = false;
                                 items1.flag = true;
                                 this.count = items.number = items1.assessScore;
                                 let fliter = item.assessProjects.some(
                                    (value, index) => {
                                       return value.flagPro == true;
                                    }
                                 );
                                 setTimeout(() => {
                                    item.assessProjects.forEach(state => {
                                       if (fliter) {
                                          console.log(state);
                                          if (state.flagPro == false) {
                                             state.lightflagPro = true;
                                          } else {
                                             state.lightflagPro = false;
                                          }
                                       }
                                    });
                                    this.formFlur.push({
                                       assessProjectId:
                                          item.assessProjects[1]
                                             .assessProjectId,
                                       projectId: item.projectId,
                                       assessConditionId:
                                          item.assessProjects[1]
                                             .projectConditions[0]
                                             .assessConditionId
                                    });
                                    console.log(this.projects);
                                    this.$forceUpdate();
                                 }, 0);
                              }
                           }
                        }
                     });
                  });
               });
               this.loading = false;
            })
            .catch(() => {
               console.log("管路错误");
            });
         let params = {
            patientId: this.patName,
            projectCode: this.projectCode
         };
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
      close() {
         this.$parent.parentMethod();
      },
      sub() {
         if (this.count) {
            this.$confirm("是否确认提交", "提示", {
               confirmButtonText: "确定",
               cancelButtonText: "取消",
               type: "warning"
            })
               .then(() => {
                  let pat = {
                     projectId: this.projectId,
                     patientId: this.patName,
                     assessResult: this.count,
                     remarks: this.form.pipUseRecordId
                  };
                  let obj = {
                     assessProjectRecords: this.formFlur,
                     assessRecord: pat
                  };
                  // console.log(obj);
                  addAss(obj).then(() => {
                     this.$message({
                        showClose: true,
                        message: "提交成功",
                        type: "success"
                     });
                     this.getList();
                  });
               })
               .catch(() => {
                  this.$message({
                     type: "info",
                     message: "已取消提交"
                  });
               });
         } else {
            this.$message.warning("请做出选择");
         }
      },
      change(q, i, j) {
         if (this.parentIf == true) {
            return;
         }
         this.projects.forEach(item => {
            item.assessProjects.forEach(items => {
               items.projectConditions.forEach((items1, index) => {
                  if (items1.assessConditionId == j.assessConditionId) {
                     for (let p in this.formFlur) {
                        if (
                           this.formFlur[p].assessConditionId ==
                           j.assessConditionId
                        ) {
                           this.formFlur.splice(p, 1);
                        }
                     }
                     if (j.flag == true) {
                        j.flag = false;
                        let status = items.projectConditions.some(
                           (value, index) => {
                              return value.flag == true;
                           }
                        );
                        if (status == false) {
                           this.count -= Number(i.number);
                           items.number = null;
                           items.flagPro = false;
                        }
                     } else {
                        if (items.flagPro == true) {
                           this.formFlur.push({
                              projectId: q.projectId,
                              assessProjectId: i.assessProjectId,
                              assessConditionId: j.assessConditionId
                           });
                        } else {
                           items.number = j.assessScore;
                           this.count += Number(i.number);
                           items.flagPro = true;
                           this.formFlur.push({
                              projectId: q.projectId,
                              assessProjectId: i.assessProjectId,
                              assessConditionId: j.assessConditionId
                           });
                        }
                        j.flag = true;
                     }
                     // 类型下的项目只允许单选
                     let fliter = item.assessProjects.some((value, index) => {
                        return value.flagPro == true;
                     });
                     console.log(fliter);
                     item.assessProjects.forEach(state => {
                        if (fliter) {
                           if (state.flagPro == false) {
                              state.lightflagPro = true;
                           } else {
                              state.lightflagPro = false;
                           }
                        } else {
                           state.lightflagPro = false;
                        }
                     });
                  }
               });
            });
         });

         this.$forceUpdate();
      },
      reset() {
         // console.log(this.projects);
         // console.log("清空")
         for (let i in this.projects) {
            for (let j in this.projects[i].assessProjects) {
               this.projects[i].assessProjects[j].number = null;
               this.projects[i].assessProjects[j].flagPro = false;
               this.projects[i].assessProjects[j].lightflagPro = false;
               for (let k in this.projects[i].assessProjects[j]
                  .projectConditions) {
                  this.projects[i].assessProjects[j].projectConditions[
                     k
                  ].flag = false;
               }
            }
         }
         this.count = null;
         this.project = [];
         this.formFlur = [];
         this.$forceUpdate();
      }
   }
};
</script>
<style scoped lang="scss">
.pipelineScore {
   .el-input__inner {
      border-top: 0;
      border-left: 0;
      border-right: 0;
      border-radius: 0;
   }
}
.pipelineScore .table-bordered th,
.pipelineScore .table-bordered td,
.pipelineScore .table-bordered tr {
   border: 1px solid #ebeef5;
   text-align: center;
   padding: 7px 10px;
   width: 1px;
   span {
      font-size: 14px;
   }
}
.pipelineScore .size {
   font-size: 16px !important;
   font-weight: 530;
   padding-left: 10px;
}
.pipelineScore .border {
   border-bottom: 1px solid #ebeef5;
   margin: 0;
}
.pipelineScore .border:last-child {
   border-bottom: 0px solid #ebeef5;
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
   text-align: right;
   width: 70%;
   margin-bottom: 30px;
}
.total {
   display: inline-block;
   width: 9.4%;
   margin-left: 33.4%;
   font-weight: 600;
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
.clearfix:after {
   content: "";
   display: block;
   clear: both;
}
.panel-heading {
   padding: 10px 15px;
   margin-bottom: 15px;
   border-bottom: 1px solid transparent;
   border-top-left-radius: 3px;
   border-top-right-radius: 3px;
   border-color: #ddd;
}
.content {
   margin-top: 20px;
   text-align: center;
}
</style>


