<template>
   <!-- 知情文书管理 -->
   <div>
      <basic-container>
         <avue-crud
            ref="crud"
            :data="tableData"
            :permission="permissionList"
            :table-loading="tableLoading"
            :option="tableOption"
            v-if="table"
         >
            <template slot="menuLeft">
               <el-button
                  type="primary"
                  class="el-button el-button--primary el-button--small"
                  icon="el-icon-plus"
                  @click.stop="handleAdd()"
               >新增</el-button>
            </template>
            <template slot-scope="scope" slot="menu">
               <el-button
                  type="text"
                  size="mini"
                  icon="el-icon-view"
                  @click="handlview(scope.row,scope.index)"
               >查看</el-button>
               <el-button
                  type="text"
                  size="mini"
                  icon="el-icon-edit"
                  @click="handledit(scope.row,scope.index)"
               >编辑</el-button>
               <el-button
                  type="text"
                  size="mini"
                  icon="el-icon-del"
                  @click="rowDel(scope.row,scope.index)"
               >删除</el-button>
            </template>
         </avue-crud>
         <template v-if="table">
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
         <!-- 查看 -->
         <div v-if="view">
            <el-form :model="viewForm" label-width="60px" class="demo-ruleForm">
               <el-form-item label="标题">
                  <el-input v-model="viewForm.writTitle" disabled></el-input>
               </el-form-item>
               <el-form-item label="描述">
                  <el-input v-model="viewForm.writDescribe" disabled></el-input>
               </el-form-item>
               <el-form-item label="内容">
                  <quill-editor v-model="viewForm.writContent" :options="editorOption" disable></quill-editor>
               </el-form-item>
            </el-form>
            <div class="el-btn">
               <el-button @click="viewClose()">返回</el-button>
            </div>
         </div>
         <div v-if="add">
            <el-form
               :model="ruleForm"
               :rules="rules"
               ref="ruleForm"
               label-width="60px"
               class="demo-ruleForm"
            >
               <el-form-item label="标题" prop="writTitle">
                  <el-input v-model="ruleForm.writTitle"></el-input>
               </el-form-item>
               <el-form-item label="描述" prop="writDescribe">
                  <el-input v-model="ruleForm.writDescribe"></el-input>
               </el-form-item>
               <el-form-item label="内容">
                  <quill-editor v-model="content" :options="editorOption"></quill-editor>
               </el-form-item>
            </el-form>
            <div class="el-btn">
               <el-button @click="close()">返回</el-button>
               <el-button type="primary" @click="saveHtml">提交</el-button>
            </div>
         </div>
         <div v-if="edit">
            <el-form
               :model="editForm"
               :rules="rules"
               ref="editForm"
               label-width="60px"
               class="demo-ruleForm"
            >
               <el-form-item label="标题" prop="writTitle">
                  <el-input v-model="editForm.writTitle"></el-input>
               </el-form-item>
               <el-form-item label="描述" prop="writDescribe">
                  <el-input v-model="editForm.writDescribe"></el-input>
               </el-form-item>
               <el-form-item label="内容">
                  <quill-editor v-model="editForm.writContent" :options="editorOption"></quill-editor>
               </el-form-item>
            </el-form>
            <div class="el-btn">
               <el-button @click="editClose()">返回</el-button>
               <el-button type="primary" @click="editData()">修改</el-button>
            </div>
         </div>
      </basic-container>
   </div>
</template>

