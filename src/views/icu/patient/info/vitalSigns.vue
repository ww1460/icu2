<template>
  <!-- 生命体征 -->
  <div class="box" v-loading="loading" :key="messages.patientId">
    <el-button @click="refreshDate" size="small" type="primary" icon="el-icon-refresh">刷新</el-button>
    <div id="myChart" ref="chart"></div>
    <div class="el-table">
      <table class="intake el-table__header Schedule" style="width:95%;">
        <thead>
          <tr class="el-table__row">
            <th class="el-table_2_column_4 is-center" colspan="2">项目\时间</th>
            <th
              class="el-table_2_column_4 is-center"
              v-for="(i,index) in arrTime"
              :key="index"
            >{{i}}</th>
          </tr>
        </thead>
        <tbody v-for="(item,index) in tableData.nursingReportVos" :key="index">
          <tr class="el-table__row">
            <td class="el-table_2_column_4 is-center" :colspan="2" :rowspan="2">{{item.projectName}}</td>
            <td
              class="el-table_2_column_4 is-center"
              v-for="(i,index1) in item.projectRecordDuplicates"
              :key="index1"
            >
              <p
                @click="amend(i,item,tableData.projectValueVos)"
                v-if="item.projectRecordValueFlag == 1"
              >{{i? i.projectValue:''}}</p>
              <p
                v-else-if="item.projectRecordValueFlag == 0"
                v-for="(item2,index2) in tableData.projectValueVos"
                :key="index2"
              >
                <span
                  v-if="item.projectId == item2.projectId"
                  v-for="item3 in item2.projectRecordValues"
                  :key="item3.id"
                  @click="amend(i,item,tableData.projectValueVos)"
                >{{item3.dataFlag == (i?i.projectValue:'') ?item3.recordValue:''}}</span>
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <el-dialog title="修改" :visible.sync="dialogVisible" width="30%">
      <div style="display: flex;justify-content: space-between">
        <p>项目：{{echarItem.title}}</p>
        <p>时间：{{echarItem.createTime}}</p>
      </div>
      <el-input v-model="echarItem.projectValue"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="SumEcharItem" :loading="SubLoading">保 存</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改" :visible.sync="amendDialogFormVisible" width="50%">
      <div style="display: flex;justify-content: space-between">
        <p>项目：{{amendData.title}}</p>
        <p>时间：{{amendData.createTime}}</p>
      </div>
      <el-input
        :disabled="amendData.projectRecordValueFlag == 0"
        v-model="amendData.projectSpecificRecord"
      ></el-input>
      <div
        v-if="amendData.projectRecordValueFlag == 0"
        style="display: flex;margin-top: 15px;justify-content: start;flex-wrap: wrap"
      >
        <el-button
          @click="changeValue(item)"
          :type="amendData.projectSpecificRecord == item.recordValue?'primary':''"
          v-for="item in amendList"
          :key="item.id"
          style="margin-top:10px;"
        >{{item.recordValue}}</el-button>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="amendLoading" @click="amendSub">保 存</el-button>
        <el-button @click="amendDialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
 
