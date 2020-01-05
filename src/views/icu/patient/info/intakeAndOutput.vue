
<template>
  <div class="execution">
    <el-button
      @click="changeFlag"
      style="margin-left:5px; margin-bottom: 10px;"
      size="small"
      type="primary"
    >图表切换</el-button>
    <el-date-picker
      editable
      v-model="StartTime"
      style="margin-left:15px"
      @change="changeTime"
      v-show="echartsFlag == false"
      type="datetime"
      size="small"
      placeholder="选择日期时间"
      align="right"
      :picker-options="pickerOptions1"
    ></el-date-picker>

    <div v-show="echartsFlag">
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableDataList"
        :permission="permissionList"
        :table-loading="tableLoading"
        :option="tableOption"
        @search-change="searchChange"
        @search-reset="searchReset"
        @row-update="Update"
        @row-save="handleSave"
        @size-change="sizeChange"
        @current-change="currentChange"
      >
        <template slot="search">
          <el-col :md="7" :xs="24">
            <el-form-item>
              <el-date-picker
                v-model="value2"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
                size="small"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </template>
        <template slot="searchMenu">
          <el-button type="primary" size="small" icon="el-icon-plus" @click="rowAdd()">新增</el-button>
        </template>
      </avue-crud>
      <el-dialog
        title="新增出入量"
        :visible.sync="dialogFormVisible"
        :fullscreen="isFullscreen"
        @close="closeDilog('form')"
      >
        <el-form ref="form" :model="form">
          <el-row>
            <el-col class="el-col el-col-24 el-col-md-12 el-col-xs-24">
              <el-form-item label="患者姓名" :label-width="formLabelWidth">
                <el-select v-model="form.patientId" style="width:100%">
                  <el-option
                    v-for="item in patientNames"
                    :key="item.patientId"
                    :label="item.patientName"
                    :value="item.patientId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col class="el-col el-col-24 el-col-md-12 el-col-xs-24">
              <el-form-item label="出入量" :label-width="formLabelWidth" prop="projectType">
                <el-radio-group v-model="projectType" @change="projectTypeBtn" style="width:100%">
                  <el-radio :label="2">出量</el-radio>
                  <el-radio :label="3">入量</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col class="el-col el-col-24 el-col-md-12 el-col-xs-24">
              <el-form-item
                label="项目"
                :label-width="formLabelWidth"
                prop="projectId"
                :rules="[
      { required: true, message: '请选择项目'},
    ]"
              >
                <el-select v-model="form.projectId" style="width:100%">
                  <el-option
                    v-for="item in project"
                    :key="item.projectId"
                    :label="item.projectName"
                    :value="item.projectId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col class="el-col el-col-24 el-col-md-12 el-col-xs-24">
              <el-form-item
                label="出入量值"
                :label-width="formLabelWidth"
                prop="intakeOutputValue"
                :rules="[
      { required: true, message: '请输入出入量值'},
      { type: 'number', message: '出入量值必须为数字值'}
    ]"
              >
                <el-input
                  type="intakeOutputValue"
                  v-model.number="form.intakeOutputValue"
                  style="width:100%"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col class="el-col el-col-24 el-col-md-24 el-col-xs-24">
              <el-form-item label="创建时间" :label-width="formLabelWidth">
                <el-date-picker
                  v-model="form.createTime"
                  type="datetime"
                  placeholder="选择日期时间"
                  align="right"
                  :picker-options="pickerOptions"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col class="el-col el-col-24 el-col-md-24 el-col-xs-24">
              <el-form-item label="描述" :label-width="formLabelWidth">
                <el-input type="textarea" v-model="form.valueDescription" placeholder="请输入出入量描述"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="sure('form')" :loading="sureLoading">确 定</el-button>
          <el-button @click="close('form')">取 消</el-button>
        </div>
      </el-dialog>
    </div>
    <div v-show="echartsFlag == false" :key="messages.patientId" class="box">
      <div id="myCharts" ref="echart" v-loading="loadingEchar"></div>
      <div
        class="el-table el-table--fit el-table--striped el-table--border el-table--enable-row-transition el-table--medium"
      >
        <table class="intakes el-table__header Schedule" style="width:95%;">
          <thead>
            <tr>
              <th class="el-table_2_column_4 is-center" colspan="2">项目\时间</th>
              <th
                class="el-table_2_column_4 is-center"
                v-for="(i,index) in arrTime"
                :key="index"
              >{{i}}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="el-table__row"
              v-for="(item,key,index3) in tableData.intakeShows"
              :key="item.id"
            >
              <td :rowspan="Object.keys(tableData.intakeShows).length" v-if="index3==0">入量</td>
              <td>{{key | projectName}}</td>
              <td v-for="(i,index1) in item" :key="index1">
                <p v-for="(j,index2) in i" :key="index2">{{j.intakeOutputValue}}</p>
              </td>
            </tr>

            <tr
              class="el-table__row"
              v-for="(item,key,index3) in tableData.outputShows"
              :key="item.id"
            >
              <td :rowspan="Object.keys(tableData.outputShows).length" v-if="index3==0">出量</td>
              <td>{{key | projectName}}</td>
              <td v-for="(i,index1) in item" :key="index1">
                <p v-for="(j,index2) in i" :key="index2">{{j.intakeOutputValue}}</p>
              </td>
            </tr>
            <tr class="el-table__row">
              <td colspan="2">小计</td>
              <td v-for="(item,index) in tableData.countNum" :key="index">{{item}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
let that;
import {
  addObj,
  delObj,
  fetchList,
  putObj,
  UpdateObj,
  getProjectType,
  getnurse,
  addProjectType,
  fetchLists,
  getEcharts
} from "@/api/icu/patient/intakeAndOutput";
import { tableOption } from "@/const/crud/icu/patient/intakeAndOutput";
import { dateFormat } from "@/util/date";
import { mapGetters, mapState } from "vuex";

export default {
  name: "intakeAndOutput",
  props: {
    messages: {
      type: Object
    },
    tabIndex: {
      type: Number
    }
  },
  watch: {
    messages: {
      handler(newValue, oldValue) {
        this.form.patientId = "";
        this.patientNames = [];
        this.searchForm = {};

        this.form.patientId = newValue.patientId;
        this.params = {
          patientId: this.form.patientId
        };
        this.getList(this.page, this.params);

        this.messages = newValue;
        this.$nextTick(() => {
          this.createdDates(this.messages.patientId);
          this.getIndexEcharts(this.messages.patientId);
          this.messages = newValue;
        });
      },
      deep: true
    }
  },
  data() {
    return {
      isFullscreen: false,
      screenWidth: document.body.clientWidth, // 屏幕尺寸
      echartsFlag: false,
      searchForm: {},
      tableDataList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption,
      dialogFormVisible: false,
      formLabelWidth: "80px",
      sureLoading: false,
      form: {
        patientId: "",
        projectId: "",
        intakeOutputType: "",
        intakeOutputValue: "",
        valueDescription: "",
        createTime: ""
      },
      projectType: 2,
      patientNames: [],
      project: [],
      projectNameList: [],
      dateTime: [],
      intakeData: [],
      presentTime: "",
      arrTime: [],
      echartsData: [],
      //图表数据
      AllTime: [],
      output: [],
      outputTime: [],
      outputTimes: [],
      outputdata: [],

      ntakeOutput: [],

      intake: [],
      intakeTime: [],
      intakeTimes: [],

      intakeTotal: [],
      intakeTotalTime: [],
      intakeTotalTimes: [],

      outputTotal: [],
      outputTotalTime: [],
      outputTotalTimes: [],
      echarTime: "",
      SY: [],
      SX: [],
      NY: [],
      HS: [],
      TL: [],
      tableData: [],
      loading: true,
      totalList: [],
      loadingEchar: false,
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      pickerOptions1: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      value2: "",
      StartTime: "",
      projectItemList: [
        { id: 1, label: "引流液", value: "YLY" },
        { id: 2, label: "痰量", value: "TL" },
        { id: 3, label: "尿量", value: "NL" },
        { id: 4, label: "静脉入量", value: "JMRL" },
        { id: 5, label: "口服鼻饲", value: "KFBS" },
        { id: 6, label: "其他", value: "other" }
      ]
    };
  },
  computed: {
    ...mapGetters(["permissions", "nurse_patients", "dep_patients"]),
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
  beforeCreate() {
    that = this;
  },
  filters: {
    projectName: data => {
      for (let i in that.projectItemList) {
        if (that.projectItemList[i].value == data) {
          return that.projectItemList[i].label;
        }
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

    this.$nextTick(() => {
      if (this.messages.patientId) {
        this.createdDates(this.messages.patientId);
        this.getIndexEcharts(this.messages.patientId);
      } else {
        this.$message.warning("无患者");
      }
    });
  },
  created() {
    var Time = new Date();
    this.StartTime = dateFormat(Time);
    let data = JSON.parse(sessionStorage.getItem("pigx-all_patients")).content;
    this.patientNames = data;
  },
  methods: {
    closeDilog(formName) {
      this.$nextTick(() => {
        this.$refs[formName].resetFields();
      });
    },
    //图表切换时候的时间
    changeTime(val) {
      if (val) {
        this.StartTime = dateFormat(val);
        this.getIndexEcharts();
        this.createdDates();
      }
    },

    changeFlag() {
      this.echartsFlag = !this.echartsFlag;
      this.getList(this.page, {patientId:this.messages.patientId});
      this.createdDates(this.messages.patientId);
      this.getIndexEcharts(this.messages.patientId);
    },
    //请求图表数据
    getIndexEcharts(id) {
      this.loading = true;
      //图表数据
      this.AllTime = [];
      //这些 数据分别 代表 数据 时间 合并后的数据    多条Y轴 每条Y轴都是单独的    需要把所有的时间合并去重  然后把时间和数据合并成二维数组
      //这样每个数组里的时间都会出现在 X 轴上面

      this.output = [];
      this.outputTime = [];
      this.outputTimes = [];
      this.outputdata = [];

      this.ntakeOutput = [];

      this.intake = [];
      this.intakeTime = [];
      this.intakeTimes = [];
      this.intakedata = [];

      this.intakeTotalTime = [];
      this.intakeTotal = [];
      this.intakeTotalTimes = [];

      this.outputTotal = [];
      this.outputTotalTime = [];
      this.outputTotalTimes = [];
      var obj = {};
      obj = {
        endTime: this.StartTime,
        patientId: this.messages.patientId
      };
      getEcharts(obj).then(res => {
        if (res.status == 200) {
          this.loading = false;
        }
        this.ntakeOutput = res.data.data;
        for (var i in this.ntakeOutput) {
          if (this.ntakeOutput[i].intakeOutputType == 1) {
            this.intake.push(this.ntakeOutput[i].intakeOutputValue);
            this.intakeTime.push(this.ntakeOutput[i].createTime);
          } else if (this.ntakeOutput[i].intakeOutputType == 0) {
            this.output.push(this.ntakeOutput[i].intakeOutputValue);
            this.outputTime.push(this.ntakeOutput[i].createTime);
          } else if (this.ntakeOutput[i].intakeOutputType == 3) {
            this.outputTotal.push(this.ntakeOutput[i].intakeOutputValue);
            this.outputTotalTime.push(this.ntakeOutput[0].createTime);
          } else if (this.ntakeOutput[i].intakeOutputType == 2) {
            this.intakeTotal.push(this.ntakeOutput[i].intakeOutputValue);
            this.intakeTotalTime.push(this.ntakeOutput[0].createTime);
          }
        }

        for (var i in this.output) {
          this.output[i] = Math.abs(this.output[i]);
        }
        this.outputTotal[0] = Math.abs(this.outputTotal[0]);
        this.intakeTotalTime = this.intakeTotalTime.map(function(str) {
          return str.replace(" ", "\n");
        });
        this.intakeTotalTime.forEach((item, index) =>
          this.intakeTotalTimes.push([item, this.intakeTotal[index]])
        );

        this.outputTotalTime = this.outputTotalTime.map(function(str) {
          return str.replace(" ", "\n");
        });
        this.outputTotalTime.forEach((item, index) =>
          this.outputTotalTimes.push([item, this.outputTotal[index]])
        );

        //从每个数据对象里面 分别取出 时间 数据 放在不同的数组里面

        this.intakeTime = this.intakeTime.map(function(str) {
          return str.replace(" ", "\n");
        });
        this.intakeTime.forEach((item, index) =>
          this.intakeTimes.push([item, this.intake[index]])
        );

        this.outputTime = this.outputTime.map(function(str) {
          return str.replace(" ", "\n");
        });
        this.outputTime.forEach((item, index) =>
          this.outputTimes.push([item, this.output[index]])
        );

        this.AllTime = this.outputTime.concat(this.intakeTime);
        this.AllTime = [...new Set(this.AllTime)];
        this.AllTime.sort();

        this.drawLine();
      });
    },
    //下面的表格
    createdDates(id) {
      let params = {
        patientId: this.messages.patientId,
        endTime: this.StartTime
      };
      this.tableData = [];
      fetchLists(params).then(res => {
        this.arrTime = [];
        var time = 0;
        for (
          var i = res.data.data.startTimeHour;
          i < res.data.data.startTimeHour + 24;
          i++
        ) {
          if (i >= 24) {
            time = i - 24;
          } else {
            time = i;
          }
          this.arrTime.push(time);
        }
        //把每个项目的数据单独取出来
        this.tableData = res.data.data;
        this.totalList = this.tableData.countNum;
        this.projectNameList = this.tableData.projectName;
      });
    },
    drawLine() {
      this.loadingEchar = true;
      // 基于准备好的dom，初始化echarts实例
      var bar_dv = this.$refs.echart;

      if (bar_dv) {
        this.loadingEchar = false;
        var myCharts = this.$echarts.init(bar_dv);
        myCharts.clear();
        myCharts.setOption({
          tooltip: {
            trigger: "axis"
            // axisPointer: {
            //   type: "cross",
            //   animation: false,
            //   label: {
            //     backgroundColor: "#505765"
            //   }
            // }
          },
          legend: {
            data: ["出量", "入量", "出量总和", "入量总和"]
          },
          grid: [
            {
              left: "8%",
              right: "5%",
              height: "70%"
              // top: "12%"
            }
          ],
          dataZoom: [
            {
              type: "inside"
              // top: "70%"
            },
            {
              type: "slider"
            }
          ],
          xAxis: {
            gridIndex: 0,
            type: "category",
            boundaryGap: true,
            axisLine: { onZero: true },
            data: this.AllTime
          },
          yAxis: [
            {
              gridIndex: 0,
              axisLine: { show: true },
              axisTick: { show: true },
              scale: false,
              // boundaryGap: [0, "80%"],
              axisLabel: {
                formatter: "{value}",
                textStyle: {
                  color: "#e31e40"
                }
              },
              // 虚线实线
              splitLine: {
                // show: true,
                lineStyle: {
                  color: ["#ccc"],
                  width: 1,
                  type: "dashed"
                }
              },

              position: "left",
              offset: 0,
              splitNumber: 7,
              type: "value",
              name: "出入量",
              nameTextStyle: {
                color: "#e31e40"
              }
            }
          ],

          series: [
            {
              name: "出量",
              type: "bar",
              xAxisIndex: 0,
              yAxisIndex: 0,
              symbolSize: 8,
              hoverAnimation: false,
              barMaxWidth: 30,
              barRadius: 5,
              data: this.outputTimes,
              color: "#359ded"
            },
            {
              name: "入量",
              type: "bar",
              xAxisIndex: 0,
              yAxisIndex: 0,
              symbolSize: 8,
              hoverAnimation: false,
              barMaxWidth: 30,
              barRadius: 5,
              data: this.intakeTimes,
              color: "#d6886c"
            },
            {
              name: "出量总和",
              type: "bar",
              xAxisIndex: 0,
              yAxisIndex: 0,
              symbolSize: 8,
              hoverAnimation: false,
              barMaxWidth: 30,
              barRadius: 5,
              data: this.outputTotalTimes,
              color: "#EAAB71"
            },
            {
              name: "入量总和",
              type: "bar",
              xAxisIndex: 0,
              yAxisIndex: 0,
              symbolSize: 8,
              hoverAnimation: false,
              barMaxWidth: 30,
              barRadius: 5,
              data: this.intakeTotalTimes,
              color: "#F265AE"
            }
          ]
        });

        // //鼠标事件
        myCharts.on("click", function(params) {
          // console.log(params);
        });
        window.onresize = function() {
          myCharts.resize();
        };
      }
    },
    handleCreate(row, index, done, loading) {
      putObj(row.nurseId)
        .then(data => {
          this.$refs.crud.rowView(data.data.data, index);
          done();
        })
        .catch(() => {});
    },
    //点击修改提交
    Update(row, index, loading) {
      UpdateObj(row)
        .then(data => {
          this.$refs.crud.rowEdit(data.data.data, index);
          this.tableData.splice(index, 1, Object.assign({}, row));
          this.$message({
            showClose: true,
            message: "修改成功",
            type: "success"
          });
          done();
          let params = {
            patientId: this.form.patientId
          };
          this.getList(this.page, params);
        })
        .catch(() => {
          loading();
        });
    },

    getList(page, params) {
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
          this.tableDataList = response.data.data.records;
          this.page.total = response.data.data.total;
          this.tableLoading = false;
        })
        .catch(() => {
          this.tableLoading = false;
        });
    },
    rowAdd() {
      this.dialogFormVisible = true;
      this.project = [];
      getProjectType(2).then(res => {
        res.data.data.forEach(i => {
          this.project.push({
            projectName: i.projectName,
            projectId: i.projectId
          });
        });
      });
    },
    rowDel: function(row, index) {
      var _this = this;
      this.$confirm("是否确认删除" + row.realName, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return delObj(row.nurseId);
        })
        .then(data => {
          _this.tableData.splice(index, 1);
          _this.$message({
            showClose: true,
            message: "删除成功",
            type: "success"
          });
          let params = {
            patientId: this.form.patientId
          };
          this.getList(this.page, params);
        });
    },
    /**
     * @title 数据更新
     * @param row 为当前的数据
     * @param index 为当前更新数据的行数
     * @param done 为表单关闭函数
     *
     **/
    //点击编辑
    handleUpdate: function(row, index, done, loading) {
      putObj(row.nurseId)
        .then(data => {
          this.$refs.crud.rowEdit(data.data.data, index);
          done();
        })
        .catch(() => {});
    },
    /**
     * @title 数据添加
     * @param row 为当前的数据
     * @param done 为表单关闭函数
     *
     **/
    handleSave: function(row, done, loading) {
      addObj(row)
        .then(data => {
          this.tableData.push(Object.assign({}, row));
          this.$message({
            showClose: true,
            message: "添加成功",
            type: "success"
          });
          done();
          let params = {
            patientId: this.form.patientId
          };
          this.getList(this.page, params);
        })
        .catch(() => {
          loading();
        });
    },
    /**
     * 搜索回调
     */
    searchChange(form) {
      if (this.value2) {
        form.startTime = dateFormat(this.value2[0]);
        form.endTime = dateFormat(this.value2[1]);
      }
      this.page = {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      };
      let params = {
        patientId: this.form.patientId
      };
      // Object.assign(form, params);
      this.searchForm = form;
      this.getList(this.page, form);
    },
    /**
     * 刷新回调
     */
    // refreshChange() {
    //    let params = {
    //       patientId: this.form.patientId
    //    };
    //    this.getList(this.page, params);
    // },
    searchReset() {
      this.page = {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      };
      this.value2 = "";
      this.searchForm = {};
      this.getList(this.page, this.searchForm);
    },
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;

      this.getList(this.page);
    },
    currentChange(val) {
      this.page.currentPage = val;

      this.getList(this.page);
    },
    // 出入量请求
    projectTypeBtn(val) {
      this.project = [];
      this.form.projectId = "";
      getProjectType(val).then(res => {
        res.data.data.forEach(i => {
          this.project.push({
            projectName: i.projectName,
            projectId: i.projectId
          });
        });
      });
      this.$forceUpdate();
    },
    close(form) {
      this.projectType = 2;
      this.dialogFormVisible = false;
      this.sureLoading = false;
      this.form.projectId = "";
      this.form.intakeOutputType = "";
      this.form.intakeOutputValue = "";
      this.form.valueDescription = "";
      this.$refs[form].resetFields();
    },
    sure(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.sureLoading = true;
          // console.log(this.form);
          if (this.projectType == 2) {
            this.form.intakeOutputType = 0;
          } else if (this.projectType == 3) {
            this.form.intakeOutputType = 1;
          }
          this.form.createTime = dateFormat(this.form.createTime);
          addProjectType(this.form).then(res => {
            this.$message({
              showClose: true,
              message: "添加成功",
              type: "success"
            });
            let params = {
              patientId: this.form.patientId
            };
            this.getList(this.page, params);
            this.sureLoading = false;
            this.close();
          });
          // this.close();
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.intakes {
  min-width: 1300px;
  td,
  th {
    text-align: center !important;
    padding: 12px 1px !important;
    // border: 1px solid #EBEEF5;
    min-width: 40px;
  }
}
.box {
  border: 1px solid #ccc;
  border-radius: 5px;
  .el-table {
    // min-width: 1000px;
    overflow-x: auto;
  }
}
.Schedule tr:nth-child(odd) {
  background: #fafafa;
}
.Schedule tr:hover {
  background: rgb(245, 247, 250);
}
.echarTd {
  padding: 0 15px;
  color: red;
}
#myCharts {
  height: 500px;
}

@media screen and (max-width: 1024px) {
  .box {
    width: 830px;
  }
}
@media screen and (max-width: 768px) {
  .box {
    width: 580px;
  }
}
</style>
