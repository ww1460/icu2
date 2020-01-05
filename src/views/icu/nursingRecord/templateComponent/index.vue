<template>
  <div>
    <avue-crud
      ref="crud"
      :page="page"
      :data="tableData"
      :permission="permissionList"
      :table-loading="tableLoading"
      :option="tableOption"
      @on-load="getList"
      @search-change="searchChange"
      @size-change="sizeChange"
      @current-change="currentChange"
      @search-reset="clearform"
    >
      <template slot="searchMenu">
        <el-button icon="el-icon-back" type="primary" size="small" @click="goBack">返回</el-button>
      </template>
      <template slot="menu" slot-scope="scope">
        <el-button
          v-if="roleCodes == 'ROLE_MATRON'"
          type="text"
          size="small"
          icon="el-icon-view"
          @click="templateDetails(scope.row, scope.index)"
        >调用模板</el-button>
        <el-button
          v-else-if="roleCodes == 'ROLE_NURSE'"
          type="text"
          size="small"
          icon="el-icon-view"
          :disabled="(scope.row.createUserId == userInfo.nurseId || scope.row.templateUseScope == 1 &&  scope.row.createUserId != userInfo.nurseId?false:true)"
          @click="templateDetails(scope.row, scope.index)"
        >调用模板</el-button>
      </template>
    </avue-crud>

    <!-- 详情弹框 -->
    <el-dialog
      :title="`${patientName} 调用模板`"
      :visible.sync="dialogFormVisibleDetails"
      :fullscreen="isFullscreen"
    >
      <div class="diaTemplate">
        <div class="form_div">
          <el-form :label-width="'80px'">
            <el-form-item label="模板标题">
              <el-input disabled v-model="viewDatafirst.templateTitle" placeholder="请输入模板标题"></el-input>
            </el-form-item>

            <el-form-item label="模板描述">
              <el-input disabled v-model="viewDatafirst.templateDescription" placeholder="请输入模板内容"></el-input>
            </el-form-item>

            <el-form-item
              v-if="item.isProjectFlag != 1"
              v-for="item in viewData"
              :key="item.id"
              :label="item.projectName"
            >
              <el-input
                v-model="item.projectSpecificRecord"
                :placeholder="`请输入${item.projectName}`"
                :disabled="item.projectRecordValueFlag == 0"
              >
                <el-popover
                  placement="right"
                  width="150"
                  trigger="click"
                  slot="append"
                  v-if="item.projectRecordValueFlag == 0"
                >
                  <div class="suggest_dialog">
                    <ul>
                      <li
                        v-for="i in suggestList"
                        :key="i.id"
                        @click="suggestClick(i,item)"
                        :class="i.flag?'suggestAct':''"
                      >{{i.recordValue}}</li>
                    </ul>
                  </div>
                  <el-button slot="reference" icon="el-icon-menu" @click="btnClick(item)"></el-button>
                </el-popover>
              </el-input>
              <div style="display:flex">
                <p
                  v-if="item.projectName.length < 5"
                  style=" width: 50px;position: absolute;left: -40px;"
                >描述</p>
                <el-input
                  style="margin-top:5px"
                  v-model="item.projectDescribe"
                  :placeholder="`请输入${item.projectName}描述`"
                ></el-input>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div>
          <el-input
            class="dialog-input-text"
            style="min-height:60px"
            v-model="contentStr"
            type="textarea"
          ></el-input>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changeComponent">确 定</el-button>
        <el-button @click="dialogFormVisibleDetails = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
//声明一个全局变量
import {
  addObj,
  delObj,
  fetchList,
  UpdateObj,
  getProject,
  getDict,
  getTemplateType,
  getViewData,
  getlist
} from "@/api/icu/matron/templateComponent/templateComponent";
import { tableOption } from "@/const/crud/icu/matron/templateComponent/templateComponent";
import { mapGetters, mapState } from "vuex";
import { fstat } from "fs";
import { getNurseInfo } from "@/api/admin/user";

