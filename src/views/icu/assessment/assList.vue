<template>
  <!-- 评估表管理 -->
  <basic-container>
    <template class="list_project" v-if="flag">
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="dialogFormVisible = true"
        size="small"
        style="margin-left:5px;margin-bottom:1%"
      >新增评估</el-button>
      <!-- 评估列表 -->
      <avue-crud
        :option="proListOption"
        :data="proListData"
        :page="page"
        :table-loading="proLoading"
        @size-change="sizeChange"
        @current-change="currentChange"
        @row-update="handleUpdate"
        @row-del="rowDel"
      >
        <template slot="menu" slot-scope="scope">
          <el-button
            :size="scope.size"
            :type="scope.type"
            icon="el-icon-view"
            @click="viewMore(scope.row)"
          >管理</el-button>
        </template>
      </avue-crud>
    </template>
    <!-- more -->
    <div v-if="!flag">
      <template class="more_project_ass">
        <el-button
          type="primary"
          icon="el-icon-back"
          @click="returnMore()"
          size="small"
          style="margin-left:5px;margin-bottom:1%"
        >返回</el-button>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="dialogAddType=true"
          size="small"
          style="margin-left:5px;margin-bottom:1%"
        >新增类型</el-button>
        <h3 class="title_project">{{title}}</h3>
        <avue-crud
          :option="tableOption"
          :data="dataArr"
          :table-loading="loading"
          style="margin-bottom:5%"
        >
          <template slot="menu" slot-scope="scope">
            <el-button
              icon="el-icon-plus"
              :size="scope.size"
              :type="scope.type"
              @click="addChild(scope.row)"
            >添加</el-button>
            <el-button
              icon="el-icon-edit"
              :size="scope.size"
              :type="scope.type"
              @click="updateRow(scope.row)"
            >编辑</el-button>
            <el-button
              icon="el-icon-delete"
              :size="scope.size"
              :type="scope.type"
              @click="delRow(scope.row)"
            >删除</el-button>
          </template>
        </avue-crud>
      </template>
    </div>

    <!-- 新增评估表 -->
    <el-dialog
      title="新增评估表"
      :visible.sync="dialogFormVisible"
      class="taks_edit"
      @close="closeDialog('form')"
    >
      <el-form :model="form" ref="form">
        <el-form-item
          label="评估名称"
          :label-width="formLabelWidth"
          prop="projectName"
          :rules="{
      required: true, message: '评估名称不能为空', trigger: 'blur'
    }"
        >
          <el-col :span="22">
            <el-input v-model="form.projectName" auto-complete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item
          label="评估简写"
          :label-width="formLabelWidth"
          prop="projectCode"
          :rules="{
      required: true, message: '评估简写不能为空', trigger: 'blur'
    }"
        >
          <el-col :span="22">
            <el-input v-model="form.projectCode" auto-complete="off"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="subLoading" @click="addAssform('form')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新增评估类型 -->
    <el-dialog
      title="新增评估类型"
      :visible.sync="dialogAddType"
      class="taks_edit"
      @close="closeDialog('addTypeForm')"
    >
      <el-form
        :model="addTypeForm"
        ref="addTypeForm"
        @keyup.enter.native="submitType('addTypeForm')"
      >
        <el-form-item
          label="评估类型"
          :label-width="formLabelWidth"
          prop="projectType"
          :rules="{
      required: true, message: '请输入评估类型', trigger: 'blur'
    }"
        >
          <el-col :span="22">
            <el-input v-model="addTypeForm.projectType" auto-complete="off" autofocus></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="设置范围" :label-width="formLabelWidth">
          <el-switch v-model="rangeSwitch"></el-switch>
        </el-form-item>
        <el-form-item label="范围" :label-width="formLabelWidth" v-if="rangeSwitch">
          <el-col :span="10">
            <el-form-item
              prop="scoreMin"
              :rules="[
      { type: 'number', message: '请输入数字'}
    ]"
            >
              <el-input v-model.number="addTypeForm.scoreMin" auto-complete="off" placeholder="最小值"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2" style="text-align:center">-</el-col>
          <el-col :span="10">
            <el-form-item
              prop="scoreMax"
              :rules="[
      { type: 'number', message: '请输入数字'}
    ]"
            >
              <el-input v-model.number="addTypeForm.scoreMax" auto-complete="off" placeholder="最大值"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddType = false">取 消</el-button>
        <el-button type="primary" :loading="subLoading" @click="submitType('addTypeForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑评估类型 -->
    <el-dialog
      title="编辑评估类型"
      :visible.sync="dialogEditType"
      class="taks_edit"
      @close="closeDialog('editTypeForm')"
    >
      <el-form
        :model="editTypeForm"
        ref="editTypeForm"
        @keyup.enter.native="editType('editTypeForm')"
      >
        <el-form-item
          label="评估类型"
          :label-width="formLabelWidth"
          prop="projectType"
          :rules="{
      required: true, message: '请输入评估类型', trigger: 'blur'
    }"
        >
          <el-col :span="22">
            <el-input v-model="editTypeForm.projectType" auto-complete="off" autofocus></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="设置范围" :label-width="formLabelWidth">
          <el-switch v-model="rangeSwitch"></el-switch>
        </el-form-item>
        <el-form-item label="范围" :label-width="formLabelWidth" v-if="rangeSwitch">
          <el-col :span="10">
            <el-form-item
              prop="scoreMin"
              :rules="[
      { type: 'number', message: '请输入数字'}
    ]"
            >
              <el-input
                v-model.number="editTypeForm.scoreMin"
                auto-complete="off"
                placeholder="最小值"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2" style="text-align:center">-</el-col>
          <el-col :span="10">
            <el-form-item
              prop="scoreMax"
              :rules="[
      { type: 'number', message: '请输入数字'}
    ]"
            >
              <el-input
                v-model.number="editTypeForm.scoreMax"
                auto-complete="off"
                placeholder="最大值"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditType = false">取 消</el-button>
        <el-button type="primary" :loading="subLoading" @click="editType('editTypeForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新增评估项目 -->
    <el-dialog
      title="新增评估项目"
      :visible.sync="dialogAddProject"
      class="taks_edit"
      @close="closeDialog('addProjectForm')"
    >
      <el-form
        :model="addProjectForm"
        ref="addProjectForm"
        @keyup.enter.native="submitPro('addProjectForm')"
      >
        <el-form-item
          label="评估项目"
          :label-width="formLabelWidth"
          prop="assessProjectName"
          :rules="{
      required: true, message: '请输入评估项目', trigger: 'blur'
    }"
        >
          <el-col :span="22">
            <el-input v-model="addProjectForm.assessProjectName" auto-complete="off" autofocus></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddProject = false">取 消</el-button>
        <el-button type="primary" :loading="subLoading" @click="submitPro('addProjectForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑评估项目 -->
    <el-dialog
      title="编辑评估项目"
      :visible.sync="dialogEditProject"
      class="taks_edit"
      @close="closeDialog('editProjectForm')"
    >
      <el-form
        :model="editProjectForm"
        ref="editProjectForm"
        @keyup.enter.native="editPro('editProjectForm')"
      >
        <el-form-item
          label="评估项目"
          :label-width="formLabelWidth"
          prop="assessProjectName"
          :rules="{
      required: true, message: '请输入评估项目', trigger: 'blur'
    }"
        >
          <el-col :span="22">
            <el-input v-model="editProjectForm.assessProjectName" auto-complete="off" autofocus></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditProject = false">取 消</el-button>
        <el-button type="primary" :loading="subLoading" @click="editPro('editProjectForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加选项 -->
    <el-dialog
      title="新增评估选项"
      :visible.sync="dialogAddCond"
      class="taks_edit"
      @close="closeDialog('addCondForm')"
    >
      <el-form
        :model="addCondForm"
        ref="addCondForm"
        @keyup.enter.native="submitCond('addCondForm')"
      >
        <el-form-item
          label="评估选项"
          :label-width="formLabelWidth"
          prop="assessCondition"
          :rules="{
      required: true, message: '请输入评估选项', trigger: 'blur'
    }"
        >
          <el-col :span="22">
            <el-input v-model="addCondForm.assessCondition" auto-complete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="设置分值" :label-width="formLabelWidth">
          <el-switch v-model="scoreSwitch"></el-switch>&nbsp;&nbsp;
          <span>注:&nbsp;&nbsp;不设置分值时选项结果默认为选项名称</span>
        </el-form-item>
        <el-form-item
          label="分值"
          :label-width="formLabelWidth"
          v-if="scoreSwitch"
          prop="assessScore"
          :rules="[
          
      { type: 'number', message: '请输入数字'}
    ]"
        >
          <el-col :span="22">
            <el-input v-model.number="addCondForm.assessScore" auto-complete="off"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddCond = false">取 消</el-button>
        <el-button type="primary" :loading="subLoading" @click="submitCond('addCondForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑评估选项 -->
    <el-dialog
      title="编辑评估选项"
      :visible.sync="dialogEditCond"
      class="taks_edit"
      @close="closeDialog('editCondForm')"
    >
      <el-form
        :model="editCondForm"
        ref="editCondForm"
        @keyup.enter.native="editCond('editCondForm')"
      >
        <el-form-item
          label="评估选项"
          :label-width="formLabelWidth"
          prop="assessCondition"
          :rules="{
      required: true, message: '请输入评估选项', trigger: 'blur'
    }"
        >
          <el-col :span="22">
            <el-input v-model="editCondForm.assessCondition" auto-complete="off" autofocus></el-input>
          </el-col>
        </el-form-item>
        <!-- <el-form-item label="设置分值" :label-width="formLabelWidth">
          <el-switch v-model="scoreSwitch"></el-switch>&nbsp;&nbsp;
          <span>注:&nbsp;&nbsp;不设置分值时选项结果默认为选项名称，分值默认修改为0</span>
        </el-form-item>-->
        <el-form-item label="分值" :label-width="formLabelWidth" prop="assessScore">
          <el-col :span="22">
            <el-input v-model.number="editCondForm.assessScore" auto-complete="off"></el-input>
            <p>注: 不设置分值时选项结果默认为选项名称</p>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditCond = false">取 消</el-button>
        <el-button type="primary" :loading="subLoading" @click="editCond('editCondForm')">确 定</el-button>
      </div>
    </el-dialog>
  </basic-container>
