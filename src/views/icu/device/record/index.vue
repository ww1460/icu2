<template>
   <!-- 设备使用记录 -->
   <div class="execution">
      <basic-container>
         <avue-crud
            ref="crud"
            :page="page"
            :data="tableData"
            :permission="permissionList"
            :table-loading="tableLoading"
            :option="tableOption"
            @row-update="handleUpdate"
            @row-del="rowDel"
            @size-change="sizeChange"
            @current-change="currentChange"
            @search-change="searchChange"
            @search-reset="handleSearchReset"
         >
            <template slot="search">
               <el-form-item>
                  <!-- <el-select
              size="small"
              clearable
              v-model="searchForm.solt"
              placeholder="请选择患者"
              v-if="vIfNurse"
            >
              <el-option
                v-for="item in searchOptions"
                :key="item.patientId"
                :label="item.patientName"
                :value="item.patientName"
              ></el-option>
            </el-select>
            <el-select
              size="small"
              clearable
              v-model="searchForm.solt"
              placeholder="请选择患者"
              v-if="vIfMatron"
            >
              <el-option
                v-for="item in searchOptions"
                :key="item.value"
                :label="item.label"
                :value="item.name"
              ></el-option>
                  </el-select>-->
                  <patientChose :getList="getList" ref="patientChoseChild" :page="page" />
               </el-form-item>
            </template>
         </avue-crud>
      </basic-container>
   </div>
</template>

<script>
import { getObj, putObj, delObj, fetchList } from "@/api/icu/device/record";
import { tableOption } from "@/const/crud/icu/device/record";
import { mapGetters, mapState } from "vuex";
import patientChose from "@/views/icu/index/patientChose";

export default {
   name: "Tenant",
   components: {
      patientChose
   },
   data() {
      return {
         // 搜索
         searchOptions: [],
         searchForm: {},
         vIfNurse: "",
         vIfMatron: "",
         // 分页
         page: {
            total: 0, // 总页数
            currentPage: 1, // 当前页数
            pageSize: 10 // 每页显示多少条
         },
         // 页面数据
         tableData: [],
         tableLoading: false,
         tableOption: tableOption
      };
   },
   computed: {
      // 权限
      ...mapGetters(["permissions", "nurse_patients", "dep_patients"]),
      ...mapState({
         roleCodes: state => state.user.roleCodes
      }),
      permissionList() {
         return {
            delBtn: this.vaildData(this.permissions.icu_device_del, false),
            editBtn: this.vaildData(this.permissions.icu_device_edit, false)
         };
      }
   },
   created() {
      //  this.getNursePatients();
      //  this.getList()
   },
   methods: {
      // 解决分页BUG
      sizeChange(val) {
         this.page.currentPage = 1;
         this.page.pageSize = val;
         this.getList();
      },
      currentChange(val) {
         this.page.currentPage = val;
         this.getList();
      },
      // 拿到权限
      //  getNursePatients() {
      //    if (this.roleCodes == "ROLE_MATRON") {
      //      this.vIfNurse = false;
      //      this.vIfMatron = true;
      //      this.$store.dispatch("getPatientsByDep").then(response => {
      //        this.searchOptions = this.dep_patients.patients;
      //      });
      //    }
      //    if (this.roleCodes == "ROLE_NURSE") {
      //      this.vIfNurse = true;
      //      this.vIfMatron = false;
      //      this.$store.dispatch("getPatientsByNurseId").then(response => {
      //        this.searchOptions = this.nurse_patients;
      //      });
      //    }
      //    this.$forceUpdate();
      //  },
      // 分页查询
      getList( params) {
         this.tableLoading = true;
         // if (this.searchForm.solt != "") {
         //   if (this.vIfNurse == true) {
         //     for (const i in this.searchOptions) {
         //       if (this.searchForm.solt == this.searchOptions[i].patientName) {
         //         params = {
         //           patientId: this.searchOptions[i].patientId
         //         };
         //       }
         //     }
         //   } else {
         //     for (const i in this.searchOptions) {
         //       if (this.searchForm.solt == this.searchOptions[i].name) {
         //         params = {
         //           patientId: this.searchOptions[i].patientId
         //         };
         //       }
         //     }
         //   }
         // }
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
      },
      // 删除
      rowDel: function(row, index) {
         var _this = this;
         if (row.endTime != null) {
            this.$confirm("是否确认删除ID为" + row.id, "提示", {
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
         } else {
            this.$message.error("设备使用中，不可删除");
         }
      },
      // 修改
      handleUpdate(row, index, done) {
         this.tableLoading = true;
         putObj(row)
            .then(() => {
               this.$message({
                  showClose: true,
                  message: "修改成功",
                  type: "success"
               });
               this.tableLoading = false;
               this.getList();
               done();
            })
            .catch(() => {
               this.tableLoading = false;
            });
      },
      // 清空
      handleSearchReset() {
         this.searchForm = {};
         this.page = {
            total: 0, // 总页数
            currentPage: 1, // 当前页数
            pageSize: 10 // 每页显示多少条
         };
         this.$refs.patientChoseChild.patientReset();
         this.getList();
      },
      // 搜索
      searchChange(form) {
         // if (this.vIfNurse == true) {
         //   for (const i in this.searchOptions) {
         //     if (this.searchForm.solt == this.searchOptions[i].patientName) {
         //       var patient = {
         //         patientId: this.searchOptions[i].patientId
         //       };
         //     }
         //   }
         // } else {
         //   for (const i in this.searchOptions) {
         //     if (this.searchForm.solt == this.searchOptions[i].name) {
         //       var patient = {
         //         patientId: this.searchOptions[i].patientId
         //       };
         //     }
         //   }
         // }
         var patient = {
            patientId: this.$refs.patientChoseChild.patientId
         };
         this.page = {
            total: 0, // 总页数
            currentPage: 1, // 当前页数
            pageSize: 10 // 每页显示多少条
         };

         this.getList(patient);
      }
   }
};
</script>

<style lang="scss" scoped>
</style>
