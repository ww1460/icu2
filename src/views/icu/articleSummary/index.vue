
<template>
   <div class="personalSummary">
      <basic-container>
         <div v-if="addFlag">
            <div>
               <el-input
                  v-model="searchForm.title"
                  placeholder="请输入标题"
                  style="width:20%;margin:1%"
                  class="smallScreen"
                  @input="searchChange"
               ></el-input>
               <el-input
                  v-model="searchForm.keyword"
                  placeholder="请输入关键字"
                  style="width:20%;margin:1%"
                  class="smallScreen"
                  @input="searchChange"
               ></el-input>
               <el-select
                  v-model="searchForm.category"
                  clearable
                  placeholder="请选择分类"
                  style="width:20%;margin:1%"
                  class="smallScreen"
                  @input="searchChange"
               >
                  <el-option
                     v-for="item in dictionary"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value"
                  ></el-option>
               </el-select>
               <!-- <el-select
                  v-model="searchForm.nurse"
                  clearable
                  placeholder="请选择护士"
                  style="width:20%;margin:1%"
                  class="smallScreen"
               >
                  <el-option
                     v-for="item in nurses"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value"
                  ></el-option>
               </el-select>-->
               <!-- <el-button
                  size="small"
                  type="primary"
                  icon="el-icon-search"
                  @click="searchform"
                  style="margin:1%"
               >搜 索</el-button>-->
               <el-button
                  size="small"
                  icon="el-icon-delete"
                  @click="clearform"
                  style="margin:1%"
               >清 空</el-button>
               <el-button
                  type="primary"
                  size="small"
                  icon="el-icon-plus"
                  @click="operation({},1,-1)"
               >新 增</el-button>
               <div style="margin:1%" class="clearfix">
                  <!-- <el-button
                     type="primary"
                     size="small"
                     icon="el-icon-plus"
                     @click="operation({},1,-1)"
                  >新增</el-button>-->
                  <div :style="screenWidth<=701?'float:left':'float:right'">
                     <el-button
                        :type="tiggerFlag==1?'primary':''"
                        size="small"
                        icon="el-icon-s-data"
                        @click="tigger(1)"
                     >全 部</el-button>
                     <el-button
                        :type="tiggerFlag==2?'primary':''"
                        size="small"
                        icon="el-icon-user"
                        @click="tigger(2)"
                     >个 人</el-button>
                     <el-button
                        :type="tiggerFlag==3?'primary':''"
                        size="small"
                        icon="el-icon-folder-opened"
                        @click="tigger(3)"
                     >收 藏</el-button>
                  </div>
               </div>
            </div>
            <div>
               <el-row class="clearfix">
                  <el-col
                     style="float:left"
                     :span="screenWidth<=701?24:screenWidth<=1300?12:8"
                     v-for="(item,index) in tiggerFlag==1?tableData:tiggerFlag==2?tableData1:tableData2"
                     :key="index"
                  >
                     <el-card
                        :body-style="{ padding: '0px' }"
                        shadow="always"
                        class="imgCard clearfix"
                     >
                        <div style="float:left;width:50%;">
                           <img :src="item.picture" :id="item.id + 1" class="image" />
                        </div>
                        <div style="float:left;width:50%;">
                           <div style="margin:10px">
                              <div style="height:100px">
                                 <p
                                    style="height:30px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;line-height:30px"
                                 >
                                    <span style="font-weight:600">标题：{{item.title}}</span>
                                 </p>
                                 <p
                                    style="height:30px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;line-height:30px"
                                 >
                                    <span style="font-weight:600">类型：{{item.category | projectType}}</span>
                                 </p>
                                 <p
                                    style="height:30px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;line-height:30px"
                                 >
                                    <span style="font-weight:600">关键字：{{item.keyword}}</span>
                                 </p>
                              </div>
                              <div style="height:80px;padding:10px">
                                 <el-button
                                    type="text"
                                    icon="el-icon-view"
                                    size="small"
                                    style="margin-left: 10px;"
                                    @click="operation(item,2,index)"
                                 >查看</el-button>
                                 <el-button
                                    type="text"
                                    icon="el-icon-edit"
                                    size="small"
                                    @click="operation(item,3,index)"
                                    :disabled="item.createUserId != nurseInfo.userId"
                                 >编辑</el-button>
                                 <el-button
                                    type="text"
                                    icon="el-icon-delete"
                                    size="small"
                                    @click="delRow(item,index)"
                                    :disabled="item.createUserId != nurseInfo.userId"
                                 >删除</el-button>
                                 <el-button
                                    type="text"
                                    icon="el-icon-folder-add"
                                    size="small"
                                    @click="joinRow(item,item.collectStatus?0:1)"
                                 >{{item.collectStatus?'取消收藏':'收藏'}}</el-button>
                              </div>
                           </div>
                        </div>
                     </el-card>
                  </el-col>
               </el-row>
            </div>
            <div style=" text-align: center;margin:10px 0px">
               <el-button
                  type="primary"
                  size="small"
                  icon="el-icon-arrow-down"
                  @click="addMore"
                  :loading="postLoading"
               >查看更多</el-button>
            </div>
         </div>
         <writearticle
            v-else
            :returnClose="returnClose"
            :rowData="rowData"
            :dictionary="dictionary"
         />
      </basic-container>
   </div>
