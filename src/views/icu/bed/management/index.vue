
<template>
  <div class="execution">
    <basic-container v-loading="tableLoading">
      <!-- <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :permission="permissionList"
        :table-loading="tableLoading"
        :option="tableOption"
        @on-load="getList"
        @search-change="searchChange"
        @refresh-change="refreshChange"
        :cell-style="cellStyle"
      >
        <template slot-scope="scope" slot="menu">
          <el-button type="text" icon="el-icon-view" size="small" @click="bedView(2,scope.row)">查看</el-button>
          <el-button type="text" icon="el-icon-edit" size="small" @click="bedEdit(3,scope.row)">编辑</el-button>
          <el-button type="text" icon="el-icon-delete" size="small" @click="rowDel(scope.row)">删除</el-button>
        </template>

        <template slot="searchMenu">
          <el-button type="primary" icon="el-icon-plus" size="small" @click="addList(1)">新增</el-button>
        </template>
      </avue-crud>-->
      <div>
        <el-input class="searchCode" size="small" v-model="codeSearch" placeholder="床位编号" clearable></el-input>
        <el-radio-group v-model="useFlag" size="small" @change="useFlagChange">
          <el-radio :label="item.value" v-for="item in bedStates" :key="item.value">{{item.label}}</el-radio>
        </el-radio-group>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="small"
          @click="searchChange()"
          style="margin-bottom:10px"
        >搜索</el-button>
        <el-button
          icon="el-icon-delete"
          size="small"
          @click="clearSearch()"
          style="margin-bottom:10px"
        >清空</el-button>
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="small"
          @click="addList(1)"
          style="margin-bottom:10px"
        >新增</el-button>
      </div>
      <el-row :gutter="20">
        <el-col
          :xs="{span: 6}"
          :sm="{span: 6}"
          :md="{span: 6}"
          :lg=" {span: 4}"
          v-for="(item, index) in tableData"
          :key="index"
        >
          <el-card :body-style="{ padding: '0px' }" shadow="always" class="imgCard">
            <img src="/img/bed/bedUse.png" v-if="item.useFlag==1" alt class="image" />
            <img src="/img/bed/bedUnused.png" v-if="item.useFlag==0" alt class="image" />
            <img src="/img/bed/bedMaintain.png" v-if="item.useFlag==2" alt class="image" />
            <!-- <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image"> -->
            <div style="padding: 14px;">
              <span
                style="padding-left:15px;white-space: nowrap;overflow:hidden;text-overflow:ellipsis;"
              >床位名: {{ item.bedName}}</span>
              <br />
              <span
                style="padding-left:15px;white-space: nowrap;overflow:hidden;text-overflow:ellipsis;"
              >床位编号: {{ item.bedCode}}</span>
              <br />
              <span
                style="padding-left:15px;white-space: nowrap;overflow:hidden;text-overflow:ellipsis;"
              >
                床位状态:
                <span
                  :style="item.useFlag==0?'color:#409EFF':item.useFlag==1?'color:#F56C6C':item.useFlag==2?'color:#909399':'' "
                >{{ item.useFlag | useFlagFl}}</span>
              </span>
              <div class="bottom clearfix">
                <!-- <time class="time">{{ currentDate }}</time>
                -->
                <el-button type="text" icon="el-icon-view" size="small" @click="bedView(2,item)">查看</el-button>
                <el-button type="text" icon="el-icon-edit" size="small" @click="bedEdit(3,item)">编辑</el-button>
                <el-button type="text" icon="el-icon-delete" size="small" @click="rowDel(item)">删除</el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <div style="width:100%;padding-left:65%">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next"
          :total="total"
        ></el-pagination>
      </div>
      <el-dialog
        :title="flag == 1?'新增':flag == 3? '编辑': flag == 2?'查看':''"
        :visible.sync="dialogFormVisible"
        :fullscreen="isFullscreen"
        @close="closeDilog('form')"
      >
        <el-form
          :disabled="flag == 2"
          :model="form"
          ref="form"
          :rules="rules"
          :label-width="'80px'"
        >
          <el-row>
            <el-col
              class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            >
              <el-form-item label="床位名" prop="bedName">
                <el-input :disabled="flag == 2||editIf" v-model="form.bedName"></el-input>
              </el-form-item>
            </el-col>
            <el-col
              class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            >
              <el-form-item label="床位编号" prop="bedCode">
                <el-input :disabled="flag == 2||editIf" v-model="form.bedCode"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col
              class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            >
              <el-form-item label="床位状态" prop="useFlag">
                <el-radio-group v-model="form.useFlag" :disabled="flag == 2">
                  <el-radio :disabled="form.useFlag == 1" :label="0">未使用</el-radio>
                  <el-radio :label="1" :disabled="form.useFlag == 0||form.useFlag == 2">使用中</el-radio>
                  <el-radio :disabled="form.useFlag == 1" :label="2">维护中</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col
              class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            >
              <el-form-item class="form_item_rfid" :label-width="'80px'" label="RFID" prop="rfid">
                <el-input :disabled="flag == 2||editIf" v-model="form.rfid" placeholder="请读取RFID"></el-input>
                <el-button :disabled="flag == 2 || editIf" type="primary" @click="read">读 取</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" :disabled="flag == 2" @click="handleSave('form')">保 存</el-button>
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
  pharmacyIp,
  updateBedName,
  updateBedCode
} from "@/api/icu/matron/bedManagement/bedManagement";
import { tableOption } from "@/const/crud/icu/matron/bedManagement/bedManagement";
import { mapGetters } from "vuex";

