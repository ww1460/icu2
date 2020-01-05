<template>
  <!-- 压力性损伤评估监控表 -->
  <div>
    <div v-if="flag">
      <div class="monitoringTable">
        <el-container>
          <el-header>压力性损伤评估监控表</el-header>
        </el-container>
        <div class="flex">
          <p>
            <span>床号：</span>
            {{form.admissionBeds}}
          </p>
          <p>
            <span>姓名：</span>
            {{form.PatientName}}
          </p>
          <p>
            <span>性别：</span>
            {{form.gender | sex}}
          </p>
          <p>
            <span>年龄：</span>
            {{form.age}}
          </p>
          <p>
            <span>住院号：</span>
            {{form.hospitalnumber}}
          </p>
        </div>
        <div>
          <table class="table table-bordered">
            <thead>
              <tr style="background-color:#f5f7fa">
                <th rowspan="2">评分类型</th>
                <th rowspan="2">评分项目</th>
                <th :colspan=" range.length  ">分值</th>
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
                <td>{{i.projectName}}</td>
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
                <td>
                  <span
                    v-for="(j,index3) in i.projectConditions"
                    :key="index3"
                    v-if="j.assessScore == 4"
                    :class="['td_span',(j.selected == true?'ActBtn':'')]"
                    @click="getId($event,j.id,j.assessScore,i,j.selected)"
                  >{{j.assessCondition}}</span>
                </td>
                <td>{{i.number}}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr style="background-color:#f5f7fa;height: 65px">
                <td colspan="9">
                  合计：
                  <span class="total">{{ count}}</span>
                </td>
              </tr>
              <tr>
                <td :colspan="1">压⼒力力性损伤预防或处理理措施</td>
                <td :colspan="7" style="text-align: left;">
                  <div style="display:flex;flex-wrap:wrap;align-items:center">
                    <el-checkbox-group v-model="pressureDamageMeasure">
                      <el-checkbox
                        v-for="state in pressureDamageMeasures"
                        :label="state.value"
                        :key="state.value"
                      >{{state.label}}</el-checkbox>
                    </el-checkbox-group>
                    <p style="margin:0 15px;">
                      <span>
                        &nbsp;&nbsp; &nbsp;&nbsp;护⼠士签名:
                        <el-input style="width:120px"></el-input>
                      </span>
                    </p>
                  </div>
                </td>
              </tr>
              <tr>
                <td colspan="8">
                  <div style="text-align: left;">
                    是否有院外带⼊入压疮:
                    <span>(&nbsp;&nbsp;</span>
                    <el-radio-group>
                      <el-radio :label="0">是</el-radio>
                      <el-radio :label="1">否</el-radio>
                    </el-radio-group>
                    <span>&nbsp;&nbsp;)</span>
                    <span>
                      &nbsp;&nbsp; &nbsp;&nbsp;护⼠士签名:
                      <el-input style="width:120px"></el-input>
                    </span>
                  </div>
                </td>
              </tr>
              <tr>
                <td colspan="8" style="text-align: left;">
                  <div>
                    极⾼高危患者住院期间是否发⽣生压⼒力力性损伤:
                    <span>(&nbsp;&nbsp;</span>
                    <el-radio-group>
                      <el-radio :label="0">是</el-radio>
                      <el-radio :label="1">否</el-radio>
                    </el-radio-group>
                    <span>&nbsp;&nbsp;)</span> &nbsp;&nbsp; &nbsp;&nbsp;发⽣生时间:
                    <el-date-picker
                      type="datetime"
                      placeholder="选择⽇日期时间"
                      value-format="yyyy-MM-dd hh:mm:ss"
                    ></el-date-picker>&nbsp;&nbsp; &nbsp;&nbsp;护⼠士签名:
                    <el-input style="width:120px"></el-input>
                  </div>
                </td>
              </tr>
              <tr>
                <td colspan="8">
                  <div style="text-align: left;display:flex;flex-wrap: wrap;align-items:center">
                    压⼒力力性损伤转归情况:
                    <el-checkbox-group v-model="turnover">
                      <el-checkbox
                        v-for="state in turnovers"
                        :label="state.value"
                        :key="state.value"
                        style="top:0"
                      >{{state.label}}</el-checkbox>
                    </el-checkbox-group>&nbsp;&nbsp; &nbsp;&nbsp;其他:
                    <el-input style="width:120px"></el-input>
                    <p>
                      &nbsp;&nbsp;&nbsp;&nbsp;护⼠士签名:
                      <el-input style="width:120px"></el-input>
                    </p>
                  </div>
                </td>
              </tr>
              <tr>
                <td colspan="8">
                  <div style="text-align: left;display:flex;flex-wrap: wrap;align-items:center">
                    <p>
                      审核意⻅见，是否符合极⾼高危患者申报条件:
                      <span>(&nbsp;&nbsp;</span>

                      <el-radio-group>
                        <el-radio :label="0">符合</el-radio>
                        <el-radio :label="1">不不符合</el-radio>
                      </el-radio-group>&nbsp;&nbsp; &nbsp;&nbsp;备注:
                      <el-input style="width:120px"></el-input>
                      <span>&nbsp;&nbsp;)</span>
                    </p>
                    <p>
                      &nbsp;&nbsp; &nbsp;&nbsp;主管部⻔门签名:
                      <el-input style="width:120px"></el-input>
                    </p>
                    <p>
                      &nbsp;&nbsp; &nbsp;&nbsp;⽇日期:
                      <el-date-picker
                        type="datetime"
                        placeholder="选择⽇日期时间"
                        value-format="yyyy-MM-dd hh:mm:ss"
                      ></el-date-picker>
                    </p>
                    <p>
                      &nbsp;&nbsp; &nbsp;&nbsp;护⼠士签名:
                      <el-input style="width:120px"></el-input>
                    </p>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div class="monitoring" id="print">
          <div class="border">
            <div class="ql-container ql-snow">
              <div class="ql-editor">
                <div v-html="content"></div>
              </div>
            </div>
            <div
              style="display:flex;flex-wrap: wrap;justify-content: center;align-items:center;margin-top:50px"
            >
              <p style="width:50%;font-weight: 100;font-size: 18px;text-align:center">
                <span style>患者（患者家属）签字：</span>
                <span @click="auto('1')">
                  <img
                    :src="patientImg"
                    alt
                    width="100"
                    height="50"
                    style=" position: relative;top:10px"
                  />
                </span>
              </p>
              <p style="width:50%;font-weight: 100;font-size: 18px;text-align:center">
                <span style>与患者的关系：</span>
                <el-input style="width:150px"></el-input>
              </p>
              <p style="width:50%;font-weight: 100;font-size: 18px;text-align:center">
                <span>告知护士签名：</span>
                <span @click="auto('2')">
                  <img
                    :src="nurseImg"
                    alt
                    width="100"
                    height="50"
                    style=" position: relative;top:10px"
                  />
                </span>
              </p>
              <p
                style="width:50%;font-weight: 100;font-size: 18px;letter-spacing:5px;text-align:center"
              >
                <span style>时间：</span>
                {{year}}年{{month+1}}月{{day}}日
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="operation_top">
        <el-button @click="close()">返回</el-button>
        <el-button @click="sub()"  class="el-button el-button--primary">提交</el-button>
      </div>
    </div>
    <div v-if="!flag">
      <autograph />
    </div>
  </div>
