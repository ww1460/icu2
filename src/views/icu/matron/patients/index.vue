
<template>
  <div class="execution">
    <basic-container>
      <!-- 第一层 -->
      <avue-crud
        v-if="flag == 1"
        ref="crud"
        :data="tableData"
        :permission="permissionList"
        :table-loading="tableLoading"
        :option="tableOption"
        @on-load="getList"
        @search-change="searchChange"
      >
        <template slot-scope="scope" slot="menu">
          <el-button
            type="text"
            icon="el-icon-view"
            size="small"
            @click="viewClick(scope.row,scope.index)"
          >项目维护</el-button>
          <!-- <el-button
            type="text"
            icon="el-icon-view"
            size="small"
            @click="viewClick(scope.row,scope.index)"
          >查看</el-button>-->
        </template>
      </avue-crud>

      <!-- 第二层 -->
      <avue-crud
        v-if="flag == 2"
        ref="crud"
        :data="tableData1"
        :permission="permissionList"
        :table-loading="tableLoading1"
        :option="tableOption1"
      >
        <template slot="menuLeft">
          <el-button size="small" @click="goBack(1)" type="primary" icon="el-icon-arrow-left">返回</el-button>
          <el-button size="small" @click="adminClick" type="primary" icon="el-icon-setting">新增项目</el-button>
        </template>
        <template slot-scope="scope" slot="menu">
          <el-button
            type="text"
            icon="el-icon-view"
            size="small"
            @click="porjectView(scope.row,scope.index)"
          >项目状态</el-button>
          <el-button
            type="text"
            @click="projectDel(scope.row,scope.index)"
            icon="el-icon-delete"
            size="small"
          >删除</el-button>
          <el-button
            type="text"
            icon="el-icon-menu"
            @click="NursingItem(scope.row,scope.index)"
            size="small"
          >护理建议</el-button>
        </template>
      </avue-crud>

      <!-- 第三层 -->
      <avue-crud
        v-if="flag == 3"
        ref="crud"
        :data="tableData2"
        :permission="permissionList"
        :table-loading="tableLoading2"
        :option="tableOption2"
        :cell-style="cellStyle1"
        @row-update="handleUpdate"
      >
        <template slot="menuLeft">
          <el-button size="small" @click="goBack(2)" type="primary" icon="el-icon-arrow-left">返回</el-button>
          <el-button size="small" @click="adddate(1)" type="primary" icon="el-icon-plus">新增</el-button>
        </template>

        <template slot-scope="scope" slot="menu">
          <el-button
            type="text"
            icon="el-icon-check"
            @click="checkClick(scope.row)"
            size="small"
          >具体项目建议</el-button>
          <el-button type="text" icon="el-icon-edit" @click="editClick(2,scope.row)" size="small">编辑</el-button>
          <el-button
            type="text"
            icon="el-icon-delete"
            size="small"
            @click="rowDel(scope.row,scope.index)"
          >删除</el-button>
        </template>
      </avue-crud>

      <el-dialog title="新增" :visible.sync="manageVisible" :fullscreen="isFullscreen">
        <el-collapse>
          <el-collapse-item
            v-for="(item,index) in projectList"
            :key="item.id"
            :title="item[0].projectType | projectType"
            :name="index"
          >
            <el-button
              @click="changeProject(i)"
              :type="i.flag?'primary':''"
              v-for="i in item"
              :key="i.id"
            >{{i.projectName}}</el-button>
          </el-collapse-item>
        </el-collapse>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" :loading="subLoading" @click="adminSub">保 存</el-button>
          <el-button @click="manageVisible = false">取 消</el-button>
        </div>
      </el-dialog>

      <el-dialog
        @close="closeDilog('form')"
        :title="flagNum == 1?'新增':'编辑'"
        :visible.sync="dialogFormVisible"
      >
        <el-form :model="form" ref="form" :rules="rules">
          <el-form-item label="正异常" prop="projectStateFlag">
            <el-radio-group v-model="form.projectStateFlag">
              <el-radio :label="0">正常</el-radio>
              <el-radio :label="1">异常</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="描述" prop="projectState">
            <el-input type="textarea" v-model="form.projectState"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="itemSub('form')">保 存</el-button>
          <el-button @click="resetForm('form')">取 消</el-button>
        </div>
      </el-dialog>

      <el-dialog title="护理项" :visible.sync="dialogFormVisibleNursing" width="70%">
        <avue-crud
          ref="crud"
          :data="tableData3"
          :permission="permissionList"
          :table-loading="tableLoading3"
          :option="tableOption3"
          @row-save="handleSave"
          @search-change="searchChange"
          @refresh-change="refreshChange"
          @row-del="rowItemDel"
          :cell-style="cellStyle"
          @row-update="handleUpdate1"
        ></avue-crud>
      </el-dialog>

      <el-dialog title="建议" :visible.sync="dialogFormVisibleCheck">
        <el-checkbox-group v-model="checkLists">
          <el-checkbox
            v-for="item in checkList"
            :value="item.illnessAdviceId"
            :key="item.id"
            :label="item.illnessAdviceId"
          >{{item.nursingAdvice}}</el-checkbox>
        </el-checkbox-group>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="CheckSub">保 存</el-button>
          <el-button @click="dialogFormVisibleCheck = false">取 消</el-button>
        </div>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
