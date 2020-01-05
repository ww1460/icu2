
<template>
  <div class="execution">
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :permission="permissionList"
        :table-loading="tableLoading"
        :option="tableOption"
        @search-change="searchChange"
        @refresh-change="refreshChange"
        @row-update="Update"
        @row-save="handleSave"
        @row-del="rowDel"
        :cell-style="cellStyle"
        @size-change="sizeChange"
        @current-change="currentChange"
        @search-reset="clearform"
      >
        <template slot="searchMenu">
          <el-button type="primary" size="small" icon="el-icon-plus" @click="rowAdd">新增</el-button>
        </template>
        <template slot="menu" slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            icon="el-icon-menu"
            @click="editProFixd(scope.row,scope.index)"
          >固定值</el-button>
          <el-button
            type="text"
            size="mini"
            icon="el-icon-s-opportunity"
            @click="handleWarning(scope.row,scope.index)"
          >预警</el-button>
          <el-button
            type="text"
            size="mini"
            icon="el-icon-edit"
            @click="handleEdit(scope.row,scope.index)"
          >编辑</el-button>
          <el-button
            type="text"
            size="mini"
            icon="el-icon-delete"
            @click="rowDel(scope.row,scope.index)"
          >删除</el-button>
        </template>
      </avue-crud>

      <el-dialog :fullscreen="isFullscreen" title="设定预警" :visible.sync="dialogFormVisible1">
        <el-form ref="WarningData" :rules="rules" :model="WarningData" :label-width="'80px'">
          <el-row>
            <el-col :span="12">
              <el-form-item prop="topValue" label="录入上限">
                <el-input autocomplete="off" v-model.number="WarningData.topValue"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="bottomValue" label="录入下限">
                <el-input autocomplete="off" v-model.number="WarningData.bottomValue"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="maxWarm" label="预警上限">
                <el-input autocomplete="off" v-model.number="WarningData.maxWarm"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="minWarm" label="预警下限">
                <el-input autocomplete="off" v-model.number="WarningData.minWarm"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <!-- <el-button type="primary" :loading="pdSub" @click="delWarning">删 除</el-button> -->
          <el-button type="primary" @click="WarningSub('WarningData')">保 存</el-button>
          <el-button @click="dialogFormVisible1 = false">取 消</el-button>
        </div>
      </el-dialog>
      <!-- 固定值 -->
      <el-dialog
        :fullscreen="isFullscreen"
        :visible.sync="proFixVisiblel"
        :table-loading="tableLoading"
        title="固定值管理"
        width="70%"
        @close="proFixVisiblel=false"
      >
        <avue-crud
          ref="crudItem"
          :data="profixdData"
          :permission="permissionList"
          v-model="form"
          :option="profixdOption"
          :table-loading="tableLoading"
          @row-update="UpdateFixd"
          @row-del="rowDelFixd"
          @row-save="addProFixd"
        />
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import {
  addObj,
  delObj,
  fetchList,
  putObj,
  UpdateObj,
  Warning,
  warmJudgeAdd,
  getFixd,
  addFixd,
  editFixd,
  delFixd,
  delWarm
} from "@/api/icu/matron/Project/Project";
import {
  tableOption,
  profixdOption
} from "@/const/crud/icu/matron/Project/Project";
import { mapGetters } from "vuex";
import { delimiter } from "path";

