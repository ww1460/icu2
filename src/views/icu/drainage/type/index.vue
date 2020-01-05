<template>
  <!-- 引流液类型 -->
  <div class="execution">
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :permission="permissionList"
        :table-loading="tableLoading"
        :option="tableOption"
        @row-update="handleUpdate"
        @search-change="searchChange"
        @search-reset="handleSearchReset"
        @size-change="sizeChange"
        @current-change="currentChange"
      >
        <template slot="searchMenu">
          <el-button type="primary" size="small" icon="el-icon-plus" @click="addRow">新 增</el-button>
        </template>
        <template slot="menu" slot-scope="scope">
          <el-button
            v-if="permissions.icu_drainage_add"
            type="text"
            size="small"
            icon="el-icon-delete"
            @click="rowDel(scope.row,scope.$index)"
          >删除</el-button>
          <el-button
            v-if="permissions.icu_drainage_add"
            type="text"
            size="small"
            icon="el-icon-menu"
            @click="handleItem(scope.row,scope.$index)"
          >属性</el-button>
        </template>
      </avue-crud>
      <el-dialog
        title="新增类型"
        :visible.sync="addVisible"
        :fullscreen="isFullscreen"
        @close="addVisibleCancel('rowAdd')"
      >
        <el-form ref="rowAdd" :model="rowAdd" :rules="rules" label-width="100px" class="clearfix">
          <el-col
            class="el-col el-col-12 el-col-offset-0 el-col-xs-12 el-col-md-12"
            style="padding-left: 10px; padding-right: 10px;"
          >
            <el-form-item label="引流液名称" prop="drainageName">
              <el-input
                :span="20"
                v-model="rowAdd.drainageName"
                @blur="formValue(rowAdd.drainageName)"
                @focus="formValueFocus()"
              ></el-input>
            </el-form-item>
          </el-col>
          <span class="red" v-if="rowAddDrainageName">* 已有引流液名称</span>
          <el-col
            class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-24"
            style="padding-left: 10px; padding-right: 10px;"
          >
            <el-form-item label="描述" prop="drainageDescribe">
              <el-input :span="20" type="textarea" v-model="rowAdd.drainageDescribe"></el-input>
            </el-form-item>
          </el-col>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleSave('rowAdd')" :loading="loading">保 存</el-button>
          <el-button @click="addVisibleCancel('rowAdd')">取 消</el-button>
        </div>
      </el-dialog>
      <el-dialog
        :visible.sync="dialogFormVisible"
        title="属性管理"
        width="90%"
        @close="dialogFormVisible=false"
      >
        <avue-crud
          ref="crud"
          :data="tableDataAttribute"
          :permission="permissionList"
          :table-loading="tableLoading"
          :option="tableOptionAttribute"
          @row-update="handleUpdateAttribute"
          @row-del="rowDelAttribute"
        >
          <template slot="menuLeft">
            <el-button type="primary" size="small" icon="el-icon-plus" @click="receive">新 增</el-button>
          </template>
        </avue-crud>
      </el-dialog>

      <el-dialog
        title="新增属性"
        :visible.sync="nursingPlan"
        :fullscreen="isFullscreen"
        @close="nursingPlanCancel('form')"
      >
        <el-form ref="form" :rules="rules" :model="form" label-width="100px">
          <div>
            <el-form-item label="引流液名称" prop="category">
              <el-input style="width:250px" v-model="form.category" disabled></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="属性名称" prop="value">
              <!-- <el-input style="width:200px" placeholder="请输入引流液属性" v-model="form.value" :disabled="true"></el-input> -->
              <el-select style="width:250px" v-model="form.value" placeholder="请选择引流液属性名称">
                <el-option
                  style="width:250px;"
                  v-for="item in drainageAttribute"
                  :key="item.label"
                  :value="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="divBox">
            <el-form-item label="属性类别" prop="value1">
              <el-input
                style="width:250px"
                placeholder="请输入引流液属性类别"
                v-model="form.value1"
                :disabled="form.value== null||form.value== ''?true:false"
                @blur="formValue(form.value1)"
                @focus="formValueFocus()"
              ></el-input>
              <span class="red" v-if="formValueType">* 已有属性类别</span>
            </el-form-item>
          </div>
          <div class="divBox">
            <el-form-item label="状态" prop="resource">
              <el-radio-group v-model="form.resource">
                <el-radio label="正常"></el-radio>
                <el-radio label="异常"></el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="措施" prop="desc">
              <el-input type="textarea" v-model="form.desc"></el-input>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="confirm('form')" :loading="loading">保 存</el-button>
          <el-button @click="nursingPlanCancel('form')">取 消</el-button>
        </div>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import {
  addObj,
  delObj,
  addattribute,
  fetchList,
  putObj,
  preJump,
  dictionary,
  fetchListAttribute,
  getObjAttribute,
  delObjAttribute,
  putObjAttribute
} from "@/api/icu/drainage/type";
import {
  tableOption,
  tableOptionAttribute
} from "@/const/crud/icu/drainage/type";
import { mapGetters } from "vuex";

