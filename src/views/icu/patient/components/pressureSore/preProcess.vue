<template>
   <!-- 压疮流程 -->
   <div class="process">
      <div class="alignCenter">
         <p>
            <span :class="['border',(firstColor?'el-link el-link--primary':'')]" @click="first()">压疮</span>
         </p>
         <p>
            <img src="/img/entryDepartment/lc_1_01.png" alt />
         </p>
         <p>
            <span
               :class="['border',(secondColor?'el-link el-link--primary':'')]"
               @click="firstAssessment()"
            >初次评估</span>
         </p>
         <p>
            <img src="/img/entryDepartment/lc_1_01.png" alt />
         </p>
         <p>
            <span
               :class="['border',(thirdColor?'el-link el-link--primary':'')]"
               @click="result()"
            >评估结果[{{assessResult}}]</span>
         </p>
         <p>
            <img src="/img/entryDepartment/jian4-1.png" alt />
         </p>
         <p>
            <span
               class="border"
               :class="['border',(fourthColor?'el-link el-link--primary':'')]"
               @click="riskPatients(4)"
            >低风险患者</span>
            <span
               class="border"
               :class="['border',(fifthColor?'el-link el-link--primary':'')]"
               @click="riskPatients(5)"
            >中、高危风险患者</span>
            <span
               class="border"
               :class="['border',(sixthColor?'el-link el-link--primary':'')]"
               @click="riskPatients(6)"
            >极高危患者</span>
            <span
               class="border"
               :class="['border',(seventhColor?'el-link el-link--primary':'')]"
               @click="riskPatients(7)"
            >病情变化者</span>
         </p>
         <p>
            <span class="border alignCenter">
               <img src="/img/entryDepartment/lc_1_01.png" class="img" alt />
            </span>
            <span class="border alignCenter">
               <img src="/img/entryDepartment/lc_1_01.png" class="img" alt />
            </span>
            <span class="border alignCenter">
               <img src="/img/entryDepartment/lc_1_01.png" class="img" alt />
            </span>
            <span class="border alignCenter">
               <img src="/img/entryDepartment/lc_1_01.png" class="img" alt />
            </span>
         </p>
         <p>
            <span
               class="border alignCenter"
               :class="['border',(fourthColor?'el-link el-link--primary':'')]"
            >每周评估1次</span>
            <span
               class="border alignCenter"
               :class="['border',(fifthColor?'el-link el-link--primary':'')]"
            >至少3天评估1次</span>
            <span
               class="border alignCenter"
               :class="['border',(sixthColor?'el-link el-link--primary':'')]"
            >2天评估1次</span>
            <span
               class="border alignCenter"
               :class="['border',(seventhColor?'el-link el-link--primary':'')]"
            >随时进行评估</span>
         </p>
         <p>
            <img src="/img/entryDepartment/yachaung34.png" alt />
         </p>
         <p>
            <span
               :class="['border',(eighthColor?'el-link el-link--primary':'')]"
               style="position: relative;left:-47px"
               v-popover:popover4
            >采取适当防范措施</span>
            <el-popover
               ref="popover4"
               placement="bottom"
               width="500"
               trigger="click"
               v-if="eighthColorFlag"
            >
               <div class="content">
                  <p>
                     <el-button icon="el-icon-arrow-left" @click="prev()"></el-button>
                  </p>
                  <p>
                     <el-button
                        :type="item.flag == flag?'primary':''"
                        size="mini"
                        round
                        v-for="(item,index) in measures"
                        :key="index"
                        @click="task(item)"
                     >{{item.taskContent}}</el-button>
                  </p>
                  <p>
                     <el-button icon="el-icon-arrow-right" @click="next()"></el-button>
                  </p>
               </div>
            </el-popover>
            <span
               :class="[(tenthColor?'el-link el-link--primary':'')]"
               style="position: relative;width: 180px;display: inline-block;text-align: center;font-size: 15px;cursor: pointer;"
               @click="pressure()"
            >高危、极高危压疮申报表</span>
            <span
               :class="['border',(ninthColor?'el-link el-link--primary':'')]"
               style="position: relative;right:-55px"
               @click="outHospital()"
            >院外带入发生时间</span>
         </p>
         <p>
            <img src="/img/entryDepartment/5-1_04.png" alt />
         </p>
         <p>
            <span
               :class="[(eleventhColor?'el-link el-link--primary':'')]"
               style="cursor: pointer;"
               @click="record()"
            >是</span>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span
               :class="[(thirteenthColor?'el-link el-link--primary':'')]"
               style="cursor: pointer;"
               @click="no()"
            >否</span>
         </p>
         <p>
            <img src="/img/entryDepartment/5-1_04.png" style="position: relative;left: 44px;" alt />
         </p>
         <p>
            <span
               :class="[(fourteenColor?'el-link el-link--primary':'')]"
               style="position: relative;left: 55px;cursor: pointer;"
               @click="callNursingDepartmen()"
            >电话告知护理部</span>
            <span
               :class="[(twelfthColor?'el-link el-link--primary':'')]"
               style="position: relative;left: 85px;cursor: pointer;"
               @click="notice()"
            >高危、极高危风险告知书</span>
         </p>
      </div>
      <!-- <p>
        <img src="/img/entryDepartment/lc_1_01.png" alt />
      </p>
      <p>
        <span :class="['border',(thirteenthColor?'color':'')]" @click="monitor()">压力性损伤评估监控表</span>
      </p>-->
      <div class="operation">
         <el-button @click="reset()">重置</el-button>
         <!-- <el-button @click="sub()">提交</el-button> -->
      </div>
      <el-dialog title="任务描述" :visible.sync="dialogFormVisible">
         <el-form>
            <el-form-item label="任务名称" :label-width="formLabelWidth">
               <el-input v-model="projectName" autocomplete="off" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="任务结果" :label-width="formLabelWidth">
               <el-button
                  @click="changeDevBtn(state)"
                  :type="state.id == id?'primary':''"
                  v-for="state in form"
                  :key="state.id"
                  style="margin:10px 10px 10px 0px"
               >{{state.recordValue}}</el-button>
               <el-input v-model="taskResult" v-if="formFlag"></el-input>
            </el-form-item>
         </el-form>
         <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="sureTask" :loading="sureTaskLoading">保 存</el-button>
            <el-button @click="closeTask">取 消</el-button>
         </div>
      </el-dialog>
   </div>
