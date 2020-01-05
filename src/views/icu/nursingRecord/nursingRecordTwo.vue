<template>
  <!-- 枣庄市立医院ICU护理记录单 -->
  <basic-container>
    <div>
      <div>
        <el-dropdown class="avue-tags__menu">
          <el-button v-model="patInfo.patientId" type="primary" size="mini">
            {{ patInfo.name }} {{patInfo.bedName}}
            <i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu>
            <div class="dropdownMenu">
              <el-button
                v-for="(item,index) in patientNames"
                :title="item.patientName"
                :key="index"
                :class="['el-button--small',(item.patientId == patInfo.patientId?'el-button el-button--primary':'')]"
                @click="patientNameClick(item.name,item.id,item.patientId,item)"
              >{{ item.name }} {{item.bedName}}</el-button>
            </div>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <el-button @click="printContent" type="primary">打印</el-button>
      <el-date-picker
        v-model="dateTime"
        type="datetime"
        format="yyyy-MM-dd"
        @change="dateChange"
        placeholder="选择日期"
        style="width:150px;margin-left:20px;"
      ></el-date-picker>
      <!-- 护理记录单 -->
      <div class="panel panel-default" id="panel">
        <div class="panel-heading clearfix">
          <h3 class="panel-title">枣庄市立医院ICU护理记录单(II)</h3>
          <div class="perinfo">
            <span>科室: &nbsp;{{patInfo.delId|depFl}}</span>&nbsp;
            <span>床位: &nbsp;{{patInfo.bedName}}</span>&nbsp;
            <span>住院号: &nbsp;{{patInfo.hospitalnumber}}</span>&nbsp;
            <span>姓名: &nbsp;{{patInfo.name}}</span>&nbsp;
            <span>性别：&nbsp;{{patInfo.gender| genderFl }}</span>&nbsp;
            <span>年龄：&nbsp;{{patInfo.age}}</span>&nbsp;
            <span>入院日期：&nbsp;{{patInfo.entranceTime | timeFl}}</span>&nbsp;
            <span>诊断: &nbsp;{{patInfo.diagnosis}}</span>&nbsp;
          </div>
          <div class="perinfo">
            <span v-for="(pip,index) in recordData.pipUseTimes" :key="index+'pip'">
              <span>&nbsp;{{pip.pipName}}&nbsp;:&nbsp;</span>
              <span>{{pip.startTime.substr(0,10)}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
          </div>
        </div>
        <!-- 表格 -->
        <div class="assTable" id="assTable" v-loading="tabLoad">
          <table class="table table-bordered" id="basic-table" :data="recordData">
            <thead>
              <tr>
                <td class="first" style="width:160px;">
                  <span class="befor_span">&nbsp;内容</span>
                  <span>\</span>
                  <span class="first_span">时间</span>
                </td>
                <td v-for="i in range" :key="i">{{i}}</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(i,index) in recordData.nursingReportVos" :key="index">
                <td style="width:160px;text-align:left;padding-left:15px">{{i.projectName}}</td>
                <td
                  v-if="i.showWayFlag==0"
                  v-for="(j,index2) in i.projectRecordDuplicates"
                  :key="index2"
                  @click="setconName(j,index2,i,index)"
                >{{j!=null?j.projectValue:""}}</td>
                <td
                  v-if="i.showWayFlag==1"
                  v-for="(j,index2) in i.projectRecordDuplicates"
                  :key="index2"
                  @click="setconName(j,index2,i,index)"
                >{{j!=null?"√ ":""}}</td>
                <td
                  v-if="i.showWayFlag==2"
                  v-for="(j,index2) in i.projectRecordDuplicates"
                  :key="index2"
                  @click="setconName(j,index2,i,index)"
                >{{j!=null?j.projectValue:""}}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td style="width:80px;text-align:left;padding-left:15px">签名</td>
                <td
                  :colspan="8"
                  style="text-align:left;padding-left:20px"
                  v-for="(n,index) in this.recordData.nurseName"
                  :key="index+'name'"
                >
                  <img
                    v-if="n.signature!=null&&n.signature!=undefined"
                    :src="n.signature"
                    alt
                    width="80"
                    height="30"
                  />
                  <span v-if="n.signature==null||n.signature==undefined">{{n.realName}}</span>
                </td>
                <!-- <td :colspan="8" style="text-align:left;padding-left:20px"></td>
                <td :colspan="8" style="text-align:left;padding-left:20px"></td>-->
              </tr>
              <tr>
                <td style="text-align:left;padding-left:15px">注：</td>
                <td :colspan="24" style="text-align:left;padding-left:15px">
                  <span v-for="(k,index3) in recordData.projectValueVos" :key="index3">
                    【{{k.projectName}}】
                    <span
                      v-for="(l,index4) in k.projectRecordValues"
                      :key="index4"
                    >{{l.dataFlag}}. {{l.recordValue}};</span>
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
          <!-- <div>
            <span>注:</span>
            <div style="display:inline-block;margin-left:30px">
              <span v-for="(k,index3) in recordData.projectValueVos" :key="index3">
                【{{k.projectName}}】
                <span
                  v-for="(l,index4) in k.projectRecordValues"
                  :key="index4"
                >{{l.dataFlag}}.{{l.recordValue}},</span>
              </span>
            </div>
          </div>-->
        </div>
      </div>
    </div>
    <el-dialog
      :title="form.title"
      :visible.sync="editconNameVis"
      :fullscreen="isFullscreen"
      @close="closeForm()"
    >
      <el-form :model="form">
        <el-form-item label="项目" :label-width="formLabelWidth">
          <span>{{form.projectName}}</span>
        </el-form-item>
        <el-form-item label="时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="form.createTime"
            autocomplete="off"
            :disabled="editIf"
            type="datetime"
          ></el-date-picker>
        </el-form-item>
        <el-form-item v-if="form.showWayFlag==2" label="内容" :label-width="formLabelWidth">
          <el-input style="width:220px" v-model="form.projectValue" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          v-if="form.showWayFlag==1"
          label="内容"
          :label-width="formLabelWidth"
          prop="projectValue"
        >
          <el-select style="width:220px" v-model="form.projectValue" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.label"
              :label="item.value"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="form.showWayFlag==0"
          label="内容"
          v-model="form.projectValue"
          :label-width="formLabelWidth"
          prop="projectValue"
        >
          <el-button
            v-for="item in options"
            :key="item.dataFlag"
            :label="item.recordValue"
            :value="item.dataFlag"
            style="margin-top:10px;margin-left:10px"
            :type="item.flag?'primary':''"
            @click="recordValueClick(item)"
          >{{item.recordValue}}</el-button>
          <!-- <el-select style="width:220px" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.dataFlag"
              :label="item.recordValue"
              :value="item.dataFlag"
            ></el-option>
          </el-select>-->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          v-if="form.showWayFlag==1&&form.title=='删除'"
          @click="delReport()"
          :loading="saveRec"
        >删 除</el-button>
        <el-button
          type="primary"
          v-if="!(form.showWayFlag==1&&form.title=='删除')"
          @click="saveVal()"
          :loading="saveRec"
        >保 存</el-button>

        <el-button @click="editconNameVis = false">取 消</el-button>
      </div>
    </el-dialog>
  </basic-container>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { dateFormat } from "@/util/date";
import {
  getRecords,
  getDict,
  addRecords,
  updateRecords,
  deleteRecords,
  getsection
} from "@/api/icu/nursingRecord/nursingRecordTwo.js";
let that;
export default {
  beforeCreate() {
    that = this;
  },
  filters: {
    depFl: data => {
      for (let i in that.depList) {
        if (data == that.depList[i].depId) {
          return that.depList[i].name;
        }
      }
    },
    timeFl: data => {
      if (data) {
        data = data.substr(0, 11);
      }

      return data;
    },
    genderFl: data => {
      switch (data) {
        case "0":
          return "女";

        case "1":
          return "男";
      }
    }
  },
  data() {
    return {
      todayIf: true,
      depList: [],
      projectId: "",
      min: "",
      max: "",
      name: "",
      range: [],
      // 合计
      combined: 0,
      total: [],
      // 患者
      patName: "",
      patientNames: [],
      flagAct: "",
      patInfo: {},
      rangeIf: true,
      isFullscreen: false,
      screenWidth: document.body.clientWidth, // 屏幕尺寸
      watchArr: [],
      year: "",
      dateTime: new Date(),
      tabLoad: false,
      selected: false,
      saveRec: false,
      recordData: [],
      editconNameVis: false,
      form: {
        createTime: "",
        projectValue: ""
      },
      formLabelWidth: "100px",
      editIf: true,
      dicData: [],
      editPar: {},
      editIndex: ""
    };
  },
  computed: {
    ...mapGetters([
      "permissions",
      "nurse_patients",
      "dep_patients",
      "patientMessage"
    ]),
    ...mapState({
      roleCodes: state => state.user.roleCodes
    }),
    permissionList() {
      return {};
    }
  },
  watch:{
      patientMessage:{
         handler(newValue, oldValue){
            this.patientNameClick(newValue.name,newValue.id,newValue.patientId,newValue)
         }
      }
   },
  created() {
    this.getNursePatients();
    this.getDic();
    getsection().then(response => {
      // console.log(response.data.data)
      this.depList = response.data.data;
    });
  },
  // activated() {
  //   this.getNursePatients();
  //   this.getDic();
  //   getsection().then(response => {
  //     // console.log(response.data.data)
  //     this.depList = response.data.data;
  //   });
  // },
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
    // 请求患者列表
    getNursePatients() {
      this.tabLoad = true;
      let data = JSON.parse(sessionStorage.getItem("pigx-all_patients"))
        .content;
      this.patientNames = data;
      this.patInfo = JSON.parse(
        sessionStorage.getItem("pigx-patientMessage")
      ).content;
      if (data == undefined) {
        this.$message.warning("没有患者");
      }
      this.patName = this.patInfo.patientId;
      this.name = this.patInfo.name;

      this.getList();
    },
    patientNameClick(patientName, id, patientId, item) {
      this.patName = patientId;
      this.name = patientName;
      this.$store.commit("SET_MESSAGE", item);
      this.patInfo = this.patientMessage;
      this.getList();
    },
    closeForm() {
      this.saveRec = false;
      this.options = [];
      this.form = {
        createTime: "",
        projectValue: ""
      };
    },
    dateChange(val) {
      if (
        dateFormat(val).substr(0, 10) ==
        dateFormat(new Date()).substr(0, 10)
      ) {
        this.dateTime = new Date();
        this.todayIf = true;
      } else {
        this.todayIf = false;
      }
      // console.log(this.todayIf)
      this.getList();
    },
    //请求字典表
    getDic() {
      getDict().then(response => {
        this.dicData = response.data.data;
        // console.log(this.dicData);
      });
    },
    recordValueClick(item) {
      this.form.projectValue = item.dataFlag;
      for (let i in this.options) {
        if (
          item.projectRecordValueId == this.options[i].projectRecordValueId
        ) {
          this.options[i].flag = true;
        } else {
          this.options[i].flag = false;
        }
      }
    },
    getList() {
      this.count = null;
      this.tabLoad = true;
      let obj = {
        patientId: this.patName,
        endTime: dateFormat(this.dateTime)
      };
      getRecords(obj).then(response => {
        this.recordData = response.data.data;
        // console.log(this.recordData);

        this.range = [];
        for (let i = this.recordData.hour; i <= 24; i++) {
          if (i == 24) {
            i = 0;
          }
          this.range.push(i);
          if (this.range.length == 24) {
        this.tabLoad = false;

            return;
          }
        }
      });

      // console.log(this.patientNames[0].deptId)

    },
    //打印页面内容
    printContent() {
      let wpt = document.getElementById("panel");
      let newContent = wpt.innerHTML;
      let oldContent = document.body.innerHTML;

      document.body.innerHTML = newContent;
      window.print(); //打印方法
      window.location.reload();
      document.body.innerHTML = oldContent;
    },
    setconName(val, index2, i, index) {
      // console.log(i)
      // console.log(i)
      if (this.todayIf == true) {
        this.dateTime = new Date();
      }
      // console.log(this.dateTime)
      // console.log(index2)
      if (i.showWayFlag == 1) {
        this.form.projectValue = 1;
        this.options = [{ value: "√", label: 1 }];
      } else if (i.showWayFlag == 0) {
        for (let k in this.recordData.projectValueVos) {
          if (
            i.projectId == this.recordData.projectValueVos[k].projectId
          ) {
            this.options = JSON.parse(
              JSON.stringify(
                this.recordData.projectValueVos[k].projectRecordValues
              )
            );
            for (let j in this.options) {
              // console.log(this.options[j])
              // console.log(i)
              // console.log(index2)
              if (val != null) {
                if (
                  i.projectRecordDuplicates[index2].projectValue * 1 ==
                  this.options[j].dataFlag
                ) {
                  // console.log(true)
                  this.options[j].flag = true;
                  this.form.projectValue = this.options[j].dataFlag;
                }
              }
            }
            // console.log(this.options);
          }
        }
      } else {
        this.selected = false;
      }
      // console.log(val, index2);
      this.editIf = true;
      if (val != null) {
        this.form.projectValue = val.projectValue * 1;
        this.form.id = val.id;
        this.form.createTime = val.createTime;
        this.form.title = "修改";
        if (i.showWayFlag == 1) {
          this.form.title = "删除";
          this.form.projectValue = 1;
        }
        this.editconNameVis = true;
      } else {
        this.form.title = "新增";
        if (this.range[index2].toString().length == 2) {
          this.form.createTime = dateFormat(this.dateTime).replace(
            dateFormat(this.dateTime).substr(11),
            this.range[index2] + ":00:00"
          );
        } else {
          this.form.createTime = dateFormat(this.dateTime).replace(
            dateFormat(this.dateTime).substr(11),
            "0" + this.range[index2] + ":00:00"
          );
        }
        if (index2 >= 16) {
          this.form.createTime = dateFormat(
            new Date(
              new Date(this.form.createTime).getTime() +
              1 * 24 * 60 * 60 * 1000
            )
          );
          // console.log( this.form.createTime)
        }
        if (
          new Date().getTime() <= new Date(this.form.createTime).getTime()
        ) {
          this.$message({
            type: "warning",
            showClose: true,
            message: "当前时间小于目标时间，不允许操作"
          });
          return;
        }
        this.editconNameVis = true;
      }
      this.form.showWayFlag = i.showWayFlag;
      this.form.patientId = this.patName;
      this.form.projectName = i.projectName;
      this.form.projectId = i.projectId;
      // this.form.time = this.range[index2];
      // this.form.index = index2;
      this.editPar = i;
      this.editIndex = index;
      // console.log(this.form);
      // console.log(dateFormat(this.dateTime));
      this.$forceUpdate();
    },
    delReport() {
      this.saveRec = true;
      deleteRecords(this.form.id).then(response => {
        this.$message({
          type: "success",
          showClose: true,
          message: "删除成功"
        });
        this.editconNameVis = false;
        this.getList();
      });
    },
    saveVal() {
      // console.log(this.form)
      if (this.form.showWayFlag == 0) {
        if (this.form.projectValue == "") {
          this.$message({
            showClose: true,
            message: "请选择内容",
            type: "warning"
          });
        } else {
          for (let i in this.options) {
            if (this.form.projectValue == this.options[i].dataFlag) {
              this.form.projectSpecificRecord = this.options[
                i
              ].recordValue;
              this.form.projectValue = this.form.projectValue.toString();
            }
          }
          if (this.form.title == "新增") {
            this.saveRec = true;
            addRecords(this.form).then(response => {
              this.$message({
                showClose: true,
                message: "添加成功",
                type: "success"
              });
              this.editconNameVis = false;
              this.getList();
            });
          } else if (this.form.title == "修改") {
            this.saveRec = true;
            updateRecords(this.form).then(response => {
              this.$message({
                showClose: true,
                message: "修改成功",
                type: "success"
              });
              this.editconNameVis = false;
              this.getList();
            });
          }
        }
      }
      if (this.form.showWayFlag == 1) {
        if (this.form.title == "新增") {
          delete this.form.projectValue;
          this.form.projectSpecificRecord = this.form.projectName;
          this.saveRec = true;
          addRecords(this.form).then(response => {
            this.$message({
              showClose: true,
              message: "添加成功",
              type: "success"
            });
            this.editconNameVis = false;
            this.getList();
          });
        }
      }
      if (this.form.showWayFlag == 2) {
        // console.log(this.form);
        if (this.form.projectValue == "") {
          this.$message({
            showClose: true,
            message: "内容不能为空",
            type: "warning"
          });
        } else {
          if (this.form.title == "新增") {
            this.saveRec = true;
            addRecords(this.form).then(response => {
              this.$message({
                showClose: true,
                message: "添加成功",
                type: "success"
              });
              this.editconNameVis = false;
              this.getList();
            });
          } else if (this.form.title == "修改") {
            this.saveRec = true;
            updateRecords(this.form).then(response => {
              this.$message({
                showClose: true,
                message: "修改成功",
                type: "success"
              });
              this.editconNameVis = false;
              this.getList();
            });
          }
        }
      }
      // this.recordData.nursingReportVos[this.editIndex].projectRecordDuplicates[
      //   this.form.index
      // ].projectValue = this.form.conName;
      // this.editconNameVis = false;
    }
  }
};
</script>
<style lang="scss" scoped >
table {
  border-collapse: collapse;
}
table,
tr,
td {
  border: 1px solid black;
}
.assTable table {
  border-collapse: collapse;
}
.assTable table td {
  width: 50px;
}

