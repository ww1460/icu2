<!--
  -    Copyright (c) 2018-2025, lengleng All rights reserved.
  -
  - Redistribution and use in source and binary forms, with or without
  - modification, are permitted provided that the following conditions are met:
  -
  - Redistributions of source code must retain the above copyright notice,
  - this list of conditions and the following disclaimer.
  - Redistributions in binary form must reproduce the above copyright
  - notice, this list of conditions and the following disclaimer in the
  - documentation and/or other materials provided with the distribution.
  - Neither the name of the pig4cloud.com developer nor the names of its
  - contributors may be used to endorse or promote products derived from
  - this software without specific prior written permission.
  - Author: lengleng (wangiegie@gmail.com)
  -->

<template>
  <div>
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :table-loading="tableLoading"
        :option="tableOption"
        :permission="permissionList"
        @search-change="searchChange"
        @refresh-change="refreshChange"
        @row-update="handleUpdate"
        @row-del="handleDelete"
        @size-change="sizeChange"
        @current-change="currentChange"
        @search-reset="clearform"
      >
        <template slot="search">
          <el-col :md="3" :xs="12">
            <el-form-item>
              <!-- <el-select size="small" v-model="patientId" clearable>
                <el-option
                  v-for="item in patientList"
                  :key="item.patientId"
                  :label="item.patientName"
                  :value="item.patientId"
                ></el-option>
                
              </el-select>-->
              <el-select
                v-model="patientId"
                placeholder="患者姓名"
                size="small"
                @change="chosePatient($event,true)"
                clearable
              >
                <el-option
                  v-for="item in patientList"
                  :key="item.id"
                  :label="item.patientName + ' ' +item.bedName"
                  :value="item.patientId"
                  style="width:100%"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </template>
        <!-- 添加 -->
        <template slot="searchMenu">
          <el-button type="primary" @click="addagolist" icon="el-icon-plus" size="small">新增</el-button>
        </template>
        <!-- @row-save="handleSave" -->
      </avue-crud>
      <el-dialog title="定时任务新增" @close="closeDilog('form')" :visible.sync="dialogFormVisible">
        <el-form :model="form" :label-width="'100px'" ref="form" :rules="rules">
          <el-row>
            <el-col
              class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            >
              <el-form-item label="患者姓名:" prop="patientId">
                <el-select style="width:100%" placeholder="患者姓名" v-model="form.patientId">
                  <el-option
                    v-for="item in patientList"
                    :key="item.id"
                    :label="item.patientName + item.bedName"
                    :value="item.patientId"
                  ></el-option>
                </el-select>
                <!-- <el-select
                           style="width:100%"
                           placeholder="患者姓名"
                           v-model="form.patientId"
                           v-if="roleCodes == 'ROLE_NURSE'"
                        >
                           <el-option
                              v-for="item in patientList"
                              :key="item.id"
                              :label="item.patientName + item.bedName"
                              :value="item.patientId"
                           ></el-option>
                </el-select>-->
              </el-form-item>
            </el-col>
            <el-col
              class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            >
              <el-form-item label="任务名称:" prop="sourceId">
                <el-select placeholder="请选择任务名称" v-model="form.sourceId" style="width:100%">
                  <el-option
                    v-for="item in Adddata"
                    :key="item.id"
                    :label="item.templateContent"
                    :value="item.templateId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col
              class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            >
              <el-form-item label="间隔时间:" prop="intervalTimes">
                <el-input placeholder="间隔时间/小时" v-model="form.intervalTimes"></el-input>
              </el-form-item>
            </el-col>
            <el-col
              class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            >
              <el-form-item label="预开始时间">
                <el-date-picker
                  @change="compareTime(1)"
                  v-model="form.preStartTime"
                  style="width:100%"
                  auto-complete="off"
                  type="datetime"
                  placeholder="请选择日期时间"
                  format="MM-dd HH:mm"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col
              class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            >
              <el-form-item label="预结束时间">
                <el-date-picker
                  @change="compareTime(2)"
                  v-model="form.preEndTime"
                  style="width:100%"
                  auto-complete="off"
                  type="datetime"
                  placeholder="请选择日期时间"
                  format="MM-dd HH:mm"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addTask('form')">保 存</el-button>
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
  addago,
  getTemplate
} from "@/api/icu/matron/taskManagement/taskManagement";
import { tableOption } from "@/const/crud/icu/matron/taskManagement/taskManagement";
import { mapGetters, mapState } from "vuex";

