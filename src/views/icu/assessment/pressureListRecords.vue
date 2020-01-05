
<template>
   <div class="execution">
      <basic-container>
         <avue-crud
            v-if="flag"
            ref="crud"
            :page="page"
            :data="tableData"
            :permission="permissionList"
            :table-loading="tableLoading"
            :option="tableOption"
            style="margin-top:40px;"
            @size-change="sizeChange"
            @current-change="currentChange"
         >
            <template slot-scope="scope" slot="menu">
               <el-button
                  type="text"
                  icon="el-icon-view"
                  size="small"
                  @click="handleUpdate(scope.row,scope.index,3)"
               >查看</el-button>
               <el-button
                  v-if="permissions.icu_pressureListRecords_edit"
                  type="text"
                  icon="el-icon-edit"
                  size="small"
                  @click="handleUpdate(scope.row,scope.index,2)"
               >编辑</el-button>
               <el-button
                  v-if="permissions.icu_pressureListRecords_del"
                  type="text"
                  icon="el-icon-delete"
                  size="small"
                  @click="rowDel(scope.row,scope.index)"
               >删除</el-button>
            </template>
         </avue-crud>
         <div v-if="flag">
            <el-dropdown class="avue-tags__menu">
               <el-button type="primary" size="mini" v-model="patInfo.patientId">
                  {{patInfo.patientName}} {{patInfo.bedName}}
                  <i class="el-icon-arrow-down el-icon--right" />
               </el-button>
               <el-dropdown-menu>
                  <div class="dropdownMenu">
                     <el-button
                        v-for="(item,index) in patientNames"
                        :key="index"
                        :title="item.patientName"
                        :class="['el-button--small',(item.patientId == patInfo.patientId?'el-button el-button--primary':'')]"
                        @click="patientNameClick(item.patientName,item.id,item.patientId,item)"
                     >{{item.patientName}} {{item.bedName}}</el-button>
                  </div>
               </el-dropdown-menu>
            </el-dropdown>
         </div>
         <div v-if="!flag">
            <pressureList :message="patientInfo" :flagnum="flagnum" :changeflag="changeflag"></pressureList>
         </div>
      </basic-container>
   </div>
</template>

<script>
import {
   delObj,
   fetchList,
   UpdateObj,
   recordDic
} from "@/api/icu/assessment/pressureListRecords";
import { tableOption } from "@/const/crud/icu/assessment/pressureListRecords";
import { mapGetters } from "vuex";
import pressureList from "./pressureList";

export default {
   components: {
      pressureList
   },
   name: "pressureListRecords",
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
         flag: true,
         flagnum: 1,
         patientsNurseList: [],
         patientId: "",
         patientInfo: {},
         patientsList: [],
         patientNames: [],
         patientName: "",
         patInfo: {},
         patName: "",
         byStages: [],
         prePosition: [],
         declareReasons: [],
         preventiveNursingMeasures: []
      };
   },
   computed: {
      ...mapGetters([
         "permissions",
         "nurse_patients",
         "dep_patients",
         "userInfo",
         "patientMessage"
      ]),
      permissionList() {
         return {
            delBtn: this.vaildData(
               this.permissions.icu_pressureListRecords_del,
               false
            ),
            editBtn: this.vaildData(
               this.permissions.icu_pressureListRecords_edit,
               false
            )
         };
      }
   },
   watch:{
     patientMessage: {
         handler(newValue, oldValue) {
            this.patientNameClick(newValue.patientName,newValue.id,newValue.patientId,newValue);
         }
      }
  },
   created() {
      this.getDic();
      let data = JSON.parse(sessionStorage.getItem("pigx-all_patients"))
         .content;
      this.patInfo = JSON.parse(sessionStorage.getItem("pigx-patientMessage")).content;
      this.patientNames = data;
      this.patName = this.patInfo.patientId;
      this.patientName = this.patInfo.name;
      this.searchForm={patientId:this.patInfo.patientId}
      this.getList();
   },
   activated() {
      let data = JSON.parse(sessionStorage.getItem("pigx-all_patients"))
         .content;
      this.patientNames = data;
      this.patName = this.patInfo.patientId;
      this.patientName = this.patInfo.name;
      this.patInfo = JSON.parse(sessionStorage.getItem("pigx-patientMessage")).content;
      this.searchForm={patientId:this.patInfo.patientId}
      this.getList();
   },
   methods: {
      patientNameClick(name, id, patientId, item) {
         this.patName = patientId;
         this.patientName = name;
         // this.patInfo = item;
         this.page.currentPage = 1;
         this.page.pageSize = 10;
         this.$store.commit('SET_MESSAGE',item)
         this.patInfo = this.patientMessage
         this.searchForm = {patientId:this.patInfo.patientId}
         this.getList();

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
      getDic() {
         recordDic("pre_position").then(response => {
            response.data.data.forEach(item => {
               this.prePosition.push(
                  Object.assign({ label: item.label, value: item.value })
               );
            });
         });
         recordDic("by_stages").then(response => {
            response.data.data.forEach(item => {
               this.byStages.push(
                  Object.assign({
                     label: item.label,
                     value: Number(item.value),
                     description: item.description
                  })
               );
            });
         });
         recordDic("preventive_nursing_measures").then(response => {
            response.data.data.forEach(item => {
               this.preventiveNursingMeasures.push(
                  Object.assign({
                     label: item.label,
                     value: Number(item.value),
                     description: item.description
                  })
               );
            });
         });
         recordDic("declare_reason").then(response => {
            response.data.data.forEach(item => {
               this.declareReasons.push(
                  Object.assign({
                     label: item.label,
                     value: Number(item.value),
                     description: item.description
                  })
               );
            });
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
         this.$confirm("是否确认删除" + row.patientName, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
         })
            .then(() => {
               return delObj(row.id);
            })
            .then(data => {
               this.$message({
                  showClose: true,
                  message: "删除成功",
                  type: "success"
               });
               if (this.patName) {
                  this.getList({ patientId: this.patName });
               } else {
                  this.getList();
               }
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
      handleUpdate(row, index, flag) {
         this.flag = false;
         //编辑
         if (flag == 2) {
            this.patientInfo = row;
            this.flagnum = flag;
         }
         //查看
         if (flag == 3) {
            this.patientInfo = row;
            this.flagnum = flag;
         }
      },
      changeflag(val) {
         this.flag = true;
         this.page.currentPage = 1;
         this.page.pageSize = 10;
         this.patName = val.patientId;
         this.patientName = val.patientName;
         this.patInfo = val;
         this.getList({ patientId: this.patName });
      }
   }
};
</script>

<style lang="scss" scoped>
.avue-tags__menu {
   line-height: 40px;
   padding-right: 10px;
   margin-top: 10px;
   margin-right: 1%;
   z-index: 900;
}
</style>