let that;
import {
  fetchList,
  viewObj,
  getProject,
  SubProject,
  getItem,
  addObj,
  delObj,
  putObj,
  getNursing,
  addNursing,
  delNursing,
  putNursing,
  delProject,
  getCheck,
  SubCheck,
  createdList
} from "@/api/icu/matron/patients/patients";
import {
  tableOption,
  tableOption1,
  tableOption2,
  tableOption3
} from "@/const/crud/icu/matron/patients/patients";
import { mapGetters } from "vuex";
import { request } from "http";

export default {
  name: "patients",
  data() {
    return {
      btnloding: false,
      manageVisible: false,
      isFullscreen: false,
      screenWidth: document.body.clientWidth, // 屏幕尺寸
      searchForm: {},
      tableData: [],
      tableData1: [],
      tableData2: [],
      tableData3: [],
      page: {
        total: 0, // 总页数
        current: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      tableLoading: false,
      tableLoading1: false,
      tableLoading2: false,
      tableLoading3: false,
      tableOption: tableOption,
      tableOption1: tableOption1,
      tableOption2: tableOption2,
      tableOption3: tableOption3,
      flag: 1,
      manageVisible: false,
      activeName: "1",
      projectList: [],
      illnessNursingTypeFlag: "",
      subLoading: false,
      dialogFormVisible: false,
      form: {
        projectStateFlag: "",
        projectState: "",
        illnessProjectId: ""
      },
      rules: {
        projectState: [
          { required: true, message: "请输入描述", trigger: "blur" }
        ],
        projectStateFlag: [
          { required: true, message: "请选择状态", trigger: "change" }
        ]
      },
      illnessProjectId: "",
      flagNum: "",
      dialogFormVisibleNursing: false,
      NursingID: "",
      checkList: [],
      dialogFormVisibleCheck: false,
      checkLists: [],
      illnessNursingStateId: "",
      TypeList: []
    };
  },
  watch: {},
  beforeCreate: function() {
    that = this;
  },
  filters: {
    //通过渲染的数据  进行过滤
    projectType: data => {
      for (let i in that.TypeList) {
        if (that.TypeList[i].value == data) {
          return that.TypeList[i].label;
        }
      }
    }
  },
  // created() {
  //   this.getList();
  // },
  mounted() {
    const that = this;
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth;
        that.screenWidth = window.screenWidth;
      })();
    };
    if (that.screenWidth <= 1024) {
      this.isFullscreen = true;
    }
  },
  computed: {
    ...mapGetters(["permissions"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permissions.icu_nurse_add, true),
        delBtn: this.vaildData(this.permissions.icu_nurse_del, true),
        editBtn: this.vaildData(this.permissions.icu_nurse_edit, true)
      };
    }
  },
  methods: {
    //建议提交
    CheckSub() {
      var arr = [];
      for (var i in this.checkLists) {
        arr.push({
          projectStateId: this.illnessNursingStateId,
          nursingAdviceId: this.checkLists[i]
        });
      }
      SubCheck(arr).then(res => {
        this.$message({
          showClose: true,
          message: "保存成功",
          type: "success"
        });
        this.dialogFormVisibleCheck = false;
      });
    },
    //点击建议
    async checkClick(row) {
      this.checkLists = [];
      this.illnessNursingStateId = row.illnessNursingStateId;

      //等待执行
      let res = await getCheck(row);
      this.checkList = res.data.data;
      this.dialogFormVisibleCheck = true;
      for (var i in this.checkList) {
        if (this.checkList[i].pitchOnId == 0) {
          this.checkLists.push(this.checkList[i].illnessAdviceId);
        }
      }
    },
    //项目删除
    projectDel(row) {
      this.$confirm(
        '是否确认删除数据状态为"' + row.projectName + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          return delProject(row.id);
        })
        .then(() => {
          this.$message({
            showClose: true,
            message: "删除成功",
            type: "success"
          });
          viewObj(this.illnessNursingTypeFlag).then(res => {
            this.tableData1 = res.data.data;
            this.tableLoading1 = false;
          });
        })

        .catch(() => {});
    },

    //护理项修改
    handleUpdate1(row, index, done) {
      putNursing(row).then(() => {
        this.$message({
          showClose: true,
          message: "修改成功",
          type: "success"
        });
        getNursing(this.NursingID).then(res => {
          this.tableData3 = res.data.data;
          done();
        });
      });
    },
    //护理项删除
    rowItemDel(row) {
      var str = "";
      if (row.illnessState == 1) {
        str = "异常";
      } else {
        str = "正常";
      }
      this.$confirm('是否确认删除数据状态为"' + str + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return delNursing(row.id);
        })
        .then(() => {
          this.$message({
            showClose: true,
            message: "删除成功",
            type: "success"
          });
          getNursing(this.NursingID).then(res => {
            this.tableData3 = res.data.data;
          });
        })
        .catch(() => {});
    },
    //护理项新增
    handleSave(row, done) {
      row.illnessProjectId = this.NursingID;
      addNursing(row).then(() => {
        this.$message({
          showClose: true,
          message: "添加成功",
          type: "success"
        });
        getNursing(this.NursingID).then(res => {
          this.tableData3 = res.data.data;
          done();
        });
      });
    },

    //点击护理项
    NursingItem(row) {
      this.NursingID = row.illnessProjectId;
      getNursing(row.illnessProjectId).then(res => {
        this.tableData3 = res.data.data;
      });
      this.dialogFormVisibleNursing = true;
    },
    //第三层删除
    rowDel(row) {
      this.$confirm(
        '是否确认删除项目为"' + row.projectName + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          return delObj(row.id);
        })
        .then(() => {
          this.$message({
            showClose: true,
            message: "删除成功",
            type: "success"
          });
          getItem(this.illnessProjectId).then(res => {
            this.tableLoading2 = false;
            this.tableData2 = res.data.data;
          });
        })
        .catch(() => {});
    },
    //样式
    cellStyle1({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 3) {
        if (row.projectStateFlag == 1) {
          return {
            color: "#F56C6C"
          };
        } else if (row.projectStateFlag == 0) {
          return {
            color: "#67C23A"
          };
        }
      }
    },
    //样式
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 1) {
        if (row.illnessState == 1) {
          return {
            color: "#F56C6C"
          };
        } else if (row.illnessState == 0) {
          return {
            color: "#67C23A"
          };
        }
      }
    },

    itemSub(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.form.illnessProjectId = this.illnessProjectId;
          if (this.flagNum == 1) {
            addObj(this.form).then(res => {
              this.$message({
                type: "success",
                message: "添加成功"
              });
              this.form = {
                projectStateFlag: "",
                projectState: "",
                illnessProjectId: ""
              };
              getItem(this.illnessProjectId).then(res => {
                this.tableLoading2 = false;
                this.tableData2 = res.data.data;
              });
              this.dialogFormVisible = false;
            });
          } else if (this.flagNum == 2) {
            putObj(this.form).then(res => {
              this.$message({
                type: "success",
                message: "修改成功"
              });
              this.form = {
                projectStateFlag: "",
                projectState: "",
                illnessProjectId: ""
              };
              getItem(this.illnessProjectId).then(res => {
                this.tableLoading2 = false;
                this.tableData2 = res.data.data;
              });
              this.dialogFormVisible = false;
            });
          }
        } else {
          return false;
        }
      });
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

    //第三层新增
    adddate(flagNum) {
      this.flagNum = flagNum;
      this.dialogFormVisible = true;
    },
    editClick(flagNum, row) {
      this.flagNum = flagNum;
      this.form.projectState = row.projectState;
      this.form.projectStateFlag = row.projectStateFlag;
      this.form.illnessProjectId = row.illnessProjectId;
      this.form.id = row.id;

      this.dialogFormVisible = true;
    },
    //第二层查看
    porjectView(row, index) {
      this.illnessProjectId = row.illnessProjectId;
      this.tableLoading2 = true;
      this.flag = 3;
      getItem(row.illnessProjectId).then(res => {
        this.tableLoading2 = false;
        this.tableData2 = res.data.data;
      });
    },

    //第二层管理保存
    adminSub() {
      this.subLoading = true;
      var arr = [];
      for (var i in this.projectList) {
        for (var k in this.projectList[i]) {
          if (this.projectList[i][k].flag) {
            delete this.projectList[i][k].id;
            delete this.projectList[i][k].createUserId;
            delete this.projectList[i][k].delFlag;
            delete this.projectList[i][k].delTime;
            delete this.projectList[i][k].delUserId;
            delete this.projectList[i][k].deptId;
            delete this.projectList[i][k].id;
            delete this.projectList[i][k].illnessNursingFlag;
            delete this.projectList[i][k].projectName;
            delete this.projectList[i][k].projectRecordValueFlag;
            delete this.projectList[i][k].projectType;
            delete this.projectList[i][k].projectWarmFlag;
            delete this.projectList[i][k].updateTime;
            delete this.projectList[i][k].createTime;
            delete this.projectList[i][k].projectCode;
            delete this.projectList[i][k].updateUserId;

            this.projectList[i][
              k
            ].illnessNursingTypeFlag = this.illnessNursingTypeFlag;
            arr.push(this.projectList[i][k]);
          }
        }
      }
      SubProject(arr).then(res => {
        this.$message({
          type: "success",
          message: "提交成功"
        });
        this.subLoading = false;
        this.manageVisible = false;
        this.tableLoading1 = true;
        viewObj(this.illnessNursingTypeFlag).then(res => {
          this.tableData1 = res.data.data;
          this.tableLoading1 = false;
        });
      });
    },
    //第二层管理 按钮点击切换状态
    changeProject(row) {
      if (row.flag) {
        row.flag = false;
      } else {
        row.flag = true;
      }
      this.$forceUpdate();
    },
    //第二次返回
    goBack(flag) {
      this.flag = flag;
    },
    //第二层管理
    adminClick() {
      getProject(this.illnessNursingTypeFlag).then(res => {
        this.projectList = res.data.data;
        for (var i in this.projectList) {
          for (var k in this.projectList[i]) {
            if (
              this.projectList[i][k].pitchOn != "" &&
              this.projectList[i][k].pitchOn != null
            ) {
              this.projectList[i][k].flag = true;
            }
          }
        }
        this.manageVisible = true;
      });
    },

    //第一层 点击查看
    viewClick(row, index) {
      this.illnessNursingTypeFlag = row.value;
      this.flag = 2;
      this.tableLoading1 = true;
      viewObj(row.value).then(res => {
        this.tableData1 = res.data.data;
        this.tableLoading1 = false;
      });
    },

    getList(page, params) {
      createdList().then(res => {
        this.TypeList = res.data.data;
      });
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
          this.tableData = response.data.data;
          this.page.total = response.data.data.total;
          this.tableLoading = false;
        })
        .catch(() => {
          this.tableLoading = false;
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
    handleUpdate: function(row, index, flag) {},
    /**
     * @title 数据添加
     * @param row 为当前的数据
     * @param done 为表单关闭函数
     *
    /**
     * 搜索回调
     */
    searchChange(form) {
      this.searchForm = form;
      this.getList(this.page, form);
    },
    /**
     * 刷新回调
     */
    refreshChange() {
      this.getList(this.page);
    }
  }
};
</script>

<style lang="scss">
.Nursing_dialog {
  .el-dialog {
    width: 70% !important;
  }
}
.el-collapse-item__content button {
  margin: 1%;
}
.blue {
  background: #409eff !important;
  color: #fff !important;
  text-align: center;
}
.elBtn {
  margin-bottom: 10px;
}
</style>
