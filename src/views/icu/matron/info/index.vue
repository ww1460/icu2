
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
        @size-change="sizeChange"
        @current-change="currentChange"
        @search-reset="clearform"
      >
        <template slot="search">
          <el-col :md="4" :xs="2">
            <el-form-item>
              <el-select
                size="small"
                v-model="nurseGrade"
                style="width:100%"
                placeholder="请选择等级"
                clearable
              >
                <el-option v-for="item in nurseGradeList" :label="item.label" :value="item.value" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </template>
        <template slot="menu" slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            icon="el-icon-view"
            @click="handleCreate(3,scope.row,scope.index)"
          >查看</el-button>
          <el-button
            type="text"
            size="mini"
            icon="el-icon-edit"
            @click="handleUpdate(2,scope.row,scope.index)"
          >编辑</el-button>
          <el-button
            type="text"
            size="mini"
            icon="el-icon-delete"
            @click="rowDel(scope.row,scope.index)"
          >删除</el-button>
        </template>
        <template slot="searchMenu">
          <el-button type="primary" size="small" icon="el-icon-plus" @click="rowAdd(1)">新增</el-button>
        </template>
      </avue-crud>

      <el-dialog
        :title="flag == 1?'新增':flag == 2? '编辑': flag == 3?'查看':''"
        :visible.sync="dialogFormVisible"
        :fullscreen="isFullscreen"
        @close="closeDilog('form')"
      >
        <el-form :model="form" ref="form" :rules="rules" :label-width="'80px'">
          <el-row v-if='flag != 2'>
            <el-col
              class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            >
              <el-form-item label="登录名" prop="username">
                <el-input :disabled="flag == 3 || flag == 2" v-model="form.username"></el-input>
              </el-form-item>
            </el-col> 
            <el-col
              class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            >
              <el-form-item label="登录密码" prop="password">
                <el-input :disabled="flag == 3 || flag == 2" show-password v-model="form.password"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col
              class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            >
              <el-form-item label="科室" prop="deptId">
                <el-select
                  :disabled="flag == 3"
                  v-model="form.deptId"
                  style="width:100%"
                  placeholder="选择科室"
                  clearable
                >
                  <el-option
                    v-for="item in option"
                    :label="item.name"
                    :value="item.deptId"
                    :key="item.id"
                  >{{item.name}}</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            >
              <el-form-item label="姓名" prop="realName">
                <el-input :disabled="flag == 3" v-model="form.realName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col
              class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            >
              <el-form-item label="性别" poro="gender">
                <template>
                  <el-radio-group :disabled="flag == 3" v-model="form.gender">
                    <el-radio :label="0">女</el-radio>
                    <el-radio :label="1">男</el-radio>
                  </el-radio-group>
                </template>
              </el-form-item>
            </el-col>
            <el-col
              class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            >
              <el-form-item label="角色" prop="roleFlag">
                <template>
                  <el-radio-group :disabled="flag == 3" v-model="form.roleFlag">
                    <el-radio :label="0">护士</el-radio>
                    <el-radio :label="1">护士长</el-radio>
                  </el-radio-group>
                </template>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col
              class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            >
              <el-form-item label="手机号" prop="phone">
                <el-input :disabled="flag == 3" v-model="form.phone"></el-input>
              </el-form-item>
            </el-col>
            <el-col
              class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            >
              <el-form-item label="等级" prop="nurseGrade">
                <el-select
                  :disabled="flag == 3"
                  v-model="form.nurseGrade"
                  style="width:100%"
                  placeholder="请选择等级"
                  clearable
                >
                  <el-option v-for="item in nurseGradeList" :label="item.label" :value="item.value" :key="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col
              class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            >
              <el-form-item
                class="form_item_rfid"
                :label-width="'80px'"
                label="RFID"
                prop="nurseRfid"
              >
                <el-input :disabled="flag == 3" v-model="form.nurseRfid" placeholder="请读取RFID"></el-input>
                <el-button :disabled="flag == 3" type="primary" @click="read">读 取</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button :disabled="flag == 3" type="primary" :loading="InfoLoading" @click="getInfo('form')">保 存</el-button>
          <el-button @click="resetForm('form')">取 消</el-button>
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
  UpdateObj,
  getsection,
  pharmacyIp,
  updateUsername,
  getGrade
} from "@/api/icu/matron/info/info";
import { tableOption } from "@/const/crud/icu/matron/info/info";
import { mapGetters } from "vuex";

