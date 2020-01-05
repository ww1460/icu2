<template>
  <!-- 日历记事本 -->
  <div class="clearfix" v-loading="calendarLoading">
    <!-- element日历组件 -->
    <div class="cal-left">
      <el-calendar v-model="value" class="calendar">
        <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
        <template slot="dateCell" slot-scope="{date, data}">
          <div
            :class="data.isSelected ? 'is-selected' : ''"
            class="dayBox"
            style="width:100%;height:100%"
            @click="dayClick(date)"
          >
            {{ data.day.split('-').slice(2).join('-') }} {{ data.isSelected ? '✔️' : '' }}
            <div class="dayContent">
              <span
                v-for="(item,index) in noteArrs"
                v-if="data.day==item.createTime"
                :key="index"
                class="dayNote"
              >{{ item.content }}</span>
            </div>
          </div>

          <!-- <span v-for='(item,index) in noteArr' :key="index" >{{item.note}}</span> -->
        </template>
      </el-calendar>
    </div>
    <!-- 记事本 -->
    <div class="cal-right">
      <el-button
        type="primary"
        icon="el-icon-plus"
        size="small"
        style="margin:1% 5% 0"
        @click="addNoteClick"
      >新增</el-button>
      <!-- 可拖拽记事本  目前只做展示 -->

      <div class="drag-note">
        <template>
          <span
            v-for="(item,index) in noteArr"
            :key="index"
            :class="[index==0?'tga-0':'',index==1?'tga-1':'',index==2?'tga-2':'',index==3?'tga-3':'',index==4?'tga-4':'',index==5?'tga-5':'',index==6?'tga-6':'',index==7?'tga-7':'',index>7?'tga-8':'']"
            class="noteSpan"
            @click="openNote(item,index)"
          >
            {{ item.content }}
            <el-button
              icon="el-icon-delete"
              circle
              size="mini"
              class="deleteNoteBtn"
              @click="delNote(item,index)"
              @click.stop
            ></el-button>
          </span>
        </template>
        <!-- <el-tag
    v-for="item in items"
    :key="item.label"
    :type="item.type"
    effect="plain">
    {{ item.label }}
        </el-tag>-->
      </div>
    </div>
    <!-- 记事本新增对话框 -->
    <el-dialog :visible.sync="dialogAddNote" :append-to-body="true" title="新建记事本">
      <el-form ref="noteList" :model="noteList" :rules="rules">
        <el-form-item :label-width="formLabelWidth" prop="date" label="日期">
          <el-date-picker
            v-model="noteList.date"
            type="date"
            placeholder="选择日期"
            style="width: 90%;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" prop="note" label="内容">
          <el-input
            v-model="noteList.note"
            :autosize="{ minRows: 4, maxRows: 10}"
            type="textarea"
            placeholder="请输入内容"
            style="width: 90%;"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="resetForm('noteList')">重置</el-button> -->
        <el-button type="primary" :loading="pdSub" @click="handleSave('noteList')">保 存</el-button>
        <el-button @click="dialogAddNote=false;resetForm('noteList')">取消</el-button>
      </div>
    </el-dialog>
    <!-- 记事本编辑对话框 -->
    <el-dialog :visible.sync="dialogOpenNote" :append-to-body="true" title="修改记事本">
      <el-form ref="noteEdit" :model="noteEdit" :rules="rules1">
        <el-form-item :label-width="formLabelWidth" prop="createTime" label="日期">
          <el-date-picker
            v-model="noteEdit.createTime"
            type="date"
            placeholder="选择日期"
            :readonly="true"
            style="width: 90%;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" prop="content" label="内容">
          <el-input
            v-model="noteEdit.content"
            :autosize="{ minRows: 4, maxRows: 10}"
            type="textarea"
            placeholder="请输入内容"
            style="width: 90%;"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="pdSub" @click="handleUpdate('noteEdit')">修 改</el-button>
        <el-button @click="closeContent()">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  addObj,
  delObj,
  fetchList,
  putObj,
  getByday
} from "@/api/icu/nurse/notepad";
// import { mapGetters } from 'vuex'
import { dateFormat } from "@/util/date";
// import { close } from 'fs'
export default {
  name: "notepad",
  components: {},
  data() {
    return {
      value: "",
      month: "",
      seen: "",
      pdSub: false,
      status: false,
      statusDate: "",
      formLabelWidth: "80px",
      dialogAddNote: false,
      dialogOpenNote: false,
      calendarLoading: false,
      textarea: "",
      createNote: {},

      noteArr: [],
      noteArrs: [],
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
    // 记事本编辑弹框
    openNote(item, index) {
      this.dialogOpenNote = true;
      this.noteEdit = item;
      // console.log(this.noteEdit)
    },
    closeContent() {
      this.dialogOpenNote = false;
    },
    addNoteClick() {
      this.dialogAddNote = true;
      // console.log(this.status)
      // console.log(this.statusDate)
      if (this.status === true) {
        this.noteList.date = this.statusDate;
      } else {
        this.noteList.date = new Date();
      }
    },
    closeAddDialog() {
      this.dialogAddNote = false;
    },
    calClick() {
      //  console.log(123)
    },

    dayClick(date) {
      this.status = true;
      this.statusDate = date;
      var date1 = dateFormat(date);
      this.noteArr = [];
      for (var i in this.noteArrs) {
        if (date1.substr(0, 10) === this.noteArrs[i].createTime) {
          this.noteArr.push(this.noteArrs[i]);
        } else {
        }
      }
      // this.noteList.date= date
      //  按天请求 并渲染展示
      // this.getList()
      // getByday(date1)
      //   .then(data => {
      //     this.noteArr = data.data.data
      //     // console.log(data)
      //   })
      //   .catch(() => {
      //     // loading()
      //   })
    },
    // 重置按钮
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //  按照时间请求数据
    getList() {
      this.noteArr=[]
      this.calendarLoading = true;
      if (this.status === false) {
        var date = dateFormat(new Date());
        this.month = date.substr(0, 7);
        //   按月份请求数据
        fetchList(date)
          .then(data => {
            this.noteArrs = data.data.data;
            for (var i in this.noteArrs) {
              this.noteArrs[i].createTime = this.noteArrs[i].createTime.substr(
                0,
                10
              );
            }
            for (var i in this.noteArrs) {
              if (date.substr(0, 10) === this.noteArrs[i].createTime) {
                this.noteArr.push(this.noteArrs[i]);
              } else {
              }
            }
            this.calendarLoading = false;
          })
          .catch(() => {});
      } else {
        var date1 = dateFormat(this.statusDate);
        //   按月份请求数据
        fetchList(date1)
          .then(data => {
            this.noteArrs = data.data.data;
            for (var i in this.noteArrs) {
              this.noteArrs[i].createTime = this.noteArrs[i].createTime.substr(
                0,
                10
              );
            }
            this.noteArr = [];
            for (var i in this.noteArrs) {
              if (date1.substr(0, 10) === this.noteArrs[i].createTime) {
                this.noteArr.push(this.noteArrs[i]);
              } else {
              }
            }
            this.calendarLoading = false;
          })
          .catch(() => {});
      }
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
          this.pdSub = true;
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
              this.pdSub = false;
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
          this.pdSub = true;
          addObj(this.noteList.note, date)
            .then(data => {
              this.$message({
                showClose: true,
                message: "添加成功",
                type: "success"
              });
              this.pdSub = false;
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
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  watch: {
    value(val) {
      // console.log(dateFormat(val).substr(0, 10));
      this.status = true;
       this.statusDate=val;
      if (this.month === dateFormat(val).substr(0, 7)) {
      } else {
        var date = dateFormat(val);
        this.month = dateFormat(val).substr(0, 7);
        this.calendarLoading = true;
        fetchList(date).then(data => {
          this.noteArrs = [];
          this.noteArrs = data.data.data;
          for (var i in this.noteArrs) {
            this.noteArrs[i].createTime = this.noteArrs[i].createTime.substr(
              0,
              10
            );
          }
          this.noteArr = [];
          for (var i in this.noteArrs) {
            if (date.substr(0, 10) === this.noteArrs[i].createTime) {
              this.noteArr.push(this.noteArrs[i]);
            } else {
            }
          }
          this.calendarLoading = false;
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
  width: 65%;
}
.cal-right {
  float: left;
  width: 30%;
  // padding-top: 25%;
  margin-top: 70px;
  // height: 200px;
  // background: red
  // border: 1px solid #ddd;
}
.drag-note {
  // height: 50%;
  // margin-top: 0px;
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
  background-color: #409eff;
}
.drag-note .tga-0 {
  background-color: #39cccc;
  margin-top: 7.5px;
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
</style>
