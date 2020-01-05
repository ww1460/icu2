
<template>
  <div class="execution">
    <basic-container>
      <avue-crud
        v-if="flag == true"
        ref="crud"
        :page="page"
        :data="tableData"
        :permission="permissionList"
        :table-loading="tableLoading"
        :option="tableOption"
        @search-change="searchChange"
        @refresh-change="refreshChange"
        @search-reset="empty"
        @size-change="sizeChange"
        @current-change="currentChange"
      >
        <template slot="search">
          <el-col :md="3" :xs="2" v-if="roleCodes == 'ROLE_MATRON'">
            <el-form-item>
              <el-select size="small" v-model="nurseId" placeholder="选择护士" clearable>
                <el-option
                  v-for="item in nursesList"
                  :label="item.realName"
                  :value="item.nurseId"
                  :key="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="3" :xs="2">
            <el-form-item>
              <patientChose :getList="getList" ref="patientChoseChild" :page="page" />
            </el-form-item>
          </el-col>
        </template>

        <template slot="searchMenu">
          <el-button type="primary" size="small" @click="cellComponent">护理</el-button>
        </template>
        <!-- 自定义编辑   -->
        <template slot="menu" scope="scope">
          <el-button type="text" icon="el-icon-edit" size="small" @click="editor(scope.row)">编辑</el-button>
          <el-button
            type="text"
            icon="el-icon-delete"
            size="small"
            @click="deleteRecord(scope.row,scope.index)"
          >删除</el-button>
        </template>
      </avue-crud>
      <templateComponent
        :patientId="patientId"
        :patientName="patientName"
        :updataState="updataState"
        ref="headerChild"
        v-else-if="flag == false"
        :templateType="2"
      ></templateComponent>
      <!-- 编辑弹框 -->
      <el-dialog title="护理记录编辑" :visible.sync="dialogFormVisibleDetails">
        <div class="diaTemplate">
          <div>
            <el-form :label-width="'120px'">
              <el-form-item
                v-for="item in templateDataList"
                :key="item.id"
                :label="item.projectName"
              >
                <el-input
                  v-model="item.projectSpecificRecord"
                  :placeholder="`请输入${item.projectName}`"
                ></el-input>
                <el-input
                  style="margin-top:5px"
                  v-model="item.remarks"
                  :placeholder="`请输入${item.projectName}描述`"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div>
            <el-input
              class="dialog-input-text"
              style="min-height:60px"
              type="textarea"
              v-model="templateStr"
            ></el-input>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="editSub">确 定</el-button>
          <el-button @click="dialogFormVisibleDetails = false">取 消</el-button>
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
  editorUpdate
} from "@/api/icu/matron/nursingRecord/nursingRecord";
import patientChose from "@/views/icu/index/patientChose";
import { getNursList } from "@/api/icu/matron/constraintsRecord/constraintsRecord";
import { tableOption } from "@/const/crud/icu/matron/nursingRecord/nursingRecord";
import { mapGetters, mapState } from "vuex";
import templateComponent from "../templateComponent";

