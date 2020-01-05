
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
        @search-reset="searchReset"
        @refresh-change="refreshChange"
        @row-update="Update"
        @size-change="sizeChange"
        @current-change="currentChange"
      >
        <template slot="search">
          <el-col :md="4" :xs="4">
            <el-form-item>
              <patientChose :getList="getList" ref="patientChoseChild" :page="page" />
            </el-form-item>
          </el-col>
          <el-col :md="7" :xs="24">
            <el-form-item>
              <el-date-picker
                v-model="value2"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
                size="small"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </template>
        <template slot="searchMenu">
          <el-button type="primary" size="small" icon="el-icon-plus" @click="rowAdd()">新增</el-button>
        </template>
      </avue-crud>
      <el-dialog
        title="新增出入量"
        :visible.sync="dialogFormVisible"
        :fullscreen="isFullscreen"
        @close="closeDilog('form')"
      >
        <el-form ref="form" :model="form">
          <el-row>
            <el-col class="el-col el-col-24 el-col-md-12 el-col-xs-24">
              <el-form-item label="患者姓名" :label-width="formLabelWidth">
                <el-select v-model="form.patientId" style="width:100%">
                  <el-option
                    v-for="item in patientNames"
                    :key="item.patientId"
                    :label="item.patientName + ' '+ item.bedName"
                    :value="item.patientId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col class="el-col el-col-24 el-col-md-12 el-col-xs-24">
              <el-form-item label="出入量" :label-width="formLabelWidth" prop="projectType">
                <el-radio-group v-model="projectType" @change="projectTypeBtn" style="width:100%">
                  <el-radio :label="2">出量</el-radio>
                  <el-radio :label="3">入量</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col class="el-col el-col-24 el-col-md-12 el-col-xs-24">
              <el-form-item
                label="项目"
                :label-width="formLabelWidth"
                prop="projectId"
                :rules="[
      { required: true, message: '请选择项目'},
    ]"
              >
                <el-select v-model="form.projectId" style="width:100%">
                  <el-option
                    v-for="item in project"
                    :key="item.projectId"
                    :label="item.projectName"
                    :value="item.projectId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col class="el-col el-col-24 el-col-md-12 el-col-xs-24">
              <el-form-item
                label="出入量值"
                :label-width="formLabelWidth"
                prop="intakeOutputValue"
                :rules="[
      { required: true, message: '请输入出入量值'},
      { type: 'number', message: '出入量值必须为数字值'}
    ]"
              >
                <el-input
                  type="intakeOutputValue"
                  v-model.number="form.intakeOutputValue"
                  style="width:100%"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col class="el-col el-col-24 el-col-md-24 el-col-xs-24">
              <el-form-item label="创建时间" :label-width="formLabelWidth">
                <el-date-picker
                  v-model="form.createdTime"
                  type="datetime"
                  placeholder="选择日期时间"
                  align="right"
                  :picker-options="pickerOptions"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col class="el-col el-col-24 el-col-md-24 el-col-xs-24">
              <el-form-item label="描述" :label-width="formLabelWidth">
                <el-input type="textarea" v-model="form.valueDescription" placeholder="请输入出入量描述"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="sure('form')" :loading="sureLoading">确 定</el-button>
          <el-button @click="close('form')">取 消</el-button>
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
  getProjectType,
  getnurse,
  addProjectType
} from "@/api/icu/matron/intakeAndOutput/intakeAndOutput";
import patientChose from "@/views/icu/index/patientChose";
import { tableOption } from "@/const/crud/icu/matron/intakeAndOutput/intakeAndOutput";
import { dateFormat } from "@/util/date";
import { mapGetters, mapState } from "vuex";

