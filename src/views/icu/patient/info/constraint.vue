
<template>
   <div class="restrain1">
      <div v-if="flag">
         <avue-crud
            ref="crud"
            :page="page"
            :data="tableData"
            :permission="permissionList"
            :table-loading="tableLoading"
            :option="tableOption"
            @search-change="searchChange"
            @refresh-change="refreshChange"
            @row-update="Update"
            @row-del="rowDel"
            @search-reset="clearform"
            :cell-style="cellStyle"
            @size-change="sizeChange"
            @current-change="currentChange"
         >
            <template slot="searchMenu">
               <el-button type="primary" icon="el-icon-plus" size="small" @click="Adding">新增</el-button>
            </template>
            <!-- <template slot="search">
          <el-col :md="4" :xs="24">
            <el-form-item label="患者姓名">
              <el-select style="width:100%" placeholder="请选择患者" size="small" v-model="patientId">
                <el-option
                  v-for="item in patientList"
                  :key="item.id"
                  :value="item.patientId"
                  :label="(roleCodes == 'ROLE_MATRON' ? item.name : roleCodes == 'ROLE_NURSE' ? item.patientName:'')"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
            </template>-->
            <template slot="search">
               <el-form :inline="true" class="add">
                  <el-col :md="4" :xs="24">
                     <el-form-item label="执行护士">
                        <el-select
                           style="width:100%"
                           placeholder="请选择护士"
                           v-model="executeNurse"
                           size="small"
                        >
                           <el-option
                              v-for="item in nurseList"
                              :key="item.id"
                              :value="item.realName"
                              :label="item.realName"
                           ></el-option>
                        </el-select>
                     </el-form-item>
                  </el-col>
               </el-form>
            </template>
         </avue-crud>
         <el-dialog
            title="新增"
            @close="closeDilog('form')"
            :visible.sync="dialogFormVisible"
            width="60%"
         >
            <el-form :model="form" :rules="rules" ref="form" :label-width="'120px'">
               <el-row>
                  <el-col
                     class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
                  >
                     <el-form-item label="患者姓名">
                        <el-input v-model="messages.name" disabled></el-input>
                     </el-form-item>
                  </el-col>

                  <el-col
                     class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
                  >
                     <el-form-item label="执行护士" prop="executeNurse">
                        <el-select style="width:100%" v-model="form.executeNurse">
                           <el-option
                              v-for="item in nurseList"
                              :key="item.id"
                              :value="item.realName"
                              :label="item.realName"
                           ></el-option>
                        </el-select>
                     </el-form-item>
                  </el-col>
               </el-row>

               <el-row>
                  <el-col
                     class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
                  >
                     <el-form-item label="是否告知" prop="ifKnowInform">
                        <el-radio-group v-model="form.ifKnowInform">
                           <el-radio label="0">未告知</el-radio>
                           <el-radio label="1">已告知</el-radio>
                        </el-radio-group>
                     </el-form-item>
                  </el-col>
                  <el-col
                     class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
                  >
                     <el-form-item label="患者反映" prop="patientResponse">
                        <el-input v-model="form.patientResponse"></el-input>
                     </el-form-item>
                  </el-col>
               </el-row>

               <el-row>
                  <el-col
                     class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
                  >
                     <el-form-item label="约束原因" prop="constraintCause">
                        <el-input v-model="form.constraintCause"></el-input>
                     </el-form-item>
                  </el-col>
                  <el-col
                     class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
                  >
                     <el-form-item label="约束时间" prop="constraintTime">
                        <el-date-picker
                           v-model="form.constraintTime"
                           type="datetime"
                           style="width:100%"
                           placeholder="选择日期时间"
                           align="right"
                           format="yyyy-MM-dd HH:mm"
                           value-format="yyyy-MM-dd HH:mm:ss"
                           :picker-options="pickerOptions1"
                        ></el-date-picker>
                     </el-form-item>
                  </el-col>
               </el-row>
               <el-row>
                  <el-col
                     class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
                  >
                     <el-form-item label="约束部位描述">
                        <el-input v-model="form.constraintPartDescribe"></el-input>
                     </el-form-item>
                  </el-col>
                  <el-col
                     class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
                  >
                     <el-form-item label="约束带数量">
                        <el-input-number v-model="form.constraintNumber" :min="0" style="width:100%"> </el-input-number>
                     </el-form-item>
                  </el-col>
               </el-row>
               <el-row>
                  <el-col
                     class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
                  >
                     <el-form-item label="患者并发症">
                        <el-input v-model="form.patientComplication"></el-input>
                     </el-form-item>
                  </el-col>
                  <el-col
                     class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
                  >
                     <el-form-item label="并发症处理">
                        <el-input v-model="form.complicationManage"></el-input>
                     </el-form-item>
                  </el-col>
               </el-row>
               <el-row>
                  <el-col
                     class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
                  >
                     <el-form-item label="知情同意书">
                        <el-button
                           type="text"
                           icon="el-icon-notebook-1"
                           @click="constraintDocument()"
                        >知情同意书</el-button>
                     </el-form-item>
                  </el-col>
               </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
               <el-button type="primary" @click="Submitconstraint('form')">保 存</el-button>
               <el-button @click="resetForm('form')">取 消</el-button>
            </div>
         </el-dialog>
      </div>
      <el-dialog title="知情文书" :visible.sync="flag1" width="90%" :fullscreen="isFullscreen">
         <div style="border:1px solid #EBEEF5;padding:20px" id="print">
            <div class="ql-container ql-snow">
               <div class="ql-editor">
                  <div v-html="knowWrit.writContent"></div>
                  <div v-html="doctorStatement.writContent"></div>
                  <span style="width:50%;height:50px;display:block">
                     <span style="display:inline-block;position: relative;top: -19px;">医生签名:</span>
                     <a @click="auto(1)" style="width:100px;height:50px;display:inline-block;">
                        <img
                           :src="doctorImg"
                           alt
                           style="width:100px;height:50px;display:inline-block"
                        />
                     </a>
                  </span>
                  <p
                     style="font-weight: 100;font-size: 18px;text-align:right"
                  >{{year}}年{{month+1}}月{{day}}日{{getHours}}时</p>
                  <div v-html="patientsInformedChoice.writContent"></div>
                  <p style="padding:5px 0">
                     <strong>知情选择：</strong>
                     <label style="cursor: pointer;"><span>同意保护性约束：<input type="radio" value="0" v-model="agreenValue" /></span></label>
                     <label style="cursor: pointer;"><span style="margin-left:30px">不同意保护性约束：<input type="radio" value="1" v-model="agreenValue" /></span></label>
                  </p>
                  <p>
                     <strong>如家属不同意实施保护性约束，由此发生的意外后果家属自负。</strong>
                  </p>
                  <p style="display:flex">
                     <span style="width:50%;height:50px;">
                        <span style="display:inline-block;position: relative;top: -19px;">患者授权亲属签名:</span>
                        <a @click="auto(2)" style="width:100px;height:50px;display:inline-block;">
                           <img
                              :src="patientImg"
                              alt
                              style="width:100px;height:50px;display:inline-block"
                           />
                        </a>
                     </span>
                     <span style="width:50%;height:50px;display:block">
                        <span style="display:inline-block;position: relative;top:6px;">与患者关系:</span>
                        <input
                           type="text"
                           v-model="matter"
                           id="matter"
                           style="width: 50%;height:30px;border-top: 0;border-left:0;border-right:0;text-indent:5px;position:relative;top:6px;"
                        />
                     </span>
                  </p>
                  <p
                     style="font-weight: 100;font-size: 18px;text-align:right"
                  >{{year}}年{{month+1}}月{{day}}日{{getHours}}时</p>
               </div>
            </div>
         </div>
         <div class="operation">
            <el-button @click="sub()" class="el-button el-button--primary" :loading="subLoading">提交</el-button>
            <el-button @click="close()">返回</el-button>
         </div>
      </el-dialog>
      <div v-if="autoFlag">
         <autograph />
      </div>
   </div>
