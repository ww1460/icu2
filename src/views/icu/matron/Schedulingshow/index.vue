
<template>
  <div class="execution">
    <basic-container>
      <!-- 班次展示 -->
      <el-form :inline="true" ref="form" label-width="80px">
        <el-form-item label="护士姓名:">
          <el-input placeholder="请输入护士姓名" clearable v-model="name"></el-input>
        </el-form-item>
        <!-- 
        <el-form-item label="护士等级:">
          <el-input-number :max="5" :min="1" placeholder="请输入等级" v-model="grade"></el-input-number>
        </el-form-item>-->

        <el-form-item label="上班日期:">
          <el-date-picker
            v-model="workday"
            type="datetime"
            auto-complete="off"
            placeholder="选择日期时间"
            align="right"
            :picker-options="pickerOptions"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="inquire">查询</el-button>
          <el-button @click="clear">清空</el-button>
          <el-button @click="printContent" type="primary">打印</el-button>
        </el-form-item>
      </el-form>
      <div
        id="Scheduling"
        class="el-table el-table--fit el-table--striped el-table--border el-table--enable-row-transition el-table--medium"
      >
        <table
          align="center"
          v-loading="loading"
          class="el-table__header Schedule"
          style="width:100%;"
          stripe
        >
          <thead>
            <tr>
              <th style="text-align:center" colspan="8">ICU重症排班表</th>
            </tr>
            <tr class="has-gutter">
              <th rowspan="2" class="el-table_2_column_4 is-center">姓名/时间</th>
              <th
                class="el-table_2_column_4 is-center"
                v-for="item in arrTime"
                :key="item.id"
              >{{item}}</th>
            </tr>
            <tr>
              <td
                style="text-align:center"
                class="el-table_2_column_4 is-center"
                v-for="(item,index) in TimeList"
                :key="index"
              >{{item}}</td>
            </tr>
          </thead>
          <tbody>
            <tr class="el-table__row" v-for="(item,index) in SchedulingList" :key="index">
              <td
                style="text-align:center"
                class="el-table_2_column_4 is-center"
                v-for="(item2,index1) in item"
                :key="item2.arrangeResultId"
                v-if="index1==0"
              >{{item2.nurseName}}</td>

              <td
                style="text-align:center"
                :class="['el-table_2_column_4','is-center',(item1.workShift == 5?'el-button--text':''),(item1.flag?'pitch':'')]"
                v-for="(item1,index3) in item"
                :key="index3"
                @click="Switching(item1)"
              >{{item1.workShift | sechFl}}</td>
            </tr>
          </tbody>
        </table>
        <div v-if="bool" class="el-table__empty-block" style="border">
          <span class="el-table__empty-text">
            <div class="avue-crud__empty">
              <div class="avue-empty">
                <div class="avue-empty__image" style="height: 50px;">
                  <img
                    src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAxKSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgIDxlbGxpcHNlIGZpbGw9IiNGNUY1RjUiIGN4PSIzMiIgY3k9IjMzIiByeD0iMzIiIHJ5PSI3Ii8+CiAgICA8ZyBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0iI0Q5RDlEOSI+CiAgICAgIDxwYXRoIGQ9Ik01NSAxMi43Nkw0NC44NTQgMS4yNThDNDQuMzY3LjQ3NCA0My42NTYgMCA0Mi45MDcgMEgyMS4wOTNjLS43NDkgMC0xLjQ2LjQ3NC0xLjk0NyAxLjI1N0w5IDEyLjc2MVYyMmg0NnYtOS4yNHoiLz4KICAgICAgPHBhdGggZD0iTTQxLjYxMyAxNS45MzFjMC0xLjYwNS45OTQtMi45MyAyLjIyNy0yLjkzMUg1NXYxOC4xMzdDNTUgMzMuMjYgNTMuNjggMzUgNTIuMDUgMzVoLTQwLjFDMTAuMzIgMzUgOSAzMy4yNTkgOSAzMS4xMzdWMTNoMTEuMTZjMS4yMzMgMCAyLjIyNyAxLjMyMyAyLjIyNyAyLjkyOHYuMDIyYzAgMS42MDUgMS4wMDUgMi45MDEgMi4yMzcgMi45MDFoMTQuNzUyYzEuMjMyIDAgMi4yMzctMS4zMDggMi4yMzctMi45MTN2LS4wMDd6IiBmaWxsPSIjRkFGQUZBIi8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K"
                    alt
                  />
                </div>
                <p class="avue-empty__desc">暂无数据</p>
              </div>
            </div>
          </span>
        </div>
      </div>
    </basic-container>

    <el-dialog :fullscreen="isFullscreen" title="修改班次" :visible.sync="dialogVisible" width="60%">
      <el-dialog
        @close="clearFrom('form')"
        width="50%"
        title="备注"
        :visible.sync="innerVisible"
        append-to-body
      >
        <el-form :rules="rules1" ref="form" :model="form">
          <el-row>
            <el-col
              class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            >
              <el-form-item label="申请护士" :label-width="formLabelWidth">
                <el-input disabled v-model="form.initiatorNurseName"></el-input>
              </el-form-item>
            </el-col>
            <el-col
              class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            >
              <el-form-item label="调班护士" :label-width="formLabelWidth">
                <el-select style="width:100%" v-model="form.changeNurseId" placeholder="请选择调班护士">
                  <el-option
                    v-for="item in nurseList"
                    :key="item.id"
                    :value="item.nurseId"
                    :label="item.realName"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col
              class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            >
              <el-form-item prop="dateTime" label="调班日期" :label-width="formLabelWidth">
                <el-date-picker
                  style="width:100%"
                  v-model="form.dateTime"
                  align="right"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col
              class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            >
              <el-form-item prop="hopeShift" label="调班班次" :label-width="formLabelWidth">
                <el-select style="width:100%" v-model="form.hopeShift" placeholder="请选择意愿班次">
                  <el-option
                    v-for="item in workList"
                    :key="item.id"
                    :value="item.value"
                    :label="item.label"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col
              class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            >
              <el-form-item label="原始班次" :label-width="formLabelWidth">
                <el-button>{{form.originalShift | sechFl }}</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item prop="applyReason" label="申请原因" :label-width="formLabelWidth">
                <el-input v-model="form.applyReason" placeholder="请输入申请理由" type="textarea"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" :loading="FormLoading" @click="SubApply('form')">保 存</el-button>
          <el-button @click="resetForm('form')">取 消</el-button>
        </div>
      </el-dialog>

      <el-button type="primary" @click="remark">备注</el-button>
      <div class="'btn_dialog'">
        <el-button
          style="margin-left:10px;margin-top:10px"
          :class="[(item.value == schedulingflag?'el-button--primary':'') ]"
          v-for="item in workList"
          :key="item.id"
          @click="Changescheduling(item)"
        >{{item.label}}</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="amend">保 存</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
