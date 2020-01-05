<template>
   <!-- 患者压疮 -->
   <div class="pressure" id="pressureTop">
      <div class="indexCon">
         <div class="indexNurse" v-show="flag">
            <div class="nursePhoto">
               <humanModel
                  :patientRecord="patient"
                  :byStage="byStages"
                  :prePosition="prePosition"
                  ref="brightMethodsChild"
               />
            </div>
            <div class="nurseInfo">
               <p class="diseaseDescription">
                  <span>住院号：</span>
                  {{messages.hospitalnumber}}
               </p>
               <p class="diseaseDescription">
                  <span>床号：</span>
                  {{messages.bedName}}
               </p>
               <p class="diseaseDescription">
                  <span>患者：</span>
                  {{messages.name}}
               </p>
               <p class="diseaseDescription">
                  <span>年龄：</span>
                  {{messages.age}}
               </p>
               <p class="diseaseDescription">
                  <span>性别：</span>
                  {{messages.gender|sex}}
               </p>
               <p class="diseaseDescription">
                  <span>入科诊断：</span>
                  {{messages.diagnosis}}
               </p>
            </div>
         </div>
         <!-- 流程图 -->
         <div class="record" v-show="flag">
            <el-button
               @click="changeDevBtn(1)"
               :class="['el-button--small',(devBtn == 1?'el-button el-button--primary':'')]"
            >流程图</el-button>
            <el-button
               @click="changeDevBtn(2)"
               :class="['el-button--small',(devBtn == 2?'el-button el-button--primary':'')]"
            >压疮记录</el-button>

            <!-- 压疮流程 -->
            <preProcess :message="messages" ref="recordChild" v-show="!tigger" />
            <!-- 表格 -->
            <div v-show="tigger">
               <avue-crud
                  :data="tableData"
                  :option="option"
                  @row-click="handleRowClick"
                  :table-loading="tableLoading"
               >
                  <template slot="skinConditionPicture" slot-scope="scope">
                     <div @click="ImgClick(scope.row)">
                        <img
                           :src="scope.row.skinConditionPicture"
                           :id="scope.row.id + 1"
                           alt
                           style="width:10vw; cursor: pointer;"
                           v-if="scope.row.skinConditionPicture"
                        />
                     </div>
                  </template>
               </avue-crud>
               <template>
                  <div style="width:100%;position:relative;height:50px">
                     <el-pagination
                        :page-sizes="[10,20,30,40, 50,100]"
                        :pager-count="5"
                        :current-page="currentPage"
                        :page-size="pageSize"
                        :total="total"
                        layout="total, sizes, prev, pager, next, jumper"
                        style="position:absolute;right:1%;margin-top:2%"
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                     ></el-pagination>
                  </div>
               </template>
            </div>
         </div>
      </div>
      <!-- 点击图片放大 -->
      <el-dialog :visible.sync="dialogTableVisibleImg" class="dialogImg">
         <div class="Img_div">
            <img align="center" id="dia_img" alt />
         </div>
      </el-dialog>
      <!-- 难免压疮申报表 -->
      <div v-if="flag1">
         <PreDeclaration :message="messages" ref="PreDeclarationChild" />
      </div>
      <!-- 难免压疮风险告知书 -->
      <div v-if="flag2">
         <pressureNotice :message="messages" />
      </div>
      <!-- 压疮护理记录单 -->
      <div v-if="flag3">
         <nurseRecord :patientConditions="messages" />
      </div>
      <!-- 压力性损伤评估监控表 -->
      <div v-if="flag4">
         <monitoringTable />
      </div>
      <!-- 压疮评分 -->
      <div v-if="flag5">
         <score :message="messages" />
      </div>
      <!-- 院外带入压力性损伤 -->
      <!-- <div v-if="flag6">
         <outsideHospital />
      </div>-->
      <el-dialog title="院外带入" :visible.sync="flag6">
         <el-form :model="occurrence">
            <el-form-item label="压疮发生时间" prop="occurrenceTime">
               <el-date-picker
                  v-model="occurrence.occurrenceTime"
                  type="datetime"
                  placeholder="选择日期时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :picker-options="pickerOptions"
               ></el-date-picker>
            </el-form-item>
         </el-form>
         <div slot="footer" class="dialog-footer">
            <el-button
               type="primary"
               @click="occurrenceTimeSure()"
               class="el-button el-button--primary"
               :loading="occurrenceTimeSureFlag"
            >保 存</el-button>
            <el-button @click="flag6 =false">取 消</el-button>
         </div>
      </el-dialog>
   </div>
</template>

