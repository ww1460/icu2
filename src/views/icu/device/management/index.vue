<template>
  <!-- 设备管理 -->
  <div class="parameter">
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :permission="permissionList"
        :table-loading="tableLoading"
        :option="tableOption"
        :cell-style="cellStyle"
        @size-change="sizeChange"
        @current-change="currentChange"
        @row-del="rowDel"
      >
        <template slot-scope="scope" slot="menuLeft">
          <el-button
            v-if="permissions.icu_device_add"
            type="primary"
            size="small"
            icon="el-icon-plus"
            @click="receive(scope.row,scope.index)"
          >新 增</el-button>
        </template>
        <template slot-scope="scope" slot="menu">
          <el-button
            v-if="permissions.icu_device_add"
            type="text"
            size="small"
            icon="el-icon-edit"
            @click="handleEdit(scope.row,scope.index)"
          >编 辑</el-button>
          <el-button
            v-if="permissions.icu_device_add"
            type="text"
            size="small"
            icon="el-icon-delete"
            @click="rowDel(scope.row,scope.index)"
          >删 除</el-button>
          <el-button
            v-if="permissions.icu_device_add"
            type="text"
            size="mini"
            icon="el-icon-menu"
            @click="handleItem(scope.row,scope.index)"
          >参 数</el-button>
        </template>
      </avue-crud>
      <!-- 新增对话框 -->
      <el-dialog
        :title="edit == true?'编辑设备':'新增设备'"
        :visible.sync="recordAdd"
        :fullsteden="isFullscreen"
        @close="cancel('form')"
      >
        <el-form ref="form" :model="form" label-width="100px" :rules="rules" style="height: 400px;">
          <el-col
            class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            style="padding-left: 10px; padding-right: 10px;"
          >
            <el-form-item label="设备名称" prop="name">
              <el-input v-model="form.name" auto-complete="off" placeholder="请输入设备名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col
            class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            style="padding-left: 10px; padding-right: 10px;"
          >
            <el-form-item label="设备型号" prop="model">
              <el-input v-model="form.model" auto-complete="off" placeholder="请输入设备型号"></el-input>
            </el-form-item>
          </el-col>

          <el-col
            class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            style="padding-left: 10px; padding-right: 10px;"
          >
            <el-form-item label="编码" prop="deviceNumber">
              <el-input v-model="form.deviceNumber" auto-complete="off" placeholder="请输入编码"></el-input>
            </el-form-item>
          </el-col>
          <el-col
            class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            style="padding-left: 10px; padding-right: 10px;"
          >
            <el-form-item label="RFID" class="fromItem">
              <el-input id="inputFocus" v-model="form.rfidId" placeholder="请读取RFID"></el-input>
              <el-button type="primary" @click="read">读 取</el-button>
            </el-form-item>
          </el-col>
          <el-col
            class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            style="padding-left: 10px; padding-right: 10px;"
          >
            <el-form-item label="已使用时长" prop="useTime">
              <el-input v-model="form.useTime" auto-complete="off" placeholder="请输入设备已使用时长/分钟"></el-input>
            </el-form-item>
          </el-col>
          <el-col
            class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            style="padding-left: 10px; padding-right: 10px;"
          >
            <el-form-item label="厂家">
              <el-input v-model="form.factory" auto-complete="off" placeholder="请输入厂家"></el-input>
            </el-form-item>
          </el-col>
          <el-col
            class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            style="padding-left: 10px; padding-right: 10px;"
          >
            <el-form-item label="联系人">
              <el-input v-model="form.contacts" auto-complete="off" placeholder="请输入联系人"></el-input>
            </el-form-item>
          </el-col>
          <el-col
            class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            style="padding-left: 10px; padding-right: 10px;"
          >
            <el-form-item label="联系人手机号" prop="cellPhoneNumber">
              <el-input v-model="form.cellPhoneNumber" auto-complete="off" placeholder="请输入联系人手机号"></el-input>
            </el-form-item>
          </el-col>
          <el-col
            class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            style="padding-left: 10px; padding-right: 10px;"
          >
            <el-form-item label="营销商">
              <el-input v-model="form.dealer" auto-complete="off" placeholder="请输入营销商"></el-input>
            </el-form-item>
          </el-col>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleSave('form')" :loading="loading">保 存</el-button>
          <el-button @click="cancel('form')">取 消</el-button>
        </div>
      </el-dialog>
      <el-dialog
        :visible.sync="dialogFormVisible"
        :table-loading="tableLoading"
        title="参数管理"
        width="90%"
        @close="dialogFormVisible=false"
      >
        <avue-crud
          ref="crudItem"
          :data="tableDictItemData"
          :permission="permissionList"
          :option="tableDictItemOption"
          :table-loading="tableLoading"
        >
          <template slot-scope="scope" slot="menuLeft">
            <el-button
              v-if="permissions.icu_device_add"
              type="primary"
              size="small"
              icon="el-icon-plus"
              @click="receiveParameter(scope.row,scope.index)"
            >新 增</el-button>
          </template>
          <template slot-scope="scope" slot="menu">
            <el-button
              v-if="permissions.icu_device_add"
              type="text"
              size="small"
              icon="el-icon-edit"
              @click="editParameter(scope.row,scope.index)"
            >编 辑</el-button>
            <el-button
              v-if="permissions.icu_device_add"
              type="text"
              size="small"
              icon="el-icon-delete"
              @click="delParameter(scope.row,scope.index)"
            >删 除</el-button>
          </template>
        </avue-crud>
      </el-dialog>
      <el-dialog
        :visible.sync="parameterAdd"
        title="参数管理"
        class="clearfix"
        @close="cancelParameter"
      >
        <div>
          <el-collapse v-model="activeName" style="margin-left:70px;">
            <el-collapse-item title="项目" name="1">
              <el-collapse v-model="activeNames" accordion style="margin-left:50px;">
                <el-collapse-item
                  v-for="(item,index) in projectDataKeys"
                  :key="index"
                  :name="index+1"
                  :title="item"
                >
                  <el-button
                    v-for="(items,index1) in projectDataValues[index]"
                    :key="index1"
                    :class="items.flag==true?'blue':''"
                    @click="elBtn(items)"
                    style="margin-bottom:10px;"
                  >{{items.projectName}}</el-button>
                </el-collapse-item>
              </el-collapse>
            </el-collapse-item>
          </el-collapse>
        </div>
        <el-form ref="form" :model="formParameter" label-width="100px" style="margin-top:20px;">
          <el-col
            class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-24 avue-form__row"
            style="padding-left: 10px; padding-right: 10px;"
          >
            <el-form-item label="型号">
              <el-input v-model="formParameter.devModel" disabled auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col
            class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-24 avue-form__row"
            style="padding-left: 10px; padding-right: 10px;"
          >
            <el-form-item label="参数编号">
              <el-input
                v-model="formParameter.parameterCode"
                auto-complete="off"
                placeholder="请输入参数编号"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="saveParameter()" :loading="loading">保 存</el-button>
          <el-button @click="cancelParameter">取 消</el-button>
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
  pharmacyIp,
  parameters,
  getProject,
  projectType,
  parametersAdd,
  parametersUpdate,
  delParameters
} from "@/api/icu/device/management";
import {
  tableOption,
  tableDictItemOption
} from "@/const/crud/icu/device/management";
import { mapGetters } from "vuex";

