<template>
   <div class="document">
      <div v-if="flag">
         <avue-crud
            ref="crud"
            :data="tableData"
            :table-loading="tableLoading"
            :option="tableOption"
         >
            <template slot-scope="scope" slot="menu">
               <el-button
                  type="text"
                  size="mini"
                  icon="el-icon-view"
                  @click="handlPrint(scope.row,scope.index)"
               >查看</el-button>
               <!-- <el-button
            type="text"
            size="mini"
            icon="el-icon-del"
            @click="delRow(scope.row,scope.index)"
               >删除</el-button>-->
            </template>
         </avue-crud>
         <template>
            <div style="width:100%;position:relative;height:50px">
               <el-pagination
                  :page-sizes="[10, 20,30,40, 50, 100]"
                  :pager-count="7"
                  :current-page="page.currentPage"
                  :page-size="page.pageSize"
                  :total="page.total"
                  layout="total, sizes, prev, pager, next, jumper"
                  style="margin:1% 0;position:absolute;right:1%"
                  background
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
               ></el-pagination>
            </div>
         </template>
      </div>
      <div v-show="!flag">
         <div v-html="viewContent" id="print"></div>
         <div class="operation_top">
            <el-button type="primary" @click="printBtn" :loading="printBtnLoading">打印</el-button>
            <el-button @click="close()">返回</el-button>
         </div>
      </div>
   </div>
</template>

<script>
import {
   addObj,
   delObj,
   fetchList,
   search,
   patientSignatureDocuments,
   patientDelSignatureDocuments
} from "@/api/icu/matron/document/docManage";
import { mapGetters } from "vuex";

export default {
   name: "document",
   props: {
      messages: Object
   },
   watch: {
      messages: {
         handler(newValue, oldValue) {
            // console.log(newValue);
            this.messages = newValue;
            let params = {
               size: this.page.pageSize,
               current: this.page.currentPage,
               patientId: this.messages.patientId
            };
            this.getList(params);
         },
         deep: true
      }
   },
   data() {
      return {
         matters: "",
         img: "",
         tableData: [],
         flag: true,
         tableLoading: false,
         printBtnLoading: false,
         knowWrit: [],
         page: {
            total: 0, // 总页数
            currentPage: 1, // 当前页数
            pageSize: 10 // 每页显示多少条
         },
         tableData: [],
         tableOption: {
            border: true,
            index: true,
            indexLabel: "序号",
            stripe: true,
            addBtn: false,
            delBtn: false,
            editBtn: false,
            menuAlign: "center",
            align: "center",
            refreshBtn: false,
            showClomnuBtn: false,
            searchSize: "mini",
            labelWidth: 110,
            column: [
               {
                  label: "标题",
                  prop: "writTitle"
               },
               {
                  label: "护理人",
                  prop: "nurseName"
               },
               {
                  label: "创建时间",
                  prop: "signatureTime"
               }
            ]
         },
         viewContent: ""
      };
   },
   mounted() {
      if (this.messages.patientId) {
         let params = {
            size: this.page.pageSize,
            current: this.page.currentPage,
            patientId: this.messages.patientId
         };
         this.getList(params);
      }
   },
   methods: {
      getList(params) {
         if (this.messages.patientId) {
            this.tableLoading = true;
            patientSignatureDocuments(params)
               .then(response => {
                  // console.log(response);
                  let params = {
                     size: this.page.pageSize,
                     current: this.page.currentPage,
                     patientId: this.messages.patientId
                  };
                  this.page.total = response.data.data.total;
                  this.knowWrit = response.data.data.records;
                  this.tableData = this.knowWrit;
                  this.tableLoading = false;
               })
               .catch(() => {
                  // alert("请求失败");
               });
         }
      },
      // 切到知情文书就刷新
      getLists() {
         this.tableLoading = true;
         let params = {
            size: this.page.pageSize,
            current: this.page.currentPage,
            patientId: this.messages.patientId
         };
         patientSignatureDocuments(params)
            .then(response => {
               // console.log(response);
               this.page.total = response.data.data.total;
               this.knowWrit = response.data.data.records;
               this.tableData = this.knowWrit;
               this.tableLoading = false;
            })
            .catch(() => {
               // alert("请求失败");
            });
      },
      printBtn() {
         this.printBtnLoading = true;
         var newstr = document.getElementById("print").innerHTML;
         document.body.innerHTML = newstr;
         window.print();
         window.location.reload();
      },
      handlPrint(row) {
         this.flag = false;
         this.viewContent = row.knowWritContent;
      },
      close() {
         this.flag = true;
      },
      handleSizeChange(val) {
         this.page.pageSize = val;
         let params = {
            size: this.page.pageSize,
            current: this.page.currentPage,
            patientId: this.messages.patientId
         };
         this.getList(params);
      },
      handleCurrentChange(val) {
         this.page.currentPage = val;
         let params = {
            size: this.page.pageSize,
            current: this.page.currentPage,
            patientId: this.messages.patientId
         };
         this.getList(params);
      }
      //  delRow(row){
      //     console.log(row)
      //     patientDelSignatureDocuments({id:row.id,patientId:row.patientId}).then(res=>{
      //        console.log(res)
      //     })
      //  }
   }
};
</script>

<style lang="scss">
.document {
   #print {
      border: 1px solid #ebeef5;
      padding: 30px;
      margin-top: 5px;
   }
}
</style>
