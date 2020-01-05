
<template>
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :permission="permissionList"
        :table-loading="tableLoading"
        :option="tableOption"
        @search-change="searchChange"
        @size-change="sizeChange"
        @current-change="currentChange"
        @search-reset="clearform"
      >
        <template slot="searchMenu">
          <el-button type="primary" size="small" icon="el-icon-plus" @click="addTemplate()">新增护理模板</el-button>
        </template>
        <template slot="menu" slot-scope="scope">
          <!-- 收藏吧别人的模板 收藏为自己的   护士长没有此按钮 -->
          <el-button
            v-if="roleCodes == 'ROLE_NURSE'"
            type="text"
            size="small"
            icon="el-icon-document"
            @click="collect(scope.row, scope.index)"
            :disabled="(scope.row.templateUseScope == 1 ||scope.row.createUserId == userInfo.nurseId  ?true:false)"
          >收藏</el-button>
          <el-button
            type="text"
            size="small"
            icon="el-icon-view"
            @click="templateDetails(scope.row, scope.index)"
          >查看</el-button>
          <el-button
            v-if="roleCodes == 'ROLE_MATRON'"
            type="text"
            size="small"
            icon="el-icon-delete"
            @click="rowDel(scope.row, scope.index)"
          >删除</el-button>
          <el-button
            v-else-if="roleCodes == 'ROLE_NURSE'"
            type="text"
            size="small"
            icon="el-icon-delete"
            :disabled="(scope.row.createUserId == userInfo.nurseId?false:true)"
            @click="rowDel(scope.row, scope.index)"
          >删除</el-button>

          <!-- disabled   禁用 -->
        </template>
      </avue-crud>
      <!-- 点击新增护理模板 -->
      <el-dialog title="护理模板" @close="closeDilog('form')" :visible.sync="dialogFormVisible">
        <div class="diaTemplate">
          <el-form :model="form" ref="form" :rules="rules" label-width="130px">
            <el-form-item label="使用范围:">
              <el-button
                v-for="item in range"
                :key="item.value"
                :type="item.value==rangeFlag?'primary':''"
                @click="changerange(item.value)"
              >{{item.label}}</el-button>
            </el-form-item>
            <el-form-item label="模板类型" prop="templateType">
              <el-select v-model="form.templateType" :disabled="CategoryFlag == 1">
                <el-option
                  v-for="item in typeList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.title"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="模板标题:" prop="templateTitle">
              <el-input v-model="form.templateTitle" placeholder="请输入模板标题" clearable></el-input>
            </el-form-item>
            <el-form-item label="模板描述:">
              <el-input v-model="form.templateDescription" placeholder="请输入模板描述" clearable></el-input>
            </el-form-item>
            <el-form-item v-for="item in project" :label="item.label" :key="item.projectId">
              <el-button v-if="item.flag==false" @click="adddescribe(item.projectId)">添加描述</el-button>
              <el-input type="textarea" v-else v-model="item.projectDescribe"></el-input>
            </el-form-item>
          </el-form>
          <div>
            <aside style="margin-bottom: 10px; ">
              <el-button @click="changeCategoryFlag(0)" :type="CategoryFlag == 0?'primary':''">项目类</el-button>
              <el-button @click="changeCategoryFlag(1)" :type="CategoryFlag == 1?'primary':''">非项目类</el-button>
            </aside>
            <el-collapse accordion v-if="CategoryFlag == 0">
              <el-collapse-item v-for="(item,index) in projectData" :key="index">
                <template slot="title">{{item[0].projectType | projectType}}</template>
                <el-button
                  v-for="i in item"
                  :key="i.id"
                  :type="i.flag?'primary':''"
                  @click="addpro(i.projectId,i.projectName,i)"
                >{{i.projectName}}</el-button>
              </el-collapse-item>
            </el-collapse>
            <el-input
              :autosize="{ minRows: 4, maxRows: 8}"
              v-else-if="CategoryFlag == 1"
              v-model="templateContent "
              type="textarea"
            ></el-input>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" :loading="TemplateLoading" @click="SubmitTemplate('form')">保 存</el-button>
          <el-button @click="resetForm('form')">取 消</el-button>
        </div>
      </el-dialog>
      <!-- 详情弹框 -->
      <el-dialog title="模板详情" :visible.sync="dialogFormVisibleDetails">
        <div class="diaTemplate">
          <div>
            <el-form :label-width="'120px'">
              <el-form-item label="使用范围">
                <template>
                  <el-radio
                    :disabled="flag == true"
                    v-model="viewDatafirst.templateUseScope"
                    :label="0"
                  >个人</el-radio>
                  <el-radio
                    :disabled="flag == true"
                    v-model="viewDatafirst.templateUseScope"
                    :label="1"
                  >科室</el-radio>
                </template>
              </el-form-item>
              <el-form-item label="模板标题">
                <el-input
                  :disabled="flag == true"
                  v-model="viewDatafirst.templateTitle"
                  placeholder="请输入模板标题"
                ></el-input>
              </el-form-item>

              <el-form-item label="模板描述">
                <el-input
                  :disabled="flag == true"
                  v-model="viewDatafirst.templateDescription"
                  placeholder="请输入模板描述"
                ></el-input>
              </el-form-item>
              <el-form-item
                v-if="item.isProjectFlag != 1"
                v-for="item in viewData"
                :key="item.id"
                :label="item.projectName"
              >
                <el-input
                  :disabled="flag == true"
                  v-model="item.projectDescribe"
                  :placeholder="`请输入${item.projectName}描述`"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div>
            <el-input
              class="dialog-input-text"
              style="min-height:60px"
              v-model="contentStr"
              type="textarea"
              :disabled="flag == true"
            ></el-input>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleDetails = false">取 消</el-button>
        </div>
      </el-dialog>
    </basic-container>