export default {
  name: "intakeAndOutput",
  components: {
    patientChose
  },
  data() {
    return {
      isFullscreen: false,
      screenWidth: document.body.clientWidth, // 屏幕尺寸
      searchForm: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption,
      dialogFormVisible: false,
      formLabelWidth: "80px",
      sureLoading: false,
      form: {
        patientId: "",
        projectId: "",
        intakeOutputType: "",
        intakeOutputValue: "",
        valueDescription: "",
        createdTime: ""
      },
      projectType: 2,
      patientNames: [],
      project: [],
      patientName: "",
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      value2: ""
    };
  },
  computed: {
    ...mapGetters(["permissions", "nurse_patients", "dep_patients"]),
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
  // created() {
  //   this.getList();
  //   // if (this.roleCodes == "ROLE_NURSE") {
  //   //    this.patientNames = this.nurse_patients;
  //   //    this.form.patientId = this.patientNames[0].patientId;
  //   // } else if (this.roleCodes == "ROLE_MATRON") {
  //   //    this.patientNames = this.dep_patients.patients;
  //   //    this.patientNames.forEach(item => {
  //   //       Object.assign(item, {
  //   //          patientName: item.name
  //   //       });
  //   //    });
  //   //    this.form.patientId = this.patientNames[0].patientId;
  //   // }
  //   // console.log(this.patientNames);
  //   let data = JSON.parse(sessionStorage.getItem("pigx-all_patients")).content;
  //   this.patientNames = data;
  //   this.form.patientId = data[0].patientId;
  //   // var data = [];
  //   //  getnurse().then(res => {
  //   //    res.data.data.forEach(i => {
  //   //      i.patient.patientName = i.patient.name;
  //   //      data.push(i.patient);
  //   //    });
  //   //    this.patientNames = data;
  //   //    this.form.patientId = data[0].patientId;
  //   //  });
  // },
  // activated() {
  //   let data = JSON.parse(sessionStorage.getItem("pigx-all_patients")).content;
  //   this.patientNames = data;
  //   this.form.patientId = data[0].patientId;
  // },
  methods: {
    closeDilog(formName) {
      this.$nextTick(() => {
        this.$refs[formName].resetFields();
      });
    },
    // 分页bug
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      var patient = {
        patientId: this.$refs.patientChoseChild.patientId
      };
      this.getList(patient);
    },
    currentChange(val) {
      this.page.currentPage = val;
      var patient = {
        patientId: this.$refs.patientChoseChild.patientId
      };
      this.getList(patient);
    },

    handleCreate(row, index, done, loading) {
      putObj(row.nurseId)
        .then(data => {
          this.$refs.crud.rowView(data.data.data, index);
          done();
        })
        .catch(() => {});
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
          this.getList();
        })
        .catch(() => {
          loading();
        });
    },

    getList(params) {
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
    rowAdd() {
      this.patientNames = this.$refs.patientChoseChild.patientLists;
      this.dialogFormVisible = true;
      this.project = [];
      getProjectType(2).then(res => {
        res.data.data.forEach(i => {
          this.project.push({
            projectName: i.projectName,
            projectId: i.projectId
          });
        });
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
    handleUpdate: function(row, index, done, loading) {
      putObj(row.nurseId)
        .then(data => {
          this.$refs.crud.rowEdit(data.data.data, index);
          done();
        })
        .catch(() => {});
    },
    /**
     * 搜索回调
     */
    searchChange(form) {
      if (this.value2) {
        form.startTime = dateFormat(this.value2[0]);
        form.endTime = dateFormat(this.value2[1]);
      }
      this.searchForm = form;
      this.page = {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      };
      var patient = {
        patientId: this.$refs.patientChoseChild.patientId
      };
      this.getList(patient);
    },
    /**
     * 刷新回调
     */
    refreshChange() {
      this.getList();
    },
    searchReset() {
      this.value2 = "";
      this.page = {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      };
      this.searchForm = {};
      this.$refs.patientChoseChild.patientReset();
      this.getList();
    },
    // 出入量请求
    projectTypeBtn(val) {
      this.project = [];
      this.form.projectId = "";
      getProjectType(val).then(res => {
        res.data.data.forEach(i => {
          this.project.push({
            projectName: i.projectName,
            projectId: i.projectId
          });
        });
      });
      this.$forceUpdate();
    },
    close(form) {
      this.projectType = 2;
      this.dialogFormVisible = false;
      this.sureLoading = false;
      this.form = {
        patientId: "",
        projectId: "",
        intakeOutputType: "",
        intakeOutputValue: "",
        valueDescription: "",
        createdTime: ""
      };
      // this.form.projectId = "";
      // this.form.intakeOutputType = "";
      // this.form.intakeOutputValue = "";
      // this.form.valueDescription = "";
      // this.$refs[form].resetFields();
    },
    sure(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.sureLoading = true;
          // console.log(this.form);
          if (this.projectType == 2) {
            this.form.intakeOutputType = 0;
          } else if (this.projectType == 3) {
            this.form.intakeOutputType = 1;
          }
          if (!this.form.valueDescription) {
            this.project.forEach(i => {
              if (i.projectId == this.form.projectId) {
                this.form.valueDescription =
                  i.projectName + ":" + this.form.intakeOutputValue;
              }
            });
          }

          this.form.createdTime = dateFormat(this.form.createdTime);
          addProjectType(this.form).then(res => {
            this.$message({
              showClose: true,
              message: "添加成功",
              type: "success"
            });
            this.sureLoading = false;
            var patient = {
              patientId: this.$refs.patientChoseChild.patientId
            };
            this.getList(patient);
            this.close();
          });
          // this.close();
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
