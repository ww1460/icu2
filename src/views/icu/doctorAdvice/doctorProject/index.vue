<template>
   <div class="doctorAdvice">
      <basic-container>
         <avue-crud
            ref="crud"
            :data="tableData"
            :table-loading="tableLoading"
            :option="tableOption"
            @row-update="handleUpdate"
            @row-save="handleSave"
            @row-del="handleDel"
            :page="page"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
         ></avue-crud>
      </basic-container>
   </div>
</template>

<script>
import {
   fetchList,
   addHis,
   project,
   addProject,
   delProject,
   editProject
} from "@/api/icu/doctorAdvice/doctorAdvice";
import { mapGetters } from "vuex";

export default {
   name: "adverseDrugReactions",
   data() {
      return {
         tableData: [],
         tableOption: {
            border: true,
            index: true,
            indexLabel: "序号",
            stripe: true,
            addBtn: true,
            delBtn: true,
            editBtn: true,
            menuAlign: "center",
            align: "center",
            refreshBtn: false,
            showClomnuBtn: false,
            searchSize: "mini",
            labelWidth: 110,
            column: [
               {
                  label: "医嘱项目名称",
                  prop: "doctorsAdviceType",
                  type: "select",
                  dicUrl: "/admin/dict/type/doctors_advice",
                  rules: [
                     {
                        required: true,
                        message: "请输入医嘱项目名称",
                        trigger: "blur"
                     }
                  ]
               },
               {
                  label: "数据值",
                  prop: "dataValue",
                  rules: [
                     {
                        required: true,
                        message: "请输入数据值",
                        trigger: "blur"
                     }
                  ]
               },
               {
                  label: "标签名",
                  prop: "labelName",
                  rules: [
                     {
                        required: true,
                        message: "请输入标签名",
                        trigger: "blur"
                     }
                  ]
               },

               {
                  label: "描述",
                  prop: "labelDescribe"
               },
               {
                  label: "备注信息",
                  prop: "remarksInformation"
               }
            ]
         },
         page: {
            total: 0, // 总页数
            currentPage: 1, // 当前页数
            pageSize: 10 // 每页显示多少条
         },
         tableLoading: false
      };
   },
   created() {
      let params = {
         size: this.page.pageSize,
         current: this.page.currentPage
      };
      this.getList(params);
   },
   methods: {
      getList(params) {
         this.tableLoading = true;
         project(params)
            .then(response => {
               this.page.total = response.data.data.total;
               this.tableData = response.data.data.records;
               // console.log(response);
               this.tableLoading = false;
            })
            .catch(() => {
            });
      },
      searchChange() {},
      handleUpdate(row, index, done) {
         editProject(row).then(() => {
            this.$message({
               showClose: true,
               message: "修改成功",
               type: "success"
            });
            let params = {
               size: this.page.pageSize,
               current: this.page.currentPage
            };
            this.getList(params);
            done();
         });
      },
      handleDel(row, index) {
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
               return delProject(row.id);
            })
            .then(() => {
               _this.tableData.splice(index, 1);
               _this.$message({
                  showClose: true,
                  message: "删除成功",
                  type: "success"
               });
               let params = {
                  size: this.page.pageSize,
                  current: this.page.currentPage
               };
               _this.getList(params);
            })
            .catch(function() {});
      },
      handleSave(row, done) {
         let type = Object.assign(row, {
            doctorsAdviceType: row.$doctorsAdviceType,
            doctorsAdviceTypeId: Number(row.doctorsAdviceType)
         });
         addProject(type).then(() => {
            this.tableData.push(Object.assign({}, row));
            this.$message({
               showClose: true,
               message: "添加成功",
               type: "success"
            });
            let params = {
               size: this.page.pageSize,
               current: this.page.currentPage
            };
            this.getList(params);
            done();
         });
      },
      handleSizeChange(val) {
         this.page.pageSize = val;
         let params = {
            size: this.page.pageSize,
            current: this.page.currentPage
         };
         this.getList(params);
      },
      handleCurrentChange(val) {
         this.page.currentPage = val;
         let params = {
            size: this.page.pageSize,
            current: this.page.currentPage
         };
         this.getList(params);
      }
   }
};
</script>

<style  lang="scss">
</style>
