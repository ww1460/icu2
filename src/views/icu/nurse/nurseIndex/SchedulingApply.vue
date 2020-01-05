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
  <!-- 排班申请 -->
  <div class="execution">
    <div v-if="roleCodes == 'ROLE_NURSE'">
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :table-loading="tableLoading"
        :option="tableOption"
        :permission="permissionList"
        @on-load="getList"
        @refresh-change="refreshChange"
        @row-save="handleSave"
        @row-del="handleDelete"
        :cell-style="cellStyle"
        @search-change="searchChange"
        @size-change="sizeChange"
        @current-change="currentChange"
        @search-reset="clearform"
      >
        <template slot="searchMenu">
          <el-button type="primary" icon="el-icon-plus" @click="RowAdd" size="small">新增</el-button>
        </template>
      </avue-crud>

      <el-dialog @close="clearFrom('form')" title="新增" :visible.sync="dialogFormVisible">
        <el-form :rules="rules" ref="form" :model="form">
          <el-row>
            <el-col
              class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            >
              <el-form-item label="类型" :label-width="formLabelWidth">
                <el-button @click="changeApplyType(1)" :type="form.applyType == 1?'primary':''">排班申请</el-button>
                <el-button @click="changeApplyType(0)" :type="form.applyType == 0?'primary':''">调班申请</el-button>
              </el-form-item>
            </el-col>
            <el-col
              class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            >
              <el-form-item
                prop="applyType"
                label="班次日期"
                :label-width="formLabelWidth"
              >
                <el-date-picker
                  v-model="form.dateTime"
                  align="right"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :picker-options="pickerOptions1"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.applyType != 1">
            <el-col
              class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            >
              <el-form-item prop="changeNurseId" label="调班护士" :label-width="formLabelWidth">
                <el-select
                  :disabled="form.applyType == 1"
                  style="width:80%"
                  v-model="form.changeNurseId"
                  placeholder="请选择调班护士"
                >
                  <el-option
                    v-for="item in nurseList"
                    :key="item.id"
                    :value="item.nurseId"
                    :label="item.realName"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col
              class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            >
              <el-form-item prop="originalShift" label="原始班次" :label-width="formLabelWidth">
                <el-select
                  :disabled="form.applyType == 1"
                  style="width:80%"
                  v-model="form.originalShift"
                  placeholder="请选择原始班次"
                >
                  <el-option
                    v-for="item in ShiftList"
                    :key="item.id"
                    :value="item.value"
                    :label="item.label"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col
              class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            >
              <el-form-item prop="hopeShift" label="意愿班次" :label-width="formLabelWidth">
                <el-select style="width:80%" v-model="form.hopeShift" placeholder="请选择意愿班次">
                  <el-option
                    v-for="item in ShiftList"
                    :key="item.id"
                    :value="item.value"
                    :label="item.label"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item prop="applyReason" label="申请理由" :label-width="formLabelWidth">
                <el-input v-model="form.applyReason" placeholder="请输入申请理由" type="textarea"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" :loading="FormLoading" @click="SubApply('form')">保 存</el-button>
          <el-button @click="resetForm('form')">取 消</el-button>
        </div>
      </el-dialog>
    </div>
    <div v-if="roleCodes == 'ROLE_MATRON'">
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :table-loading="tableLoading"
        :option="tableOption1"
        :permission="permissionList"
        @on-load="getList"
        @refresh-change="refreshChange"
        @row-save="handleSave"
        @row-del="handleDelete"
        :cell-style="cellStyle1"
        @search-change="searchChange"
        @size-change="sizeChange"
        @current-change="currentChange"
        @search-reset="clearform"
      >
        <template slot-scope="scope" slot="menu">
          <el-button
            v-if="scope.row.approvalFlag == 2"
            type="text"
            icon="el-icon-check"
            size="small"
            @click="handleUpdate(scope.row,scope.index,0)"
          >同意</el-button>
          <el-button
            v-if="scope.row.approvalFlag == 2"
            type="text"
            icon="el-icon-close"
            size="small"
            @click="handleUpdate(scope.row,scope.index,1)"
          >拒绝</el-button>
          <el-button
            type="text"
            icon="el-icon-edit"
            size="small"
            @click="handleUpdate(scope.row,scope.index,3)"
          >意见</el-button>
        </template>
      </avue-crud>
      <el-dialog @close="clearFrom('ruleForm')" title="意见" :visible.sync="dialogFormVisible1">
        <el-form :model="ruleForm" :rules="rules1" ref="ruleForm">
          <el-form-item label="意见" prop="approvalOpinion" :label-width="formLabelWidth">
            <el-input type="textarea" v-model="ruleForm.approvalOpinion" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button
            type="primary"
            :loading="SubyruleFormFlag"
            @click="SubyruleForm('ruleForm')"
          >保 存</el-button>
          <el-button @click="ruleForm1('ruleForm')">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  addObj,
  // delObj,
  fetchList,
  putObj
} from "@/api/icu/nurse/SchedulingApply";
import { getShift } from "@/api/icu/matron/Schedulingshow/Schedulingshow";
import { getMatronInfo } from "@/api/icu/matron/matronInfo/matronInfo";
import { getNurseInfo } from "@/api/icu/matron/scheduling/scheduling";
import {
  tableOption,
  tableOption1
} from "@/const/crud/icu/nurse/SchedulingApply";
import { mapGetters, mapState } from "vuex";

