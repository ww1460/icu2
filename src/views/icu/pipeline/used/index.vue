<template>
  <!-- 管道使用记录 -->
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
        @row-save="handleSave"
        @search-change="searchChange"
        @size-change="sizeChange"
        @current-change="currentChange"
        @row-del="rowDel"
        @search-reset="handleSearchReset"
      >
        <template slot="search">
          <el-form-item>
            <!-- <el-select
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
            </el-select> -->
            <!-- <el-select
              size="small"
              clearable
              v-model="searchForm.patientId"
              placeholder="请选择患者"
              @change="chosePatient"
            >
              <el-option
                v-for="item in searchOptions"
                :key="item.value"
                :label="item.name + item.bedName"
                :value="item.patientId"
              ></el-option>
            </el-select> -->
            <patientChose :getList="getList" ref="patientChoseChild" :page="page" />
          </el-form-item>
        </template>
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
import { delObj, fetchList, putObj } from "@/api/icu/pipeline/used";
import { tableOption } from "@/const/crud/icu/pipeline/used";
import { mapGetters, mapState } from "vuex";
import patientChose from "@/views/icu/index/patientChose";

export default {
  name: "Dict",
  components: {
      patientChose
   },
  data() {
    return {
      // 搜索
      searchOptions: [],
      searchForm: {},
      vIfNurse: "",
      vIfMatron: "",

      form: {
        type: undefined,
        dictId: undefined
      },
      dictType: undefined,
      dictId: undefined,
      dialogFormVisible: false,
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption
    };
  },
  mounted: function() {},
  computed: {
    // 权限
    ...mapGetters(["permissions", "nurse_patients", "dep_patients"]),
    ...mapState({
      roleCodes: state => state.user.roleCodes
    }),
    permissionList() {
      return {
        delBtn: this.vaildData(this.permissions.icu_device_del, false),
        editBtn: this.vaildData(this.permissions.icu_device_edit, false)
      };
    }
  },
  created() {
   //  this.getNursePatients();
   //  this.getList()
  },
  methods: {
    // 修改分页BUG
    sizeChange(val) {
     this.page.pageSize = val;
         let params = {};
         if (this.$refs.patientChoseChild.patientId) {
            params = {
               patientId: this.$refs.patientChoseChild.patientId
            };
         }
         this.getList(params);
    },
    currentChange(val) {
      this.page.currentPage = val;
         let params = {};
         if (this.$refs.patientChoseChild.patientId) {
            params = {
               patientId: this.$refs.patientChoseChild.patientId
            };
         }
         this.getList(params);
    },
    // 拿到权限
    getNursePatients() {
      // if (this.roleCodes == "ROLE_MATRON") {
      //   this.vIfNurse = false;
      //   this.vIfMatron = true;
      //   this.$store.dispatch("getPatientsByDep").then(response => {
      //     this.searchOptions = this.dep_patients.patients;
      //   });
      // }
      // if (this.roleCodes == "ROLE_NURSE") {
      //   this.vIfNurse = true;
      //   this.vIfMatron = false;
      //   this.$store.dispatch("getPatientsByNurseId").then(response => {
      //     this.searchOptions = this.nurse_patients;
      //   });
      // }
      // this.$forceUpdate();
       let data = JSON.parse(sessionStorage.getItem("pigx-all_patients")).content;
       let patientInfo = JSON.parse(sessionStorage.getItem("pigx-patientMessage")).content
      this.searchOptions = data
      if (patientInfo.patientId) {
         this.searchForm.patientId = patientInfo.patientId;
      }else{
         this.searchForm ={}
      }
      this.getList()
    },
    // 分页查询
    getList(params) {
      this.tableLoading = true;
      // if (this.searchForm.solt != "") {
      //   if (this.vIfNurse == true) {
      //     for (const i in this.searchOptions) {
      //       if (this.searchForm.solt == this.searchOptions[i].patientName) {
      //         params = {
      //           patientId: this.searchOptions[i].patientId
      //         };
      //       }
      //     }
      //   } else {
      //     for (const i in this.searchOptions) {
      //       if (this.searchForm.solt == this.searchOptions[i].name) {
      //         params = {
      //           patientId: this.searchOptions[i].patientId
      //         };
      //       }
      //     }
      //   }
      // }
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
    // handleBeforeOpen(done) {
    //   this.form.type = this.dictType
    //   this.form.dictId = this.dictId
    //   done()
    // },
   //  chosePatient(val) {
   //       this.page.currentPage = 1;
   //       this.page.pageSize = 10;
   //       if (val) {
   //          this.searchOptions.forEach(item => {
   //             if (item.patientId == val) {
   //                this.$store.commit("SET_MESSAGE", item);
   //                Object.assign(this.searchForm, {
   //                   patientId: this.searchForm.patientId
   //                });
   //             }
   //          });
   //       }else{
   //          this.searchForm ={}
   //       }
   //       this.getList();
   //    },
    // 删除
    rowDel: function(row) {
      var _this = this;
      this.$confirm(
        '是否确认删除数据类型为"' + row.patientName + '"的数据项?',
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
    handleUpdate: function(row, index, done,loading) {
      if (row.startTime != "" || row.endTime != "") {
        if (row.startTime > row.endTime) {
          this.$message({
            message: "开始时间小于结束时间",
            type: 'warning'
          });
          row.endTime = "";
          loading()
          return;
        } else {
          this.tableLoading = true;
          putObj(row)
            .then(() => {
              this.$message({
                showClose: true,
                message: "修改成功",
                type: "success"
              });
              this.tableLoading = false;
              this.getList(this.page);
              done();
            })
            .catch(() => {
              this.tableLoading = false;
            });
        }
      } else {
        this.tableLoading = true;
        putObj(row)
          .then(() => {
            this.$message({
              showClose: true,
              message: "修改成功",
              type: "success"
            });
            this.tableLoading = false;
            this.getList(this.page);
            done();
          })
          .catch(() => {
            this.tableLoading = false;
          });
      }
    },
    // 添加
    handleSave: function(row, done) {
      this.tableLoading = true;
      addObj(row)
        .then(() => {
          this.$message({
            showClose: true,
            message: "添加成功",
            type: "success"
          });
          this.tableLoading = false;
          this.getList(this.page);
          done();
        })
        .catch(() => {
          this.tableLoading = false;
        });
    },
    // 清空
    handleSearchReset() {
      this.searchForm = {};
      this.page = {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      };
      this.$refs.patientChoseChild.patientReset();
      this.getList();
    },
    // 搜索
    searchChange(form) {
      // if (this.vIfNurse == true) {
      //   for (const i in this.searchOptions) {
      //     if (this.searchForm.solt == this.searchOptions[i].patientName) {
      //       var patient = {
      //         patientId: this.searchOptions[i].patientId
      //       };
      //     }
      //   }
      // } else {
      //   for (const i in this.searchOptions) {
      //     if (this.searchForm.solt == this.searchOptions[i].name) {
      //       var patient = {
      //         patientId: this.searchOptions[i].patientId
      //       };
      //     }
      //   }
      // }
      this.page = {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      };
      var patient = {
            patientId: this.$refs.patientChoseChild.patientId
         };
      this.getList(patient);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