</template>

<script>
import {
   addObj,
   delObj,
   fetchList,
   putObj,
   UpdateObj,
   inquire,
   getNursList
} from "@/api/icu/matron/constraintsRecord/constraintsRecord";
import {
   patientDocuments,
   informedDocuments
} from "@/api/icu/matron/document/docManage";
import { tableOption } from "@/const/crud/icu/matron/constraintsRecord/constraintsRecord";
import { mapGetters, mapState } from "vuex";
import autograph from "../components/autograph";
import { dateFormat, calcDate } from "@/util/date";
export default {
   name: "constraint",
   props: {
      messages: Object
   },
   components: {
      autograph
   },
   data() {
      return {
         flag: true,
         flag1: false,
         autoFlag: false,
         subLoading: false,
         isFullscreen: false,
         screenWidth: document.body.clientWidth, // 屏幕尺寸
         patientImg: "",
         doctorImg: "",
         dataImg: "",
         year: "",
         day: "",
         month: "",
         getMinutes: "",
         getHours: "",
         params: {},
         patientId: "",
         searchForm: {},
         tableData: [],
         matter: "",
         agreenValue: "",
         page: {
            total: 0, // 总页数
            currentPage: 1, // 当前页数
            pageSize: 10 // 每页显示多少条
         },
         tableLoading: false,
         tableOption: tableOption,
         dialogFormVisible: false,
         form: {
            complicationManage: "",
            constraintCause: "",
            constraintNumber: "",
            constraintPartDescribe: "",
            constraintTime: "",
            executeNurse: "",
            ifKnowInform: "",
            patientComplication: "",
            patientName: "",
            patientId: "",
            patientResponse: "",
            constraintNumber: ""
         },
         executeNurse: "",
         nurseList: [],
         patientList: [],
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
         knowWrit: {},
         patientsInformedChoice: {},
         doctorStatement: {},
         rules: {
            executeNurse: [
               { required: true, message: "请选择执行护士", trigger: "change" }
            ],
            ifKnowInform: [
               { required: true, message: "请选择是否告知", trigger: "change" }
            ],
            constraintTime: [
               { required: true, message: "请选择时间", trigger: "change" }
            ],
            patientResponse: [
               { required: true, message: "请输入患者反映", trigger: "blur" }
            ],
            constraintCause: [
               { required: true, message: "请输入约束原因", trigger: "blur" }
            ]
         }
      };
   },
   watch: {
      messages: {
         handler(newValue, oldValue) {
            this.messages = newValue;
            this.patientId = this.messages.patientId;
            this.form.patientId = this.messages.patientId;
            this.form.patientName = this.messages.name;

            this.searchForm.patientId = this.messages.patientId;
            this.page = {
               total: 0, // 总页数
               currentPage: 1, // 当前页数
               pageSize: 10 // 每页显示多少条
            };
            this.getList();
         },
         deep: true
      },
      screenWidth(val) {
         // console.log(val);
         if (this.screenWidth <= 1024) {
            this.isFullscreen = true;
         } else {
            this.isFullscreen = false;
         }
      }
   },
   computed: {
      ...mapGetters(["permissions", "nurse_patients", "dep_patients"]),
      permissionList() {
         return {
            addBtn: this.vaildData(this.permissions.icu_nurse_add, false),
            delBtn: this.vaildData(this.permissions.icu_nurse_del, false),
            editBtn: this.vaildData(this.permissions.icu_nurse_edit, false)
         };
      },
      ...mapState({
         roleCodes: state => state.user.roleCodes
      })
   },
   created() {
      window.addEventListener("resize", this.init);
      getNursList().then(res => {
         this.nurseList = res.data.data;
      });

      if (this.roleCodes == "ROLE_MATRON") {
         this.patientList = this.dep_patients.patients;
         this.nurseList = this.dep_patients.nurses;
      } else if (this.roleCodes == "ROLE_NURSE") {
         this.patientList = this.nurse_patients;
      }
   },
   mounted() {
      if (this.messages.patientId) {
         this.searchForm.patientId = this.messages.patientId;
         this.getList();
      }
      this.init();
   },
   methods: {
      closeDilog(formName) {
         this.$nextTick(() => {
            this.$refs[formName].resetFields();
         });
      },

      //关闭表单验证
      resetForm(formName) {
         this.$nextTick(() => {
            this.dialogFormVisible = false;
            this.$refs[formName].resetFields();
         });
      },
      sizeChange(val) {
         this.page.currentPage = 1;
         this.page.pageSize = val;
         this.getList();
      },
      currentChange(val) {
         this.page.currentPage = val;
         this.getList();
      },
      cellStyle({ row, column, rowIndex, columnIndex }) {
         if (columnIndex == 5) {
            if (row.ifKnowInform == 1) {
               return {
                  color: "#67C23A"
               };
            } else if (row.ifKnowInform == 0) {
               return {
                  color: "#F56C6C"
               };
            }
         }
      },

      init() {
         window.screenWidth = document.body.clientWidth;
         this.screenWidth = window.screenWidth;
         if (this.screenWidth <= 1024) {
            this.isFullscreen = true;
         } else {
            this.isFullscreen = false;
         }
         window.onresize = () => {
            setTimeout(() => {
               window.screenWidth = document.body.clientWidth;
               this.screenWidth = window.screenWidth;
            }, 0);
         };
      },
      //新增提交
      Submitconstraint(formName) {
         this.$refs[formName].validate(valid => {
            if (valid) {
               this.form.patientName = this.messages.name;
               this.form.patientId = this.messages.patientId;
               addObj(this.form).then(data => {});
               this.$message({
                  showClose: true,
                  message: "添加成功",
                  type: "success"
               });
               this.dialogFormVisible = false;
               let params = {
                  patientId: this.messages.patientId
               };
               this.searchForm = params;
               this.getList();

               this.form = {
                  complicationManage: "",
                  constraintCause: "",
                  constraintNumber: "",
                  constraintPartDescribe: "",
                  constraintTime: "",
                  executeNurse: "",
                  ifKnowInform: "",
                  patientComplication: "",
                  patientResponse: "",
                  constraintNumber: ""
               };
            } else {
               return false;
            }
         });
      },
      Adding() {
         this.dialogFormVisible = true;
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
      Update(row, index, loading) {
         UpdateObj(row)
            .then(data => {
               this.$refs.crud.rowEdit(data.data.data, index);
               this.tableData.splice(index, 1, Object.assign({}, row));
               this.$message({
                  showClose: true,
                  message: "修改成功",
                  type: "success"
               });
               done();
               this.getList();
            })
            .catch(() => {
               loading();
            });
      },

      getList(params) {
         if (this.messages.patientId) {
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
         }
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
      handleSave: function(row, done, loading) {
         addObj(row)
            .then(data => {
               this.tableData.push(Object.assign({}, row));
               this.$message({
                  showClose: true,
                  message: "添加成功",
                  type: "success"
               });
               done();
               this.getList();
            })
            .catch(() => {
               loading();
            });
      },
      /**
       * 搜索回调
       */
      searchChange(form) {
         this.page = {
            total: 0, // 总页数
            currentPage: 1, // 当前页数
            pageSize: 10 // 每页显示多少条
         };
         form.patientId = this.messages.patientId;
         form.executeNurse = this.executeNurse;
         this.searchForm = form;
         this.getList( form);
      },
      /**
       * 刷新回调
       */
      refreshChange() {
         this.getList();
      },
      //清空回调
      clearform() {
         this.page = {
            total: 0, // 总页数
            currentPage: 1, // 当前页数
            pageSize: 10 // 每页显示多少条
         };
         this.executeNurse = "";
         this.patientId = "";
         this.searchForm = {};
         this.searchForm.patientId = this.messages.patientId;
         this.getList();
      },
      constraintDocument() {
         this.year = new Date().getFullYear();
         this.month = new Date().getMonth();
         this.day = new Date().getDate();
         this.getHours = new Date().getHours();
         this.getMinutes = new Date().getMinutes();
         informedDocuments("bhxyszqtys")
            .then(response => {
               this.knowWrit = response.data.data[0];
               this.flag1 = true;
               // this.flag = false;
            })
            .catch(() => {
               // alert("请求失败");
            });
         informedDocuments("yshzzqxz")
            .then(response => {
               this.patientsInformedChoice = response.data.data[0];
            })
            .catch(() => {
               // alert("请求失败");
            });
         informedDocuments("ysyscs")
            .then(response => {
               this.doctorStatement = response.data.data[0];
            })
            .catch(() => {
               // alert("请求失败");
            });
      },
      close() {
         // this.flag = true;
         this.flag1 = false;
         this.matter = "";
         this.doctorImg = "";
         this.patientImg = "";
         this.agreenValue = "";
      },
      auto(data) {
         this.flag = false;
         this.flag1 = false;
         this.autoFlag = true;
         if (data == 1) {
            this.dataImg = data;
         } else if (data == 2) {
            this.dataImg = data;
         }
      },
      return(img) {
         this.flag = true;
         this.flag1 = true;
         this.autoFlag = false;
         if (this.dataImg == 1) {
            this.doctorImg = img;
         } else if (this.dataImg == 2) {
            this.patientImg = img;
         }
      },
      sub() {
         if (this.messages.patientId) {
            var value = `<span style='position: relative;top: 6px;'>${this.matter}</span>`;
            // console.log(this.matter)
            var newstr = document
               .getElementById("print")
               .innerHTML.replace(
                  '<input type="text" id="matter" style="width: 50%; height: 30px; border-top: 0px; border-left: 0px; border-right: 0px; text-indent: 5px; position: relative; top: 6px;">',
                  value
               );

            // console.log(newstr);
            if (this.agreenValue == "0") {
               var newstr1 = newstr.replace(
                  '<label style="cursor: pointer;"><span>同意保护性约束：<input type="radio" value="0"></span></label><label style="cursor: pointer;"><span style="margin-left: 30px;">不同意保护性约束：<input type="radio" value="1"></span></label>',
                  "<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;同意保护性约束&nbsp;（√）&nbsp;&nbsp;&nbsp;不同意保护性约束&nbsp;（&nbsp;&nbsp;）</div>"
               );
            } else if (this.agreenValue == "1") {
               var newstr1 = newstr.replace(
                  '<label style="cursor: pointer;"><span>同意保护性约束：<input type="radio" value="0"></span></label><label style="cursor: pointer;"><span style="margin-left: 30px;">不同意保护性约束：<input type="radio" value="1"></span></label>',
                  "<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;同意保护性约束&nbsp;（&nbsp;&nbsp;）&nbsp;&nbsp;&nbsp;不同意保护性约束&nbsp;（√）&nbsp;&nbsp;&nbsp;</div>"
               );
            }
            // console.log(newstr1);
            switch ("") {
               case this.doctorImg:
                  this.$message.warning("请医生签名");
                  break;
               case this.agreenValue:
                  this.$message.warning("请选择保护性约束");
                  break;
               case this.patientImg:
                  this.$message.warning("请授权患者家属签名");
                  break;
               default:
                  this.subLoading = true
                  var forms = {
                     knowWritContent: newstr1,
                     patientId: this.messages.patientId,
                     knowWritId: this.knowWrit.knowWritId,
                     patientName: this.messages.name,
                     signatureTime: dateFormat(new Date())
                  };
                  patientDocuments(forms).then(()=>{
                     this.$message({
                        message: "提交成功",
                        type: "success"
                     });
                     this.close();
                     this.subLoading = false;
                  })
                  break;
            }
         }
        
      }
   }
};
</script>

<style lang="scss">
.restrain1 {
   .operation {
      text-align: center;
      padding: 50px 0;
      background-color: #fff !important;
   }
   .operation button:last-child {
      margin-left: 30px;
   }
   .add {
      .el-col {
         margin-bottom: 0px !important;
      }
   }
}
</style>