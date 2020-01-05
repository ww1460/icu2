
<template>
   <!-- 用药差错 -->
   <div>
      <basic-container>
         <div v-if="flag == true">
            <h3>用药错误报告表</h3>
            <div class="execution">
               <table class="occupation">
                  <tbody class="drug">
                     <tr>
                        <td style="min-width:50px">错误发生日期</td>
                        <td>
                           <el-date-picker
                              @change="judgeTime(1)"
                              :disabled="disabled == 2"
                              v-model="form.occurrenceTime"
                              type="datetime"
                              placeholder="选择日期时间"
                              align="right"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              :picker-options="pickerOptions1"
                           ></el-date-picker>
                        </td>
                        <td>发现错误日期</td>
                        <td>
                           <el-date-picker
                              @change="judgeTime(2)"
                              :disabled="disabled == 2"
                              v-model="form.discoveryTime"
                              type="datetime"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              placeholder="选择日期时间"
                              align="right"
                              :picker-options="pickerOptions1"
                           ></el-date-picker>
                        </td>
                     </tr>
                     <tr>
                        <td>错误内容</td>
                        <td colspan="3" style="padding-top:20px;padding-buttom:20px">
                           <el-radio-group :disabled="disabled == 2" v-model="form.errorContent">
                              <el-radio :label="1">品种</el-radio>
                              <el-radio :label="2">规格</el-radio>
                              <el-radio :label="3">数量</el-radio>
                              <el-radio :label="4">剂量</el-radio>
                              <el-radio :label="5">剂型</el-radio>
                              <el-radio :label="6">给药途径</el-radio>
                              <el-radio :label="7">给药时间</el-radio>
                              <el-radio :label="8">疗程</el-radio>
                              <el-radio :label="9">禁忌症</el-radio>
                              <el-radio style="padding:10px 0" :label="10">配伍</el-radio>
                           </el-radio-group>
                           <div>
                              <el-radio-group :disabled="disabled == 2" v-model="form.errorContent">
                                 <el-radio :label="999">其他</el-radio>
                              </el-radio-group>
                              <el-input
                                 :disabled="form.errorContent != 999"
                                 style="width:80%"
                                 v-model="form.errorContentRemarks"
                              ></el-input>
                           </div>
                        </td>
                     </tr>
                     <tr>
                        <td>错误药品是否发给患者</td>
                        <td>
                           <el-radio-group
                              :disabled="disabled == 2"
                              v-model="form.whetherGivePatient"
                           >
                              <el-radio :label="1">是</el-radio>
                              <el-radio :label="2">否</el-radio>
                              <el-radio :label="3">不详</el-radio>
                           </el-radio-group>
                        </td>
                        <td>患者是否使用了错误药品</td>
                        <td>
                           <el-radio-group
                              :disabled="disabled == 2"
                              v-model="form.whetherPatientUse"
                           >
                              <el-radio :label="0">是</el-radio>
                              <el-radio :label="1">否</el-radio>
                              <el-radio :label="2">不详</el-radio>
                           </el-radio-group>
                        </td>
                     </tr>
                     <tr>
                        <td>错误分级</td>
                        <td colspan="3">
                           <el-radio-group
                              :disabled="disabled == 2"
                              class="Display"
                              v-model="form.medicationErrorLevel"
                           >
                              <el-radio
                                 style="padding:5px 0;"
                                 v-for="item in dictionariesList"
                                 :key="item.id"
                                 :label="item.value"
                              >{{item.label}}</el-radio>
                           </el-radio-group>
                           <div>
                              <el-radio-group
                                 :disabled="disabled == 2"
                                 v-model="form.medicationErrorLevel"
                              >
                                 <el-radio :label="999">其他</el-radio>
                              </el-radio-group>
                              <el-input
                                 :disabled="form.medicationErrorLevel != 999"
                                 style="width:80%"
                                 v-model="form.medicationErrorLevelRemarks"
                              ></el-input>
                           </div>
                        </td>
                     </tr>
                     <tr>
                        <td rowspan="2">患者伤害情况</td>
                        <td colspan="3">
                           <el-radio-group :disabled="disabled == 2" v-model="form.patientInjury">
                              <el-radio :label="1">死亡（直接死因）</el-radio>
                              <el-radio :label="2">抢救（措施）</el-radio>
                              <el-radio :label="3">残疾（部位、程度）</el-radio>
                              <el-radio :label="4">暂时伤害（部位、程度）</el-radio>
                              <el-radio style="padding:10px 0" :label="5">无明显伤害</el-radio>
                           </el-radio-group>
                           <div>
                              <el-radio-group
                                 v-model="form.patientInjury"
                              >
                                 <el-radio :label="999">备注</el-radio>
                              </el-radio-group>
                              <el-input style="width:80%" v-model="form.patientInjuryRemarks" :disabled="form.patientInjury != 999"></el-input>
                           </div>
                        </td>
                     </tr>
                     <tr>
                        <td colspan="3">
                           恢复过程：
                           <el-radio-group
                              :disabled="disabled == 2 || form.patientInjury == 1"
                              v-model="form.patientRecover"
                           >
                              <el-radio :label="1">住院治疗</el-radio>
                              <el-radio :label="2">门诊随访治疗</el-radio>
                              <el-radio :label="3">自行恢复</el-radio>
                              <el-radio :label="4">无</el-radio>
                           </el-radio-group>
                        </td>
                     </tr>
                     <tr>
                        <td>引发错误的因素</td>
                        <td colspan="3">
                           <el-radio-group :disabled="disabled == 2" v-model="form.causeOfTheError">
                              <el-radio :label="1">选错药</el-radio>
                              <el-radio :label="2">处方辨认不清</el-radio>
                              <el-radio :label="3">缩写</el-radio>
                              <el-radio :label="4">药名相似</el-radio>
                              <el-radio :label="5">外观相似</el-radio>
                              <el-radio :label="6">分装</el-radio>
                              <el-radio :label="7">稀释</el-radio>
                              <el-radio style="padding:10px 0" :label="8">标签</el-radio>
                           </el-radio-group>
                           <div>
                              <el-radio-group
                                 :disabled="disabled == 2"
                                 v-model="form.causeOfTheError"
                              >
                                 <el-radio :label="999">其他</el-radio>
                              </el-radio-group>
                              <el-input
                                 :disabled="form.causeOfTheError != 999"
                                 v-model="form.causeOfTheErrorRemarks"
                                 style="width:80%"
                              ></el-input>
                           </div>
                        </td>
                     </tr>
                     <tr>
                        <td>发生错误的场所</td>
                        <td colspan="3">
                           <el-radio-group :disabled="disabled == 2" v-model="form.occurrenceSites">
                              <el-radio :label="1">门诊药房</el-radio>
                              <el-radio :label="2">病房药房</el-radio>
                              <el-radio :label="3">社区药房</el-radio>
                              <el-radio :label="4">护士站</el-radio>
                              <el-radio :label="5">病房</el-radio>
                              <el-radio :label="6">诊室</el-radio>
                              <el-radio style="padding:10px 0" :label="7">患者家中</el-radio>
                           </el-radio-group>
                           <div>
                              <el-radio-group
                                 :disabled="disabled == 2"
                                 v-model="form.occurrenceSites"
                              >
                                 <el-radio :label="999">其他</el-radio>
                              </el-radio-group>
                              <el-input
                                 :disabled="form.occurrenceSites != 999"
                                 v-model="form.occurrenceSitesRemark"
                                 style="width:80%"
                              ></el-input>
                           </div>
                        </td>
                     </tr>
                     <tr>
                        <td>引起错误的工作人员职位</td>
                        <td colspan="3">
                           <el-radio-group :disabled="disabled == 2" v-model="form.staffPosition">
                              <el-radio :label="1">初级药师</el-radio>
                              <el-radio :label="2">中级药师</el-radio>
                              <el-radio :label="3">高级药师</el-radio>
                              <el-radio :label="4">护士</el-radio>
                              <el-radio :label="5">医师</el-radio>
                           </el-radio-group>
                           <div>
                              <el-radio-group
                                 :disabled="disabled == 2"
                                 v-model="form.staffPosition"
                              >
                                 <el-radio :label="999">其他</el-radio>
                              </el-radio-group>
                              <el-input
                                 :disabled="form.staffPosition != 999"
                                 v-model="form.staffPositionRemarks"
                                 style="width:80%"
                              ></el-input>
                           </div>
                        </td>
                     </tr>
                     <tr>
                        <td>其他与错误相关的工作人员</td>
                        <td colspan="3">
                           <el-radio-group
                              :disabled="disabled == 2"
                              v-model="form.relatedPersonPosition"
                           >
                              <el-radio :label="1">初级药师</el-radio>
                              <el-radio :label="2">中级药师</el-radio>
                              <el-radio :label="3">高级药师</el-radio>
                              <el-radio :label="4">护士</el-radio>
                              <el-radio :label="5">医师</el-radio>
                           </el-radio-group>
                           <div>
                              <el-radio-group
                                 :disabled="disabled == 2"
                                 v-model="form.relatedPersonPosition"
                              >
                                 <el-radio :label="999">其他</el-radio>
                              </el-radio-group>
                              <el-input
                                 :disabled="form.relatedPersonPosition != 999"
                                 v-model="form.relatedPersonPositionRemarks"
                                 style="width:80%"
                              ></el-input>
                           </div>
                        </td>
                     </tr>
                     <tr>
                        <td>发现错误的人员</td>
                        <td colspan="3">
                           <el-radio-group :disabled="disabled == 2" v-model="form.findErrorPerson">
                              <el-radio :label="1">初级药师</el-radio>
                              <el-radio :label="2">中级药师</el-radio>
                              <el-radio :label="4">高级药师</el-radio>
                              <el-radio :label="5">护士</el-radio>
                              <el-radio :label="6">医师</el-radio>
                           </el-radio-group>
                           <div>
                              <el-radio-group
                                 :disabled="disabled == 2"
                                 v-model="form.findErrorPerson"
                              >
                                 <el-radio :label="999">其他</el-radio>
                              </el-radio-group>
                              <el-input
                                 :disabled="form.findErrorPerson != 999"
                                 v-model="form.findErrorPersonRemarks"
                                 style="width:80%"
                              ></el-input>
                           </div>
                        </td>
                     </tr>
                     <tr>
                        <td colspan="4">
                           <el-input
                              :disabled="disabled == 2"
                              v-model="form.howToFind"
                              type="textarea"
                              placeholder="错误是如何发现或避免的"
                           ></el-input>
                        </td>
                     </tr>
                  </tbody>
               </table>
               <table class="occupation">
                  <tbody class="drug_buttom">
                     <tr>
                        <td>患者姓名</td>
                        <td>
                           <el-select
                              style="width:100%"
                              placeholder="请选择患者"
                              v-model="form.patientName"
                              size="small"
                           >
                              <el-option
                                 v-for="item in patientList"
                                 :key="item.id"
                                 :value="item.name"
                                 :label="item.name"
                              ></el-option>
                           </el-select>
                        </td>
                        <td>患者年龄</td>
                        <td>
                           <el-input :disabled="disabled == 2" v-model="form.patientAge"></el-input>
                        </td>
                        <td>性别</td>
                        <td>
                           <el-radio-group :disabled="disabled == 2" v-model="form.patientSex">
                              <el-radio :label="1">男</el-radio>
                              <el-radio :label="2">女</el-radio>
                           </el-radio-group>
                        </td>
                        <td>诊断</td>
                        <td>
                           <el-input :disabled="disabled == 2" v-model="form.patientIllness"></el-input>
                        </td>
                     </tr>
                     <tr></tr>
                     <tr>
                        <td>患者联系方式</td>
                        <td colspan="7">
                           <el-input :disabled="disabled == 2" v-model="form.patientPhone"></el-input>
                        </td>
                     </tr>
                     <tr>
                        <td colspan="2" rowspan="3">错误相关药品</td>
                        <td>通用名</td>
                        <td>
                           <el-input :disabled="disabled == 2" v-model="form.drugCommonName"></el-input>
                        </td>
                        <td>商品名</td>
                        <td>
                           <el-input :disabled="disabled == 2" v-model="form.drugTradeName"></el-input>
                        </td>
                        <td>生产厂家</td>
                        <td>
                           <el-input :disabled="disabled == 2" v-model="form.drugManufacturers"></el-input>
                        </td>
                     </tr>
                     <tr>
                        <td>药品分类</td>
                        <td>
                           <el-input :disabled="disabled == 2" v-model="form.drugType"></el-input>
                        </td>
                        <td>剂型</td>
                        <td>
                           <el-input :disabled="disabled == 2" v-model="form.drugDosageForms"></el-input>
                        </td>
                        <td>规格</td>
                        <td>
                           <el-input :disabled="disabled == 2" v-model="form.drugSpecifications"></el-input>
                        </td>
                     </tr>
                     <tr>
                        <td>包装类型</td>
                        <td>
                           <el-input :disabled="disabled == 2" v-model="form.drugPackaging"></el-input>
                        </td>
                        <td>用法用量</td>
                        <td>
                           <el-input :disabled="disabled == 2" v-model="form.drugUsageDosage"></el-input>
                        </td>
                        <td>疗程</td>
                        <td>
                           <el-input :disabled="disabled == 2" v-model="form.drugTreatment"></el-input>
                        </td>
                     </tr>
                     <tr>
                        <td colspan="4">是否能够提供药品标签、处方复印件等资料：</td>
                        <td colspan="4">
                           <el-radio-group
                              :disabled="disabled == 2"
                              v-model="form.whetherBringsData"
                           >
                              <el-radio :label="1">是</el-radio>
                              <el-radio :label="2">否</el-radio>
                           </el-radio-group>
                           <div>
                              <el-radio-group
                                 :disabled="disabled == 2"
                                 v-model="form.whetherBringsData"
                              >
                                 <el-radio :label="999">其他</el-radio>
                              </el-radio-group>
                              <el-input
                                 :disabled="form.whetherBringsData != 999"
                                 v-model="form.whetherBringsDataRemarks"
                                 style="width:90%"
                              ></el-input>
                           </div>
                        </td>
                     </tr>
                     <tr>
                        <td colspan="8">
                           <el-input
                              :disabled="disabled == 2"
                              v-model="form.processOccurs"
                              type="textarea"
                              placeholder="错误发生的经过：请简述事件经过、后果、相关人员职位、工作环境（如药品条形码、工作人员换班、缺少24小时制药房、药品存放条件等）。"
                           ></el-input>
                        </td>
                     </tr>
                     <td colspan="8">
                        <el-input
                           :disabled="disabled == 2"
                           v-model="form.preventionAdvice"
                           type="textarea"
                           placeholder="对预防类似错误发生的建议："
                        ></el-input>
                     </td>
                     <tr>
                        <td>报告人</td>
                        <td>
                           <el-input :disabled="disabled == 2" v-model="form.preparerName"></el-input>
                        </td>
                        <td>联系电话</td>
                        <td>
                           <el-input :disabled="disabled == 2" v-model="form.preparerPhone"></el-input>
                        </td>
                        <td>联系地址</td>
                        <td>
                           <el-input :disabled="disabled == 2" v-model="form.preparerAddress"></el-input>
                        </td>
                        <td>e-mail</td>
                        <td>
                           <el-input :disabled="disabled == 2" v-model="form.preparerEmail"></el-input>
                        </td>
                     </tr>
                  </tbody>
               </table>
               <div class="sub_btn">
                  <el-button @click="goBack">返 回</el-button>
                  <el-button :disabled="disabled == 2" type="primary" @click="drugBtn">提 交</el-button>
               </div>
            </div>
         </div>
         <avue-crud
            v-else
            ref="crud"
            :page="page"
            :data="tableData"
            :permission="permissionList"
            :table-loading="tableLoading"
            :option="tableOption"
            @search-change="searchChange"
            @refresh-change="refreshChange"
            @search-reset="clearform"
            @size-change="sizeChange"
            @current-change="currentChange"
         >
            <template slot="search">
               <el-col :md="4" :xs="24">
                  <el-form-item>
                     <el-select
                        style="width:100%"
                        placeholder="请选择患者"
                        v-model="patientId"
                        size="small"
                        @change="chosePatient($event,true)"
                        clearable
                     >
                        <el-option
                           v-for="item in patientList"
                           :key="item.id"
                           :value="item.patientName"
                           :label="item.patientName + ' ' +item.bedName"
                        ></el-option>
                     </el-select>
                  </el-form-item>
               </el-col>
            </template>
            <template slot="searchMenu">
               <el-button
                  type="primary"
                  size="small"
                  icon="el-icon-plus"
                  @click="Adddictionaries(1)"
               >新增</el-button>
            </template>
            <template slot="menu" slot-scope="scope">
               <el-button
                  type="text"
                  icon="el-icon-view"
                  size="small"
                  @click="Adddictionaries(2,scope.row)"
               >查看</el-button>
               <el-button
                  type="text"
                  icon="el-icon-edit"
                  size="small"
                  @click="Adddictionaries(3,scope.row)"
               >编辑</el-button>
               <el-button
                  type="text"
                  icon="el-icon-delete"
                  size="small"
                  @click="rowDel(scope.row,scope.index)"
               >删除</el-button>
            </template>
         </avue-crud>
      </basic-container>
   </div>
