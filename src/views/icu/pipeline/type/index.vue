<template>
  <!-- 管道类型 -->
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
        @row-del="rowDel"
        @size-change="sizeChange"
        @current-change="currentChange"
        @search-reset="handleSearchReset"
      >
        <template slot-scope="scope" slot="searchMenu">
          <el-button
            v-if="permissions.icu_drainage_add"
            type="primary"
            size="small"
            icon="el-icon-plus"
            @click="receive(scope.row,scope.index)"
          >新 增</el-button>
        </template>
        <template slot-scope="scope" slot="menu">
          <el-button
            v-if="permissions.icu_drainage_add"
            type="text"
            size="small"
            icon="el-icon-edit"
            @click="editor(scope.row,scope.index)"
          >编 辑</el-button>
          <el-button
            v-if="permissions.icu_drainage_add"
            type="text"
            size="small"
            icon="el-icon-delete"
            @click="rowDel(scope.row,scope.index)"
          >删 除</el-button>
        </template>
      </avue-crud>
      <!-- 新增 -->
      <el-dialog
        :title="edit == true?'编辑管道':'新增管道'"
        :visible.sync="recordAdd"
        @close="cancel('form')"
      >
        <el-form ref="form" :model="form" label-width="100px" :rules="rules" style="height: 400px;">
          <el-col
            class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            style="padding-left: 10px; padding-right: 10px;"
          >
            <el-form-item label="管道名称" prop="pipingName">
              <el-input v-model="form.pipingName" auto-complete="off" placeholder="请输入管道名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col
            class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            style="padding-left: 10px; padding-right: 10px;"
          >
            <el-form-item label="管道分类" prop="pipingType">
              <el-select
                v-model="form.pipingType"
                placeholder="请选择管道分类"
                auto-complete="off"
                style="width:100%"
              >
                <el-option label="供给类" value="1"></el-option>
                <el-option label="排出类" value="2"></el-option>
                <el-option label="检测类" value="3"></el-option>
                <el-option label="综合类" value="4"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col
            class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            style="padding-left: 10px; padding-right: 10px;"
          >
            <el-form-item label="风险水平">
              <el-select
                v-model="form.risklevel"
                placeholder="请选择风险水平"
                auto-complete="off"
                style="width:100%"
              >
                <el-option
                  v-for="(item,index) in pipelineRisklevel"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col
            class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            style="padding-left: 10px; padding-right: 10px;"
          >
            <el-form-item label="入库时间">
              <el-date-picker
                @change="compareTime(1)"
                style="width:100%"
                auto-complete="off"
                v-model="form.dateOfStorage"
                type="datetime"
                placeholder="请选择日期时间"
                format="MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col
            class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            style="padding-left: 10px; padding-right: 10px;"
          >
            <el-form-item label="有效时间">
              <el-date-picker
                @change="compareTime(2)"
                style="width:100%"
                auto-complete="off"
                v-model="form.inDate"
                type="datetime"
                placeholder="请选择日期时间"
                format="MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col
            class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            style="padding-left: 10px; padding-right: 10px;"
          >
            <el-form-item label="创造商">
              <el-input v-model="form.manufacturer" auto-complete="off" placeholder="请输入创造商"></el-input>
            </el-form-item>
          </el-col>
          <el-col span:24 style="padding-left: 10px; padding-right: 10px;">
            <div class="el-row avue-group__item" span:24>
              <div class="avue-group__header">
                <i class="el-icon-edit-outline avue-group__icon"></i>
                <h1 class="avue-group__title">引流液名称</h1>
              </div>
              <div class="formData">
                <el-button
                  v-for="(item,index) in formData"
                  :key="index"
                  :type="item.flag ==  true?'primary':''"
                  @click="formClick(item)"
                >{{item.drainageName}}</el-button>
              </div>
            </div>
          </el-col>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="confirm('form')" :loading="loading">保 存</el-button>
          <el-button @click="cancel('form')">取 消</el-button>
        </div>
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
  preJump,
  pipingRisklevel
} from "@/api/icu/pipeline/type";
import { tableOption } from "@/const/crud/icu/pipeline/type";
import { mapGetters } from "vuex";

