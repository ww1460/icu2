
<template>
  <!-- 护士首页健康评估 -->
  <div class="execution">
    <div id="my-echarts"></div>

    <!-- 评估展示列表  -->
    <div>
      <!-- 评估按钮 -->
      <div class="assList">
        <el-button type="primary" size="small" class="assBtn" @click="getTitle()">评估</el-button>
      </div>

      <avue-crud
        ref="crud"
        :data="tableData"
        :page="page"
        :permission="permissionList"
        :table-loading="tableLoading"
        :option="tableOption"
        style="margin-bottom:20px"
        @on-load="getList"
        @search-change="searchChange"
        @refresh-change="refreshChange"
        @row-del="rowDel"
      />
    </div>

    <!-- 评估弹框 -->
    <el-dialog :title="dialogHealthassType" :visible.sync="dialogHealthass">
      <div v-for="(itemw,index) in itemq" :key="index" style="padding-left:5%">
        <div class="a01">
          <span>{{ itemw.indicator }}</span>
        </div>
        <div class="a02">
          <template>
            <el-input-number
              v-model="itemw.wtl05"
              :min="itemw.lowerLimit"
              :max="itemw.upperLimit"
              style="width:320px;"
            ></el-input-number>&nbsp;&nbsp;
            <span>{{ itemw.indicatorScript }}</span>&nbsp;&nbsp;
            <span>注: 最小值{{ itemw.lowerLimit }} -- 最大值{{ itemw.upperLimit }}</span>
          </template>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="pdSub" @click="addHealth()">保 存</el-button>
        <el-button @click="dialogHealthass = false;">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addObj,
  delObj,
  fetchList,
  // putObj,
  getObj
} from "@/api/icu/nurse/healthAss";
import { tableOption } from "@/const/crud/icu/nurse/healthAss";
import { mapGetters } from "vuex";