export default {
  name: "nurseInfo",
  data() {
    var validateUsername = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("登录名不能为空"));
      } else {
        updateUsername(value).then(res => {
          if (res.data.data != null) {
            callback(new Error("登录名已经存在"));
          } else {
            callback();
          }
        });
      }
    };
    return {
      InfoLoading:false,
      nurseGrade: "",
      nurseGradeList:[],
      isFullscreen: false,
      screenWidth: document.body.clientWidth, // 屏幕尺寸
      dialogFormVisible: false,
      deptId: "",
      form: {
        username: "",
        password: "",
        phone: "",
        realName: "",
        gender: "",
        roleFlag: "",
        nurseGrade: "",
        nurseRfid: "",
        deptId: ""
      },
      searchForm: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        current: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption,
      option: [],
      props: { multiple: true },
      flag: "",
      rules: {
        username: [
          { validator: validateUsername, trigger: "blur" },
          { pattern: /^[0-9a-zA-Z]+$/, message: "只能输入数字、字母" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        deptId: [
          {
            required: true,
            message: "请选科室",
            trigger: "change"
          }
        ],
        realName: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur"
          }
        ],
        gender: [
          {
            required: true,
            message: "请选择性别",
            trigger: "change"
          }
        ],
        roleFlag: [
          { required: true, message: "请选择角色", trigger: "change" }
        ],
        phone: [
          { required: true, message: "请填入手机号", trigger: "blur" },
          {
            pattern: /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/,
            message: "请输入正确格式手机号"
          }
        ],
        nurseGrade: [
          { required: true, message: "请选择等级", trigger: "change" }
        ],
        nurseRfid: [{ required: true, message: "请填rfid", trigger: "blur" }]
      }
    };
  },

  computed: {
    ...mapGetters(["permissions"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permissions.icu_nurse_add, false),
        delBtn: this.vaildData(this.permissions.icu_nurse_del, false),
        editBtn: this.vaildData(this.permissions.icu_nurse_edit, false)
      };
    }
  },
  created() {
    getGrade().then(res=>{
      this.nurseGradeList = res.data.data
    })

    if(this.$route.query.realName){
      this.searchForm.realName = this.$route.query.realName
    }
    this.getList()
    
  },
  mounted() {
    //    console.log(this.dep_patients.patients)
    // console.log(this.patientNames)
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
  watch: {
    dialogFormVisible(val) {
      if (val == false) {
        this.form = {
          username: "",
          password: "",
          phone: "",
          realName: "",
          gender: "",
          roleFlag: "",
          nurseGrade: "",
          nurseRfid: "",
          deptId: ""
        };
      }
    }
  },
  methods: {
    closeDilog(formName) {
      this.$nextTick(() => {
        this.$refs[formName].resetFields();
      });
    },

    //关闭表单验证
    resetForm(formName) {

      this.$nextTick(() => {
        this.dialogFormVisible = false
        this.$refs[formName].resetFields();
      });
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
    // 拿到病人RFID
    read() {
      this.form.nurseRfid = "";
      pharmacyIp("N").then(data => {
        this.form.nurseRfid = data.data.data;
      });
    },

    getInfo(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.InfoLoading = true
          if (this.flag == 1) {
            addObj(this.form)
              .then(data => {
                this.$message({
                  showClose: true,
                  message: "添加成功",
                  type: "success"
                });
                this.InfoLoading = false
                this.getList(this.page);
                this.dialogFormVisible = false;
              })
              .catch(() => {});
          }

          if (this.flag == 2) {
            delete this.form.password
            UpdateObj(this.form)
              .then(data => {
                this.$message({
                  showClose: true,
                  message: "修改成功",
                  type: "success"
                });
                this.InfoLoading = false
                this.getList(this.page);
                this.dialogFormVisible = false;
              })
              .catch(() => {
                loading();
              });
          }
        } else {
          this.$message({
            showClose: true,
            message: "请填完必填项。",
            type: "warning"
          });
          this.InfoLoading = false
          return false;
        }
      });
    },
    //新增 按钮点击
    rowAdd(flag) {
      this.form = {
        username: "",
        password: "",
        phone: "",
        realName: "",
        gender: "",
        roleFlag: "",
        nurseGrade: "",
        nurseRfid: "",
        deptId: ""
      };
      this.flag = flag;
      this.dialogFormVisible = true;
    },
    handleCreate(flag, row, index, done, loading) {
      putObj(row.userId).then(res => {
        this.flag = flag;
        this.dialogFormVisible = true;
        this.form = res.data.data;
        this.form.deptId *= 1;
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
          done();
          this.getList(this.page);
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
          for(var i in this.tableData){
           this.tableData[i].nurseGrade = this.tableData[i].nurseGrade.toString()
          }
        })
        .catch(() => {
          this.tableLoading = false;
        });
      getsection().then(res => {
        this.option = res.data.data;
        this.option = this.option.reverse();
      });
    },
    rowDel: function(row, index) {
      var _this = this;
      this.$confirm("是否确认删除" + row.realName, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return delObj(row.nurseId);
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
    handleUpdate: function(flag, row, index, done, loading) {
      putObj(row.userId).then(res => {
        this.flag = flag;
        this.dialogFormVisible = true;
        this.form = res.data.data;
        this.form.deptId *= 1;
      });
    },
    /**
     * @title 数据添加
     * @param row 为当前的数据
     * @param done 为表单关闭函数
     *
     **/
    handleSave: function(row, done, loading) {},
    /**
     * 搜索回调
     */
    searchChange(form) {
      form.nurseGrade = this.nurseGrade;
      this.page = {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      };
      this.searchForm = form;
      this.getList(this.page, form);
    },
    /**
     * 刷新回调
     */
    refreshChange() {
      this.getList(this.page);
    },
    //清空回调
    clearform() {
      this.nurseGrade = "";
      this.page = {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      };
      this.searchForm = {};
      this.getList(this.page);
    }
  }
};
</script>

<style lang="scss">
.input_number {
  .input-number__increase {
    right: 0 !important;
  }
}
.form_item_rfid {
  .el-form-item__content {
    display: flex !important;
  }
  .el-input {
    padding-right: 10px !important;
  }
}
</style>
