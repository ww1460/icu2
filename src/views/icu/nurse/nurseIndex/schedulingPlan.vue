<template>
  <!-- 排班计划-->

  <!-- element日历组件 -->
  <div class="cal-left">
    <el-calendar v-model="value" class="calendar" v-loading="calendarLoading">
      <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
      <template slot="dateCell" slot-scope="{date, data}">
        <div
          :class="data.isSelected ? 'is-selected' : ''"
          class="dayBox"
          style="width:100%;height:100%"
          @click="dayClick(date)"
        >
          {{ data.day.split('-').slice(2).join('-') }}
          <div class="dayContent">
            <span
              v-for="(item,index) in planArrs"
              v-if="data.day==item.dateTime"
              :key="index"
              :class="[item.workShift==1?'shift-1':'',
                       item.workShift==2?'shift-2':'',
                       item.workShift==3?'shift-3':'',
                       item.workShift==4?'shift-4':'',
                       item.workShift==5?'shift-5':'']"
              class="dayNote"
            >{{ item.workShift|sechFl }}</span>
          </div>
        </div>

        <!-- <span v-for='(item,index) in noteArr' :key="index" >{{item.note}}</span> -->
      </template>
    </el-calendar>
  </div>
</template>
<script>
import {
  addObj,
  delObj,
  fetchList,
  putObj
  // getByday
} from "@/api/icu/nurse/schedulingPlan";
// import { mapGetters } from 'vuex'
import { dateFormat } from "@/util/date";
import { futimes, watch } from "fs";
// import { close } from 'fs'
export default {
  name: "schedulingPlan",
  components: {},
  filters: {
    //  过滤器
    sechFl: data => {
      switch (data) {
        case 1:
          return "早班";

        case 2:
          return "小夜";

        case 3:
          return "大夜";

        case 4:
          return "白班";

        case 5:
          return "休息";

        default:
      }
    }
    // var sechFl = {
    //   screening: [
    //     { value: 1, label: '早班' },
    //     { value: 2, label: '小夜' },
    //     { value: 3, label: '大夜' },
    //     { value: 4, label: '白班' },
    //     { value: 5, label: '休息' }
    //   ]
    // }
  },
  data() {
    return {
      value: "",
      month: "",
      conditionsDate: "",
      seen: "",
      status: false,
      statusDate: "",
      formLabelWidth: "80px",
      dialogAddNote: false,
      dialogOpenNote: false,
      calendarLoading: false,
      textarea: "",
      createNote: {},
      scope: "",
      noteArr: [],
      noteArrs: [],
      planArrs: [],
      noteEdit: {},
      noteList: {
        note: "",
        date: ""
      },
      rules: {
        date: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        note: [
          { type: "", required: true, message: "请输入内容", trigger: "blur" }
        ]
      },
      rules1: {
        content: [
          { type: "", required: true, message: "请输入内容", trigger: "blur" }
        ]
      }
    };
  },
  // watch: {
  //     editForm () {
  //         if (typeof this.noteList.date == 'string') {
  //             this.noteList.date = new Date(this.noteList.date)
  //         }
  //     }
  // },

  created() {
    this.getList();
    //  this.addClick()
  },

  methods: {
    dayClick(date) {
      this.status = true;
      this.statusDate = date;
      this.conditionsDate = dateFormat(date).substr(0, 7);
      // console.log(this.conditionsDate)
      // var date1 = dateFormat(date)

      // this.getList()
    },
    // 重置按钮
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //  按照时间请求数据
    getList() {
      this.planArrs = [];

      //  没有选中日期  默认当天时请求数据
      var date = dateFormat(new Date());
      this.month = date.substr(0, 7);
      //   按月份请求数据
      this.scope = 3;
      this.calendarLoading = true;
      fetchList(date, this.scope)
        .then(response => {
          this.noteArrs = response.data.data;
          // console.log(this.noteArrs)
          for (var i in this.noteArrs) {
            if (this.noteArrs[i] === null) {
            } else {
                this.noteArrs[i].dateTime = this.noteArrs[i].dateTime.substr(
                0,
                10
              );
              this.planArrs.push(this.noteArrs[i]);
            }
            
          }
          // console.log(this.planArrs)
          this.calendarLoading = false;
        })
        .catch(() => {
        });
    },

    delNote(item, index) {
      // console.log(item.id)
      var _this = this;
      this.$confirm("是否确认删除该项", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return delObj(item.id);
        })
        .then(data => {
          // _this.noteArr.splice(index, 1)
          _this.$message({
            showClose: true,
            message: "删除成功",
            type: "success"
          });
          this.getList(this.page);
        });
    },
    // /**
    //    * @title 数据更新
    //    * @param row 为当前的数据
    //    * @param index 为当前更新数据的行数
    //    * @param done 为表单关闭函数
    //    *
    //    **/
    handleUpdate: function(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          putObj(
            this.noteEdit.content,
            this.noteEdit.personalNotesId,
            this.noteEdit.id
          )
            .then(data => {
              this.$message({
                showClose: true,
                message: "修改成功",
                type: "success"
              });
              //重新获取数据 关闭表单并清空
              this.getList();
              this.dialogOpenNote = false;
              this.noteEdit = {};
            })
            .catch(() => {
              // loading()
            });
        } else {
          return false;
        }
      });
    },
    /**
     * @title 数据添加
     * @param row 为当前的数据
     * @param done 为表单关闭函数
     *
     **/
    // 添加函数
    handleSave: function(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var date = dateFormat(this.noteList.date);
          addObj(this.noteList.note, date)
            .then(data => {
              this.$message({
                showClose: true,
                message: "添加成功",
                type: "success"
              });
              //重新获取数据 关闭表单并清空
              this.getList();
              this.dialogAddNote = false;
              this.noteList = {
                note: "",
                date: ""
              };
            })
            .catch(() => {
              // loading()
            });
        } else {
          return false;
        }
      });
    }
  },
  watch: {
    value(val) {
      // console.log(dateFormat(val).substr(0,7))
      if (this.month === dateFormat(val).substr(0, 7)) {
      } else {
        this.month = dateFormat(val).substr(0, 7);
        var date = dateFormat(val);
        this.planArrs = [];
        this.scope = 3;
        this.calendarLoading = true;
        fetchList(date, this.scope).then(data => {
          this.noteArrs = data.data.data;

          // console.log(this.noteArrs)
          for (var i in this.noteArrs) {
            if (this.noteArrs[i] === null) {
            } else {
              this.noteArrs[i].dateTime = this.noteArrs[i].dateTime.substr(
                0,
                10
              );
              this.planArrs.push(this.noteArrs[i]);
            }
            // console.log(this.noteArrs[i])
          }
          this.calendarLoading = false;
          // console.log(this.planArrs)
        });
      }
    }
  }
};
</script>