export default {
  name: "Dict",
  data() {
    return {
      addEdit: false,
      rowAddDrainageName: false,
      rowAdd: {
        drainageName: "",
        drainageDescribe: ""
      },
      rules: {
        drainageName: [
          { required: true, message: "请输入引流液名称", trigger: "blur" }
        ],
        drainageDescribe: [
          { required: true, message: "请输入描述", trigger: "blur" }
        ],
        value: [
          { required: true, message: "请输入属性名称", trigger: "change" }
        ],
        value1: [
          { required: true, message: "请输入属性类别", trigger: "change" }
        ],
        resource: [
          { required: true, message: "请输入状态", trigger: "change" }
        ],
        desc: [{ required: true, message: "请输入描述", trigger: "blur" }]
      },
      addVisible: false,
      // 属性字典
      tableOptionAttribute: tableOptionAttribute,
      // 防重提交
      loading: false,
      isFullscreen: false,
      screenWidth: document.body.clientWidth, // 屏幕尺寸
      formValueType: false,
      row: "",
      form: {
        category: "",
        resource: "",
        value: "",
        value1: "",
        desc: "",
        normal: ""
      },
      formAdd: {},
      attributeType: "",
      attribute: [],
      attributeList: [],
      attributeAttr: [],
      attributeAttr1: [],
      attributeAttr2: [],
      nursingPlan: false,
      searchForm: {},
      searchFormAttribute: {},
      dialogFormVisible: false,
      tableData: [],
      tableDataAttribute: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption,
      // 字典
      drainageAttribute: "",
      drainageId: "",
      formFff: "",
      // 参数字典
      drainageData: ""
    };
  },
  created() {
    this.getList();
  },
  computed: {
    ...mapGetters(["permissions"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permissions.icu_drainage_add, false),
        delBtn: this.vaildData(this.permissions.icu_drainage_del, false),
        editBtn: this.vaildData(this.permissions.icu_drainage_edit, false)
      };
    }
  },
  mounted() {
    // 小屏幕全屏
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
    // 清空
    handleSearchReset() {
      this.searchForm = {};
      this.page = {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      };
      this.getList();
    },
    // 参数获取
    handleItem(row, index) {
      this.searchFormAttribute = {
        drainageName: row.drainageName
      };
      this.drainageData = row;
      this.dialogFormVisible = true;
      this.addEdit = false;
      this.getListAttribute();
    },
    // 分页查询
    getListAttribute() {
      this.tableLoading = true;
      fetchListAttribute(this.drainageData.drainageId).then(response => {
        this.tableDataAttribute = response.data.data;
        this.tableLoading = false;
      });
    },
    // 删除
    rowDelAttribute(row) {
      var _this = this;
      this.$confirm(
        '是否确认删除属性类型为"' + row.attributeType + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delObjAttribute(row);
        })
        .then(() => {
          this.getListAttribute();
          _this.$message({
            showClose: true,
            message: "删除成功",
            type: "success"
          });
        })
        .catch(function() {});
    },
    // 修改
    handleUpdateAttribute: function(row, index, done) {
      putObjAttribute(row).then(() => {
        this.$message({
          showClose: true,
          message: "修改成功",
          type: "success"
        });
        this.getListAttribute();
        done();
      });
    },
    // 新增属性
    receive() {
      this.form.category = this.drainageData.drainageName;
      this.drainageId = this.drainageData.drainageId;
      this.nursingPlan = true;
      if (this.nursingPlan == true) {
        this.value = "";
        this.value1 = "";
      }
      dictionary().then(response => {
        this.drainageAttribute = response.data.data;
      });
      preJump().then(response => {
        this.attribute = response.data.data;
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
    // 新增
    addRow() {
      this.addEdit = true;
      this.addVisible = true;
    },
    addVisibleCancel(rowAdd) {
      this.addVisible = false;
      this.rowAdd = {
        drainageName: "",
        drainageDescribe: ""
      };
      this.rowAddDrainageName = false;
      this.$refs[rowAdd].resetFields();
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
      ).then(response => {
        this.tableData = response.data.data.records;
        this.page.total = response.data.data.total;
        this.tableLoading = false;
      });
    },
    // 删除
    rowDel: function(row) {
      var _this = this;
      this.$confirm(
        '是否确认删除数据类型为"' + row.drainageName + '"的数据项?',
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
    // 修改
    handleUpdate: function(row, index, done) {
      putObj(row).then(() => {
        this.$message({
          showClose: true,
          message: "修改成功",
          type: "success"
        });
        this.getList(this.page);
        done();
      });
    },
    // avue添加
    handleSave(rowAdd) {
      this.$refs[rowAdd].validate(valid => {
        if (valid) {
          for (const i in this.tableData) {
            if (this.tableData[i].drainageName == this.rowAdd.drainageName) {
              this.rowAddDrainageName = true;
              return;
            } else {
              this.rowAddDrainageName = false;
            }
          }
          if (this.addEdit == true) {
            this.loading = true;
            addObj(this.rowAdd)
              .then(() => {
                this.$message({
                  showClose: true,
                  message: "添加成功",
                  type: "success"
                });
                this.addVisible = false;
                this.getList(this.page);
                this.loading = false;
              })
              .catch(() => {
                this.loading = false;
              });
          } else {
            this.loading = false;
            return false;
          }
        }
      });
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
    // 获得焦点
    formValueFocus() {
      if (this.addEdit == true) {
        this.rowAddDrainageName = false;
      } else {
        this.formValueType = false;
      }
    },
    // 失去焦点
    formValue(value1) {
      if (this.addEdit == true) {
        for (const i in this.tableData) {
          if (this.tableData[i].drainageName == value1) {
            this.rowAddDrainageName = true;
            return;
          } else {
            this.rowAddDrainageName = false;
          }
        }
      } else {
        for (const j in this.drainageAttribute) {
          for (const i in this.tableDataAttribute) {
            if (
              this.tableDataAttribute[i].attributeType == value1 &&
              this.drainageAttribute[j].label == this.form.value
            ) {
              this.formValueType = true;
              return;
            } else {
              this.formValueType = false;
            }
          }
        }
      }
    },
    banClick() {
      for (const j in this.drainageAttribute) {
        if (this.form.value == this.drainageAttribute[j].label) {
          this.attributeType = this.drainageAttribute[j].value;
        }
      }
      for (let i = 0; i < this.attributeAttr.length; i++) {
        if (this.attributeAttr[i] == this.attributeType) {
          this.attributeAttr2 = this.attributeAttr1[i];
        }
      }
    },
    // 新增属性确定
    confirm(rowAdd) {
      this.$refs[rowAdd].validate(valid => {
        if (valid) {
          for (const j in this.drainageAttribute) {
            for (const i in this.tableDataAttribute) {
              if (
                this.tableDataAttribute[i].attributeType == this.form.value1 &&
                this.drainageAttribute[j].label == this.form.value
              ) {
                this.formValueType = true;
                return;
              } else {
                this.formValueType = false;
              }
            }
          }
          if (this.formValueType == false) {
            if (this.form.resource == "正常") {
              this.form.normal = 0;
            } else {
              this.form.normal = 1;
            }
            this.formAdd = this.form;
            for (const j in this.drainageAttribute) {
              if (this.form.value == this.drainageAttribute[j].label) {
                this.formAdd.value = this.drainageAttribute[j].value;
              }
            }
            this.loading = true;
            var drainageId = this.drainageId;
            var FormAdd = this.formAdd;
            addattribute(FormAdd, drainageId)
              .then(() => {
                this.$message({
                  showClose: true,
                  message: "添加成功",
                  type: "success"
                });
                this.loading = false;
                this.getListAttribute();
              })
              .catch(() => {
                this.loading = false;
              });
          }
          this.nursingPlan = false;
          this.form = {
            resource: "",
            value: "",
            value1: "",
            desc: "",
            normal: ""
          };
          this.formAdd = "";
        } else {
          this.loading = false;
          return false;
        }
      });
    },
    // 属性取消
    nursingPlanCancel(form) {
      this.nursingPlan = false;
      this.form = {
        resource: "",
        value: "",
        value1: "",
        desc: "",
        normal: ""
      };
      this.formAdd = "";
      this.formValueType = false;
      this.$refs[form].resetFields();
    }
  }
};
</script>

<style lang="scss" scoped>
.clearfix:after {
  content: "";
  display: block;
  clear: both;
}
.divBox {
  margin-top: 20px;
}
.red {
  display: inline-block;
  color: red;
  font-size: 10px;
  line-height: 20px;
  margin-left: 10px;
}
</style>