let that;
import {
  Schedulingdata,
  UpdateScheduling,
  getShift
} from "@/api/icu/matron/Schedulingshow/Schedulingshow";
import { addObj } from "@/api/icu/nurse/SchedulingApply";
import { tableOption } from "@/const/crud/icu/matron/Schedulingshow/Schedulingshow";
import { getNurseInfo } from "@/api/icu/matron/scheduling/scheduling";
import { mapGetters } from "vuex";
import { dateFormat, calcDate } from "@/util/date";

export default {
  name: "Schedulingshow",
  data() {
    return {
      FormLoading: false,
      formLabelWidth: "80px",
      TimeList: [],
      innerVisible: false,
      bool: "",
      isFullscreen: false,
      screenWidth: document.body.clientWidth, // 屏幕尺寸
      workday: "",
      SchedulingList: [],
      searchForm: {},
      tableData: [],
      tableLoading: false,
      tableOption: tableOption,
      SchedulingTime: [],
      firstTime: "",
      arrTime: [],
      dialogVisible: false,
      currentcheduling: {},
      schedulingflag: "",
      name: "",
      value1: "",
      grade: undefined,
      pickerOptions: {
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
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
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
      loading: true,
      workList: [],
      rowItem: {},
      form: {
        dateTime: "",
        hopeShift: "",
        applyReason: "",
        originalShift: "",
        applyReason: "",
        initiatorNurseName: "",
        initiatorNurseId: "",
        changeNurseId: "",
        changeNurseName: "",
        applyType: 0
      },
      rules1: {
        dateTime: [
          { required: true, message: "请选择排班日期", trigger: "change" }
        ],
        changeNurseId: [
          { required: true, message: "请选择调班护士", trigger: "change" }
        ],
        originalShift: [
          {
            required: true,
            message: "请选择原始班次",
            trigger: "change"
          }
        ],
        hopeShift: [
          {
            required: true,
            message: "请选择意愿班次",
            trigger: "change"
          }
        ],
        applyReason: [
          {
            required: true,
            message: "请输入申请理由",
            trigger: "blur"
          }
        ]
      },
      nurseList: [],
      endday: ""
    };
  },
  beforeCreate: function() {
    that = this;
  },
  created() {
    this.getScheduling();
    this.getWorkShift();
    getNurseInfo().then(res => {
      this.nurseList = res.data.data;
    });
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
  methods: {
    clearFrom(formName) {
      this.$refs[formName].resetFields();
    },
    SubApply(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.FormLoading = true;
          addObj(this.form)
            .then(res => {
              this.$message({
                showClose: true,
                message: "请在班次申请查看",
                type: "success"
              });
              this.innerVisible = false;
              this.FormLoading = false;
            })
            .catch(err => {
              this.FormLoading = false;
            });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.innerVisible = false;
    },
    //修改班次弹框的备注
    remark() {
      this.innerVisible = true;
      for (var i in this.nurseList) {
        if (this.nurseList[i].nurseId == this.form.changeNurseId) {
          this.form.changeNurseName = this.nurseList[i].nurseName;
        }
      }
      this.form.initiatorNurseName = this.rowItem.nurseName;
      this.form.initiatorNurseId = this.rowItem.nurseId;
      this.form.originalShift = this.rowItem.workShift;
      this.form.dateTime = this.rowItem.dateTime;
    },
    getWorkShift() {
      getShift().then(res => {
        this.workList = res.data.data;
      });
    },
    //打印
    printContent() {
      let wpt = document.getElementById("Scheduling");
      let newContent = wpt.innerHTML;
      let oldContent = document.body.innerHTML;

      document.body.innerHTML = newContent;
      window.print(); //打印方法
      window.location.reload();
      document.body.innerHTML = oldContent;
    },
    //修改护士排班
    amend() {
      UpdateScheduling(this.currentcheduling).then(res => {
        this.$message({
          showClose: true,
          message: "修改成功",
          type: "success"
        });
        this.dialogVisible = false;
      });
    },
    Changescheduling(item) {
      console.log(item)
      this.schedulingflag = item.value;
      this.currentcheduling.workShift = item.value;
      this.currentcheduling.flag = true;
    },
    //点击出现弹框  选择id传给弹框按钮
    Switching(item) {
      this.endday = new Date();
      this.endday = dateFormat(this.endday);

      if (
        item.dateTime.substr(0, 10) > this.endday.substr(0, 10) ||
        item.dateTime.substr(0, 10) == this.endday.substr(0, 10)
      ) {
        this.rowItem = item;
        this.schedulingflag = item.workShift;
        this.currentcheduling = item;
        this.dialogVisible = true;
      } else if (item.dateTime.substr(0, 10) < this.endday.substr(0, 10)) {
        this.$message({
          showClose: true,
          message: "不能对之前班次修改",
          type: "warning"
        });
      }
      console.log(this.rowItem)
    },

    getData(obj) {
      this.bool = false;
      this.loading = true;
      Schedulingdata(obj)
        .then(res => {
          this.loading = false;
          if (res.data.data != null) {
            this.SchedulingList = res.data.data;
          } else {
            this.SchedulingList = [];
            this.bool = true;
          }

          var curDate = this.SchedulingList[0][0].dateTime;
          var dataTime = this.SchedulingList[0][0].dateTime;
          var Day = null;
          var weekDay = [
            "星期天",
            "星期一",
            "星期二",
            "星期三",
            "星期四",
            "星期五",
            "星期六"
          ];
          this.arrTime = [];
          this.TimeList = [];
          for (var i = 0; i < 7; i++) {
            if (i != 0) {
              curDate = new Date(curDate).getTime() + 1 * 24 * 60 * 60 * 1000;
              dataTime = new Date(dataTime).getTime() + 1 * 24 * 60 * 60 * 1000;
            }
            curDate = new Date(curDate);
            dataTime = new Date(dataTime);
            this.TimeList.push(dataTime);
            Day = weekDay[curDate.getDay()];
            this.arrTime.push(Day);
          }

          for (let i in this.TimeList) {
            this.TimeList[i] = dateFormat(this.TimeList[i]).substr(0, 10);
          }
        })
        .catch(err => {
          this.$message({
            showClose: true,
            message: "暂无数据",
            type: "warning"
          });
          this.loading = false;
        });
    },
    //查询
    inquire() {
      var obj = {
        dateTime: this.workday,
        scope: 2,
        nurseName: this.name,
        nurseGrade: this.grade
      };

      this.getData(obj);
    },
    //清空
    clear() {
      let dataTime 
      dataTime = new Date();
      dataTime = dateFormat(dataTime);
      this.name = "";
      var obj = {
        dateTime: dataTime,
        scope: 2,
        nurseName: this.name
      };
      this.getData(obj);
    },
    getScheduling() {
      this.workday = new Date();
      this.workday = dateFormat(this.workday);
      var obj = {
        dateTime: this.workday,
        scope: 2
      };
      this.SchedulingList = [];
      this.getData(obj);
    }
  },
  //  过滤器
  filters: {
    sechFl: data => {
      for (let i in that.workList) {
        if (data == that.workList[i].value) {
          return that.workList[i].label;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.Schedule {
  td,
  th {
    border: 1px solid #ebeef5;
  }
}
.Schedule tr:nth-child(odd) {
  background: #fafafa;
}
.Schedule button {
  background: rgba($color: #fff, $alpha: 0);
  border: none;
}
.Schedule tr:hover {
  background: rgb(245, 247, 250);
}
.rest {
  color: #409EFF;
}
.pitch {
  background: #409EFF;
  color: #fff;
}
</style>