</template>

<script>
//声明一个全局变量
let that;
import {
  addObj,
  delObj,
  fetchList,
  // putObj,
  UpdateObj,
  getProject,
  getDict,
  getTemplateType,
  getViewData,
  addObjProject
} from "@/api/icu/matron/custom/custom";
import { tableOption } from "@/const/crud/icu/matron/custom/custom";
import { mapGetters, mapState } from "vuex";
import { getNurseInfo } from "@/api/admin/user";
import { fstat } from "fs";

export default {
  name: "custom",
  data() {
    return {
      TemplateLoading: false,
      dialogFormVisibleDetails: false,
      dialogFormVisible: false,
      searchForm: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption,
      project: [],
      heat: [],
      range: [],
      rangeFlag: "",
      projectData: [],
      dictionary: [],
      templateUseScope: "",
      viewData: [],
      viewDatafirst: {},
      contentStr: "",
      flag: "",
      nurseId: "",
      collectList: [],
      CategoryFlag: 0,
      templateContent: "",
      typeList: [
        { id: 1, title: "非病情变化类" },
        { id: 2, title: "病情变化类" },
        { id: 3, title: "全部" }
      ],
      form: {
        templateType: "",
        templateTitle: "",
        templateDescription: ""
      },
      rules: {
        templateType: [
          { required: true, message: "请选择模板类型", trigger: "change" }
        ],
        templateTitle: [
          { required: true, message: "请输入模板标题", trigger: "blur" }
        ]
      },
      userInfo: {}
    };
  },
  computed: {
    ...mapGetters(["permissions", "nurse_patients"]),
    ...mapState({
      roleCodes: state => state.user.roleCodes
    }),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permissions.icu_nurse_add, false),
        delBtn: this.vaildData(this.permissions.icu_nurse_del, false),
        editBtn: this.vaildData(this.permissions.icu_nurse_edit, false)
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
  watch: {
    //监听新增弹框 状态为false  清空
    dialogFormVisible(val) {
      if (val == false) {
        this.form.templateType = "";
        this.form.templateTitle = "";
        this.form.templateDescription = "";
        this.project = [];
      }
    },
    CategoryFlag: {
      handler(newValue, oldValue) {
        if (newValue == 1) {
          this.form.templateType = 2;
        }
      }
    }
  },
  created() {
    this.getList()
    this.getInfo();
  },
  methods: {
    async getInfo() {
      try {
        let info = await getNurseInfo();
        if (info.data.data) {
          this.userInfo = info.data.data;
        }
      } catch (err) {
      }
    },
    closeDilog(formName) {
      this.$nextTick(() => {
        this.$refs[formName].resetFields();
      });
    },

    //关闭表单验证
    resetForm(formName) {
      this.$nextTick(() => {
        this.dialogFormVisible = false;
        this.$refs[formName].resetFields();
      });
    },

    // 分页bug
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.getList();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.getList();
    },

    //切换 项目类别
    changeCategoryFlag(flag) {
      this.CategoryFlag = flag;
      if (this.changeCategoryFlag == 0) {
        this.templateContent = "";
      }
    },

    //点击收藏 把别人模板变为自己的
    collect(row, index) {
      getViewData(row.templateCode).then(res => {
        this.collectList = res.data.data;
      });
      this.$confirm("是否收藏模板?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          addObj(this.collectList).then(res => {
            this.$message({
              type: "success",
              message: "收藏成功!"
            });
            this.getList(this.page);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    //点击查看 查看详情
    templateDetails(row, index) {
      this.flag = true;
      this.contentStr = "";
      this.dialogFormVisibleDetails = true;
      //点击查看请求信息
      getViewData(row.templateCode).then(res => {
        this.viewData = res.data.data;
        this.viewDatafirst = this.viewData[0];

        for (var i in this.viewData) {
          if (this.viewData[i].isProjectFlag == 1) {
            this.contentStr = this.viewData[i].templateContent;
          } else {
            if (this.viewData[i].projectDescribe == null) {
              this.viewData[i].projectDescribe = "";
            }
            this.contentStr += `${this.viewData[i].projectName}:${this.viewData[i].projectDescribe};`;
          }
        }
      });
    },
    //点击新增提交
    SubmitTemplate(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.TemplateLoading = true;
          //判断是是项目类还是非项目类
          if (this.CategoryFlag == 0) {
            //提交之前 插入必传字段
            for (var i in this.project) {
              this.project[i].templateType = this.form.templateType;
              this.project[i].templateTitle = this.form.templateTitle;
              this.project[i].templateUseScope = this.rangeFlag;
              this.project[
                i
              ].templateDescription = this.form.templateDescription;
              this.project[i].templateIndex = i;
              this.project[i].isProjectFlag = this.CategoryFlag;
            }
            //发送请求
            addObj(this.project)
              .then(data => {
                // this.tableData.push(Object.assign({}, row));
                this.$message({
                  showClose: true,
                  message: "添加成功",
                  type: "success"
                });
                this.getList(this.page);
                this.TemplateLoading = false;
                this.dialogFormVisible = false;
              })
              .catch(() => {});
          } else if (this.CategoryFlag == 1) {
            let params = {
              templateType: this.form.templateType,
              templateTitle: this.form.templateTitle,
              templateUseScope: this.rangeFlag,
              templateDescription: this.form.templateDescription,
              isProjectFlag: this.CategoryFlag,
              templateContent: this.templateContent
            };
            addObjProject(params).then(res => {
              this.$message({
                showClose: true,
                message: "添加成功",
                type: "success"
              });
              this.getList(this.page);
              this.TemplateLoading = false;
              this.dialogFormVisible = false;
            });
          }
        } else {
          return false;
        }
      });
    },
    //点击修改使用范围
    changerange(value) {
      //每次重新赋值 高亮  把值赋给需要的地方
      this.rangeFlag = value;
      this.templateUseScope = this.rangeFlag;
    },
    //点击添加项目
    addpro(id, name, item) {
      //点击的时候 添加状态 让其高亮
      item.flag = true;
      //循环判断 数组有没有当前传入的ID 有让其删除  状态改为false 高亮取消 return
      for (var i in this.project) {
        if (this.project[i].projectId == id) {
          this.project.splice(i, 1);
          item.flag = false;
          return;
        }
      }
      //如果不重复  push 一条新数据
      this.project.push({
        projectId: id,
        label: name,
        projectDescribe: "",
        flag: false
      });
    },
    //新增弹框 点击添加描述
    adddescribe(id) {
      //点击每个添加的项目 更改状态 显示输入框
      for (var i in this.project) {
        if (this.project[i].projectId == id) {
          this.project[i].flag = true;
        }
      }
    },
    //点击护理模板新增
    addTemplate() {
      getTemplateType().then(res => {
        this.range = res.data.data;
        if (this.range != null) {
          for (var i in this.range) {
            this.rangeFlag = this.range[0].value;
          }
        }
      });

      getDict().then(res => {
        this.dictionary = res.data.data;
      });
      this.dialogFormVisible = true;
      getProject().then(res => {
        this.projectData = res.data.data;
      });
    },
    // handleCreate(row, index, done, loading) {
    //   putObj(row.nurseId)
    //     .then(data => {
    //       this.$refs.crud.rowView(data.data.data, index);
    //       done();
    //     })
    //     .catch(() => {});
    // },

    getList(page, params) {
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
          this.tableData = this.tableData.reverse();
          this.page.total = response.data.data.total;
          this.tableLoading = false;
        })
        .catch(() => {
          this.tableLoading = false;
        });
    },

    rowDel: function(row, index) {
      var _this = this;
      this.$confirm("是否确认删除" + row.templateTitle, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return delObj(row.templateCode);
        })
        .then(data => {
          _this.tableData.splice(index, 1);
          _this.$message({
            showClose: true,
            message: "删除成功",
            type: "success"
          });
          this.getList(this.page);
        });
    },
    /**
     * @title 数据更新
     * @param row 为当前的数据
     * @param index 为当前更新数据的行数
     * @param done 为表单关闭函数
     *
     **/

    /**
     * @title 数据添加
     * @param row 为当前的数据
     * @param done 为表单关闭函数
     *
     **/

    /**
     *
     * 搜索回调
     */
    searchChange(form) {
      this.page = {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      };
      this.searchForm = form;
      this.getList(this.page, form);
    },
    //请空回调
    clearform() {
      this.page = {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      };
      this.searchForm = "";
      this.getList();
    }
  }
};
</script>

<style lang="scss">
.diaTemplate {
  display: flex;
  > div:first-child {
    width: 40%;
    margin-left: 2%;
    margin-right: 2%;
  }
  > div:last-child {
    margin-left: 1%;
    width: 55%;
  }
  .el-collapse-item__content {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    button {
      // width: 20%;
      margin: 2%;
    }
  }
}
.dialog-input-text .el-textarea__inner {
  min-height: 180px !important;
}
.pitch {
  background: #409eff;
  color: #fff;
}
@media screen and (max-width: 1300px) {
  .diaTemplate {
    flex-direction: column;
    > div:first-child {
      width: 90%;
      margin-left: 2%;
      margin-right: 2%;
    }
    > div:last-child {
      width: 90%;
      margin-left: 2%;
      margin-right: 2%;
    }
  }
}
</style>
