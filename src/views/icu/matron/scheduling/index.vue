
<template>
  <div class="app-container calendar-list-container">
    <basic-container>
      <el-form>
        <el-form-item label='本周开始日期'>
          <el-date-picker
            v-model="currentTime"
            type="datetime"
            placeholder="选择开始排班日期"
            align="right"
            :picker-options="pickerOptions"
            @change="selectionTime"
          ></el-date-picker>
          <el-button style="margin-left:20px;" @click="Selection">选择排班护士</el-button>
          <el-button type="primary" @click="Check" :loading="loadingBtn">校验该时间有没有排班</el-button>
          <el-button @click="submit" type="primary">提交排班</el-button>
        </el-form-item>
      </el-form>

      <div
        class="el-table el-table--fit el-table--striped el-table--border el-table--enable-row-transition el-table--medium contentBox"
      >
        <table v-loading="loading" class="el-table__header" style="width:100%">
          <thead class="has-gutter">
            <th>星期</th>
            <th>班次</th>
            <th>层级N0</th>
            <th>层级N1-1</th>
            <th>层级N1-2</th>
            <th>层级N2</th>
            <th>层级N3</th>
            <th>层级N4</th>
          </thead>
          <tbody v-for="item in Scheduling" :key="item.id" stripe class="scheduling">
            <tr class="el-table__row">
              <td class="el-table_4_column_18 is-center is-leaf" rowspan="4">{{item.name}}</td>
              <td class="el-table_2_column_4 is-center" style="width:60px">{{item.title2}}</td>
              <td v-for="(item1,i) in item. morningShift" :key="i">
                <el-input type="text" placeholder="请输入护士人数" v-model="item1.z1" style="border:none" />
              </td>
            </tr>
            <tr class="el-table__row">
              <td class="el-table_2_column_4 is-center" style="width:60px">{{item.title1}}</td>
              <td v-for="(item2,i) in item.dayShift" :key="i">
                <el-input type="text" placeholder="请输入护士人数" v-model="item2.z1" />
              </td>
            </tr>
            <tr class="el-table__row">
              <td class="el-table_2_column_4 is-center" style="width:60px">{{item.title3}}</td>
              <td v-for="(item3,i) in item.swingShift" :key="i">
                <el-input type="text" placeholder="请输入护士人数" v-model="item3.z1" />
              </td>
            </tr>
            <tr>
              <td class="el-table_2_column_4 is-center" style="width:60px">{{item.title4}}</td>
              <td v-for="(item4,i) in item.nightShift" :key="i">
                <el-input type="text" placeholder="请输入护士人数" v-model="item4.z1" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <el-dialog :fullscreen="isFullscreen" :visible.sync="dialogTableVisible">
        <div class="NurseList">
          <div class="NurseList_left">
            <h3>参加排班护士</h3>
            <div class="join">
              <el-button
                v-for="item in NurseList"
                :key="item.nurseId"
                @click="AddNurse(item.nurseId)"
              >{{item.realName}}</el-button>
            </div>
          </div>
          <div class="NurseList_right">
            <h3>不参加排班护士</h3>
            <div class="join">
              <el-button
                v-for="item in delNurseList"
                :key="item.nurseId"
                @click="DelNurse(item.nurseId)"
                type="info"
              >{{item.realName}}</el-button>
            </div>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogTableVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogTableVisible = false">确 定</el-button>
        </div>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import { tableOption } from "@/const/crud/icu/matron/scheduling/scheduling";
import {
  getNurseInfo,
  CheckTime,
  submitdata
} from "@/api/icu/matron/scheduling/scheduling";
import { mapGetters } from "vuex";
import { dateFormat, calcDate } from "@/util/date";