export default {
  name: "SchedulingApply",
  data() {
    return {
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      tableLoading: false,
      dialogFormVisible1: false,
      tableOption: tableOption,
      tableOption1: tableOption1,
      formLabelWidth: "80px",
      dialogFormVisible: false,
      SubyruleFormFlag: false,
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      form: {
        applyType: 1,
        dateTime: "",
        hopeShift: "",
        applyReason: "",
        originalShift: "",
        applyReason: "",
        initiatorNurseName: "",
        initiatorNurseId: "",
        changeNurseId: "",
        changeNurseName: ""
      },
      ShiftList: [],
      nurseInfo: [],
      nurseList: [],
      TypeFlag: 1,
      rules: {
        dateTime: [
          { required: true, message: "请选择排班日期", trigger: "change" }
        ],
        changeNurseId: [
          { required: true, message: "请选择调班护士", trigger: "change" }
        ],
        originalShift: [
          {
            required: true,
            message: "请选择原始班次",
            trigger: "change"
          }
        ],
        hopeShift: [
          {
            required: true,
            message: "请选择意愿班次",
            trigger: "change"
          }
        ],
        applyReason: [
          {
            required: true,
            message: "请输入申请理由",
            trigger: "blur"
          }
        ]
      },
      FormLoading: false,
      ruleForm: {
        approvalOpinion: ""
      },
      itemRow: {},
      rules1: {
        approvalOpinion: [
          { required: true, message: "请输入意见", trigger: "blur" }
        ]
      }
    };
  },
  created() {},
  mounted: function() {},
  computed: {
    ...mapGetters(["permissions"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permissions.sys_client_add, false),
        delBtn: this.vaildData(this.permissions.sys_client_del, false),
        editBtn: this.vaildData(this.permissions.sys_client_edit, false)
      };
    },
    ...mapState({
      roleCodes: state => state.user.roleCodes
    })
  },
  methods: {
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.getList();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.getList();
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 8) {
        if (row.approvalFlag == 1) {
          return {
            color: "#F56C6C"
          };
        } else if (row.approvalFlag == 2) {
          return {
            color: "#E6A23C"
          };
        } else if (row.approvalFlag == 0) {
          return {
            color: "#67C23A"
          };
        }
      }
    },
    cellStyle1({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 9) {
        if (row.approvalFlag == 1) {
          return {
            color: "#F56C6C"
          };
        } else if (row.approvalFlag == 2) {
          return {
            color: "#E6A23C"
          };
        } else if (row.approvalFlag == 0) {
          return {
            color: "#67C23A"
          };
        }
      }
    },
    clearFrom(formName) {
      this.$refs[formName].resetFields();
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogFormVisible = false;
    },
    //提交新增
    SubApply(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.FormLoading = true;
          for (var i in this.nurseList) {
            if (this.nurseList[i].nurseId == this.form.changeNurseId) {
              this.form.changeNurseName = this.nurseList[i].realName;
            }
          }
          this.form.initiatorNurseId = this.nurseInfo.nurseId;
          this.form.initiatorNurseName = this.nurseInfo.realName;

          addObj(this.form)
            .then(res => {
              this.$message({
                showClose: true,
                message: "添加成功",
                type: "success"
              });
              this.dialogFormVisible = false;
              this.FormLoading = false;
              this.getList(this.page);
            })
            .catch(err => {
              this.FormLoading = false;
            });
        } else {
          return false;
        }
      });
    },
    //修改类型
    changeApplyType(flag) {
      this.form.applyType = flag;
      this.TypeFlag = flag;
      if (this.form.applyType == 1) {
        this.form.originalShift = "";
        this.form.changeNurseId = "";
      }
    },
    //初始化查询
    getDate() {
      getShift().then(res => {
        this.ShiftList = res.data.data;
      });
      getMatronInfo().then(res => {
        this.nurseInfo = res.data.data;
      });
      getNurseInfo().then(res => {
        this.nurseList = res.data.data;
      });
    },
    //点击新增
    RowAdd() {
      this.getDate();
      this.dialogFormVisible = true;
    },
    getList(page, params) {
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
        this.tableLoading = false;
        this.tableData = response.data.data.records;
        this.page.total = response.data.data.total;
        this.tableLoading = false;
      });
    },
    handleDelete: function(row, index) {
      var _this = this;
      this.$confirm("是否确认删除ID为" + row.clientId, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return delObj(row.clientId);
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
    SubyruleForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.SubyruleFormFlag = true;
          let params = {
            id: this.itemRow.id,
            approvalOpinion: this.ruleForm.approvalOpinion
          };
          putObj(params).then(() => {
            this.$message({
              showClose: true,
              message: "成功",
              type: "success"
            });
          });
          this.dialogFormVisible1 = false;
          this.SubyruleFormFlag = false;
          this.getList(this.page);
        } else {
          this.SubyruleFormFlag = false;
          return false;
        }
      });
    },
    ruleForm1(formName) {
      this.dialogFormVisible1 = false;
      this.$refs[formName].resetFields();
    },
    handleUpdate: function(row, index, flag) {
      if (flag == 0) {
        this.$confirm(
          "是否同意" + row.initiatorNurseName + "的排班申请",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            let params = {
              id: row.id,
              approvalFlag: 0
            };
            putObj(params).then(() => {
              this.$message({
                showClose: true,
                message: "同意成功",
                type: "success"
              });
            });
            this.getList(this.page);
          })
          .catch(function() {});
      } else if (flag == 1) {
        this.$confirm(
          "是否拒绝" + row.initiatorNurseName + "的排班申请",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            let params = {
              id: row.id,
              approvalFlag: 1
            };
            putObj(params).then(() => {
              this.$message({
                showClose: true,
                message: "拒绝成功",
                type: "success"
              });
            });
            this.getList(this.page);
          })
          .catch(function() {});
      } else if (flag == 3) {
        this.itemRow = row;
        this.ruleForm.approvalOpinion = "";
        this.dialogFormVisible1 = true;
        this.ruleForm.approvalOpinion = row.approvalOpinion;
      }
    },
    //清空回调
    clearform() {
      this.page = {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      };
      this.searchForm = {};
      this.getList(this.page);
    },
    searchChange(form) {
      this.page = {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      };
      this.searchForm = form;
      this.getList(this.page, form);
    },
    handleSave: function(row, done) {
      addObj(row).then(() => {
        this.tableData.push(Object.assign({}, row));
        this.$message({
          showClose: true,
          message: "添加成功",
          type: "success"
        });
        this.refreshChange();
        done();
      });
    },
    refreshChange() {
      this.getList(this.page);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

