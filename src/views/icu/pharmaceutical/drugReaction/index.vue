
<template>
   <!-- 药物不良反应 -->
   <div>
      <basic-container>
         <avue-crud
            ref="crud"
            :data="tableData"
            :table-loading="tableLoading"
            :option="tableOption"
            @search-change="searchChange"
            @row-update="Update"
            @row-save="handleSave"
            @row-del="rowDel"
            @search-reset="reset"
            :page="page"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
         >
            <template slot="search">
               <el-col :md="4" :xs="24">
                  <el-form-item>
                     <!-- <el-select
                        v-model="patientId"
                        placeholder="患者姓名"
                        size="small"
                        @change="chosePatient"
                        clearable
                     >
                        <el-option
                           v-for="item in patientNames"
                           :key="item.patientId"
                           :label="item.patientName + ' ' +item.bedName"
                           :value="item.patientId"
                           style="width:100%"
                        ></el-option>
                     </el-select>-->
                     <patientChose :getList="getList" ref="patientChoseChild" :page="page" />
                  </el-form-item>
               </el-col>
               <el-col :md="4" :xs="24">
                  <el-form-item>
                     <el-input
                        placeholder="药物名称"
                        v-model="searchForm.drugName"
                        @input="drugNamechange"
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
   fetchList,
   UpdateObj,
   delObj,
   getnurse
} from "@/api/icu/pharmaceutical/drugReaction/drugReaction";
import { tableOption } from "@/const/crud/icu/pharmaceutical/drugReaction/drugReaction";
import { mapGetters, mapState } from "vuex";
import patientChose from "@/views/icu/index/patientChose";

export default {
   name: "drugReaction",
   components: {
      patientChose
   },
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
         patientNames: [],
         patientId: ""
      };
   },
   computed: {
      ...mapGetters(["permissions", "all_patients", "patientMessage"]),
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
   // watch: {
   //    patientMessage: {
   //       handler(newValue, oldValue) {
   //          this.chosePatient(newValue.patientId);
   //          this.patientId = newValue.patientId;
   //       }
   //    }
   // },
   // created() {
   //    let data = JSON.parse(sessionStorage.getItem("pigx-all_patients"))
   //       .content;
   //    this.patientNames = data;
   //    this.name = JSON.parse(
   //       sessionStorage.getItem("pigx-patientMessage")
   //    ).content.patientId.name;
   //    this.patientId = JSON.parse(
   //       sessionStorage.getItem("pigx-patientMessage")
   //    ).content.patientId;
   //    this.searchForm = { patientId: this.patientId };
   //    this.getList();
   // },
   // activated() {
   //    let data = JSON.parse(sessionStorage.getItem("pigx-all_patients"))
   //       .content;
   //    this.patientNames = data;
   //    this.name = JSON.parse(
   //       sessionStorage.getItem("pigx-patientMessage")
   //    ).content.patientId.name;
   //    this.patientId = JSON.parse(
   //       sessionStorage.getItem("pigx-patientMessage")
   //    ).content.patientId;
   //    this.searchForm = { patientId: this.patientId };
   //    this.getList();
   // },
   methods: {
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
               this.searchForm = { patientId: this.patientId };
               this.getList();
            })
            .catch(() => {
               loading();
            });
      },

      getList(paramrs) {
         this.tableLoading = true;
         // if (this.roleCodes == "ROLE_NURSE") {
         fetchList(
            Object.assign(
               { current: this.page.currentPage, size: this.page.pageSize },
               paramrs,
               this.searchForm
            )
         )
            .then(response => {
               // console.log(response);
               this.tableData = response.data.data.records;
               this.page.total = response.data.data.total;
               this.tableLoading = false;
            })
            .catch(() => {});
         // } else if (this.roleCodes == "ROLE_MATRON") {
         //    fetchList(
         //       Object.assign(
         //          { current: this.page.currentPage, size: this.page.pageSize },
         //          paramrs,
         //          this.searchForm
         //       )
         //    )
         //       .then(response => {
         //          // console.log(response);
         //          this.tableData = response.data.data.records;
         //          this.tableData.forEach(i => {
         //             this.patientNames.forEach(j => {
         //                if (i.patientId == j.patientId) {
         //                   i.bedName = j.bedName;
         //                }
         //             });
         //             // let data = {
         //             //    startTime: i.startTime.substr(5, 11),
         //             //    endTime: i.endTime.substr(5, 11),
         //             //    occurrenceTime: i.occurrenceTime.substr(5, 11)
         //             // };
         //             // Object.assign(i, data);
         //          });
         //          this.page.total = response.data.data.total;
         //          this.tableLoading = false;
         //       })
         //       .catch(() => {
         //          this.tableLoading = false;
         //       });
         // }
      },
      rowDel: function(row, index) {
         var _this = this;
         this.$confirm(
            "是否确认删除序号为“ " +
               `${index +
                  (this.page.currentPage - 1) * this.page.pageSize +
                  1}` +
               " ”的数据？",
            {
               confirmButtonText: "确定",
               cancelButtonText: "取消",
               type: "warning"
            }
         )
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
               let param = {
                  patientId: this.patientId
               };
               this.getList(param);
            });
      },

      //点击编辑
      handleUpdate: function(row, index, done, loading) {
         putObj(row.nurseId)
            .then(data => {
               this.$refs.crud.rowEdit(data.data.data, index);
               done();
            })
            .catch(() => {});
      },
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
               this.searchForm = {};
               this.getList();
            })
            .catch(() => {
               loading();
            });
      },
      /**
       * 搜索回调
       */
      searchChange() {
         this.page.currentPage = 1;
         this.page.pageSize = 10;
         Object.assign(this.searchForm, {
            patientId: this.$refs.patientChoseChild.patientId
         });
         this.getList();
      },
      // chosePatient(val) {
      //    this.page.currentPage = 1;
      //    this.page.pageSize = 10;
      //    if (val) {
      //       this.patientNames.forEach(item => {
      //          if (item.patientId == val) {
      //             this.$store.commit("SET_MESSAGE", item);
      //             Object.assign(this.searchForm, {
      //                patientId: this.patientId
      //             });
      //          }
      //       });
      //    }else{
      //       this.searchForm.patientId = null
      //    }
      //    this.getList();
      // },
      drugNamechange(val) {
         this.page.currentPage = 1;
         this.page.pageSize = 10;
         if (val) {
            Object.assign(this.searchForm, {
               patientId: this.patientId
            });
         } else {
            this.searchForm.drugName = null;
         }
         this.getList();
      },
      /**
       * 刷新回调
       */
      refreshChange() {
         this.page.currentPage = 1;
         this.page.pageSize = 10;
         this.getList();
      },

      reset() {
         this.patientId = "";
         this.page.currentPage = 1;
         this.page.pageSize = 10;
         this.searchForm = {};
         this.$refs.patientChoseChild.patientReset();
         this.getList();
      },
      handleSizeChange(val) {
         this.page.pageSize = val;
         let params = {};
         if (this.$refs.patientChoseChild.patientId) {
            Object.assign(this.searchForm, {
               patientId: this.$refs.patientChoseChild.patientId
            });
         }
         this.getList(params);
      },
      handleCurrentChange(val) {
         this.page.currentPage = val;
         if (this.$refs.patientChoseChild.patientId) {
            Object.assign(this.searchForm, {
               patientId: this.$refs.patientChoseChild.patientId
            });
         }
         this.getList();
      }
   }
};
</script>

<style lang="scss" scoped>
// .el-form-item__content {
//   display: flex;
// }
</style>
