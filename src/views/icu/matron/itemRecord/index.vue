
<template>
   <div class="execution">
      <basic-container>
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
            @row-save="handleSave"
            @row-del="rowDel"
            @search-reset="clearform"
            @size-change="sizeChange"
            @current-change="currentChange"
         >
            <template slot="search">
               <el-col :md="4" :xs="2">
                  <el-form-item>
                     <!-- <el-select
                        size="small"
                        v-model="patientId"
                        placeholder="选择患者"
                        clearable
                        @change="chosePatient"
                     >
                        <el-option
                           v-for="item in patientList"
                           :label="item.name +' '+ item.bedName"
                           :value="item.patientId"
                           :key="item.patientId"
                        ></el-option>
                     </el-select> -->
                     <patientChose :getList="getList" ref="patientChoseChild" :page="page" />
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
   putObj,
   UpdateObj
} from "@/api/icu/matron/itemRecord/itemRecord";
import { tableOption } from "@/const/crud/icu/matron/itemRecord/itemRecord";
import { mapGetters, mapState } from "vuex";
import patientChose from "@/views/icu/index/patientChose";

export default {
   name: "itemRecord",
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
         patientList: [],
         patientId: "",
         nurseId: ""
         // bedList:[],
      };
   },
   computed: {
      ...mapGetters([
         "permissions",
         "nurse_patients",
         "dep_patients",
         "patientMessage"
      ]),
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
   // watch:{
   //    patientMessage: {
   //       handler(newValue, oldValue) {
   //          this.chosePatient(newValue.patientId,false);
   //          this.patientId = newValue.patientId
   //       }
   //    }
   // },
   // created() {
   //    let data = JSON.parse(sessionStorage.getItem("pigx-all_patients"))
   //       .content;
   //    this.patientList = data;
   //    this.patientId = JSON.parse(
   //       sessionStorage.getItem("pigx-patientMessage")
   //    ).content.patientId;
   //    this.searchForm = {patientId:this.patientId}
   //    this.getList();
   // },
   methods: {
      // chosePatient(val,flag) {
      //    // this.page.currentPage = 1;
      //    // this.page.pageSize = 10;
      //    if (val) {
      //       this.patientList.forEach(item => {
      //          if (item.patientId == val) {
      //             this.$store.commit("SET_MESSAGE", item);
      //             this.searchForm ={patientId:item.patientId}
      //          }
      //       });
      //    }
      //    this.getList();
      // },
      sizeChange(val) {
         this.page.pageSize = val;
         let params = {};
         if (this.$refs.patientChoseChild.patientId) {
            params = {
               patientId: this.$refs.patientChoseChild.patientId
            };
         }
         this.getList(params);
      },
      currentChange(val) {
         this.page.currentPage = val;
         let params = {};
         if (this.$refs.patientChoseChild.patientId) {
            params = {
               patientId: this.$refs.patientChoseChild.patientId
            };
         }
         this.getList(params);
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
      },
      rowDel: function(row, index) {
         var _this = this;
         this.$confirm("是否确认删除序号为" + `${index +(this.page.currentPage - 1) * this.page.pageSize +1}`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
         })
            .then(function() {
               return delObj(row.nurseId);
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
         form.patientId = this.patientId;
         form.nurseId = this.nurseId;
         this.searchForm = form;
         this.page = {
            total: 0, // 总页数
            currentPage: 1, // 当前页数
            pageSize: 10 // 每页显示多少条
         };
         var patient = {
            patientId: this.$refs.patientChoseChild.patientId
         };
         this.getList(patient);
      },
      /**
       * 刷新回调
       */
      refreshChange() {
         this.getList();
      },
      clearform() {
         this.nurseId = "";
         this.patientId = "";
         this.page = {
            total: 0, // 总页数
            currentPage: 1, // 当前页数
            pageSize: 10 // 每页显示多少条
         };
         this.searchForm = {};
         this.$refs.patientChoseChild.patientReset();
         this.getList();
      }
   }
};
</script>

<style lang="scss" scoped>
</style>
