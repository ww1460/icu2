<template>
   <!-- 患者列表 -->
   <div class="executionList">
      <basic-container>
         <avue-crud
            ref="crud"
            :page="page"
            :data="tableData"
            :table-loading="tableLoading"
            :option="tableOption"
            @row-update="handleUpdate"
            @row-save="handleSave"
            @size-change="sizeChange"
            @current-change="currentChange"
            @search-change="searchChange"
            @search-reset="reset"
         >
            <!-- <template slot-scope="scope" slot="menu">
               <el-button
                  type="text"
                  size="mini"
                  icon="el-icon-upload2"
                  @click="handleOut(scope.row,scope.index)"
               >出科</el-button>
            </template>-->
            <template slot="search">
               <el-col :md="4" :xs="24">
                  <el-form-item>
                     <el-input
                        placeholder="患者姓名"
                        v-model="searchForm.name"
                        @input="search"
                        size="small"
                        clearable
                     ></el-input>
                  </el-form-item>
               </el-col>
               <el-col :md="4" :xs="24">
                  <el-form-item>
                     <el-input
                        placeholder="住院号"
                        v-model="searchForm.hospitalnumber"
                        @input="search"
                        size="small"
                        clearable
                     ></el-input>
                  </el-form-item>
               </el-col>
               <el-col :md="4" :xs="24">
                  <el-form-item>
                     <el-input
                        placeholder="病情"
                        v-model="searchForm.diagnosis"
                        @input="search"
                        size="small"
                        clearable
                     ></el-input>
                  </el-form-item>
               </el-col>
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
   putObj
} from "@/api/icu/patientManagement/patientList";
import { tableOption } from "@/const/crud/icu/patientManagement/patientList";
import { mapGetters, mapState } from "vuex";