export default {
  name: "templateComponent",
  data() {
    return {
      isFullscreen: false,
      screenWidth: document.body.clientWidth, // 屏幕尺寸
      dialogFormVisibleDetails: false,
      dialogFormVisible: false,
      searchForm: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption,
      project: [],
      heat: [],
      range: [],
      rangeFlag: "",
      projectData: [],
      dictionary: [],
      templateTitle: "",
      templateDescription: "",
      templateUseScope: "",
      viewData: [],
      viewDatafirst: {},
      contentStr: "",
      flag: "",
      nurseId: "",
      suggestList: [],
      showFlag: 1,
      userInfo: {}
    };
  },
  props: {
    patientId: String,
    patientName: String,
    templateType: Number,
    changecomponentFlag: {
      type: Function
    },
    updataState:{
      type:Function
    }
  },
  computed: {
    ...mapGetters(["permissions", "nurse_patients"]),
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
  created() {
    this.getInfo();
  },
  watch: {
    //监听录入框数据
    viewData: {
      handler: function(val, oldVal) {
        this.contentStr = "";
        for (var i in val) {
          if (val[i].projectDescribe == null) {
            val[i].projectDescribe = "";
          }
          if (val[i].projectSpecificRecord == null) {
            val[i].projectSpecificRecord = "";
          }

          if (val[i].projectDescribe == "") {
            this.contentStr += `${val[i].projectName}:${val[i].projectSpecificRecord};`;
          } else {
            this.contentStr += `${val[i].projectName}:${val[i].projectSpecificRecord},${val[i].projectDescribe};`;
          }
          if (val[i].isProjectFlag == 1) {
            this.contentStr = val[i].templateContent;
          }
        }
      },
      deep: true
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
  methods: {
    async getInfo() {
      try {
        let info = await getNurseInfo();
        if (info.data.data) {
          this.userInfo = info.data.data;
        }
      } catch (err) {
        console.log(err);
      }
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
    //返回
    goBack() {
      //调用父组件方法  让父组件自己去修改 状态

      if (this.templateType == 2) {
        this.updataState()
      } else if (this.templateType == 1 || this.templateType == 3) {
        this.changecomponentFlag();
      }
    },
    //建议点击  点击高亮 给输入框赋值  把点击标识传给后台
    suggestClick(item, project) {
      for (var i in this.suggestList) {
        if (
          item.projectRecordValueId == this.suggestList[i].projectRecordValueId
        ) {
          this.suggestList[i].flag = true;
          project.projectSpecificRecord = this.suggestList[i].recordValue;

          for (var k in this.viewData) {
            if (this.viewData[k].projectId == item.projectId) {
              this.viewData[k].projectValue = item.dataFlag;
            }
          }
        } else {
          this.suggestList[i].flag = false;
        }
      }
      this.$forceUpdate();
    },
    //有建议的点击
    btnClick(item) {
      this.suggestList = [];
      getlist(item.projectId).then(res => {
        this.suggestList = res.data.data;
      });
    },
    changeComponent() {
      if (this.templateType == 2) {
        for (var i in this.viewData) {
          this.viewData[i].remarks = this.viewData[i].projectDescribe;
          delete this.viewData[i].deptId;
          delete this.viewData[i].projectWarmFlag;
          delete this.viewData[i].templateIndex;
          delete this.viewData[i].templateCode;
          delete this.viewData[i].templateDescription;
          delete this.viewData[i].templateTitle;
          delete this.viewData[i].templateUseScope;
          delete this.viewData[i].projectDescribe;
        }
        addObj(
          this.patientId,
          this.contentStr,
          this.viewData,
          this.viewData[0].isProjectFlag
        ).then(res => {
          this.$message({
            showClose: true,
            message: "护理成功",
            type: "success"
          });
          this.$parent.changeComponent();
        });
      } else if (this.templateType == 1) {
        for (var i in this.viewData) {
          this.viewData[i].remarks = this.viewData[i].projectDescribe;
          delete this.viewData[i].deptId;
          delete this.viewData[i].projectWarmFlag;
          delete this.viewData[i].templateIndex;
          delete this.viewData[i].templateCode;
          delete this.viewData[i].templateDescription;
          delete this.viewData[i].templateTitle;
          delete this.viewData[i].templateUseScope;
          delete this.viewData[i].projectDescribe;
        }
        addObj(
          this.patientId,
          this.contentStr,
          this.viewData,
          this.viewData[0].isProjectFlag,
          this.showFlag
        ).then(res => {
          this.$message({
            showClose: true,
            message: "调用成功,请在护理记录单三查看",
            type: "success"
          });
          this.changecomponentFlag();
        });
      } else if (this.templateType == 3) {
        for (var i in this.viewData) {
          this.viewData[i].remarks = this.viewData[i].projectDescribe;
          delete this.viewData[i].deptId;
          delete this.viewData[i].projectWarmFlag;
          delete this.viewData[i].templateIndex;
          delete this.viewData[i].templateCode;
          delete this.viewData[i].templateDescription;
          delete this.viewData[i].templateTitle;
          delete this.viewData[i].templateUseScope;
          delete this.viewData[i].projectDescribe;
        }
        addObj(
          this.patientId,
          this.contentStr,
          this.viewData,
          this.viewData[0].isProjectFlag
        ).then(res => {
          this.$message({
            showClose: true,
            message: "护理成功,请在护理记录查看",
            type: "success"
          });
          this.changecomponentFlag();
        });
      }
    },
    //点击 调用
    templateDetails(row, index) {
      this.flag = true;
      this.contentStr = "";
      this.dialogFormVisibleDetails = true;
      //点击查看请求信息
      //   this.patientId = row.
      var obj = {
        patientId: this.patientId,
        templateCode: row.templateCode,
        isProjectFlag: row.isProjectFlag
      };
      getViewData(obj).then(res => {
        this.viewData = res.data.data;
        this.viewDatafirst = this.viewData[0];
        for (var i in this.viewData) {
          if (this.viewData[i].isProjectFlag == 1) {
            this.contentStr = this.viewData[i].templateContent;
          } else {
            if (this.viewData[i].projectDescribe == null) {
              this.viewData[i].projectDescribe = "";
            }
            if (this.viewData[i].projectSpecificRecord == null) {
              this.viewData[i].projectSpecificRecord = "";
            }

            if (this.viewData[i].projectDescribe == "") {
              this.contentStr += `${this.viewData[i].projectName}:${this.viewData[i].projectSpecificRecord};`;
            } else {
              this.contentStr += `${this.viewData[i].projectName}:${this.viewData[i].projectSpecificRecord},${this.viewData[i].projectDescribe};`;
            }
          }
        }
      });
      this.$forceUpdate();
    },

    // handleCreate(row, index, done, loading) {
    //   putObj(row.nurseId)
    //     .then(data => {
    //       this.$refs.crud.rowView(data.data.data, index);
    //       done();
    //     })
    //     .catch(() => {});
    // },

    getList(page, params) {
      this.searchForm.templateType = this.templateType;
      this.tableLoading = true;
      fetchList(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize
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
     **/

    /**
     *
     * 搜索回调
     */
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
    }
  }
};
</script>

<style lang="scss">
.diaTemplate {
  display: flex;
  > div:first-child {
    width: 45%;
    margin-left: 2%;
    margin-right: 2%;
  }
  > div:last-child {
    margin-left: 1%;
    width: 50%;
  }
  .el-collapse-item__content {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    button {
      // width: 20%;
      margin: 2%;
    }
  }
}
.dialog-input-text .el-textarea__inner {
  min-height: 180px !important;
}
.pitch {
  background: #409eff;
  color: #fff;
}
@media screen and (max-width: 1300px) {
  .diaTemplate {
    flex-direction: column;
    > div:first-child {
      width: 90%;
      margin-left: 2%;
      margin-right: 2%;
    }
    > div:last-child {
      width: 90%;
      margin-left: 2%;
      margin-right: 2%;
    }
  }
}
.suggest_dialog {
  ul {
    li {
      padding: 5px;
    }
  }
}
.suggestAct {
  background: #409eff;
  color: #fff;
  cursor: pointer;
}
</style>