export default {
  components: {
    templateComponent,
    patientChose
  },
  name: "nursingRecord",
  data() {
    return {
      searchForm: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption,
      flag: true,
      viewData: [],
      patientId: "",
      nurseId: "",
      patientList: [],
      nursesList: [],
      dialogFormVisibleDetails: false,
      templateDataList: [],
      templateStr: "",
      nursingProject: {},
      patientName: ""
    };
  },
  watch: {
    templateDataList: {
      handler: function(val, oldVal) {
        this.templateStr = "";
        if (val.length != 0) {
          for (var i in val) {
            if (val[i].projectSpecificRecord == null) {
              val[i].projectSpecificRecord = "";
            }
            if (val[i].remarks == null) {
              val[i].remarks = "";
            }
            this.templateStr += `${val[i].projectName}:${val[i].projectSpecificRecord},${val[i].remarks};`;
            this.nursingProject.recordContent = this.templateStr;
          }
        }
      },
      deep: true
    },
    templateStr(val) {
      this.templateStr = val;
      this.nursingProject.recordContent = this.templateStr;
    },
    dialogFormVisibleDetails(val) {
      if (val == false) {
        this.templateDataList = [];
        this.nursingProject = {};
        this.templateStr = "";
      }
    }
  },
  computed: {
    ...mapGetters(["permissions", "nurse_patients", "dep_patients"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permissions.icu_nurse_add, false),
        delBtn: this.vaildData(this.permissions.icu_nurse_del, false),
        editBtn: this.vaildData(this.permissions.icu_nurse_edit, false)
      };
    },
    ...mapState({
      roleCodes: state => state.user.roleCodes
    })
  },
  created() {
    this.getList();
    let data = JSON.parse(sessionStorage.getItem("pigx-all_patients")).content;
    this.patientList = data;

    if (this.roleCodes == "ROLE_MATRON") {
      getNursList().then(res => {
        this.nursesList = res.data.data;
      });
    }
  },
  methods: {
    // 分页bug
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.getList({ patientId: this.$refs.patientChoseChild.patientId });
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.getList({ patientId: this.$refs.patientChoseChild.patientId });
    },

    // 拿到选择的患者
    getpatientName(val) {
      if (this.patientList != undefined) {
        this.patientList.filter(item => {
          if (item.patientId == val) {
            this.patientName = item.name;
          }
        });
      }

      if (this.nurse_patients != undefined) {
        this.nurse_patients.filter(item => {
          if (item.patientId == val) {
            this.patientName = item.patientName;
          }
        });
      }
    },
    //清空
    empty() {
      this.nurseId = "";
      this.patientId = "";
      this.searchForm = "";
      this.page = {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      };
      this.$refs.patientChoseChild.patientReset();
      this.getList();
    },

    editSub() {
      var obj = {
        nursingProject: this.templateDataList,
        nursingRecord: this.nursingProject
      };
      editorUpdate(obj).then(res => {
        this.$message({
          showClose: true,
          message: "修改成功",
          type: "success"
        });
        this.templateStr = "";
        this.getList();
        this.dialogFormVisibleDetails = false;
      });
    },
    //点击编辑
    editor(row) {
      this.templateStr = "";
      UpdateObj(row.id).then(res => {
        //判读项目数组 为不为空
        if (res.data.data.nursingProject.length != 0) {
          this.nursingProject = res.data.data.nursingRecord;
          this.templateDataList = res.data.data.nursingProject;
          for (var i in this.templateDataList) {
            if (this.templateDataList[i].projectSpecificRecord == null) {
              this.templateDataList[i].projectSpecificRecord = "";
            }
            if (this.templateDataList[i].remarks == null) {
              this.templateDataList[i].remarks = "";
            }
            this.templateStr += `${this.templateDataList[i].projectName}:${this.templateDataList[i].projectSpecificRecord},${this.templateDataList[i].remarks};`;
          }
        } else {
          this.nursingProject = res.data.data.nursingRecord;
          this.templateStr = this.nursingProject.recordContent;
        }
      });
      this.dialogFormVisibleDetails = true;
    },
    changeComponent() {
      this.viewData = this.$refs.headerChild.viewData;
      this.flag = true;
    },
    //点击调用护理模板
    cellComponent() {
      this.patientId = this.$refs.patientChoseChild.patientId;
      this.patientName = this.$refs.patientChoseChild.patientInfo.name;
      if (this.patientId == "") {
        this.$message({
          message: "请选择完患者在调用模板",
          type: "warning"
        });
      } else {
        this.flag = false;
      }
    },
    updataState() {
      this.flag = true;
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
    deleteRecord: function(row, index) {
      index += 1;
      var _this = this;
      this.$confirm("是否确认删除这条护理记录吗？", "提示", {
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
    /**
     * @title 数据添加
     * @param row 为当前的数据
     * @param done 为表单关闭函数
     *
     **
    /**
     * 搜索回调
     */
    searchChange(form) {
      form.patientId = this.patientId;
      form.nurseId = this.nurseId;
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
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
