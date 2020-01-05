<template>
  <!-- 入科流程 -->
  <div class="Department">
    <basic-container>
      <div class="left">
        <el-collapse v-model="activeNames">
          <!-- 待入科患者 -->
          <el-collapse-item title="待入科患者表" style=" font-size: 16px" name="1">
            <div>
              <avue-crud
                ref="crud"
                :page="page"
                :data="waitingData"
                :permission="permissionList"
                :table-loading="tableLoading"
                :option="waiting"
                @on-load="getwaiting"
                :cell-style="cellStyle1"
              >
                <template slot-scope="scope" slot="menu">
                  <el-button
                    v-if="permissions.icu_process_receive"
                    type="button"
                    size="mini"
                    icon="el-icon-menu"
                    @click="receive(scope.row,scope.index)"
                  >接收</el-button>
                </template>
              </avue-crud>
            </div>
          </el-collapse-item>
          <!-- 已入科患者 -->
          <el-collapse-item title="已入科患者表" name="2">
            <div>
              <avue-crud
                ref="crud"
                :page="pageTwo"
                :data="alreadyData"
                :permission="permissionList"
                :table-loading="tableLoading"
                :option="already"
                @on-load="getalready"
                @current-change="currentChange"
              >
                <template slot-scope="scope" slot="menu">
                  <el-button
                    v-if="permissions.icu_process_receive"
                    type="button"
                    size="mini"
                    icon="el-icon-menu"
                    @click="operation(scope.row,scope.index)"
                  >操作</el-button>
                </template>
              </avue-crud>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="right">
        <!-- 流程图 -->
        <div class="figure">
          <div
            v-for="item in NewPatient"
            :key="item.id"
            @click="changeType(item.id)"
            :class="item.inline?'dis':''"
          >
            <p>
              <img :class="item.flag?'el-button--primary':''" v-if="item.img !=''" :src="item.flag?item.ActImg:item.img" alt />
              <br v-if="item.img !=''" />
              <span v-if="item.title !='' ">{{item.title}}</span>
            </p>
          </div>
        </div>
      </div>
      <!-- 点击 床位表格 -->
      <el-dialog
        class="bads"
        title="床位查看"
        :visible.sync="beds"
        :fullscreen="isFullscreen"
        @close="bedsCancel()"
      >
        <avue-crud
          ref="crud"
          :page="pageThree"
          :data="badsData"
          :permission="permissionList"
          :table-loading="tableLoading"
          :option="bads"
          @on-load="getbedsLoad"
          :cell-style="cellStyle"
        >
          <template slot-scope="scope" slot="menu">
            <el-button
              v-if="permissions.icu_process_receive"
              type="button"
              size="mini"
              icon="el-icon-menu"
              @click="choose(scope.row,scope.index)"
              :loading="tableLoading"
            >选择</el-button>
          </template>
        </avue-crud>
        <div slot="footer" class="dialog-footer">
          <!-- <el-button type="primary" @click="confirm">保 存</el-button> -->
          <el-button @click="bedsCancel">取 消</el-button>
        </div>
      </el-dialog>
      <!-- 患者分配护士 -->
      <el-dialog title="患者分配护士" :visible.sync="distribution" :fullscreen="isFullscreen">
        <el-form :model="form">
          <!-- 患者信息 -->
          <div class="el-row avue-group__item" span:24>
            <div class="avue-group__header">
              <i class="el-icon-edit-outline avue-group__icon"></i>
              <h1 class="avue-group__title">患者信息</h1>
            </div>
            <el-row>
              <el-col
                class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
                style="padding-left: 10px; padding-right: 10px;"
              >
                <el-form-item label="患者姓名" :label-width="formLabelWidth">
                  <el-input disabled v-model="form.name" auto-complete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col
                class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
                style="padding-left: 10px; padding-right: 10px;"
              >
                <el-form-item label="患者性别" :label-width="formLabelWidth">
                  <el-radio-group v-model="form.gender" disabled auto-complete="off">
                    <el-radio label="0">女</el-radio>
                    <el-radio label="1">男</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col
                class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
                style="padding-left: 10px; padding-right: 10px;"
              >
                <el-form-item label="患者年龄" :label-width="formLabelWidth">
                  <el-input disabled v-model="form.prop" auto-complete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col
                class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
                style="padding-left: 10px; padding-right: 10px;"
              >
                <el-form-item label="入院时间" :label-width="formLabelWidth">
                  <el-date-picker
                    style="width:100%"
                    v-model="form.entranceTime"
                    type="datetime"
                    disabled
                    format="MM-dd HH:mm"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    auto-complete="off"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <!-- 护士分配 -->
          <div class="el-row avue-group__item" span:24>
            <div class="avue-group__header">
              <i class="el-icon-edit-outline avue-group__icon"></i>
              <h1 class="avue-group__title">护士分配</h1>
            </div>
            <div class="AllNurse">
              <el-button
                v-for="(item,index) in AllNurse"
                :key="index"
                :class="item.flagNurseId=='1'||flagId== item.id?'el-button el-button--primary':''"
                @click="choicePat(item, index,item.id,$event)"
              >{{item.realName}}</el-button>
            </div>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="confirm" :loading="tableLoading">保 存</el-button>
          <el-button @click="distributionCancel">取 消</el-button>
        </div>
      </el-dialog>
      <!-- RFID手环 -->
      <el-dialog title="分配RFID手环" :visible.sync="RFIDbracelet" :fullscreen="isFullscreen" style>
        <div style="text-align:center">
          <el-input id="inputFocus" style="width:50%" v-model="RFID" autofocus v-focus></el-input>
          <el-button type="primary" style="margin-left: 2%;" @click="read">读 取</el-button>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="confirm" :loading="tableLoading">保 存</el-button>
          <el-button @click="RFIDbraceletCancel">取 消</el-button>
        </div>
      </el-dialog>
      <!-- 入科评估 -->
      <beHospitalized
        ref="beHospitalized"
        :flowNames="flowName"
        :operationData="operationData"
        :NewPatient="NewPatient"
        :dataGetByPatient="dataGetByPatient"
        :Hospitalized="Hospitalized"
        :rowBadName="rowBadName"
        :pageTwo="pageTwo"
        :getalready="getalready"
      ></beHospitalized>
      <!-- 定制护理计划 -->
      <el-dialog
        title="预定护理计划"
        :visible.sync="nursingPlan"
        @close="nursingPlanCancel"
        :fullscreen="isFullscreen"
        width="60%"
      >
        <el-table :data="planData" border style="width: 100%;margin-top:1%">
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column label="调用任务模板名称" align="center" min-width="160">
            <template scope="scope">
              <el-select
                v-model="scope.row.planValue"
                style="width:100%"
                prop="planValue"
                placeholder="请选择"
                @change="taskTempChange(scope.row)"
              >
                <el-option
                  v-for="item in taskTemplateArr"
                  :key="item.id"
                  :label="item.templateContent"
                  :value="item.templateId"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="预开始时间" align="center" min-width="190">
            <template scope="scope">
              <el-date-picker
                @change="compareTime(1,scope.row)"
                v-model="scope.row.start"
                style="width:100%"
                type="datetime"
                placeholder="请选择开始时间"
                format="MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </template>
          </el-table-column>
          <el-table-column label="预结束时间" align="center" min-width="190">
            <template scope="scope">
              <el-date-picker
                @change="compareTime(2,scope.row)"
                v-model="scope.row.end"
                style="width:100%"
                type="datetime"
                placeholder="请选择结束时间"
                format="MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="cycle" label="循环" align="center" :min-width="200">
            <template scope="scope">
              <el-button
                v-if="!scope.row.cycle"
                type="text"
                size="medium"
                icon="el-icon-menu"
                @click="cycleClick(scope.$index)"
              >循环</el-button>
              <div v-if="scope.row.cycle">
                <el-input
                  v-model="scope.row.intervalTimes"
                  style="width:95px; margin-right:5px"
                  placeholder="间隔/小时"
                ></el-input>
                <el-button @click="returnClick(scope.$index)">返回</el-button>
              </div>
            </template>
          </el-table-column>-->
        </el-table>
        <el-table
          :data="childData"
          v-loading="loading"
          style="width: 100%;margin-top:10px"
          border
          stripe
          :header-cell-style="{background:'rgb(250, 250, 250)',color: 'rgba(0,0,0,.85)'}"
        >
          <el-table-column prop="taskContent" label="任务名称" align="center" width="180"></el-table-column>
          <el-table-column prop="taskDescribe" label="任务描述" align="center"></el-table-column>
          <el-table-column prop="preStartTime" label="预开始时间" width="180" align="center"></el-table-column>
          <el-table-column prop="preEndTime" label="预结束时间" width="180" align="center"></el-table-column>
          <el-table-column prop="intervalTime" label="间隔/小时" width="100" align="center"></el-table-column>
          <el-table-column prop="executionType" label="执行类型" width="100" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.executionType|executionTypeFl}}</span>
            </template>
          </el-table-column>
        </el-table>
        <!-- <div class="lineBtn">
          <el-button icon="el-icon-plus" @click="addLine" size="mini"></el-button>
          <el-button icon="el-icon-minus" @click="delLine" size="mini"></el-button>
        </div>-->
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="confirm" :loading="tableLoading">保 存</el-button>
          <el-button @click="nursingPlanCancel">取 消</el-button>
        </div>
      </el-dialog>
    </basic-container>
  </div>