<style scoped lang="scss" >
.clearfix:after {
  content: "";
  clear: both;
  display: block;
}
.cal-left {
  float: left;
  width: 95%;
}
.cal-right {
  float: left;
  width: 30%;
  // padding-top: 25%;
  margin-top: 100px;
  // height: 200px;
  // background: red
  // border: 1px solid #ddd;
}
.drag-note {
  // height: 50%;
  margin-top: 10px;
  margin-bottom: 10px;
  //  padding: 5% 0;
}
// .write-note{
//   // height: 100px !important;
//   border-top: 1px solid #ddd;
//   padding-top: 5% ;
// }
.dayContent {
  width: 100%;
  height: 70%;
  overflow: hidden;
}
.noteSpan {
  color: white;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 90%;
  margin-left: 5%;
  margin-top: 10px;
  padding-left: 5%;
  padding-right: 8%;
  height: 29px;
  position: relative;
  line-height: 29px;
  background-color: #409eff;
  border-radius: 5px;
  cursor: pointer;
}
.dayNote {
  color: white;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 85%;
  margin-left: 5%;
  margin-top: 2px;
  padding-left: 5%;
  border-radius: 5px;
  // background-color: #409eff;
}
.drag-note .tga-0 {
  background-color: #39cccc;
}
.drag-note .tga-1 {
  background-color: #00a65a;
}
.drag-note .tga-2 {
  background-color: #f39c12;
}
.drag-note .tga-3 {
  background-color: #00c0ef;
}
.drag-note .tga-4 {
  background-color: #3c8dbc;
}
.drag-note .tga-5 {
  background-color: #dd4b39;
}
.drag-note .tga-6 {
  background-color: #ff851b;
}
.drag-note .tga-7 {
  background-color: #605ca8;
}
.deleteNoteBtn {
  position: absolute;
  right: 1%;
}
.current > .el-calendar-day {
  margin: 0 !important;
  padding: 0 !important;
}
.dayBox {
  overflow: hidden;
}
.shift-1 {
  background: #26c5f9;
}
.shift-2 {
  background: #0c95c1;
}
.shift-3 {
  background: #0d7597;
}
.shift-4 {
  background: #20b0de;
}
.shift-5 {
  background: #e6a23c;
}
.el-button-group > .el-button:last-child {
  background-color: #00a65a !important;
}
</style>