<script>
import {
   addObj,
   delObj,
   fetchList,
   search,
   editObj
} from "@/api/icu/matron/document/docManage";
import { tableOption } from "@/const/crud/icu/matron/document/docManage";
import { mapGetters } from "vuex";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
export default {
   name: "docManage",
   data() {
      return {
         searchForm: {},
         tableData: [],
         page: {
            total: 0, // 总页数
            currentPage: 1, // 当前页数
            pageSize: 20 // 每页显示多少条
         },
         tableLoading: false,
         tableOption: tableOption,
         content: "",
         ruleForm: {
            writTitle: "",
            writDescribe: "",
            writContent: ""
         },
         rules: {
            writTitle: [
               { required: true, message: "请输入标题", trigger: "blur" }
            ],
            writDescribe: [
               { required: true, message: "请填写描述", trigger: "blur" }
            ],
            writContent: [
               { required: true, message: "请添加内容", trigger: "blur" }
            ]
         },
         // 富文本编辑器
         editorOption: {
            modules: {
               toolbar: [
                  ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线
                  ["blockquote", "code-block"], //代码块
                  [{ header: 1 }, { header: 2 }], // 1、2 级标题
                  [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表
                  [{ script: "sub" }, { script: "super" }], // 上标/下标
                  [{ indent: "-1" }, { indent: "+1" }], // 缩进
                  [{ direction: "rtl" }], // 文本方向
                  [{ size: ["small", false, "large", "huge"] }], // 字体大小
                  [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
                  [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
                  [{ font: [] }], // 字体种类
                  [{ align: [] }], // 对齐方式
                  ["clean"], // 清除文本格式
                  ["link", "image", "video"] // 链接、图片、视频
               ]
            }
         },
         table: true,
         edit: false,
         add: false,
         view: false,
         editForm: {
            writTitle: "",
            writDescribe: "",
            writContent: ""
         },
         viewForm: {
            writTitle: "",
            writDescribe: "",
            writContent: ""
         }
      };
   },
   computed: {
      ...mapGetters(["permissions"]),
      permissionList() {
         return {};
      }
   },
   created() {
      let parmars = {
         size: this.page.pageSize,
         current: this.page.currentPage
      };
      this.getList(parmars);
   },
   methods: {
      getList(parmars) {
         this.tableLoading = true;
         fetchList(parmars)
            .then(response => {

               this.tableData = response.data.data.records;
               this.page.total = response.data.data.total;
               this.tableLoading = false;
            })
            .catch(() => {
               alert("请求失败");
            });
      },
      // 过滤掉标签
      // removeTAG(str) {
      //   return str.replace(/<[^>]+>/g, "");
      // },
      // 新增
      handleAdd() {
         this.add = true;
         this.table = false;
      },
      saveHtml() {
         this.ruleForm.writContent = this.content;
         this.$confirm("是否提交知情文书", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
         })
            .then(() => {
               return addObj(this.ruleForm);
            })
            .then(() => {
               this.$message({
                  showClose: true,
                  message: "添加成功",
                  type: "success"
               });
               this.close();
               this.currentPage = 1;
               this.pageSize = 10;
               this.getList(this.page);
            });
      },
      close() {
         this.add = false;
         this.table = true;
         this.content = "";
         this.ruleForm = {
            writTitle: "",
            writDescribe: "",
            writContent: ""
         };
      },
      // 查看
      handlview(row, index) {
         this.view = true;
         this.table = false;
         this.viewForm = row;
      },
      viewClose() {
         this.view = false;
         this.table = true;
      },
      // 编辑
      handledit(row, index) {
         this.edit = true;
         this.table = false;
         this.editForm = row;
      },
      editClose() {
         this.edit = false;
         this.table = true;
         this.editForm = {
            writTitle: "",
            writDescribe: "",
            writContent: ""
         };
      },
      editData() {
         this.$confirm("是否修改" + this.editForm.writTitle + "知情文书", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
         })
            .then(() => {
               return editObj(this.editForm);
            })
            .then(() => {
               this.$message({
                  showClose: true,
                  message: "添加成功",
                  type: "success"
               });
               this.editClose();
               this.getList(this.page);
            });
      },
      // 删除
      rowDel(row, index) {
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
            .then(() => {
               this.tableData.splice(index, 1);
               this.$message({
                  showClose: true,
                  message: "删除成功",
                  type: "success"
               });
               this.getList(this.page);
            });
      },
      handleSizeChange(val) {
         this.page.pageSize = val;
         let parmars = {
            size: this.page.pageSize,
            current: this.page.currentPage
         };
         this.getList(parmars);
      },
      handleCurrentChange() {
         this.page.currentPage = val;
         let parmars = {
            size: this.page.pageSize,
            current: this.page.currentPage
         };
         this.getList(parmars);
      }
   }
};
</script>

<style lang="scss" scoped>
.edit_container {
   margin: 100px auto;
   width: 80%;
   height: 200px;
}
.el-btn {
   padding: 10px 20px 20px;
   text-align: center;
   -webkit-box-sizing: border-box;
   box-sizing: border-box;
}

#app {
   font-family: "Avenir", Helvetica, Arial, sans-serif;
   -webkit-font-smoothing: antialiased;
   -moz-osx-font-smoothing: grayscale;
   text-align: center;
   color: #2c3e50;
   margin-top: 60px;
}
</style>
