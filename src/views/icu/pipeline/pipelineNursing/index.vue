<template>
   <!-- 管路滑脱登记表 -->
   <div class="pipelineNursing">
      <basic-container>
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
            @size-change="sizeChange"
            @current-change="currentChange"
            @search-reset="handleSearchReset"
            @search-change="searchChange"
         >
            <template slot="search">
               <el-form-item>
                  <patientChose :getList="getList" ref="patientChoseChild" :page="page" />
               </el-form-item>
            </template>
            <template slot-scope="scope" slot="menu">
               <el-button
                  type="text"
                  size="small"
                  icon="el-icon-edit"
                  @click="view(scope.row,scope.index)"
               >查 看</el-button>
               <!-- <el-button
                     v-if="permissions.icu_uex_edit"
                     type="text"
                     size="small"
                     icon="el-icon-edit"
                     @click="editor(scope.row,scope.index)"
               >编 辑</el-button>-->
               <!-- <el-button
                     v-if="permissions.icu_uex_del"
                     type="text"
                     size="small"
                     icon="el-icon-delete"
                     @click="rowDel(scope.row,scope.index)"
               >删 除</el-button>-->
            </template>
         </avue-crud>
      </basic-container>
      <!-- 管道护理 -->
      <el-dialog
         title="管道护理"
         :visible.sync="dialogFormVisible"
         width="90%"
         :fullscreen="isFullscreen"
      >
         <pipelineNursings :slippMessages="slippMessages" />
      </el-dialog>
   </div>
</template>

<script>
import pipelineNursings from "@/views/icu/patient/components/pipelineStatus/pipelineNursing";
import { pipNursingPage, uexDic } from "@/api/icu/patient/pipelineStatus";
import { mapGetters, mapState } from "vuex";
import patientChose from "@/views/icu/index/patientChose";

export default {
   name: "pipelineNursing",
   components: {
      pipelineNursings,
      patientChose
   },
   data() {
      var status = {
         outComes: [
            {
               label: "未脱管",
               value: 0
            },
            {
               label: "脱管",
               value: 1
            }
         ],
         hand: [
            {
               label: "重新置管",
               value: 0
            },
            {
               label: "未重新置管",
               value: 1
            }
         ]
      };
      return {
         searchForm: {},
         dialogFormVisible: false,
         isFullscreen: false,
         screenWidth: document.body.clientWidth, // 屏幕尺寸
         tableData: [],
         flag: true,
         page: {
            total: 0, // 总页数
            currentPage: 1, // 当前页数
            pageSize: 10 // 每页显示多少条
         },
         tableLoading: false,
         tableOption: {
            border: true,
            index: true,
            indexLabel: "序号",
            stripe: true,
            menuAlign: "center",
            align: "center",
            viewBtn: false,
            editBtn: false,
            delBtn: false,
            addBtn: false,
            menuWidth: 150,
            column: [
               {
                  label: "患者姓名",
                  prop: "patientName"
               },
               {
                  label: "护士",
                  prop: "nurseName"
               },
               {
                  label: "护理结果",
                  prop: "nursingOutcomes",
                  dicData: status.outComes
               },
               {
                  label: "脱管原因",
                  prop: "causesOfDetachment",
                  dicData: []
               },
               {
                  label: "脱管后处理",
                  prop: "handle",
                  dicData: status.hand
               },
               {
                  label: "管路插管时间",
                  prop: "pipingStartTime",
                  width: 170
               },
               {
                  label: "患者动态",
                  prop: "patientDynamics",
                  dicData: []
               }
            ]
         },

         causesOf: [],
         departure: [],
         preventive: [],
         patientNames: [],
         message: {},
         slippMessages: {}
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
   created() {
      this.dicData();
      // let data = JSON.parse(sessionStorage.getItem("pigx-all_patients"))
      //    .content;
      // this.patientNames = data;
      // this.message = JSON.parse(
      //    sessionStorage.getItem("pigx-patientMessage")
      // ).content;
      // this.searchForm = {
      //    patientId: JSON.parse(sessionStorage.getItem("pigx-patientMessage"))
      //       .content.patientId
      // };
      // this.getList();
   },
   mounted() {
      const that = this;
      window.onresize = () => {
         return (() => {
            window.screenWidth = document.body.clientWidth;
            that.screenWidth = window.screenWidth;
         })();
      };
      if (that.screenWidth <= 1024) {
         that.isFullscreen = true;
      }
   },
   methods: {
      dicData() {
         uexDic("piping_causes_of_slippage").then(res => {
            res.data.data.forEach(item => {
               this.tableOption.column[2].dicData.push(
                  Object.assign({
                     label: item.label,
                     value: Number(item.value)
                  })
               );
            });
         });
         uexDic("icu_departure").then(res => {
            res.data.data.forEach(item => {
               this.tableOption.column[4].dicData.push(
                  Object.assign({
                     label: item.label,
                     value: Number(item.value)
                  })
               );
            });
         });
      },
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
      // 分页查询
      getList(params) {
         this.tableLoading = true;
         pipNursingPage(
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
      view(row) {
         // console.log(row);
         this.slippMessages = {};
         this.slippMessages = row;
         Object.assign(this.slippMessages, { viewflag: false });
         this.dialogFormVisible = true;
      },
      slippageCloses() {
         this.dialogFormVisible = false;
         if (this.$refs.patientChoseChild.patientId) {
            this.page = {
               total: 0, // 总页数
               currentPage: 1, // 当前页数
               pageSize: 10 // 每页显示多少条
            };
            this.searchForm = {
               patientId: this.$refs.patientChoseChild.patientId
            };
         }
         this.getList();
      },
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
      searchChange() {
         this.page = {
            total: 0, // 总页数
            currentPage: 1, // 当前页数
            pageSize: 10 // 每页显示多少条
         };
         var patient = {
            patientId: this.$refs.patientChoseChild.patientId
         };
         this.getList(patient);
      }
   }
};
</script>

<style  lang="scss">
.pipelineNursing .el-col {
   margin-bottom: 0;
}
.pipelineNursing .avue-tags__menu {
   line-height: 40px;
   padding-right: 10px;
   margin-right: 1%;
}
</style>