export default {
  name: "Project",
  data() {
    return {
      isFullscreen: false,
      screenWidth: document.body.clientWidth, // 屏幕尺寸
      pdSub: false,
      WarningData: {
        maxWarm: "",
        minWarm: "",
        bottomValue: "",
        topValue: ""
      },
      dialogFormVisible1: false,
      searchForm: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      proFixVisiblel: false,
      tableLoading: false,
      tableOption: tableOption,
      form: {},
      profixdOption: profixdOption,
      profixdData: [],
      rowList: {},
      WrID: "",
      projectId: "",
      warmJudgeId: "",
      rules: {
        topValue: [
          { required: true, message: "录入上限不能为空", trigger: "blur" },
          { type: "number", message: "录入上限必须为数字值", trigger: "blur" }
        ],
        bottomValue: [
          { required: true, message: "录入下限不能为空", trigger: "blur" },
          { type: "number", message: "录入下限必须为数字值", trigger: "blur" }
        ],
        maxWarm: [
          { required: true, message: "预警上限不能为空", trigger: "blur" },
          { type: "number", message: "预警上限必须为数字值", trigger: "blur" }
        ],
        minWarm: [
          { required: true, message: "预警下限不能为空", trigger: "blur" },
          { type: "number", message: "预警下限必须为数字值", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permissions.icu_project_add, true),
        delBtn: this.vaildData(this.permissions.icu_project_del, true),
        editBtn: this.vaildData(this.permissions.icu_project_edit, true)
      };
    }
  },
  created() {
    this.getList();
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
      this.isFullscreen = true;
    }
  },
  methods: {
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

    rowAdd() {
      this.$refs.crud.rowAdd();
    },
    //Avue 表单过滤
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 5) {
        if (row.projectWarmFlag == 1) {
          return {
            color: "#F56C6C"
          };
        } else if (row.projectWarmFlag == 0) {
          return {
            color: "#67C23A"
          };
        }
      }
      if (columnIndex == 4) {
        if (row.projectRecordValueFlag == 1) {
          return {
            color: "#F56C6C"
          };
        } else if (row.projectRecordValueFlag == 0) {
          return {
            color: "#67C23A"
          };
        }
      }
    },
    WarningSub(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible1 = false;
          this.WarningData.projectId = this.projectId;
          warmJudgeAdd(this.WarningData).then(data => {
            this.$message({
              showClose: true,
              message: "修改成功",
              type: "success"
            });
            this.getList(this.page);
          });
        } else {
          return false;
        }
      });
    },
    // 设置固定值
    editProFixd(row, index) {
      this.proFixVisiblel = true;
      this.projectId = row.projectId;
      getFixd(row.projectId).then(response => {
        this.profixdData = response.data.data;
      });
    },
    addProFixd: function(row, done, loading) {
      row.projectId = this.projectId;
      addFixd(row)
        .then(data => {
          this.profixdData.push(Object.assign({}, row));
          this.$message({
            showClose: true,
            message: "添加成功",
            type: "success"
          });
          done();
          getFixd(this.projectId).then(response => {
            this.profixdData = response.data.data;
          });
          this.getList(this.page);
        })
        .catch(() => {
          loading();
        });
    },
    //点击编辑
    UpdateFixd: function(row, index, done, loading) {
      editFixd(row)
        .then(data => {
          // this.$refs.crud.rowEdit(data.data.data, index);
          this.$message({
            showClose: true,
            message: "修改成功",
            type: "success"
          });
          getFixd(this.projectId).then(response => {
            this.profixdData = response.data.data;
          });
          this.getList(this.page);
          done();
        })
        .catch(() => {});
    },
    rowDelFixd: function(row, index) {
      index += 1;
      var _this = this;
      this.$confirm("是否确认删除序号为" + index, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return delFixd(row.id);
        })
        .then(data => {
          _this.profixdData.splice(index, 1);
          _this.$message({
            showClose: true,
            message: "删除成功",
            type: "success"
          });

          getFixd(this.projectId).then(response => {
            this.profixdData = response.data.data;
          });
        });
    },
    handleWarning(row, index) {
      this.rowList = row;
      this.projectId = row.projectId;
      this.WarningData = {};
      this.dialogFormVisible1 = true;
      Warning(row.projectId)
        .then(data => {
          if (data.data.data != null) {
            this.WarningData = data.data.data;
          } else {
            this.WarningData = {
              maxWarm: "",
              minWarm: "",
              bottomValue: "",
              topValue: ""
            };
          }
        })
        .catch(() => {});
    },

    handleEdit(row, index) {
      this.$refs.crud.rowEdit(row, index);
    },
    handleCreate(row, index, done, loading) {
      putObj(row.nurseId)
        .then(data => {
          this.$refs.crud.rowView(data.data.data, index);
          done();
        })
        .catch(() => {});
    },
    delWarning(done, loading) {
      this.pdSub = true;
      this.rowList.projectWarmFlag = 1;
      UpdateObj(this.rowList).then(response => {
        this.$message({
          type: "success",
          showClose: true,
          message: "删除成功"
        });
        this.pdSub = false;
        this.dialogFormVisible1 = false;
        this.getList(this.page);
      });
    },
    //点击修改提交
    Update(row, index, loading) {
      UpdateObj(row)
        .then(data => {
          this.$refs.crud.rowEdit(data.data.data, index);
          this.tableData.splice(index, 1, Object.assign({}, row));
          this.$message({
            showClose: true,
            message: "修改成功",
            type: "success"
          });
          this.getList(this.page);
          done();
        })
        .catch(() => {
          loading();
        });
    },

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
          this.page.total = response.data.data.total;
          this.tableLoading = false;

          for (var i in this.tableData) {
            this.tableData[i].projectType = this.tableData[
              i
            ].projectType.toString();
          }
        })
        .catch(() => {
          this.tableLoading = false;
        });
    },
    rowDel: function(row, index) {
      var _this = this;
      this.$confirm("是否确认删除" + row.projectName, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return delObj(row.id);
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
    //点击编辑
    handleUpdate: function(row, index, done, loading) {
      putObj(row.nurseId)
        .then(data => {
          this.$refs.crud.rowEdit(data.data.data, index);
          done();
        })
        .catch(() => {});
    },
    /**
     * @title 数据添加
     * @param row 为当前的数据
     * @param done 为表单关闭函数
     *
     **/
    handleSave: function(row, done, loading) {
      addObj(row)
        .then(data => {
          this.tableData.push(Object.assign({}, row));
          this.$message({
            showClose: true,
            message: "添加成功",
            type: "success"
          });
          done();
          this.getList(this.page);
        })
        .catch(() => {
          loading();
        });
    },

    //清空回调
    clearform() {
      this.page = {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      };
      this.searchForm = "";
      this.getList(this.page);
    },
    /**
     * 搜索回调
     */
    searchChange(form) {
      this.searchForm = form;
      (this.page = {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      }),
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

<style lang="scss" scoped>
</style>
