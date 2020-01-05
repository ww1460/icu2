<template>
  <div>
    <basic-container v-if="!newPage">
      <div class="searchBox clearfix">
        <div>
          <el-select
            v-model="rangeValue"
            @change="searchChange"
            size="small"
            style="margin-right:10px"
            clearable
            placeholder="使用范围"
            class="selectBox"
          >
            <el-option
              v-for="item in rangeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="addBox">
          <el-button type="primary" icon="el-icon-search" size="small" @click="searchChange">搜索</el-button>
          <el-button icon="el-icon-delete" size="small" @click="clearSearch">清空</el-button>
          <el-button type="primary" size="small" icon="el-icon-plus" @click="openNewPage()">新增</el-button>
        </div>
      </div>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :table-loading="tableLoading"
        :option="tableOption"
        :permission="permissionList"
        @on-load="getList"
        @refresh-change="refreshChange"
      >
        <template slot-scope="scope" slot="menu">
          <el-button type="text" icon="el-icon-view" size="small" @click="temView(2,scope.row)">查看</el-button>
          <el-button type="text" icon="el-icon-edit" size="small" @click="temEdit(3,scope.row)">编辑</el-button>
          <el-button type="text" icon="el-icon-delete" size="small" @click="temDel(scope.row)">删除</el-button>
        </template>
      </avue-crud>
    </basic-container>
    <!-- 任务模板新增页面 -->
    <basic-container v-if="newPage" v-loading="viewSubLoading">
      <el-dialog :visible.sync="relevancyVis" :fullscreen="isFullscreen" @close="subAdvice()">
        <div>
          <el-button
            v-for="(i,index) in dictData.doctorsAdviceCodes"
            :key="index"
            :disabled="flag == 2"
            :type="i.flag?'primary':''"
            style="margin-top:10px;margin-left:10px"
            @click="addpro(2,i)"
          >{{i.doctorsAdviceContent}}</el-button>
        </div>

        <div slot="footer" class="dialog-footer">
          <el-button :disabled="flag == 2" type="primary" @click="subAdvice()">确 定</el-button>
          <el-button @click="relevancyVis = false">取 消</el-button>
        </div>
      </el-dialog>
      <div class="diaTemplate">
        <div>
          <el-form :model="formList" :rules="listRules" ref="formList" :label-width="'90px'">
            <el-button
              icon="el-icon-arrow-left"
              size="small"
              type="primary"
              @click="goback('formList')"
            >返回</el-button>

            <el-form-item prop="source" label="模板类型">
              <el-radio-group
                v-model="formList.source"
                @change="sourceChange"
                :disabled="flagPar == 2||flagPar == 3"
              >
                <el-radio :label="8">普通模板</el-radio>
                <el-radio :label="5">医嘱模板</el-radio>
                <el-radio v-if="showIf==2" :label="9">快捷模板</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item prop="purpose" label="使用范围" v-if="!adviceIf">
              <el-radio-group
                v-model="formList.purpose"
                :disabled="flagPar == 2||formList.source==9"
              >
                <el-radio :label="0">个人</el-radio>
                <el-radio :label="1">科室</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="医嘱关联" prop="templateDescribe" v-if="adviceIf">
              <el-input
                placeholder="请关联医嘱"
                v-model="formList.templateDescribe"
                :disabled="true"
                width="70%"
              >
                <template slot="append">
                  <el-button
                    :disabled="flagPar ==2"
                    @click="relevancyClick()"
                    style="background-color:#fff"
                  >关联</el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="templateContent" label="模板标题">
              <el-input
                :disabled="flagPar == 2||disa==true"
                v-model="formList.templateContent"
                placeholder="请输入模板标题"
                @clear="deleteInput"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="templateDescribe" label="模板描述">
              <el-input
                :disabled="flagPar == 2"
                v-model="formList.templateDescribe"
                placeholder="请输入模板描述"
                clearable
              ></el-input>
            </el-form-item>
            <div class="subTemplate">
              <el-button
                type="primary"
                :disabled="viewIf"
                :loading="temLoading"
                @click="saveTemplate('formList')"
              >保 存</el-button>
              <el-button @click="goback('formList')">返 回</el-button>
            </div>
          </el-form>
        </div>
        <div>
          <!--  子任务列表  -->
          <div>
            <el-button
              type="primary"
              size="small"
              icon="el-icon-plus"
              style="margin-left:5px"
              @click="rowAdd(1)"
              :disabled="flagPar ==2"
            >添加</el-button>
          </div>
          <avue-crud
            ref="subTaskCrud"
            :data="subTaskData"
            :table-loading="subTaskLoading"
            :option="subTaskOption"
            :permission="permissionList"
          >
            <template slot-scope="scope" slot="menu">
              <el-button
                type="text"
                icon="el-icon-view"
                size="small"
                @click="taskView(2,scope.row)"
              >查看</el-button>
              <el-button
                type="text"
                icon="el-icon-edit"
                size="small"
                :disabled="flagPar ==2"
                @click="taskEdit(3,scope.row)"
              >编辑</el-button>
              <el-button
                type="text"
                icon="el-icon-delete"
                size="small"
                :disabled="flagPar ==2"
                @click="taskDel(scope.row)"
              >删除</el-button>
            </template>
          </avue-crud>
        </div>
      </div>
    </basic-container>
    <el-dialog
      :title="flag == 1?'新增':flag == 3? '编辑': flag == 2?'查看':''"
      :visible.sync="dialogFormVisible"
      :fullscreen="isFullscreen"
      @close="closeDialog()"
    >
      <div class="diaTemplate">
        <div>
          <el-form :model="form" :rules="rules" ref="form" :label-width="'120px'">
            <el-form-item prop="taskContent" label="任务名称">
              <el-input
                :disabled="flag == 2||disaPro==true"
                v-model="form.taskContent"
                placeholder="请输入任务名称"
                @clear="deleteInput"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="taskDescribe" label="任务内容">
              <el-input
                :disabled="flag == 2"
                v-model="form.taskDescribe"
                placeholder="请输入任务内容"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="source" label="模板来源">
              <el-select
                v-model="form.source"
                :disabled="flag == 2"
                placeholder="请选择模板来源"
                style="width:100%"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="preStartTime" label="预开始时间">
              <el-time-picker
                :disabled="flag == 2"
                style="width:100%"
                v-model="form.preStartTime"
                @change="timeChange()"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择预开始时间"
              ></el-time-picker>
            </el-form-item>
            <el-form-item prop="preEndTime" label="预结束时间">
              <el-time-picker
                :disabled="flag == 2||timeIf"
                style="width:100%"
                v-model="form.preEndTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                @change="timeChange()"
                type="datetime"
                placeholder="选择预结束时间"
              ></el-time-picker>
            </el-form-item>
            <el-form-item prop="executionType" label="执行类型">
              <el-select
                v-model="form.executionType"
                :disabled="flag == 2"
                placeholder="请选择执行类型"
                style="width:100%"
              >
                <el-option
                  v-for="item in exeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="intervalTime" label="时间间隔">
              <el-input-number
                :disabled="flag == 2||timeIf"
                v-model="form.intervalTime"
                style="width:100%"
                :min="0"
                label="请选择时间间隔"
              ></el-input-number>
            </el-form-item>
          </el-form>
        </div>
        <div>
          <el-collapse accordion>
            <p>任务模板关联项目</p>
            <el-collapse-item title="关联项目" style="margin-bottom:40px" name="1">
              <el-button
                v-for="(i,index) in dictData.projectLsit"
                :key="index"
                :disabled="flag == 2"
                :type="i.flag?'primary':''"
                @click="addpro(1,i)"
              >{{i.projectName}}</el-button>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          :disabled="flag == 2"
          type="primary"
          :loading="temSubLoading"
          @click="taskSub('form')"
        >保 存</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
