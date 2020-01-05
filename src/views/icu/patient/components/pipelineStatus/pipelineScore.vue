<template>
   <!-- 管路评分 -->
   <div class="pipelineScore">
      <div>
         <h3 class="panel-title">导管评分</h3>
         <div class="perinfo">
            <span>姓名: &nbsp;{{form.patientName}}</span>&nbsp;
            <span>住院号: &nbsp;{{form.hospitalnumber}}</span>&nbsp;
            <span>性别：&nbsp;{{form.gender | sex}}</span>&nbsp;
            <span>年龄：&nbsp;{{form.age}}岁</span>&nbsp;
            <!-- <span>管路：&nbsp;{{form.pipingName}}</span>&nbsp; -->
            <span>诊断：&nbsp;{{form.diagnosis}}</span>&nbsp;
         </div>
      </div>
      <table class="table table-bordered">
         <thead>
            <tr>
               <td colspan="2" style="text-align: center;">导管滑脱风险类型</td>
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
      </div> -->
      <div class="operation">
         <el-button @click="close()">返回</el-button>
         <el-button @click="sub()" class="el-button el-button--primary" :loading="loading">提交</el-button>
      </div>
   </div>
</template>

<script>
import { catheterScore, subAdd } from "@/api/icu/patient/pipelineStatus";
import { setTimeout } from "timers";
export default {
   name: "pipelineScore",
   props: {
      patientInfos: Object
   },
   data() {
      return {
         projects: [],
         project: [],
         projectId: "",
         form: {
            patientId: "",
            patientName: "",
            hospitalnumber: "",
            gender: "",
            age: "",
            diagnosis: "",
            pipingName: "",
            // 管道使用记录id
            pipUseRecordId: ""
         },
         count: null,
         formFlur: [],
         loading: false
      };
   },
   watch: {
      patientInfos: {
         handler(newValue, oldValue) {
            this.patientInfos = newValue;
            this.close();
            this.formData();
         },
         deep: true
      }
   },
   mounted() {
      this.formData();
      this.getList();
   },
   methods: {
      getList() {
         catheterScore({
            projectCode: "slippage",
            patientId: this.patientInfos.patientId
         })
            .then(response => {
               this.projects = response.data.data.data;
               this.projectId = response.data.data.data[0].projectId;
               // console.log(this.projects);
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
                        if (this.patientInfos.age) {
                           // 年龄一
                           if (items.projectName == "年龄一") {
                              if (this.patientInfos.age < 7) {
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
                                          // console.log(state);
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
                                    // console.log(this.projects);
                                    this.$forceUpdate();
                                 }, 0);
                              }
                           }
                           // 年龄二
                           if (items.projectName == "年龄二") {
                              if (this.patientInfos.age > 70) {
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
                                          // console.log(state);
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
                                    // console.log(this.projects);
                                    this.$forceUpdate();
                                 }, 0);
                              }
                           }
                        }
                     });
                  });
               });
            })
            .catch(() => {
               console.log("管路错误");
            });
      },
      formData() {
         this.form.patientName = this.patientInfos.name;
         this.form.hospitalnumber = this.patientInfos.hospitalnumber;
         this.form.age = this.patientInfos.age;
         this.form.gender = this.patientInfos.gender;
         this.form.diagnosis = this.patientInfos.diagnosis;
         this.form.pipingName = this.patientInfos.pipingName;
         this.form.pipUseRecordId = this.patientInfos.useRecordsId;
         this.form.patientId = this.patientInfos.patientId;
      },
      close() {
         this.$parent.parentMethod();
         this.loading = false;
      },
      sub() {
         // console.log(this.form);
         if (this.count) {
            this.loading = true;
            let pat = {
            projectId: this.projectId,
            patientId: this.form.patientId,
            assessResult: this.count,
            remarks: this.form.pipUseRecordId
         };
         let obj = {
            assessProjectRecords: this.formFlur,
            assessRecord: pat
         };
         // console.log(obj)
         subAdd(obj)
            .then(() => {
               this.$message({
                  showClose: true,
                  message: "提交成功",
                  type: "success"
               });
               this.close();
            })
            .catch(() => {
               // this.loading = false;
            });
         }else{
            this.$message.warning('请做出选择')
         }
      },
      change(q, i, j) {
         this.projects.forEach(item => {
            item.assessProjects.forEach(items => {
               items.projectConditions.forEach((items1, index) => {
                  if (item.assessTypeId == q.assessTypeId) {
                     if (items1.assessConditionId == j.assessConditionId) {
                        // 某一项目下 支持多选 分值不会累加
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
                              this.formFlur.splice(index, 1);
                           } else {
                              this.formFlur.splice(index, 1);
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
                        let fliter = item.assessProjects.some(
                           (value, index) => {
                              return value.flagPro == true;
                           }
                        );
                        // console.log(fliter);
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
                  }
               });
            });
         });
         // console.log(this.formFlur);
         // console.log(this.projects);
         // console.log(this.project);
         this.$forceUpdate();
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
<style scoped="scoped" lang="scss">
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
   // div {
   //    margin: 10px 0;
   // }
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

</style>