export default {
  name: "Dict",
  data() {
    return {
      //防重提交
      loading: false,
      edit: false,
      recordAdd: false,
      searchForm: {},
      form: {
        pipingName: "",
        pipingType: "",
        state: "",
        risklevel: "",
        dateOfStorage: "",
        inDate: "",
        manufacturer: "",
        drainageId: "",
        drainageName: "",
        drainageNames: ""
      },

      // 新增判断
      rules: {
        pipingName: [
          { required: true, message: "请输入设备名称", trigger: "blur" }
        ],
        pipingType: [
          { required: true, message: "请输入设备型号", trigger: "blur" }
        ]
      },
      formData: [],
      dialogFormVisible: false,
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条
        pageSizes: [10, 20, 30, 40, 50, 100]
      },
      tableLoading: false,
      tableOption: tableOption,
      pipelineRisklevel: []
    };
  },
  created() {
    this.postpreJump();
    this.getList();
  },
  mounted: function() {},
  computed: {
    ...mapGetters(["permissions"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permissions.icu_pipeline_add, false),
        delBtn: this.vaildData(this.permissions.icu_pipeline_del, false),
        editBtn: this.vaildData(this.permissions.icu_pipeline_edit, false)
      };
    }
  },
  methods: {
    //判断时间
    compareTime(flag) {
      if (this.form.dateOfStorage != "" && this.form.inDate != "") {
        if (this.form.dateOfStorage > this.form.inDate) {
          this.$message({
            showClose: true,
            message: "有效时间晚于入库时间",
            type: "warning"
          });
          if (flag == 1) {
            this.form.dateOfStorage = "";
          } else {
            this.form.inDate = "";
          }
        }
      }
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
    // 分页查询
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
        })
        .catch(() => {
          this.tableLoading = false;
        });
    },
    // 新增前跳转
    postpreJump() {
      preJump().then(response => {
        this.formData = response.data.data;
      });
    },
    // 删除
    rowDel: function(row) {
      var _this = this;
      this.$confirm(
        '是否确认删除管路名称为"' + row.pipingName + '"的管路?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delObj(row);
        })
        .then(() => {
          this.getList(this.page);
          _this.$message({
            showClose: true,
            message: "删除成功",
            type: "success"
          });
        })
        .catch(function() {});
    },
    // 编辑
    editor(row, index) {
      this.edit = true;
      this.recordAdd = true;
      this.form = row;
      this.form.id = row.id;
      preJump().then(response => {
        this.formData = response.data.data;
        for (const i in this.formData) {
          if (row.drainageId == this.formData[i].drainageId) {
            this.formData[i].flag = true;
            this.form.drainageId = this.formData[i].drainageId;
          } else {
            this.formData[i].flag = false;
          }
        }
      });
      pipingRisklevel().then(data => {
        this.pipelineRisklevel = data.data.data;
      });
      this.$forceUpdate(); //强制页面进行刷新
    },
    handleSearchReset() {
      this.searchForm = {};
      this.page = {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      };
      this.getList();
    },
    // 搜索
    searchChange(form) {
      this.searchForm = form;
      this.page = {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      };
      this.getList(this.page, form);
    },
    // 新增按钮点击
    receive() {
      this.recordAdd = true;
      this.form = {
        pipingName: "",
        pipingType: "",
        state: "",
        risklevel: "",
        dateOfStorage: "",
        inDate: "",
        manufacturer: "",
        drainageName: "",
        drainageNames: ""
      };
      this.edit = false;
      this.postpreJump();
      pipingRisklevel().then(data => {
        this.pipelineRisklevel = data.data.data;
      });
    },
    // 判断新增还是编辑的引流液名称点击
    formClick(item) {
      // if (this.edit == true) {
      //   for (const i in this.formData) {
      //     if (item.id == this.formData[i].id) {
      //       if (this.formData[i].flag != true) {
      //         this.formData[i].flag = true;
      //         this.form.drainageId = this.formData[i].drainageId;
      //       }
      //     } else {
      //       this.formData[i].flag = false;
      //     }
      //   }
      // } else {
      for (const i in this.formData) {
        if (item.id == this.formData[i].id) {
          if (item.flag != true) {
            this.formData[i].flag = true;
            this.form.drainageId = this.formData[i].drainageId;
          } else {
            this.formData[i].flag = false;
            this.form.drainageId = "0";
          }
        } else {
          this.formData[i].flag = false;
        }
      }
      // }

      // this.form.drainageId = item.drainageId;
      this.$forceUpdate(); //强制页面进行刷新
    },
    // 新增确定，保存数据
    confirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.edit == true) {
            let _this = this;
            let form = _this.form;
            _this.loading = true;
            putObj(form)
              .then(() => {
                _this.$message({
                  showClose: true,
                  message: "修改成功",
                  type: "success"
                });
                _this.loading = false;
                _this.getList(_this.page);
                this.recordAdd = false;
                this.form = {
                  pipingName: "",
                  pipingType: "",
                  state: "",
                  risklevel: "",
                  dateOfStorage: "",
                  inDate: "",
                  manufacturer: "",
                  drainageName: "",
                  drainageNames: "",
                  drainageId: ""
                };
              })
              .catch(() => {
                this.loading = false;
              });
          } else {
            var form = this.form;
            this.loading = true;
            addObj(form)
              .then(() => {
                this.$message({
                  showClose: true,
                  message: "添加成功",
                  type: "success"
                });
                this.loading = false;
                this.getList(this.page);
                this.recordAdd = false;
                this.form = {
                  pipingName: "",
                  pipingType: "",
                  state: "",
                  risklevel: "",
                  dateOfStorage: "",
                  inDate: "",
                  manufacturer: "",
                  drainageName: "",
                  drainageNames: "",
                  drainageId: ""
                };
              })
              .catch(() => {
                this.loading = false;
              });
          }
        } else {
          return false;
        }
      });
    },
    // 取消
    cancel(formName) {
      this.recordAdd = false;
      this.$refs[formName].resetFields();
      this.getList();
    }
    // 编辑取消
    // handleCancel() {
    //   this.recordAdd = false;
    //   this.form = {
    //     pipingName: "",
    //     pipingType: "",
    //     state: "",
    //     risklevel: "",
    //     dateOfStorage: "",
    //     inDate: "",
    //     manufacturer: "",
    //     drainageName: "",
    //     drainageNames: ""
    //   };
    //   this.$refs[formName].clearValidate();
    // }
  }
};
</script>

<style lang="scss" scoped>
.blue {
  background: #409eff !important;
  color: #fff !important;
  text-align: center;
}
.formData {
  width: 100%;
  height: 150px;
  border: 1px solid rgb(238, 238, 238);
  overflow-y: auto;
  button {
    margin-left: 1%;
    margin: 3% 4% 0 4%;
  }
}
</style>