export default {
  name: "nurseScheduling",
  data() {
    return {
      isFullscreen: false,
      screenWidth: document.body.clientWidth, // 屏幕尺寸
      loadingBtn: false,
      flag: null,
      dialogTableVisible: false,
      NurseList: [],
      demands: {},
      ArrangePrepareBo: {},
      delNurseList: [],
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
      currentTime: null,
      tableOption: tableOption,
      page: {
        total: null, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      list: [],
      Scheduling: [
        {
          id: 1,
          name: "周一",
          title2: "白班",
          title1: "早班",

          title3: "小夜",
          title4: "大夜",

          dayShift: [
            {
              z1: null
            },

            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            }
          ],
          morningShift: [
            {
              z1: null
            },

            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            }
          ],
          swingShift: [
            {
              z1: null
            },

            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            }
          ],
          nightShift: [
            {
              z1: null
            },

            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            }
          ]
        },
        {
          id: 2,
          name: "周二",
          title2: "白班",
          title1: "早班",

          title3: "小夜",
          title4: "大夜",

          dayShift: [
            {
              z1: null
            },

            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            }
          ],
          morningShift: [
            {
              z1: null
            },

            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            }
          ],
          swingShift: [
            {
              z1: null
            },

            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            }
          ],
          nightShift: [
            {
              z1: null
            },

            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            }
          ]
        },
        {
          id: 3,
          name: "周三",
          title2: "白班",
          title1: "早班",

          title3: "小夜",
          title4: "大夜",

          dayShift: [
            {
              z1: null
            },

            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            }
          ],
          morningShift: [
            {
              z1: null
            },

            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            }
          ],
          swingShift: [
            {
              z1: null
            },

            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            }
          ],
          nightShift: [
            {
              z1: null
            },

            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            }
          ]
        },
        {
          id: 4,
          name: "周四",
          title2: "白班",
          title1: "早班",

          title3: "小夜",
          title4: "大夜",

          dayShift: [
            {
              z1: null
            },

            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            }
          ],
          morningShift: [
            {
              z1: null
            },

            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            }
          ],
          swingShift: [
            {
              z1: null
            },

            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            }
          ],
          nightShift: [
            {
              z1: null
            },

            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            }
          ]
        },
        {
          id: 5,
          name: "周五",
          title2: "白班",
          title1: "早班",

          title3: "小夜",
          title4: "大夜",

          dayShift: [
            {
              z1: null
            },

            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            }
          ],
          morningShift: [
            {
              z1: null
            },

            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            }
          ],
          swingShift: [
            {
              z1: null
            },

            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            }
          ],
          nightShift: [
            {
              z1: null
            },

            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            }
          ]
        },
        {
          id: 6,
          name: "周六",
          title2: "白班",
          title1: "早班",

          title3: "小夜",
          title4: "大夜",

          dayShift: [
            {
              z1: null
            },

            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            }
          ],
          morningShift: [
            {
              z1: null
            },

            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            }
          ],
          swingShift: [
            {
              z1: null
            },

            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            }
          ],
          nightShift: [
            {
              z1: null
            },

            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            }
          ]
        },
        {
          id: 7,
          name: "周日",
          title2: "白班",
          title1: "早班",

          title3: "小夜",
          title4: "大夜",

          dayShift: [
            {
              z1: null
            },

            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            }
          ],
          morningShift: [
            {
              z1: null
            },

            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            }
          ],
          swingShift: [
            {
              z1: null
            },

            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            }
          ],
          nightShift: [
            {
              z1: null
            },

            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            },
            {
              z1: null
            }
          ]
        }
      ],
      loading: false
    };
  },
  created() {},
  computed: {
    ...mapGetters(["permissions"]),
    permissionList() {
      return {
        // subBtn: this.vaildData(this.permissions.icu_nurse_sub, false),
      };
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
  },
  methods: {
    //校验时间 护士
    Check() {
      this.loadingBtn = true;
      if (this.currentTime != null) {
        this.ArrangePrepareBo = {
          nurseList: this.NurseList,
          startTime: this.currentTime
        };
        CheckTime(this.ArrangePrepareBo)
          .then(res => {
            this.$message({
              type: "success",
              message: "校验成功!"
            });
            this.dialogTableVisible = false;
            this.loadingBtn = false;
            this.flag = res.data.data;
            this.delNurseList = [];
            this.NurseList = [];
          })
          .catch(() => {
            this.delNurseList = [];
            this.NurseList = [];
            this.loadingBtn = false;
            this.dialogTableVisible = false;
          });
      } else {
        this.$message({
          type: "warning",
          message: "请选择排班日期"
        });
        this.loadingBtn = false;
      }
    },
    //不参加护士 添加到添加护士

    DelNurse(nurseId) {
      for (var i in this.delNurseList) {
        if (this.delNurseList[i].nurseId == nurseId) {
          this.NurseList.push(this.delNurseList[i]);
          this.delNurseList.splice(i, 1);
        }
      }
    },
    //护士添加到不参加护士
    AddNurse(nurseId) {
      for (var i in this.NurseList) {
        if (this.NurseList[i].nurseId == nurseId) {
          this.delNurseList.push(this.NurseList[i]);
          this.NurseList.splice(i, 1);
        }
      }
    },
    //护士列表数据
    Selection() {
      this.delNurseList = [];
      this.NurseList = [];
      this.dialogTableVisible = true;
      getNurseInfo().then(res => {
        this.NurseList = res.data.data;
      });
    },
    //选择时间
    selectionTime(val) {
      if (val) {
        var curDate = val;
        //向后台传的周
        var Day = null;
        //具体的时间
        var Time = null;
        var weekDay = [
          "星期天",
          "星期一",
          "星期二",
          "星期三",
          "星期四",
          "星期五",
          "星期六"
        ];
        var myDate = new Date(Date.parse(curDate));
        Day = weekDay[myDate.getDay()];
        this.currentTime = dateFormat(this.currentTime);
        Time = dateFormat(val);
        for (var i in this.Scheduling) {
          this.Scheduling[i].name = Day;
          this.Scheduling[i].dateTime = Time;
          curDate = new Date((curDate / 1000 + 86400) * 1000);
          myDate = new Date(Date.parse(curDate));
          Day = weekDay[myDate.getDay()];
          Time = dateFormat(myDate);
        }
      }
    },
    //点击排班
    submit() {
      if (this.flag) {
        this.open1();
      } else {
        this.open();
      }
    },
    open1() {
      this.demands = this.Scheduling;
      this.$confirm("是否提交排班?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          this.$message({
            type: "success",
            message: "请耐心等候!"
          });
          submitdata(this.demands).then(res => {
            this.$message({
              type: "success",
              message:res.data.msg
            });
            this.loading = false;
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    open() {
      this.$message({
        message: "请校验时间及排班护士",
        type: "warning"
      });
    },
    handleRowClick(row, event, column) {
      this.$refs.crud.rowCell(row, row.$index);
    },
    getList(page, params) {
      fetchList().then(response => {
        var listQuery = response.data.data;
        this.list = listQuery;
        this.page.total = this.list.length;
        this.listLoading = false;
      });
    }

    // 编辑
  }
};
</script>
<style scoped>
.patientBtn {
  padding: 8px 20px;
  font-size: 14px;
  border-radius: 4px;
  border-color: #1e90ff;
  color: black;
  background: #fff;
  margin-left: 14px;
}
.patientBtnAct {
  background: #1e90ff !important;
  color: #fff !important;
}
#Queryform {
  height: 38px;
}
.has-gutter th {
  text-align: center;
}
.submit {
  margin-bottom: 20px;
  background: #409eff;
  color: #fff;
}
.NurseList {
  width: 100%;
  display: flex;
}
.NurseList button {
  margin-left: 1% !important;
}
.NurseList .NurseList_left {
  width: 70%;
}
.NurseList .NurseList_right {
  width: 30%;
}
.NurseList .NurseList_left .join {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.NurseList .NurseList_left .join button {
  width: 23%;
  margin: 2%;
  min-width: 80px;
}
.NurseList .NurseList_right .join {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.NurseList .NurseList_right .join button {
  width: 40%;
  margin: 5%;
  min-width: 80px;
  padding: 10px 14px !important;
}
.contentBox {
  width: 90%;
  margin-left: 5%;
}
</style>