</template>

<script>
import {
   addObj,
   delObj,
   fetchList,
   putObj,
   UpdateObj,
   getdictionaries,
   getObj
} from "@/api/icu/pharmaceutical/drug/drug";
import { tableOption } from "@/const/crud/icu/pharmaceutical/drug/drug";
import { mapGetters } from "vuex";

export default {
   name: "drug",
   data() {
      return {
         flag: false,
         searchForm: {},
         tableData: [],
         page: {
            total: 0, // 总页数
            currentPage: 1, // 当前页数
            pageSize: 10 // 每页显示多少条
         },
         tableLoading: false,
         tableOption: tableOption,
         pickerOptions1: {
            shortcuts: [
               {
                  text: "今天",
                  onClick(picker) {
                     picker.$emit("pick", new Date());
                  }
               },
               {
                  text: "昨天",
                  onClick(picker) {
                     const date = new Date();
                     date.setTime(date.getTime() - 3600 * 1000 * 24);
                     picker.$emit("pick", date);
                  }
               },
               {
                  text: "一周前",
                  onClick(picker) {
                     const date = new Date();
                     date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                     picker.$emit("pick", date);
                  }
               }
            ]
         },
         form: {
            patientRecover: "",
            occurrenceTime: "",
            discoveryTime: "",
            errorContent: "",
            errorContentRemarks: "",
            whetherGivePatient: "",
            whetherPatientUse: "",
            medicationErrorLevel: "",
            medicationErrorLevelRemarks: "",
            patientInjury: "",
            patientInjuryRemarks: "",
            causeOfTheError: "",
            causeOfTheErrorRemarks: "",
            occurrenceSites: "",
            occurrenceSitesRemark: "",
            staffPosition: "",
            staffPositionRemarks: "",
            relatedPersonPosition: "",
            relatedPersonPositionRemarks: "",
            findErrorPerson: "",
            findErrorPersonRemarks: "",
            howToFind: "",
            patientName: "",
            patientAge: "",
            patientSex: "",
            patientIllness: "",
            patientPhone: "",
            drugCommonName: "",
            drugTradeName: "",
            drugManufacturers: "",
            drugType: "",
            drugDosageForms: "",
            drugSpecifications: "",
            drugPackaging: "",
            drugUsageDosage: "",
            drugTreatment: "",
            drugFrequency: "",
            whetherBringsData: "",
            whetherBringsDataRemarks: "",
            processOccurs: "",
            preventionAdvice: "",
            preparerName: "",
            preparerPhone: "",
            preparerEmail: "",
            preparerAddress: ""
         },
         dictionariesList: [],
         disabled: "",
         patientName: "",
         patientId: "",
         patientList: []
      };
   },
   watch: {
      form: {
         handler(newValue, oldValue) {
            if (newValue.errorContent != 999) {
               newValue.errorContentRemarks = "";
            }
            if (newValue.medicationErrorLevel != 999) {
               newValue.medicationErrorLevelRemarks = "";
            }
            if (newValue.causeOfTheError != 999) {
               newValue.causeOfTheErrorRemarks = "";
            }
            if (newValue.occurrenceSites != 999) {
               newValue.occurrenceSitesRemarks = "";
            }
            if (newValue.staffPosition != 999) {
               newValue.staffPositionRemarks = "";
            }
            if (newValue.relatedPersonPosition != 999) {
               newValue.relatedPersonPositionRemarks = "";
            }
            if (newValue.findErrorPerson != 999) {
               newValue.findErrorPersonRemarks = "";
            }
            if (newValue.whetherBringsData != 999) {
               newValue.whetherBringsDataRemarks = "";
            }  
            if (newValue.patientInjury != 999) {
               newValue.whetherBringsDataRemarks = "";
            }
         },
         deep: true
      },
      patientMessage: {
         handler(newValue, oldValue) {
            this.chosePatient(newValue.patientId, false);
            this.patientId = newValue.patientId;
         }
      }
   },
   computed: {
      ...mapGetters(["permissions", "patientMessage"]),
      permissionList() {
         return {
            addBtn: this.vaildData(this.permissions.icu_nurse_add, false),
            delBtn: this.vaildData(this.permissions.icu_nurse_del, false),
            editBtn: this.vaildData(this.permissions.icu_nurse_edit, false)
         };
      }
   },
   created() {
      let data = JSON.parse(sessionStorage.getItem("pigx-all_patients"))
         .content;
      this.patientList = data;

      // this.patientId = JSON.parse(
      //    sessionStorage.getItem("pigx-patientMessage")
      // ).content.patientId;
      this.patientId = JSON.parse(
         sessionStorage.getItem("pigx-patientMessage")
      ).content.patientName;
      this.searchForm = { patientName: this.patientId };
      this.getList();
   },
   methods: {
       // 分页bug
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.getList();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.getList();
    },
      chosePatient(val,flag) {
         this.page.currentPage = 1;
         this.page.pageSize = 10;
         if (flag) {
            if (val) {
               this.patientList.forEach(item => {
                  if (item.patientId == val) {
                     this.$store.commit("SET_MESSAGE", item);
                  }
               });
            }else {
               this.searchForm.patientId = null;
               this.getList();
            }
         } else {
            if (val) {
               this.patientList.forEach(item => {
                  if (item.patientId == val) {
                     this.patientName = item.patientName;
                     Object.assign(this.searchForm, {
                        patientId: this.patientId
                     });
                  }
               });
            } else {
               this.searchForm.patientId = null;
            }
            this.getList();
         }
      },
      //判断两个时间
      judgeTime(flag) {
         if (this.form.occurrenceTime != "" && this.form.discoveryTime != "") {
            if (this.form.occurrenceTime > this.form.discoveryTime) {
               this.$message({
                  showClose: true,
                  message: "发现日期早于发生日期",
                  type: "warning"
               });
               if (flag == 1) {
                  this.form.occurrenceTime = "";
               } else {
                  this.form.discoveryTime = "";
               }
            }
         }
      },

      goBack() {
         this.flag = false;
      },
      //新增  编辑 查看
      Adddictionaries(disabled, row) {
         this.disabled = disabled;
         if (this.disabled != 1) {
            getObj(row.id).then(res => {
               this.form = res.data.data;
            });
         } else {
            this.form = {
               patientRecover: "",
               occurrenceTime: "",
               discoveryTime: "",
               errorContent: "",
               errorContentRemarks: "",
               whetherGivePatient: "",
               whetherPatientUse: "",
               medicationErrorLevel: "",
               medicationErrorLevelRemarks: "",
               patientInjury: "",
               patientInjuryRemarks: "",
               causeOfTheError: "",
               causeOfTheErrorRemarks: "",
               occurrenceSites: "",
               occurrenceSitesRemark: "",
               staffPosition: "",
               staffPositionRemarks: "",
               relatedPersonPosition: "",
               relatedPersonPositionRemarks: "",
               findErrorPerson: "",
               findErrorPersonRemarks: "",
               howToFind: "",
               patientName: "",
               patientAge: "",
               patientSex: "",
               patientIllness: "",
               patientPhone: "",
               drugCommonName: "",
               drugTradeName: "",
               drugManufacturers: "",
               drugType: "",
               drugDosageForms: "",
               drugSpecifications: "",
               drugPackaging: "",
               drugUsageDosage: "",
               drugTreatment: "",
               drugFrequency: "",
               whetherBringsData: "",
               whetherBringsDataRemarks: "",
               processOccurs: "",
               preventionAdvice: "",
               preparerName: "",
               preparerPhone: "",
               preparerEmail: "",
               preparerAddress: ""
            };
         }

         this.flag = true;
      },
      drugBtn() {
         switch ("") {
            case this.form.occurrenceTime:
               this.$message({
                  type: "warning",
                  message: "请选择错误发生时间"
               });
               break;
            case this.form.discoveryTime:
               this.$message({
                  type: "warning",
                  message: "请选择错误发现时间"
               });
               break;
            case this.form.medicationErrorLevel:
               this.$message({
                  type: "warning",
                  message: "请选择错误分级"
               });
               break;
            case this.form.errorContent:
               this.$message({
                  type: "warning",
                  message: "请输入错误内容"
               });
               break;
            case this.form.preparerName:
               this.$message({
                  type: "warning",
                  message: "请输入报告人"
               });
               break;
            case this.form.drugTradeName:
               this.$message({
                  type: "warning",
                  message: "请输入药品商品名"
               });
               break;

            default:
               this.$confirm("是否确认提交,?", "提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
               })
                  .then(() => {
                     //新增
                     if (this.disabled == 1) {
                        addObj(this.form).then(res => {
                           this.$message({
                              showClose: true,
                              message: "添加成功",
                              type: "success"
                           });
                           this.getList();
                           this.flag = false;
                        });
                     }
                     //修改
                     if (this.disabled == 3) {
                        UpdateObj(this.form).then(res => {
                           this.$message({
                              showClose: true,
                              message: "添加成功",
                              type: "success"
                           });
                           this.getList();
                           this.flag = false;
                        });
                     }
                     // //提交
                  })
                  .catch(() => {
                     this.$message({
                        type: "info",
                        message: "已取消提交"
                     });
                  });
               break;
         }
      },
      handleCreate(row, index, done, loading) {
         putObj(row.nurseId)
            .then(data => {
               this.$refs.crud.rowView(data.data.data, index);
               done();
            })
            .catch(() => {});
      },
      //点击修改提交

      getList(params) {
         this.tableLoading = true;
         fetchList(
            Object.assign(
               {
                  current: this.page.currentPage,
                  size: this.page.pageSize
               },
               params,
               this.searchForm
            )
         )
            .then(response => {
               this.tableData = response.data.data.records;
               this.page.total = response.data.data.total;
               this.tableLoading = false;
            })
            .catch(() => {
               this.tableLoading = false;
            });

         getdictionaries().then(res => {
            this.dictionariesList = res.data.data;
         });
      },
      rowDel: function(row, index) {
         index += 1;
         var _this = this;
         this.$confirm("是否确认删除序号为" + index, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
         })
            .then(function() {
               return delObj(row.id);
            })
            .then(data => {
               _this.tableData.splice(index, 1);
               _this.$message({
                  showClose: true,
                  message: "删除成功",
                  type: "success"
               });
               this.getList();
            });
      },
      /**
       * @title 数据更新
       * @param row 为当前的数据
       * @param index 为当前更新数据的行数
       * @param done 为表单关闭函数
       *
       **/
      //点击编辑
      handleUpdate: function(row, index, done, loading) {
         putObj(row.nurseId)
            .then(data => {
               this.$refs.crud.rowEdit(data.data.data, index);
               done();
            })
            .catch(() => {});
      },
      /**
       * @title 数据添加
       * @param row 为当前的数据
       * @param done 为表单关闭函数
       *
       **/
      // handleSave: function(row, done, loading) {
      //   addObj(row)
      //     .then(data => {
      //       this.tableData.push(Object.assign({}, row));
      //       this.$message({
      //         showClose: true,
      //         message: "添加成功",
      //         type: "success"
      //       });
      //       done();
      //       this.getList(this.page);
      //     })
      //     .catch(() => {
      //       loading();
      //     });
      // },
      /**
       * 搜索回调
       */

      searchChange(form) {
         form.patientName = this.patientId;
         this.searchForm = form;
         this.getList(form);
      },

      clearform() {
         this.patientId = "";
         this.page = {
            total: 0, // 总页数
            currentPage: 1, // 当前页数
            pageSize: 10 // 每页显示多少条
         };
         this.searchForm = {};
         this.getList();
      },
      /**
       * 刷新回调
       */
      refreshChange() {
         this.patientId = "";
         this.page.currentPage = 1;
         this.page.pageSize = 10;
         this.searchForm = {};
         this.getList();
      }
   }
};
</script>

<style lang="scss">
.drug {
   td {
      width: 25%;
   }
}
.drug_buttom {
   td {
      width: 12.5% !important;
   }
}
.execution {
   overflow-x: auto !important;
   .occupation {
      min-width: 1100px;
      width: 100%;

      th,
      td {
         border: 1px solid #ebeef5;
         line-height: 45px;
      }
      td {
         padding-left: 2%;
      }
      .tdrow {
         text-align: center;
         vertical-align: middle;
      }
      input,
      textarea {
         border: none;
         border-radius: 0;
         border-bottom: 1px solid #dcdfe6;
      }
   }

   .Display {
      flex-direction: column;
      display: flex;
   }
   .sub_btn {
      margin-top: 30px;
      display: flex;
      justify-content: center;
   }
}
h3 {
   text-align: center;
   margin-bottom: 20px;
}
</style>
