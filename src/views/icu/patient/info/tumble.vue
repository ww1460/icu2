<template>
  <!-- 跌倒坠床 -->
  <div>
    <div v-if="flagpage == 1" class="tunble_content">
      <div class="exetion">
        <!-- <span>最新评估:{{AssessList.assessProjects ? AssessList.assessProjects[0].recordTime[0] : ''}}</span>
        <table class="occupation">
          <thead>
            <tr>
              <th>评估项目</th>
              <th>病情</th>
              <th>分值</th>
            </tr>
          </thead>
          <tbody v-for="(item,index) in AssessList.assessProjects" :key="index">
            <tr v-for="(i,index1) in item.projectConditions" :key="index1">
              <td
                v-if="index1 == 0"
                :rowspan="item.projectConditions.length + 1"
              >{{item.projectName}}</td>
              <td :class="i.flag ? 'el-button--primary':'' ">{{i.assessCondition}}</td>
              <td>{{i.assessScore}}</td>
            </tr>
          </tbody>
        </table>-->
        <el-button :type="flagOne?'primary':''" @click="score">评分记录</el-button>
        <el-button :type="flagTwo?'primary':''" @click="presentation">报告记录</el-button>
        <el-button
          v-if="returnVif"
          icon="el-icon-back"
          type="primary"
          size="small"
          @click="returnClick()"
        >返回</el-button>
        <avue-crud
          v-if="viewMoreIf"
          :page="page"
          :data="tableData"
          :table-loading="tableLoading"
          :option="tableOption"
          style="margin-top:20px"
          @size-change="sizeChange"
          @current-change="currentChange"
        >
          <template slot="menu" slot-scope="scope">
            <el-button
              :size="scope.size"
              :type="scope.type"
              @click="viewMore(scope.row)"
              icon="el-icon-view"
            >详情</el-button>
            <el-button
              :size="scope.size"
              :type="scope.type"
              @click="rowDel(scope.row,scope.row.$index)"
              icon="el-icon-delete"
            >删除</el-button>
          </template>
        </avue-crud>
        <fallBed v-if="code =='MORSE'" :messages="recordViewData"></fallBed>
        <avue-crud
          v-if="presentationVif"
          ref="crud"
          :page="pageTwo"
          :data="tableDataTwo"
          :table-loading="tableLoading"
          :option="tableOptionTwo"
           style="margin-top:20px"
          @size-change="sizeChangeTwo"
          @current-change="currentChangeTwo"
        >
          <template slot-scope="scope" slot="menu">
            <el-button
              type="text"
              icon="el-icon-view"
              size="small"
              @click="handleUpdate(scope.row,scope.index,3)"
            >查看</el-button>
            <el-button
              type="text"
              icon="el-icon-edit"
              size="small"
              @click="handleUpdate(scope.row,scope.index,2)"
            >编辑</el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              size="small"
              @click="rowDel(scope.row,scope.index)"
            >删除</el-button>
          </template>
        </avue-crud>
      </div>
      <div class="List_item">
        <el-button type="primary" @click="resetFlow" style="position:absolute;left:10px">重置流程</el-button>
        <div class="List_item_width">
          <div class="List_item_right">
            <p v-for="item in flowList" :key="item.id">
              <img v-if="item.img" :src="item.img" alt />
              <span
                :class="item.flag?'el-link el-link--primary':''"
                v-if="item.title"
                @click="assessclick(item.id,item)"
              >{{item.title?item.title :''}}</span>
            </p>
          </div>
          <!-- <div class="div_list">
          <div class="swiper-container swiper_div_list">
            <div class="swiper-wrapper">
              <el-button
                class="swiper-slide slide_item button swiper-slideBtn"
                v-for="(item,index) in TunbleList"
                :key="index"
              >{{item.taskContent}}</el-button>
          </div>-->
          <!-- 如果需要分页器 -->
          <!-- <div class="swiper-pagination"></div> -->

          <!-- 如果需要导航按钮 -->
          <!-- <div class="swiper-button-prev"></div>
            <div class="swiper-button-next"></div>
          </div>
          </div>-->
          <!-- 快捷任务 -->
          <div class="rapidTask child clearfix">
            <p>
              <el-button icon="el-icon-arrow-left" @click="prev()" class="btn"></el-button>
            </p>
            <div class="btnBox">
              <div class="btnOverflow">
                <p>
                  <el-button
                    v-for="(item,index) in TunbleList"
                    :key="index"
                    round
                    size="small"
                    @click="repaidClick(item)"
                    style="margin-left:10px"
                  >{{item.taskContent}}</el-button>
                </p>
              </div>
            </div>
            <p>
              <el-button icon="el-icon-arrow-right" @click="next()" class="btn"></el-button>
            </p>
          </div>
        </div>
        <!-- 完成任务 -->
        <el-dialog :visible.sync="dialogcompleteVisible" class="taks_edit" title="任务结果">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="任务结果" v-if="dataInputVif">
              <el-input v-model="ruleForm.result"></el-input>
            </el-form-item>
            <el-form-item label="任务结果" prop="resource" v-if="!dataInputVif">
              <el-button
                v-for="(items,index) in radioData[0].projectRecordValues"
                :key="index"
                style="margin:0 0 10px 10px;"
                :type="items.flag?'primary':''"
                @click="taskRadio(items,index)"
              >{{items.recordValue}}</el-button>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" :loading="tableLoading" @click="submitResult()">保 存</el-button>
            <el-button @click="dialogcompleteVisible=false">取 消</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
    <fallBed
      v-else-if="flagpage == 2"
      :flagpage="flagpage"
      :changeflagpage="changeflagpage"
      :mess="messages"
      :flowDateId="flowDateId"
      :getAssess="getList"
       :sub="sub"
    ></fallBed>
    <fallSdrop
      v-else-if="flagpage == 3"
      :flagnum="flagnum"
      :changeflagpage="changeflagpage"
      :messages="messages"
      :flowDateId="flowDateId"
      :changeflagTwo="changeFlagTwo"
      :patientInfo="patientInfo"
      :sub="sub"
    ></fallSdrop>
  </div>
