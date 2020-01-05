
<template>
  <!-- 跌倒坠床 -->
  <div class="execu">
    <basic-container>
      <div class="execu">
        <table class="occupation">
          <tr>
            <th rowspan="2">一、基本资料</th>
            <td>
              <span>床号</span>
              <el-input disabled v-model="form.bedCode"></el-input>
            </td>
            <td>
              <span>姓名</span>
              <el-input disabled v-model="form.patientName"></el-input>
            </td>
            <td>
              <span>年龄</span>
              <el-input disabled v-model="form.patientAge"></el-input>
            </td>
            <td>
              <span style="margin-left:2px">住院号</span>
              <el-input disabled v-model="form.admissionNumber"></el-input>
            </td>
          </tr>
          <tr>
            <td>
              <span>科室</span>
              <el-input disabled v-model="form.deptName"></el-input>
            </td>
            <td colspan="3">
              <span>诊断</span>
              <el-input disabled v-model="form.patientDiagnose"></el-input>
            </td>
          </tr>

          <tr>
            <th>二、主要照顾者</th>
            <td colspan="4">
              <el-radio-group v-model="form.mainMinder" :disabled="flagnum == 3">
                <el-radio style="margin-left:10px" :label="0">家属及亲友</el-radio>
                <el-radio :label="1">护工</el-radio>
                <el-radio :label="2">其他</el-radio>
                <el-radio :label="3">无</el-radio>
              </el-radio-group>
            </td>
          </tr>

          <tr>
            <th>三、发生时间</th>
            <td colspan="4">
              <el-date-picker
                @change="compareTime(2)"
                :disabled="flagnum == 3"
                v-model="form.occurrenceTime"
                type="datetime"
                placeholder="选择日期时间"
                align="right"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm:ss"
                :picker-options="pickerOptions1"
              ></el-date-picker>
            </td>
          </tr>

          <tr>
            <th>四、发生地点</th>
            <td colspan="4">
              <el-radio-group v-model="form.occurrenceAddress" :disabled="flagnum == 3">
                <el-radio style="margin-left:10px" :label="0">病人单元</el-radio>
                <el-radio :label="1">浴室厕所</el-radio>
                <el-radio :label="2">走廊</el-radio>
                <el-radio :label="3">其他</el-radio>
              </el-radio-group>
            </td>
          </tr>

          <tr>
            <th>五、跌倒(坠床)原因:</th>
            <td colspan="4">
              <div>
                <el-checkbox
                  v-model="form.fallPatientReason"
                  :disabled="flagnum == 3"
                  style="margin-left:10px"
                >病人健康因素：</el-checkbox>
                <el-input
                  :disabled="form.fallPatientReason == false || flagnum == 3 "
                  v-model="form.fallPatientReasonRemarks"
                ></el-input>
              </div>
              <el-checkbox
                :disabled="flagnum == 3"
                v-model="form.fallMedicalReason"
                style="margin-left:10px"
              >医疗因素：外科治疗、药物治疗、麻醉治疗等</el-checkbox>
              <el-checkbox
                :disabled="flagnum == 3"
                v-model="form.fallEnvironmentReason"
              >环境因素：地面滑、障碍物等</el-checkbox>
              <div>
                <el-checkbox
                  :disabled="flagnum == 3"
                  v-model="form.fallOtherReason"
                  style="margin-left:10px"
                >其他因素：</el-checkbox>
                <el-input
                  :disabled="form.fallOtherReason == false || flagnum == 3 "
                  v-model="form.fallOtherReasonRemarks"
                ></el-input>
              </div>
            </td>
          </tr>

          <tr>
            <th>六、跌倒(坠床)引起的外伤</th>
            <td colspan="4">
              <el-radio
                :disabled="flagnum == 3"
                style="margin-top:10px;margin-left:10px"
                :label="0"
                v-model="form.fallCauseTrauma"
                @change="noFallCauseTrauma"
              >无</el-radio>
              <el-radio
                :disabled="flagnum == 3"
                style="margin-top:10px"
                :label="1"
                v-model="form.fallCauseTrauma"
              >有（如有外伤，请继续回答以下题目）</el-radio>
              <br />
              <el-radio-group
                :disabled="form.fallCauseTrauma == 0 || flagnum == 3 "
                style="margin-left:10px"
                v-model="form.fallCauseTraumaLevel"
              >
                <el-radio
                  style="margin-top:10px"
                  :label="2"
                >第一级外伤：挫伤、擦伤、小范围的皮肤撕裂伤或撕裂伤只需要观察、不需要或需少许照顾</el-radio>
                <el-radio style="margin-top:10px" :label="3">
                  第二级外伤：扭伤、大的火深的裂伤、皮肤撕裂伤需要医疗及（或）护理处理包括伤
                  口缝合、绷带使用、托板固定或冰枕使用
                </el-radio>
                <el-radio style="margin-top:10px" :label="4">第三级外伤：骨折、意识丧失、精神改变或生理状况需医疗介入或鉴定。</el-radio>
              </el-radio-group>
            </td>
          </tr>
          <tr>
            <th>七、共计跌倒(坠床)次数</th>
            <td colspan="4">
              <el-input-number :disabled="flagnum == 3" v-model="form.totalFallNum"></el-input-number>
            </td>
          </tr>
          <tr>
            <th>八、处理情况：</th>
            <td colspan="3">
              <el-input :disabled="flagnum == 3" v-model="form.handlingInformation" type="textarea"></el-input>
            </td>
            <td>
              <span>护士签名</span>
              <el-input :disabled="flagnum == 3" style="width:70%" v-model="form.nurseName"></el-input>
            </td>
          </tr>
          <tr>
            <th rowspan="3">九、事件讨论：</th>
            <td style="text-align:center" :disabled="flagnum == 3">讨论时间</td>
            <td>
              <el-date-picker
                @change="compareTime(1)"
                :disabled="flagnum == 3"
                v-model="form.discussionTime"
                type="datetime"
                placeholder="选择日期时间"
                align="right"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm:ss"
                :picker-options="pickerOptions1"
              ></el-date-picker>
            </td>
            <td style="text-align:center">主持人</td>
            <td>
              <el-input :disabled="flagnum == 3" v-model="form.questionMaster"></el-input>
            </td>
          </tr>
          <tr>
            <td style="text-align:center">讨论记录</td>
            <td colspan="3">
              <el-input :disabled="flagnum == 3" v-model="form.discussionRecord" type="textarea"></el-input>
            </td>
          </tr>
          <tr>
            <td style="text-align:center">参与人员</td>
            <td colspan="3">
              <el-input :disabled="flagnum == 3" v-model="form.participantName" type="textarea"></el-input>
            </td>
          </tr>
        </table>
        <div
          style="margin-top:30px;text-align:center;margin-bottom:30px"
          slot="footer"
          class="dialog-footer"
        >
          <el-button :disabled="flagnum == 3" type="primary" @click="SubClick">保 存</el-button>
          <el-button @click="goBack">返 回</el-button>
        </div>
      </div>
    </basic-container>
  </div>