</template>

<script>
import {
   pMea,
   queryTask,
   getScore,
   addTask
} from "@/api/icu/patient/PreDeclaration";
import { upDateProcess } from "@/api/icu/patient/process";
import { queryProcess, addProcess } from "@/api/icu/patient/process";
import { mapState } from "vuex";
export default {
   name: "preProcess",
   props: {
      message: Object
   },
   data() {
      return {
         measures: [],
         // patientInfo: {},
         flag: false,
         firstColor: false,
         secondColor: false,
         thirdColor: false,
         fourthColor: false,
         fifthColor: false,
         sixthColor: false,
         seventhColor: false,
         eighthColor: false,
         ninthColor: false,
         tenthColor: false,
         eleventhColor: false,
         twelfthColor: false,
         thirteenthColor: false,
         fourteenColor: false,
         dialogFormVisible: false,
         sureTaskLoading: false,
         formLabelWidth: "120px",
         // 当前流程id
         process: {},
         processArr: [],
         // 分数
         assessResult: "",
         // 任务弹框
         form: {},
         projectName: "",
         id: "",
         temData: {},
         // 提交的表单
         formFule: {},
         // 无任务
         taskResult: "",
         rowData: {},
         formFlag: false,
         eighthColorFlag: true
      };
   },

   watch: {
      message: {
         handler(newValue, oldValue) {
            this.message = newValue;
            // this.patientInfo = newValue;
            this.startProcess();
            this.getList();
            // 初始化切换患者 所有不高亮
            this.firstColor = false;
            this.secondColor = false;
            this.thirdColor = false;
            this.fourthColor = false;
            this.fifthColor = false;
            this.sixthColor = false;
            this.seventhColor = false;
            this.eighthColor = false;
            this.ninthColor = false;
            this.tenthColor = false;
            this.eleventhColor = false;
            this.twelfthColor = false;
            this.thirteenthColor = false;
            this.fourteenColor = false;
         },
         deep: true
      },
      eleventhColor: {
         handler(newValue, oldValue) {
            // console.log(newValue);
         },
         deep: true
      },
      processArr: {
         handler(newValue, oldValue) {
            this.processArr = newValue;
         },
         deep: true
      },
      assessResult(val) {
         this.$parent.assessResult = val;
      }
   },
   created() {},
   mounted() {
      if (this.message.patientId) {
         this.startProcess();
         this.getList();
      }
   },
   methods: {
      getList() {
         // taskName: '压疮护理'   采取适当防范措施 默认参数
         // Object.assign({ taskName: '压疮护理' })
         pMea({})
            .then(response => {
               // console.log(response);
               this.measures = response.data.data;
               if (this.measures.length) {
                  this.eighthColorFlag = true;
               } else {
                  this.eighthColorFlag = false;
               }
            })
            .catch(() => {
               this.eighthColorFlag = false;
               console.log("请求防范措施失败");
            });
         this.assessmentGetScore();
      },
      assessmentGetScore() {
         getScore(
            Object.assign({
               patientId: this.message.patientId,
               projectCode: "Braden"
            })
         )
            .then(response => {
               // console.log(response);
               this.assessResult = response.data.data[0].assessResult + "分";
               // console.log(this.assessResult);
            })
            .catch(() => {
               this.assessResult = "无评分";
               // console.log("请求压疮评估分数失败");
            });
      },
      // 防范措施-----------------
      next() {
         if (this.message.patientId) {
            this.measures.push(this.measures.shift());
         }
      },
      prev() {
         if (this.message.patientId) {
            this.measures.unshift(this.measures.pop());
         }
      },
      task(item) {
         this.startProcess().then(val => {
            this.temData = item;
            this.projectName = item.taskContent;
            this.dialogFormVisible = true;
            queryTask(item).then(response => {
               // console.log(response);
               if (response.data.data.msg == "0") {
                  this.formFlag = true;
               } else if (response.data.data.msg == "1") {
                  this.formFlag = false;
                  this.form = response.data.data.data[0].projectRecordValues;
               }
            });
         });

         // });
      },
      changeDevBtn(row) {
         this.id = row.id;
         // console.log(row)
         this.temData.result = row.recordValue;
         Object.assign(this.temData, row);
      },
      closeTask() {
         this.dialogFormVisible = false;
         this.form = {};
         this.id = "";
         this.temData = {};
         this.taskResult = "";
         this.sureTaskLoading = false;
      },
      sureTask() {
         if (this.taskResult.length > 0) {
            this.temData.result = this.taskResult;
         }
         this.temData.patientId = this.message.patientId;
         // console.log(this.temData);
         this.sureTaskLoading = true;
         addTask(this.temData)
            .then(() => {
               this.$message({
                  showClose: true,
                  message: "采取成功",
                  type: "success"
               });
               if (this.processArr.indexOf("8") == -1) {
                  upDateProcess({
                     flowName: 3,
                     specificStepId: 8,
                     patientId: this.message.patientId,
                     id: this.process.id
                  });
                  this.eighthColor = true;
               }
               this.dialogFormVisible = false;
               this.closeTask();
            })
            .catch(() => {
               this.$message.error("采取失败");
               this.closeTask();
            });
      },
      // ------------------------------

      pressure() {
         this.startProcess().then(val => {
            // console.log(this.$parent);
            this.$parent.pressureMethod(this.process, this.processArr);
         });
      },
      notice() {
         this.startProcess().then(val => {
            if (val.indexOf("13") != -1) {
               if (val.indexOf("11") == -1) {
                  this.$parent.noticeMethod(this.process, this.processArr);
               }
            }
         });
      },
      record() {
         this.startProcess().then(val => {
            this.$parent.recordMethod(this.process, this.processArr);
         });
      },
      monitor() {
         this.$parent.monitorMethod();
      },

      // 流程高亮
      startProcess() {
         return new Promise((resolve, reject) => {
            // 无患者不能操作
            if (this.message.patientId) {
               queryProcess({ flowName: 3, patientId: this.message.patientId })
                  .then(response => {
                     this.process = response.data.data;
                     this.processArr = response.data.data.specificStepId.split(
                        ","
                     );
                     // console.log(this.processArr);
                     this.processArr.forEach(item => {
                        if (item == "1") {
                           this.firstColor = true;
                        } else if (item == "2") {
                           this.secondColor = true;
                        } else if (item == "3") {
                           this.thirdColor = true;
                        } else if (item == "4") {
                           this.fourthColor = true;
                        } else if (item == "5") {
                           this.fifthColor = true;
                        } else if (item == "6") {
                           this.sixthColor = true;
                        } else if (item == "7") {
                           this.seventhColor = true;
                        } else if (item == "8") {
                           this.eighthColor = true;
                        } else if (item == "9") {
                           this.ninthColor = true;
                        } else if (item == "10") {
                           this.tenthColor = true;
                        } else if (item == "11") {
                           this.eleventhColor = true;
                        } else if (item == "12") {
                           this.twelfthColor = true;
                        } else if (item == "13") {
                           this.thirteenthColor = true;
                        } else if (item == "14") {
                           this.fourteenColor = true;
                        }
                     });
                     this.$store.commit("SET_PROCESS_ARR", this.processArr);
                     resolve(this.processArr);
                  })
                  .catch(() => {
                     this.$confirm(
                        "是否对患者“" + this.message.name + "”重新创建压疮流程",
                        "提示",
                        {
                           confirmButtonText: "确定",
                           cancelButtonText: "取消",
                           type: "warning"
                        }
                     ).then(() => {
                        return addProcess({
                           flowName: 3,
                           patientId: this.message.patientId
                        }).then(response => {
                           this.firstColor = true;
                           this.result();
                        });
                     });
                  });
            }
         });
         // 判断是否有无流程
      },
      // 重新创建流程按钮
      reset() {
         if (this.message.patientId) {
            this.$confirm(
               "是否对患者“" + this.message.name + "”创建压疮流程",
               "提示",
               {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
               }
            ).then(() => {
               return addProcess({
                  flowName: 3,
                  patientId: this.message.patientId
               }).then(response => {
                  this.firstColor = true;
                  this.secondColor = false;
                  this.thirdColor = false;
                  this.fourthColor = false;
                  this.fifthColor = false;
                  this.sixthColor = false;
                  this.seventhColor = false;
                  this.eighthColor = false;
                  this.ninthColor = false;
                  this.tenthColor = false;
                  this.eleventhColor = false;
                  this.twelfthColor = false;
                  this.thirteenthColor = false;
                  this.fourteenColor = false;
                  this.result();
               });
            });
         } else {
            this.$message.warning("无患者");
         }
      },
      // 第一步压疮
      first() {
         this.startProcess();
      },
      // 初次评估
      firstAssessment() {
         this.startProcess().then(val => {
            this.$parent.scoreMethod(this.message);
            // this.$store.commit("SET_DISABLE");
            this.result();
         });
      },
      // 评估结果
      result() {
         if (this.assessResult != "无评分") {
            this.startProcess().then(val => {
               if (val.indexOf("2") == -1 && val.indexOf("3") == -1) {
                  upDateProcess({
                     flowName: 3,
                     specificStepId: "2,3",
                     patientId: this.message.patientId,
                     id: this.process.id
                  });
                  this.secondColor = true;
                  this.thirdColor = true;
               }
            });
         } else {
            this.$message({
               message: "请做压疮评估",
               type: "warning"
            });
         }
      },
      // 风险
      riskPatients(data) {
         if (this.assessResult == "无评分") {
            this.$message({
               message: "请做压疮评估",
               type: "warning"
            });
            return;
         } else {
            this.startProcess().then(val => {
               if (
                  val.indexOf("4") == -1 &&
                  val.indexOf("5") == -1 &&
                  val.indexOf("6") == -1 &&
                  val.indexOf("7") == -1
               ) {
                  this.$confirm("确认提交？", {
                     confirmButtonText: "确定",
                     cancelButtonText: "取消",
                     type: "warning"
                  }).then(() => {
                     if (val.indexOf("4") == -1) {
                        if (data == 4) {
                           upDateProcess({
                              flowName: 3,
                              specificStepId: data,
                              patientId: this.message.patientId,
                              id: this.process.id
                           });
                           // 提交后流程高亮
                           this.fourthColor = true;
                        }
                     }
                     if (val.indexOf("5") == -1) {
                        if (data == 5) {
                           upDateProcess({
                              flowName: 3,
                              specificStepId: data,
                              patientId: this.message.patientId,
                              id: this.process.id
                           });
                           // 提交后流程高亮
                           this.fifthColor = true;
                        }
                     }
                     if (val.indexOf("6") == -1) {
                        if (data == 6) {
                           upDateProcess({
                              flowName: 3,
                              specificStepId: data,
                              patientId: this.message.patientId,
                              id: this.process.id
                           });
                           // 提交后流程高亮
                           this.sixthColor = true;
                        }
                     }
                     if (val.indexOf("7") == -1) {
                        if (data == 7) {
                           upDateProcess({
                              flowName: 3,
                              specificStepId: data,
                              patientId: this.message.patientId,
                              id: this.process.id
                           });
                           // 提交后流程高亮
                           this.seventhColor = true;
                        }
                     }
                     this.startProcess().then(val => {
                        this.result();
                     });
                  });
               }
            });
         }
      },
      // 院外带入压力性损伤
      outHospital() {
         this.startProcess().then(val => {
            this.$parent.outHospitalMethod(this.process, this.processArr);
         });
      },
      // 电话告知护理部
      callNursingDepartmen() {
         this.startProcess().then(val => {
            if (val.indexOf("13") != -1) {
               if (val.indexOf("11") == -1) {
                  if (val.indexOf("14") == -1) {
                     this.$confirm("是否电话通知护理部?", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                     })
                        .then(() => {
                           upDateProcess({
                              flowName: 3,
                              specificStepId: 14,
                              patientId: this.message.patientId,
                              id: this.process.id
                           });
                        })
                        .then(() => {
                           this.$message({
                              showClose: true,
                              message: "通知成功",
                              type: "success"
                           });
                           // 提交后流程高亮
                           this.fourteenColor = true;
                        });
                  } else {
                     this.$message({
                        message: "已电话通知护理部",
                        type: "success"
                     });
                  }
               }
            }
         });
      },
      no() {
         this.startProcess().then(val => {
            if (val.indexOf("11") == -1) {
               if (val.indexOf("13") == -1) {
                  this.$confirm("是否走下面流程", {
                     confirmButtonText: "确定",
                     cancelButtonText: "取消",
                     type: "warning",
                     dialogFormVisible: true
                  }).then(() => {
                     upDateProcess({
                        flowName: 3,
                        specificStepId: 13,
                        patientId: this.message.patientId,
                        id: this.process.id
                     });
                     // 提交后流程高亮
                     this.thirteenthColor = true;
                  });
               }
            }
         });
      }
   }
};
</script>
<style scoped="scoped" lang="scss">
.alignCenter {
   text-align: center;
   position: relative;
}
.border {
   width: 135px;
   display: inline-block;
   text-align: center;
   font-size: 15px;
   cursor: pointer;
}
.color {
   color: #409eff;
}
// .width {
//    width: 150px;
//    height: 30px;
// }
// .pos {
//    position: absolute;
//    // height: 45px;
// }
// .re {
//    position: relative;
// }

.content {
   // height:50px;
   // 重点，为了不会换行显示
   display: flex;
   p:nth-child(2) {
      width: 386px;
      line-height: 36px;
      text-align: center;
      padding: 0px 10px;
   }
}
.task {
   background: #409eff;
   color: #fff;
}
.process .operation {
   text-align: center;
   padding: 50px 0;
   background-color: #fff !important;
   button {
      margin-left: 0;
   }
}
.rapidTask {
   width: 560px;
   position: absolute;
   right: 150px;
   top: 0;
}
.rapidTask .btn {
   float: left;
   // padding: 0 5px 0 5px !important;
   width: 30px !important;
   margin-left: 10px;
   margin-right: 10px;
   margin-bottom: 10px;
}
.btnBox {
   width: 400px;
   height: 40px;
   float: left !important;
   // overflow: hidden;
   overflow-x: scroll;
   scrollbar-width: none;
   overflow: -moz-scrollbars-none;
   // position: relative;
}
.btnOverflow {
   // width: 10000px
   // position: absolute
   white-space: nowrap;
}
.clearfix:after {
   content: "";
   clear: both;
   display: block;
}
</style>