</template>

<script>
import {
  fetchList,
  getAssessTree,
  addListName,
  updateListName,
  delListName,
  addType,
  delObj,
  updateType,
  addPro,
  delPro,
  updatePro,
  addCond,
  delCond,
  updateCond
} from "@/api/icu/assessment/assList.js";
import {
  tableOption,
  proListOption
} from "@/const/crud/icu/assessment/assList.js";
export default {
  data() {
    return {
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      subLoading: false,
      tableOption: tableOption,
      proListOption: proListOption,
      dialogFormVisible: false,
      dialogAddType: false,
      dialogAddProject: false,
      dialogAddCond: false,
      dialogEditType: false,
      dialogEditProject: false,
      dialogEditCond: false,
      formLabelWidth: "80px",
      proListData: [],
      dataArr: [],
      loading: true,
      proLoading: true,
      title: "",
      tabData: [],
      projectId: "",
      assessTypeId: "",
      assessProjectId: "",
      flag: true,
      rangeSwitch: false,
      scoreSwitch: false,
      form: {
        projectName: "",
        projectType: "",
        projectCode: ""
      },
      addTypeForm: {
        projectType: "",
        min: "",
        max: ""
      },
      editTypeForm: {
        projectType: "",
        min: "",
        max: ""
      },
      addProjectForm: {
        assessProjectName: ""
      },
      editProjectForm: {
        assessProjectName: ""
      },
      addCondForm: {
        assessScore: "",
        assessCondition: ""
      },
      editCondForm: {
        assessScore: "",
        assessCondition: ""
      }
    };
  },
  created() {
    this.getList();
  },
  mounted() {},
  methods: {
    sizeChange(val) {
      // console.log(val)
      this.page.pageSize = val;
      this.getList();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.getList();
    },
    getList() {
      let params = {
        size: this.page.pageSize,
        current: this.page.currentPage,
        projectType: 4
      };
      this.proLoading = true;
      fetchList(params).then(response => {
        console.log(response.data.data);
        // this.proListData = response.data.data;
        this.proListData = response.data.data.records;
        this.page.pageSize = response.data.data.size;
        this.page.currentPage = response.data.data.current;
        this.page.total = response.data.data.total;
        this.proLoading = false;
        // console.log(response.data.data);
      });
    },
    expandChange(row, expendList) {
      this.$message.success("展开回调");
    },
    viewMore(row) {
      // console.log(row);
      this.title = row.projectName;
      this.flag = false;
      this.projectId = row.projectId;
      getAssessTree(row.projectId).then(response => {
        // console.log(response.data.data);
        this.dataArr = response.data.data;
        this.loading = false;
        //遍历类型
        for (let i in this.dataArr) {
          this.dataArr[i].children = this.dataArr[i].assessProjects;
          this.dataArr[i].name = this.dataArr[i].assessType;
          this.dataArr[i].level = 1;
          if (this.dataArr[i].scoreMin == null) {
          } else {
            this.dataArr[i].scoreRange =
              this.dataArr[i].scoreMin + "," + this.dataArr[i].scoreMax;
          }

          // this.dataArr[i].range = this.dataArr[i].scoreRange;
          this.dataArr[i].Id = this.dataArr[i].assessTypeId;
          this.dataArr[i].assessResult = null;
          this.dataArr[i].assessScore = null;
          //遍历项目
          for (let j in this.dataArr[i].children) {
            this.dataArr[i].children[j].children = this.dataArr[i].children[
              j
            ].projectConditions;
            this.dataArr[i].children[j].name = this.dataArr[i].children[
              j
            ].projectName;
            this.dataArr[i].children[j].Id = this.dataArr[i].children[
              j
            ].assessProjectId;
            this.dataArr[i].children[j].level = 2;
            this.dataArr[i].children[j].range = null;
            this.dataArr[i].assessResult = null;
            this.dataArr[i].assessScore = null;
            //遍历选项
            for (let k in this.dataArr[i].children[j].children) {
              this.dataArr[i].children[j].children[k].level = 3;
              this.dataArr[i].children[j].children[k].Id = this.dataArr[
                i
              ].children[j].children[k].assessConditionId;
              this.dataArr[i].children[j].children[k].name = this.dataArr[
                i
              ].children[j].children[k].assessCondition;
              this.dataArr[i].children[j].children[k].range = null;
            }
          }
        }
      });
    },
    returnMore() {
      this.flag = true;
      this.dataArr = [];
    },
    //树形表格内的添加按钮
    addChild(row) {
      console.log(row);
      if (row.assessTypeId !== undefined) {
        // console.log("添加类型的子节点项目");
        this.assessTypeId = row.assessTypeId;
        this.dialogAddProject = true;
      } else if (row.assessConditionId !== undefined) {
        // console.log("添加选项");
        this.dialogAddCond = true;
        this.assessProjectId = row.assessProjectId;
      } else {
        // console.log("添加项目的子节点选项");
        this.dialogAddCond = true;
        this.assessProjectId = row.assessProjectId;
      }
    },

    addItem() {
      this.addProjectForm.children.push({
        value: "",
        key: Date.now()
      });
    },
    removeDomain(item) {
      var index = this.addProjectForm.children.indexOf(item);
      if (index !== -1) {
        this.addProjectForm.children.splice(index, 1);
      }
    },
    //新增评估表
    addAssform(formName) {
      this.subLoading = true;
      this.$refs[formName].validate(valid => {
        if (valid) {
          addListName({
            projectName: this.form.projectName,
            projectType: 4,
            projectWarmFlag: 1,
            projectCode: this.form.projectCode
          }).then(response => {
            this.$message({
              showClose: true,
              message: "添加成功",
              type: "success"
            });
            this.getList();
            this.dialogFormVisible = false;
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    handleUpdate: function(row, index, done, loading) {
      this.subLoading = true;
      updateListName(row)
        .then(data => {
          this.proListData.splice(index, 1, Object.assign({}, row));
          this.$message({
            showClose: true,
            message: "修改成功",
            type: "success"
          });
          this.subLoading = false;
          done();
          this.getList();
        })
        .catch(() => {
          loading();
        });
    },
    rowDel: function(row, index) {
      var _this = this;
      this.$confirm("是否确认删除   " + row.projectName, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return delListName(row.id);
        })
        .then(data => {
          _this.proListData.splice(index, 1);
          _this.$message({
            showClose: true,
            message: "删除成功",
            type: "success"
          });
          this.getList();
        });
    },
    //新增评估类型
    submitType(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addTypeForm.projectId = this.projectId;
          if (this.rangeSwitch == true) {
            // this.addTypeForm.scoreMin =this.addTypeForm.min
            // this.addTypeForm.scoreMax =this.addTypeForm.max
            // console.log(this.addTypeForm.scoreMin)
            //  + "," + this.addTypeForm.max;
            if (this.addTypeForm.scoreMin != null) {
              if (this.addTypeForm.scoreMax != null) {
                this.subLoading = true;
                addType(this.addTypeForm).then(response => {
                  this.$message({
                    showClose: true,
                    type: "success",
                    message: "添加成功"
                  });
                  let row = {};
                  row.projectId = this.projectId;
                  this.dialogAddType = false;
                  this.viewMore(row);
                });
              } else {
                this.$message.error("请输入最大值");
              }
            } else {
              this.$message.error("请输入最小值");
            }
          } else {
            // console.log(this.addTypeForm);
            this.subLoading = true;
            addType(this.addTypeForm).then(response => {
              this.$message({
                showClose: true,
                type: "success",
                message: "添加成功"
              });
              let row = {};
              row.projectId = this.projectId;
              this.dialogAddType = false;
              this.viewMore(row);
            });
          }
        } else {
          return false;
        }
      });
    },
    editType(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.editTypeForm.projectId = this.projectId;
          if (this.rangeSwitch == true) {
            // this.addTypeForm.scoreMin =this.addTypeForm.min
            // this.addTypeForm.scoreMax =this.addTypeForm.max
            // console.log(this.addTypeForm.scoreMin)
            //  + "," + this.addTypeForm.max;
            if (this.editTypeForm.scoreMin != null) {
              if (this.editTypeForm.scoreMax != null) {
                this.subLoading = true;
                updateType(this.editTypeForm).then(response => {
                  this.$message({
                    showClose: true,
                    type: "success",
                    message: "修改成功"
                  });
                  let row = {};
                  row.projectId = this.projectId;
                  this.subLoading = true;
                  this.dialogEditType = false;
                  this.viewMore(row);
                });
              } else {
                this.$message.error("请输入最大值");
              }
            } else {
              this.$message.error("请输入最小值");
            }
          } else {
            // console.log(this.addTypeForm);
            this.subLoading = true;
            updateType(this.editTypeForm).then(response => {
              this.$message({
                showClose: true,
                type: "success",
                message: "修改成功"
              });
              let row = {};
              row.projectId = this.projectId;
              this.subLoading = false;
              this.dialogEditType = false;
              this.viewMore(row);
            });
          }
        } else {
          return false;
        }
      });
    },
    delRow: function(row, index) {
      var _this = this;
      let delPrompt = "";
      if (row.assessTypeId !== undefined) {
        // console.log("删除类型");

        delPrompt = "类型: " + row.assessType;
      } else if (row.assessConditionId !== undefined) {
        // console.log("删除选项");

        delPrompt = "选项: " + row.assessCondition;
      } else {
        // console.log("删除项目");

        delPrompt = "项目: " + row.projectName;
      }
      this.$confirm("是否确认删除  " + delPrompt, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          // console.log(row);
          if (row.assessTypeId !== undefined) {
            // console.log("删除类型");
            return delObj(row.id);
          } else if (row.assessConditionId !== undefined) {
            // console.log("删除选项");
            return delCond(row.id);
          } else {
            // console.log("删除项目");
            return delPro(row.id);
          }
        })
        .then(data => {
          // _this.proListData.splice(index, 1);
          _this.$message({
            showClose: true,
            message: "删除成功",
            type: "success"
          });
          let row = {};
          row.projectId = this.projectId;
          this.dialogAddType = false;
          this.viewMore(row);
        });
    },
    updateRow: function(row, index, done, loading) {
      // console.log(row);
      if (row.assessTypeId !== undefined) {
        // console.log("编辑类型");

        // this.assessTypeId = row.assessTypeId;
        this.dialogEditType = true;
        this.editTypeForm.projectType = row.assessType;
        this.editTypeForm.projectId = this.projectId;
        this.editTypeForm.assessTypeId = row.assessTypeId;
        this.editTypeForm.id = row.id;
        this.editTypeForm.range = row.range;
        this.editTypeForm.min = "";
        this.editTypeForm.max = "";
      } else if (row.assessConditionId !== undefined) {
        // console.log("编辑选项");
        this.dialogEditCond = true;
        this.editCondForm = JSON.parse(JSON.stringify(row));

        this.assessProjectId = row.assessProjectId;
        // this.editCondForm.score=""
      } else {
        // console.log("编辑项目");
        this.dialogEditProject = true;
        this.editProjectForm.id = row.id;

        this.editProjectForm.assessProjectName = row.projectName;
        this.editProjectForm.assessProjectId = row.assessProjectId;
        //  this.addProjectForm=row
        // this.assessProjectId = row.assessProjectId;
      }
      // updateListName(row)
      //   .then(data => {
      //     this.proListData.splice(index, 1, Object.assign({}, row));
      //     this.$message({
      //       showClose: true,
      //       message: "修改成功",
      //       type: "success"
      //     });
      //     done();
      //     this.getList();
      //   })
      //   .catch(() => {
      //     loading();
      //   });
    },
    // 新增评估项目
    submitPro(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // console.log(this.addProjectForm);
          this.subLoading = true;
          this.addProjectForm.assessTypeId = this.assessTypeId;
          addPro(this.addProjectForm).then(response => {
            this.$message({
              showClose: true,
              type: "success",
              message: "添加成功"
            });
            let row = {};
            row.projectId = this.projectId;
            this.dialogAddProject = false;
            this.viewMore(row);
          });
        } else {
          return false;
        }
      });
    },
    editPro(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // console.log(this.editProjectForm);
          this.subLoading = true;
          // this.editProjectForm.assessTypeId = this.assessTypeId;
          updatePro(this.editProjectForm).then(response => {
            this.$message({
              showClose: true,
              type: "success",
              message: "修改成功"
            });
            let row = {};
            row.projectId = this.projectId;
            this.dialogEditProject = false;
            this.viewMore(row);
          });
        } else {
          return false;
        }
      });
    },
    //新增评估选项
    submitCond(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addCondForm.assessProjectId = this.assessProjectId;
          if (
            this.addCondForm.assessScore === undefined ||
            this.addCondForm.assessScore === "" ||
            this.addCondForm.assessScore === null
          ) {
            this.addCondForm.assessResult = this.addCondForm.assessCondition;
          } else {
            this.addCondForm.assessResult = this.addCondForm.assessScore;
          }
          // console.log(this.addCondForm);
          this.subLoading = true;
          addCond(this.addCondForm).then(response => {
            // this.$refs[formName].resetFields();
            this.dialogAddCond = false;
            this.$message({
              showClose: true,
              type: "success",
              message: "添加成功"
            });
            let row = {};

            row.projectId = this.projectId;

            this.viewMore(row);
          });
        } else {
          return false;
        }
      });
    },
    editCond(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // this.editCondForm.assessProjectId = this.assessProjectId;
          // console.log(this.editCondForm.score)
          if (
            this.editCondForm.assessScore === undefined ||
            this.editCondForm.assessScore === "" ||
            this.editCondForm.assessScore === null
          ) {
            this.editCondForm.assessScore = "";
            this.editCondForm.assessResult = this.editCondForm.assessCondition;
            // console.log(this.editCondForm.assessScore)
          } else {
            // this.editCondForm.assessScore = this.editCondForm.assessScore;
            this.editCondForm.assessResult = this.editCondForm.assessScore;
            // console.log(21)
          }
          this.subLoading = true;
          // console.log(this.editCondForm);
          updateCond(this.editCondForm).then(response => {
            this.$message({
              showClose: true,
              type: "success",
              message: "修改成功"
            });
            let row = {};
            row.projectId = this.projectId;
            this.dialogEditCond = false;
            this.viewMore(row);
          });
        } else {
          return false;
        }
      });
    },
    //关闭对话框清空form表单的值
    closeDialog(formName) {
      this.subLoading = false;
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang="scss" scoped>
.title_project {
  display: inline-block;
  margin-left: 15%;
}
</style>