export default {
  name: "healthAss",
  data() {
    return {
      assIf: 0,
      searchForm: {},
      tableData: [],
      pdSub: false,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption,

      // 评估弹框
      dialogHealthass: false,
      dialogHealthassType: "个人健康评估",
      itemq: [],
      nurseAssess: [],
      msg: 0,

      //echarts 展示数据
      echartsTime: [],
      echartsIndicator: [],
      echartsTimeIndicatorValue: [],
      //评估项目
      //焦虑自评
      anxiety: [],
      anxietyTime: [],
      anxietyTimes: [],
      //情绪指数
      Emotional: [],
      EmotionalTime: [],
      EmotionalTimes: [],
      //体力感受
      Physical: [],
      PhysicalTime: [],
      PhysicalTimes: [],
      //睡眠状况
      Sleepstatus: [],
      SleepstatusTime: [],
      SleepstatusTimes: [],
      //职业紧张
      Occupational: [],
      OccupationalTime: [],
      OccupationalTimes: [],
      //职业倦怠
      jobburnout: [],
      jobburnoutTime: [],
      jobburnoutTimes: [],
      //食欲状况
      Appetite: [],
      AppetiteTime: [],
      AppetiteTimes: [],
      //身体不适
      Malaise: [],
      MalaiseTime: [],
      MalaiseTimes: [],
      //所有时间的数组
      AllTimes: []
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
    permissionList() {
      return {
        delBtn: this.vaildData(this.permissions.icu_task_del, true)
      };
    }
  },
  // mounted(){
  //   this.pushData()
  // },
  methods: {
    getList(page) {
      this.tableLoading = true;
      fetchList(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize
          },
          this.searchForm
        )
      )
        .then(response => {
          this.tableData = response.data.data.records;
          // this.echartsIndicator = this.tableData
          this.page.total = response.data.data.total;
          this.tableLoading = false;
          // console.log(this.tableData)
          this.pushData();
        })
        .catch(() => {
          this.tableLoading = false;
        });
    },
    rowDel: function(row, index) {
      var _this = this;
      this.$confirm("是否确认删除ID为" + row.id, "提示", {
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
          this.getList(this.page);
        });
    },

    /**
     * 搜索回调
     */
    searchChange(form) {
      this.searchForm = form;
      this.getList(this.page, form);
    },
    /**
     * 刷新回调
     */
    refreshChange() {
      this.getList(this.page);
    },
    //获取题目
    getTitle() {
      // if(this.assIf<3){

      getObj()
        .then(response => {
          // console.log(this.itemq)
          // this.page.total = response.data.data.total
          // this.tableLoading = false
          // this.assIf=this.assIf+1
          // console.log(this.response)
          if (response.data.data == false) {
            this.$message({
              type: "warning",
              message: "所有题目已做完",
              showClose: true
            });
          } else {
            this.itemq = response.data.data;
            this.dialogHealthass = true;
          }
        })
        .catch(() => {
          // this.tableLoading = false
        });
      // }else{

      // }
    },
    addHealth() {
      // console.log(this.itemq[0].wtl05)
      // console.log(this.itemq)
      for (var i = 0; i < this.itemq.length; i++) {
        if (
          this.itemq[i].wtl05 != undefined &&
          this.itemq[i].wtl05 != "" &&
          this.itemq[i].wtl05 != null
        ) {
          this.msg = 1;
          this.nurseAssess.push({
            healthSubjectId: this.itemq[i].healthSubjectId,
            indicatorValue: this.itemq[i].wtl05
          });
        }
      }
      // console.log(this.msg)
      if (this.msg === 0) {
        this.$message({
          showClose: true,
          message: "最少填写一个答案",
          type: "warning"
        });
        return;
      }
      if (this.msg === 1) {
        this.pdSub = true;
        addObj(this.nurseAssess).then(res => {
          this.$message({
            showClose: true,
            message: "添加成功",
            type: "success"
          });

          this.dialogHealthass = false;
          this.pdSub = false;
          this.getList(this.page);
          // console.log(this.nurseAssess);
          this.nurseAssess = [];
          // console.log(this.nurseAssess);
        });
      } else {
        return;
      }
    },
    pushData() {
      this.echartsTime = [];
      this.anxiety = [];
      this.anxietyTime = [];
      this.anxietyTimes = [];
      //情绪指数
      this.Emotional = [];
      this.EmotionalTime = [];
      this.EmotionalTimes = [];
      //体力感受
      this.Physical = [];
      this.PhysicalTime = [];
      this.PhysicalTimes = [];
      //睡眠状况
      this.Sleepstatus = [];
      this.SleepstatusTime = [];
      this.SleepstatusTimes = [];
      //职业紧张
      this.Occupational = [];
      this.OccupationalTime = [];
      this.OccupationalTimes = [];
      //职业倦怠
      this.jobburnout = [];
      this.jobburnoutTime = [];
      this.jobburnoutTimes = [];
      //食欲状况
      this.Appetite = [];
      this.AppetiteTime = [];
      this.AppetiteTimes = [];
      //身体不适
      this.Malaise = [];
      this.MalaiseTime = [];
      this.MalaiseTimes = [];
      //所有时间的数组
      this.AllTimes = [];
      this.echartsIndicator = [];

      for (const i in this.tableData) {
        this.echartsTime.push(this.tableData[i].assessTime);
        this.echartsIndicator.push({
          Time: this.tableData[i].assessTime,
          Indicator: this.tableData[i].indicator,
          IndicatorValue: this.tableData[i].indicatorValue
        });
      }
      // console.log(this.tableData)
      //取出每个项目对应的时间 和数据
      for (const i in this.echartsIndicator) {
        if (this.echartsIndicator[i].Indicator === "焦虑自评") {
          this.anxiety.push(this.echartsIndicator[i].IndicatorValue);
          this.anxietyTime.push(this.echartsIndicator[i].Time);
        } else if (this.echartsIndicator[i].Indicator === "情绪指数") {
          this.Emotional.push(this.echartsIndicator[i].IndicatorValue);
          this.EmotionalTime.push(this.echartsIndicator[i].Time);
        } else if (this.echartsIndicator[i].Indicator === "体力感受") {
          this.Physical.push(this.echartsIndicator[i].IndicatorValue);
          this.PhysicalTime.push(this.echartsIndicator[i].Time);
        } else if (this.echartsIndicator[i].Indicator === "睡眠状况") {
          this.Sleepstatus.push(this.echartsIndicator[i].IndicatorValue);
          this.SleepstatusTime.push(this.echartsIndicator[i].Time);
        } else if (this.echartsIndicator[i].Indicator === "职业紧张") {
          this.Occupational.push(this.echartsIndicator[i].IndicatorValue);
          this.OccupationalTime.push(this.echartsIndicator[i].Time);
        } else if (this.echartsIndicator[i].Indicator === "职业倦怠") {
          this.jobburnout.push(this.echartsIndicator[i].IndicatorValue);
          this.jobburnoutTime.push(this.echartsIndicator[i].Time);
        } else if (this.echartsIndicator[i].Indicator === "食欲状况") {
          this.Appetite.push(this.echartsIndicator[i].IndicatorValue);
          this.AppetiteTime.push(this.echartsIndicator[i].Time);
        } else if (this.echartsIndicator[i].Indicator === "身体不适") {
          this.Malaise.push(this.echartsIndicator[i].IndicatorValue);
          this.MalaiseTime.push(this.echartsIndicator[i].Time);
        }
      }

      //对取出的时间 数据 进行处理 变成二维数组
      this.anxietyTime = this.anxietyTime.map(function(str) {
        return str.replace(" ", "\n");
      });
      this.anxietyTime.forEach((item, index) =>
        this.anxietyTimes.push([item, this.anxiety[index]])
      );

      this.EmotionalTime = this.EmotionalTime.map(function(str) {
        return str.replace(" ", "\n");
      });
      this.EmotionalTime.forEach((item, index) =>
        this.EmotionalTimes.push([item, this.Emotional[index]])
      );

      this.PhysicalTime = this.PhysicalTime.map(function(str) {
        return str.replace(" ", "\n");
      });
      this.PhysicalTime.forEach((item, index) =>
        this.PhysicalTimes.push([item, this.Physical[index]])
      );

      this.SleepstatusTime = this.SleepstatusTime.map(function(str) {
        return str.replace(" ", "\n");
      });
      this.SleepstatusTime.forEach((item, index) =>
        this.SleepstatusTimes.push([item, this.Sleepstatus[index]])
      );

      this.OccupationalTime = this.OccupationalTime.map(function(str) {
        return str.replace(" ", "\n");
      });
      this.OccupationalTime.forEach((item, index) =>
        this.OccupationalTimes.push([item, this.Occupational[index]])
      );

      this.jobburnoutTime = this.jobburnoutTime.map(function(str) {
        return str.replace(" ", "\n");
      });
      this.jobburnoutTime.forEach((item, index) =>
        this.jobburnoutTimes.push([item, this.jobburnout[index]])
      );

      this.AppetiteTime = this.AppetiteTime.map(function(str) {
        return str.replace(" ", "\n");
      });
      this.AppetiteTime.forEach((item, index) =>
        this.AppetiteTimes.push([item, this.Appetite[index]])
      );

      this.MalaiseTime = this.MalaiseTime.map(function(str) {
        return str.replace(" ", "\n");
      });
      this.MalaiseTime.forEach((item, index) =>
        this.MalaiseTimes.push([item, this.Malaise[index]])
      );

      // 合并每个对象里面的时间
      this.AllTimes = this.anxietyTime.concat(
        this.anxietyTime,
        this.AppetiteTime,
        this.OccupationalTime,
        this.jobburnoutTime,
        this.SleepstatusTime,
        this.PhysicalTime,
        this.EmotionalTime,
        this.MalaiseTime
      );
      // 把合并的时间去重

      this.AllTimes = [...new Set(this.AllTimes)];
      this.AllTimes.sort();
      this.getEcharts(this.echartsTime, this.echartsIndicator);
    },
    getEcharts(echartsTime, echartsIndicator) {
      // console.log(2)
      var myChart = this.$echarts.init(document.getElementById("my-echarts"));
      window.onresize = function() {
        myChart.resize();
        //  console.log(3)
      };
      myChart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        dataZoom: [
          {
            type: "inside"
          },
          {
            type: "slider"
          }
        ],
        legend: {
          data: [
            "焦虑自评",
            "情绪指数",
            "体力感受",
            "睡眠状况",
            "职业紧张",
            "职业倦怠",
            "食欲状况",
            "身体不适"
          ]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "8%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          data: this.AllTimes
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            barMaxWidth: 50,
            name: "焦虑自评",
            type: "bar",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "insideRight"
              }
            },
            data: this.anxietyTimes
          },
          {
            barMaxWidth: 50,
            name: "情绪指数",
            type: "bar",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "insideRight"
              }
            },
            data: this.EmotionalTimes
          },
          {
            barMaxWidth: 50,
            name: "体力感受",
            type: "bar",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "insideRight"
              }
            },
            data: this.PhysicalTimes
          },
          {
            barMaxWidth: 50,
            name: "睡眠状况",
            type: "bar",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "insideRight"
              }
            },
            data: this.SleepstatusTimes
          },
          {
            barMaxWidth: 50,
            name: "职业紧张",
            type: "bar",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "insideRight"
              }
            },
            data: this.OccupationalTimes
          },
          {
            barMaxWidth: 50,
            name: "职业倦怠",
            type: "bar",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "insideRight"
              }
            },
            data: this.jobburnoutTimes
          },
          {
            barMaxWidth: 50,
            name: "食欲状况",
            type: "bar",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "insideRight"
              }
            },
            data: this.AppetiteTimes
          },
          {
            barMaxWidth: 50,
            name: "身体不适",
            type: "bar",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "insideRight"
              }
            },
            data: this.MalaiseTimes
          }
        ]
      });
    }
  }
};
</script>

<style lang="scss" scoped>
#my-echarts {
  min-height: 500px;
}
.assList {
  position: relative;
  height: 35px;
}
.assBtn {
  position: absolute;
  top: 0%;
  right: 5px;
}
</style>
