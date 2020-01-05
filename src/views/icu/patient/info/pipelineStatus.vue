<template>
  <!-- 管路状态 -->
  <div class="pip">
    <div class="EquipmentStatus" v-if="flag">
      <div class="EquipmentStatus_top">
        <span>管路状态:</span>
        <el-button
          v-for="(item,index) in options"
          :class="['el-button--small',(item.value == devBtn?'el-button el-button--primary':'')]"
          :key="index"
          @click="changeDevBtn(item.value)"
        >{{item.label}}</el-button>
      </div>
      <div class="devicewindow">
        <avue-crud
          :data="devBtn==0?connectedData:devBtn==1?unconnectedData:usedData"
          :option="devBtn==0?apparatus:devBtn==1?apparatus1:apparatus2"
          :tableLoading="tableLoading"
        >
          <template slot="menu" slot-scope="scope">
            <el-dropdown v-if="devBtn == 0 ? true : false">
              <span class="el-dropdown-link el-link el-link--primary">
                操作
                <i class="el-icon-arrow-down"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <div class="el-dropdown-menu__item" @click.stop="extubation(scope.row)">拔管</div>
                <div class="el-dropdown-menu__item" @click.stop="drainage(scope.row)">引流液</div>
                <div class="el-dropdown-menu__item" @click.stop="uex(scope.row)">UEX登记</div>
                <div class="el-dropdown-menu__item" @click.stop="assessment(scope.row)">管路评分</div>
                <div class="el-dropdown-menu__item" @click.stop="slippageRisk(scope.row)">管道护理</div>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button
              type="text"
              size="small"
              @click.native="search(scope.row)"
              v-if="devBtn == 0 ? false:devBtn == 1?true : false "
            >
              开启
              <i class="el-icon-circle-plus-outline"></i>
            </el-button>
            <el-button
              type="text"
              size="small"
              @click.native="results(scope.row)"
              v-if="devBtn == 0 ? false:devBtn == 1?false :devBtn == 2? true:false "
            >
              评估结果
              <i class="el-icon-view"></i>
            </el-button>
          </template>
        </avue-crud>

        <el-dialog title="开启管路" :visible.sync="dialogFormVisible" width="60%">
          <el-form ref="form" :model="form" label-width="120px" :rules="rules">
            <el-row>
              <el-col class="el-col el-col-24 el-col-md-12 el-col-xs-24">
                <el-form-item label="管道部位" prop="bodyParts">
                  <el-select
                    v-model="form.bodyParts"
                    placeholder="请选择管道部位"
                    clearable
                    style="width: 100%;"
                  >
                    <el-option
                      v-for="state in piping_position"
                      :key="state.value"
                      :label="state.description"
                      :value="state.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col class="el-col el-col-24 el-col-md-12 el-col-xs-24">
                <el-form-item label="开始插管时间" prop="startTime">
                  <el-date-picker
                    type="datetime"
                    placeholder="选择开始插管时间"
                    v-model="form.startTime"
                    style="width: 100%;"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col class="el-col el-col-24 el-col-md-12 el-col-xs-24">
                <el-form-item label="插入长度" prop="lengthBuiltin">
                  <!-- <el-input type="number" v-model="form.lengthBuiltin">
                              <template slot="append">厘米</template>
                  </el-input>-->
                  <el-input-number
                    v-model="form.lengthBuiltin"
                    style="width:100%"
                    :min="0"
                    :step="0.1"
                  ></el-input-number>
                </el-form-item>
              </el-col>
              <el-col class="el-col el-col-24 el-col-md-12 el-col-xs-24">
                <el-form-item label="外露长度" prop="lengthExposure">
                  <!-- <el-input type="number" v-model="form.lengthExposure">
                              <template slot="append">厘米</template>
                  </el-input>-->
                  <el-input-number
                    v-model="form.lengthExposure"
                    style="width:100%"
                    :min="0"
                    :step="0.1"
                  ></el-input-number>
                </el-form-item>
              </el-col>
              <!-- <el-col class="el-col el-col-24 el-col-md-12 el-col-xs-24">
                <el-form-item label="结束插管时间" prop="endTime">
                  <el-date-picker
                    type="datetime"
                    placeholder="选择结束插管时间"
                    v-model="form.endTime"
                    style="width: 100%;"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  ></el-date-picker>
                </el-form-item>
              </el-col>-->
              <el-col class="el-col el-col-24 el-col-md-12 el-col-xs-24">
                <el-form-item label="固定方式方法" prop="fixed">
                  <el-select
                    v-model="form.fixed"
                    placeholder="请选择管道部位"
                    clearable
                    style="width: 100%;"
                  >
                    <el-option
                      v-for="state in piping_fixed_method"
                      :key="state.value"
                      :label="state.description"
                      :value="state.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col class="el-col el-col-24 el-col-md-12 el-col-xs-24">
                <el-form-item label="标签颜色" prop="signColor">
                  <el-select
                    v-model="form.signColor"
                    placeholder="请选标签颜色"
                    clearable
                    style="width: 100%;"
                  >
                    <el-option
                      v-for="state in piping_sign_color"
                      :key="state.value"
                      :label="state.description"
                      :value="state.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col class="el-col el-col-24 el-col-md-12 el-col-xs-24">
                <el-form-item label="标签名称" prop="signName">
                  <el-input v-model="form.signName" style="width: 100%;"></el-input>
                </el-form-item>
              </el-col>

              <el-col class="el-col el-col-24 el-col-md-24 el-col-xs-24">
                <el-form-item label="护理措施" prop="nursingMeasures">
                  <!-- <el-select
                    v-model="form.nursingMeasures"
                    placeholder="请选择护理措施"
                    clearable
                    style="width: 100%;"
                  >
                    <el-option
                      v-for="state in preventive_nursing_measures"
                      :key="state.value"
                      :label="state.description"
                      :value="state.value"
                    ></el-option>
                  </el-select>-->
                  <el-input type="textarea" v-model="form.nursingMeasures" style="width:100%"></el-input>
                </el-form-item>
              </el-col>
              <el-col class="el-col el-col-24 el-col-md-24 el-col-xs-24">
                <el-form-item label="皮肤局部情况" prop="localCondition">
                  <el-input type="textarea" v-model="form.localCondition" style="width: 100%;"></el-input>
                </el-form-item>
              </el-col>

              <el-col class="el-col el-col-24 el-col-md-24 el-col-xs-24">
                <el-form-item label="评论" prop="remark">
                  <el-input type="textarea" v-model="form.remark" style="width: 100%;"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item class="dialog-footer" style="text-align: right;">
              <el-button type="primary" @click="sure('form')" :loading="sureTableLoading">保 存</el-button>
              <el-button @click="close('form')">取 消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
    </div>
    <!-- 导管评分 -->
    <div v-if="flag1">
      <pipelineScore :patientInfos="messages" />
    </div>
    <!-- uex登记表 -->
    <div v-if="flag2">
      <uex :patientInfos="messages" />
    </div>
    <!-- 引流液 -->
    <index ref="recordAddChild" @confirm="confirm" />
    <!-- 管道护理 -->
    <el-dialog
      title="管道护理"
      :visible.sync="dialogFormVisible1"
      width="90%"
      :fullscreen="isFullscreen"
    >
      <pipelineNursing :messages="messages" />
    </el-dialog>

    <!-- 评估结果 -->
    <el-dialog title="评估结果" :visible.sync="dialogFormVisible2" width="70%">
      <el-form label-width="120px">
        <el-table
          :data="assessmentResults"
          style="width: 100%"
          v-loading="assessmentResultsLoading"
        >
          <el-table-column type="index" :index="indexMethod" width="150" align="center"></el-table-column>
          <el-table-column prop="pipingName" label="管道名称" width="150" align="center"></el-table-column>
          <el-table-column prop="frequency" label="评估次数（次）" width="150" align="center"></el-table-column>
          <el-table-column prop="assessResult" label="评估得分（分）" width="150" align="center"></el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  connected,
  drawing,
  unconnected,
  open,
  uexOpen,
  uexDic,
  used,
  slippageJump,
  addSlippage,
  resultSlippage,
  openJump
} from "@/api/icu/patient/pipelineStatus";
import { addObj } from "@/api/icu/drainage/recorder";
import { mapGetters } from "vuex";
import { dateFormat, calcDate } from "@/util/date";
import pipelineScore from "@/views/icu/patient/components/pipelineStatus/pipelineScore";
import uex from "@/views/icu/patient/components/pipelineStatus/uex";
import index from "@/views/icu/drainage/component/index";
import pipelineNursing from "@/views/icu/patient/components/pipelineStatus/pipelineNursing";
import event from "@/util/event";
export default {
  props: {
    messages: Object
  },
  components: {
    pipelineScore,
    uex,
    index,
    pipelineNursing
  },
  computed: {
    ...mapGetters(["disable"])
  },
  name: "pipelineStatus",
  data() {
    return {
      // rulespr: {
      //    //   preventives: [
      //    //     {
      //    //       type: "array",
      //    //       required: true,
      //    //       message: "请至少选择一个",
      //    //       trigger: "change"
      //    //     }
      //    //   ],
      //    // nursingOutcomes: [
      //    //    { required: true, message: "请选择效果评价", trigger: "change" }
      //    // ]
      // },

      value: true,
      devBtn: 0,
      isFullscreen: false,
      screenWidth: document.body.clientWidth, // 屏幕尺寸
      tableLoading: false,
      sureTableLoading: false,
      // 弹窗
      dialogFormVisible: false,
      dialogFormVisible1: false,
      dialogFormVisible2: false,
      assessmentResultsLoading: false,
      loading: false,
      // 管道部位
      bodyParts: [],
      fixed: [],
      form: {
        pipingId: "",
        // 管道部位
        bodyParts: "",
        // 插入长度
        lengthBuiltin: "",
        // 外露长度
        lengthExposure: "",
        startTime: dateFormat(new Date()),
        // endTime: "",
        fixed: "",
        signName: "",
        signColor: "",
        localCondition: "",
        nursingMeasures: "",
        remark: ""
      },
      rules: {
        lengthBuiltin: [
          {
            required: true,
            message: "请输入插入长度",
            trigger: "blur"
          },
          {
            type: "number",
            message: "插入长度不合法",
            trigger: "blur",
            transform: value => Number(value),
            min: 0
            // max: 10
          }
        ],
        lengthExposure: [
          {
            required: true,
            message: "请输入外露长度",
            trigger: "blur"
          },
          {
            type: "number",
            message: "外露长度长度不合法",
            trigger: "blur",
            transform: value => Number(value),
            min: 0
            // max: 10
          }
        ],
        bodyParts: [
          {
            required: true,
            message: "请选择管道部位",
            trigger: "change"
          }
        ],
        signColor: [
          {
            required: true,
            message: "请选择标签颜色",
            trigger: "change"
          }
        ],
        fixed: [
          {
            required: true,
            message: "请选择固定方式方法",
            trigger: "change"
          }
        ],
        startTime: [
          {
            required: true,
            message: "请选择开始插管时间",
            trigger: "change"
          }
        ],
        endTime: [
          {
            required: true,
            message: "请选择开始插管时间",
            trigger: "change"
          }
        ]
      },
      options: [
        { value: 0, label: "已连接" },
        { value: 1, label: "未连接" },
        { value: 2, label: "已使用" }
      ],
      // 管路参数
      // 已连接
      connectedData: [],
      apparatus: {
        align: "center",
        addBtn: false,
        editBtn: false,
        stripe: true,
        delBtn: false,
        menuWidth: 150,
        border: true,
        column: [
          {
            label: "管路名称",
            prop: "pipingName"
          },

          {
            label: "引流液名称",
            prop: "drainageName"
          },
          {
            label: "连接时间",
            prop: "startTime"
          },
          {
            label: "连接时长",
            prop: "totalLengthOfTime"
          },
          {
            label: "管路评分（分）",
            prop: "assessmentScore"
          }
        ]
      },
      // 未连接
      unconnectedData: [],
      apparatus1: {
        align: "center",
        addBtn: false,
        editBtn: false,
        delBtn: false,
        menuWidth: 150,
        stripe: true,
        border: true,
        column: [
          {
            label: "管道名称",
            prop: "pipingName"
          },
          {
            label: "管道类型",
            prop: "pipingType"
          },
          {
            label: "入库时间",
            prop: "dateOfStorage",
            width: "160px"
          },
          {
            label: "有效时间",
            prop: "inDate",
            width: "160px"
          },
          {
            label: "风险水平",
            prop: "risklevel"
          }
          // {
          //    label: "危险等级",
          //    prop: "hazardLevel"
          // }
        ]
      },
      // 已使用
      usedData: [],
      apparatus2: {
        align: "center",
        addBtn: false,
        editBtn: false,
        delBtn: false,
        stripe: true,
        menuWidth: 150,
        border: true,
        column: [
          {
            label: "管道名称",
            prop: "pipingName",
            width: 160
          },
          {
            label: "管道部位",
            prop: "bodyParts"
          },
          {
            label: "开始插管时间",
            prop: "startTime",
            width: 160
          },
          {
            label: "结束插管时间",
            prop: "endTime",
            width: 160
          },
          {
            label: "插入长度(cm)",
            prop: "lengthBuiltin",
            width: 120
          },
          {
            label: "外露长度(cm)",
            prop: "lengthExposure",
            width: 120
          },
          {
            label: "固定方式方法",
            prop: "fixed",
            width: 160
          }
        ]
      },
      // 患者id
      patientId: "",
      flag: true,
      flag1: false,
      flag2: false,
      // uex信息
      patientInfo: {},
      // uex字典表数据
      dicData: [],
      // 所有管道
      pipingVos: [],
      startTime: "",

      // 滑脱风险字典表
      dicList: [],
      preventive: [],
      preventives: [],
      departure: [],
      causesOf: [],
      slippage: {
        pipingStartTime: "",
        pipUseRecordId: "",
        cannulaNarseId: "",
        patientId: "",
        preventiveMesures: "",
        nursingOutcomes: "",
        causesOfDetachment: "",
        patientDynamics: "",
        handle: ""
      },
      // 某管道的评估结果
      assessmentResults: [],
      piping_fixed_method: [],
      piping_position: [],
      piping_sign_color: [],
      preventive_nursing_measures: [],
      piping_type: []
    };
  },
  watch: {
    messages: {
      handler(newValue, oldValue) {
        this.messages = newValue;
        this.openPipeLine(this.messages.patientId);
        this.searchPipeline(this.messages.patientId);
        this.usedPipeline(this.messages.patientId);
      },
      deep: true
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
      that.isFullscreen = true;
    }
    if (this.messages.patientId) {
      this.openPipeLine(this.messages.patientId);
    }
    this.getListDic();
  },
  methods: {
    getListDic() {
      openJump("piping_fixed_method").then(response => {
        // console.log(response);
        this.piping_fixed_method = response.data.data;
      });
      openJump("piping_position").then(response => {
        // console.log(response);
        this.piping_position = response.data.data;
      });
      openJump("piping_type").then(response => {
        // console.log(response);
        this.piping_type = response.data.data;
      });
    },
    // 已连接
    openPipeLine(id) {
      this.tableLoading = true;
      connected(
        Object.assign({
          patientId: id
        })
      )
        .then(response => {
          if (response.data.data) {
            this.connectedData = response.data.data;
            this.connectedData.forEach(item => {
              const rawDatastartTime = item.startTime;
              let format = {
                rawDatastartTime: rawDatastartTime,
                // 开始时间
                startTime: item.startTime.substr(5, 11),
                // 计算时长
                totalLengthOfTime: this.calculatingTime(item.startTime)
              };
              Object.assign(item, format);
            });
          }
          this.tableLoading = false;
        })
        .catch(() => {});
    },
    // 未连接
    searchPipeline(id) {
      this.tableLoading = true;
      unconnected()
        .then(response => {
          if (response.data.data.records) {
            this.unconnectedData = response.data.data.records;
            this.unconnectedData.forEach(item => {
              this.piping_type.forEach(items => {
                if (item.pipingType == items.value) {
                  item.pipingType = items.label;
                }
              });
            });
          }
          this.tableLoading = false;
        })
        .catch(() => {});
    },
    // 已使用
    usedPipeline(id) {
      this.tableLoading = true;
      used(
        Object.assign({
          patientId: id
        })
      )
        .then(response => {
          if (response.data.data) {
            this.usedData = response.data.data;
            this.usedData.forEach(item => {
              this.piping_position.forEach(items => {
                if (items.value == item.bodyParts) {
                  item.bodyParts = items.label;
                }
              });
              this.piping_fixed_method.forEach(items => {
                if (items.value == item.fixed) {
                  item.fixed = items.label;
                }
              });
              let format = {
                startTime: item.startTime.substr(5, 11),
                endTime: item.endTime.substr(5, 11)
              };
              Object.assign(item, format);
            });
          }
          this.tableLoading = false;
        })
        .catch(() => {
          console.log("请求管路已使用失败");
        });
    },
    usedPipelineDic(item) {
      return new Promise((resolve, reject) => {
        openJump(item)
          .then(response => {
            var data = response.data.data;
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 更改管路按钮状态
    changeDevBtn(data) {
      this.devBtn = data;
      if (data == 0 || this.messages.patientId) {
        this.openPipeLine(this.messages.patientId);
      }
      if (data == 1) {
        this.searchPipeline(this.messages.patientId);
      }
      if (data == 2 || this.messages.patientId) {
        this.usedPipeline(this.messages.patientId);
      }
    },
    // 计算时长
    calculatingTime(time) {
      let v = calcDate(new Date(time).getTime(), new Date().getTime());
      var result = v.days + "天" + v.hours + "时" + v.minutes + "分";
      return result;
    },
    // 拔管
    extubation(row) {
      this.$confirm("是否关闭“" + row.pipingName + "”管路?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        tableLoading: true
      })
        .then(function() {
          // this.tableLoading = true;
          return drawing(Object.assign({ id: row.id }));
        })
        .then(() => {
          this.$message({
            showClose: true,
            message: "关闭成功",
            type: "success"
          });
          this.tableLoading = false;
          this.openPipeLine(this.messages.patientId);
        });
    },
    // 管路评分
    assessment(row) {
      this.flag = false;
      this.flag1 = true;
      Object.assign(this.messages, {
        pipingName: row.pipingName,
        useRecordsId: row.useRecordsId
      });
    },
    // 管道护理
    slippageRisk(row) {
      this.messages.pipingStartTime = row.rawDatastartTime;
      this.messages.pipUseRecordId = row.useRecordsId;
      this.messages.cannulaNarseId = row.nurseId;
      this.dialogFormVisible1 = true;
    },
    slippageCloses() {
      this.dialogFormVisible1 = false;
    },

    // UEX
    uex(row) {
      this.flag = false;
      this.flag2 = true;
      Object.assign(this.messages, {
        startTime: row.startTime,
        pipingId: row.pipingId,
        pipingName: row.pipingName,
        rawDatastartTime: row.rawDatastartTime,
        fixed: row.fixed
      });
    },
    // 返回
    parentMethod() {
      this.flag = true;
      this.flag1 = false;
      this.flag2 = false;
      this.openPipeLine(this.messages.patientId);
      this.searchPipeline(this.messages.patientId);
      // 调用其他页面返回顶部方法
      event.$emit("demo", "msg");
    },
    // 引流液
    drainage(val) {
      this.$refs.recordAddChild.recordAdd = true;
      this.$refs.recordAddChild.drainage(val);
    },
    confirm(row, done, loading) {
      if (this.$refs.recordAddChild.pipingRow == "") {
        this.$message.error("请选择一个 管路/患者");
      } else {
        if (this.$refs.recordAddChild.liquidData.piping == undefined) {
          this.$message.error("请选择一个 管路/患者");
        } else {
          if (this.$refs.recordAddChild.measures == "") {
            this.$message.error("请至少选择一样属性详情");
          } else {
            if (this.$refs.recordAddChild.form.value == "") {
              this.$message.error("请填写引流液值");
            } else {
              if (this.$refs.recordAddChild.form.resource == "") {
                this.$message.error("请选择属性状态");
              } else {
                var piping = this.$refs.recordAddChild.pipingRow.pipingId;
                var drainageId = this.$refs.recordAddChild.liquidData.piping
                  .drainageId;
                var nameType = this.$refs.recordAddChild.nameType;
                if (this.$refs.recordAddChild.form.measures == "") {
                  var measu = this.$refs.recordAddChild.measuresType;
                } else {
                  var measu = this.$refs.recordAddChild.form.measures;
                }
                // var patientId = this.$refs.recordAddChild.pipingRow
                //    .patientId;
                var patientId = this.messages.patientId;
                var form = this.$refs.recordAddChild.form;
                // console.log(1);
                addObj(piping, patientId, drainageId, nameType, measu, form)
                  .then(data => {
                    this.$message({
                      showClose: true,
                      message: "添加成功",
                      type: "success"
                    });
                    this.tableData.push(Object.assign({}, row));
                    this.openPipeLine(this.messages.patientId);
                    this.getListDic();
                    done();
                  })
                  .catch(() => {
                    this.$refs.recordAddChild.recordAdd = false;
                  });
              }
            }
          }
        }
      }
    },

    // 开启
    search(data) {
      this.form.pipingId = data.pipingId;
      this.dialogFormVisible = true;
      openJump("piping_sign_color").then(response => {
        // console.log(response);
        this.piping_sign_color = response.data.data;
      });
      openJump("preventive_nursing_measures").then(response => {
        // console.log(response);
        this.preventive_nursing_measures = response.data.data;
      });
    },
    close(form) {
      this.$refs[form].resetFields();
      this.dialogFormVisible = false;
    },
    sure(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.sureTableLoading = true;
          open(
            Object.assign(this.form, {
              patientId: this.messages.patientId
            })
          )
            .then(() => {
              this.$message({
                showClose: true,
                message: "开启成功",
                type: "success"
              });
              this.close(form);
              this.sureTableLoading = false;
              this.openPipeLine(this.messages.patientId);
              this.searchPipeline(this.messages.patientId);
            })
            .catch(() => {
              alert("开启失败");
              this.sureTableLoading = false;
            });
          this.dialogFormVisible = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 评估结果
    results(data) {
      this.assessmentResults = [];
      resultSlippage({
        patientId: data.patientId,
        projectCode: "slippage"
      }).then(response => {
        // console.log(response);
        var resultsData = response.data.data;
        resultsData.forEach((item, index) => {
          if (data.useRecordsId == item.remarks) {
            Object.assign(item, { pipingName: data.pipingName });
            this.assessmentResults.push(item);
          }
        });
        // console.log(this.assessmentResults);
        if (this.assessmentResults.length == 0) {
          this.dialogFormVisible2 = false;
          // this.assessmentResultsLoading = false;
          this.$message({
            showClose: true,
            message: "暂无评估",
            type: "warning",
            duration: "2000"
          });
        } else {
          // this.assessmentResultsLoading = true;
          this.dialogFormVisible2 = true;
          this.assessmentResults.forEach(item => {
            Object.assign(item, {
              frequency: this.assessmentResults.length
            });
          });
          // this.assessmentResultsLoading = false;
          // console.log(this.assessmentResults);
        }
      });
    },
    indexMethod(index) {
      return index * 1;
    }
  }
};
</script>

<style lang="scss" scoped>
.pip .EquipmentStatus {
  width: 100%;
}
.pip .EquipmentStatus_top button {
  margin-left: 1%;
}
.pip .devicewindow {
  margin: 10px auto;
  height: 600px;
  overflow-y: auto;
  // border: 1px solid #ebeef5;
  border-radius: 5px;
}

// .pip .el-dropdown-link {
//    color: #409eff;
//    cursor: pointer;
// }

.pip.table-bordered th,
.pip.table-bordered td,
.pip.table-bordered tr {
  border: 1px solid #ebeef5;
  text-align: left;
  span {
    font-size: 14px;
  }
  div {
    margin: 10px 0;
  }
}
.clearfix:after {
  content: "";
  clear: both;
  display: block;
}
</style>
