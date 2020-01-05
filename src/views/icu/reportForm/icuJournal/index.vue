
<template>
   <!-- icu日志报表 -->
   <div class="execution">
      <basic-container>
         <avue-crud
            ref="crud"
            :page="page"
            :data="tableData"
            :table-loading="tableLoading"
            :option="tableOption"
            @search-change="searchChange"
            @search-reset="searchReset"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
         >
            <template slot="search">
               <el-form :inline="true">
                  <el-col :md="8" :xs="24">
                     <el-form-item>
                        <el-date-picker
                           v-model="intakeAndOutputValue"
                           type="datetimerange"
                           range-separator="至"
                           start-placeholder="开始日期"
                           end-placeholder="结束日期"
                           align="right"
                           format="yyyy-MM-dd"
                           style="width:100%"
                           @change="searchChange"
                        ></el-date-picker>
                     </el-form-item>
                  </el-col>
               </el-form>
            </template>
         </avue-crud>
      </basic-container>
   </div>
</template>

<script>
import { fetchList } from "@/api/icu/reportForm/icuJournal";
import { tableOption } from "@/const/crud/icu/reportForm/icuJournal";
import { mapGetters, mapState } from "vuex";
import { dateFormat } from "@/util/date";
export default {
   name: "intakeAndOutput",
   watch: {
      intakeAndOutputValue: {
         handler(newValue, oldValue) {
            if (newValue == null) {
               this.intakeAndOutputValue = [];
               this.page.currentPage = 1;
               this.pageSize = 10;
               this.searchReset();
            }
         }
      }
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
         tableOption: tableOption,
         tableLoading: false,
         intakeAndOutputValue: []
      };
   },
   created(){
      this.getList()
   },
   methods: {
      getList(parmars) {
         // console.log(page);
         fetchList(
            Object.assign(
               {
                  current: this.page.currentPage,
                  size: this.page.pageSize
               },
               parmars,
               this.searchForm
            )
         ).then(response => {
            this.tableData = response.data.data.records;
            this.page.total = response.data.data.total;
            this.tableLoading = false;
         });
      },
      searchChange(val) {
         if (val) {
            if (this.intakeAndOutputValue.length > 1) {
               this.searchForm.startTime = String(
                  dateFormat(this.intakeAndOutputValue[0])
               );
               this.searchForm.endTime = String(
                  dateFormat(this.intakeAndOutputValue[1])
               );
               this.page.currentPage = 1;
               this.pageSize = 10;
               this.getList(this.searchForm);
            }
         }
      },
      searchReset() {
         this.searchForm.startTime = "";
         this.searchForm.endTime = "";
         this.intakeAndOutputValue = [];
         this.page.currentPage = 1;
         this.page.pageSize = 10;
         this.getList();
      },
      handleSizeChange(val) {
         this.page.pageSize = val;
         this.getList();
      },
      handleCurrentChange(val) {
         this.page.currentPage = val;
         this.getList();
      }
   }
};
</script>

<style lang="scss" scoped>
</style>