</template>

<script>
import {
   addObj,
   delObj,
   joinObj,
   closejoinObj,
   getDict
} from "@/api/icu/articleSummary/personalSummary";
import { mapGetters } from "vuex";
import writearticle from "@/views/icu/articleSummary/writearticle";
import { handleImg, openWindow } from "@/util/util";
import { getNurseInfo } from "@/api/admin/user";
//声明一个全局变量
let that;
export default {
   name: "personalSummary",
   components: {
      writearticle
   },
   data() {
      return {
         searchForm: {},
         cateGords: [],
         nurses: [],
         screenWidth: document.body.clientWidth,
         addFlag: true,
         tiggerFlag: 1,
         page: {
            pageSize: 10,
            currentPage: 1,
            total: 0
         },
         page1: {
            pageSize: 10,
            currentPage: 1,
            total: 0
         },
         page2: {
            pageSize: 10,
            currentPage: 1,
            total: 0
         },
         tableData: [],
         tableData1: [],
         tableData2: [],
         rowData: {},
         collectFlag: true,
         postLoading: true,
         nurseInfo: {},
         _index: -1,
         dictionary: []
      };
   },
   created() {
      this.$store.commit("SET_CLEAR_ARTICLE");
      getNurseInfo().then(res => {
         this.nurseInfo = res.data.data;
      });
      getDict().then(res => {
         this.dictionary = res.data.data;
      });
      window.addEventListener("resize", this.init);
      this.getList();
      this.perGetList();
      this.collectGetList();
   },
   mounted() {
      this.init();
   },
   computed: {
      ...mapGetters([
         "permissions",
         "all_article",
         "per_article",
         "ect_article"
      ]),
      permissionList() {
         return {
            addBtn: this.vaildData(this.permissions.personalSummary_add, false),
            delBtn: this.vaildData(this.permissions.personalSummary_del, false),
            editBtn: this.vaildData(
               this.permissions.personalSummary_edit,
               false
            )
         };
      }
   },
   beforeCreate: function() {
      that = this;
   },
   filters: {
      //通过渲染的数据  进行过滤
      projectType: data => {
         for (var i in that.dictionary) {
            if (that.dictionary[i].value == data) {
               return that.dictionary[i].label;
            }
         }
      }
   },
   methods: {
      // 全部
      getList() {
         var parmars = Object.assign(
            {
               current: this.page.currentPage,
               size: this.page.pageSize
            },
            this.searchForm
         );
         this.postLoading = true;
         this.$store.dispatch("getAllArt", parmars).then(res => {
            this.postLoading = false;
            this.tableData = this.all_article;
            this.tableData.forEach(i => {
               handleImg(i.picture, i.id + 1);
            });
         });
      },
      // 个人
      perGetList() {
         var parmars = Object.assign(
            {
               current: this.page1.currentPage,
               size: this.page1.pageSize
            },
            this.searchForm
         );
         this.postLoading = true;
         this.$store.dispatch("getPerArticle", parmars).then(res => {
            this.postLoading = false;
            this.tableData1 = this.per_article;
            this.tableData1.forEach(i => {
               handleImg(i.picture, i.id + 1);
            });
         });
      },
      // 收藏
      collectGetList() {
         var parmars = Object.assign(
            {
               current: this.page2.currentPage,
               size: this.page2.pageSize
            },
            this.searchForm
         );
         this.postLoading = true;
         this.$store.dispatch("getEctArticle", parmars).then(res => {
            this.postLoading = false;
            this.tableData2 = this.ect_article;
            this.tableData2.forEach(i => {
               handleImg(i.picture, i.id + 1);
            });
         });
      },
      init() {
         window.screenWidth = document.body.clientWidth;
         this.screenWidth = window.screenWidth;
         window.onresize = () => {
            setTimeout(() => {
               window.screenWidth = document.body.clientWidth;
               this.screenWidth = window.screenWidth;
            }, 0);
         };
      },
      // 更多
      addMore() {
         // 全部
         if (this.tiggerFlag == 1) {
            this.page.pageSize = this.page.pageSize;
            this.page.currentPage = this.page.currentPage + 1;
            this.getList();
         }
         // 个人
         if (this.tiggerFlag == 2) {
            this.page1.pageSize = this.page1.pageSize;
            this.page1.currentPage = this.page1.currentPage + 1;
            this.perGetList();
         }
         // 收藏
         if (this.tiggerFlag == 3) {
            this.page2.pageSize = this.page2.pageSize;
            this.page2.currentPage = this.page2.currentPage + 1;
            this.collectGetList();
         }
      },
      // 操作
      operation(row, num, index) {
         this.addFlag = false;
         this.rowData = row;
         console.log(row);
         this._index = index;
         if (num == 1) {
            Object.assign(this.rowData, { showFlag: true });
         }
         if (num == 2) {
            Object.assign(this.rowData, { showFlag: false, viewFlag: true });
         }
         if (num == 3) {
            Object.assign(this.rowData, { showFlag: true, editFlag: true });
         }
      },
      delRow(row, index) {
         this.$confirm("是否确认删除“ " + row.title + " ”?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
         })
            .then(() => {
               return delObj(row.id);
            })
            .then(data => {
               this.clearform();
               this.$message({
                  showClose: true,
                  message: "删除成功",
                  type: "success"
               });
            });
      },
      joinRow(row, num) {
         this.$confirm(
            `是否${num ? "收藏“" : "取消收藏“"}${row.title}”该文章？`,
            {
               confirmButtonText: "确定",
               cancelButtonText: "取消",
               type: "warning"
            }
         )
            .then(() => {
               var parmars = { personalSummaryId: row.personalSummaryId };
               if (num) {
                  Object.assign(parmars, { collectFlag: 0 });
               } else {
                  Object.assign(parmars, { collectFlag: 1 });
               }
               joinObj(parmars).then(() => {
                  this.collectFlag = false;
                  this.$message({
                     type: "success",
                     message: num ? "收藏成功!" : "取消收藏!"
                  });
                  this.clearform();
               });
            })
            .catch(() => {});
      },
      returnClose(row) {
         this.addFlag = true;
         if (this.tiggerFlag == 1) {
            this.tableData.forEach(i => {
               handleImg(i.picture, i.id + 1);
            });
         }
         if (this.tiggerFlag == 2) {
            this.tableData1.forEach(i => {
               handleImg(i.picture, i.id + 1);
            });
         }
         if (this.tiggerFlag == 3) {
            this.tableData2.forEach(i => {
               handleImg(i.picture, i.id + 1);
            });
         }
         if (row.num != 1) {
            this.$store.commit("SET_CLEAR_ARTICLE");
            this.page.pageSize = 10;
            this.page.currentPage = 1;
            this.page1.pageSize = 10;
            this.page1.currentPage = 1;
            this.page2.pageSize = 10;
            this.page2.currentPage = 1;
            if (this.tiggerFlag == 1) {
               this.getList();
            }
            if (this.tiggerFlag == 2) {
               this.perGetList();
            }
            if (this.tiggerFlag == 3) {
               this.collectGetList();
            }
         }
      },
      tigger(val) {
         this.$store.commit("SET_CLEAR_ARTICLE");
         if (val == 1) {
            this.tiggerFlag = val;
            this.page.pageSize = 10;
            this.page.currentPage = 1;
            this.getList();
         }
         if (val == 2) {
            this.tiggerFlag = val;
            this.page1.pageSize = 10;
            this.page1.currentPage = 1;
            this.perGetList();
         }
         if (val == 3) {
            this.tiggerFlag = val;
            this.page2.pageSize = 10;
            this.page2.currentPage = 1;
            this.collectGetList();
         }
      },
      clearform() {
         this.$store.commit("SET_CLEAR_ARTICLE");
         this.page.pageSize = 10;
         this.page.currentPage = 1;
         this.page1.pageSize = 10;
         this.page1.currentPage = 1;
         this.page2.pageSize = 10;
         this.page2.currentPage = 1;
         this.searchForm = {};
         if (this.tiggerFlag == 1) {
            this.getList();
         }
         if (this.tiggerFlag == 2) {
            this.perGetList();
         }
         if (this.tiggerFlag == 3) {
            this.collectGetList();
         }
      },
      searchChange(val) {
         this.$store.commit("SET_CLEAR_ARTICLE");
         this.page.pageSize = 10;
         this.page.currentPage = 1;
         this.page1.pageSize = 10;
         this.page1.currentPage = 1;
         this.page2.pageSize = 10;
         this.page2.currentPage = 1;
         if (this.tiggerFlag == 1) {
            this.getList();
         }
         if (this.tiggerFlag == 2) {
            this.perGetList();
         }
         if (this.tiggerFlag == 3) {
            this.collectGetList();
         }
      }
   }
};
</script>

<style lang="scss">
.personalSummary {
   .time {
      font-size: 13px;
      color: #999;
   }

   .bottom {
      margin-top: 13px;
      line-height: 12px;
      width: 100%;
      text-align: center;
   }

   .button {
      padding: 0;
      float: right;
   }

   .image {
      margin: 10px;
      width: 90%;
      height: 180px;
      border-radius: 10px;
      display: block;
   }

   .clearfix:before,
   .clearfix:after {
      display: table;
      content: "";
   }

   .clearfix:after {
      clear: both;
   }
   .imgCard {
      height: 200px;
      border-radius: 10px;
      margin-top: 10px !important;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1) !important;
   }
   .el-col {
      padding: 1%;
   }
   .imgCard:hover {
      -webkit-box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
      -webkit-transform: translate3d(0, -5px, 0);
      transform: translate3d(0, -5px, 0);
   }

   @media screen and (max-width: 1024px) {
      .smallScreen {
         width: 48% !important;
      }
   }
   @media screen and (max-width: 768px) {
      .smallScreen {
         width: 100% !important;
      }
   }
}
</style>
