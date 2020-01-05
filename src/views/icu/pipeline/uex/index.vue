<template>
   <!-- 管路滑脱登记表 -->
   <div class="uexPip">
      <basic-container>
         <div v-if="flag">
            <!-- <div style="display:flex;align-items: center;padding-bottom:50px">
               <div>
                  <el-dropdown class="avue-tags__menu">
                     <el-button type="primary" size="mini" v-model="message.name">
                        {{message.name}} {{message.bedName}}
                        <i
                           class="el-icon-arrow-down el-icon--right"
                        />
                     </el-button>
                     <el-dropdown-menu>
                        <div class="dropdownMenu">
                           <el-button
                              :title="item.patientName + item.bedName"
                              v-for="item in patientNames"
                              :key="item.patientId"
                              :class="[(item.patientId == message.patientId?'el-button el-button--primary':'')]"
                              @click="patientNameClick(item)"
                              style="margin-left: 0px !important;"
                           >{{item.patientName}} {{item.bedName}}</el-button>
                        </div>
                     </el-dropdown-menu>
                  </el-dropdown>
               </div>
            </div>-->
            <avue-crud
               ref="crud"
               :page="page"
               :data="tableData"
               :permission="permissionList"
               :table-loading="tableLoading"
               :option="tableOption"
               @search-change="searchChange"
               @search-reset="searchReset"
               @size-change="sizeChange"
               @current-change="currentChange"
            >
               <template slot="search">
                  <el-col :md="4" :xs="2">
                     <el-form-item>
                        <patientChose :getList="getList" ref="patientChoseChild" :page="page" />
                     </el-form-item>
                  </el-col>
               </template>
               <template slot-scope="scope" slot="menu">
                  <el-button
                     type="text"
                     size="small"
                     icon="el-icon-edit"
                     @click="view(scope.row,scope.index)"
                  >查 看</el-button>
                  <el-button
                     v-if="permissions.icu_uex_edit"
                     type="text"
                     size="small"
                     icon="el-icon-edit"
                     @click="editor(scope.row,scope.index)"
                  >编 辑</el-button>
                  <el-button
                     v-if="permissions.icu_uex_del"
                     type="text"
                     size="small"
                     icon="el-icon-delete"
                     @click="rowDel(scope.row,scope.index)"
                  >删 除</el-button>
               </template>
            </avue-crud>
         </div>
         <uex v-if="!flag" @fatherMethod="parentMethod" ref="uexChild" :Piprow="Piprow" />
      </basic-container>
   </div>
</template>

<script>
import {
   delObj,
   fetchList,
   putObj,
   slippag,
   uexDic,
   getnurse
} from "@/api/icu/pipeline/uex";
import { tableOption } from "@/const/crud/icu/pipeline/uex";
import { mapGetters, mapState } from "vuex";
import uex from "@/views/icu/patient/components/pipelineStatus/uex";
import patientChose from "@/views/icu/index/patientChose";

export default {
   name: "uexPip",
   components: {
      uex,
      patientChose
   },
   data() {
      return {
         searchForm: {},
         form: {
            type: undefined,
            dictId: undefined
         },
         dictType: undefined,
         dictId: undefined,
         dialogFormVisible: false,
         tableData: [],
         page: {
            total: 0, // 总页数
            currentPage: 1, // 当前页数
            pageSize: 10 // 每页显示多少条
         },
         tableLoading: false,
         tableOption: tableOption,
         patientNames: [],
         flag: true,
         // 导管类型
         catheterType: [],
         Piprow: {},
         message: {}
      };
   },
   computed: {
      ...mapGetters(["permissions", "all_patients", "patientMessage"]),
      ...mapState({
         roleCodes: state => state.user.roleCodes
      }),
      permissionList() {
         return {
            delBtn: this.vaildData(this.permissions.icu_uex_del, false),
            editBtn: this.vaildData(this.permissions.icu_uex_edit, false)
         };
      }
   },
   // created() {
   //    let data = JSON.parse(sessionStorage.getItem("pigx-all_patients"))
   //       .content;
   //    this.patientNames = data;
   //    this.message = JSON.parse(
   //       sessionStorage.getItem("pigx-patientMessage")
   //    ).content;
   //    let params = {
   //       patientId: JSON.parse(sessionStorage.getItem("pigx-patientMessage"))
   //          .content.patientId
   //    };
   //    this.getList(this.page);
   // },
   // activated() {
   //    let data = JSON.parse(sessionStorage.getItem("pigx-all_patients"))
   //       .content;
   //    this.patientNames = data;
   //    this.message = JSON.parse(
   //       sessionStorage.getItem("pigx-patientMessage")
   //    ).content;
   //    let params = {
   //       patientId: JSON.parse(sessionStorage.getItem("pigx-patientMessage"))
   //          .content.patientId
   //    };
   //    this.getList(this.page);
   // },
   methods: {
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
      // 护士选中患者
      patientNameClick(item) {
         this.$store.commit("SET_MESSAGE", item);
         this.message = this.patientMessage;
         let params = {
            patientId: item.patientId
         };
         this.getList(this.page, params);
      },
      // 分页查询
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
      // 删除
      rowDel: function(row) {
         var _this = this;
         this.$confirm(
            '是否确认删除数据类型为"' + row.patientName + '"的数据项?',
            "警告",
            {
               confirmButtonText: "确定",
               cancelButtonText: "取消",
               type: "warning"
            }
         )
            .then(function() {
               return delObj(row.id);
            })
            .then(() => {
               _this.$message({
                  showClose: true,
                  message: "删除成功",
                  type: "success"
               });
               if (this.$refs.patientChoseChild.patientId) {
                  this.searchForm = {
                     patientId: this.$refs.patientChoseChild.patientId
                  };
               } else {
                  this.searchForm = {};
               }
               this.getList();
            })
            .catch(function() {});
      },
      // 编辑
      editor: function(row, index, done) {
         this.Piprow = {};
         Object.assign(row, { viewFlag: true });
         this.Piprow = row;
         this.flag = false;
      },
      // 修改
      handleUpdate: function(row, index, done) {
         putObj(row).then(() => {
            this.$message({
               showClose: true,
               message: "修改成功",
               type: "success"
            });
            if (this.$refs.patientChoseChild.patientId) {
               this.searchForm = {
                  patientId: this.$refs.patientChoseChild.patientId
               };
            } else {
               this.searchForm = {};
            }
            this.getList();
            done();
         });
      },
      // 搜索
      searchChange() {
         if (this.$refs.patientChoseChild.patientId) {
            this.searchForm = {
               patientId: this.$refs.patientChoseChild.patientId
            };
         } else {
            this.searchForm = {};
         }
         this.page = {
            total: 0, // 总页数
            currentPage: 1, // 当前页数
            pageSize: 10 // 每页显示多少条
         };
         this.getList();
      },
      searchReset() {
         this.searchForm = {};
         this.page = {
            total: 0, // 总页数
            currentPage: 1, // 当前页数
            pageSize: 10 // 每页显示多少条
         };
         this.$refs.patientChoseChild.patientReset();
         this.getList();
      },
      view(row) {
         this.Piprow = {};
         Object.assign(row, { viewFlag: false });
         this.Piprow = row;
         this.flag = false;
      },
      parentMethod() {
         this.flag = true;
         // let params = {
         //    patientId: this.$refs.uexChild.patientId
         // };
         // this.getList(params);
      }
   }
};
</script>

<style  lang="scss">
.uexPip .el-col {
   margin-bottom: 0;
}
.uexPip .avue-tags__menu {
   line-height: 40px;
   padding-right: 10px;
   margin-right: 1%;
}
</style>
