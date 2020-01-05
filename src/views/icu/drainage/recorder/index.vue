
<template>
  <!-- 引流液记录表-->
  <div class="execution">
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :permission="permissionList"
        :table-loading="tableLoading"
        :option="tableOption"
        :cell-style="cellStyle"
        @row-update="handleUpdate"
        @search-change="searchChange"
        @search-reset="seatchReset"
        @row-del="rowDel"
        @size-change="sizeChange"
        @current-change="currentChange"
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
            </el-select>-->
            <patientChose :getList="getList" ref="patientChoseChild" :page="page" />
          </el-form-item>
        </template>
        <template slot-scope="scope" slot="searchMenu">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-plus"
            @click="receive(scope.row,scope.index)"
          >新 增</el-button>
        </template>
      </avue-crud>
      <index ref="child" @confirm="confirm"></index>
    </basic-container>
  </div>
</template>

<script>
import {
  addObj,
  delObj,
  fetchList,
  pipe,
  liquid,
  putObj
} from "@/api/icu/drainage/recorder";
import { tableOption } from "@/const/crud/icu/drainage/recorder";
import index from "@/views/icu/drainage/component/index";
import patientChose from "@/views/icu/index/patientChose";
import { mapGetters, mapState } from "vuex";

export default {
  name: "drainageType",
  components: {
    index,
    patientChose
  },
  data() {
    return {
      searchOptions: [],
      searchForm: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption,
      vIfNurse: "",
      vIfMatron: ""
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
        addBtn: this.vaildData(this.permissions.icu_drainage_add, false),
        delBtn: this.vaildData(this.permissions.icu_drainage_del, false),
        editBtn: this.vaildData(this.permissions.icu_drainage_edit, false)
      };
    }
  },
  created() {
    //  this.getNursePatients();
    //  this.getList();
  },
  methods: {
    // 修复分页BUG
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
    // 字体变色
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 6) {
        if (row.normal == 0) {
          return {
            color: " #00e9a0"
          };
        } else if (row.normal == 1) {
          return {
            color: " #ff7f5f "
          };
        }
      }
    },
    // 清空
    seatchReset() {
      this.searchForm = {};
      this.page = {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      };
      this.$refs.patientChoseChild.patientReset();
      this.getList();
    },
    // 拿到权限
    getNursePatients() {
      if (this.roleCodes == "ROLE_MATRON") {
        this.vIfNurse = false;
        this.vIfMatron = true;
        this.$store.dispatch("getPatientsByDep").then(response => {
          this.searchOptions = this.dep_patients.patients;
        });
      }
      if (this.roleCodes == "ROLE_NURSE") {
        this.vIfNurse = true;
        this.vIfMatron = false;
        this.$store.dispatch("getPatientsByNurseId").then(response => {
          this.searchOptions = this.nurse_patients;
        });
      }
      this.$forceUpdate();
    },
    // 分页查询
    getList(params) {
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
        '是否确认删除管路为"' + row.pipingName + '"的数据项?',
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
          _this.$message({
            showClose: true,
            message: "删除成功",
            type: "success"
          });
          if (this.$refs.patientChoseChild.patientId) {
            let params = {
              patientId: this.$refs.patientChoseChild.patientId
            };
          _this.getList(params);

          }
        })
        .catch(function() {});
    },
    // 修改
    handleUpdate(row, index, done) {
      putObj(row).then(() => {
        this.$message({
          showClose: true,
          message: "修改成功",
          type: "success"
        });
        if (this.$refs.patientChoseChild.patientId) {
          let params = {
            patientId: this.$refs.patientChoseChild.patientId
          };
          this.getList(params);
        }
        //   this.getList(params);
        done();
      });
    },
    // 新增
    receive() {
      this.$refs.child.recordAdd = true;
      this.$refs.child.postPipe();
    },

    // 弹出框确定
    confirm(row, done, loading) {
      if (this.$refs.child.pipingRow == "") {
        this.$message.error("请选择一个 管路/患者");
      } else {
        if (this.$refs.child.liquidData.piping == undefined) {
          this.$message.error("请选择一个 管路/患者");
        } else {
          if (this.$refs.child.measures == "") {
            this.$message.error("请至少选择一样属性详情");
          } else {
            if (this.$refs.child.form.value == "") {
              this.$message.error("请填写引流液值");
            } else {
              if (this.$refs.child.form.resource == "") {
                this.$message.error("请选择属性状态");
              } else {
                var piping = this.$refs.child.pipingRow.pipingId;
                var drainageId = this.$refs.child.liquidData.piping.drainageId;
                var nameType = this.$refs.child.nameType;
                if (this.$refs.child.form.measures == "") {
                  var measu = this.$refs.child.measuresType;
                } else {
                  var measu = this.$refs.child.form.measures;
                }
                var patientId = this.$refs.child.pipingRow.patientId;
                var form = this.$refs.child.form;
                addObj(piping, patientId, drainageId, nameType, measu, form)
                  .then(data => {
                    this.$message({
                      showClose: true,
                      message: "添加成功",
                      type: "success"
                    });
                    if (this.$refs.patientChoseChild.patientId) {
                      let params = {
                        patientId: this.$refs.patientChoseChild.patientId
                      };
                      this.getList(params);
                    }
                    this.tableData.push(Object.assign({}, row));
                    // this.getList(this.page);
                    done();
                  })
                  .catch(() => {
                    this.$refs.child.recordAdd = false;
                  });
              }
            }
          }
        }
      }
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
.devBtn {
  background: #409eff !important;
  color: #fff !important;
}
.liquidTypeDiv,
.AttributeDiv,
.itemsDiv,
.smell {
  border-bottom: 1px solid #cdcdcd;
  vertical-align: middle;
  text-align: center;
}
.liquidTypeDiv {
  display: inline-block;
  width: 100%;
  cursor: pointer;
}
// .liquidType {
//   width: 50%;
//   position: absolute;
//   right:0;
// }
.AttributeDiv {
  float: left;
  width: 51%;
  line-height: 161px;
}
.AttributeDiv:last-child
// .itemsDiv:last-child,
// #smell:last-child
 {
  border-bottom: 0;
}
.tableWidth {
  width: 99%;
  overflow-x: auto;
}
.table th {
  width: 115px;
  background-color: #fafafa;
}
th,
td {
  width: 130px;
  border: 1px solid #cdcdcd;
  vertical-align: middle;
  text-align: center;
  line-height: 45px;
  padding: 0px;
}
.color {
  background-color: #409eff;
  color: #fff;
}
.abnormal {
  color: rgb(172, 64, 64);
}
// 滚动条
.auto {
  height: 322px;
  overflow-y: auto;
}
.type {
  height: 322px;
  width: 200.5%;
  overflow-y: scroll;
  // position: relative;
}
.smell {
  height: 161px;
  overflow-y: auto;
  margin: 0;
}
// 滚动条样式

.type::-webkit-scrollbar-track-piece,
.smell::-webkit-scrollbar-track-piece,
textarea::-webkit-scrollbar-track-piece,
.auto::-webkit-scrollbar-track-piece {
  //滚动条凹槽的颜色，还可以设置边框属性
  background-color: #f8f8f8;
}
.type::-webkit-scrollbar,
.smell::-webkit-scrollbar,
textarea::-webkit-scrollbar,
.auto::-webkit-scrollbar {
  //滚动条的宽度
  width: 3px;
}
.type::-webkit-scrollbar-thumb,
.smell::-webkit-scrollbar-thumb,
textarea::-webkit-scrollbar-thumb,
.auto::-webkit-scrollbar-thumb {
  //滚动条的设置
  border-radius: 8px;
  background-color: #ccc;
  background-clip: padding-box;
}
.type::-webkit-scrollbar-thumb:hover,
.smell::-webkit-scrollbar-thumb:hover,
textarea::-webkit-scrollbar-thumb:hover,
.auto::-webkit-scrollbar-thumb:hover {
  background-color: #606266;
}
</style>