export default {
   name: "patientList",
   data() {
      return {
         searchForm: {},
         tableData: [],
         page: {
            total: 0, // 总页数
            currentPage: 1, // 当前页数
            pageSize: 10 // 每页显示多少条
         },
         tableLoading: false,
         tableOption: tableOption,
         addBtn: true,
         editBtn: true,
         outBtn: true,
         administrative: []
      };
   },
   computed: {
      ...mapGetters(["permissions"]),
      ...mapState({
         roleCodes: state => state.user.roleCodes
      })
      // permissionList() {
      //   return {
      //     addBtn: this.vaildData(this.permissions.icu_patient_list_add, false),
      //     editBtn: this.vaildData(this.permissions.icu_patient_list_edit, false),
      //     outBtn: this.vaildData(this.permissions.icu_patient_list_out, false)
      //   };
      // }
   },
   created() {
      this.searchForm = {};
      this.getList();
   },
   methods: {
      getList() {
         this.tableLoading = true;
         this.ministrative = [];

         if (this.roleCodes == "ROLE_NURSE") {
            fetchList(
               Object.assign(
                  {
                     current: this.page.currentPage,
                     size: this.page.pageSize
                  },
                  this.searchForm
               )
            )
               .then(response => {
                  if (response.data.data.length < 10) {
                     this.tableData = response.data.data;
                     // this.traver()
                  } else {
                     this.tableData = response.data.data.records;
                     // this.traver()
                  }

                  this.page.total = response.data.data.total;
                  this.tableLoading = false;
               })
               .catch(() => {
                  this.tableLoading = false;
               });
         } else if (this.roleCodes == "ROLE_MATRON") {
            fetchList(
               Object.assign(
                  {
                     current: this.page.currentPage,
                     size: this.page.pageSize
                  },
                  this.searchForm
               )
            )
               .then(response => {
                  this.tableData = response.data.data.records;
                  this.page.total = response.data.data.total;
                  this.tableLoading = false;
                  // this.traver()
               })
               .catch(() => {
                  this.tableLoading = false;
               });
         }
      },
      search() {
         this.page = {
            total: 0, // 总页数
            currentPage: 1, // 当前页数
            pageSize: 10 // 每页显示多少条
         };
         switch ("") {
            case this.searchForm.diagnosis:
               delete this.searchForm.diagnosis;
               break;
            case this.searchForm.name:
               delete this.searchForm.name;
               break;
            case this.searchForm.hospitalnumber:
               delete this.searchForm.hospitalnumber;
               break;
            default:
               this.searchForm;
               break;
         }
         this.getList();
      },
      searchChange() {
         this.page = {
            total: 0, // 总页数
            currentPage: 1, // 当前页数
            pageSize: 10 // 每页显示多少条
         };
         this.getList();
      },
      reset() {
         this.searchForm = {};
         this.page = {
            total: 0, // 总页数
            currentPage: 1, // 当前页数
            pageSize: 10 // 每页显示多少条
         };
         this.getList();
      },
      // traver() {
      //    console.log(this.administrative)
      //    this.tableData.forEach(i => {
      //       this.administrative.forEach(j => {
      //          if (i.admissionDepartment == String(j.value)) {
      //             console.log(i)
      //             console.log(j)
      //             i.admissionDepartment = j.label;
      //          }
      //       });
      //    });
      // },
      // 出科
      handleOut: function(row, index) {
         var _this = this;
         this.$confirm("是否确认患者出科: " + row.name, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
         }).then(function() {
            _this.$router.push({
               path: "/icu/process/outDepartment/index",
               query: {
                  obj: row
               }
            });
         });
      },
      // 修改
      handleUpdate: function(row, index, done, loading) {
         putObj(row).then(() => {
            this.$message({
               showClose: true,
               message: "修改成功",
               type: "success"
            });

            this.getList(this.page);
            this.$store.dispatch("getAllPatients");
            done();
         });
      },
      // 新增
      handleSave: function(row, done, loading) {
         // Object.assign(row, {
         //    // phone: Number(row.phone),
         //    frequency: Number(row.frequency),
         //    age: Number(row.age),
         //    monthage: Number(row.monthage)
         // });
         // if (row.age == 0) {
         //    row.age = "";
         // }
         //  addObj(row)
         //    .then(data => {
         //       this.$message({
         //          showClose: true,
         //          message: "添加成功",
         //          type: "success"
         //       });
         //       this.getList(this.page);
         //       this.getDepPatients();
         //       done();
         //    })
         //    .catch(() => {
         //       loading();
         //    });
      },
      sizeChange(val) {
         this.page.pageSize = val;
         this.getList()
      },
      currentChange(val) {
         this.page.currentPage = val;
         this.getList()
      }
      // getDepPatients() {
      //    this.$store.dispatch("getPatientsByDep").then(response => {
      //       this.$emit("getListToggle");
      //       console.log(response.patients[0]);
      //       var data = response.patients[0]
      //       var name = response.patients[0].name
      //       this.$confirm(
      //          "是否对患者“" + name + "”走入科流程?",
      //          {
      //             confirmButtonText: "确定",
      //             cancelButtonText: "取消",
      //             type: "warning",
      //          }
      //       ).then(() => {
      //          this.$router.push({
      //             path: "/icu/process/entryDepartment/index",
      //             query: {
      //                obj: data
      //             }
      //          });
      //       });
      //    });
      // }
   }
};
</script>

<style lang="scss">
// .executionList .AllNurse {
//    width: 100%;
//    height: 150px;
//    border: 1px solid rgb(238, 238, 238);
//    overflow-y: auto;
//    button {
//       width: 75px;
//       margin-left: 1%;
//       margin: 3% 4% 0 4%;
//    }
// }
// .executionList .devBtn {
//    background: #409eff !important;
//    color: #fff !important;
// }
// .executionList .el-card__body {
//    padding: 0 !important;
// }
// .executionList .basic-container {
//    padding: 0 !important;
// }
// .executionList .avue-crud {
//    width: 100%;
// }
// .executionList .el-button:first-child {
//    // width: 75px !important;
//    height: 34px !important;
// }
</style>