</template>

<script>
import {
  addObj,
  UpdateObj,
  putFlow,
  getDesk,
  getMatronInfo
} from "@/api/icu/assessment/fallSdrop";

import { mapGetters } from "vuex";
import { isNumber } from "@/util/validate";

export default {
  name: "fallSdrop",
  props: {
    flagnum: {
      type: Number
    },
    changeflag: {
      type: Function
    },
    changeflagTwo: {
      type: Function
    },
    patientInfo: {
      type: Object
    },
    sub: {
      type: Function
    },
    messages: {
      type: Object
    },
    changeflagpage: {
      type: Function
    },
    flowDateId: {
      type: Number
    }
  },
  data() {
    return {
      form: {
        deptName: "",
        bedCode: "",
        patientName: "",
        patientAge: "",
        admissionNumber: "",
        patientDiagnose: "",
        mainMinder: "",
        occurrenceTime: "",
        occurrenceAddress: "",
        fallPatientReason: "", //跌倒原因
        fallPatientReasonRemarks: "",
        fallMedicalReason: "",
        fallEnvironmentReason: "",
        fallOtherReason: "",
        fallOtherReasonRemarks: "",
        fallCauseTrauma: "",
        fallCauseTraumaLevel: "",
        totalFallNum: "",
        handlingInformation: "",
        nurseName: "",
        discussionTime: "",
        questionMaster: "",
        discussionRecord: "",
        participantName: "",
        patientId: ""
      },
      patientsList: [],
      searchForm: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      tableLoading: false,
      // tableOption: tableOption,
      pickerOptions1: {
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
      info: {},
      DeskList: []
    };
  },
  computed: {
    ...mapGetters([
      "permissions",
      "nurse_patients",
      "dep_patients",
      "userInfo"
    ]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permissions.icu_nurse_add, false),
        delBtn: this.vaildData(this.permissions.icu_nurse_del, false),
        editBtn: this.vaildData(this.permissions.icu_nurse_edit, false)
      };
    }
  },
  created() {
    //3 查看 2 修改 1 新增
    if (this.flagnum == 6) {
      this.form.patientId = this.messages.patientId;
      this.form.patientName = this.messages.name;
      this.form.admissionNumber = this.messages.hospitalnumber;
      this.form.patientDiagnose = this.messages.diagnosis;
      this.form.patientAge = this.messages.age;
      this.form.bedCode = this.messages.bedCode;
    }

    if (this.flagnum == 1) {
      this.form.patientId = this.patientInfo.patientId;
      this.form.patientName = this.patientInfo.name;
      this.form.patientAge = this.patientInfo.age;
      this.form.admissionNumber = this.patientInfo.hospitalnumber;
      this.form.patientDiagnose = this.patientInfo.diagnosis;
      this.form.bedCode = this.patientInfo.bedCode;
    }
    if (this.flagnum == 2 || this.flagnum == 3) {
      this.form = this.patientInfo;
      this.form.mainMinder = parseInt(this.form.mainMinder);
      this.form.occurrenceAddress = parseInt(this.form.occurrenceAddress);
      let patientId = this.form.patientId;
      for (let i in this.form) {
        if (this.form[i] === "true" || this.form[i] === "false") {
          this.form[i] = Boolean(this.form[i]);
        }
        if (isNumber(this.form[i])) {
          this.form[i] = parseInt(this.form[i]);
        }
      }
      this.form.patientId = patientId;
      console.log(this.form);
    }

    getMatronInfo().then(res => {
      this.info = res.data.data;
      getDesk().then(res => {
        this.DeskList = res.data.data;
        for (var i in this.DeskList) {
          if (this.info.deptId == this.DeskList[i].deptId) {
            this.form.deptName = this.DeskList[i].name;
          }
        }
      });
    });
  },
  methods: {
    //讨论时间 发生时间比较
    compareTime(flag) {
      if (this.form.discussionTime != "" && this.form.occurrenceTime != "") {
        if (this.form.discussionTime < this.form.occurrenceTime) {
          this.$message({
            showClose: true,
            message: "讨论时间超过发生时间",
            type: "warning"
          });
          if (flag == 2) {
            this.form.occurrenceTime = "";
          } else {
            this.form.discussionTime = "";
          }
        }
      }
    },

    noFallCauseTrauma() {
      this.form.fallCauseTraumaLevel = "";
    },
    //点击保存
    SubClick() {
      if (this.flagnum == 1) {
        addObj(this.form).then(res => {
          this.$message({
            showClose: true,
            message: "添加成功",
            type: "success"
          });
        });
        if (this.changeflag == undefined) {
          this.changeflagTwo(this.patientInfo);
        } else {
          this.changeflag(this.patientInfo);
        }
      }
      if (this.flagnum == 2) {
        UpdateObj(this.form).then(res => {
          this.$message({
            showClose: true,
            message: "修改成功",
            type: "success"
          });
        });
        if (this.changeflag == undefined) {
          this.changeflagTwo(this.patientInfo);
        } else {
          this.changeflag(this.patientInfo);
        }
      }

      //患者中心 跳过确定
      if (this.flagnum == 6) {
        addObj(this.form).then(res => {
          this.$message({
            showClose: true,
            message: "添加成功",
            type: "success"
          });
          this.changeflagpage(5);
          let params = {
            id: this.flowDateId,
            specificStepId: 7
          };
          putFlow(params).then(res => {});
          this.sub()
          this.form = {};
        });
      }
    },
    //点击返回
    goBack() {
      console.log(this.flagnum);
      if (this.flagnum == 3 || this.flagnum == 2 || this.flagnum == 1) {
        this.form = {};
        if (this.changeflag == undefined) {
          this.changeflagTwo(this.patientInfo);
        } else {
          this.changeflag(this.patientInfo);
        }
      } else if (this.flagnum == 6) {
        this.changeflagpage(3);
      }
    }
    //取出护士相关信息
  }
};
</script>

<style lang="scss">
.execu {
  overflow-x: auto !important;
  .occupation {
    min-width: 1200px;
    width: 100%;

    th,
    td {
      border: 1px solid #ebeef5;
      line-height: 45px;
    }
    th {
      width: 15%;
    }
    td {
      width: 18%;
      > span {
        margin-left: 8px;
      }
    }
    .tdrow {
      text-align: center;
      vertical-align: middle;
    }
    .el-input {
      width: 80%;
    }
    input,
    textarea {
      border: none;
      border-radius: 0;
      border-bottom: 1px solid #dcdfe6;
    }
  }
}
</style>