export default {
  name: "bedManagement",
  filters: {
    useFlagFl: data => {
      switch (data) {
        case 0:
          return "未使用";
        case 1:
          return "使用中";
        case 2:
          return "维护中";
        default:
      }
    }
  },
  data() {
    var validatebedName = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("床位名不能为空"));
      } else {
        let list = {
          name: value,
          bedId: this.bedId
        }
        updateBedName(list).then(res => {
          if (res.data.data != null) {
            callback(new Error("床位名已经存在"));
          } else {
            callback();
          }
        });
      }
    };
    var validatebedCode = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("床位号不能为空"));
      } else {
        let list = {
          code: value,
          bedId: this.bedId
        }
        updateBedCode(list).then(res => {
          if (res.data.data != null) {
            callback(new Error("床位号已经存在"));
          } else {
            callback();
          }
        });
      }
    };
    return {
      bedStates: [
        { label: '未使用', value: 0 },
        { label: '使用中', value: 1 },
        { label: '维护中', value: 2 }
      ],
      bedId: '',
      editIf: false,
      useFlag: '',
      codeSearch: "",
      isFullscreen: false,
      screenWidth: document.body.clientWidth, // 屏幕尺寸
      dialogFormVisible: false,
      form: {
        bedName: "",
        bedCode: "",
        useFlag: "",
        rfid: ""
      },
      searchForm: {},
      tableData: [],
      pageSize: 10,
      currentPage: 1,
      total: 0,
      // page: {
      //   total: 0, // 总页数
      //   currentPage: 1, // 当前页数
      //   pageSize: 10 // 每页显示多少条
      // },
      tableLoading: false,
      tableOption: tableOption,
      rules: {
        bedName: [
          {
            validator: validatebedName,
            trigger: "blur"
          }
        ],
        bedCode: [{ validator: validatebedCode, trigger: "blur" }],
        useFlag: [
          { required: true, message: "请选择状态", trigger: "change" }
        ],
        rfid: [{ required: true, message: "请输入rfid", trigger: "blur" }]
      },
      flag: ""
    };
  },
  watch: {
    dialogFormVisible: function (val) {
      if (val == false) {
        this.form = {
          bedName: "",
          bedCode: "",
          useFlag: "",
          rfid: ""
        };
        this.editIf = false
        this.bedId = ""
      }
    }
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
  created() {
    this.getList();
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
    //清空事件
    clearSearch() {
      this.codeSearch = "";
      this.currentPage = 1;
      this.pageSize = 10;
      this.searchForm = {};
      this.useFlag = ""
      this.getList();
    },
    //分页事件
    handleSizeChange(val) {
      this.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },
    useFlagChange(val) {
      this.searchForm = {
        useFlag: val
      }
      this.getList();
    },
    //点击新增
    addList(flag) {
      this.flag = flag;
      this.form = {
        bedName: "",
        bedCode: "",
        useFlag: "",
        rfid: ""
      };
      this.dialogFormVisible = true;
      // this.$refs.crud.rowAdd();
    },
    //点击编辑
    bedEdit(flag, row) {
      this.bedId = row.bedId
      this.editIf = true
      putObj(row.id).then(res => {
        this.form = res.data.data;
        this.flag = flag;
        this.dialogFormVisible = true;
      });
    },

    //点击查看
    bedView(flag, row) {
      putObj(row.id).then(res => {
        this.form = res.data.data;
        this.flag = flag;
        this.dialogFormVisible = true;
      });
    },

    // 拿到设备RFID
    read() {
      pharmacyIp("B").then(data => {
        this.form.rfid = data.data.data;
      });
    },
    //Avue 表单过滤
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 3) {
        if (row.useFlag == 1) {
          return {
            color: "#67C23A"
          };
        } else if (row.useFlag == 0) {
          return {
            color: "#F56C6C"
          };
        } else if (row.useFlag == 2) {
          return {
            color: "#909399"
          };
        }
      }
    },
    handleCreate(row, index, done, loading) {
      putObj(row.nurseId)
        .then(data => {
          this.$refs.crud.rowView(data.data.data, index);
          done();
        })
        .catch(() => { });
    },
    //点击修改提交
    Update(row, index, loading) {
      this.$confirm("是否确认修改?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        UpdateObj(row)
          .then(data => {
            this.$refs.crud.rowEdit(data.data.data, index);
            this.tableData.splice(index, 1, Object.assign({}, row));
            this.$message({
              showClose: true,
              message: "修改成功",
              type: "success"
            });
            this.currentPage = 1
            this.getList();
          })
          .catch(() => { });
      })
    },
    getList() {
      this.tableLoading = true;
      fetchList(
        Object.assign(
          {
            current: this.currentPage,
            size: this.pageSize
          },
          this.searchForm
        )
      )
        .then(response => {
          this.tableData = response.data.data.records;
          this.total = response.data.data.total;
          this.tableLoading = false;
        })
        .catch(() => {
          this.tableLoading = false;
        });
    },
    rowDel: function (row, index) {
      var _this = this;
      this.$confirm("是否确认删除" + row.bedCode + "床位?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function () {
          return delObj(row.id);
        })
        .then(data => {
          _this.tableData.splice(index, 1);
          _this.$message({
            showClose: true,
            message: "删除成功",
            type: "success"
          });
          this.getList();
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
    // handleUpdate: function(row, index, done, loading) {
    //   putObj(row.nurseId)
    //     .then(data => {
    //       this.$refs.crud.rowEdit(data.data.data, index);
    //       done();
    //     })
    //     .catch(() => {});
    // },
    /**
     * @title 数据添加
     * @param row 为当前的数据
     * @param done 为表单关闭函数
     *
     **/

    handleSave(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          if (this.flag == 1) {
            addObj(this.form)
              .then(data => {
                this.$message({
                  showClose: true,
                  message: "添加成功",
                  type: "success"
                });
                this.getList();
                this.dialogFormVisible = false;
              })
              .catch(() => { });
          } else if (this.flag == 3) {
            UpdateObj(this.form)
              .then(data => {
                this.$message({
                  showClose: true,
                  message: "修改成功",
                  type: "success"
                });

                this.getList();
                this.dialogFormVisible = false;
              })
              .catch(() => { });
          }
        } else {
          this.$message({
            showClose: true,
            message: "请填完必填项。",
            type: "warning"
          });
          return false;
        }
      });
    },
    /**
     * 搜索回调
     */
    searchChange() {
      this.currentPage = 1;
      this.pageSize = 10;
      this.searchForm.bedCode = this.codeSearch;
      this.getList();
    },
    /**
     * 刷新回调
     */
    refreshChange() {
      this.getList();
    }
  }
};
</script>

<style lang="scss">
.form_item_rfid {
  .el-form-item__content {
    display: flex !important;
  }
  .el-input {
    padding-right: 10px;
  }
}
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
  width: 100%;
  text-align: center;
  // border-top: 1px solid #eee
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 30%;
  margin-left: 35%;
  margin-top: 10px;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}

.clearfix:after {
  clear: both;
}
.imgCard {
  margin-top: 10px !important;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1) !important;
}
.imgCard:hover {
  -webkit-box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  -webkit-transform: translate3d(0, -5px, 0);
  transform: translate3d(0, -5px, 0);
}
.searchCode {
  width: 200px !important;
  margin-right: 10px;
}
@media screen and (max-width: 1024px) {
  .searchCode {
    width: 96%;
    margin-left: 10px;
    margin-bottom: 20px;
  }
}
</style>
<style lang="scss" scoped>
.el-cascader-node > .el-checkbox,
.el-cascader-node > .el-radio,
.el-radio:last-child {
  margin-right: 10px;
}
</style>