let that;
import {
  addObj,
  delObj,
  fetchList,
  putObj,
  getProject,
  getDict,
  viewObj,
  getTem,
  getSubTask,
  addSubTask,
  editSubTask,
  delSubTask,
  selectRepeat,
  addPreJump
} from "@/api/icu/matron/taskTemplate/taskTemplate";
import { tableOption, subTaskOption } from "@/const/crud/icu/matron/taskTemplate/taskTemplate";
import { mapGetters } from "vuex";

export default {
  name: "taskTemplate",
  data() {
    return {
      showIf: 2,
      flagPar: '',
      temLoading: false,
      temSubLoading: false,
      doctorsAdviceCodeId: '',
      isFullscreen: false,
      timeIf: true,
      screenWidth: document.body.clientWidth, // 屏幕尺寸
      searchForm: {},
      rangeValue: '',
      rangeOptions: [
        {
          label: '科室',
          value: 1,
        }, {
          label: '个人',
          value: 0
        }
      ],
      exeOptions: [
        {
          label: '提醒',
          value: 0,
        },
        {
          label: '执行',
          value: 1,
        }
      ],
      pickerOptions: {
        // 限制时间
        // selectableRange: ['22:00:00 - 23:59:59','00:00:00 - 02:00:00'],
        // 限制日期
        disabledDate: this.disabledDate
      },
      activeNames: ['1'],
      disaPro: false,
      viewIf: false,

      viewSubLoading: false,
      relevancyVis: false,
      adviceIf: false,
      newPage: false,
      options: [
        {
          label: '自定义',
          value: 3,
        },
        {
          label: '项目',
          value: 4,
        }],
      templateId: "",
      subTaskData: [],
      subTaskVis: false,
      subTaskLoading: false,
      subTaskOption: subTaskOption,
      disa: false,
      dictData: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption,
      dialogFormVisible: false,
      formList: {
        id: '',
        purpose: '',
        templateContent: "",
        templateDescribe: "",
        source: '',
        sourceId: "",
        templateSubTasks: [],
      },
      listRules: {
        templateType: [
          { required: true, message: "请选择模板类型", trigger: "change" }
        ],
        purpose: [
          { required: true, message: "请选择使用范围", trigger: "change" }
        ],
        templateContent: [
          { required: true, message: "请输入模板标题", trigger: "blur" }
        ],
        templateDescribe: [
          { required: true, message: "请输入模板描述", trigger: "blur" }
        ],
        source: [
          { required: true, message: "请选择模板来源", trigger: "change" }
        ]
      },
      form: {
        id: '',
        taskContent: "",
        taskDescribe: "",
        preStartTime: "",
        preEndTime: "",
        source: 3,
        sourceId: '',
        executionType: 1,
        intervalTime: 0,
        taskTemplateId: ''
      },
      projectData: [],
      dictionary: [],
      rules: {
        // preStartTime: [
        //   { required: true, message: '请选择预开始时间', trigger: 'change' }
        // ],
        // preEndTime: [
        //   { required: true, message: '请选择时间', trigger: 'change' }
        // ],
        taskContent: [
          { required: true, message: "请选择或输入任务名", trigger: "blur" }
        ],
        taskDescribe: [
          { required: true, message: "请输入任务内容", trigger: "blur" }
        ],
        source: [
          { required: true, message: "请选择任务来源", trigger: "change" }
        ],
        intervalTime: [
          { required: true, message: "请选择执行类型", trigger: "change" }
        ],
      },
      flag: ""
    };
  },
  watch: {
    dialogFormVisible(val) {
      if (val == false) {
        this.$refs['form'].resetFields()
        this.form = {
          id: '',
          taskContent: "",
          taskDescribe: "",
          preStartTime: "",
          preEndTime: "",
          source: 3,
          sourceId: '',
          executionType: 1,
          intervalTime: 0,
          taskTemplateId: ''
        }
      }
    },
    newPage(val) {
      if (val == false) {
        this.$refs['formList'].resetFields()
        this.adviceIf = false
        this.disa = false
        this.viewIf = false
        this.flagPar = ''
        this.doctorsAdviceCodeId = ""
        this.templateId = ""
        this.subTaskData = []
        this.formList = {
          id: '',
          purpose: '',
          templateContent: "",
          templateDescribe: "",
          source: '',
          sourceId: "",
          templateSubTasks: [],
        }
        this.options = [
          {
            label: '自定义',
            value: 3,
          },
          {
            label: '项目',
            value: 4,
          }]
        for (let i in this.dictData.doctorsAdviceCodes) {
          this.dictData.doctorsAdviceCodes[i].flag = false;
        }
        // console.log(this.formList)
      }
    }
  },
  beforeCreate: function () {
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
  created() {
    getTem().then(response => {
      this.dictData = response.data.data
      getProject().then(res => {
        this.dictData.projectLsit = res.data.data;
        // console.log(res.data.data)
        // console.log(this.dictData)
      });
      getDict(this.dictData.dictionaries).then(res => {
        this.dictionary = res.data.data;
        // console.log(this.dictionary)
      });
    })

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
  computed: {
    ...mapGetters(["permissions"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permissions.taskTemplate_add, false),
        delBtn: this.vaildData(this.permissions.taskTemplate_del, true),
        editBtn: this.vaildData(this.permissions.taskTemplate_edit, true)
      };
    }
  },
  methods: {
    disabledDate(time) {
      return time.getTime() < Date.now() - 8.64e7
    },
    //时间改变
    timeChange() {
      console.log(this.form.preStartTime)
      if (this.form.preStartTime != "" && this.form.preStartTime != null && this.form.preStartTime.substr(11, 19) == '00:00:00') {
        this.form.preStartTime = ''
      }
      if (this.form.preStartTime != "" && this.form.preStartTime != null && this.form.preEndTime.substr(11, 19) == '00:00:00') {
        this.form.preEndTime = ''
      }
      if (this.form.preStartTime == "" || this.form.preStartTime == null) {
        this.timeIf = true
      } else {
        this.timeIf = false
      }
      if (this.form.preStartTime > this.form.preEndTime && this.form.preEndTime != "" && this.form.preStartTime != "") {
        this.$message.warning('结束时间不能小于开始时间')
        this.form.preEndTime = ''
      }
      this.$forceUpdate()
    },
    saveTemplate(formName) {
      // console.log(this.formList)
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.temLoading = true
          if (this.formList.id == undefined || this.formList.id == null || this.formList.id == "") {
            if (this.formList.templateSubTasks.length < 1) {
              this.$message.warning('最少添加一条子任务')
              this.temLoading = false
              return
            }
            if (this.formList.source == 5) {
              for (let i in this.formList.templateSubTasks) {
                if (this.formList.templateSubTasks[i].source == 3 || this.formList.templateSubTasks[i].source == 11) {
                  this.formList.templateSubTasks[i].source = 7
                }
                if (this.formList.templateSubTasks[i].source == 4 || this.formList.templateSubTasks[i].source == 10) {
                  this.formList.templateSubTasks[i].source = 6
                }
              }
            }
            if (this.formList.source == 8) {
              for (let i in this.formList.templateSubTasks) {
                if (this.formList.templateSubTasks[i].source == 7 || this.formList.templateSubTasks[i].source == 11) {
                  this.formList.templateSubTasks[i].source = 3
                }
                if (this.formList.templateSubTasks[i].source == 6 || this.formList.templateSubTasks[i].source == 10) {
                  this.formList.templateSubTasks[i].source = 4
                }
              }
            }
            if (this.formList.source == 9) {
              for (let i in this.formList.templateSubTasks) {
                if (this.formList.templateSubTasks[i].source == 3 || this.formList.templateSubTasks[i].source == 7) {
                  this.formList.templateSubTasks[i].source = 11
                }
                if (this.formList.templateSubTasks[i].source == 4 || this.formList.templateSubTasks[i].source == 4) {
                  this.formList.templateSubTasks[i].source = 10
                }
              }
            }
            addObj(this.formList).then(response => {
              this.$message.success('任务模板添加成功')
              this.newPage = false
              this.$refs[formName].resetFields()
              this.adviceIf = false
              this.disa = false
              this.viewIf = false
              this.doctorsAdviceCodeId = ""
              this.templateId = ""
              this.subTaskData = []
              this.temLoading = false
              this.getList(this.page)
            })
          } else {
            if (this.formList.templateSubTasks.length < 1) {
              this.$message.warning('最少添加一条子任务')
              this.temLoading = false
              return
            }
            if (this.formList.source == 5) {
              for (let i in this.formList.templateSubTasks) {
                if (this.formList.templateSubTasks[i].source == 3) {
                  this.formList.templateSubTasks[i].source = 7
                }
                if (this.formList.templateSubTasks[i].source == 4) {
                  this.formList.templateSubTasks[i].source = 6
                }
              }
            }
            putObj(this.formList).then(response => {
              this.$message.success('任务模板修改成功')
              this.temLoading = false
              this.$refs[formName].resetFields()
              this.adviceIf = false
              this.disa = false
              this.viewIf = false
              this.doctorsAdviceCodeId = ""
              this.templateId = ""
              this.subTaskData = []
              this.newPage = false
              this.getList(this.page)
            })
          }

        } else {
          // this.$message({
          //   showClose: true,
          //   message: "请填完必填项",
          //   type: "warning"
          // });
          return false;
        }
      });
      this.$forceUpdate()
    },
    //来源改变
    sourceChange(val) {
      if (val == 5) {
        this.adviceIf = true
        this.formList.purpose = 1
        // this.form.source= 7
        this.formList.sourceId = ''
        this.formList.templateDescribe = ''
        this.formList.templateContent = "";
        this.options = [
          {
            label: '自定义',
            value: 7,
          },
          {
            label: '项目',
            value: 6,
          }]
      } else if (val == 9) {
        // this.form.source= 11
        this.formList.purpose = 1
        this.options = [
          {
            label: '自定义',
            value: 11,
          },
          {
            label: '项目',
            value: 10,
          }]
      } else {
        this.adviceIf = false
        this.disa = false
        this.formList.sourceId = ''
        //  this.form.source= 3
        this.formList.templateDescribe = ''
        this.formList.templateContent = "";
        this.options = [
          {
            label: '自定义',
            value: 3,
          },
          {
            label: '项目',
            value: 4,
          }]
      }
    },
    //关联按钮
    relevancyClick() {
      this.relevancyVis = true
    },
    openNewPage() {
      addPreJump().then(response => {
        this.showIf = response.data.data.source
        this.newPage = true
      })
    },
    //返回
    goback(formName) {
      // this.$refs[formName].resetFields()
      this.newPage = false
      // this.adviceIf = false
      // this.disa = false
      // this.viewIf = false
      // this.doctorsAdviceCodeId = ""
      // this.templateId = ""
      // this.subTaskData = []
      // this.formList = {
      //   id: '',
      //   purpose: '',
      //   templateContent: "",
      //   templateDescribe: "",
      //   source: '',
      //   sourceId: "",
      //   templateSubTasks: [],
      // }
    },
    subTaskClose() {
      this.subTaskData = []
      this.templateId = ""
      this.subTaskLoading = false
    },
    rowDel: function (row, index) {
      var _this = this
      this.$confirm('是否确认删除子任务' + row.taskContent, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        if (row.id == undefined) {
        } else {
          return delSubTask(row.id)
        }
      }).then(data => {
        _this.subTaskData.splice(index, 1)
        _this.$message({
          showClose: true,
          message: '删除成功',
          type: 'success'
        })
        this.subTaskLoading = true
        this.subtask(this.templateId)
      })
    },
    /**
       * @title 数据更新
       * @param row 为当前的数据
       * @param index 为当前更新数据的行数
       * @param done 为表单关闭函数
       *
       **/
    handleUpdate: function (row, index, done, loading) {
      editSubTask(row).then(data => {
        this.subTaskData.splice(index, 1, Object.assign({}, row))
        this.$message({
          showClose: true,
          message: '修改成功',
          type: 'success'
        })
        done()
        this.subTaskLoading = true
        this.subtask(this.templateId)
      }).catch(() => {
        loading()
      })
    },
    /**
       * @title 数据添加
       * @param row 为当前的数据
       * @param done 为表单关闭函数
       *
       **/
    handleSave: function (row, done, loading) {
      row.taskTemplateId = this.templateId
      addSubTask(row).then(data => {
        this.subTaskData.push(Object.assign({}, row))
        this.$message({
          showClose: true,
          message: '添加成功',
          type: 'success'
        })
        done()
        this.subTaskLoading = true
        this.subtask(this.templateId)
      }).catch(() => {
        loading()
      })
    },

    closeDialog() {
      // this.disa = false
      this.disaPro = false
      for (var i in this.dictData.projectLsit) {
        // for (var k in this.projectData[i]) {
        this.dictData.projectLsit[i].flag = false;
        // }
      }
      //  this.$forceUpdate();
    },
    //点击查看
    temView(flag, row) {
      this.flagPar = flag
      this.viewIf = true
      this.newPage = true
      this.subTaskLoading = true
      this.templateId = row.templateId

      if (row.source == 5) {
        this.adviceIf = true
        this.disa = true
        this.options = [
          {
            label: '自定义',
            value: 7,
          },
          {
            label: '项目',
            value: 6,
          }]
      }
      if (row.source == 9) {
        this.options = [
          {
            label: '自定义',
            value: 11,
          },
          {
            label: '项目',
            value: 10,
          }]
      }
      if (row.source == 5) {
        this.options = [
          {
            label: '自定义',
            value: 7,
          },
          {
            label: '项目',
            value: 6,
          }]
      } else if (row.source == 9) {
        this.options = [
          {
            label: '自定义',
            value: 11,
          },
          {
            label: '项目',
            value: 10,
          }]
      } else {
        this.options = [
          {
            label: '自定义',
            value: 3,
          },
          {
            label: '项目',
            value: 4,
          }]
      }
      this.$nextTick(function () {
        this.formList = JSON.parse(JSON.stringify(row))
      })

      getSubTask(row.templateId).then(response => {
        this.formList.templateSubTasks = response.data.data
        this.subTaskData = response.data.data
        this.subTaskLoading = false
      })
    },
    temEdit(flag, row) {
      this.flagPar = flag
      this.newPage = true
      this.subTaskLoading = true
      this.templateId = row.templateId
      if (row.source == 5) {
        this.adviceIf = true
        this.disa = true
      }
      if (row.source == 5) {
        this.options = [
          {
            label: '自定义',
            value: 7,
          },
          {
            label: '项目',
            value: 6,
          }]
      } else if (row.source == 9) {
        this.options = [
          {
            label: '自定义',
            value: 11,
          },
          {
            label: '项目',
            value: 10,
          }]
      } else {
        this.options = [
          {
            label: '自定义',
            value: 3,
          },
          {
            label: '项目',
            value: 4,
          }]
      }
      this.$nextTick(function () {
        this.formList = JSON.parse(JSON.stringify(row))
      })

      getSubTask(row.templateId).then(response => {
        this.formList.templateSubTasks = response.data.data
        this.subTaskData = response.data.data
        this.subTaskLoading = false
      })
      this.$forceUpdate()
    },
    taskView(flag, row) {
      this.flag = flag;
      this.$nextTick(function () {
        this.form = JSON.parse(JSON.stringify(row))
        console.log(row)
        console.log(this.form)
      })


      // viewObj(row.id).then(res => {
      //   this.form = res.data.data;
      // });
      this.dialogFormVisible = true;
    },
    //点击编辑
    taskEdit(flag, row) {
      this.flag = flag;
      // getDict(this.dictData.dictionaries).then(res => {
      //   this.dictionary = res.data.data;
      // });
      if (row.source == 4 || row.source == 6 || row.source == 10) {
        this.disaPro = true
      }
      this.$nextTick(function () {
        this.form = JSON.parse(JSON.stringify(row))
      })
      this.dialogFormVisible = true;
      this.$forceUpdate()
    },
    //标题清空按钮
    deleteInput() {
      for (var i in this.dictData.projectLsit) {
        // for (var k in this.projectData[i]) {
        this.this.dictData.projectLsit[i].flag = false;
        // }
      }
      this.$forceUpdate();
    },
    //点击提交
    taskSub(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.form.preStartTime != null && this.form.preStartTime != '') {
            if (this.form.preEndTime == null || this.form.preEndTime == '') {
              this.$message.warning('请选择预结束时间')
              return
            }
          }
          if (this.form.preEndTime != null && this.form.preEndTime != '') {
            if (this.form.preStartTime == null || this.form.preStartTime == '') {
              this.$message.warning('请选择预开始时间')
              return
            }
          }

          if (this.form.id == undefined || this.form.id == null || this.form.id == "") {
            // this.form.name = this.form.templateType
            this.form.taskTemplateId = this.templateId
            // this.subTaskData.push(this.form)
            if (this.formList.id == undefined || this.formList.id == null || this.formList.id == "") {
              this.formList.templateSubTasks.push(JSON.parse(JSON.stringify(this.form)))
              this.subTaskData.push(JSON.parse(JSON.stringify(this.form)))
              // console.log(this.subTaskData)
              this.$message({
                showClose: true,
                message: "子任务保存成功",
                type: "success"
              });
              this.dialogFormVisible = false;
            } else {
              if (this.formList.source == 5) {
                if (this.form.source == 3) {
                  this.form.source = 7
                }
                if (this.form.source == 4) {
                  this.form.source = 6
                }
              }
              if (this.formList.source == 9) {
                if (this.form.source == 3) {
                  this.form.source = 11
                }
                if (this.form.source == 4) {
                  this.form.source = 10
                }
              }
              this.temSubLoading = true
              addSubTask(this.form).then(() => {
                this.$message({
                  showClose: true,
                  message: "添加成功",
                  type: "success"
                });
                this.dialogFormVisible = false;
                this.subTaskLoading = true
                this.temSubLoading = false
                getSubTask(this.templateId).then(response => {
                  this.subTaskData = response.data.data
                  this.subTaskLoading = false
                })

              });
            }

          } else {
            // this.form.name = this.form.templateType
            if (this.formList.source == 5) {
              if (this.form.source == 3) {
                this.form.source = 7
              }
              if (this.form.source == 4) {
                this.form.source = 6
              }
            }
            if (this.formList.source == 9) {
              if (this.form.source == 3) {
                this.form.source = 11
              }
              if (this.form.source == 4) {
                this.form.source = 10
              }
            }
            this.temSubLoading = true
            editSubTask(this.form).then(() => {
              this.$message({
                showClose: true,
                message: "修改成功",
                type: "success"
              });
              this.dialogFormVisible = false;
              this.subTaskLoading = true
              this.temSubLoading = false
              getSubTask(this.templateId).then(response => {
                this.subTaskData = response.data.data
                this.subTaskLoading = false
              })

            });
          }
        } else {
          this.$message({
            showClose: true,
            message: "请填完必填项",
            type: "warning"
          });
          return false;
        }
      });
      this.$forceUpdate()
    },
    //点击按钮
    addpro(flag, row) {
      // console.log(this.options)
      if (flag == 1) {
        for (var i in this.dictData.projectLsit) {
          if (row.projectId == this.dictData.projectLsit[i].projectId) {
            if (row.flag == true) {
              row.flag = false;
              this.disaPro = false
              this.form.sourceId = ''
              this.form.taskDescribe = ''
              // this.form.source = ''
              this.form.taskContent = "";
              if (this.formList.source == 5) {
                this.form.source = 7
              } else if (this.formList.source == 8) {
                this.form.source = 3
              } else if (this.formList.source == 9) {
                this.form.source = 11
              } else {
                this.form.source = 3
              }
            } else {
              this.dictData.projectLsit[i].flag = true;
              this.disaPro = true
              this.form.sourceId = this.dictData.projectLsit[i].projectId
              this.form.taskDescribe = this.dictData.projectLsit[i].projectName;
              this.form.taskContent = this.dictData.projectLsit[i].projectName;

              if (this.formList.source == 5) {
                this.form.source = 6
              } else if (this.formList.source == 8) {
                this.form.source = 4
              } else if (this.formList.source == 9) {
                this.form.source = 10
              } else {
                this.form.source = 4
              }
            }
            // console.log(this.form)
          } else {
            this.dictData.projectLsit[i].flag = false;
          }
        }
      }
      if (flag == 2) {
        for (var i in this.dictData.doctorsAdviceCodes) {
          if (row.doctorsAdviceCodeId == this.dictData.doctorsAdviceCodes[i].doctorsAdviceCodeId) {
            if (row.flag == true) {
              row.flag = false;
              this.disa = false
              this.formList.sourceId = ''
              this.formList.templateDescribe = ''
              this.formList.templateContent = "";
            } else {
              // ( (i)=> {
              // selectRepeat(row.doctorsAdviceCodeId).then(response => {
              // if (response.data.data != null) {
              //   this.$message.warning('该医嘱已经创建任务模板,请勿重复创建')
              // } else {
              // console.log(i)
              // console.log(this.dictData.doctorsAdviceCodes[i].remarks)
              // console.log(this.dictData.doctorsAdviceCodes[i])
              this.dictData.doctorsAdviceCodes[i].flag = true;
              this.disa = true
              this.doctorsAdviceCodeId = this.dictData.doctorsAdviceCodes[i].doctorsAdviceCodeId
              this.formList.adviceName = this.dictData.doctorsAdviceCodes[i].shortName;
              this.formList.sourceId = this.dictData.doctorsAdviceCodes[i].doctorsAdviceCodeId
              this.formList.templateDescribe = this.dictData.doctorsAdviceCodes[i].doctorsAdviceContent;
              this.formList.templateContent = this.dictData.doctorsAdviceCodes[i].doctorsAdviceContent;
              // }
              //   })
              // })(i);

            }
          } else {
            this.dictData.doctorsAdviceCodes[i].flag = false;
          }
        }
      }

      this.$forceUpdate();
    },
    subAdvice() {
      if (this.doctorsAdviceCodeId == "" || this.doctorsAdviceCodeId == null) {
        return
      }
      selectRepeat(this.doctorsAdviceCodeId).then(response => {
        if (response.data.data != null) {
          this.$message.warning('该医嘱已经创建任务模板,请勿重复创建')
          for (var i in this.dictData.doctorsAdviceCodes) {
            this.dictData.doctorsAdviceCodes[i].flag = false;
            this.disa = false
            this.doctorsAdviceCodeId = ''
            this.formList.adviceName = ''
            this.formList.sourceId = ''
            this.formList.templateDescribe = ''
            this.formList.templateContent = "";
          }
          this.$forceUpdate()
          return
        } else {
          this.relevancyVis = false
        }
      })
    },
    addType(row) {
      for (var i in this.dictionary) {
        if (row.id == this.dictionary[i].id) {
          if (row.flag == true) {
            row.flag = false;
            //  this.disa= false
            // this.form.projectId = ''
            // this.form.templateType = "";
          } else {
            this.dictionary[i].flag = true;
            //  this.disa= true
            this.form.projectId = this.dictionary[i].value

            this.form.taskType = this.dictionary[i].label;
          }
        } else {
          this.dictionary[i].flag = false;
        }
        // }
      }
      this.$forceUpdate();
    },
    //点击新增
    rowAdd(flag) {
      this.flag = flag;
      if (this.form.preStartTime == "" || this.form.preStartTime == null) {
        this.timeIf = true
      } else {
        this.timeIf = false
      }
      if (this.formList.source == 5) {
        this.form.source = 7
      } else if (this.formList.source == 9) {
        this.form.source = 11
      } else {
        this.form.source = 3
      }
      getDict(this.dictData.dictionaries).then(res => {
        this.dictionary = res.data.data;
      });

      // if (this.templateId == "" || this.templateId == null) {
      //   this.$message.warning('请先保存任务模板')
      //   return
      // }
      // if (String(this.formList.source) == "" || this.formList.source == null) {
      //   this.$message.warning('请选择模板类型')
      //   return
      // }



      this.dialogFormVisible = true;
    },
    getList(page, params) {
      this.tableLoading = true;
      fetchList(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize
          },
          params
        )
      ).then(response => {
        this.tableData = response.data.data.records;
        this.page.total = response.data.data.total;
        this.tableLoading = false;
      });
    },
    taskDel(row) {
      this.$confirm("是否确认删除子任务" + row.taskContent, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delSubTask(row.id)
      }).then(() => {
        this.$message({
          showClose: true,
          message: "删除成功",
          type: "success"
        });
        this.subTaskLoading = false
        getSubTask(this.templateId).then(response => {
          this.subTaskData = response.data.data
          this.subTaskLoading = false
        })
      })
    },
    temDel(row, index) {
      this.$confirm("是否确认删除内容为" + row.templateContent, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function () {
          return delObj(row.id);
        })
        .then(() => {
          this.$message({
            showClose: true,
            message: "删除成功",
            type: "success"
          });
          this.refreshChange();
        })
        .catch(function () { });
    },
    refreshChange() {
      this.getList(this.page);
    },
    clearSearch() {
      this.rangeValue = ''
      this.searchChange()
    },
    searchChange() {
      this.searchForm.purpose = this.rangeValue
      this.getList(this.page, this.searchForm);
    }
  }
}
</script>

<style lang="scss" scoped>
.diaTemplate {
  display: flex;
  > div:first-child {
    width: 45%;
    margin-left: 2%;
    margin-right: 2%;
  }
  > div:last-child {
    margin-left: 1%;
    width: 55%;
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
.subTemplate {
  text-align: center;
  padding-top: 10px;
}
.clearfix:after {
  content: '';
  clear: both;
  display: block;
}
.searchBox {
  padding-left: 6px;
  margin-bottom: 10px;
}
.searchBox > div {
  float: left;
}
@media screen and (max-width: 1024px) {
  .searchBox {
    padding-left: 6px;
    width: 100%;
    margin-bottom: 10px;
  }
  .selectBox {
    width: 96%;
    margin-right: 10px;
  }
  .searchBox > div {
    float: none;
    width: 100%;
  }
  .addBox {
    margin-top: 10px;
  }
}
</style>

