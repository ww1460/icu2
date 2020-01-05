<template>
  <!-- 外出评估 -->
  <el-dialog title="患者转出评估" :visible.sync="dialogVisible" width="60%" :fullscreen="isFullscreen">
    <div class="panel panel-default">
      <div class="panel-heading clearfix">
        <h3 class="panel-title">外出评估</h3>
        <div class="perinfo">
          <span>姓名: &nbsp;{{patInfo.name}}</span>&nbsp;
          <span>性别：&nbsp;{{patInfo.gender|genderFl }}</span>&nbsp;
          <span>年龄：&nbsp;{{patInfo.age}}</span>&nbsp;
          <span>入科日期：&nbsp;{{patInfo.entranceTime}}</span>&nbsp;
        </div>
      </div>
      <div class="assTable">
        <table class="table table-bordered" id="basic-table" v-loading="loading">
          <thead>
            <tr style="background-color:#f5f7fa">
              <th rowspan="2">评分类型</th>
              <th rowspan="2">评分项目</th>
              <th :colspan=" range.length  ">分值</th>
              <!-- <th rowspan="2">测量值</th> -->
              <th rowspan="2">得分</th>
            </tr>
            <tr style="background-color:#f5f7fa" v-if="rangeIf">
              <th v-for="i in range" :key="i">{{i}}</th>
            </tr>
          </thead>
          <tbody v-for="(item,index) in questionArr" :key="index">
            <tr>
              <td :rowspan="item.assessProjects.length+1" id="typeTd">{{item.assessType}}</td>
            </tr>

            <tr v-for="(i,index2) in item.assessProjects" :key="index2">
              <!-- <td>{{item.assessType}}</td> -->
              <td>{{i.projectName}}</td>
              <td>
                <span
                  v-for="(j,index3) in i.projectConditions"
                  :key="index3"
                  v-if="j.assessScore === 0"
                  :class="['td_span',(j.selected == true?'ActBtn':'')]"
                  @click="getId($event,j.id,j.assessScore,i,j.selected)"
                >{{j.assessCondition}}</span>
              </td>
              <td>
                <span
                  v-for="(j,index3) in i.projectConditions"
                  :key="index3"
                  v-if="j.assessScore == 1"
                  :class="['td_span',(j.selected == true?'ActBtn':'')]"
                  @click="getId($event,j.id,j.assessScore,i,j.selected)"
                >{{j.assessCondition}}</span>
              </td>
              <td>
                <span
                  v-for="(j,index3) in i.projectConditions"
                  :key="index3"
                  v-if="j.assessScore == 2"
                  :class="['td_span',(j.selected == true?'ActBtn':'')]"
                  @click="getId($event,j.id,j.assessScore,i,j.selected)"
                >{{j.assessCondition}}</span>
              </td>
              <td>
                <span
                  v-for="(j,index3) in i.projectConditions"
                  :key="index3"
                  v-if="j.assessScore == 3"
                  :class="['td_span',(j.selected == true?'ActBtn':'')]"
                  @click="getId($event,j.id,j.assessScore,i,j.selected)"
                >{{j.assessCondition}}</span>
              </td>
              <td>{{i.number}}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr style="background-color:#f5f7fa">
              <td colspan="9">
                合计：
                <span class="total">{{ count }}</span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="reset">清空</el-button>
      <el-button type="primary" @click="submit()" :loading="loading">保 存</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
      
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { putObj } from "@/api/icu/process/outDepartment";
import { getEch, getAssess, addAss } from "@/api/icu/assessment/APACHE.js";
export default {
  // 过滤
  filters: {
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
      // 防重提交
      loading: false,
      isFullscreen: false,
      screenWidth: document.body.clientWidth, // 屏幕尺寸
      dialogVisible: false,
      projectCode: "MEWS",
      projectId: "",
      min: "",
      max: "",
      range: [],
      // 合计
      combined: 0,
      total: [],
      // 患者
      name: "",
      patName: "",
      patientNames: [],
      flagAct: "",
      patInfo: {},
      rangeIf: true,
      loading: false,
      // 模拟数据
      question: "临床表现",
      count: 0,
      questionArr: [],
      // 总分
      totalScore: "",
      falg: {}
    };
  },
  // 父组件的数据
  props: {
    flowName: String,
    NewPatient: Array,
    patientId: String,
    operationData: Object
  },
  // 监听父组件的数据
  watch: {
    flowName: {
      handler(newValue, oldValue) {
        this.flowName = newValue;
      },
      deep: true
    },
    NewPatient: {
      handler(newValue, oldValue) {
        this.NewPatient = newValue;
      },
      deep: true
    },
    patientId: {
      handler(newValue, oldValue) {
        this.patientId = newValue;
      },
      deep: true
    },
    operationData: {
      handler(newValue, oldValue) {
        this.operationData = newValue;
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters(["permissions", "nurse_patients", "dep_patients"]),
    ...mapState({
      roleCodes: state => state.user.roleCodes
    }),
    permissionList() {
      return {};
    }
  },

  created() {},
  mounted() {
    // 小屏幕全屏
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
    // 初始化时的数据，判断有没有过评估记录
    getList() {
      this.count = null;
      let params = {
        patientId: this.patName.patientId,
        projectCode: this.projectCode
      };
      getAssess(params).then(response => {
        // console.log(response.data.data.data);
        this.questionArr = response.data.data.data;
        this.projectId = this.questionArr[0].projectId;
        for (let i in this.questionArr) {
          for (let j in this.questionArr[i].assessProjects) {
            // this.questionArr[i].assessProjects[j].fliterNum = true;
            //  没有评估记录的
            if (
              this.questionArr[i].assessProjects[j].pitchOnId == null ||
              this.questionArr[i].assessProjects[j].pitchOnId.length == 0
            ) {
              this.questionArr[i].assessProjects[j].number = null;
              this.questionArr[i].assessProjects[j].fliterNum = false;
              for (let k in this.questionArr[i].assessProjects[j]
                .projectConditions) {
                this.questionArr[i].assessProjects[j].projectConditions[
                  k
                ].selected = false;
              }
            } else {
              this.questionArr[i].assessProjects[j].fliterNum = true;
              for (let k in this.questionArr[i].assessProjects[j]
                .projectConditions) {
                // console.log(k)
                //  有过评估记录后  将上次评估的结果渲染
                if (
                  this.questionArr[i].assessProjects[j].projectConditions[k]
                    .assessConditionId ==
                  this.questionArr[i].assessProjects[j].pitchOnId
                ) {
                  this.questionArr[i].assessProjects[
                    j
                  ].number = this.questionArr[i].assessProjects[
                    j
                  ].projectConditions[k].assessScore;

                  this.questionArr[i].assessProjects[j].projectConditions[
                    k
                  ].selected = true;
                } else {
                  this.questionArr[i].assessProjects[j].projectConditions[
                    k
                  ].selected = false;
                }
              }
              this.count =
                this.count + this.questionArr[i].assessProjects[j].number;
              this.$forceUpdate(); //强制页面进行刷新
            }
          }
          if (isNaN(this.count)) {
            this.count = null;
          }
          //  如果没有设定范围就不显示具体分值  如果有就在表头显示具体分值
          if (
            this.questionArr[0].scoreMin == null ||
            this.questionArr[0].scoreMin == undefined ||
            this.questionArr[0].scoreMax == null ||
            this.questionArr[0].scoreMax == undefined
          ) {
            this.rangeIf = false;
          } else {
            this.min = this.questionArr[0].scoreMin * 1;
            this.max = this.questionArr[0].scoreMax * 1;
            this.range = [];
            for (i = this.min; i <= this.max; i++) {
              this.range.push(i);
            }
          }
        }
      });
      // getEch(params).then(response => {
      //   // console.log(response.data.data);
      //   this.AssessData = response.data.data.reverse();
      //   // console.log(this.AssessData)
      //   // this.AssessData=[]
      //   this.AssessTime = [];
      //   this.AssessCount = [];
      //   for (let i in this.AssessData) {
      //     this.AssessTime.push(this.AssessData[i].createTime);
      //     this.AssessCount.push(this.AssessData[i].assessResult);
      //   }
      //   this.AssessTime = this.AssessTime.map(function(str) {
      //     return str.replace(" ", "\n");
      //   });
      //   // console.log(this.AssessTime);
      //   // console.log(this.AssessCount);
      // });
    },
    // 条件点击
    getId(e, id, score, items, index) {
      for (var i in items.projectConditions) {
        if (items.projectConditions[i].id == id) {
          // console.log(items.projectConditions[i].id);
          // console.log(id);
          if (items.projectConditions[i].selected == true) {
            items.projectConditions[i].selected = false;
            this.count = this.count - items.number;
            if (this.count === 0) {
              this.count = null;
            }
            items.fliterNum = false;
            items.number = null;
            // console.log("取消选中");
            // console.log(items.fliterNum);
            // console.log(items.projectConditions[i].selected);
          } else {
            // e.target.classList.add("ActBtn");
            items.projectConditions[i].selected = true;
            // console.log("选中");
            // console.log(items.projectConditions[i].selected);
            // console.log(i)
            items.fliterNum = true;
            // console.log(items.number)
            // console.log(items);
            if (items.number === null) {
              items.number = score;
              // console.log(items.number);
              // console.log(score);
              this.count += items.number;
              // console.log("加");
              // console.log(123)
            } else {
              // console.log("减");
              if (items.number == null) {
              } else {
                this.count = this.count - items.number;
              }
              items.number = score;
              this.count += items.number;
              // console.log(456)
            }
          }
        } else {
          items.projectConditions[i].selected = false;

          // }
        }
      }
      this.$forceUpdate();
    },
    // 清空选择
    reset() {
      // console.log("清空")
      for (let i in this.questionArr) {
        for (let j in this.questionArr[i].assessProjects) {
          this.questionArr[i].assessProjects[j].number = null;
          this.questionArr[i].assessProjects[j].fliterNum = false;
          for (let k in this.questionArr[i].assessProjects[j]
            .projectConditions) {
            this.questionArr[i].assessProjects[j].projectConditions[
              k
            ].selected = false;
          }
        }
      }
      this.count = null;
    },
    // 提交
    submit() {
      let _this = this;
      let submitIf = "";
      let submitArr = [];
      let submitObj = {
        patientId: this.patientId,
        projectId: this.projectId,
        assessResult: this.count
      };
      this.loading = true;
      // console.log(submitObj);
      // console.log(this.questionArr);
      // 判断某一项是否为空
      for (let i in this.questionArr) {
        for (let j in this.questionArr[i].assessProjects) {
          if (
            this.questionArr[i].assessProjects[j].fliterNum == false ||
            this.questionArr[i].assessProjects[j].fliterNum == undefined
          ) {
            this.$message({
              type: "warning",
              showClose: true,
              message:
                "" +
                this.questionArr[i].assessProjects[j].projectName +
                "未进行评估"
            });
            console.log(this.loading)
            this.loading = false
            submitIf = false;
            return;
          } else {
            submitIf = true;
            for (let k in this.questionArr[i].assessProjects[j]
              .projectConditions) {
              if (
                this.questionArr[i].assessProjects[j].projectConditions[k]
                  .assessScore == this.questionArr[i].assessProjects[j].number
              ) {
                submitArr.push({
                  assessProjectId: this.questionArr[i].assessProjects[j]
                    .projectConditions[k].assessProjectId,
                  assessConditionId: this.questionArr[i].assessProjects[j]
                    .projectConditions[k].assessConditionId,
                  patientId: this.patientId
                });
              }
            }
          }
        }
      }
      // console.log(submitArr);
      let params = {
        assessProjectRecords: submitArr,
        assessRecord: submitObj
      };
      // 提交保存
      addAss(params)
        .then(response => {
          this.$message({
            type: "success",
            showClose: true,
            message: "提交成功"
          });
          this.$forceUpdate(); //强制页面进行刷新
          // if (this.count > 3) {
          //   let flowName = Number(this.flowName);
          //   let specificStepId = 3;
          //   putObj(flowName, _this.operationData.id, specificStepId);
          //   this.NewPatient[5].flag = true;
          // }
          if (this.operationData.specificStepId.indexOf(2) == -1) {
            let flowName = Number(this.flowName);
            let specificStepId = 2;
            putObj(flowName, _this.operationData.id, specificStepId).then(
              data => {}
            );
          }
          this.dialogVisible = false;
          this.loading = false;
          this.NewPatient[3].flag = true;
          this.getList();
        })
        .catch(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.dialog-footer {
  width: 90%;
}
.clearfix:after {
  content: "";
  display: block;
  clear: both;
}
.assTable {
  margin-top: 20px;
}
.panel-heading {
  padding: 10px 15px;
  border-bottom: 1px solid transparent;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border-color: #ddd;
}
.panel-title {
  font-size: 16px;
  font-weight: 600;
  float: left;
}
.perinfo {
  line-height: 30px;
  font-size: 12px;
  float: right;
}
.patient_name {
  margin-top: 5px;
  margin-left: 1%;
}
.ActBtn {
  background: #409eff !important;
  color: #fff !important;
  text-align: center;
}
.patientBtn {
  text-align: center;
  overflow: hidden;
}
#basic-table {
  width: 96%;
  margin-left: 2%;
  border: 1px solid #ddd;
}
#basic-table td,
#basic-table th {
  // line-height: 30px;
  width: 115px;
  height: 65px;
  padding: 0;
  border: 1px solid #ddd;
  // text-align: center;
  // vertical-align: middle;
}
.content {
  margin-top: 20px;
  text-align: center;
}
.submit {
  background: #409eff !important;
  color: #fff !important;
  text-align: center;
}
.combined {
  display: inline-block;
  width: 24%;
  margin-right: 33%;
}
.total {
  display: inline-block;
  width: 9.4%;
  margin-left: 33.4%;
}
#input {
  width: 15%;
}
#typeTd {
  width: 20%;
}
@media screen and (max-width: 1024px) {
  .main {
    width: 830px;
  }
}
@media screen and (max-width: 768px) {
  .main {
    width: 600px;
  }
}
.td_span {
  // display: inline-block;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 65px;
  // height: 100%;

  overflow: hidden;
}
.avue-tags__menu {
  line-height: 40px;
  padding-right: 10px;
  margin-top: 18px;
  margin-right: 1%;
  z-index: 900;
}

.el-dropdown-menu {
  width: 100px;
  // height: 250px;

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