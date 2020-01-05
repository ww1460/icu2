<template>
  <!-- 入科流程 -->
  <div class="outDepartment">
    <basic-container>
      <div class="left">
        <el-collapse v-model="activeNames">
          <el-collapse-item title="待出科患者表" style=" font-size: 16px" name="1">
            <div>
              <avue-crud
                ref="crud"
                :page="page"
                :data="waitingData"
                :permission="permissionList"
                :table-loading="tableLoading"
                :option="waiting"
                :cell-style="cellStyle"
                @on-load="getwaiting"
              >
                <template slot-scope="scope" slot="menu">
                  <el-button
                    v-if="permissions.icu_process_receive"
                    type="button"
                    size="mini"
                    icon="el-icon-menu"
                    @click="receive(scope.row,scope.index)"
                  >出科</el-button>
                </template>
              </avue-crud>
            </div>
          </el-collapse-item>
          <el-collapse-item title="已出科患者表" name="2">
            <div>
              <avue-crud
                ref="crud"
                :page="pageTwo"
                :data="alreadyData"
                :permission="permissionList"
                :table-loading="tableLoading"
                :option="already"
                @size-change="sizeChange"
                @current-change="currentChange"
              >
                <!-- <template slot-scope="scope" slot="menu">
                  <el-button
                    v-if="permissions.icu_process_receive"
                    type="button"
                    size="mini"
                    icon="el-icon-menu"
                    @click="operation(scope.row,scope.index)"
                  >操作</el-button>
                </template> -->
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
      <assessment
        ref="assessment"
        :NewPatient="NewPatient"
        :flowName="flowName"
        :operationData="operationData"
        :patientId="patientId"
      ></assessment>
      <el-dialog
        title="患者转出"
        :visible.sync="turnOut"
        :fullscreen="isFullscreen"
        @close="turnCancel"
      >
        <el-form ref="formZhuan" :model="formZhuan" label-width="80px">
          <el-form-item label="转出原因:">
            <el-radio-group v-model="formZhuan.radio">
              <el-radio
                v-for="(item,index) in typeData"
                :key="index"
                :label="item.value"
                class="typeClass"
              >{{item.description}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="去向:">
            <el-input v-model="formZhuan.dischargeWhereAbout"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="turnConfirm" :loading="tableLoading">保 存</el-button>
          <el-button @click="turnCancel">取 消</el-button>
        </div>
      </el-dialog>
      <handover ref="handover" :operationData="operationData" :NewPatient="NewPatient"></handover>
    </basic-container>
  </div>
</template>
<script>
import {
  fetchwaiting,
  fetchalready,
  operationBtn,
  processAdd,
  stopDoctorsAndTask,
  stopDeviceAndPiping,
  putObj,
  delObj,
  patientDepartureType,
  remote,
  stopNursAndPatient,
  patientId_entryState,
  departureMiddle
} from "@/api/icu/process/outDepartment";
import { transferRecordTransferRecord } from "@/api/icu/process/handover";
import { waiting, already } from "@/const/crud/icu/process/outDepartment";
import assessment from "@/views/icu/process/MEWS";
import handover from "@/views/icu/process/handover";
import { mapGetters } from "vuex";
import { dateFormat, calcDate } from "@/util/date";

export default {
  name: "Tenant",
  data() {
    return {
      typeData: [],
      formZhuan: {
        radio: "",
        dischargeWhereAbout: ""
      },

      turnOut: false,
      isFullscreen: false,
      screenWidth: document.body.clientWidth, // 屏幕尺寸
      flowName: "2",
      // 手风琴效果
      activeNames: "1",
      operationData: {},
      // 分页
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 5, // 每页显示多少条
        pageSizes: [5, 10, 20, 30, 50]
      },
      pageTwo: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 5, // 每页显示多少条
        pageSizes: [5, 10, 20, 30, 50]
      },
      // 渲染数据
      waitingData: [],
      alreadyData: [],
      tableLoading: false,
      // 表格
      waiting: waiting,
      already: already,
      // 流程图渲染
      NewPatient: [
        { id: -1 },
        {
          id: 1,
          title: "患者姓名/床位",
          ActImg: "/img/entryDepartment/lc_lan_1_01.png",
          img: "/img/entryDepartment//lc_hui_1_01.png",
          flag: false
        },
        {
          title: "",
          ActImg: "/img/outDepartment/lc_3_02.png",
          img: "/img/outDepartment/lc_3_02.png"
        },
        {
          id: 2,
          title: "患者转出评估",
          ActImg: "/img/entryDepartment/lc_lan_1_04.png",
          img: "/img/entryDepartment/lc_hui_1_04.png",
          flag: false
        },
        {
          title: "",
          ActImg: "/img/outDepartment/lc_3_02.png",
          img: "/img/outDepartment/lc_3_02.png"
        },
        // {
        //   title: "",
        //   ActImg: "/img/outDepartment/lc_2_03.png",
        //   img: "/img/outDepartment/lc_2_03.png"
        // },
        // {
        //   id: 3,
        //   title: "当前不适合转出是否坚持转出",
        //   ActImg: "/img/outDepartment/lc_lan_2_02.png",
        //   img: "/img/outDepartment/lc_hui_2_02.png",
        //   flag: false
        // },
        // {
        //   title: "",
        //   ActImg: "/img/outDepartment/lc_2_04.png",
        //   img: "/img/outDepartment/lc_2_04.png"
        // },
        // {
        //   title: "",
        //   ActImg: "/img/outDepartment/lc_2_12.png",
        //   img: "/img/outDepartment/lc_2_12.png"
        // },
        // {
        //    id: 4,
        //    title: "停止医嘱服务",
        //    ActImg: "/img/outDepartment/lc_lan_2_01.png",
        //    img: "/img/outDepartment/lc_hui_2_01.png",
        //    flag: false
        // },
        // {
        //    title: "",
        //    ActImg: "/img/outDepartment/lc_3_02.png",
        //    img: "/img/outDepartment/lc_3_02.png"
        // },
        {
          id: 5,
          title: "取消床位、设备和管路",
          ActImg: "/img/outDepartment/lc_lan_2_03.png",
          img: "/img/outDepartment/lc_hui_2_03.png",
          flag: false
        },
        {
          title: "",
          ActImg: "/img/outDepartment/lc_3_02.png",
          img: "/img/outDepartment/lc_3_02.png"
        },
        {
          id: 8,
          title: "转科评估",
          ActImg: "/img/outDepartment/lc_lan_4_01.png",
          img: "/img/outDepartment/lc_hui_4_01.png",
          flag: false
        },
        {
          title: "",
          ActImg: "/img/outDepartment/lc_3_02.png",
          img: "/img/outDepartment/lc_3_02.png"
        },
        {
          id: 6,
          title: "转出完成",
          ActImg: "/img/outDepartment/lc_lan_2_05.png",
          img: "/img/outDepartment/lc_hui_2_05.png",
          flag: false
        }
        // {
        //   title: "",
        //   ActImg: "/img/outDepartment/lc_3_02.png",
        //   img: "/img/outDepartment/lc_3_02.png"
        // },
        // {
        //   id: 7,
        //   title: "取消转出流程",
        //   ActImg: "/img/outDepartment/lc_lan_2_04.png",
        //   img: "/img/outDepartment/lc_hui_2_04.png",
        //   flag: false
        // }
      ],
      // 患者
      patName: "",
      processFigure: false, //控制流程图点击
      // 患者ID
      patientId: "",
      // 患者信息
      patient: "",
      routeObj: true
    };
  },
  components: {
    assessment: assessment,
    handover: handover
  },
  computed: {
    ...mapGetters(["permissions"]),
    permissionList() {
      return {
        receiveBtn: this.vaildData(this.permissions.icu_process_receive, false)
      };
    }
  },

  mounted() {
    // 对话框小屏幕全屏
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
    // 计算时间
    getDifValue(nowtimestamp, beforetimestamp) {
      let difValue = nowtimestamp - beforetimestamp;
      let day = Math.floor(difValue / 1000 / 60 / 60 / 24); //天
      difValue = difValue % (1000 * 60 * 60 * 24);
      let hour = Math.floor(difValue / 1000 / 60 / 60); //小时
      difValue = difValue % (1000 * 60 * 60);
      // let min = Math.floor(difValue / 1000 / 60); //分钟
      // difValue = difValue % (1000 * 60);
      return day + "天" + hour + "时";
    },
    // 解决分页BUG
    sizeChange(val) {
      this.pageTwo.currentPage = 1;
      this.pageTwo.pageSize = val;
      this.getalready();
    },
    currentChange(val) {
      this.pageTwo.currentPage = val;
      this.getalready();
    },
    // 待出科数据
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
          // 计算入住ICU系统时间
          for (const i in this.waitingData) {
            let data1 = new Date().getTime(); //当前时间戳
            let data2 = new Date(this.waitingData[i].entranceTime).getTime();
            this.waitingData[i].timer = this.getDifValue(data1, data2);
          }
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
    // 已出科数据
    getalready(pageTwo) {
      this.tableLoading = true;
      fetchalready(
        Object.assign(
          {
            current: this.pageTwo.currentPage,
            size: this.pageTwo.pageSize
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
    // 状态变色区分
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 6) {
        if (row.entryState == "在科") {
          return {
            color: "#00e9a0"
          };
        } else if (row.entryState == "出科中") {
          return {
            color: "#ff7f5f"
          };
        }
      }
    },
    // 出科
    receive(row, index) {
      this.routeObj = true;
      this.patName = row;
      this.patient = row;
      this.patientId = row.patientId;
      let _this = this;
      this.processFigure = false;
      for (let i in this.NewPatient) {
        this.NewPatient[i].flag = false;
      }
      if (row.entryState == "在科") {
        this.$confirm(
          "是否出科患者" +
            this.patient.name +
            "（注:患者出科后其他页面不可再操作此患者,请慎重选择。）",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            departureMiddle(row.patientId);
            operationBtn(_this.flowName, row.patientId).then(data => {
              // .then(res=> {})
              // .catch(() => {});
              if (data.data.msg != "0") {
                processAdd(_this.flowName, row.patientId)
                  .then(data => {
                    operationBtn(_this.flowName, row.patientId).then(res => {
                      this.operationData = res.data.data;
                    });
                    if (row.bedName == null) {
                      this.NewPatient[1].title = row.name + "/" + "无床位";
                    } else {
                      this.NewPatient[1].title = row.name + "/" + row.bedName;
                    }
                    this.NewPatient[1].flag = true;
                    this.processFigure = true;
                    // this.waitingData.splice(index,1)
                    this.$store.dispatch("getAllPatients");
                    this.$forceUpdate(); //强制页面进行刷新
                    this.getwaiting(this.page);
                    this.getalready(this.pageTwo);
                  })
                  .catch(() => {
                    this.NewPatient[1].flag = false;
                    this.NewPatient[1].title = "患者姓名/床位";
                    this.processFigure = false;
                    this.$forceUpdate(); //强制页面进行刷新
                  });
              }
            });
          })
          .catch(() => {});
      } else {
        departureMiddle(row.patientId);
        operationBtn(_this.flowName, row.patientId)
          .then(data => {
            // .then(res=> {})
            // .catch(() => {});
            if (data.data.msg == "0") {
              // this.patientId = data.data.data.patientId;
              for (let y in this.NewPatient) {
                this.NewPatient[y].flag = false;
              }
              this.operationData = data.data.data;
              // 判断是否有多个高亮
              if (this.operationData.specificStepId.indexOf(",") == -1) {
                this.NewPatient[1].flag = true;
                if (row.bedName == null) {
                  this.NewPatient[1].title = row.name + "/" + "无床位";
                } else {
                  this.NewPatient[1].title = row.name + "/" + row.bedName;
                }
                this.processFigure = true;
              } else {
                // 多个高亮
                var arr = this.operationData.specificStepId.split(",");
                this.processFigure = true;
                if (row.bedName == null) {
                  this.NewPatient[1].title = row.name + "/" + "无床位";
                } else {
                  this.NewPatient[1].title = row.name + "/" + row.bedName;
                }
                for (let i in arr) {
                  for (let j in this.NewPatient) {
                    if (this.NewPatient[j].id == arr[i]) {
                      if (arr[i] == 1) {
                        this.NewPatient[1].flag = true;
                      } else if (arr[i] == 2) {
                        this.NewPatient[j].flag = true;
                      }
                      //  else if (arr[i] == 3) {
                      //   this.NewPatient[j].flag = true;
                      // }
                      // else if (arr[i] == 4) {
                      //    this.NewPatient[j].flag = true;
                      // }
                      else if (arr[i] == 5) {
                        this.NewPatient[j].flag = true;
                      } else if (arr[i] == 6) {
                        this.NewPatient[j].flag = true;
                      } else if (arr[i] == 7) {
                        this.NewPatient[j].flag = true;
                      } else if (arr[i] == 8) {
                        this.NewPatient[j].flag = true;
                      } else {
                        this.NewPatient[j].flag = false;
                      }
                    }
                  }
                }
              }
            } else {
            }
          })
          .catch(() => {});
      }
    },
    // 操作
    operation(row, index) {
      if (row.entryState == "出科中") {
        this.routeObj = true;
        this.patName = row;
        this.patient = row;
        this.patientId = row.patientId;
        let _this = this;
        this.processFigure = false;
        for (let i in this.NewPatient) {
          this.NewPatient[i].flag = false;
        }
        operationBtn(_this.flowName, row.patientId)
          .then(data => {
            // departureMiddle(row.patientId);
            // .then(res=> {})
            // .catch(() => {});
            if (data.data.msg == "0") {
              // this.patientId = data.data.data.patientId;
              for (let y in this.NewPatient) {
                this.NewPatient[y].flag = false;
              }
              this.operationData = data.data.data;
              // 判断是否有多个高亮
              if (this.operationData.specificStepId.indexOf(",") == -1) {
                this.NewPatient[1].flag = true;
                if (row.admDedName == null) {
                  this.NewPatient[1].title = row.name + "/" + "无床位";
                } else {
                  this.NewPatient[1].title = row.name + "/" + row.admDedName;
                }
                this.processFigure = true;
              } else {
                // 多个高亮
                var arr = this.operationData.specificStepId.split(",");
                this.processFigure = true;
                if (row.admDedName == null) {
                  this.NewPatient[1].title = row.name + "/" + "无床位";
                } else {
                  this.NewPatient[1].title = row.name + "/" + row.admDedName;
                }
                for (let i in arr) {
                  for (let j in this.NewPatient) {
                    if (this.NewPatient[j].id == arr[i]) {
                      if (arr[i] == 1) {
                        this.NewPatient[1].flag = true;
                      } else if (arr[i] == 2) {
                        this.NewPatient[j].flag = true;
                      }
                      //  else if (arr[i] == 3) {
                      //   this.NewPatient[j].flag = true;
                      // }
                      // else if (arr[i] == 4) {
                      //    this.NewPatient[j].flag = true;
                      // }
                      else if (arr[i] == 5) {
                        this.NewPatient[j].flag = true;
                      } else if (arr[i] == 6) {
                        this.NewPatient[j].flag = true;
                      } else if (arr[i] == 7) {
                        this.NewPatient[j].flag = true;
                      } else if (arr[i] == 8) {
                        this.NewPatient[j].flag = true;
                      } else {
                        this.NewPatient[j].flag = false;
                      }
                    }
                  }
                }
              }
            } else {
              processAdd(_this.flowName, row.patientId)
                .then(data => {
                  operationBtn(_this.flowName, row.patientId).then(res => {
                    this.operationData = res.data.data;
                  });
                  if (row.admDedName == null) {
                    this.NewPatient[1].title = row.name + "/" + "无床位";
                  } else {
                    this.NewPatient[1].title = row.name + "/" + row.admDedName;
                  }
                  this.NewPatient[1].flag = true;
                  this.processFigure = true;
                  this.$forceUpdate(); //强制页面进行刷新
                })
                .catch(() => {
                  this.NewPatient[1].flag = false;
                  this.NewPatient[1].title = "患者姓名/床位";
                  this.processFigure = false;
                  this.$forceUpdate(); //强制页面进行刷新
                });
            }
          })
          .catch(() => {});
      } else {
        this.$message.error("患者已经出科");
      }
    },
    // 流程图点击
    changeType(id) {
      let _this = this;
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
              // 点击评估
              this.$refs.assessment.dialogVisible = true;
              this.$refs.assessment.patName = this.patName;
              this.$refs.assessment.patInfo = this.patName;
              this.$refs.assessment.getList();
            }
            if (this.changeTypeId === 3) {
              // this.$confirm(
              //   "当前" + this.patient.name + "不适合转出是否坚持转出",
              //   "提示",
              //   {
              //     confirmButtonText: "确定",
              //     cancelButtonText: "取消",
              //     type: "warning"
              //   }
              // ).then(function() {
              //   stopDoctorsAndTask(_this.parentId).then(data => {
              //     console.log(data);
              //   });
              // });
            }
            // if (this.changeTypeId === 4) {
            //    // 停止医嘱
            //    this.$confirm(
            //       "是否对患者" + this.patient.name + "停止医嘱服务",
            //       "提示",
            //       {
            //          confirmButtonText: "确定",
            //          cancelButtonText: "取消",
            //          type: "warning"
            //       }
            //    ).then(function() {
            //       _this.$message({
            //          type: "success",
            //          message: "停止医嘱服务成功!"
            //       });
            //       stopDoctorsAndTask(_this.patientId).then(data => {
            //          // 流程高亮
            //          if (
            //             _this.operationData.specificStepId.indexOf(4) ==
            //             -1
            //          ) {
            //             let flowName = Number(_this.flowName);
            //             let specificStepId = 4;
            //             putObj(
            //                flowName,
            //                _this.operationData.id,
            //                specificStepId
            //             );
            //          }
            //          _this.NewPatient[5].flag = true;
            //       });
            //    });
            // }
            if (this.changeTypeId === 5) {
              // console.log(_this.operationData.specificStepId);
              // 断开床位、设备和管路
              this.$confirm(
                "是否取消患者" + this.patient.name + "床位、设备和管路",
                "提示",
                {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                }
              ).then(function() {
                _this.$message({
                  type: "success",
                  message: "取消床位、设备和管路成功!"
                });
                stopDeviceAndPiping(_this.patientId).then(data => {
                  // 流程高亮
                  if (_this.operationData.specificStepId.indexOf(5) == -1) {
                    let flowName1 = Number(_this.flowName);
                    let specificStepId = 5;
                    putObj(flowName1, _this.operationData.id, specificStepId);
                  }
                  _this.NewPatient[5].flag = true;
                  _this.getwaiting(_this.page)
                });
              });
            }
            if (this.changeTypeId === 6) {
              // 转出 判断之前流程是否走完
              if (_this.NewPatient[9].flag == false) {
                // if (this.NewPatient[3].flag == true) {
                // if (this.NewPatient[5].flag == true) {
                if (this.NewPatient[5].flag == true) {
                  patientDepartureType().then(res => {
                    let type = res.data.data;
                    remote(type).then(data => {
                      this.typeData = data.data.data;
                      this.turnOut = true;
                    });
                  });
                } else {
                  this.$alert("请先取消床位、设备和管路", "转出完成", {
                    confirmButtonText: "确定"
                  });
                }
                // } else {
                //    this.$alert("请先停止医嘱服务", "转出完成", {
                //       confirmButtonText: "确定"
                //    });
                // }
                // } else {
                //   this.$alert("请先进行患者转出评估", "转出完成", {
                //     confirmButtonText: "确定"
                //   });
                // }
              }
            }
            if (this.changeTypeId === 7) {
              // 取消转出
              // if (_this.NewPatient[14].flag == false) {
              //   this.$confirm(
              //     "是取消患者" + this.patient.name + "的转出流程",
              //     "提示",
              //     {
              //       confirmButtonText: "确定",
              //       cancelButtonText: "取消",
              //       type: "warning"
              //     }
              //   ).then(function() {
              //     delObj(_this.operationData.id).then(data => {
              //       _this.NewPatient[1].flag = false;
              //       _this.NewPatient[3].flag = false;
              //       _this.NewPatient[5].flag = false;
              //       _this.NewPatient[8].flag = false;
              //       _this.NewPatient[10].flag = false;
              //       _this.NewPatient[12].flag = false;
              //       _this.NewPatient[1].title = "患者姓名/床位号码";
              //       _this.processFigure = false;
              //     });
              //   });
              // }
            }
            if (this.changeTypeId === 8) {
              let patientId = {
                patientId: this.patName.patientId
              };
              // 转科评估
              // 部分数据在出科时提取
              this.$refs.handover.evaluation = true;
              this.$refs.handover.form.patientName = this.patName.name;
              if (this.patName.gender == "1") {
                this.$refs.handover.form.patientSex = "女";
              } else {
                this.$refs.handover.form.patientSex = "男";
              }
              this.$refs.handover.form.patientAge = this.patName.age;
              this.$refs.handover.form.patientAdmissionNumber = this.patName.hospitalnumber;
              this.$refs.handover.form.patientDiagnose = this.patName.diagnosis;
              this.$refs.handover.form.patientId = this.patName.patientId;
              // 判断是高亮，需要是新增时调取未评估时数据还是修改时调用前一次评估数据
              if (this.NewPatient[7].flag != true) {
                this.$refs.handover.backfill();
                this.$refs.handover.judge();
              } else {
                transferRecordTransferRecord(this.patName.patientId).then(
                  data => {
                    // 字符串转JSON 赋值
                    if (data.data.data.patientTransfusionRemarks != null) {
                      let patientTransfusionRemarks = eval(
                        "(" + data.data.data.patientTransfusionRemarks + ")"
                      );
                      this.$refs.handover.form.patientTransfusionRemarks =
                        patientTransfusionRemarks.patientTransfusionRemarks;
                      this.$refs.handover.form.state =
                        patientTransfusionRemarks.state;
                    }
                    if (data.data.data.patientPipeline != null) {
                      let patientPipeline = eval(
                        "(" + data.data.data.patientPipeline + ")"
                      );
                      this.$refs.handover.form.pipeline =
                        patientPipeline.pipeline;
                      this.$refs.handover.form.stomach =
                        patientPipeline.stomach;
                      this.$refs.handover.form.urine = patientPipeline.urine;
                      this.$refs.handover.form.pleural =
                        patientPipeline.pleural;
                      this.$refs.handover.form.tTube = patientPipeline.tTube;
                      this.$refs.handover.form.conduitMark =
                        patientPipeline.conduitMark;
                      this.$refs.handover.form.conduitOther =
                        patientPipeline.conduitOther;
                    }
                    this.$refs.handover.form.id = data.data.data.id;
                    this.$refs.handover.form.nurseName =
                      data.data.data.nurseName;
                    this.$refs.handover.form.patientAdmissionNumber =
                      data.data.data.patientAdmissionNumber;
                    this.$refs.handover.form.patientAge =
                      data.data.data.patientAge;
                    this.$refs.handover.form.patientBloodPressure =
                      data.data.data.patientBloodPressure;
                    this.$refs.handover.form.patientBreathe =
                      data.data.data.patientBreathe;
                    this.$refs.handover.form.patientCareOneself =
                      data.data.data.patientCareOneself;
                    this.$refs.handover.form.patientConsciousness =
                      data.data.data.patientConsciousness;
                    this.$refs.handover.form.patientDiagnose =
                      data.data.data.patientDiagnose;
                    this.$refs.handover.form.patientDischargeDept =
                      data.data.data.patientDischargeDept;
                    this.$refs.handover.form.patientDischargeTime =
                      data.data.data.patientDischargeTime;
                    this.$refs.handover.form.patientDrugDelivery =
                      data.data.data.patientDrugDelivery;
                    this.$refs.handover.form.patientDrugDeliveryRemarks =
                      data.data.data.patientDrugDeliveryRemarks;
                    this.$refs.handover.form.patientId =
                      data.data.data.patientId;
                    this.$refs.handover.form.patientName =
                      data.data.data.patientName;
                    this.$refs.handover.form.patientOthers =
                      data.data.data.patientOthers;
                    this.$refs.handover.form.patientPain =
                      data.data.data.patientPain;
                    this.$refs.handover.form.patientPipeline =
                      data.data.data.patientPipeline;
                    this.$refs.handover.form.patientPressure =
                      data.data.data.patientPressure;
                    this.$refs.handover.form.patientPressureRemarks =
                      data.data.data.patientPressureRemarks;
                    this.$refs.handover.form.patientPsychological =
                      data.data.data.patientPsychological;
                    this.$refs.handover.form.patientPsychologicalRemarks =
                      data.data.data.patientPsychologicalRemarks;
                    this.$refs.handover.form.patientPulse =
                      data.data.data.patientPulse;
                    this.$refs.handover.form.patientSex =
                      data.data.data.patientSex;
                    this.$refs.handover.form.patientSkinMucosa =
                      data.data.data.patientSkinMucosa;
                    this.$refs.handover.form.patientSkinMucosaRemarks =
                      data.data.data.patientSkinMucosaRemarks;
                    this.$refs.handover.form.patientTemperature =
                      data.data.data.patientTemperature;
                    this.$refs.handover.form.patientTransfusion =
                      data.data.data.patientTransfusion;
                    this.$refs.handover.form.patientWound =
                      data.data.data.patientWound;
                    this.$refs.handover.form.patientWoundRemarks =
                      data.data.data.patientWoundRemarks;
                    this.$refs.handover.form.transferRecordId =
                      data.data.data.transferRecordId;
                    this.$refs.handover.judge();
                  }
                );
              }
            }
          }
        }
      }
    },
    // 转出确定
    turnConfirm() {
      this.turnOut = false;
      this.$forceUpdate(); //强制页面进行刷新
      let _this = this;
      this.$confirm("是否转出患者" + this.patient.name, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let parentData = {
          dischargeType: _this.formZhuan.radio,
          id: _this.patient.id,
          patientId: _this.patientId,
          dischargeWhereAbout: _this.formZhuan.dischargeWhereAbout,
          entranceTime: _this.patient.entranceTime
        };
        _this.tableLoading = true;
        stopNursAndPatient(parentData)
          .then(data => {
            _this.getalready(_this.pageTwo);
            _this.getwaiting(_this.page);
            // _this.$store.dispatch("getAllPatients");
            _this.tableLoading = false;
            if (_this.operationData.specificStepId.indexOf(6) == -1) {
              let flowName1 = Number(_this.flowName);
              let specificStepId = 6;
              putObj(flowName1, _this.operationData.id, specificStepId);
            }
            _this.formZhuan = {
              radio: "",
              dischargeWhereAbout: ""
            };
            _this.NewPatient[9].flag = true;
          })
          .catch(() => {
             _this.getalready(_this.pageTwo);
            _this.getwaiting(_this.page);
            this.tableLoading = false;
            _this.formZhuan = {
              radio: "",
              dischargeWhereAbout: ""
            };
           
          });
      });
    },
    // 转出取消
    turnCancel() {
      this.turnOut = false;
      this.typeData = [];
      this.form = {
        radio: "",
        dischargeWhereAbout: ""
      };
      this.$forceUpdate(); //强制页面进行刷新
    }
    // operation(row, index) {
    //   this.patName = row;
    // }
    // 出科
  },
  // 进入页面进行刷新
  activated() {
    // 患者中心跳转后接收数据
    // if (this.routeObj != false) {
    //   let obj = this.$route.query.obj;
    //   if (obj != null) {
    //     if (obj.id != undefined) {
    //       this.receive(obj);
    //     }
    //   }
    // }
  },
  deactivated() {
    this.$route.query.obj = null;
    this.$forceUpdate(); //强制页面进行刷新
  },
  created() {
    this.getalready();
    // let obj = this.$route.query.obj;
    // if (obj != null) {
    //   if (obj.id != undefined) {
    //     this.receive(obj);
    //     this.routeObj = false;
    //   }
    // }
    // 判断流程是否可以点击
    if (this.NewPatient[1].title.indexOf("患者姓名/床位") == -1) {
      return;
      this.processFigure = false;
    } else {
      return;
      this.processFigure = true;
    }
  }
};
</script>

<style lang="scss">
.outDepartment {
  .el-radio-group {
    display: contents;
    .el-radio__label {
      margin-right: 10px;
    }
  }
  .el-dialog__footer span {
    width: 90% !important;
  }
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
  .figure {
    position: relative;
    width: 300px;
    margin: 0 auto;
    height: 610px;
    div:nth-child(5) {
      position: absolute;
      right: 145px;
      top: 178px;
    }
    div:nth-child(6) {
      position: absolute;
      left: 80px;
      top: 210px;
    }
    div:nth-child(7) {
      position: absolute;
      left: 145px;
      top: 275px;
      // width: 36%;
    }
    div:nth-child(8) {
      position: absolute;
      left: 123px;
      top: 305px;
    }
    div:nth-child(9) {
      position: absolute;
      left: 145px;
      top: 370px;
    }
    div:nth-child(10) {
      position: absolute;
      left: 122px;
      top: 400px;
    }
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
  .typeClass {
    display: contents;
  }
}
</style>