export default {
  name: "taskManagement",
  data() {
    return {
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      tableLoading: false,
      dialogFormVisible: false,
      tableOption: tableOption,
      Adddata: [],
      patientId: "",
      form: {
        sourceId: "",
        taskContent: "",
        intervalTimes: "",
        preStartTime: "",
        preEndTime: "",
        patientId: ""
      },
      patientList: [],
      rules: {
        patientId: [
          { required: true, message: "请选择患者", trigger: "change" }
        ],
        sourceId: [
          { required: true, message: "请选择任务名称", trigger: "change" }
        ],
        intervalTimes: [
          { required: true, message: "请输入间隔时间", trigger: "blur" }
        ]
      },
      patientNames: [],
      patientInfo: {}
    };
  },
  watch: {
    patientMessage: {
      handler(newValue, oldValue) {
        this.chosePatient(newValue.patientId, false);
      }
    }
  },
  created() {
    // let data = JSON.parse(sessionStorage.getItem("pigx-all_patients"))
    //    .content;
    // this.patientList = data;
    this.getNursePatients();
  },
  computed: {
    ...mapGetters([
      "permissions",
      "nurse_patients",
      "dep_patients",
      "patientMessage"
    ]),
    ...mapState({
      roleCodes: state => state.user.roleCodes
    }),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permissions.taskTemplate_add, true),
        delBtn: this.vaildData(this.permissions.taskTemplate_del, true),
        editBtn: this.vaildData(this.permissions.taskTemplate_edit, false)
      };
    }
  },
  methods: {
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;

      this.getList({ patientId: this.patientId });
    },
    currentChange(val) {
      this.page.currentPage = val;

      this.getList({ patientId: this.patientId });
    },
    closeDilog(formName) {
      this.$nextTick(() => {
        this.$refs[formName].resetFields();
        this.form.patientId = this.patientId;
      });
    },
    getNursePatients() {
      let data = JSON.parse(sessionStorage.getItem("pigx-all_patients"))
        .content;
      let data1 = JSON.parse(sessionStorage.getItem("pigx-patientMessage"))
        .content;
      this.patientList = data;
      this.patientId = data1.patientId;
      this.getList({ patientId: this.patientId });
    },
    chosePatient(val, flag) {
      // var parmars = {};
      // if (val) {
      //    this.patientList.forEach(item => {
      //       if (item.patientId == val) {
      //          this.$store.commit("SET_MESSAGE", item);
      //          this.patientId = item.patientId;
      //          this.form.patientId = item.patientId;
      //          parmars = { current:1,size:10,patientId: this.patientId };
      //       }
      //    });
      // } else {
      //    parmars = {};
      // }
      // this.getList(parmars);
      this.form.patientId = val;
      var parmars = {};
      if (flag) {
        if (val) {
          this.patientList.forEach(item => {
            if (item.patientId == val) {
              this.$store.commit("SET_MESSAGE", item);
            }
          });
        } else {
          parmars = {};
          this.getList(parmars);
        }
      } else {
        if (val) {
          this.patientList.forEach(item => {
            if (item.patientId == val) {
              this.patientId = val;
              parmars = {
                patientId: this.patientId
              };
            }
          });
        } else {
          parmars = {};
        }
        this.page.total = 0;
        this.page.currentPage = 1;
        this.page.pageSize = 10;
        this.getList(parmars);
      }
    },
    //关闭表单验证
    resetForm(formName) {
      this.$nextTick(() => {
        this.dialogFormVisible = false;
        this.$refs[formName].resetFields();
      });
    },

    compareTime(flag) {
      if (this.form.preStartTime != "" && this.form.preEndTime != "") {
        if (this.form.preStartTime > this.form.preEndTime) {
          this.$message({
            showClose: true,
            message: "开始时间晚于结束时间",
            type: "warning"
          });

          if (flag == 1) {
            this.form.preStartTime = "";
          } else {
            this.form.preEndTime = "";
          }
        }
      }
    },

    //点击 新增提交任务
    addTask(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          for (let i in this.Adddata) {
            if (this.form.sourceId == this.Adddata[i].templateId) {
              this.form.taskName = this.Adddata[i].templateContent;
              this.form.taskDescribe = this.Adddata[i].templateDescribe;
            }
          }
          this.form.taskType = 3;
          this.form.source = 8; // 来源于模板
          this.handleSave(this.form);
        } else {
          return false;
        }
      });
    },

    //点击自定义新增按钮
    addagolist() {
      this.dialogFormVisible = true;
      getTemplate().then(res => {
        this.Adddata = res.data.data;
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
          params
        )
      ).then(response => {
        this.tableData = response.data.data.records;
        this.page.total = response.data.data.total;
        this.tableLoading = false;
      });
    },
    handleDelete: function(row, index) {
      var _this = this;
      this.$confirm(
        "是否确认删除患者为" +
          row.patientName +
          "任务模板为" +
          row.templateName +
          "的长期任务",
        "提示",
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
          _this.tableData.splice(index, 1);
          _this.$message({
            showClose: true,
            message: "删除成功",
            type: "success"
          });
          this.refreshChange();
        })
        .catch(function() {});
    },
    handleUpdate: function(row, index, done) {
      putObj(row).then(() => {
        this.tableData.splice(index, 1, Object.assign({}, row));
        this.$message({
          showClose: true,
          message: "修改成功",
          type: "success"
        });
        this.refreshChange();
        done();
      });
    },
    handleSave: function(row) {
      addObj(row).then(() => {
        this.tableData.push(Object.assign({}, row));
        this.$message({
          showClose: true,
          message: "添加成功",
          type: "success"
        });
        this.refreshChange();
        // done();
        this.form = {
          templateId: "",
          templateDescribe: "",
          intervalTimes: "",
          preStartTime: "",
          preEndTime: "",
          patientId: "",
          sourceId: ""
        };
        this.dialogFormVisible = false;
      });
    },
    refreshChange() {
      let params = {};
      if (this.patientId) {
        params = { patientId: this.patientId };
      } else {
        params = { patientId: null };
      }
      this.getList(params);
    },
    searchChange(form) {
      this.page = {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      };
      form.patientId = this.patientId;
      this.getList(form);
    },

    clearform() {
      this.patientId = "";
      this.page = {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      };
      this.searchForm = {};
      this.getList();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

