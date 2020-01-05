<template>
  <basic-container>
    <div class="box">
      <div class="box_content">
        <div id="my-echarts"></div>
      </div>
      <el-dropdown class="avue-tags__menu">
        <el-button v-model="name" type="primary" size="mini">
          {{ name }}
          <i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu>
          <el-button
            style="width:80px"
            v-for="(item,index) in nurseName"
            :key="item.id"
            :class="item.nurseId==nurseID?'listAct':''"
            @click="changeNurse(item.nurseId,index,item.realName)"
          >{{item.realName}}</el-button>
        </el-dropdown-menu>
      </el-dropdown>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :permission="permissionList"
        :table-loading="tableLoading"
        :option="tableOption"
        @row-update="Update"
        @row-save="handleSave"
        @row-del="handleDel"
        @size-change="sizeChange"
        @current-change="currentChange"
      >
        <template slot-scope="scope" slot="menu">
          <el-button
            type="text"
            icon="el-icon-check"
            size="small"
            @click="check(scope.row,scope.index)"
          >评价</el-button>
          <el-button
            type="text"
            icon="el-icon-document"
            size="small"
            @click="handleDel(scope.row,scope.index)"
          >删除</el-button>
        </template>
      </avue-crud>
    </div>
  </basic-container>
</template>

<script>
import {
  addObj,
  delObj,
  fetchList,
  putObj,
  UpdateObj,
  putNurse
} from "@/api/icu/matron/Management/Management";
import { tableOption } from "@/const/crud/icu/matron/Management/Management";
import { mapGetters } from "vuex";

export default {
  name: "Management",
  data() {
    return {
      searchForm: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption,
      nurseName: [],
      nurseFlag: 0,
      //默认第一患者ID
      nurseID: "",
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
      AllTimes: [],
      name: ""
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permissions.icu_nurse_add, false),
        delBtn: this.vaildData(this.permissions.icu_nurse_del, false),
        editBtn: this.vaildData(this.permissions.icu_nurse_edit, false)
      };
    }
  },
  mounted() {
    this.getNurse();
  },
  methods: {
    // 分页bug
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.getList(this.page, this.nurseID);
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.getList(this.page, this.nurseID);
    },
    //点击切换护士
    changeNurse(id, index, name) {
      this.name = name;
      this.nurseID = id;
      this.getList(this.page, this.nurseID);
    },
    //请求护士
    getNurse() {
      putNurse()
        .then(res => {
          this.nurseName = res.data.data;
          this.nurseID = this.nurseName[0].nurseId;
          this.name = this.nurseName[0].realName;
          this.getList(this.page, this.nurseID);
        })
        .catch(() => {});
    },
    handleCreate(row, index, done, loading) {
      putObj(row.nurseId)
        .then(data => {
          this.$refs.crud.rowView(data.data.data, index);
          done();
        })
        .catch(() => {});
    },

    check() {
      this.$refs.crud.rowEdit(row, index);
    },
    //点击修改提交
    Update(row, index, loading) {
      UpdateObj(row)
        .then(data => {
          this.$refs.crud.rowEdit(data.data.data, index);
          this.tableData.splice(index, 1, Object.assign({}, row));
          this.$message({
            showClose: true,
            message: "成功",
            type: "success"
          });
          done();
          this.getList(this.page, this.nurseID);
        })
        .catch(() => {
          loading();
        });
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
      for (var i in this.tableData) {
        this.echartsTime.push(this.tableData[i].assessTime);
        this.echartsIndicator.push({
          Time: this.tableData[i].assessTime,
          Indicator: this.tableData[i].indicator,
          IndicatorValue: this.tableData[i].indicatorValue
        });
      }

      //取出每个项目对应的时间 和数据
      for (var i in this.echartsIndicator) {
        if (this.echartsIndicator[i].Indicator == "焦虑自评") {
          this.anxiety.push(this.echartsIndicator[i].IndicatorValue);
          this.anxietyTime.push(this.echartsIndicator[i].Time);
        } else if (this.echartsIndicator[i].Indicator == "情绪指数") {
          this.Emotional.push(this.echartsIndicator[i].IndicatorValue);
          this.EmotionalTime.push(this.echartsIndicator[i].Time);
        } else if (this.echartsIndicator[i].Indicator == "体力感受") {
          this.Physical.push(this.echartsIndicator[i].IndicatorValue);
          this.PhysicalTime.push(this.echartsIndicator[i].Time);
        } else if (this.echartsIndicator[i].Indicator == "睡眠状况") {
          this.Sleepstatus.push(this.echartsIndicator[i].IndicatorValue);
          this.SleepstatusTime.push(this.echartsIndicator[i].Time);
        } else if (this.echartsIndicator[i].Indicator == "职业紧张") {
          this.Occupational.push(this.echartsIndicator[i].IndicatorValue);
          this.OccupationalTime.push(this.echartsIndicator[i].Time);
        } else if (this.echartsIndicator[i].Indicator == "职业倦怠") {
          this.jobburnout.push(this.echartsIndicator[i].IndicatorValue);
          this.jobburnoutTime.push(this.echartsIndicator[i].Time);
        } else if (this.echartsIndicator[i].Indicator == "食欲状况") {
          this.Appetite.push(this.echartsIndicator[i].IndicatorValue);
          this.AppetiteTime.push(this.echartsIndicator[i].Time);
        } else if (this.echartsIndicator[i].Indicator == "身体不适") {
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
    getList(page, id) {
      this.tableLoading = true;
      fetchList(
        Object.assign({
          current: this.page.currentPage,
          size: this.page.pageSize,
          nurseId: id
        })
      )
        .then(response => {
          this.tableData = response.data.data.records;
          this.page.total = response.data.data.total;
          this.tableLoading = false;
          this.pushData();
        })
        .catch(() => {
          this.tableLoading = false;
        });
    },
    handleDel: function(row, index) {
      index += 1;
      var _this = this;
      this.$confirm("是否确认删除序号为" + index, "提示", {
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
          this.getList(this.page, this.nurseId);
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
          this.getList(this.page);
        })
        .catch(() => {
          loading();
        });
    },
    getEcharts(echartsTime, echartsIndicator) {
      var myChart = this.$echarts.init(document.getElementById("my-echarts"));
      window.onresize = function() {
        myChart.resize();
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
.listAct {
  background: #409eff ;
  color: #fff ;
}

#my-echarts {
  min-height: 500px;
}
.box_content {
  .box_list {
    float: left;
    width: 10%;
    max-height: 500px;
    overflow: scroll;
  }
  button {
    margin: 3%;
    min-width: 100px;
  }
  ::-webkit-scrollbar {
    width: 0px;
  }
}

.content_list h4 {
  width: 100%;
  background: #409eff;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 5px;
  color: #fff;
}
.avue-tags__menu {
  line-height: 40px;
  padding-right: 10px;
  margin-right: 1%;
  z-index: 2004;
}

.el-dropdown-menu {
  max-width: 130px;
  // height: 250px;
  max-height: 300px;
  text-align: center;
  overflow-y: auto;
}
.el-dropdown-menu .el-button {
  margin-bottom: 10px;
}
.patientBtn {
  width: 90px;
  margin: 3%;
  // padding: 10px;
  // margin-left: 2px;
  overflow: hidden;
}
.patientBtn span {
  text-align: center;
}
.ActBtn {
  background: #409eff !important;
  color: #fff !important;
}
.el-button + .el-button {
  margin-left: 3% !important;
}
</style>