</template>
<script>
import {
  addalready,
  delwaiting,
  fetchwaiting,
  fetchalready,
  fetchbeds,
  putObj,
  nursepatientrecordAdd,
  nursepatientrecordPreJump,
  operationBtn,
  processAdd,
  bedRecord,
  selectAll,
  getTaskTemplate,
  addTiming,
  addTasks,
  nurseInfo,
  bedRecordchangeBed,
  getByPatientId,
  entranceAssessRecord,
  getByPatient,
  nursepatientcorrelation,
  nursepatientrecordUpdate,
  pharmacyIp,
  putPatpatient,
  patientId,
  patientInScience,
  patientId_entryState
} from "@/api/icu/process/entryDepartment";
import { getSubTask } from "@/api/icu/nurse/taskList";
import {
  waiting,
  already,
  bads
} from "@/const/crud/icu/process/entryDepartment";
import { mapGetters } from "vuex";
import beHospitalized from "@/views/icu/process/beHospitalized";
import { fail } from "assert";

export default {
  name: "Tenant",
  filters: {
    executionTypeFl: data => {
      switch (data) {
        case 0:
          return "提醒";
        case 1:
          return "执行";
      }
    }
  },
  data() {
    return {
      childData: [],
      // 防重提交
      loading: false,
      routeObj: true,
      readRFTD: false,
      patientId: "",
      autofocus: true,
      // RFIDinput绑定
      RFID: "",
      // RFID手环
      RFIDbracelet: false,
      // 当前护士
      currentNurse: "",
      // 本流程高亮
      flowName: 1,
      // 护士ID
      nurseId: "",
      // 分配护士数据
      distributionNurse: "",
      flagId: "",
      // 入科患者ID
      dataPatientId: "",
      activeNames: "1",
      // 操作后获取的数据
      operationData: {},
      // 分配护士
      dialogFormVisible: false,
      formLabelWidth: "80px",
      form: {
        name: "",
        gender: "",
        prop: "",
        entranceTime: ""
      },
      AllNurse: [],
      devBtn: [],

      //  床位
      changeTypeId: "",
      beds: false,
      pageThree: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      bads: bads,
      // 分配护士
      distribution: false,
      // 护理计划
      none: false,
      // 护理计划患者id
      nursingPatientId: "",
      //任务模板数组
      taskTemplateArr: [],
      nursingPlan: false,
      planValue: [],
      submitPlanArr: [],
      submitTaskArr: [],
      cycleBtn: true, //循环
      // 护理任务渲染数据
      planData: [
        {
          task: "",
          start: "",
          end: "",
          cycle: 0,
          intervalTimes: "",
          name: "",
          planValue: "",
          taskName: "",
          taskDescribe: "",
          executionType: 1,
          templateSubTaskId: ""
        }
      ],
      // 主页面
      processFigure: false, //控制流程图点击
      // 流程图渲染
      NewPatient: [
        { id: -1 },
        {
          id: 1,
          title: "患者",
          ActImg: "/img/entryDepartment/lc_lan_1_01.png",
          img: "/img/entryDepartment//lc_hui_1_01.png",
          flag: false
        },
        {
          title: "",
          ActImg: "/img/entryDepartment/3jiantouxia.png",
          img: "/img/entryDepartment/3jiantouxia.png"
        },
        {
          id: 2,
          title: "床位分配",
          ActImg: "/img/entryDepartment/lc_lan_1_02.png",
          img: "/img/entryDepartment/lc_hui_1_02.png",
          flag: false,
          inline: true
        },
        {
          id: 3,
          title: "监护护士分配",
          ActImg: "/img/entryDepartment/lc_lan_1_03.png",
          img: "/img/entryDepartment/lc_hui_1_03.png",
          flag: false
        },
        {
          id: 4,
          title: "分配RFID手环",
          ActImg: "/img/entryDepartment/RFID_lan.png",
          img: "/img/entryDepartment/RFID.png",
          flag: false
        },
        {
          title: "",
          ActImg: "/img/entryDepartment/3jiantoushang.png",
          img: "/img/entryDepartment/3jiantoushang.png"
        },
        {
          id: 7,
          title: "入科",
          ActImg: "/img/entryDepartment/lc_lan_3_06.png",
          img: "/img/entryDepartment/lc_hui_3_06.png",
          flag: false
        },
        {
          title: "",
          ActImg: "/img/entryDepartment/lc_1_01.png",
          img: "/img/entryDepartment/lc_1_01.png"
        },
        {
          id: 5,
          title: "评估",
          ActImg: "/img/entryDepartment/lc_lan_1_04.png",
          img: "/img/entryDepartment/lc_hui_1_04.png",
          flag: false
        },
        {
          title: "",
          ActImg: "/img/entryDepartment/lc_1_02.png",
          img: "/img/entryDepartment/lc_1_02.png"
        },
        {
          inline: true,
          id: 11,
          title: "既往史",
          img: ""
        },
        {
          inline: true,
          id: 12,
          title: "家族史",
          img: ""
        },
        {
          inline: true,
          id: 13,
          title: "皮肤",
          img: ""
        },
        {
          inline: true,
          id: 14,
          title: "过敏史",
          img: ""
        },
        {
          inline: true,
          id: 15,
          title: "依从性",
          img: ""
        },
        {
          title: "",
          ActImg: "/img/entryDepartment/lc_1_02-03.png",
          img: "/img/entryDepartment/lc_1_02-03.png"
        },
        {
          id: 6,
          title: "定制护理计划",
          ActImg: "/img/entryDepartment/lc_lan_1_05.png",
          img: "/img/entryDepartment/lc_hui_1_05.png",
          flag: false
        }
      ],
      searchForm: {},
      waitingData: [],
      alreadyData: [],
      alreadyData1: [],
      badsData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 5, // 每页显示多少条
        pageSizes: [5, 10, 20, 30, 50] //每页可以显示多少条
      },
      pageTwo: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 5, // 每页显示多少条
        pageSizes: [5, 10, 20, 30, 50]
      },
      tableLoading: false,
      waiting: waiting,
      already: already,
      Hospitalized: {},
      dataGetByPatient: {},
      RFIDbraceletId: "",
      bedName: "",
      rowBadName: "",
      // replaceBedData: "",
      isFullscreen: false,
      screenWidth: document.body.clientWidth // 屏幕尺寸
    };
  },

  computed: {
    ...mapGetters(["permissions"]),
    permissionList() {
      return {
        receiveBtn: this.vaildData(this.permissions.icu_process_receive, false)
      };
    }
  },
  directives: {
    // RFID手环input默认选中 v-focus封装
    focus: function(el) {
      el.querySelector("#inputFocus").focus();
    }
  },
  mounted() {
    // 小屏幕全屏
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
    //判断时间
    compareTime(flag, row) {
      if (row.end != "" && row.start != "") {
        if (row.start > row.end) {
          this.$message({
            showClose: true,
            message: "开始时间晚于结束时间",
            type: "warning"
          });
          if (flag == 1) {
            row.start = "";
          } else {
            row.end = "";
          }
        }
      }
    },
    // 预定护理计划
    closePlan() {},
    // 拿到当前分页
    currentChange(val) {
      this.pageTwo.currentPage = val;
    },
    // 待入科数据
    getwaiting(page) {
      this.tableLoading = true;
      fetchwaiting(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize
          },
          this.searchForm
        )
      )
        .then(response => {
          this.waitingData = response.data.data.records;
          patientId_entryState().then(data => {
            let EntryState = data.data.data;
            for (const i in this.waitingData) {
              for (const j in EntryState) {
                if (
                  this.waitingData[i].entryState == Number(EntryState[j].value)
                ) {
                  this.waitingData[i].entryState = EntryState[j].label;
                }
              }
            }
          });
          this.page.total = response.data.data.total;
          this.tableLoading = false;
        })
        .catch(() => {
          this.tableLoading = false;
        });
    },
    // 已入科数据
    getalready(pageTwo) {
      this.tableLoading = true;
      fetchalready(
        Object.assign(
          {
            current: pageTwo.currentPage,
            size: pageTwo.pageSize
          },
          this.searchForm
        )
      )
        .then(response => {
          this.alreadyData = response.data.data.records;
          patientId_entryState().then(data => {
            let EntryState = data.data.data;
            for (const i in this.alreadyData) {
              for (const j in EntryState) {
                if (
                  this.alreadyData[i].entryState == Number(EntryState[j].value)
                ) {
                  this.alreadyData[i].entryState = EntryState[j].label;
                }
              }
            }
          });
          this.pageTwo.total = response.data.data.total;
          this.tableLoading = false;
        })
        .catch(() => {
          this.tableLoading = false;
        });
    },
    // 床位数据
    getbedsLoad(pageThree, params) {
      this.tableLoading = true;
      fetchbeds(
        Object.assign(
          {
            current: pageThree.currentPage,
            size: pageThree.pageSize
          },
          params,
          this.searchForm
        )
      )
        .then(response => {
          this.badsData = response.data.data.records;
          this.pageThree.total = response.data.data.total;
          this.tableLoading = false;
        })
        .catch(() => {
          this.tableLoading = false;
        });
    },
    // 入科
    receive(row, done, loading, index) {
      // 数据初始化
      this.nursingPatientId = "";
      this.nursingPatientId = row.patientId;
      this.hospitalnumber = row.hospitalnumber;
      var _this = this;
      this.processFigure = false;
      this.distributionNurse = row;
      for (let i in this.NewPatient) {
        this.NewPatient[i].flag = false;
      }
      this.$forceUpdate(); //强制页面进行刷新
      if (row.entryState == "待入科") {
        // 接受患者
        delwaiting(row.id).then(data => {
          _this.dataPatientId = data.data.data;
          _this.nursingPatientId = data.data.data;
          _this.operationData.patientId = data.data.data;
          // _this.waitingData.splice(index, 1);
          this.getwaiting(this.page);
          this.getalready(this.pageTwo);
          this.processFigure = true;

          // _this.$message({
          //   showClose: true,
          //   message: "患者进入已入科列表",
          //   type: "success"
          // });
          // 创建流程
          var dataPatientId = _this.dataPatientId;
          processAdd(_this.flowName, dataPatientId).then(resData => {
            operationBtn(_this.flowName, dataPatientId).then(res => {
              _this.patientId = res.data.data.patientId;
              _this.operationData = res.data.data;
              getByPatientId(_this.patientId).then(response => {
                _this.Hospitalized = response.data.data;
                _this.distributionNurse = response.data.data;
              });
            });
            _this.NewPatient[1].title = row.name;
            _this.NewPatient[1].flag = true;
          });
        });
      } else {
        this.nursingPatientId = "";
        this.nursingPatientId = row.patientId;
        operationBtn(_this.flowName, row.patientId)
          .then(data => {
            if (data.data.msg == "0") {
              this.patientId = data.data.data.patientId;
              for (let y in this.NewPatient) {
                this.NewPatient[y].flag = false;
              }
              this.operationData = data.data.data;
              getByPatientId(_this.patientId).then(res => {
                this.Hospitalized = res.data.data;
                _this.distributionNurse = res.data.data;
              });
              this.NewPatient[1].title = this.operationData.patientName;
              // 判断是否有流程 已有就高亮
              if (this.operationData.specificStepId.indexOf(",") == -1) {
                this.NewPatient[1].flag = true;
                this.processFigure = true;
              } else {
                var arr = [];
                arr = this.operationData.specificStepId.split(",");
                this.processFigure = true;
                for (let i in arr) {
                  for (let j in this.NewPatient) {
                    if (this.NewPatient[j].id == arr[i]) {
                      if (arr[i] == 1) {
                        this.NewPatient[1].flag = true;
                      }
                      if (arr[i] == 2) {
                        this.NewPatient[j].flag = true;
                      }
                      if (arr[i] == 3) {
                        this.NewPatient[j].flag = true;
                      }
                      if (arr[i] == 4) {
                        this.NewPatient[j].flag = true;
                      }
                      if (arr[i] == 5) {
                        this.NewPatient[j].flag = true;
                      }
                      if (arr[i] == 6) {
                        this.NewPatient[j].flag = true;
                      }
                      if (arr[i] == 7) {
                        this.NewPatient[j].flag = true;
                      }
                    }
                  }
                }
              }
            } else {
              // 数据清空
              this.NewPatient[1].title = "患者";
              this.NewPatient[1].flag = false;
              this.NewPatient[3].flag = false;
              this.NewPatient[4].flag = false;
              this.NewPatient[5].flag = false;
              this.NewPatient[7].flag = false;
              this.NewPatient[9].flag = false;
              this.NewPatient[17].flag = false;
              this.processFigure = false;
              processAdd(_this.flowName, row.patientId).then(resquest => {
                operationBtn(_this.flowName, row.patientId).then(resData => {
                  _this.patientId = resData.data.data.patientId;
                  getByPatientId(_this.patientId).then(res => {
                    this.Hospitalized = res.data.data;
                    _this.distributionNurse = res.data.data;
                  });
                  _this.operationData = resData.data.data;
                  _this.NewPatient[1].title = row.name;
                  _this.NewPatient[1].flag = true;
                  _this.processFigure = true;
                  if (this.operationData.specificStepId.indexOf(",") == -1) {
                    this.NewPatient[1].flag = true;
                    this.processFigure = true;
                  } else {
                    var arr = [];
                    arr = this.operationData.specificStepId.split(",");
                    this.processFigure = true;
                    for (let i in arr) {
                      for (let j in this.NewPatient) {
                        if (this.NewPatient[j].id == arr[i]) {
                          if (arr[i] == 1) {
                            this.NewPatient[1].flag = true;
                          }
                          if (arr[i] == 2) {
                            this.NewPatient[j].flag = true;
                          }
                          if (arr[i] == 3) {
                            this.NewPatient[j].flag = true;
                          }
                          if (arr[i] == 4) {
                            this.NewPatient[j].flag = true;
                          }
                          if (arr[i] == 5) {
                            this.NewPatient[j].flag = true;
                          }
                          if (arr[i] == 6) {
                            this.NewPatient[j].flag = true;
                          }
                          if (arr[i] == 7) {
                            this.NewPatient[j].flag = true;
                          }
                        }
                      }
                    }
                  }
                });
              });
            }
          })
          // 创建流程
          .catch(() => {});
      }
    },

    // 操作
    operation(row, done, loading, index) {
      this.nursingPatientId = "";
      this.nursingPatientId = row.patientId;
      let _this = this;
      this.distributionNurse = row;
      operationBtn(_this.flowName, row.patientId)
        .then(data => {
          if (data.data.msg == "0") {
            this.patientId = data.data.data.patientId;
            for (let y in this.NewPatient) {
              this.NewPatient[y].flag = false;
            }
            this.operationData = data.data.data;
            getByPatientId(_this.patientId).then(res => {
              this.Hospitalized = res.data.data;
            });
            this.NewPatient[1].title = this.operationData.patientName;
            // 判断是否有流程 已有就高亮
            if (this.operationData.specificStepId.indexOf(",") == -1) {
              this.NewPatient[1].flag = true;
              this.processFigure = true;
            } else {
              var arr = [];
              arr = this.operationData.specificStepId.split(",");
              this.processFigure = true;
              for (let i in arr) {
                for (let j in this.NewPatient) {
                  if (this.NewPatient[j].id == arr[i]) {
                    if (arr[i] == 1) {
                      this.NewPatient[1].flag = true;
                    }
                    if (arr[i] == 2) {
                      this.NewPatient[j].flag = true;
                    }
                    if (arr[i] == 3) {
                      this.NewPatient[j].flag = true;
                    }
                    if (arr[i] == 4) {
                      this.NewPatient[j].flag = true;
                    }
                    if (arr[i] == 5) {
                      this.NewPatient[j].flag = true;
                    }
                    if (arr[i] == 6) {
                      this.NewPatient[j].flag = true;
                    }
                    if (arr[i] == 7) {
                      this.NewPatient[j].flag = true;
                    }
                  }
                }
              }
            }
          } else {
            // 数据清空
            this.NewPatient[1].title = "患者";
            this.NewPatient[1].flag = false;
            this.NewPatient[3].flag = false;
            this.NewPatient[4].flag = false;
            this.NewPatient[5].flag = false;
            this.NewPatient[7].flag = false;
            this.NewPatient[9].flag = false;
            this.NewPatient[17].flag = false;
            this.processFigure = false;
            processAdd(_this.flowName, row.patientId).then(resquest => {
              operationBtn(_this.flowName, row.patientId).then(resData => {
                _this.patientId = resData.data.data.patientId;
                getByPatientId(_this.patientId).then(res => {
                  this.Hospitalized = res.data.data;
                });
                _this.operationData = resData.data.data;
                _this.NewPatient[1].title = row.name;
                _this.NewPatient[1].flag = true;
                _this.processFigure = true;
                if (this.operationData.specificStepId.indexOf(",") == -1) {
                  this.NewPatient[1].flag = true;
                  this.processFigure = true;
                } else {
                  var arr = [];
                  arr = this.operationData.specificStepId.split(",");
                  this.processFigure = true;
                  for (let i in arr) {
                    for (let j in this.NewPatient) {
                      if (this.NewPatient[j].id == arr[i]) {
                        if (arr[i] == 1) {
                          this.NewPatient[1].flag = true;
                        }
                        if (arr[i] == 2) {
                          this.NewPatient[j].flag = true;
                        }
                        if (arr[i] == 3) {
                          this.NewPatient[j].flag = true;
                        }
                        if (arr[i] == 4) {
                          this.NewPatient[j].flag = true;
                        }
                        if (arr[i] == 5) {
                          this.NewPatient[j].flag = true;
                        }
                        if (arr[i] == 6) {
                          this.NewPatient[j].flag = true;
                        }
                        if (arr[i] == 7) {
                          this.NewPatient[j].flag = true;
                        }
                      }
                    }
                  }
                }
              });
            });
          }
        })
        // 创建流程
        .catch(() => {});
    },
    // 患者状态变色
    cellStyle1({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 5) {
        if (row.entryState == "待入科") {
          return {
            color: "#00e9a0"
          };
        } else if (row.entryState == "入科中") {
          return {
            color: "#ff7f5f"
          };
        }
      }
    },
    // 床位状态变色，患者自己的床位变色
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (this.Hospitalized.admissionBeds != null) {
        if (row.bedId == this.Hospitalized.admissionBeds) {
          return {
            background: "rgb(232, 251, 255)"
          };
        }
      }
      if (columnIndex == 2) {
        if (row.useFlag == 0) {
          return {
            color: "#00e9a0"
          };
        } else if (row.useFlag == 1) {
          return {
            color: "#ff7f5f"
          };
        } else {
          return {
            color: "#909399"
          };
        }
      }
    },
    // 床位选择
    choose(row, index) {
      this.tableLoading = true;
      var _this = this;
      // 不允许点击已使用的床位
      if (row.useFlag == 0) {
        // 判断是修改还是新增床位
        if (
          this.Hospitalized.admissionBeds == null ||
          this.Hospitalized.admissionBeds == "无"
        ) {
          _this
            .$confirm("是否选择" + row.bedName, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
            .then(function() {
              // bedId = row.bedId;
              // patientId = this.operationData.patientId;
              return bedRecord(row.bedId, _this.operationData.patientId);
            })
            .then(data => {
              _this.$message({
                showClose: true,
                message: "床位分配成功",
                type: "success"
              });
              getByPatientId(_this.patientId).then(res => {
                this.Hospitalized = res.data.data;
              });
              // this.replaceBedData = row;
              this.rowBadName = row.bedName;
              // 高亮
              let flowName = Number(this.flowName);
              let specificStepId = 2;
              putObj(flowName, _this.operationData.id, specificStepId);
              this.tableLoading = false;
              this.beds = false;
              this.NewPatient[3].flag = true;
              this.getalready(this.pageTwo);
              this.$forceUpdate(); //强制页面进行刷新
            })
            .catch(() => {
              this.tableLoading = false;
            });
        } else {
          _this
            .$confirm("是否更换" + row.bedName, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
            .then(function() {
              return bedRecordchangeBed(
                row.bedId,
                _this.operationData.patientId
              );
            })
            .then(data => {
              this.rowBadName = row.bedName;
              _this.$message({
                showClose: true,
                message: "床位更换成功",
                type: "success"
              });
              getByPatientId(_this.patientId).then(res => {
                this.Hospitalized = res.data.data;
              });
              // this.replaceBedData = row;
              this.getbedsLoad(this.pageThree);
              this.getalready(this.pageTwo);
              this.beds = false;
              this.tableLoading = false;
              this.$forceUpdate(); //强制页面进行刷新
            })
            .catch(() => {
              this.tableLoading = false;
            });
        }
      } else {
        this.$alert("该床位已经使用", "床位", {
          confirmButtonText: "确定"
        })
          .then(() => {
            this.getbedsLoad(this.pageThree);
          })
          .catch(() => {
            this.getbedsLoad(this.pageThree);
          });
      }
    },

    // 流程图id
    changeType(id) {
      this.changeTypeId = id;
      for (let i in this.NewPatient) {
        if (this.processFigure == false) {
          break;
        } else {
          if (this.NewPatient[i].id === this.changeTypeId) {
            if (this.changeTypeId === 1) {
              return false;
            }
            if (this.changeTypeId === 2) {
              // 床位
              this.beds = true;
              this.getbedsLoad(this.pageThree);
            }
            if (this.changeTypeId === 3) {
              // 分配护士
              this.distribution = true;
              this.form.name = this.distributionNurse.name;
              this.form.gender = this.distributionNurse.gender;
              this.form.prop = this.distributionNurse.age;
              this.form.entranceTime = this.distributionNurse.timeOfAdmission;
              this.nursepatient();
            }
            if (this.changeTypeId === 4) {
              // 分配RFID手环
              this.RFIDbracelet = true;
              this.readRFTD = false;
              // 获取id
              // let patientIdId = this.distributionNurse.patientId
              patientId(this.distributionNurse.patientId).then(res => {
                this.RFIDbraceletId = res.data.data;
              });
              this.$forceUpdate(); //强制页面进行刷新
            }
            if (this.changeTypeId === 5) {
              // 评估
              // this.instance.close();
              if (this.NewPatient[7].flag == true) {
                this.$refs.beHospitalized.evaluation = true;
                this.$refs.beHospitalized.patientInfo();
                if (this.NewPatient[9].flag == true) {
                  let _this = this;
                  getByPatient(_this.patientId).then(data => {
                    // 拿到的数据进行拆解格式化
                    this.dataGetByPatient = data.data.data[0];
                    if (this.dataGetByPatient.allergenicFood == null) {
                      var allergenicFood = [];
                    } else {
                      var allergenicFood = this.dataGetByPatient.allergenicFood.split(
                        "-"
                      );
                    }
                    if (this.dataGetByPatient.dataSource == null) {
                      var dataSource = [];
                    } else {
                      var dataSource = this.dataGetByPatient.dataSource.split(
                        "-"
                      );
                    }
                    if (this.dataGetByPatient.drugAllergy == null) {
                      var drugAllergy = [];
                    } else {
                      var drugAllergy = this.dataGetByPatient.drugAllergy.split(
                        "-"
                      );
                    }
                    if (this.dataGetByPatient.familyHistory == null) {
                      var familyHistory = [];
                    } else {
                      var familyHistory = this.dataGetByPatient.familyHistory.split(
                        "-"
                      );
                    }
                    if (this.dataGetByPatient.otherAllergens == null) {
                      var otherAllergens = [];
                    } else {
                      var otherAllergens = this.dataGetByPatient.otherAllergens.split(
                        "-"
                      );
                    }
                    if (this.dataGetByPatient.previousHistory == null) {
                      var previousHistory = [];
                    } else {
                      var previousHistory = this.dataGetByPatient.previousHistory.split(
                        "-"
                      );
                    }
                    if (this.dataGetByPatient.skinCase == null) {
                      var skinCase = [];
                    } else {
                      var skinCase = this.dataGetByPatient.skinCase.split("-");
                    }
                    if (this.dataGetByPatient.socialSupport == null) {
                      var socialSupport = [];
                    } else {
                      var socialSupport = this.dataGetByPatient.socialSupport.split(
                        "-"
                      );
                    }
                    if (this.dataGetByPatient.specialCrowdRemarks == null) {
                      var specialCrowdRemarks = [];
                    } else {
                      var specialCrowdRemarks = this.dataGetByPatient.specialCrowdRemarks.split(
                        "-"
                      );
                    }
                    // 进行赋值
                    this.$refs.beHospitalized.ruleForm.allergenicFood = allergenicFood;
                    this.$refs.beHospitalized.ruleForm.allergenicFoodRemarks = this.dataGetByPatient.allergenicFoodRemarks;
                    this.$refs.beHospitalized.ruleForm.communicationBarriers = this.dataGetByPatient.communicationBarriers;
                    this.$refs.beHospitalized.ruleForm.communicationBarriersRemarks = this.dataGetByPatient.communicationBarriersRemarks;
                    this.$refs.beHospitalized.ruleForm.dataSource = dataSource;
                    this.$refs.beHospitalized.ruleForm.dataSourceRemarks = this.dataGetByPatient.dataSourceRemarks;
                    this.$refs.beHospitalized.ruleForm.drugAllergy = drugAllergy;
                    this.$refs.beHospitalized.ruleForm.drugAllergyRemarks = this.dataGetByPatient.drugAllergyRemarks;
                    this.$refs.beHospitalized.ruleForm.entranceDiagnose = this.dataGetByPatient.entranceDiagnose;
                    this.$refs.beHospitalized.ruleForm.entrancePathway = this.dataGetByPatient.entrancePathway;
                    this.$refs.beHospitalized.ruleForm.familyHistory = familyHistory;
                    this.$refs.beHospitalized.ruleForm.familyHistoryRemarks = this.dataGetByPatient.familyHistoryRemarks;
                    this.$refs.beHospitalized.ruleForm.otherAllergens = otherAllergens;
                    this.$refs.beHospitalized.ruleForm.otherAllergensRemarks = this.dataGetByPatient.otherAllergensRemarks;
                    this.$refs.beHospitalized.ruleForm.patientAddress = this.dataGetByPatient.patientAddress;
                    this.$refs.beHospitalized.ruleForm.patientCostSource = this.dataGetByPatient.patientCostSource;
                    this.$refs.beHospitalized.ruleForm.patientCulture = this.dataGetByPatient.patientCulture;
                    this.$refs.beHospitalized.ruleForm.patientDrink = this.dataGetByPatient.patientDrink;
                    this.$refs.beHospitalized.ruleForm.patientDrinkRemarks = this.dataGetByPatient.patientDrinkRemarks;
                    this.$refs.beHospitalized.ruleForm.patientDwellingState = this.dataGetByPatient.patientDwellingState;
                    this.$refs.beHospitalized.ruleForm.patientEconomySource = this.dataGetByPatient.patientEconomySource;
                    this.$refs.beHospitalized.ruleForm.patientMarriage = this.dataGetByPatient.patientMarriage;
                    this.$refs.beHospitalized.ruleForm.patientNation = this.dataGetByPatient.patientNation;
                    this.$refs.beHospitalized.ruleForm.patientPhone = this.dataGetByPatient.patientPhone;
                    this.$refs.beHospitalized.ruleForm.patientProfession = this.dataGetByPatient.patientProfession;
                    this.$refs.beHospitalized.ruleForm.patientReligionDemand = this.dataGetByPatient.patientReligionDemand;
                    this.$refs.beHospitalized.ruleForm.patientReligionDemandRemarks = this.dataGetByPatient.patientReligionDemandRemarks;
                    this.$refs.beHospitalized.ruleForm.patientReligionFaith = this.dataGetByPatient.patientReligionFaith;
                    this.$refs.beHospitalized.ruleForm.patientSmoke = this.dataGetByPatient.patientSmoke;
                    this.$refs.beHospitalized.ruleForm.patientSmokeRemarks = this.dataGetByPatient.patientSmokeRemarks;
                    this.$refs.beHospitalized.ruleForm.previousHistory = previousHistory;
                    this.$refs.beHospitalized.ruleForm.previousHistoryRemarks = this.dataGetByPatient.previousHistoryRemarks;
                    this.$refs.beHospitalized.ruleForm.skinCase = skinCase;
                    this.$refs.beHospitalized.ruleForm.skinCaseRemarks = this.dataGetByPatient.skinCaseRemarks;
                    this.$refs.beHospitalized.ruleForm.socialSupportRemarks = this.dataGetByPatient.socialSupportRemarks;
                    this.$refs.beHospitalized.ruleForm.specialCrowd = this.dataGetByPatient.specialCrowd;
                    this.$refs.beHospitalized.ruleForm.socialSupport = socialSupport;
                    this.$refs.beHospitalized.ruleForm.specialCrowdRemarks = specialCrowdRemarks;
                    this.$refs.beHospitalized.ruleForm.treatmentCompliance = this.dataGetByPatient.treatmentCompliance;
                    // 调用子对象方法
                    this.$refs.beHospitalized.specialDis();
                    this.$refs.beHospitalized.typeDis();
                    this.$refs.beHospitalized.communicationDis();
                    this.$refs.beHospitalized.medicalDis();
                    this.$refs.beHospitalized.familyDis();
                    this.$refs.beHospitalized.drugDis();
                    this.$refs.beHospitalized.foodDis();
                    this.$refs.beHospitalized.allergicSourceDis();
                    this.$refs.beHospitalized.skinDis();
                    this.$refs.beHospitalized.religiousNeedsDis();
                    this.$refs.beHospitalized.socialSupportDis();
                    this.$refs.beHospitalized.complianceDis();
                    this.$refs.beHospitalized.drinkingDis();
                  });
                }
              } else {
                this.$alert("请先完成入科", "患者评估", {
                  confirmButtonText: "确定"
                });
              }
            }
            if (this.changeTypeId === 6) {
              // 护理计划
              if (this.NewPatient[7].flag == true) {
                this.nursingPlan = true;
                getTaskTemplate().then(response => {
                  this.taskTemplateArr = response.data.data;
                  // console.log(this.taskTemplateArr);
                });
              } else {
                this.$alert("请先完成入科", "预定护理计划", {
                  confirmButtonText: "确定"
                });
              }
            }
            if (this.changeTypeId === 7) {
              // 在床位 分配护士 RFID手环 高亮后才可以点击入科
              if (this.NewPatient[3].flag == true) {
                if (this.NewPatient[4].flag == true) {
                  if (this.NewPatient[5].flag == true) {
                    if (this.NewPatient[7].flag == false) {
                      this.$confirm(
                        "是否入科患者" + this.operationData.patientName,
                        "提示",
                        {
                          confirmButtonText: "确定",
                          cancelButtonText: "取消",
                          type: "warning"
                        }
                      )
                        .then(() => {
                          let _this = this;
                          patientInScience(_this.operationData.patientId).then(
                            data => {
                              this.$message({
                                type: "success",
                                message: "入科成功!"
                              });
                              // for (const a in _this.waitingData) {
                              //   if (
                              //     _this.distributionNurse.patientId ==
                              //     _this.waitingData[a].patientId
                              //   ) {
                              //     // this.waitingData.splice(a, 1);

                              //   }
                              // }
                              this.getwaiting(this.page);
                              this.activeNames = "2";
                              _this.NewPatient[7].flag = true;
                              let flowName = Number(this.flowName);
                              let specificStepId = 7;
                              this.getalready(this.pageTwo);
                              putObj(
                                flowName,
                                _this.operationData.id,
                                specificStepId
                              );
                              this.$store.dispatch("getAllPatients");
                              _this.$forceUpdate(); //强制页面进行刷新
                            }
                          );
                        })
                        .catch(() => {});
                    }
                  } else {
                    this.$alert("请先分配患者RFID手环", "入科", {
                      confirmButtonText: "确定"
                    });
                  }
                } else {
                  this.$alert("请先分配监控护士", "入科", {
                    confirmButtonText: "确定"
                  });
                }
              } else {
                this.$alert("请先分配床位", "入科", {
                  confirmButtonText: "确定"
                });
              }
            }
          }
        }
      }
    },

    // 床位取消按钮
    bedsCancel() {
      this.beds = false;
      this.pageThree = {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条
        pageSizes: [10, 20]
      };
    },

    // 确定按钮
    confirm(row, index) {
      var _this = this;
      this.tableLoading = true;
      let id = row.id;
      for (let i in this.NewPatient) {
        if (this.NewPatient[i].id === this.changeTypeId) {
          if (this.changeTypeId === 1) {
            return false;
          }
          // if (this.changeTypeId === 2) {
          //   this.NewPatient[i].flag = true;
          //   this.beds = false;
          //   let specificStepId = 2;
          //   putObj(id,specificStepId);
          // }
          if (this.changeTypeId === 3) {
            // 分配护士
            // 判断是否分配护士了,不可修改
            if (this.NewPatient[i].flag == false) {
              // 是否分配默认护士
              // 是
              if (this.nurseId == "") {
                var onlyDutyNurse = "0";
                var nurseId = this.currentNurse.nurseId;
                var patientsPatientId = this.distributionNurse.patientId;
                nursepatientrecordAdd(onlyDutyNurse, nurseId, patientsPatientId)
                  .then(data => {
                    _this.$message({
                      showClose: true,
                      message: "分配责任护士成功",
                      type: "success"
                    });
                    if (this.operationData.specificStepId.indexOf("3") == -1) {
                      let flowName = Number(this.flowName);
                      let specificStepId = 3;
                      putObj(flowName, _this.operationData.id, specificStepId);
                    }
                    this.tableLoading = false;
                  })
                  .catch(() => {
                    this.tableLoading = false;
                  });
              } else {
                // 否
                var onlyDutyNurse = "0";
                var nurseId = this.nurseId;
                var patientsPatientId = this.distributionNurse.patientId;
                nursepatientrecordAdd(onlyDutyNurse, nurseId, patientsPatientId)
                  .then(data => {
                    _this.$message({
                      showClose: true,
                      message: "分配责任护士成功",
                      type: "success"
                    });
                    if (this.operationData.specificStepId.indexOf("3") == -1) {
                      let flowName = Number(this.flowName);
                      let specificStepId = 3;
                      putObj(flowName, _this.operationData.id, specificStepId);
                    }
                    this.tableLoading = false;
                  })
                  .catch(() => {
                    this.tableLoading = false;
                  });
              }
            } else {
              this.tableLoading = false;
              this.$message({
                showClose: true,
                message: "已经分配责任护士,不可修改",
                type: "warning"
              });
            }
            this.NewPatient[i].flag = true;
            this.distribution = false;
            this.nurseId = "";
            this.flagId = "";
            this.nurseId = "";
            // putObj(id, specificStepId);
          }
          if (this.changeTypeId === 4) {
            // 分配RFID手环
            if (this.RFID == "") {
              this.tableLoading = false;
              this.$message.error("患者RFID不能为空");
            } else {
              this.RFIDbracelet = false;
              let obj = {
                id: this.RFIDbraceletId,
                rfidId: this.RFID
              };
              putPatpatient(obj).then(data => {
                this.$message({
                  showClose: true,
                  message: "分配RFID手环成功",
                  type: "success"
                });
                this.RFID = "";
                if (this.operationData.specificStepId.indexOf("4") == -1) {
                  let flowName = Number(this.flowName);
                  let specificStepId = 4;
                  putObj(flowName, _this.operationData.id, specificStepId);
                }
              });
              this.tableLoading = false;
              this.NewPatient[i].flag = true;
            }
          }
          if (this.changeTypeId === 6) {
            // 护理计划
            this.submitPlanArr = [];
            this.submitTaskArr = [];
            var ifCon = false;
            // console.log(this.taskTemplateArr)
            for (let k in this.planData) {
              if (this.planData[k].planValue !== "") {
                ifCon = true;
                for (let j in this.taskTemplateArr) {
                  if (
                    this.planData[k].planValue ==
                    this.taskTemplateArr[j].templateId
                  ) {
                    this.planData[k].result = this.taskTemplateArr[j].result;
                    this.planData[k].taskName = this.taskTemplateArr[
                      j
                    ].templateContent;
                    this.planData[k].taskDescribe = this.taskTemplateArr[
                      j
                    ].templateDescribe;
                    this.planData[k].taskType = 3;
                    this.planData[k].executionType = 1;
                    this.planData[k].patientId = this.patientId;
                  }
                }
                if (
                  this.planData[k].start == "" ||
                  this.planData[k].start == null
                ) {
                  this.$message({
                    type: "warning",
                    message: "请输入预执行开始时间"
                  });
                  this.tableLoading = false;
                  return;
                } else {
                  if (
                    this.planData[k].end == "" ||
                    this.planData[k].end == null
                  ) {
                    this.$message({
                      type: "warning",
                      message: "请输入预执行结束时间"
                    });
                    this.tableLoading = false;
                    return;
                  } else {
                    // if (this.planData[k].cycle == 1) {
                    //   if (
                    //     this.planData[k].intervalTimes > 12 ||
                    //     this.planData[k].intervalTimes < 1
                    //   ) {
                    //     this.$message({
                    //       type: "warning",
                    //       showClose: true,
                    //       message: "时间间隔为1~12的整数"
                    //     });
                    //     return;
                    //   } else {
                    //     // 长期任务
                    //     this.planData[k].taskType = 3;
                    //     this.planData[k].source = 8;
                    //     this.planData[k].patientId = this.patientId;
                    //     this.planData[k].preStartTime = this.planData[k].start;
                    //     this.planData[k].preEndTime = this.planData[k].end;
                    //     this.planData[k].templateSubTaskId = this.planData[
                    //       k
                    //     ].planValue;
                    //     this.planData[k].sourceId = this.planData[
                    //       k
                    //     ].templateSubTaskId;
                    //     this.planData[k].intervalTimes = this.planData[
                    //       k
                    //     ].intervalTimes;
                    //     this.submitPlanArr.push(this.planData[k]);
                    //   }
                    // }
                    if (this.planData[k].cycle == 0) {
                      // 短期任务
                      this.planData[k].taskType = 3;
                      this.planData[k].source = 8;
                      this.planData[k].patientId = this.patientId;
                      this.planData[k].preStartTime = this.planData[k].start;
                      this.planData[k].preEndTime = this.planData[k].end;
                      this.planData[k].taskTypeId = this.planData[k].planValue;
                      // this.submitTaskArr.push(this.planData[k]);
                      // if (this.submitTaskArr.length > 0) {
                      addTasks(this.planData[0]).then(response => {
                        this.$message({
                          type: "success",
                          showClose: true,
                          message: "任务添加成功"
                        });
                        this.childData = [];
                        this.nursingPlan = false;
                      });
                      this.NewPatient[i].flag = true;
                      if (
                        this.operationData.specificStepId.indexOf("6") == -1
                      ) {
                        let flowName = Number(this.flowName);
                        let specificStepId = 6;
                        putObj(
                          flowName,
                          _this.operationData.id,
                          specificStepId
                        );
                      }
                      this.tableLoading = false;
                      this.getwaiting(this.page);
                      this.getalready(this.pageTwo);
                      // }
                    }
                  }
                }
              } else {
              }
            }
            // console.log(this.planData);
            if (ifCon == false) {
              this.$message({
                type: "error",
                showClose: true,
                message: "请最少输入一项任务"
              });
              this.tableLoading = false;
            }
            if (this.submitPlanArr.length > 0) {
              addTiming(this.submitPlanArr).then(response => {
                this.$message({
                  type: "success",
                  showClose: true,
                  message: "定时任务添加成功"
                });
                this.nursingPlan = false;
                this.NewPatient[i].flag = true;
                if (this.operationData.specificStepId.indexOf("6") == -1) {
                  let flowName = Number(this.flowName);
                  let specificStepId = 6;
                  putObj(flowName, _this.operationData.id, specificStepId);
                }
                this.tableLoading = false;
                this.getwaiting(this.page);
                this.getalready(this.pageTwo);
              });
            }
          }
        }
      }
    },
    //护理计划提交
    taskTempChange(row) {
      // console.log(row);
      this.loading = true;
      for (let i in this.taskTemplateArr) {
        if (row.planValue == this.taskTemplateArr[i].templateId) {
          row.result = this.taskTemplateArr[i].result;
          row.taskName = this.taskTemplateArr[i].templateContent;
          row.taskDescribe = this.taskTemplateArr[i].templateDescribe;
          row.taskType = 3;
        }
      }
      getSubTask(row.planValue).then(response => {
        this.childData = response.data.data;
        this.loading = false;
      });
    },
    // 护士分配
    // 查询接口
    nursepatient() {
      var _this = this;
      this.AllNurse = "";
      nursepatientrecordPreJump().then(response => {
        this.AllNurse = response.data.data;
        if (this.NewPatient[4].flag == true) {
          let patienNurseId = {
            patientId: this.nursingPatientId,
            onlyDutyNurse: 0
          };
          nursepatientcorrelation(patienNurseId).then(res => {
            for (const b in _this.AllNurse) {
              if (
                res.data.data.records[0].nurseId == _this.AllNurse[b].nurseId
              ) {
                _this.AllNurse[b].flagNurseId = "1";
                _this.$forceUpdate(); //强制页面进行刷新
              }
            }
          });
        } else {
          for (const v in this.AllNurse) {
            if (this.currentNurse.nurseId == this.AllNurse[v].nurseId) {
              this.AllNurse[v].flagNurseId = "1";
              _this.$forceUpdate(); //强制页面进行刷新
            }
          }
        }
      });
    },
    // 查询登录的是哪一个护士
    nurseInfoReq() {
      nurseInfo().then(response => {
        this.currentNurse = response.data.data;
      });
    },
    // 护士分配取消
    distributionCancel() {
      this.nurseId = "";
      this.flagId = "";
      this.nurseId = "";
      this.distribution = false;
    },
    // 护士排班
    choicePat(item, index, id, e) {
      for (const i in this.AllNurse) {
        this.AllNurse[i].flagNurseId = "";
      }
      this.nurseId = "";
      this.flagId = item.id;
      this.nurseId = item.nurseId;
    },
    // 护理计划
    getselectAll(pageThree, params) {
      this.tableLoading = true;
      selectAll(Object.assign(params, this.searchForm))
        .then(response => {
          this.planValue = response.data.data.records;
          this.tableLoading = false;
        })
        .catch(() => {
          this.tableLoading = false;
        });
    },
    // 护理计划取消按钮
    nursingPlanCancel() {
      this.childData = [];
      // this.NewPatient[16].flag = false;
      this.nursingPlan = false;
      this.submitPlanArr = [];
      this.submitTaskArr = [];
      this.planValue = [];
      this.planData = [
        {
          task: "",
          start: "",
          end: "",
          cycle: 0,
          intervalTimes: "",
          name: "",
          planValue: "",
          taskName: "",
          executionType: 1,
          taskDescribe: "",
          templateSubTaskId: ""
        }
      ];
    },

    // 循环点击 显示间隔
    cycleClick(index1) {
      this.planData.forEach((item, index) => {
        if (index == index1) {
          item.cycle = 1;
        }
      });
    },
    //关闭间隔 显示循环
    returnClick(index1) {
      this.planData.forEach((item, index) => {
        if (index == index1) {
          item.cycle = 0;
        }
      });
    },
    // 添加一行
    addLine(row, index) {
      var list = {
        task: "",
        start: "",
        end: "",
        cycle: 0,
        intervalTimes: "",
        name: "",
        planValue: "",
        taskName: "",
        executionType: 1,
        taskDescribe: "",
        templateSubTaskId: ""
      };
      this.planData.push(list);
    },
    // 减少一行
    delLine(row, index) {
      if (this.planData.length === 1) {
        this.$message({
          showClose: true,
          type: "warning",
          message: "已达到最小行数"
        });
      } else {
        this.planData.splice(this.planData.length - 1, 1);
      }
    },
    // RFID取消
    RFIDbraceletCancel() {
      this.RFIDbracelet = false;
      this.RFID = "";
      this.readRFTD = false;
    },
    // 拿到RFID手环的RFID
    read() {
      this.readRFTD = true;
      let N = "N";
      pharmacyIp(N).then(data => {});
    }
  },
  created() {
    // let row = this.$route.query.obj;
    // if (row != null) {
    //   if (row.patientId != undefined) {
    //     this.operation(row);
    //     this.routeObj = false;
    //   }
    // }
    // 流程图是否可以点击
    this.nurseInfoReq();
    if (this.NewPatient[0].id == -1) {
      return;
      this.processFigure = false;
    } else {
      return;
      this.processFigure = true;
    }
  },
  // 判断路由跳转进来后地址栏是否进行了传参，
  // activated() {
  //   if (this.routeObj != false) {
  //     let row = this.$route.query.obj;
  //     if (row != null) {
  //       if (row.patientId != undefined) {
  //         this.operation(row);
  //       }
  //     }
  //   }
  // },
  // deactivated() {
  //   this.$route.query.obj = null;
  //   this.$forceUpdate(); //强制页面进行刷新
  // },
  // 子组件
  components: {
    beHospitalized: beHospitalized
  }
};
</script>

