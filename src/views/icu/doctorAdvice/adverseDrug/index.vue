<template>
   <div class="doctorAdvice">
      <basic-container>
         <div style="display:flex;align-items: center;padding-bottom:50px">
            <div>
               <el-dropdown class="avue-tags__menu">
                  <el-button type="primary" size="mini" v-model="message.name">
                     {{message.name}} {{message.bedName}}
                     <i
                        class="el-icon-arrow-down el-icon--right"
                     />
                  </el-button>
                  <el-dropdown-menu>
                     <div class="dropdownMenu">
                        <el-button
                           :title="item.patientName + item.bedName"
                           v-for="item in patientNames"
                           :key="item.patientId"
                           :class="[(item.patientId == message.patientId?'el-button el-button--primary':'')]"
                           @click="patientNameClick(item,true)"
                        >{{item.patientName}} {{item.bedName}}</el-button>
                     </div>
                  </el-dropdown-menu>
               </el-dropdown>
            </div>
         </div>
         <div style="overflow-x: auto;border:1px solid #ebeef5;">
            <table :class="['gridtable',(hideNoData?'minWidth':'minWidth1')]" id="basic-table">
               <thead>
                  <tr>
                     <th style="min-width:100px">主号/次数</th>
                     <th style="min-width:160px">下嘱日期</th>
                     <th style="min-width:80px">医嘱类型</th>
                     <th style="min-width:80px">状态</th>
                     <th style="min-width:80px">频率</th>
                     <th>医嘱内容</th>
                     <th>用药方式</th>
                     <th>用量</th>
                     <th style="min-width:80px">单位</th>
                     <th style="min-width:80px">备注</th>
                     <th style="min-width:210px">操作</th>
                  </tr>
               </thead>
               <tbody v-for="item in tableData" :key="item.id" class="tbody">
                  <tr :rowspan="0">
                     <td
                        :rowspan="0"
                        style="text-align: center;border-right-width:0px"
                     >{{item.batchNumber}}[{{item.frequencyCount}}]</td>
                     <td :rowspan="0" style="text-align: center;">{{item.doctorsAdviceTime}}</td>
                     <td :rowspan="0" style="text-align: center;">{{item.type | doctorType}}</td>
                     <td
                        :rowspan="0"
                        style="text-align: center;"
                        :class="[item.emergency=='1'?'block':item.emergency=='2'?'oriange':item.emergency=='3'?'red':'']"
                     >{{item.emergency | state}}</td>
                     <td :rowspan="0" style="text-align: center;">{{item.frequency}}</td>
                  </tr>
                  <tr v-for="item1 in item.projectList" :key="item1.id">
                     <td
                        style="overflow:hidden;white-space: nowrap;text-overflow: ellipsis;"
                     >{{item1.content}}</td>
                     <td
                        style="overflow:hidden;white-space: nowrap;text-overflow: ellipsis;width:160px"
                     >{{item1.drugUse}}</td>
                     <td style="text-align: center;width:60px">{{item1.consumption}}</td>
                     <td style="text-align: center;width:60px">{{item1.company}}</td>
                     <td
                        style="overflow:hidden;white-space: nowrap;text-overflow: ellipsis;width:250px"
                     >{{item1.remarks}}</td>
                     <td
                        style="text-align: center;font-size: 12px;padding: 10px;border-right-width:0px"
                     >
                        <el-button
                           type="text"
                           size="mini"
                           icon="el-icon-view"
                           @click="viewEdit(item,item1,1)"
                        >查看</el-button>
                        <!-- <el-button
                           type="text"
                           size="mini"
                           icon="el-icon-edit"
                           @click="viewEdit(item,item1,2)"
                        >编辑</el-button> -->
                        <el-button
                           type="text"
                           size="mini"
                           icon="el-icon-plus"
                           @click="reactions(item,item1)"
                        >不良反应</el-button>
                     </td>
                  </tr>
               </tbody>
            </table>
            <div v-if="hideNoData" class="el-table__empty-block">
               <span class="el-table__empty-text">
                  <div class="avue-crud__empty">
                     <div class="avue-empty">
                        <div class="avue-empty__image" style="height: 50px;">
                           <img
                              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAxKSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgIDxlbGxpcHNlIGZpbGw9IiNGNUY1RjUiIGN4PSIzMiIgY3k9IjMzIiByeD0iMzIiIHJ5PSI3Ii8+CiAgICA8ZyBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0iI0Q5RDlEOSI+CiAgICAgIDxwYXRoIGQ9Ik01NSAxMi43Nkw0NC44NTQgMS4yNThDNDQuMzY3LjQ3NCA0My42NTYgMCA0Mi45MDcgMEgyMS4wOTNjLS43NDkgMC0xLjQ2LjQ3NC0xLjk0NyAxLjI1N0w5IDEyLjc2MVYyMmg0NnYtOS4yNHoiLz4KICAgICAgPHBhdGggZD0iTTQxLjYxMyAxNS45MzFjMC0xLjYwNS45OTQtMi45MyAyLjIyNy0yLjkzMUg1NXYxOC4xMzdDNTUgMzMuMjYgNTMuNjggMzUgNTIuMDUgMzVoLTQwLjFDMTAuMzIgMzUgOSAzMy4yNTkgOSAzMS4xMzdWMTNoMTEuMTZjMS4yMzMgMCAyLjIyNyAxLjMyMyAyLjIyNyAyLjkyOHYuMDIyYzAgMS42MDUgMS4wMDUgMi45MDEgMi4yMzcgMi45MDFoMTQuNzUyYzEuMjMyIDAgMi4yMzctMS4zMDggMi4yMzctMi45MTN2LS4wMDd6IiBmaWxsPSIjRkFGQUZBIi8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K"
                              alt
                           />
                        </div>
                        <p class="avue-empty__desc">暂无数据</p>
                     </div>
                  </div>
               </span>
            </div>
         </div>
         <template>
            <div style="width:100%;position:relative;height:50px">
               <el-pagination
                  :page-sizes="[10, 20,30,40, 50, 100]"
                  :pager-count="7"
                  :current-page="page.currentPage"
                  :page-size="page.pageSize"
                  :total="page.total"
                  layout="total, sizes, prev, pager, next, jumper"
                  style="margin-top:1%;position:absolute;right:1%;"
                  background
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
               ></el-pagination>
            </div>
         </template>
      </basic-container>
      <el-dialog
         title="不良反应"
         :visible.sync="dialogFormVisible"
         width="60%"
         @close="closeDialog('form')"
      >
         <el-form label-width="120px" :model="form" :rules="rules" ref="form" class="demo-ruleForm">
            <el-row>
               <el-col
                  class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
               >
                  <el-form-item label="患者姓名:" prop="name">
                     <el-input v-model="patientInfo.name" :disabled="true"></el-input>
                  </el-form-item>
               </el-col>
               <el-col
                  class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
               >
                  <el-form-item label="患者病情:" prop="diagnosis">
                     <el-input v-model="form.diagnosis" :disabled="true"></el-input>
                  </el-form-item>
               </el-col>
               <el-col
                  class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
               >
                  <el-form-item label="药物名称:" prop="drugName">
                     <el-input v-model="form.drugName" :disabled="true"></el-input>
                  </el-form-item>
               </el-col>
               <el-col
                  class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
               >
                  <el-form-item label="药品用法用量:" prop="dose">
                     <el-input v-model="form.dose" :disabled="true"></el-input>
                  </el-form-item>
               </el-col>
               <el-col
                  class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
               >
                  <el-form-item label="不良反应名称:" prop="adverseName">
                     <el-input v-model="form.adverseName"></el-input>
                  </el-form-item>
               </el-col>
               <el-col
                  class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
               >
                  <el-form-item label="开始用药时间:" prop="startTime">
                     <el-date-picker
                        v-model="form.startTime"
                        type="datetime"
                        style="width:100%"
                        placeholder="选择日期时间"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :picker-options="startTime"
                     ></el-date-picker>
                  </el-form-item>
               </el-col>
               <el-col
                  class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
               >
                  <el-form-item label="停止用药时间:" prop="endTime">
                     <el-date-picker
                        v-model="form.endTime"
                        style="width:100%"
                        type="datetime"
                        placeholder="选择日期时间"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :picker-options="endTime"
                     ></el-date-picker>
                  </el-form-item>
               </el-col>
               <el-col
                  class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
               >
                  <el-form-item label="不良反应时间:" prop="occurrenceTime">
                     <el-date-picker
                        v-model="form.occurrenceTime"
                        type="datetime"
                        placeholder="选择日期时间"
                        autocomplete="off"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        style="width:100%"
                     ></el-date-picker>
                  </el-form-item>
               </el-col>

               <el-col :span="24">
                  <el-form-item label="不良反应症状:" prop="symptom">
                     <el-input type="textarea" v-model="form.symptom"></el-input>
                  </el-form-item>
               </el-col>
               <el-col :span="24">
                  <el-form-item label="处理过程:" prop="treatProcess">
                     <el-input type="textarea" v-model="form.treatProcess"></el-input>
                  </el-form-item>
               </el-col>
               <el-col :span="24">
                  <el-form-item label="处理结果:" prop="treatResult">
                     <el-input type="textarea" v-model="form.treatResult"></el-input>
                  </el-form-item>
               </el-col>
            </el-row>
            <el-form-item class="dialog-footer" style="text-align: right;">
               <el-button @click="closeDialog('form')">取 消</el-button>
               <el-button type="primary" @click="handleUpdate('form')">提 交</el-button>
            </el-form-item>
         </el-form>
      </el-dialog>
      <!-- 查看编辑 -->
      <el-dialog
         :title="doctorOrdersFlag?'查看医嘱':'编辑医嘱'"
         :visible.sync="dialogFormVisible1"
         :width="doctorOrdersFlag?'70%':'60%'"
      >
         <el-form label-width="80px" :model="data" ref="data" class="demo-ruleForm">
            <el-row>
               <el-col
                  class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
               >
                  <el-form-item label="批号:" prop="batchNumber">
                     <el-input v-model="data.batchNumber" :disabled="doctorOrdersFlag"></el-input>
                  </el-form-item>
               </el-col>
               <el-col
                  class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
               >
                  <el-form-item label="次数:" prop="frequencyCount">
                     <el-input v-model="data.frequencyCount" :disabled="doctorOrdersFlag"></el-input>
                  </el-form-item>
               </el-col>
               <el-col
                  class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
               >
                  <el-form-item label="下嘱时间:" prop="doctorsAdviceTime">
                     <el-date-picker
                        v-model="data.doctorsAdviceTime"
                        type="datetime"
                        style="width:100%"
                        placeholder="选择日期时间"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :disabled="doctorOrdersFlag"
                     ></el-date-picker>
                  </el-form-item>
               </el-col>
               <el-col
                  class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
               >
                  <el-form-item label="医嘱类型:" prop="type">
                     <!-- <el-select
                        v-model="data.type"
                        placeholder="请选择医嘱类型"
                        :disabled="doctorOrdersFlag"
                        style="width:100%"
                     >
                        <el-option
                           v-for="item in types"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"
                        ></el-option>
                     </el-select>-->
                     <el-radio-group v-model="data.type" :disabled="doctorOrdersFlag">
                        <el-radio
                           v-for="item in types"
                           :key="item.value"
                           :label="item.value"
                        >{{item.label}}</el-radio>
                     </el-radio-group>
                  </el-form-item>
               </el-col>
               <el-col
                  class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
               >
                  <el-form-item label="状态:" prop="emergency">
                     <!-- <el-select
                        v-model="data.emergency"
                        placeholder="请选择状态"
                        :disabled="doctorOrdersFlag"
                        style="width:100%"
                     >
                        <el-option
                           v-for="item in states"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"
                        ></el-option>
                     </el-select>-->
                     <el-radio-group v-model="data.emergency" :disabled="doctorOrdersFlag">
                        <el-radio
                           v-for="item in states"
                           :key="item.value"
                           :label="item.value"
                        >{{item.label}}</el-radio>
                     </el-radio-group>
                  </el-form-item>
               </el-col>
               <el-col
                  class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
               >
                  <el-form-item label="频率:" prop="frequency">
                     <el-input v-model="data.frequency" :disabled="doctorOrdersFlag"></el-input>
                  </el-form-item>
               </el-col>
               <el-col
                  class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
               >
                  <el-form-item label="用药方式:" prop="drugUse">
                     <el-input v-model="data.drugUse" :disabled="true"></el-input>
                  </el-form-item>
               </el-col>
               <el-col
                  class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
               >
                  <el-form-item label="用量:" prop="consumption">
                     <el-input v-model="data.consumption" :disabled="true"></el-input>
                  </el-form-item>
               </el-col>
               <el-col
                  class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
               >
                  <el-form-item label="单位:" prop="company">
                     <el-input v-model="data.company" :disabled="true"></el-input>
                  </el-form-item>
               </el-col>
               <el-col
                  class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-24 avue-form__row"
               >
                  <el-form-item label="医嘱内容:" prop="content">
                     <el-input type="textarea" v-model="data.content" :disabled="true"></el-input>
                  </el-form-item>
               </el-col>
               <el-col
                  class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-24 avue-form__row"
               >
                  <el-form-item label="备注:" prop="remarks">
                     <el-input type="textarea" v-model="data.remarks" :disabled="true"></el-input>
                  </el-form-item>
               </el-col>
            </el-row>
            <!-- <el-table
               :data="tasksData"
               style="width: 100%"
               :border="true"
               :header-cell-style="{background:'rgb(250, 250, 250)',color: 'rgba(0,0,0,.85)'}"
               stripe
               v-if="doctorOrdersFlag"
            >
               <el-table-column prop="taskName" label="医嘱" align="center"></el-table-column>
               <el-table-column prop="startTime" label="医嘱开始时间" align="center"></el-table-column>
               <el-table-column prop="taskDescribe" label="医嘱描述" align="center"></el-table-column>
               <el-table-column fixed="right" label="操作" width="120" align="center">
                  <template slot-scope="scope">
                     <el-button
                        @click.native.prevent="viewRow(scope.row)"
                        type="text"
                        size="small"
                     >查看</el-button>
                  </template>
               </el-table-column>
            </el-table>-->
            <el-form-item style="text-align: right;padding-top:22px">
               <el-button @click="closeDialog('data')">取 消</el-button>
               <el-button
                  type="primary"
                  @click="subDialo('data')"
                  v-if="!doctorOrdersFlag"
                  :loading="subLoading"
               >提 交</el-button>
            </el-form-item>
         </el-form>
      </el-dialog>
   </div>