<script>
let that;
import { dateFormat } from "@/util/date";
import {
  fetchList,
  getEchart,
  getDate,
  updated,
  updateAamend
} from "@/api/icu/patient/vitalSigns";
export default {
  data() {
    return {
      amendLoading: false,
      echarItem: {
        createTime: "",
        projectValue: "",
        title: ""
      },
      amendData: {},
      amendList: [],
      amendDialogFormVisible: false,
      SubLoading: false,
      dialogVisible: false,
      projectNameList: [],
      dateTime: [],
      intakeData: [],
      presentTime: "",
      arrTime: [],
      echartsData: [],
      //图表数据
      AllTime: [],
      BP: [],
      BPTime: [],
      BPTimes: [],
      BPdata: [],

      P: [],
      PTime: [],
      PTimes: [],
      Pdata: [],

      DBP: [],
      DBPTime: [],
      DBPTimes: [],
      DBPdata: [],

      PCCR: [],
      PCCRTime: [],
      PCCRTimes: [],
      PCCRdata: [],

      R: [],
      RTime: [],
      RTimes: [],
      Rdata: [],

      SBP: [],
      SBPTime: [],
      SBPTimes: [],
      SBPdata: [],

      Sp02: [],
      Sp02Time: [],
      Sp02Times: [],
      Sp02data: [],

      T: [],
      TTime: [],
      TTimes: [],
      Tdata: [],

      TT: [],
      TTTime: [],
      TTTimes: [],
      TTdata: [],

      TK: [],
      TKTime: [],
      TKTimes: [],
      TKdata: [],

      HR: [],
      HRTime: [],
      HRTimes: [],
      HRdata: [],

      tableData: [],
      loading: true,
      totalList: [],
      projectNameList:[
        {id:1,label:'引流液',value:'YLY'},
        {id:2,label:'痰量',value:'TL'},
        {id:3,label:'尿量',value:'NL'},
        {id:4,label:'静脉入量',value:'JMRL'},
        {id:5,label:'口服鼻饲',value:'KFBS'}
      ]
    };
  },
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
        this.messages = newValue;
        this.$nextTick(() => {
          this.createdDate(this.messages.patientId);
          this.getIndexEchart(this.messages.patientId);
        });
      },
      deep: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.messages.patientId) {
        this.createdDate(this.messages.patientId);
        this.getIndexEchart(this.messages.patientId);
      } else {
        this.$message({
          message: "无患者",
          type: "warning"
        });
        this.loading = false;
      }
    });
  },
  beforeCreate() {
    that = this;
  },
  filters: {
    projectName: data => {
      for (var i in that.projectNameList) {
        if (i == data) {
          return that.projectNameList[i];
        }
      }
    }
  },
  methods: {
    //提交修改表格
    amendSub() {
      if (this.amendData.projectRecordValueFlag == 1) {
        this.amendData.projectValue = this.amendData.projectSpecificRecord;
      }
      this.amendLoading = true;
      updateAamend(this.amendData)
        .then(res => {
          this.$message({
            message: "修改成功",
            type: "success"
          });

          this.amendLoading = false;
          this.createdDate(this.messages.patientId);
          this.amendDialogFormVisible = false;
          this.amendData = {};
        })
        .catch(err => {
          this.amendLoading = false;
        });
    },

    //修改 固定值
    changeValue(item) {
      this.amendData.projectValue = item.dataFlag;
      this.amendData.projectSpecificRecord = item.recordValue;
    },

    //修改折线图下表格数据
    amend(row, item, table) {
      this.amendData = "";
      this.amendData = row;
      this.amendData.title = item.projectName;
      this.amendData.projectRecordValueFlag = item.projectRecordValueFlag;
      if (table) {
        for (let i in table) {
          if (table[i].projectId == row.projectId) {
            this.amendList = table[i].projectRecordValues;
          }
        }
      }

      this.amendDialogFormVisible = true;
    },

    //刷新数据
    refreshDate() {
      this.getIndexEchart(this.messages.patientId);
      this.createdDate(this.messages.patientId);
    },

    //点击折线图修改数据
    SumEcharItem() {
      this.SubLoading = true;
      updated(this.echarItem)
        .then(res => {
          this.SubLoading = false;
          if (res.data.code == 0) {
            this.$message({
              message: "修改成功",
              type: "success"
            });
          } else if (res.data.code == 3) {
            this.$message({
              message: res.data.msg,
              type: "success"
            });
          }
          this.getIndexEchart(this.messages.patientId);
          this.createdDate(this.messages.patientId);
          this.echarItem = {
            createTime: "",
            projectValue: "",
            title: ""
          };
          this.dialogVisible = false;
        })
        .catch(err => {
          this.$message({
            message: "修改失败",
            type: "warning"
          });
          this.SubLoading = false;
        });
    },
    //请求图表数据
    getIndexEchart(id) {
      this.loading = true;
      //图表数据
      this.AllTime = [];
      //这些 数据分别 代表 数据 时间 合并后的数据    多条Y轴 每条Y轴都是单独的    需要把所有的时间合并去重  然后把时间和数据合并成二维数组
      //这样每个数组里的时间都会出现在 X 轴上面

      this.P = [];
      this.PTime = [];
      this.PTimes = [];
      this.Pdata = [];

      this.DBP = [];
      this.DBPTime = [];
      this.DBPTimes = [];
      this.DBPdata = [];

      this.R = [];
      this.RTime = [];
      this.RTimes = [];
      this.Rdata = [];

      this.SBP = [];
      this.SBPTime = [];
      this.SBPTimes = [];
      this.SBPdata = [];

      this.T = [];
      this.TTime = [];
      this.TTimes = [];
      this.Tdata = [];

      this.HR = [];
      this.HRTime = [];
      this.HRTimes = [];
      this.HRdata = [];

      getEchart(id).then(res => {
        if (res.status == 200) {
          this.loading = false;
        }

        this.echartsData = res.data.data;
        this.DBP = this.echartsData.DBP;
        this.P = this.echartsData.P;
        this.R = this.echartsData.R;
        this.SBP = this.echartsData.SBP;
        this.T = this.echartsData.T;
        this.HR = this.echartsData.HR;

        //从每个数据对象里面 分别取出 时间 数据 放在不同的数组里面
        for (var i in this.T) {
          if (this.T.length != 0) {
            this.TTime.push(this.T[i].createTime);
            this.Tdata.push(this.T[i].projectValue);
          }
        }

        for (var i in this.P) {
          if (this.P.length != 0) {
            this.PTime.push(this.P[i].createTime);
            this.Pdata.push(this.P[i].projectValue);
          }
        }
        for (var i in this.DBP) {
          if (this.DBP.length != 0) {
            this.DBPTime.push(this.DBP[i].createTime);
            this.DBPdata.push(this.DBP[i].projectValue);
          }
        }

        for (var i in this.R) {
          if (this.R.length != 0) {
            this.RTime.push(this.R[i].createTime);
            this.Rdata.push(this.R[i].projectValue);
          }
        }
        for (var i in this.SBP) {
          if (this.SBP.length != 0) {
            this.SBPTime.push(this.SBP[i].createTime);
            this.SBPdata.push(this.SBP[i].projectValue);
          }
        }

        for (var i in this.HR) {
          if (this.HR.length != 0) {
            this.HRTime.push(this.HR[i].createTime);
            this.HRdata.push(this.HR[i].projectValue);
          }
        }

        //对取出的时间 数据 进行处理 空格替换成换行  数据变成二维数组

        this.DBPTime = this.DBPTime.map(function(str) {
          return str.replace(" ", "\n");
        });
        this.DBPTime.forEach((item, index) =>
          this.DBPTimes.push([item, this.DBPdata[index]])
        );

        this.PTime = this.PTime.map(function(str) {
          return str.replace(" ", "\n");
        });
        this.PTime.forEach((item, index) =>
          this.PTimes.push([item, this.Pdata[index]])
        );

        this.RTime = this.RTime.map(function(str) {
          return str.replace(" ", "\n");
        });
        this.RTime.forEach((item, index) =>
          this.RTimes.push([item, this.Rdata[index]])
        );

        this.SBPTime = this.SBPTime.map(function(str) {
          return str.replace(" ", "\n");
        });
        this.SBPTime.forEach((item, index) =>
          this.SBPTimes.push([item, this.SBPdata[index]])
        );

        this.TTime = this.TTime.map(function(str) {
          return str.replace(" ", "\n");
        });
        this.TTime.forEach((item, index) =>
          this.TTimes.push([item, this.Tdata[index]])
        );

        this.HRTime = this.HRTime.map(function(str) {
          return str.replace(" ", "\n");
        });
        this.HRTime.forEach((item, index) =>
          this.HRTimes.push([item, this.HRdata[index]])
        );

        this.AllTime = this.PTime.concat(
          this.HRTime,
          this.DBPTime,
          this.RTime,
          this.SBPTime,
          this.TTime
        );
        this.AllTime = [...new Set(this.AllTime)];
        this.AllTime.sort();

        this.$nextTick(() => {
          this.drawLine();
        });
      });
    },

    //下面的表格
    createdDate(id) {
      this.arrTime = [];
      var Time = new Date();
      this.presentTime = dateFormat(Time);
      let params = {
        patientId: id,
        endTime: this.presentTime
      };
      this.tableData = [];
      fetchList(params).then(res => {
        var time = 0;
        for (let i = res.data.data.hour; i < res.data.data.hour + 24; i++) {
          if (i >= 24) {
            time = i - 24;
          } else {
            time = i;
          }
          this.arrTime.push(time);
        }
        // //把每个项目的数据单独取出来
        this.tableData = res.data.data;
        // this.totalList = this.tableData.countNum;
        // this.projectNameList = this.tableData.projectName;
      });
    },
    drawLine() {
      var bar_dv = this.$refs.chart;

      if (bar_dv) {
        var myChart = this.$echarts.init(bar_dv);
        myChart.clear();
        // 绘制图表
        myChart.setOption({
          tooltip: {
            trigger: "axis"
          },
          color: [
            "#c44644",
            "#0B438B",
            "#e31e40",
            "#d6886c",
            "#3b505f",
            "#77adb7"
          ],
          legend: {
            // data: ["脉搏", "呼吸", "体温", "收缩压", "舒张压", "心率"],
            data: ["体温", "心率", "脉搏", "呼吸", "收缩压", "舒张压"],
            textStyle: {
              color: "#a6ccef",
              fontsize: 5
            }
          },
          grid: [
            {
              left: "12%",
              right: "12%",
              height: "70%",
              top: "15%"
            }
          ],
          toolbox: {
            // right:20,
            show: true,
            feature: {
              // dataView: {
              //   optionToContent: function(opt) {
              //     //时间为每一个小时为间距  获取当前时间 往前推一天的数据
              //     //时间为横向排列  项目为横向排列
              //     //当一个时间出现 多个数据的时候 当前项目纵向出现多排  项目纵向排列
              //     // 出入量需要分开多个项目   比如 喝水 输液 需要分开

              //     // var data = new Date()
              //     let axisData = opt.xAxis[0].data; //坐标数据
              //     let series = opt.series; //折线图数据
              //     // console.log(axisData)

              //     // console.log(data)
              //     // console.log(dateFormat(data))

              //     // //取出当前时间

              //     // let tdHeads = `<td style="padding:12px 15px;text-align:center;  font-weight: 600;">时间</td>`

              //     //   for(var i in axisData){
              //     //     console.log(axisData[i])
              //     // }
              //     let tdHeads =
              //       '<td style="padding:12px 15px;text-align:center;  font-weight: 600;">时间</td>'; //表头

              //     let tdBodys = ""; //数据
              //     series.forEach(function(item) {
              //       //组装表头
              //       tdHeads += `<td style="padding:12px 15px;text-align:center;  font-weight: 600;">${item.name}</td>`;
              //     });
              //     let table = `<table class='Schedule ' border="1" style="width:100%;border:1px solid #EBEEF5"><tbody><tr>${tdHeads} </tr>`;
              //     for (let i = 0, l = axisData.length; i < l; i++) {
              //       for (let j = 0; j < series.length; j++) {
              //         if (
              //           series[j].data[i] == " " ||
              //           series[j].data[i] == undefined
              //         ) {
              //           series[j].data[i] = " ";
              //         } else {
              //           if (series[j].data[i].length == 2) {
              //             series[j].data[i] = series[j].data[i][1];
              //           }
              //         }
              //         //组装表数据
              //         tdBodys += `<td  style="padding:12px 15px;text-align:center;">${series[j].data[i]}</td>`;
              //       }
              //       table += `<tr><td style="padding:12px 15px;text-align:center;">${axisData[i]}</td>${tdBodys}</tr>`;
              //       tdBodys = "";
              //     }

              //     table += "</tbody></table>";

              //     return table;
              //   }
              // },
              magicType: { type: ["line", "bar"] },
              restore: {}
            }
          },
          dataZoom: [
            {
              type: "inside"
              // top: "70%"
            },
            {
              type: "slider"
            }
          ],
          xAxis: [
            {
              gridIndex: 0,
              type: "category",
              boundaryGap: true,
              axisLine: { onZero: true },
              data: this.AllTime
            }
          ],

          //写一个数组 等任务数据 循环添加
          yAxis: [
            {
              axisLine: { show: false },
              axisTick: { show: false },
              scale: true,
              boundaryGap: [0, "50%"],
              type: "value",
              name: "体温",
              // 列偏移
              position: "left",
              offset: 90,
              // y轴 默认以10开始
              splitNumber: 7,
              axisLabel: {
                formatter: "{value}",
                align: "left",
                textStyle: {
                  color: "#c44644"
                }
              },
              splitLine: {
                show: false
              },
              // y轴颜色
              nameTextStyle: {
                color: "#c44644"
              }
            },
            {
              gridIndex: 0,
              axisLine: { show: false },
              axisTick: { show: false },
              scale: true,
              boundaryGap: [0, "50%"],
              splitLine: {
                show: false
              },
              type: "value",
              name: "心率",
              position: "left",
              offset: 55,
              splitNumber: 7,
              axisLabel: {
                formatter: "{value}",
                align: "left",
                textStyle: {
                  color: "#0B438B"
                }
              },
              nameTextStyle: {
                color: "#0B438B"
              }
            },
            {
              gridIndex: 0,
              axisLine: { show: true },
              axisTick: { show: true },
              scale: true,
              boundaryGap: [0, "50%"],
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
              name: "脉搏",
              nameTextStyle: {
                color: "#e31e40"
              }
            },

            {
              gridIndex: 0,
              axisLine: { show: false },
              axisTick: { show: false },
              scale: true,
              boundaryGap: [0, "50%"],
              axisLabel: {
                formatter: "{value}",
                align: "right",
                textStyle: {
                  color: "#d6886c"
                }
              },
              splitLine: {
                show: false
              },
              type: "value",
              name: "呼吸",
              offset: 0,
              splitNumber: 7,
              position: "rigth",
              nameTextStyle: {
                color: "#d6886c"
              }
            },

            {
              axisLine: { show: false },
              axisTick: { show: false },
              scale: true,
              boundaryGap: [0, "50%"],
              splitLine: {
                show: false
              },
              type: "value",
              name: "收缩压",
              offset: 50,
              splitNumber: 7,
              position: "right",
              axisLabel: {
                formatter: "{value}",
                align: "right",
                textStyle: {
                  color: "#77adb7"
                }
              },
              nameTextStyle: {
                color: "#77adb7"
              }
            },
            {
              gridIndex: 0,
              axisLine: { show: false },
              axisTick: { show: false },
              scale: true,
              boundaryGap: [0, "50%"],
              splitLine: {
                show: false
              },
              type: "value",
              name: "舒张压",
              position: "right",
              offset: 100,
              splitNumber: 7,
              axisLabel: {
                formatter: "{value}",
                align: "right",
                textStyle: {
                  color: "#3b505f"
                }
              },
              nameTextStyle: {
                color: "#3b505f"
              }
            }
          ],
          // series:function(){
          //   var serie = []

          // }
          series: [
            {
              xAxisIndex: 0,
              yAxisIndex: 0,
              symbolSize: 10,
              symbol: "pin",
              name: "体温",
              type: "line",
              data: this.TTimes
            },
            {
              xAxisIndex: 0,
              yAxisIndex: 1,
              symbolSize: 10,
              symbol: "circle",
              name: "心率",
              type: "line",
              data: this.HRTimes
            },
            {
              xAxisIndex: 0, //这个代表第几个X轴 多条x轴使用
              yAxisIndex: 2, //这个代表第几个轴 多条x轴使用
              symbolSize: 10,
              name: "脉搏",
              type: "line",
              data: this.PTimes,
              symbol: "triangle"
            },
            {
              xAxisIndex: 0,
              yAxisIndex: 3,
              symbolSize: 10,
              symbol: "diamond",
              name: "呼吸",
              type: "line",
              data: this.RTimes
            },

            {
              xAxisIndex: 0,
              yAxisIndex: 4,
              symbolSize: 10,
              symbol: "rect",
              name: "收缩压",
              type: "line",
              data: this.SBPTimes
            },
            {
              xAxisIndex: 0,
              yAxisIndex: 5,
              symbolSize: 10,
              symbol: "rect",
              name: "舒张压",
              type: "line",
              data: this.DBPTimes
            }
          ]
        });
        // //鼠标事件
        myChart.on("click", params => {
          this.dialogVisible = true;
          var str = "";
          str = params.data[0].replace("\n", " ");
          if (params.seriesName == "体温") {
            for (var i in this.T) {
              if (this.T[i].createTime == str) {
                this.echarItem = this.T[i];
              }
            }
          }
          if (params.seriesName == "呼吸") {
            for (var i in this.R) {
              if (this.R[i].createTime == str) {
                this.echarItem = this.R[i];
              }
            }
          }
          if (params.seriesName == "脉搏") {
            for (var i in this.P) {
              if (this.P[i].createTime == str) {
                this.echarItem = this.P[i];
              }
            }
          }
          if (params.seriesName == "舒张压") {
            for (var i in this.DBP) {
              if (this.DBP[i].createTime == str) {
                this.echarItem = this.DBP[i];
              }
            }
          }
          if (params.seriesName == "收缩压") {
            for (var i in this.SBP) {
              if (this.SBP[i].createTime == str) {
                this.echarItem = this.SBP[i];
              }
            }
          }
          if (params.seriesName == "心率") {
            for (var i in this.HR) {
              if (this.HR[i].createTime == str) {
                this.echarItem = this.HR[i];
              }
            }
          }
          this.echarItem.title = params.seriesName;
        });
        window.onresize = function() {
          myChart.resize();
        };
      }
    }
  }
};
</script>
 
<style  lang="scss">
.intake {
  min-width: 1400px;

  td,
  th {
    cursor: pointer;
    text-align: center !important;
    padding: 12px 1px !important;
    line-height: 45px;
    border: 1px solid #f4f5f9;
    min-width: 24.6%;
    font-size: 12px;
    height: 80px;
  }
}
.box {
  border: 1px solid #ccc;
  border-radius: 5px;
  .el-table {
    min-width: 1000px;
    overflow-x: auto;
  }
}
// .Schedule tr:nth-child(odd) {
//   background: #fafafa;
// }
// .Schedule tr:hover {
//   background: rgb(245, 247, 250);
// }
.echarTd {
  padding: 0 15px;
  color: red;
}
#myChart {
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