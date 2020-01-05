
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
        @on-load="getList"
        @sortable-change="sortableChange"
        @row-del="rowDel"
      >
        <template slot="menu" slot-scope="scope">
          <el-button
            type="text"
            icon="el-icon-document"
            size="small"
            @click="showBtn(scope.row)"
          >展示方式</el-button>
          <el-button
            type="text"
            icon="el-icon-delete"
            size="small"
            @click="rowDel(scope.row,scope.index)"
          >删除</el-button>
        </template>
        <template slot="menuLeft">
          <el-button type="primary" size="small" @click="PM">管理</el-button>
          <el-button :type="flag == 1 ?'primary':''" size="small" @click="nurseClick(1)">护理记录单一</el-button>
          <el-button :type="flag == 2 ?'primary':''" size="small" @click="nurseClick(2)">护理记录单二</el-button>
          <el-button :type="flag == 3 ?'primary':''" size="small" @click="nurseClick(3)">生命体征</el-button>
          <el-button
            style="position: absolute;right: -7px;"
            type="primary"
            size="small"
            @click="Subsort"
          >提交排序</el-button>
        </template>
      </avue-crud>

      <el-dialog title="展示方式" :visible.sync="dialogFormVisibleShow" :fullscreen="isFullscreen">
        <el-form>
          <el-row>
            <el-form-item>
              <template>
                <el-radio-group v-model="form.showWayFlag">
                  <el-radio :label="0">固定值编号</el-radio>
                  <el-radio :label="1">√</el-radio>
                  <el-radio :label="2">具体值</el-radio>
                  <el-radio :label="3">固定值内容</el-radio>
                </el-radio-group>
              </template>
            </el-form-item>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="alterShow">保 存</el-button>
          <el-button @click="dialogFormVisibleShow = false">取 消</el-button>
        </div>
      </el-dialog>

      <el-dialog :title="title" :visible.sync="dialogFormVisible" :fullscreen="isFullscreen">
        <el-collapse accordion>
          <el-collapse-item
            v-for="(item,index) in  projectList"
            :key="index"
            :name="index + 1"
            :title="item[0].projectType | projectType"
          >
            <el-button
              v-for="(i,index1) in item"
              :key="index1"
              :type="i.flag?'primary':''"
              @click="itemBtn(i,i.projectId)"
            >{{i.projectName}}</el-button>
          </el-collapse-item>
        </el-collapse>

        <div slot="footer" class="dialog-footer">
          <el-button type="primary" :loading="btnloding" @click="projectSave">保 存</el-button>
          <el-button @click="dialogFormVisible = false">取 消</el-button>
        </div>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
let that;
import {
  fetchList,
  getProject,
  addProject,
  getDict,
  updateShowDate,
  addSort,
  delObj
} from "@/api/icu/nursingRecord/nursingRecordManage";
import { tableOption } from "@/const/crud/icu/nursingRecord/nursingRecordManage";
import { mapGetters } from "vuex";

export default {
  name: "nursingRecordManage",
  data() {
    return {
      isFullscreen: false,
      screenWidth: document.body.clientWidth, // 屏幕尺寸
      title: "护理记录单一",
      searchForm: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        current: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption,
      flag: 1,
      dialogFormVisible: false,
      projectList: [],
      activeName: 1,
      managementList: [],
      btnloding: false,
      dictionary: [],
      dialogFormVisibleShow: false,
      form: {
        showWayFlag: "",
        id: ""
      },
      sortList: []
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
  beforeCreate: function() {
    that = this;
  },
  filters: {
    //通过渲染的数据  进行过滤
    projectType: data => {
      for (var i in that.dictionary) {
        if (that.dictionary[i].value == data) {
          return that.dictionary[i].label;
        }
      }
    }
  },
  watch: {
    flag(val) {
      if (val == 1) {
        this.title = "护理记录单一";
      } else if (val == 2) {
        this.title = "护理记录单二";
      } else if (val == 3) {
        this.title = "生命体征";
      }
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
  methods: {

    rowDel: function(row, index) {
      index += 1;
      var _this = this;
      this.$confirm("是否确认删除序号为" + index, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return delObj(row.correlationId);
        })
        .then(data => {
          this.getList(this.page);
          _this.$message({
            showClose: true,
            message: "删除成功",
            type: "success"
          });
        })
        .catch(function(err) {});
    },

    Subsort() {
      this.$confirm("是否提交排序?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          for (var i in this.sortList) {
            delete this.sortList[i].id;
            this.sortList[i].id = this.sortList[i].correlationId;
            this.sortList[i].nursingReportFlag = this.flag;
          }

          addSort(this.sortList).then(res => {
            this.$message({
              type: "success",
              message: "排序成功!"
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取排序"
          });
        });
    },

    sortableChange(oldindex, newindex, row, list) {
      this.data = [];
      this.$nextTick(() => {
        this.data = list;
      });
      this.sortList = list;
    },

    //展示方式 修改提交
    alterShow() {
      updateShowDate(this.form).then(res => {
        this.$message({
          showClose: true,
          message: "修改成功",
          type: "success"
        });
        this.getList();
        this.dialogFormVisibleShow = false;
      });
    },
    //展示方式
    showBtn(row) {
      this.form = {
        showWayFlag: row.showWayFlag,
        id: row.correlationId
      };
      this.dialogFormVisibleShow = true;
    },

    //点击保存
    projectSave() {
      console.log(this.flag);
      this.managementList = [];
      for (var i in this.projectList) {
        for (var j in this.projectList[i]) {
          if (this.projectList[i][j].flag == true) {
            this.projectList[i][j].nursingReportFlag = this.flag;
            delete this.projectList[i][j].id;
            this.managementList.push(this.projectList[i][j]);
          }
        }
      }

      this.btnloding = true;
      addProject(this.managementList).then(res => {
        if (res.data.code == 0) {
          this.$message({
            showClose: true,
            message: "添加成功",
            type: "success"
          });
        } else if (res.data.code == 2) {
          this.$message({
            showClose: true,
            message: "操作有误",
            type: "warning"
          });
        }
        this.btnloding = false;
        this.dialogFormVisible = false;
        this.getList();
      });
    },
    //点击每个按钮
    itemBtn(item, id) {
      for (var i in this.projectList) {
        for (var j in this.projectList[i]) {
          if (this.projectList[i][j].projectId == item.projectId) {
            if (!this.projectList[i][j].flag) {
              this.projectList[i][j].flag = true;
            } else {
              this.projectList[i][j].flag = false;
            }
          }
        }
      }

      this.$forceUpdate();
    },
    //点击管理
    PM() {
      this.dialogFormVisible = true;
      getProject().then(res => {
        this.projectList = res.data.data;

        for (var i in this.projectList) {
          for (var j in this.projectList[i]) {
            for (var k in this.tableData) {
              if (
                this.projectList[i][j].projectId == this.tableData[k].projectId
              ) {
                this.projectList[i][j].flag = true;
              }
            }
          }
        }
      });
    },
    //切换护理记录单
    nurseClick(flag) {
      this.flag = flag;
      this.projectList = [];
      this.managementList = [];
      this.getList();
    },

    //初始化查询
    getList() {
      this.tableLoading = true;
      fetchList(this.flag)
        .then(response => {
          this.tableData = response.data.data;
          this.page.total = response.data.data.total;
          this.tableLoading = false;
        })
        .catch(() => {
          this.tableLoading = false;
        });

      getDict().then(res => {
        this.dictionary = res.data.data;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.el-collapse-item__content {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  button {
    // width: 20%;
    margin: 1%;
  }
}
</style>