</template>

<script>
import {
   getnurse,
   fetchList,
   addDrug,
   addInfo,
   upData,
   doctorOrders
} from "@/api/icu/doctorAdvice/doctorAdvice";
import { mapGetters, mapState } from "vuex";

export default {
   name: "adverseDrugReactions",
   data() {
      return {
         tableData: [],
         dialogFormVisible: false,
         dialogFormVisible1: false,
         doctorOrdersFlag: false,
         subLoading: false,
         hideNoData: true,
         patientNames: [],
         patientValue: "",
         ActBtn: "",
         patientId: "",
         patientName: "",
         name: "",
         bedName: "",
         // 不良反应患者信息
         patientInfo: {},
         message: {},
         form: {
            patientId: "",
            patientName: "",
            age: "",
            gender: "",
            hospitalnumber: "",
            diagnosis: "",
            startTime: "",
            endTime: "",
            condition: "",
            occurrenceTime: "",
            adverseName: "",
            drugName: "",
            dose: "",
            symptom: "",
            treatProcess: "",
            treatResult: ""
         },
         rules: {
            adverseName: {
               required: true,
               message: "请输入不良反应名称",
               trigger: "blur"
            },
            startTime: {
               required: true,
               message: "请选择开始用药时间",
               trigger: "change"
            },
            endTime: {
               required: true,
               message: "请选择停止用药时间",
               trigger: "change"
            },
            occurrenceTime: {
               required: true,
               message: "请选择不良反应时间",
               trigger: "change"
            },
            symptom: {
               required: true,
               message: "请填写不良反应症状",
               trigger: "blur"
            },
            treatProcess: {
               required: true,
               message: "请填写处理过程",
               trigger: "blur"
            },
            treatResult: {
               required: true,
               message: "请填写处理结果",
               trigger: "blur"
            }
         },
         startTime: {
            disabledDate: time => {
               if (this.form.endTime) {
                  return time.getTime() > new Date(this.form.endTime).getTime();
               } else {
                  return false;
               }
            }
         },
         endTime: {
            disabledDate: time => {
               if (this.form.startTime) {
                  return (
                     time.getTime() < new Date(this.form.startTime).getTime()
                  );
               } else {
                  return false;
               }
            }
         },
         data: {
            patientId: "",
            batchNumber: "",
            frequencyCount: "",
            doctorsAdviceTime: null,
            type: "",
            emergency: "",
            frequency: "",
            content: "",
            drugUse: "",
            consumption: "",
            company: "",
            remarks: "",
            id: ""
         },
         states: [
            { label: "一般", value: "1" },
            { label: "加急", value: "2" },
            { label: "紧张", value: "3" }
         ],
         types: [{ label: "短期", value: "0" }, { label: "长期", value: "1" }],
         tasksData: [],
         page: {
            currentPage: 1,
            pageSize: 10,
            total: 0
         }
      };
   },
   computed: {
      ...mapGetters(["permissions", "all_patients", "patientMessage"]),
      ...mapState({
         roleCodes: state => state.user.roleCodes
      })
   },
   watch: {
      patientMessage: {
         handler(newValue, oldValue) {
            this.patientNameClick(newValue, false);
         }
      }
   },
   created() {
      let data = JSON.parse(sessionStorage.getItem("pigx-all_patients"))
         .content;
      this.patientNames = data;
      this.message = JSON.parse(
         sessionStorage.getItem("pigx-patientMessage")
      ).content;
      let params = {
         patientId: JSON.parse(sessionStorage.getItem("pigx-patientMessage"))
            .content.patientId
      };
      this.getList(params);
   },
   activated() {
      let data = JSON.parse(sessionStorage.getItem("pigx-all_patients"))
         .content;
      this.patientNames = data;
      this.message = JSON.parse(
         sessionStorage.getItem("pigx-patientMessage")
      ).content;
      let params = {
         patientId: JSON.parse(sessionStorage.getItem("pigx-patientMessage"))
            .content.patientId
      };
      this.getList(params);
   },
   methods: {
      getList(params) {
         this.hideNoData = false;
         // console.log(params);
         fetchList(
            Object.assign(
               {
                  current: this.page.currentPage,
                  size: this.page.pageSize
               },
               params
            )
         )
            .then(response => {
               // console.log(response);
               this.page.total = response.data.data.total;
               this.tableData = response.data.data.records;
               // console.log(this.tableData);
               if (this.tableData == null ||this.tableData.length == 0) {
                  this.hideNoData = true;
               }
               this.tableData.forEach(item => {
                  let data = {
                     // 下嘱日期
                     doctorsAdviceTime: item.doctorsAdviceTime.substr(5, 11)
                  };
                  Object.assign(item, data);
                  if (item.projectList.length == 0) {
                     item.projectList.push({});
                  }
               });
            })
            .catch(() => {
               this.hideNoData = true;
            });
      },
      // 护士选中患者
      patientNameClick(item, flag) {
         if (flag) {
            this.$store.commit("SET_MESSAGE", item);
         } else {
            this.message = item;
            this.formTask = item;
            const params = {
               patientId: item.patientId
            };
            this.getList(params);
         }
      },
      // 查看编辑
      viewEdit(item, item1, val) {
         // 1 查看  2 编辑
         this.dialogFormVisible1 = true;
         if (val == 1) {
            this.doctorOrdersFlag = true;
            // doctorOrders(item.id).then(res => {
            //    // console.log(res);
            //    this.tasksData = res.data.data.tasks;
            //    this.$forceUpdate();
            // });
         } else if (val == 2) {
            this.doctorOrdersFlag = false;
         }
         this.data.patientId = item.patientId;
         this.data.batchNumber = item.batchNumber;
         this.data.frequencyCount = item.frequencyCount;
         this.data.doctorsAdviceTime = item.doctorsAdviceTimeOld;
         this.data.type = item.type;
         this.data.emergency = item.emergency;
         this.data.frequency = item.frequency;
         this.data.content = item1.content;
         this.data.drugUse = item1.drugUse;
         this.data.consumption = item1.consumption;
         this.data.company = item1.company;
         this.data.remarks = item1.remarks;
         this.data.id = item.id;
      },
      // 编辑提交
      subDialo(form) {
         this.subLoading = true;
         upData(this.data).then(data => {
            this.$message({
               showClose: true,
               message: "修改成功",
               type: "success"
            });
            let params = {
               patientId: this.data.patientId
            };
            this.getList(params);
            this.closeDialog(form);
         });
      },
      // 不良反应
      reactions(item, item1) {
         this.dialogFormVisible = true;
         this.form.patientId = item.patientId;
         this.form.drugName = item1.content;
         this.form.dose =
            item1.drugUse + "/" + item1.consumption + item1.company;
         addInfo({ patientId: this.form.patientId }).then(response => {
            this.patientInfo = response.data.data;
            this.form.diagnosis = this.patientInfo.diagnosis;
         });
      },
      // 不良反应提交
      handleUpdate(form) {
         this.form.gender = this.patientInfo.gender;
         this.form.age = this.patientInfo.age;
         this.form.hospitalnumber = this.patientInfo.hospitalnumber;
         this.form.diagnosis = this.patientInfo.diagnosis;
         this.form.patientName = this.patientInfo.name;
         this.$refs[form].validate(valid => {
            if (valid) {
               this.subLoading = true;
               addDrug(this.form).then(data => {
                  this.$message({
                     showClose: true,
                     message: "添加成功",
                     type: "success"
                  });
                  this.closeDialog(form);
               });
            } else {
               return false;
            }
         });
      },
      // 查看任务
      viewRow(val) {
         let obj = {
            taskId: val.taskId
         };
         this.$confirm("是否去查看该条医嘱任务详情", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
         }).then(() => {
            this.closeviewDialog();
            this.$router.push({
               path: "/icu/taskManagement/task",
               query: obj
            });
         });
      },
      // 关闭
      closeDialog(form) {
         this.dialogFormVisible = false;
         this.dialogFormVisible1 = false;
         this.subLoading = false;
         this.$refs[form].resetFields();
      },
      handleSizeChange(val) {
         this.page.pageSize = val;
         let params = {
            patientId: this.message.patientId
         };
         this.getList(params);
      },
      handleCurrentChange(val) {
         this.page.currentPage = val;
         let params = {
            patientId: this.message.patientId
         };
         this.getList(params);
      }
   },
   filters: {
      state: data => {
         switch (data) {
            case "1":
               return "一般";

            case "2":
               return "加急";

            case "3":
               return "紧急";

            default:
         }
      },
      doctorType: data => {
         switch (data) {
            case "0":
               return "短期";

            case "1":
               return "长期";
            default:
         }
      },
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
.doctorAdvice table.gridtable {
   border-width: 1px;
   border-color: #666666;
   border-collapse: collapse;
   border-radius: 5px;
}
.doctorAdvice .minWidth {
   min-width: 100%;
}
.doctorAdvice .minWidth1 {
   min-width: 1060px;
}
.doctorAdvice table.gridtable th {
   border-width: 1px;
   border-top-width: 0px;
   padding: 10px 0px;
   border-style: solid;
   border-color: #ebeef5;
   color: rgba(0, 0, 0, 0.85);
   background-color: rgb(250, 250, 250);
   cursor: pointer;
}
.doctorAdvice table.gridtable th:first-child {
   border-left-width: 0px;
}
.doctorAdvice table.gridtable th:last-child {
   border-right-width: 0px;
}
.doctorAdvice table.gridtable {
   td {
      border-width: 1px;
      padding: 8px;
      border-style: solid;
      border-color: #ebeef5;
      background-color: #ffffff;
      cursor: pointer;
   }
   th {
      font-size: 14px;
   }
}
// .el-table--striped .el-table__body tr.el-table__row--striped td {
//    background: #fafafa;
// }
.doctorAdvice .red {
   color: #f56c6c;
}
.doctorAdvice .block {
   color: #909399;
}
.doctorAdvice .oriange {
   color: #e6a23c;
}
.patientBtnAct {
   background: #409eff !important;
   color: #fff !important;
}
.doctorAdvice .el-col {
   margin-bottom: 0;
}
.doctorAdvice .avue-tags__menu {
   line-height: 40px;
   padding-right: 10px;
   margin-right: 1%;
}
</style>