<style lang="scss" scoped>
.Department {
  .left {
    width: 67%;
    height: 650px;
    overflow-y: scroll;
    float: left;
  }
  .right {
    width: 32%;
    float: right;
  }
  @media screen and (max-width: 1200px) {
    .left {
      width: 100%;
      height: 100%;
    }
    .right {
      margin-top: 30px;
      width: 100%;
      margin-bottom: 50px;
    }
  }
  .right div {
    text-align: center;
  }
  .dis {
    display: inline-block;
  }
  .figure {
    position: relative;
    position: relative;
    width: 300px;
    margin: 0 auto;
    height: 550px;
  }
  .figure div:nth-child(4) {
    position: absolute;
    left: 122px;
  }
  .figure div:nth-child(5) {
    position: absolute;
    left: 5px;
  }
  .figure div:nth-child(6) {
    position: absolute;
    left: 210px;
  }
  .figure div:nth-child(7) {
    position: absolute;
    top: 190px;
    left: 35px;
  }
  .figure div:nth-child(8) {
    position: absolute;
    top: 230px;
    left: 134.5px;
  }
  .figure div:nth-child(9) {
    position: absolute;
    left: 144px;
    top: 295px;
  }
  .figure div:nth-child(10) {
    position: absolute;
    top: 320px;
    left: 134.5px;
  }
  .figure div:nth-child(11) {
    position: absolute;
    left: 35px;
    top: 385px;
  }
  .figure div:nth-child(12) {
    position: absolute;
    left: 17px;
    top: 420px;
  }
  .figure div:nth-child(13) {
    position: absolute;
    left: 74px;
    top: 420px;
  }
  .figure div:nth-child(14) {
    position: absolute;
    left: 137px;
    top: 420px;
  }
  .figure div:nth-child(15) {
    position: absolute;
    left: 187px;
    top: 420px;
  }
  .figure div:nth-child(16) {
    position: absolute;
    left: 240px;
    top: 420px;
  }
  .figure div:nth-child(17) {
    position: absolute;
    left: 35px;
    top: 445px;
  }
  .figure div:nth-child(18) {
    position: absolute;
    left: 109px;
    top: 483px;
  }
  // .figure div:nth-child(12),
  // .figure div:nth-child(13),
  // .figure div:nth-child(14),
  // .figure div:nth-child(15) {
  //   margin: 0 18px 0 0;
  // }
  .AllNurse {
    width: 100%;
    height: 150px;
    border: 1px solid rgb(238, 238, 238);
    overflow-y: auto;
    button {
      width: 100px;
      margin-left: 1%;
      margin: 1.5% 2%;
    }
  }
  .devBtn {
    background: #409eff !important;
    color: #fff !important;
  }
  .disBlock {
    display: inline-block;
  }
  .disNone {
    display: none;
  }
  #interval {
    width: 100px;
  }
  .lineBtn {
    text-align: center;
    margin: 10px;
  }
  .el-collapse-item__header {
    font-size: 16px !important;
  }
}
</style>