// td {
//   width: 100px; /*这里需要自己调整，根据自己的需求调整宽度*/
//   height: 50px; /*这里需要自己调整，根据自己的需求调整高度*/
//   position: relative;
// }
.first {
  position: relative;
}
.befor_span {
  position: absolute;
  left: 5px;
}
.first_span {
  position: absolute;
  right: 5px;
}
// td[class="first"]:before {
//   content: "";
//   position: absolute;
//   width: 1px;
//   height: 121px; /*这里需要自己调整，根据td的宽度和高度*/
//   top: 0;
//   left: 0;
//   background-color: black;
//   display: block;
//   transform: rotate(-80deg); /*这里需要自己调整，根据线的位置*/
//   transform-origin: top;
// }
.clearfix:after {
  content: '';
  display: block;
  clear: both;
}
.panel-heading {
  padding: 0px 5px;
  border-bottom: 1px solid transparent;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border-color: #ddd;
}
.panel-title {
  text-align: center;
  font-size: 16px;
  font-weight: 600;
}
.perinfo {
  margin-right: 100px;
  line-height: 30px;
  font-size: 12px;
}
.patient_name {
  margin-top: 5px;
  margin-left: 1%;
}
.assTable {
  width: 100%;
  margin-bottom: 30px;
  padding-bottom: 10px;
  // overflow-x: scroll;
}
@media screen and (max-width: 1750px) {
  .assTable {
    overflow-x: scroll;
  }
  table {
    border-collapse: collapse;
    width: 1500px;
  }
}
// @media screen and (max-width: 768px) {
//   .main {
//     width: 600px;
//   }
// }
// .content {
//   margin-top: 20px;
//   text-align: center;
// }
// .submit {
//   background: #409eff !important;
//   color: #fff !important;
//   text-align: center;
// }
// .combined {
//   display: inline-block;
//   width: 24%;
//   margin-right: 33%;
// }

// #input {
//   width: 15%;
// }
// #typeTd {
//   width: 10px!important;
// }
// @media screen and (max-width: 1024px) {
//   .main {
//     width: 830px;
//   }
// }
// @media screen and (max-width: 768px) {
//   .main {
//     width: 600px;
//   }
// }
// .td_span {
//   // display: inline-block;
// //   width: 100%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// //   height: 65px;
//   // height: 100%;

//   overflow: hidden;
// }

.avue-tags__menu {
  line-height: 40px;
  padding-right: 10px;
  margin-top: 18px;
  margin-right: 1%;
  z-index: 500;
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
</style>