<script>
import {
   addNurseRecord,
   query,
   recordDic
} from "@/api/icu/patient/pressureSore";
import { addJump } from "@/api/icu/patient/PreDeclaration";
import { mapGetters } from "vuex";
import { dateFormat, calcDate } from "@/util/date";
import humanModel from "@/views/icu/patient/components/pressureSore/humanModel";
import preProcess from "@/views/icu/patient/components/pressureSore/preProcess";
import PreDeclaration from "@/views/icu/patient/components/pressureSore/PreDeclaration";
import pressureNotice from "@/views/icu/patient/components/pressureSore/pressureNotice";
import nurseRecord from "@/views/icu/patient/components/pressureSore/nurseRecord";
import monitoringTable from "@/views/icu/patient/components/pressureSore/monitoringTable";
import outsideHospital from "@/views/icu/patient/components/pressureSore/outsideHospital";
import score from "@/views/icu/patient/components/pressureSore/score";
import event from "@/util/event";
import { setTimeout } from "timers";
import { upDateProcess } from "@/api/icu/patient/process";
import { handle } from "@/util/util";

export default {
   name: "pressureSore",
   components: {
      humanModel,
      preProcess,
      PreDeclaration,
      pressureNotice,
      nurseRecord,
      monitoringTable,
      score,
      outsideHospital
   },
   props: {
      messages: Object
   },
   computed: {
      ...mapGetters([])
   },
   data() {
      return {
         tableLoading: false,
         patientId: "",
         // 字典数据
         tableData: [],
         flag: true,
         flag1: false,
         flag2: false,
         flag3: false,
         flag4: false,
         flag5: false,
         flag6: false,
         tigger: false,
         devBtn: 1,
         // 压疮护理记录字典列表
         nurseRecordDic: [],
         nurseRecordDics: [],
         // 护理记录数据
         patient: {},
         byStages: [],
         newRecords: {},
         // 压疮部位
         prePosition: [],
         // 分页
         pageSize: 10,
         currentPage: 1,
         page: {
            total: 0, // 总页数
            currentPage: 1, // 当前页数
            pageSize: 10 // 每页显示多少条
         },
         total: 0,
         // 压疮难免申报表字典
         PreDeclarationDic: [],
         //当前流程id
         processId: "",
         processArr: [],
         test: "",

         ninthColor: false,
         tenthColor: false,
         eleventhColor: false,
         secondColor: false,
         thirdColor: false,
         twelfthColor: false,
         // 压疮患者信息
         patientInfo: {},
         option: {
            index: false,
            highlightCurrentRow: true,
            indexLabel: "序号",
            page: false,
            align: "center",
            border: true,
            menuAlign: "center",
            addBtn: false,
            delBtn: false,
            editBtn: false,
            stripe: false,
            menu: false,
            column: [
               {
                  label: "压疮部位",
                  prop: "prePosition",
                  fixed:true
               },
               {
                  label: "压疮面积",
                  prop: "soreRange"
               },
               {
                  label: "护理措施",
                  prop: "nursingMeasures"
               },
               {
                  label: "颜色",
                  prop: "skinColor"
               },
               {
                  label: "皮肤局部情况",
                  prop: "skinSituation",
                  width: 120
               },
               {
                  label: "渗出液体",
                  prop: "exudate"
               },
               // preventiveMeasures
               {
                  label: "压疮分期",
                  prop: "byStages",
                  width: "180px"
               },
               {
                  label: "评估结果",
                  prop: "assessmentResults"
               },
               {
                  label: "压疮图片",
                  prop: "skinConditionPicture",
                  slot: true,
                  width: 130
               },
               {
                  label: "发生时间",
                  prop: "occurrenceTime",
                  type: "datetime",
                  format: "MM-dd HH:mm",
                  valueFormat: "MM-dd HH:mm",
                  width: 120
               },
               {
                  label: "填表日期",
                  prop: "noteTime",
                  type: "datetime",
                  format: "MM-dd HH:mm",
                  valueFormat: "MM-dd HH:mm",
                  width: 120
               }
            ]
         },
         // 院外带入
         occurrenceTimeSureFlag: false,
         occurrence: {
            occurrenceTime: ""
         },
         pickerOptions: {
            disabledDate(time) {
               return time.getTime() > Date.now();
            }
         },
         highlightState: "",
         assessResult: "",
         // 图片
         dialogTableVisibleImg: false
      };
   },
   watch: {
      messages: {
         handler(newValue, oldValue) {
            // 切换患者移除压疮发生时间patientCondition
            localStorage.removeItem("occurrence");
            this.occurrence.occurrenceTime = "";
            this.messages = newValue;
            this.nurseRecordDics = [];
            this.addGetList();
            let params = {
               size: this.pageSize,
               current: this.currentPage,
               patientId: this.messages.patientId
            };
            this.queryDic(params);
            // 切换患者人体模型清空高亮
            this.$refs.brightMethodsChild.clearBright();
         },
         deep: true
      },
      assessResult(val) {
         // this.$refs.nurseRecordChild.assessResult = val;
         this.$refs.brightMethodsChild.assessResult = val;
         // console.log(val)
      },
      secondColor: {
         handler(newValue, oldValue) {
            this.$refs.recordChild.secondColor = newValue;
         },
         deep: true
      },
      thirdColor: {
         handler(newValue, oldValue) {
            this.$refs.recordChild.thirdColor = newValue;
         },
         deep: true
      },
      ninthColor: {
         handler(newValue, oldValue) {
            this.$refs.recordChild.ninthColor = newValue;
         },
         deep: true
      },
      tenthColor: {
         handler(newValue, oldValue) {
            this.$refs.recordChild.tenthColor = newValue;
         },
         deep: true
      },
      eleventhColor: {
         handler(newValue, oldValue) {
            this.$refs.recordChild.eleventhColor = newValue;
         },
         deep: true
      },
      twelfthColor: {
         handler(newValue, oldValue) {
            this.$refs.recordChild.twelfthColor = newValue;
         },
         deep: true
      }
   },
   mounted() {
      // sessionStorage.removeItem("occurrence");
      if (this.messages.patientId) {
         this.addGetList();
         let params = {
            size: this.pageSize,
            current: this.currentPage,
            patientId: this.messages.patientId
         };
         if (this.messages.patientId) {
            this.queryDic(params);
         } else {
            this.message.warning("无患者");
         }

         this.postGetList();
      }
   },
   methods: {
      //护理记录表新增前跳转的页面
      addGetList() {
         addNurseRecord(
            Object.assign({ patientId: this.messages.patientId })
         ).then(response => {
            this.patient = response.data.data.patient;
            this.nurseRecordDics = response.data.data.dictionaries;
            let params = {
               size: this.pageSize,
               current: this.currentPage,
               patientId: this.messages.patientId
            };
            this.queryDic(params);
         });
      },
      // 提交后让分值重新获取
      refreshAssessmentGetScore() {
         this.$refs.recordChild.assessmentGetScore();
      },
      // 表格行操作
      handleRowClick(row) {
         this.prePosition.forEach(item => {
            if (item.label == row.prePosition) {
               this.$refs.brightMethodsChild.clearBright();
               this.$refs.brightMethodsChild.brightMethods(item.value);
            }
         });
      },
      queryDic(params) {
         if (this.messages.patientId) {
            this.tableLoading = true;
            query(params).then(response => {
               // console.log(response);
               this.newRecords = response.data.data.records[0];
               this.tableData = response.data.data.records;
               this.total = response.data.data.total;
               this.tableData.forEach(j => {
                  this.prePosition.forEach(i => {
                     if (i.value == j.prePosition) {
                        j.prePosition = i.label;
                        this.tableLoading = false;
                     }
                  });
                  this.byStages.forEach(i => {
                     if (i.value == Number(j.byStages)) {
                        j.byStages = i.label;
                        this.tableLoading = false;
                     }
                  });
                  if (j.skinConditionPicture) {
                     handle(j.skinConditionPicture, j.id + 1)
                        .then(res => {})
                        .catch(() => {});
                  }
               });
               if (response.data.data.records[0] == undefined) {
                  this.tableLoading = false;
               }
               this.tableLoading = false;
            });
         }
      },
      //图片点击
      ImgClick(row) {
         var img = document.getElementById("dia_img");
         handle(row.skinConditionPicture, "dia_img").then(res => {});
         if (img) {
            img.src = "";
         }
         this.dialogTableVisibleImg = true;
      },
      postGetList() {
         recordDic("pre_position").then(response => {
            this.prePosition = [];
            response.data.data.forEach(item => {
               this.prePosition.push(
                  Object.assign({ label: item.label, value: item.value })
               );
            });
         });
         recordDic("by_stages").then(response => {
            this.byStages = [];
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
      },
      // 分页
      handleCurrentChange(val) {
         this.currentPage = val;
         let params = {
            size: this.pageSize,
            current: this.currentPage,
            patientId: this.messages.patientId
         };
         this.queryDic(params);
      },
      handleSizeChange(val) {
         this.pageSize = val;
         let params = {
            size: this.pageSize,
            current: this.currentPage,
            patientId: this.messages.patientId
         };
         this.queryDic(params);
      },
      // 难免压疮申报表
      pressureMethod(pro, arr) {
         this.flag = false;
         this.flag1 = true;
         if (pro.status == "1") {
            addJump(Object.assign({ patientId: this.messages.patientId }))
               .then(response => {
                  this.PreDeclarationDic = response.data.data.dictionaries;
                  this.$refs.PreDeclarationChild.getList();
                  this.processId = pro.id;
                  this.processArr = arr;
               })
               .catch(() => {
                  console.log("请求压疮难免申报表失败");
               });
         }
      },
      // 难免压疮风险告知书
      noticeMethod(pro, arr) {
         if (pro.status == "1") {
            this.flag = false;
            this.flag2 = true;
            this.processId = pro.id;
            this.processArr = arr;
         }
      },
      // 压疮护理记录单
      recordMethod(pro, arr) {
         if (pro.status == "1") {
            if (arr.indexOf("13") == -1) {
               this.messages.assessmentResults = this.assessResult;
               this.flag = false;
               this.flag3 = true;
               this.processId = pro.id;
               this.processArr = arr;
            }
         }
      },
      //  压力性损伤评估监控表
      monitorMethod() {
         this.flag = false;
         this.flag4 = true;
      },
      // 压疮评分
      scoreMethod(patinfo) {
         this.flag = false;
         this.flag5 = true;
         this.patientInfo = patinfo;
      },
      // 返回
      returnMethod() {
         this.flag = true;
         this.flag1 = false;
         this.flag2 = false;
         this.flag3 = false;
         this.flag4 = false;
         this.flag5 = false;
         this.flag6 = false;
         // 调用其他页面返回顶部方法
         // event.$emit("demo", "msg");
      },
      changeDevBtn(data) {
         if (data == 1) {
            this.devBtn = data;
            this.tigger = false;
         } else if (data == 2) {
            this.devBtn = data;
            this.tigger = true;
         }
      },
      // 院外带入压力性损伤
      outHospitalMethod(pro, arr) {
         if (pro.status == "1") {
            this.processId = pro.id;
            this.processArr = arr;
            this.flag6 = true;
         }
      },
      // 院外带入确定
      occurrenceTimeSure() {
         if (this.occurrence.occurrenceTime) {
            localStorage.setItem("occurrence", this.occurrence.occurrenceTime);
            this.occurrenceTimeSureFlag = true;
            if (this.processArr.indexOf("9") == -1) {
               upDateProcess({
                  flowName: 3,
                  specificStepId: 9,
                  patientId: this.messages.patientId,
                  id: this.processId
               });
            }
            this.$refs.recordChild.ninthColor = true;
            this.flag = true;
            this.flag1 = false;
            this.flag2 = false;
            this.flag3 = false;
            this.flag4 = false;
            this.flag5 = false;
            this.flag6 = false;
            this.occurrenceTimeSureFlag = false;
            // 调用其他页面返回顶部方法
            // event.$emit("demo", "msg");
         } else {
            this.$message({
               message: "院外带入发生时间不能为空",
               type: "warning"
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

<style scoped="scoped" lang="scss">
.indexCon {
   display: flex;
}
.indexNurse {
   width: 40%;
   padding: 1%;
   padding: 1%;
   border: 1px solid #ebeef5;
   border-radius: 5px;
}

.nurseTags {
   margin-top: 24px;
   padding-top: 24px;
   border-top: #f0f2f5 dashed 2px;
}
.nursePhoto {
   font-size: 16px;
}
.patient {
   text-align: center;
}
.patient,
.diseaseDescription {
   padding: 5px;
   font-size: 14px;
   font-weight: 500;
   border: 1px solid #ebeef5;
   border-radius: 5px;
   margin-top: 5px;
   span {
      display: inline-block;
      width: 90px;
      text-align: right;
   }
}
.patient span,
.diseaseDescription span {
   font-size: 18px;
   font-weight: 500;
}

.record {
   width: 59%;
   padding: 1%;
   padding: 1%;
   margin-left: 2%;
   border: 1px solid #ebeef5;
   border-radius: 5px;
}
@media screen and (max-width: 1300px) {
   .indexCon {
      flex-wrap: wrap;
   }
   .indexNurse {
      width: 100%;
      box-shadow: 0 0 0 #e4e7ed;
      display: flex;
   }
   .record {
      width: 97%;
      margin: 5px;
      margin-top: 3%;
   }
   .scrollTop {
      position: fixed;
      right: 40px;
      bottom: 80px;
      cursor: pointer;
   }
   .nursePhoto {
      width: 70%;
   }
   .nurseInfo {
      width: 30%;
   }
}
.dialogImg {
   .el-dialog__body {
      width: 100%;
      padding: 30px 0px;
      text-align: center;
      .Img_div {
         display: inline-block;
         text-align: center;
         img {
            width: 100%;
            height: 100%;
            max-height: 500px;
         }
      }
   }
}
</style>
<style lang="scss">
.indexCon {
   .el-table__fixed-right::before,
   .el-table__fixed::before {
      height: 0 !important;
   }
   .skinConditionPictureSpan span {
      display: inline-block;
   }
}
</style>