export default {
  name: "Tenant",
  data() {
    return {
      // 防重提交
      loading: false,
      editRow: "",
      // 判断是编辑还是新增
      Edit: false,
      // 设备参数
      formParameter: {
        devModel: "",
        parameterCode: "",
        parameterName: "",
        projectId: ""
      },
      // 手风琴
      activeName: "0",
      activeNames: "0",
      // 字典表项目类型
      projectType: [],
      // 参数项目数据
      projectData: {},
      // 参数项目数据的keys和values
      projectDataKeys: [],
      projectDataValues: [],
      // 参数新增弹框
      parameterAdd: false,
      // 设备参数弹框
      dialogFormVisible: false,
      // 判断是编辑还是新增
      edit: false,
      // 对话框显隐
      recordAdd: false,
      // 对话框model绑定数据
      form: {
        name: "",
        model: "",
        useTime: "",
        rfidId: "",
        deviceNumber: "",
        position: "",
        factory: "",
        contacts: "",
        cellPhoneNumber: "",
        dealer: ""
      },
      // 小屏幕全屏
      isFullscreen: false,
      screenWidth: document.body.clientWidth, // 屏幕尺寸
      // 分页
      searchForm: {},
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      pageTwo: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      // 页面渲染数据
      tableData: [],
      tableLoading: false,
      tableOption: tableOption,
      tableDictItemData: [],
      tableDictItemOption: tableDictItemOption,
      // 新增和编辑录入数据判断
      rules: {
        name: [{ required: true, message: "请输入设备名称", trigger: "blur" }],
        model: [
          { required: true, message: "请输入设备型号", trigger: "change" }
        ],
        deviceNumber: [
          { required: true, message: "请输入设备型号", trigger: "change" }
        ],
        cellPhoneNumber: [
          {
            pattern: /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/,
            message: "请输入正确的手机号",
            trigger: "blur"
          }
        ],
        useTime: [
          {
            pattern: /^[0-9]*$/,
            message: "请输入数字",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    // 权限
    ...mapGetters(["permissions"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permissions.icu_device_add, false),
        delBtn: this.vaildData(this.permissions.icu_device_del, false),
        editBtn: this.vaildData(this.permissions.icu_device_edit, false)
      };
    }
  },
  created() {
    this.getList();
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
    // 设备参数删除
    delParameter(row, index) {
      let _this = this;
      this.$confirm(
        "是否确认删除参数编号为" + row.parameterCode + "的参数",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delParameters(row.id);
        })
        .then(data => {
          _this.tableDictItemData.splice(index, 1);
          _this.$message({
            showClose: true,
            message: "删除成功",
            type: "success"
          });
        });
    },
    // 设备参数点击编辑
    editParameter(row, index) {
      this.Edit = true;
      this.editRow = row;
      getProject().then(data => {
        this.projectData = data.data.data;
        this.projectDataKeys = Object.keys(data.data.data);
        this.projectDataValues = Object.values(data.data.data);
        for (const i in this.projectDataValues) {
          for (const k in this.projectDataValues[i]) {
            if (row.projectId == this.projectDataValues[i][k].projectId) {
              this.projectDataValues[i][k].flag = true;
              let active = Number(i) + 1;
              this.activeNames = active;
              this.activeName = 1;
              this.$forceUpdate(); //强制页面进行刷新
            } else {
              this.projectDataValues[i][k].flag = false;
            }
          }
        }
        projectType().then(res => {
          this.projectType = res.data.data;
          for (const i in this.projectDataKeys) {
            for (const j in this.projectType) {
              if (this.projectDataKeys[i] == this.projectType[j].value) {
                this.projectDataKeys[i] = this.projectType[j].label;
                this.$forceUpdate(); //强制页面进行刷新
              }
            }
          }
        });
      });
      this.parameterAdd = true;
      this.formParameter.devModel = row.devModel;
      this.formParameter.parameterName = row.parameterName;
      this.formParameter.parameterCode = row.parameterCode;
      this.formParameter.projectId = row.projectId;
    },
    // 设备新增 编辑 保存
    saveParameter() {
      if (this.Edit == false) {
        if (this.formParameter.parameterCode == "") {
          this.$message.error("请输入参数编号");
        } else {
          if (this.formParameter.projectId == "") {
            this.$message.error("请选择一个项目");
          } else {
            let _this = this;
            _this.loading = true;
            parametersAdd(_this.formParameter)
              .then(data => {
                this.$message({
                  showClose: true,
                  message: "保存成功",
                  type: "success"
                });
                this.loading = false;
                this.parameterAdd = false;
                this.formParameter.parameterCode = "";
                this.formParameter.parameterName = "";
                this.formParameter.projectId = "";
                parameters(_this.formParameter.devModel).then(data => {
                  this.tableDictItemData = data.data.data;
                });
              })
              .catch(() => {
                this.Loading = false;
              });
          }
        }
      } else {
        let _this = this;
        _this.loading = true;
        let formParameter = {
          id: _this.editRow.id,
          parameterCode: this.formParameter.parameterCode,
          parameterName: this.formParameter.parameterName,
          projectId: this.formParameter.projectId,
          devModel: this.formParameter.devModel
        };
        parametersUpdate(formParameter)
          .then(data => {
            this.$message({
              showClose: true,
              message: "修改成功",
              type: "success"
            });
            this.loading = false;
            this.parameterAdd = false;
            this.formParameter.parameterCode = "";
            this.formParameter.parameterName = "";
            this.formParameter.projectId = "";
            parameters(_this.formParameter.devModel).then(data => {
              this.tableDictItemData = data.data.data;
            });
          })
          .catch(() => {
            this.Loading = false;
          });
      }
    },
    // 设备参数取消
    cancelParameter() {
      this.parameterAdd = false;
      this.formParameter = {
        parameterCode: "",
        parameterName: "",
        projectId: ""
      };
    },
    // 设备参数项目高亮
    elBtn(items) {
      for (const i in this.projectDataValues) {
        for (const k in this.projectDataValues[i]) {
          if (items.projectId == this.projectDataValues[i][k].projectId) {
            if (this.projectDataValues[i][k].flag == true) {
              this.projectDataValues[i][k].flag = false;
              this.formParameter.parameterName = "";
              this.formParameter.projectId = "";
            } else {
              this.projectDataValues[i][k].flag = true;
              this.formParameter.parameterName = this.projectDataValues[i][
                k
              ].projectName;
              this.formParameter.projectId = this.projectDataValues[i][
                k
              ].projectId;
            }
          } else {
            this.projectDataValues[i][k].flag = false;
          }
        }
      }
      this.$forceUpdate(); //强制页面进行刷新
    },
    // 参数获取
    handleItem(row, index) {
      this.Model = row.model;
      this.dialogFormVisible = true;
      parameters(row.model).then(data => {
        this.tableDictItemData = data.data.data;
      });
    },
    // 参数新增
    receiveParameter(row, index) {
      this.activeNames = 0;
      this.formParameter.devModel = this.Model;
      this.editRow = {};
      this.Edit = false;
      this.parameterAdd = true;
      getProject().then(data => {
        this.projectData = data.data.data;
        this.projectDataKeys = Object.keys(data.data.data);
        this.projectDataValues = Object.values(data.data.data);
        projectType().then(res => {
          this.projectType = res.data.data;
          for (const i in this.projectDataKeys) {
            for (const j in this.projectType) {
              if (this.projectDataKeys[i] == this.projectType[j].value) {
                this.projectDataKeys[i] = this.projectType[j].label;
                this.$forceUpdate(); //强制页面进行刷新
              }
            }
          }
        });
      });
    },
    // 新增按钮
    receive() {
      // 对话框显示
      this.recordAdd = true;
      // 确定是新增
      this.edit = false;
      // 新增时数据清零
      this.form = {
        name: "",
        model: "",
        rfidId: "",
        state: "",
        deviceNumber: "",
        position: "",
        factory: "",
        contacts: "",
        cellPhoneNumber: "",
        dealer: ""
      };
    },
    // 拿到设备RFID
    read() {
      this.form.rfidId = "";
      let E = "E";
      pharmacyIp(E).then(data => {
        this.form.rfidId = data.data.data;
      });
    },
    // 解决分页问题
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.getList();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.getList();
    },
    // 使用状态字体变色
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 5) {
        if (row.state == 0) {
          return {
            color: "#ddd"
          };
        } else if (row.state == 1) {
          return {
            color: "rgba(161, 217, 6, 1)"
          };
        } else {
          return {
            color: "rgba(249, 44, 37, 0.8)"
          };
        }
      }
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
    // 删除记录
    rowDel: function(row, index) {
      let _this = this;
      this.$confirm("是否确认删除设备" + row.name, "提示", {
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
    // 编辑打开对话框
    handleEdit(row, index) {
      // 对话框打开是编辑状态
      this.recordAdd = true;
      this.edit = true;
      // 数据赋值
      this.form.id = row.id;
      this.form.name = row.name;
      this.form.model = row.model;
      this.form.rfidId = row.rfidId;
      this.form.deviceNumber = row.deviceNumber;
      this.form.position = row.position;
      this.form.factory = row.factory;
      this.form.contacts = row.contacts;
      this.form.cellPhoneNumber = row.cellPhoneNumber;
      this.form.dealer = row.dealer;
    },
    // 添加记录
    handleSave(form) {
      // 判断是新增还是编辑的确定
      if (this.edit == true) {
        let _this = this;
        this.loading = true;
        // 编辑
        putObj(_this.form)
          .then(data => {
            this.recordAdd = false;
            this.$message({
              showClose: true,
              message: "修改成功",
              type: "success"
            });
            this.loading = false;
            this.getList(this.page);
          })
          .catch(() => {
            this.Loading = false;
          });
      } else {
        // element的表单判断
        this.$refs[form].validate(valid => {
          if (valid) {
            let _this = this;
            this.loading = true;
            // 新增
            addObj(_this.form)
              .then(data => {
                // this.tableData.push(Object.assign({}, row));
                this.$message({
                  showClose: true,
                  message: "添加成功",
                  type: "success"
                });
                this.loading = false;
                this.recordAdd = false;
                this.getList(this.page);
                this.form = {
                  name: "",
                  model: "",
                  rfidId: "",
                  deviceNumber: "",
                  position: "",
                  factory: "",
                  contacts: "",
                  cellPhoneNumber: "",
                  dealer: ""
                };
                this.$forceUpdate(); //强制页面进行刷新
              })
              .catch(() => {
                this.Loading = false;
              });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    },
    // 添加取消
    cancel(formName) {
      this.recordAdd = false;
      this.form = {
        name: "",
        model: "",
        rfidId: "",
        state: "",
        deviceNumber: "",
        position: "",
        factory: "",
        contacts: "",
        cellPhoneNumber: "",
        dealer: ""
      };
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang="scss" >
.parameter {
  .clearfix:after {
    content: "";
    display: block;
    clear: both;
  }
  .fromItem .el-form-item__content {
    display: flex;
  }
  .blue {
    background: #409eff !important;
    color: #fff !important;
    text-align: center;
  }
  .elBtn {
    margin-bottom: 10px;
  }
}
</style>