</template>

<script>
import autograph from "@/views/icu/patient/components/autograph";
import { getEch, getAssess, addAss } from "@/api/icu/assessment/APACHE.js";
import { informedDocuments } from "@/api/icu/matron/document/docManage";
export default {
  name: "monitoringTable",
  props: {
      message: Object
   },
   watch: {
      message: {
         handler(newValue, oldValue) {
            this.close()
         }
      }
   },
  components: {
    autograph
  },
  data() {
    return {
      flag: true,
      patientImg: "",
      nurseImg: "",
      data: "",
      name: "",
      gender: "",
      // result: "",

      question: "临床表现",
      count: null,
      questionArr: [],
      // 总分
      falg: {},
      projectCode: "Braden",
      projectId: "",
      min: "",
      max: "",
      range: [],
      rangeIf: true,
      // 合计
      combined: 0,
      total: [],
      // 患者
      patName: "",
      patientNames: [],
      pressureDamageMeasures: [
        { label: "加强营养", value: 1 },
        { label: "加强锻炼", value: 2 },
        { label: "按时更换体位", value: 3 },
        { label: "及时清除排泄物", value: 4 },
        { label: "保持床单元干燥、无碎屑", value: 5 },
        { label: "换药", value: 6 }
      ],
      pressureDamageMeasure: [],
      //  压力性损伤转归情况：
      turnovers: [
        { label: "治愈", value: 1 },
        { label: "好转", value: 2 },
        { label: "未愈", value: 3 }
      ],
      turnover: [],
      form: {
        admissionBeds: "",
        PatientName: "",
        gender: "",
        age: "",
        hospitalnumber: "",
        patientId: ""
      },
      content: ""
    };
  },
  created() {
    this.year = new Date().getFullYear();
    this.month = new Date().getMonth();
    this.day = new Date().getDate();
    this.parameterIf();
    this.form.patientName = this.$parent.patient.name;
    this.form.gender = this.$parent.patient.gender;
    this.form.hospitalnumber = this.$parent.patient.hospitalnumber;
    this.form.age = this.$parent.patient.age;
    this.form.patientId = this.$parent.patientId;
  },
  methods: {
    parameterIf() {
      // console.log(this.$parent.patientInfo)
      // this.patientNames.push(this.$parent.patientInfo);
      // this.patInfo = this.$parent.patientInfo;
      this.patName = this.$parent.patientId;
      this.getList();
      informedDocuments("YLXSSPGJKB")
        .then(response => {
         //  console.log(response);
          this.content = response.data.data[0].writContent;
        })
        .catch(() => {
          // alert("请求失败");
        });
    },
    close() {
      this.$parent.returnMethod();
    },
    sub() {},
    // 签名
    auto(data) {
      this.flag = false;
      if (data == "1") {
        this.data = data;
      } else if (data == "2") {
        this.data = data;
      }
    },
    return(img) {
      this.flag = true;
      this.img = img;
      if (this.data == "1") {
        this.patientImg = img;
      } else if (this.data == "2") {
        this.nurseImg = img;
      }
    },
    patientNameClick(patientName, id, patientId, item) {
      this.patName = patientId;
      this.patInfo = item.patient;
      this.getList();
    },
    patientIdChange(patName) {
      // console.log(this.patName)

      //  this.patInfo=item
      this.getList();
      for (let i in this.patientNames) {
        if (patName == this.patientNames[i].patientId) {
          this.patInfo = this.patientNames[i];
        }
      }
    },
    getList() {
      this.count = null;
      let params = {
        patientId: this.patName,
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
            if (this.questionArr[i].assessProjects[j].pitchOnId == null) {
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
      getEch(params).then(response => {
        // console.log(response.data.data);
        this.AssessData = response.data.data;
        // console.log(this.AssessData)
        // this.AssessData=[]
        this.AssessTime = [];
        this.AssessCount = [];
        for (let i in this.AssessData) {
          this.AssessTime.push(this.AssessData[i].createTime);
          this.AssessCount.push(this.AssessData[i].assessResult);
        }
        // console.log(this.AssessTime);
        // console.log(this.AssessCount);
        // this.broken();
      });
    },
    // 条件点击
    getId(e, id, score, items, index) {
      for (var i in items.projectConditions) {
        if (items.projectConditions[i].id == id) {
          if (items.projectConditions[i].selected == true) {
            items.projectConditions[i].selected = false;
            this.count = this.count - items.number;
            if (this.count === 0) {
              this.count = null;
            }
            items.fliterNum = false;
            items.number = null;
          } else {
            items.projectConditions[i].selected = true;
            items.fliterNum = true;
            if (items.number == null) {
            } else {
              this.count = this.count - items.number;
            }

            items.number = score;
            this.count += items.number;
          }
        } else {
          items.projectConditions[i].selected = false;

          // }
        }
      }
      this.$forceUpdate();
    }
  },
  filters: {
    sex: data => {
      switch (data) {
        case "0":
          return "女";

        case "1":
          return "男";

        default:
      }
    }
  }
};
</script>
<style  lang="scss">
.monitoringTable .operation_top {
  text-align: center;
  padding: 50px 0;
  background-color: #fff !important;
}

.monitoringTable .operation_top button:last-child {
  margin-left: 30px;
}
.monitoringTable .el-header {
  text-align: center;
  line-height: 60px;
  font-size: 24px;
}
.monitoringTable .table-bordered th,
.monitoringTable .table-bordered td,
.monitoringTable .table-bordered tr {
  border: 1px solid #ebeef5;
  text-align: center;
  // padding:0 10px;
  span {
    font-size: 14px;
  }
  div {
    margin: 15px 15px;
  }
}
.monitoringTable .flex {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 10px 10px;
  p {
    width: 15%;
  }
}
.monitoringTable .active {
  background: #409eff !important;
  color: #fff !important;
}
.monitoringTable .el-checkbox {
  margin: 15px;
  position: relative;
  top: 10px;
}
.monitoringTable {
  .el-input__inner {
    border-top: 0;
    border-left: 0;
    border-right: 0;
    border-radius: 0;
  }
}

.monitoring .border {
  padding: 30px;
  border: 1px solid #f0f2f5;
  border-top: 0px;
}
.monitoring p {
  line-height: 35px;
}
.monitoring .span {
  font-weight: 600;
}
.monitoring .span1 {
  font-size: 20px;
  font-weight: 600;
}
.monitoring .span2 {
  font-size: 16px;
  font-weight: 600;
}
.clearfix:after {
  content: "";
  display: block;
  clear: both;
}
.monitoringTable .panel-heading {
  padding: 10px 15px;
  border-bottom: 1px solid transparent;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border-color: #ddd;
}
.monitoringTable .panel-title {
  font-size: 16px;
  font-weight: 600;
  float: left;
}
.monitoringTable .perinfo {
  margin-right: 15px;
  line-height: 30px;
  font-size: 12px;
  float: right;
}
.monitoringTable .patient_name {
  margin-top: 5px;
  margin-left: 1%;
}
.monitoringTable .ActBtn {
  background: #409eff !important;
  color: #fff !important;
  text-align: center;
}
.monitoringTable .patientBtn {
  text-align: center;
  overflow: hidden;
}
.monitoringTable .content {
  margin-top: 20px;
  text-align: center;
}
.monitoringTable .submit {
  background: #409eff !important;
  color: #fff !important;
  text-align: center;
}
.monitoringTable .combined {
  display: inline-block;
  width: 24%;
  margin-right: 33%;
}
.monitoringTable .total {
  display: inline-block;
  width: 9.4%;
  margin-left: 33.4%;
}
.monitoringTable #input {
  width: 15%;
}
.monitoringTable #typeTd {
  width: 20%;
}
@media screen and (max-width: 1024px) {
  .monitoringTable .main {
    width: 830px;
  }
}
@media screen and (max-width: 768px) {
  .monitoringTable .main {
    width: 600px;
  }
}
.monitoringTable .td_span {
  // display: inline-block;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 65px;
  // height: 100%;

  overflow: hidden;
}
#print {
  .ql-container.ql-snow {
    border: 0px !important;
    padding: 0px !important;
  }
  .ql-align-center {
    text-align: center;
  }
  .el-table__fixed-right::before, .el-table__fixed::before{
    height: 0;
  }
}
</style>