</template>

<script>
import {
  getAssess,
  getFlow,
  addFlow,
  putflow,
  addObj,
  getTemplatelist,
  templateProjectValue,
  addTask
} from "@/api/icu/patient/tumble";
import Swiper from "swiper";
import fallBed from "@/views/icu/assessment/fallBed";
import Fallrecord from "@/views/icu/assessment/Fallrecord";
import fallSdrop from "@/views/icu/assessment/fallSdrop";
import {
  fetchList,
  getRecord,
  delRecod,
  getRecordView
} from "@/api/icu/assessment/assRecords.js";
import { tableOption, tableOptionTwo } from "@/const/crud/icu/patient/tumble";
import { fetchListTwo, putObj } from "@/api/icu/assessment/Fallrecord";
export default {
  components: {
    fallBed,
    fallSdrop,
    Fallrecord
  },
  name: "tumble",
  data() {
    return {
      itemsRow: "",
      itemData: {},
      radioData: [],
      dataInputVif: true,
      ruleForm: {
        result: ""
      },
      rules: {
        resource: [
          { required: true, message: "请输入任务结果", trigger: "blur" }
        ]
      },
      dialogcompleteVisible: false,
      patientInfo: {},
      presentationVif: false,
      fallrecord: false,
      returnVif: false,
      code: "",
      viewMoreIf: true,
      fall: "跌倒/坠床评分",
      tableLoading: false,
      tableOption: tableOption,
      tableOptionTwo: tableOptionTwo,
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      pageTwo: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      flagOne: true,
      flagTwo: false,
      projectCode: "Morse",
      AssessList: {},
      brightFlag: false,
      nameFlag: false,
      flowList: [
        { id: 1, title: "患者姓名", flag: false },
        { id: 220, img: "/img/entryDepartment/lc_3_02.png" },
        { id: 2, title: "评估", flag: false },
        { id: 221, img: "/img/entryDepartment/5-1_04.png" },
        { id: 3, title: "存在", flag: false },
        { id: 4, title: "不存在", flag: false },
        { id: 222, img: "/img/entryDepartment/5-1_04.png" },
        { id: 5, title: "已发生", flag: false },
        { id: 223, img: "/img/entryDepartment/lc_3_02.png" },
        { id: 6, title: "未发生", flag: false },
        { id: 7, title: "填写报告", flag: false },
        { id: 224, img: "/img/entryDepartment/lc_3_02.png" },
        { id: 8, title: "建议措施", flag: false },
        { id: 225, img: "/img/entryDepartment/lc_3_02.png" }
        // { id: 9, title: "床档保护", flag: false },
        // { id: 10, title: "宣药", flag: false },
        // { id: 11, title: "家属陪伴", flag: false },
        // { id: 12, title: "悬挂标识", flag: false }
      ],
      flowDate: {},
      flagpage: 1,
      flowDateId: "",
      TunbleList: []
    };
  },
  props: {
    messages: Object,
    bright: {
      type: Boolean
    }
  },
  watch: {
    messages: {
      handler(newValue, oldValue) {
        this.messages = newValue;
        this.getList(this.messages.patientId);
        let params = {
          patientId: this.messages.patientId
        };
        this.getListScore(params);
        this.getListPresentation(params);
        this.$forceUpdate(); //强制页面进行刷新
        this.flowList[0].title = this.messages.name;

        for (var i in this.flowList) {
          this.flowList[i].flag = false;
        }
        this.flowList[0].flag = true;
        let param = {
          patientId: this.messages.patientId,
          flowName: 4
        };
        getFlow(param).then(res => {
          if (res.data.msg == 0) {
            this.flowDate = res.data.data;
            this.flowDateId = this.flowDate.id;

            if (this.flowDate.specificStepId.indexOf(",") == -1) {
            } else {
              var arr = [];
              arr = this.flowDate.specificStepId.split(",");
              for (var i in this.flowList) {
                for (var j in arr) {
                  if (arr[j] == this.flowList[i].id) {
                    this.flowList[i].flag = true;
                  }
                }
              }
            }
          }
        });
      },
      deep: true
    }
  },
  created() {
    if (this.messages.patientId) {
      for (var i in this.flowList) {
        this.flowList[i].flag = false;
      }
      this.flowList[0].flag = true;
      this.flowList[0].title = this.messages.name;
      let param = {
        patientId: this.messages.patientId,
        flowName: 4
      };
      getFlow(param).then(res => {
        this.getList(this.messages.patientId);
        if (res.data.msg == 0) {
          this.flowDate = res.data.data;
          this.flowDateId = this.flowDate.id;

          if (this.flowDate.specificStepId.indexOf(",") == -1) {
          } else {
            var arr = [];
            arr = this.flowDate.specificStepId.split(",");
            for (var i in this.flowList) {
              for (var j in arr) {
                if (arr[j] == this.flowList[i].id) {
                  this.flowList[i].flag = true;
                }
              }
            }
          }
        }
      });
    }
  },
  mounted() {
    this.getList(this.messages.patientId);
    let params = {
      patientId: this.messages.patientId
    };
    this.getListScore(params);
    this.getListPresentation(params);
    this.Templatelist();
  },
  methods: {
    // 子组件调用方法
    sub() {
      let params = {
        patientId: this.messages.patientId
      };
      this.getListScore(params);
      this.getListPresentation(params);
    },
    // 任务按钮单选选中
    taskRadio(row, index) {
      this.itemsRow = "";
      for (const i in this.radioData[0].projectRecordValues) {
        if (
          row.projectRecordValueId ==
          this.radioData[0].projectRecordValues[i].projectRecordValueId
        ) {
          this.radioData[0].projectRecordValues[i].flag = true;
          this.itemsRow = this.radioData[0].projectRecordValues[i].recordValue;
        } else {
          this.radioData[0].projectRecordValues[i].flag = false;
        }
      }
      this.$forceUpdate(); //强制页面进行刷新
    },
    // 措施保存
    submitResult() {
      if (this.dataInputVif == false) {
        if (this.itemsRow == "") {
          this.$message({
            message: "请选择一个任务结果",
            type: "warning"
          });
          return;
        }
      }
      if (this.itemsRow == "") {
        this.itemsRow = this.ruleForm.result;
      }
      let obj = {
        patientId: this.messages.patientId,
        result: this.itemsRow,
        createTime: this.itemData.createTime,
        createUserId: this.itemData.createUserId,
        delFlag: this.itemData.delFlag,
        delTime: this.itemData.delTime,
        delUserId: this.itemData.delUserId,
        executionType: this.itemData.executionType,
        id: this.itemData.id,
        intervalTime: this.itemData.intervalTime,
        preEndTime: this.itemData.preEndTime,
        preStartTime: this.itemData.preStartTime,
        source: this.itemData.source,
        sourceId: this.itemData.sourceId,
        taskContent: this.itemData.taskContent,
        taskDescribe: this.itemData.taskDescribe,
        taskTemplateId: this.itemData.taskTemplateId,
        templateSubTaskId: this.itemData.templateSubTaskId
      };
      addTask(obj).then(data => {
        this.$message({
          showClose: true,
          message: "保存成功",
          type: "success"
        });
      });
      this.dialogcompleteVisible = false;
      this.ruleForm = {
        result: ""
      };
    },
    // 查看，编辑
    changeFlagTwo(val) {
      this.flagpage = 1;
      this.getList(this.messages.patientId);
      let params = {
        patientId: this.messages.patientId
      };
      this.getListScore(params);
      this.getListPresentation(params);
      this.Templatelist();
    },
    // 报告记录查询
    getListPresentation(params) {
      this.tableLoading = true;
      fetchListTwo(
        Object.assign(
          {
            current: this.pageTwo.currentPage,
            size: this.pageTwo.pageSize
          },
          params
        )
      )
        .then(response => {
          this.tableDataTwo = response.data.data.records;
          this.pageTwo.total = response.data.data.total;
          this.tableLoading = false;
        })
        .catch(() => {
          this.tableLoading = false;
        });
    },
    // 评估删除
    rowDel(row, index) {
      // console.log(row)
      // console.log(index)
      var _this = this;
      this.$confirm("是否确认删除ID为" + row.id, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return delRecod(row.id);
        })
        .then(data => {
          _this.tableData.splice(index, 1);
          _this.$message({
            showClose: true,
            message: "删除成功",
            type: "success"
          });
          let params = {
            patientId: this.messages.patientId
          };
          this.getListScore(params);
        });
    },
    // 评估详情
    viewMore(row) {
      let params = {
        projectId: row.projectId,
        assessRecordId: row.assessRecordId
      };
      getRecordView(params).then(response => {
        // console.log(response);
        this.recordViewData = response.data.data.data;
        this.recordViewData[0].patientId = this.patName;
        // console.log(this.recordViewData)
        this.viewMoreIf = false;
        this.returnVif = true;
        this.code = row.projectCode;
      });
    },
    // 评估返回
    returnClick() {
      this.code = "";
      this.viewMoreIf = true;
      this.returnVif = false;
    },
    //点击编辑
    handleUpdate(row, index, flag) {
      //编辑
      if (flag == 2) {
        putObj(row.id)
          .then(res => {
            this.patientInfo = res.data.data;
            this.flagpage = 3;
            this.flagnum = 2;
            this.flag = false;
          })
          .catch(() => {});
      }
      //查看
      if (flag == 3) {
        putObj(row.id).then(res => {
          this.patientInfo = res.data.data;
          // console.log(this.patientInfo);
          this.flagpage = 3;
          this.flagnum = 3;
          this.flag = false;
        });
      }
    },
    // 分页
    sizeChangeTwo(val) {
      this.pageTwo.pageSize = val;
      let params = {};
      if (this.$refs.patientChoseChild.patientId) {
        params = {
          patientId: this.$refs.patientChoseChild.patientId
        };
      }
      this.getListPresentation(params);
    },
    currentChangeTwo(val) {
      this.pageTwo.currentPage = val;
      let params = {};
      if (this.$refs.patientChoseChild.patientId) {
        params = {
          patientId: this.$refs.patientChoseChild.patientId
        };
      }
      this.getListPresentation(params);
    },
    sizeChange(val) {
      this.page.pageSize = val;
      let params = {};
      if (this.$refs.patientChoseChild.patientId) {
        params = {
          patientId: this.$refs.patientChoseChild.patientId
        };
      }
      this.getListScore(params);
    },
    currentChange(val) {
      this.page.currentPage = val;
      let params = {};
      if (this.$refs.patientChoseChild.patientId) {
        params = {
          patientId: this.$refs.patientChoseChild.patientId
        };
      }
      this.getListScore(params);
    },
    // 评估记录分页查询
    getListScore(params) {
      this.tableLoading = true;
      let projectName = {
        projectName: this.fall
      };
      fetchList(
        Object.assign(
          {
            current: this.page.currentPage,
            size: this.page.pageSize
          },
          params,
          projectName
        )
      )
        .then(response => {
          this.tableData = response.data.data.records;
          this.page.pageSize = response.data.data.size;
          this.page.currentPage = response.data.data.current;
          this.page.total = response.data.data.total;
          this.tableLoading = false;
        })
        .catch(() => {
          this.tableLoading = false;
        });
    },
    // 判断展示评分记录还是报告记录
    score() {
      this.viewMoreIf = true;
      this.flagOne = true;
      this.flagTwo = false;
      this.fallrecord = false;
      this.presentationVif = false;
    },
    presentation() {
      this.viewMoreIf = false;
      this.flagOne = false;
      this.flagTwo = true;
      this.presentationVif = true;
      this.fallrecord = true;
    },
    Templatelist() {
      getTemplatelist().then(res => {
        this.TunbleList = res.data.data;
      });
    },
    // <!-- 快捷任务完成描述 -->
    next() {
      this.TunbleList.push(this.TunbleList.shift());
    },
    prev() {
      this.TunbleList.unshift(this.TunbleList.pop());
    },
    repaidClick(item) {
      console.log(item);
      this.itemData = {};
      if (this.flowList[12].flag) {
        templateProjectValue(item).then(data => {
          this.dialogcompleteVisible = true;
          if (data.data.data.msg == 0) {
            this.dataInputVif = true;
          } else {
            this.dataInputVif = false;
            this.radioData = data.data.data.data;
          }
        });
        this.itemData = item;
      } else {
        this.$message({
          message: "请先点击建议措施",
          type: "warning"
        });
        this.dialogcompleteVisible = false;
        this.itemData = {};
      }
    },
    //重置流程
    resetFlow() {
      let params = {
        patientId: this.messages.patientId,
        flowName: 4
      };
      this.$confirm("是否为该患者重建流程 ", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        //创建新的流程
        addFlow(params).then(res => {
          for (var i in this.flowList) {
            if (this.flowList[i].id != 1) {
              this.flowList[i].flag = false;
            }
          }
        });
      });
    },

    //子组件评估 返回
    changeflagpage(flag) {
      if (flag == 2) {
        for (var i in this.flowList) {
          if (this.flowList[i].id == 2) {
            this.flowList[i].flag = true;
          }
        }
      }
      if (flag == 3) {
        for (var i in this.flowList) {
          if (this.flowList[i].id == 7) {
            this.flowList[i].flag = false;
          }
        }
      }
      if (flag == 5) {
        for (var i in this.flowList) {
          if (this.flowList[i].id == 7) {
            this.flowList[i].flag = true;
          }
        }
      }
      if (flag == 4) {
        for (var i in this.flowList) {
          if (this.flowList[i].id == 7) {
            this.flowList[i].flag = false;
          }
        }
      }
      this.flagpage = 1;
    },
    // 流程
    assessclick(id, item) {
      if (this.flowList[0].flag) {
        let params = {
          patientId: this.messages.patientId,
          flowName: 4
        };
        getFlow(params).then(res => {
          if (res.data.msg == 1) {
            this.$confirm("此患者没有流程是否创建流程 ", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              //创建新的流程
              addFlow(params).then(res => {
                if (res.data.data) {
                  //创建完毕之后查询
                  getFlow(params).then(res => {});
                }
              });
            });
          } else if (res.data.msg == 0) {
            this.flowDate = res.data.data;
            this.flowDateId = this.flowDate.id;

            if (this.flowDate.specificStepId.indexOf(",") == -1) {
            } else {
              var arr = [];
              arr = this.flowDate.specificStepId.split(",");
              for (var i in this.flowList) {
                for (var j in arr) {
                  if (arr[j] == this.flowList[i].id) {
                    this.flowList[i].flag = true;
                  }
                }
              }
            }
            if (id == 2) {
              for (var i in this.flowList) {
                if (this.flowList[i].id == 2) {
                  if (this.flowList[i].flag == true) {
                    this.$message({
                      message: "已经做完评估",
                      type: "warning"
                    });
                  } else {
                    this.$confirm("是否进行评估: ", "提示", {
                      confirmButtonText: "确定",
                      cancelButtonText: "取消",
                      type: "warning"
                    }).then(() => {
                      this.flagpage = 2;
                    });
                  }
                }
              }
            }
            if (id == 3) {
              for (var i in this.flowList) {
                if (this.flowList[2].flag && !this.flowList[5].flag) {
                  item.flag = true;
                  this.putFlowList(this.flowDate.id, id);
                } else {
                  this.$message({
                    message: "请正确操作",
                    type: "warning"
                  });
                  return;
                }
              }
            }
            if (id == 4) {
              for (var i in this.flowList) {
                if (this.flowList[2].flag && !this.flowList[4].flag) {
                  item.flag = true;
                  this.putFlowList(this.flowDate.id, id);
                } else {
                  this.$message({
                    message: "请正确操作",
                    type: "warning"
                  });
                }
                return;
              }
            }
            if (id == 5) {
              for (var i in this.flowList) {
                if (this.flowList[4].flag && !this.flowList[9].flag) {
                  item.flag = true;
                  this.putFlowList(this.flowDate.id, id);
                } else {
                  this.$message({
                    message: "请正确操作",
                    type: "warning"
                  });
                }
                return;
              }
            }
            if (id == 6) {
              for (var i in this.flowList) {
                if (this.flowList[4].flag && !this.flowList[7].flag) {
                  item.flag = true;
                  this.putFlowList(this.flowDate.id, id);
                } else {
                  this.$message({
                    message: "请正确操作",
                    type: "warning"
                  });
                }
                return;
              }
            }
            //填写报告
            if (id == 7) {
              for (var i in this.flowList) {
                if (this.flowList[7].flag && !this.flowList[10].flag) {
                  this.flagpage = 3;
                  this.flagnum = 6;
                } else {
                  this.$message({
                    message: "请正确操作",
                    type: "warning"
                  });
                }
                return;
              }
            }
            //建议措施
            if (id == 8) {
              for (var i in this.flowList) {
                if (this.flowList[9].flag) {
                  item.flag = true;
                  this.putFlowList(this.flowDate.id, id);
                } else {
                  this.$message({
                    message: "请正确操作",
                    type: "warning"
                  });
                }
                return;
              }
            }
          }
        });
      }
    },

    putFlowList(id, specificStepId) {
      let params = {
        id: id,
        specificStepId: specificStepId
      };
      let param = {
        patientId: this.messages.patientId,
        flowName: 4
      };
      putflow(params).then(res => {
        getFlow(param).then(res => {});
      });
    },
    //初始化请求
    getList(patientId) {
      let params = {
        patientId: patientId,
        projectCode: this.projectCode
      };
      getAssess(params).then(res => {
        this.AssessList = res.data.data.data[0];
        for (var i in this.AssessList.assessProjects) {
          for (var j in this.AssessList.assessProjects[i].projectConditions) {
            if (
              this.AssessList.assessProjects[i].projectConditions[j]
                .assessConditionId ==
              this.AssessList.assessProjects[i].pitchOnId[0]
            ) {
              this.AssessList.assessProjects[i].projectConditions[
                j
              ].flag = true;
            }
          }
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.actFlag {
  color: #fff;
  background: #409eff;
}
.clickFlag {
  color: #409eff;
}
.exetion {
  overflow-x: auto !important;
  .occupation {
    width: 100%;
    th,
    td {
      border: 1px solid #ebeef5;
      line-height: 45px;
      text-align: center;
    }
    th:first-child {
      width: 15%;
    }
    th:nth-child(2) {
      width: 30%;
    }
    th:nth-child(3) {
      width: 10%;
    }
  }
}
.tunble_content {
  width: 100%;
  .exetion {
    float: left;
    width: 65%;
    // height: 800px;
    // overflow: auto;
  }
  .List_item {
    position: relative;
    float: left;
    width: 35%;
    .List_item_width {
      width: 300px;
      position: relative;
      margin: 0 auto;
      height: 370px;
      .rapidTask {
        width: 280px;
        position: absolute;
        top: 315px;
        left: 35px;
      }
      .rapidTask .btn {
        float: left;
        // padding: 0 5px 0 5px !important;
        width: 30px !important;
        margin-left: 5px;
        margin-right: 5px;
        margin-bottom: 5px;
        line-height: 0;
      }
      .btnBox {
        width: 140px;
        height: 35px;
        float: left !important;
        // overflow: hidden;
        overflow-x: scroll;
        scrollbar-width: none;
        overflow: -moz-scrollbars-none;
        // position: relative;
      }
      .btnOverflow {
        // width: 10000px
        // position: absolute
        white-space: nowrap;
      }
      p {
        cursor: pointer;
      }

      .List_item_right {
        position: relative;
        text-align: center;
        p:nth-of-type(1) {
          position: absolute;
          left: 50%;
          top: 50px;
          text-align: center;
        }
        p:nth-of-type(2) {
          position: absolute;
          left: 56%;
          top: 75px;
        }
        p:nth-of-type(3) {
          position: absolute;
          left: 53%;
          top: 100px;
        }
        p:nth-of-type(4) {
          position: absolute;
          left: 40.5%;
          top: 125px;
          // width: 150px;
          img {
            width: 100%;
          }
        }
        p:nth-of-type(5) {
          position: absolute;
          top: 155px;
          left: 38%;
        }
        p:nth-of-type(6) {
          position: absolute;
          top: 155px;
          left: 65%;
        }
        p:nth-of-type(7) {
          position: absolute;
          left: 26%;
          top: 180px;
        }
        p:nth-of-type(8) {
          position: absolute;
          top: 210px;
          left: 21%;
        }
        p:nth-of-type(9) {
          position: absolute;
          top: 235px;
          left: 27%;
        }
        p:nth-of-type(10) {
          position: absolute;
          left: 50%;
          top: 210px;
        }
        p:nth-of-type(11) {
          position: absolute;
          top: 259px;
          left: 19%;
        }
        p:nth-of-type(12) {
          position: absolute;
          left: 56%;
          top: 236px;
          // height: 50px;
        }
        p:nth-of-type(13) {
          position: absolute;
          left: 48%;
          top: 260px;
        }
        p:nth-of-type(14) {
          position: absolute;
          position: absolute;
          left: 56%;
          top: 285px;
        }
        // .div_list {
        //   position: absolute;
        //   left: 10%;
        //   top: 350px;
        // }
      }
    }
  }
}
.div_list {
  position: relative;
  width: 100%;
  top: 360px;
  .slide_item {
    text-align: center;
    cursor: pointer;
  }
}

@media screen and (max-width: 1200px) {
  .exetion {
    overflow-x: auto !important;
    .occupation {
      width: 100%;
      th,
      td {
        border: 1px solid #ebeef5;
        line-height: 45px;
        text-align: center;
      }
      th:first-child {
        width: 15%;
      }
      th:nth-child(2) {
        width: 30%;
      }
      th:nth-child(3) {
        width: 10%;
      }
    }
  }
  .tunble_content {
    width: 100%;
    .exetion {
      float: left;
      width: 100%;
      // height: 800px;
      // overflow: auto;
    }
    .List_item {
      position: relative;
      float: left;
      width: 100%;
      .List_item_width {
        width: 300px;
        position: relative;
        margin: 0 auto;
        height: 370px;
        .rapidTask {
          width: 350px;
          position: absolute;
          top: 315px;
          left: 35px;
        }
        .rapidTask .btn {
          float: left;
          // padding: 0 5px 0 5px !important;
          width: 30px !important;
          margin-left: 5px;
          margin-right: 5px;
          margin-bottom: 5px;
        }
        .btnBox {
          width: 140px;
          height: 35px;
          float: left !important;
          // overflow: hidden;
          overflow-x: scroll;
          scrollbar-width: none;
          overflow: -moz-scrollbars-none;
          // position: relative;
        }
        .btnOverflow {
          // width: 10000px
          // position: absolute
          white-space: nowrap;
        }
        p {
          cursor: pointer;
        }

        .List_item_right {
          position: relative;
          text-align: center;
          p:nth-of-type(1) {
            position: absolute;
            left: 50%;
            top: 50px;
            text-align: center;
          }
          p:nth-of-type(2) {
            position: absolute;
            left: 56%;
            top: 75px;
          }
          p:nth-of-type(3) {
            position: absolute;
            left: 53%;
            top: 100px;
          }
          p:nth-of-type(4) {
            position: absolute;
            left: 40.5%;
            top: 125px;
            // width: 150px;
            img {
              width: 100%;
            }
          }
          p:nth-of-type(5) {
            position: absolute;
            top: 155px;
            left: 38%;
          }
          p:nth-of-type(6) {
            position: absolute;
            top: 155px;
            left: 65%;
          }
          p:nth-of-type(7) {
            position: absolute;
            left: 26%;
            top: 180px;
          }
          p:nth-of-type(8) {
            position: absolute;
            top: 210px;
            left: 21%;
          }
          p:nth-of-type(9) {
            position: absolute;
            top: 235px;
            left: 27%;
          }
          p:nth-of-type(10) {
            position: absolute;
            left: 50%;
            top: 210px;
          }
          p:nth-of-type(11) {
            position: absolute;
            top: 259px;
            left: 19%;
          }
          p:nth-of-type(12) {
            position: absolute;
            left: 56%;
            top: 236px;
            // height: 50px;
          }
          p:nth-of-type(13) {
            position: absolute;
            left: 48%;
            top: 260px;
          }
          p:nth-of-type(14) {
            position: absolute;
            position: absolute;
            left: 56%;
            top: 285px;
          }
          // .div_list {
          //   position: absolute;
          //   left: 10%;
          //   top: 350px;
          // }
        }
      }
    }
  }
  .div_list {
    position: relative;
    width: 100%;
    top: 360px;
    .slide_item {
      text-align: center;
      cursor: pointer;
    }
  }
}
</style>