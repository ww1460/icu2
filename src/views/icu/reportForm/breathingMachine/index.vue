
<template>
  <!-- 呼吸机辅助呼吸统计 -->
  <div class="execution">
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :permission="permissionList"
        :table-loading="tableLoading"
        :option="tableOption"
        @on-load="getList"
        @row-update="handleUpdate"
        @row-save="handleSave"
        @search-change="searchChange"
        @search-reset="handleSearchReset"
        @row-del="rowDel"
      >
        <template slot="search">
          <el-form-item>
            <el-select
              size="small"
              clearable
              v-model="searchForm.solt"
              placeholder="请选择患者"
              v-if="vIfNurse"
            >
              <el-option
                v-for="item in searchOptions"
                :key="item.patientId"
                :label="item.patientName"
                :value="item.patientName"
              ></el-option>
            </el-select>
            <el-select
              size="small"
              clearable
              v-model="searchForm.solt"
              placeholder="请选择患者"
              v-if="vIfMatron"
            >
              <el-option
                v-for="item in searchOptions"
                :key="item.value"
                :label="item.label"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
import {
  addObj,
  delObj,
  fetchList,
  putObj
} from "@/api/icu/reportForm/breathingMachine";
import { tableOption } from "@/const/crud/icu/reportForm/breathingMachine";
import { mapGetters, mapState } from "vuex";

export default {
  name: "Dict",
  data() {
    return {
      searchOptions: [],
      vIfNurse: "",
      vIfMatron: "",
      searchForm: {},
      dialogFormVisible: false,
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption,
      
    };
  },
  mounted: function() {},
  computed: {
    ...mapGetters(["permissions", "nurse_patients", "dep_patients"]),
    ...mapState({
      roleCodes: state => state.user.roleCodes
    }),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permissions.icu_pipeline_add, false),
        delBtn: this.vaildData(this.permissions.icu_pipeline_del, false),
        editBtn: this.vaildData(this.permissions.icu_pipeline_edit, false)
      };
    }
  },
  created() {
    this.getNursePatients();
  },
  methods: {
    handleSearchReset() {
      this.searchForm = {};
    },
    getNursePatients() {
      if (this.roleCodes == "ROLE_MATRON") {
        this.addBtn = false;
        this.vIfNurse = false;
        this.vIfMatron = true;
        this.$store.dispatch("getPatientsByDep").then(response => {
          this.searchOptions = this.dep_patients.patients;
        });
      }
      if (this.roleCodes == "ROLE_NURSE") {
        this.addBtn = true;
        this.vIfNurse = true;
        this.vIfMatron = false;
        this.$store.dispatch("getPatientsByNurseId").then(response => {
          this.searchOptions = this.nurse_patients;
        });
      }
      this.$forceUpdate();
    },
    getList(page, params) {
      this.tableLoading = true;
      if (this.searchForm.solt != "") {
        if (this.vIfNurse == true) {
          for (const i in this.searchOptions) {
            if (this.searchForm.solt == this.searchOptions[i].patientName) {
              params = {
                patientId: this.searchOptions[i].patientId
              };
            }
          }
        } else {
          for (const i in this.searchOptions) {
            if (this.searchForm.solt == this.searchOptions[i].name) {
              params = {
                patientId: this.searchOptions[i].patientId
              };
            }
          }
        }
      }
      fetchList(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize
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
    handleBeforeOpen(done) {
      this.form.type = this.dictType;
      this.form.dictId = this.dictId;
      done();
    },
    rowDel: function(row) {
      var _this = this;
      this.$confirm(
        '是否确认删除数据类型为"' + row.type + '"的数据项?',
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
    handleSave: function(row, done) {
      addObj(row).then(() => {
        this.$message({
          showClose: true,
          message: "添加成功",
          type: "success"
        });
        this.getList(this.page);
        done();
      });
    },
    searchChange(form) {
      if (this.vIfNurse == true) {
        for (const i in this.searchOptions) {
          if (this.searchForm.solt == this.searchOptions[i].patientName) {
            var patient = {
              patientId: this.searchOptions[i].patientId
            };
          }
        }
      } else {
        for (const i in this.searchOptions) {
          if (this.searchForm.solt == this.searchOptions[i].name) {
            var patient = {
              patientId: this.searchOptions[i].patientId
            };
          }
        }
      }
      this.getList(this.page, patient);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

