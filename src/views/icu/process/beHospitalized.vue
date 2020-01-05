
<template>
  <el-dialog
    title="患者评估"
    :visible.sync="evaluation"
    @close="evaluationCancel"
    :destroy-on-close="true"
    :fullscreen="isFullscreen"
    class="conflict"
    width="70%"
  >
    <!-- 入科评估 -->
    <div class="panel panel-default">
      <div class="form">
        <div style="overflow-x: auto;" class="PreDeclaration">
          <table class="table table-bordered">
            <tbody>
              <tr>
                <td>姓 名: {{patInfo.name}}</td>
                <td>性 别: {{patInfo.gender == 1?'男':'女'}}</td>
                <td>年 龄: {{patInfo.age}}</td>
              </tr>
              <tr>
                <td>床 号: {{this.rowBadName==''?patInfo.bedName:rowBadName}}</td>
                <td>住 院 号: {{patInfo.hospitalnumber}}</td>
                <td>入 院 时 间: {{patInfo.timeOfAdmission}}</td>
              </tr>
              <tr>
                <td colspan="3">基本信息</td>
              </tr>
              <tr class="left">
                <td colspan="3">
                  <div class="inlineBlock">
                    <span class="marginRight">入科时间:&nbsp;</span>
                    <el-date-picker
                      v-model="patInfo.entranceTime"
                      type="datetime"
                      placeholder="选择日期时间"
                      class="marginRight width"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      :picker-options="pickerOptions"
                      disabled
                    ></el-date-picker>
                  </div>
                  <div class="inlineBlock">
                    <span class="marginRight">入科诊断:&nbsp;</span>
                    <el-input
                      v-model="ruleForm.entranceDiagnose"
                      disabled
                      class="marginRight width"
                    ></el-input>
                  </div>
                  <!-- <div class="inlineBlock">
                    <span class="marginRight">入科途径:&nbsp;</span>
                    <el-input v-model="ruleForm.entrancePathway" class="marginRight width"></el-input>
                  </div>-->
                  <div class="inlineBlock">
                    <span class="marginRight">联系电话:&nbsp;</span>
                    <el-input v-model="ruleForm.patientPhone" disabled class="marginRight width"></el-input>
                  </div>
                  <div class="inlineBlock">
                    <span class="marginRight" style="display:inline-block;width:64px;">地址:&nbsp;</span>
                    <el-input v-model="ruleForm.patientAddress" disabled class="marginRight width"></el-input>
                  </div>
                </td>
              </tr>
              <tr class="left">
                <td colspan="3" style="padding:10px 15px ">
                  <span class="marginRight span100 fontSize">资料来源:&nbsp;</span>
                  <el-checkbox-group v-model="ruleForm.dataSource" @change="typeDis">
                    <el-checkbox label="患者" name="dataSource"></el-checkbox>
                    <el-checkbox label="家属" name="dataSource"></el-checkbox>
                    <el-checkbox label="知情者" name="dataSource"></el-checkbox>
                    <el-checkbox label="各种资料" name="dataSource"></el-checkbox>
                    <el-checkbox label="护理资料" name="dataSource"></el-checkbox>
                    <el-checkbox label="其他" name="dataSource" class="marginRight"></el-checkbox>
                    <el-input
                      placeholder="请输入其他来源"
                      style="width:200px"
                      v-model="ruleForm.dataSourceRemarks"
                      :disabled="typeDisabled"
                    ></el-input>
                  </el-checkbox-group>
                </td>
              </tr>
              <tr class="left">
                <td colspan="3" style="padding:10px 15px ">
                  <span class="marginRight span100 fontSize">既往史:</span>
                  <el-checkbox-group v-model="ruleForm.previousHistory" @change="medicalDis">
                    <el-checkbox label="无" name="previousHistory"></el-checkbox>
                    <el-checkbox label="神经系统疾病" name="previousHistory"></el-checkbox>
                    <el-checkbox label="视觉问题" name="previousHistory"></el-checkbox>
                    <el-checkbox label="甲状腺问题" name="previousHistory"></el-checkbox>
                    <el-checkbox label="肺病" name="previousHistory"></el-checkbox>
                    <el-checkbox label="心脏病" name="previousHistory"></el-checkbox>
                    <el-checkbox label="高血压" name="previousHistory"></el-checkbox>
                    <el-checkbox label="糖尿病" name="previousHistory"></el-checkbox>
                    <el-checkbox label="胃病" name="previousHistory"></el-checkbox>
                    <el-checkbox label="肝脏疾病" name="previousHistory"></el-checkbox>
                    <el-checkbox label="肾脏疾病" name="previousHistory"></el-checkbox>
                    <el-checkbox label="癌症" name="previousHistory"></el-checkbox>
                    <el-checkbox label="听力问题" name="previousHistory"></el-checkbox>
                    <el-checkbox label="其他" name="previousHistory" class="marginRight"></el-checkbox>
                    <el-input
                      placeholder="请输入其他既往史"
                      style="width:200px"
                      v-model="ruleForm.previousHistoryRemarks"
                      :disabled="medicalDisabled"
                    ></el-input>
                  </el-checkbox-group>
                </td>
              </tr>
              <tr class="left">
                <td colspan="3" style="padding:10px 15px ">
                  <span class="marginRight span100 fontSize">家族史:</span>
                  <el-checkbox-group v-model="ruleForm.familyHistory" @change="familyDis">
                    <el-checkbox label="无异常发现" name="familyHistory"></el-checkbox>
                    <el-checkbox label="心脏病" name="familyHistory"></el-checkbox>
                    <el-checkbox label="高血压" name="familyHistory"></el-checkbox>
                    <el-checkbox label="糖尿病" name="familyHistory"></el-checkbox>
                    <el-checkbox label="中风" name="familyHistory"></el-checkbox>
                    <el-checkbox label="肝脏疾病" name="familyHistory"></el-checkbox>
                    <el-checkbox label="肾脏疾病" name="familyHistory"></el-checkbox>
                    <el-checkbox label="癌症" name="familyHistory"></el-checkbox>
                    <el-checkbox label="其他" name="familyHistory" class="marginRight"></el-checkbox>
                    <el-input
                      placeholder="请输入其他家族史"
                      style="width:200px"
                      v-model="ruleForm.familyHistoryRemarks"
                      :disabled="familyDisabled"
                    ></el-input>
                  </el-checkbox-group>
                </td>
              </tr>
              <tr class="left">
                <td colspan="3" style="padding:10px 15px ">
                  <p class="marginRight span100 fontSize">过敏史:</p>
                  <div style="padding-left:10px">
                    <span class="marginRight span110">过敏药物:</span>
                    <el-checkbox-group
                      v-model="ruleForm.drugAllergy"
                      style="display:inline"
                      @change="drugDis"
                    >
                      <el-checkbox label="否认" name="drugAllergy"></el-checkbox>
                      <el-checkbox label="青霉素" name="drugAllergy"></el-checkbox>
                      <el-checkbox label="头孢" name="drugAllergy"></el-checkbox>
                      <el-checkbox label="磺胺类" name="drugAllergy"></el-checkbox>
                      <el-checkbox label="其他" name="drugAllergy" class="marginRight"></el-checkbox>
                      <el-input
                        placeholder="请输入其他过敏药物"
                        style="width:200px"
                        v-model="ruleForm.drugAllergyRemarks"
                        :disabled="drugDisabled"
                      ></el-input>
                    </el-checkbox-group>
                  </div>
                  <div style="padding-left:10px">
                    <span class="marginRight span110">过敏食物:</span>
                    <el-checkbox-group
                      v-model="ruleForm.allergenicFood"
                      style="display:inline"
                      @change="foodDis"
                    >
                      <el-checkbox label="否认" name="allergenicFood"></el-checkbox>
                      <el-checkbox label="海鲜" name="allergenicFood"></el-checkbox>
                      <el-checkbox label="蛋类" name="allergenicFood"></el-checkbox>
                      <el-checkbox label="牛奶" name="allergenicFood"></el-checkbox>
                      <el-checkbox label="其他" name="allergenicFood" class="marginRight"></el-checkbox>
                      <el-input
                        placeholder="请输入其他过敏食物"
                        style="width:200px"
                        v-model="ruleForm.allergenicFoodRemarks"
                        :disabled="foodDisabled"
                      ></el-input>
                    </el-checkbox-group>
                  </div>
                  <div style="padding-left:10px">
                    <span class="marginRight span110">其他过敏源:</span>
                    <el-checkbox-group
                      v-model="ruleForm.otherAllergens"
                      style="display:inline"
                      @change="allergicSourceDis"
                    >
                      <el-checkbox label="否认" name="otherAllergens"></el-checkbox>
                      <el-checkbox label="花粉" name="otherAllergens"></el-checkbox>
                      <el-checkbox label="冷空气" name="otherAllergens"></el-checkbox>
                      <el-checkbox label="螨虫" name="otherAllergens"></el-checkbox>
                      <el-checkbox label="动物皮毛" name="otherAllergens"></el-checkbox>
                      <el-checkbox label="粉尘" name="otherAllergens"></el-checkbox>
                      <el-checkbox label="其他" name="otherAllergens" class="marginRight"></el-checkbox>
                      <el-input
                        placeholder="请输入其他过敏源"
                        style="width:200px"
                        v-model="ruleForm.otherAllergensRemarks"
                        :disabled="allergicSourceDisabled"
                      ></el-input>
                    </el-checkbox-group>
                  </div>
                </td>
              </tr>
              <tr class="left">
                <td colspan="3" style="padding:10px 15px ">
                  <span class="marginRight span100 fontSize">皮肤情况:</span>
                  <el-checkbox-group v-model="ruleForm.skinCase" @change="skinDis">
                    <el-checkbox label="正常" name="skinCase"></el-checkbox>
                    <el-checkbox label="湿冷" name="skinCase"></el-checkbox>
                    <el-checkbox label="苍白" name="skinCase"></el-checkbox>
                    <el-checkbox label="潮红" name="skinCase"></el-checkbox>
                    <el-checkbox label="黄染" name="skinCase"></el-checkbox>
                    <el-checkbox label="脱水" name="skinCase"></el-checkbox>
                    <el-checkbox label="皮疹" name="skinCase"></el-checkbox>
                    <el-checkbox label="瘙痒" name="skinCase"></el-checkbox>
                    <el-checkbox label="破溃" name="skinCase"></el-checkbox>
                    <el-checkbox label="其他" name="skinCase" class="marginRight"></el-checkbox>
                    <el-input
                      placeholder="其他注明"
                      style="width:200px"
                      v-model="ruleForm.skinCaseRemarks"
                      :disabled="skinDisabled"
                    ></el-input>
                  </el-checkbox-group>
                </td>
              </tr>
              <tr class="left">
                <td colspan="3" style="padding:10px 15px ">
                  <div style="display:flex;align-items: center">
                    <span class="marginRight span120 fontSize">沟通有无障碍:</span>
                    <el-radio-group
                      v-model="ruleForm.communicationBarriers"
                      @change="communicationDis"
                      style="display:inline"
                    >
                      <el-radio label="无"></el-radio>
                      <el-radio label="有" class="marginRight"></el-radio>
                    </el-radio-group>
                    <el-select
                      placeholder="是否需要翻译"
                      v-model="ruleForm.communicationBarriersRemarks"
                      :disabled="translationDisabled"
                    >
                      <el-option label="是" value="是"></el-option>
                      <el-option label="否" value="否"></el-option>
                    </el-select>
                  </div>
                </td>
              </tr>
              <tr class="left">
                <td colspan="3" style="padding:10px 15px ">
                  <div style="display:flex;align-items: center">
                    <span class="marginRight span120 fontSize">治疗依从性:</span>
                    <el-radio-group v-model="ruleForm.treatmentCompliance" style="display:inline">
                      <el-radio label="良好"></el-radio>
                      <el-radio label="一般"></el-radio>
                      <el-radio label="差"></el-radio>
                    </el-radio-group>
                  </div>
                </td>
              </tr>
              <tr>
                <td colspan="3">社会评估</td>
              </tr>
              <tr class="left">
                <td colspan="3">
                  <div class="inlineBlock">
                    <span class="marginRight" style="display:inline-block;width:64px;">民族:</span>
                    <el-input v-model="ruleForm.patientNation" class="marginRight width"></el-input>
                  </div>
                  <div class="inlineBlock">
                    <span class="marginRight" style="display:inline-block;width:64px;">职业:</span>
                    <el-input v-model="ruleForm.patientProfession" class="marginRight width"></el-input>
                  </div>
                  <div class="inlineBlock">
                    <span class="marginRight">文化程度:&nbsp;</span>
                    <el-input v-model="ruleForm.patientCulture" class="marginRight width"></el-input>
                  </div>
                  <div class="inlineBlock">
                    <span class="marginRight">婚姻状况:&nbsp;</span>
                    <el-input v-model="ruleForm.patientMarriage" class="marginRight width"></el-input>
                  </div>
                  <div class="inlineBlock">
                    <span class="marginRight">居住状况:&nbsp;</span>
                    <el-input v-model="ruleForm.patientDwellingState" class="marginRight width"></el-input>
                  </div>
                  <div class="inlineBlock">
                    <span class="marginRight">费用来源:&nbsp;</span>
                    <el-input v-model="ruleForm.patientCostSource" class="marginRight width"></el-input>
                  </div>
                  <div class="inlineBlock">
                    <span class="marginRight">经济来源:&nbsp;</span>
                    <el-input v-model="ruleForm.patientEconomySource" class="marginRight width"></el-input>
                  </div>
                  <div class="inlineBlock">
                    <span class="marginRight">宗教信仰:&nbsp;</span>
                    <el-input v-model="ruleForm.patientReligionFaith" class="marginRight width"></el-input>
                  </div>
                  <div class="inlineBlock2">
                    <div
                      style="display: flex;flex-wrap: wrap;align-items: center;justify-content: start;"
                    >
                      <div>
                        <span class="marginRight span100">宗教需求:</span>
                        <el-radio-group
                          v-model="ruleForm.patientReligionDemand"
                          style="display:inline"
                          @change="religiousNeedsDis"
                        >
                          <el-radio label="无"></el-radio>
                          <el-radio label="素食"></el-radio>
                          <el-radio label="回族膳食"></el-radio>
                          <el-radio label="其他" class="marginRight"></el-radio>
                          <el-input
                            placeholder="请输入其他需求"
                            style="width:200px"
                            v-model="ruleForm.patientReligionDemandRemarks"
                            :disabled="religiousNeedsDisabled"
                          ></el-input>
                        </el-radio-group>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr class="left">
                <td colspan="3" style="padding:10px 15px ">
                  <div
                    style="display: flex;flex-wrap: wrap;align-items: center;justify-content: start;"
                  >
                    <span class="marginRight span100 fontSize">抽烟:</span>
                    <el-radio-group v-model="ruleForm.patientSmoke" @change="complianceDis">
                      <el-radio label="否认"></el-radio>
                      <el-radio label="已戒烟"></el-radio>
                      <el-radio label="抽烟:"></el-radio>
                    </el-radio-group>
                    <div>
                      <el-input
                        style="width:180px"
                        v-model="ruleForm.patientSmokeRemarks"
                        :disabled="complianceDisabled"
                      ></el-input>
                    </div>
                  </div>
                </td>
              </tr>
              <tr class="left">
                <td colspan="3" style="padding:10px 15px ">
                  <div
                    style="display: flex;flex-wrap: wrap;align-items: center;justify-content: start;"
                  >
                    <span class="marginRight span100 fontSize" style="float:left">饮酒:</span>
                    <el-radio-group v-model="ruleForm.patientDrink" @change="drinkingDis">
                      <el-radio label="否认"></el-radio>
                      <el-radio label="已戒酒"></el-radio>
                      <el-radio label="偶尔"></el-radio>
                      <el-radio label="经常:"></el-radio>
                    </el-radio-group>
                    <div>
                      <el-input
                        style="width:180px"
                        v-model="ruleForm.patientDrinkRemarks	"
                        :disabled="drinkingDisabled"
                      ></el-input>
                    </div>
                  </div>
                </td>
              </tr>
              <tr class="left">
                <td colspan="3" style="padding:10px 15px ">
                  <div style="display:flex;align-items: center;">
                    <span class="marginRight span100 fontSize">特殊人群:</span>
                    <el-radio-group
                      v-model="ruleForm.specialCrowd"
                      style="display:inline"
                      @change="specialDis"
                    >
                      <el-radio label="否"></el-radio>
                      <el-radio label="是" class="marginRight"></el-radio>
                    </el-radio-group>
                  </div>
                  <div class="specialPopulations">
                    <el-checkbox-group
                      v-model="ruleForm.specialCrowdRemarks"
                      style="display:inline"
                      :disabled="specialDisabled"
                    >
                      <el-checkbox class="elcheckbox1" label="年老/体弱者" name="specialCrowdRemarks"></el-checkbox>
                      <el-checkbox class="elcheckbox1" label="临终患者" name="specialCrowdRemarks"></el-checkbox>
                      <el-checkbox class="elcheckbox1" label="长期疼痛人群" name="specialCrowdRemarks"></el-checkbox>
                      <el-checkbox class="elcheckbox1" label="临产妇女" name="specialCrowdRemarks"></el-checkbox>
                      <el-checkbox class="elcheckbox1" label="终止妊娠的妇女" name="specialCrowdRemarks"></el-checkbox>
                      <el-checkbox
                        class="elcheckbox1"
                        label="情绪或精神絮乱的患者"
                        name="specialCrowdRemarks"
                      ></el-checkbox>
                      <el-checkbox class="elcheckbox1" label="吸毒人群" name="specialCrowdRemarks"></el-checkbox>
                      <el-checkbox class="elcheckbox1" label="醺酒人群" name="specialCrowdRemarks"></el-checkbox>
                      <el-checkbox class="elcheckbox1" label="受歧视、虐待人群" name="specialCrowdRemarks"></el-checkbox>
                      <el-checkbox class="elcheckbox1" label="传染性疾病患者" name="specialCrowdRemarks"></el-checkbox>
                      <el-checkbox
                        class="elcheckbox1"
                        label="正在接受放疗或化疗患者"
                        name="specialCrowdRemarks"
                      ></el-checkbox>
                      <el-checkbox class="elcheckbox1" label="免疫受抑患者" name="specialCrowdRemarks"></el-checkbox>
                      <el-checkbox class="elcheckbox1" label="青少年" name="specialCrowdRemarks"></el-checkbox>
                      <el-checkbox class="elcheckbox1" label="儿童" name="specialCrowdRemarks"></el-checkbox>
                    </el-checkbox-group>
                  </div>
                </td>
              </tr>
              <tr class="left">
                <td colspan="3" style="padding:10px 15px ">
                  <span class="marginRight span100 fontSize">社会支持:</span>
                  <el-checkbox-group
                    v-model="ruleForm.socialSupport"
                    style="display:inline"
                    @change="socialSupportDis"
                  >
                    <el-checkbox label="家属" name="socialSupport"></el-checkbox>
                    <el-checkbox label="朋友" name="socialSupport"></el-checkbox>
                    <el-checkbox label="同事" name="socialSupport"></el-checkbox>
                    <el-checkbox label="社会" name="socialSupport"></el-checkbox>
                    <el-checkbox label="其他" name="socialSupport" class="marginRight"></el-checkbox>
                    <el-input
                      style="width:200px"
                      v-model="ruleForm.socialSupportRemarks"
                      placeholder="请输入其他社会支持"
                      :disabled="socialSupportDisabled"
                    ></el-input>
                  </el-checkbox-group>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm" :loading="loading">保 存</el-button>
      <el-button @click="evaluationCancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  entranceAssessRecord,
  getByPatient,
  patientIdSelect,
  putObj,
  entranceAssessRecordUpdate
} from "@/api/icu/process/entryDepartment";
import { mapGetters, mapState } from "vuex";

export default {
  name: "child",
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      // 防重提交
      loading: false,
      isFullscreen: false,
      screenWidth: document.body.clientWidth, // 屏幕尺寸
      // 评估
      evaluation: false,

      // 资料来源其他input状态
      typeDisabled: true,
      // 是否需要翻译状态
      translationDisabled: true,
      // 既往史其他input状态
      medicalDisabled: true,
      // 家族史---状态
      familyDisabled: true,
      // 过敏药物---状态
      drugDisabled: true,
      // 过敏食物---状态
      foodDisabled: true,
      // 其他过敏源---状态
      allergicSourceDisabled: true,
      // 皮肤情况---状态
      skinDisabled: true,
      // 宗教需求---状态
      religiousNeedsDisabled: true,
      // 抽烟---状态
      complianceDisabled: true,
      // 饮酒---状态
      drinkingDisabled: true,
      // 特殊人群---是
      specialDisabled: true,
      // 社会支持---状态
      socialSupportDisabled: true,
      rowBadNames: "",
      // 患者
      patName: "",
      patientNames: [],
      patientName: "",
      patInfo: {},
      ruleForm: {
        // 诊断
        entranceDiagnose: "",
        // 途径
        entrancePathway: "",
        // 电话
        patientPhone: "",
        // 地址
        patientAddress: "",
        // 资料来源
        dataSource: [],
        // 资料来源其他
        dataSourceRemarks: "",
        // 沟通
        communicationBarriers: "",
        // 翻译
        communicationBarriersRemarks: "",
        // 既往史
        previousHistory: [],
        // 既往史其他
        previousHistoryRemarks: "",
        // 家族史
        familyHistory: [],
        // 家族史其他
        familyHistoryRemarks: "",
        // 过敏药物
        drugAllergy: [],
        // 过敏药物其他
        drugAllergyRemarks: "",
        // 过敏食物
        allergenicFood: [],
        // 过敏食物其他
        allergenicFoodRemarks: "",
        // 其他过敏源
        otherAllergens: [],
        // 其他过敏源其他
        otherAllergensRemarks: "",
        // 治疗依从性
        treatmentCompliance: "",
        // 皮肤情况
        skinCase: [],
        // 皮肤情况
        skinCaseRemarks: "",
        // 民族
        patientNation: "",
        // 职业
        patientProfession: "",
        // 文化程度
        patientCulture: "",
        // 婚姻状况
        patientMarriage: "",
        // 居住状况
        patientDwellingState: "",
        // 宗教信仰
        patientReligionFaith: "",
        // 宗教需求
        patientReligionDemand: "",
        // 宗教需求其他
        patientReligionDemandRemarks: "",
        // 费用来源
        patientCostSource: "",
        // 家庭经济来源
        patientEconomySource: "",
        // 抽烟
        patientSmoke: "",
        // 每日
        patientSmokeRemarks: "每日 支,已吸 年",
        // 饮酒
        patientDrink: "",
        // 每次
        patientDrinkRemarks: "每次 两,已喝 年",
        // 特殊人群单选
        specialCrowd: "",
        // 特殊人群多选
        specialCrowdRemarks: [],
        // 社会支持
        socialSupport: [],
        // 社会支持其他
        socialSupportRemarks: ""
      }
    };
  },
  props: {
    flowNames: Number,
    operationData: Object,
    NewPatient: Array,
    dataGetByPatient: Object,
    Hospitalized: Object,
    rowBadName: String,
    getalready: {
      type: Function,
      default: null
    },
    pageTwo: Object
  },
  computed: {},
  watch: {
    flowNames(val) {},
    operationData: {
      handler(newValue, oldValue) {
        this.operationData = newValue;
      },
      deep: true
    },
    NewPatient: {
      handler(newValue, oldValue) {
        this.NewPatient = newValue;
      },
      deep: true
    },
    dataGetByPatient: {
      handler(newValue, oldValue) {
        this.dataGetByPatient = newValue;
      },
      deep: true
    },
    Hospitalized: {
      handler(newValue, oldValue) {
        this.Hospitalized = newValue;
      },
      deep: true
    },
    pageTwo: {
      handler(newValue, oldValue) {
        this.pageTwo = newValue;
      },
      deep: true
    },
    rowBadName: {
      handler(newValue, oldValue) {
        this.rowBadName = newValue;
        this.rowBadNames = this.rowBadName;
      },
      deep: true
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
  created() {},
  methods: {
    // 患者信息
    patientInfo() {
      this.patInfo = this.Hospitalized;
      patientIdSelect(this.patInfo.patientId).then(data => {
        this.patInfo.bedName = data.data.data.bedName;
        this.ruleForm.entranceDiagnose = data.data.data.diagnosis;
        this.ruleForm.patientPhone = data.data.data.phone;
        this.ruleForm.patientAddress = data.data.data.currentAddressDetails;
      });
      this.$forceUpdate(); //强制页面进行刷新
    },
    // 判断input框是否可以点击
    // 资料来源
    typeDis() {
      if (this.ruleForm.dataSource != []) {
        if (this.ruleForm.dataSource.indexOf("其他") == -1) {
          this.typeDisabled = true;
          this.ruleForm.dataSourceRemarks = "";
        } else {
          this.typeDisabled = false;
        }
      } else {
        this.typeDisabled = true;
      }
    },
    // 沟通
    communicationDis() {
      if (this.ruleForm.communicationBarriers != null) {
        if (this.ruleForm.communicationBarriers.indexOf("有") == -1) {
          this.translationDisabled = true;
          this.ruleForm.communicationBarriersRemarks = "";
        } else {
          this.translationDisabled = false;
        }
      } else {
        this.translationDisabled = true;
      }
    },
    // 既往史
    medicalDis() {
      if (this.ruleForm.previousHistory.length >= 2) {
        for (const i in this.ruleForm.previousHistory) {
          if (i > 0) {
            if (this.ruleForm.previousHistory[i] == "无") {
              this.ruleForm.previousHistory = ["无"];
            }
          } else {
            if (this.ruleForm.previousHistory[0] == "无") {
              this.ruleForm.previousHistory.splice(0, 1);
            }
          }
        }
      }
      if (this.ruleForm.previousHistory != []) {
        if (this.ruleForm.previousHistory.indexOf("其他") == -1) {
          this.medicalDisabled = true;
          this.ruleForm.previousHistoryRemarks = "";
        } else {
          this.medicalDisabled = false;
        }
      } else {
        this.medicalDisabled = true;
      }
    },
    // 家族史
    familyDis() {
      if (this.ruleForm.familyHistory.length >= 2) {
        for (const i in this.ruleForm.familyHistory) {
          if (i > 0) {
            if (this.ruleForm.familyHistory[i] == "无异常发现") {
              this.ruleForm.familyHistory = ["无异常发现"];
            }
          } else {
            if (this.ruleForm.familyHistory[0] == "无异常发现") {
              this.ruleForm.familyHistory.splice(0, 1);
            }
          }
        }
      }
      if (this.ruleForm.familyHistory != []) {
        if (this.ruleForm.familyHistory.indexOf("其他") == -1) {
          this.familyDisabled = true;
          this.ruleForm.familyHistoryRemarks = "";
        } else {
          this.familyDisabled = false;
        }
      } else {
        this.familyDisabled = true;
      }
    },
    // 过敏药物
    drugDis() {
      if (this.ruleForm.drugAllergy.length >= 2) {
        for (const i in this.ruleForm.drugAllergy) {
          if (i > 0) {
            if (this.ruleForm.drugAllergy[i] == "否认") {
              this.ruleForm.drugAllergy = ["否认"];
            }
          } else {
            if (this.ruleForm.drugAllergy[0] == "否认") {
              this.ruleForm.drugAllergy.splice(0, 1);
            }
          }
        }
      }
      if (this.ruleForm.drugAllergy != []) {
        if (this.ruleForm.drugAllergy.indexOf("其他") == -1) {
          this.drugDisabled = true;
          this.ruleForm.drugAllergyRemarks = "";
        } else {
          this.drugDisabled = false;
        }
      } else {
        this.drugDisabled = true;
      }
    },
    // 过敏食物
    foodDis() {
      if (this.ruleForm.allergenicFood.length >= 2) {
        for (const i in this.ruleForm.allergenicFood) {
          if (i > 0) {
            if (this.ruleForm.allergenicFood[i] == "否认") {
              this.ruleForm.allergenicFood = ["否认"];
            }
          } else {
            if (this.ruleForm.allergenicFood[0] == "否认") {
              this.ruleForm.allergenicFood.splice(0, 1);
            }
          }
        }
      }
      if (this.ruleForm.allergenicFood != []) {
        if (this.ruleForm.allergenicFood.indexOf("其他") == -1) {
          this.foodDisabled = true;
          this.ruleForm.allergenicFoodRemarks = "";
        } else {
          this.foodDisabled = false;
        }
      } else {
        this.foodDisabled = true;
      }
    },
    // 其他过敏源
    allergicSourceDis() {
      if (this.ruleForm.otherAllergens.length >= 2) {
        for (const i in this.ruleForm.otherAllergens) {
          if (i > 0) {
            if (this.ruleForm.otherAllergens[i] == "否认") {
              this.ruleForm.otherAllergens = ["否认"];
            }
          } else {
            if (this.ruleForm.otherAllergens[0] == "否认") {
              this.ruleForm.otherAllergens.splice(0, 1);
            }
          }
        }
      }
      if (this.ruleForm.otherAllergens != []) {
        if (this.ruleForm.otherAllergens.indexOf("其他") == -1) {
          this.allergicSourceDisabled = true;
          this.ruleForm.otherAllergensRemarks = "";
        } else {
          this.allergicSourceDisabled = false;
        }
      } else {
        this.allergicSourceDisabled = true;
      }
    },
    // 皮肤情况
    skinDis() {
      if (this.ruleForm.skinCase.length >= 2) {
        for (const i in this.ruleForm.skinCase) {
          if (i > 0) {
            if (this.ruleForm.skinCase[i] == "正常") {
              this.ruleForm.skinCase = ["正常"];
            }
          } else {
            if (this.ruleForm.skinCase[0] == "正常") {
              this.ruleForm.skinCase.splice(0, 1);
            }
          }
        }
      }
      if (this.ruleForm.skinCase != []) {
        if (this.ruleForm.skinCase.indexOf("其他") == -1) {
          this.skinDisabled = true;
          this.ruleForm.skinCaseRemarks = "";
        } else {
          this.skinDisabled = false;
        }
      } else {
        this.skinDisabled = true;
      }
    },
    // 宗教需求
    religiousNeedsDis() {
      if (this.ruleForm.patientReligionDemand != null) {
        if (this.ruleForm.patientReligionDemand.indexOf("其他") == -1) {
          this.religiousNeedsDisabled = true;
          this.ruleForm.patientReligionDemandRemarks = "";
        } else {
          this.religiousNeedsDisabled = false;
        }
      } else {
        this.religiousNeedsDisabled = true;
      }
    },
    // 抽烟
    complianceDis() {
      if (this.ruleForm.patientSmoke != null) {
        if (this.ruleForm.patientSmoke.indexOf("抽烟") == -1) {
          this.complianceDisabled = true;
          this.ruleForm.patientSmokeRemarks = "每日 支,已吸 年";
        } else {
          this.complianceDisabled = false;
        }
      } else {
        this.complianceDisabled = true;
      }
    },
    // 饮酒
    drinkingDis() {
      if (this.ruleForm.patientDrink != null) {
        if (this.ruleForm.patientDrink.indexOf("经常:") == -1) {
          this.drinkingDisabled = true;
          this.ruleForm.patientDrinkRemarks = "每次 两,已喝 年";
        } else {
          this.drinkingDisabled = false;
        }
      } else {
        this.drinkingDisabled = true;
      }
    },
    // 特殊人群
    specialDis() {
      if (this.ruleForm.specialCrowd != null) {
        if (this.ruleForm.specialCrowd.indexOf("是") == -1) {
          this.specialDisabled = true;
          this.ruleForm.specialCrowdRemarks = [];
        } else {
          this.specialDisabled = false;
        }
      } else {
        this.specialDisabled = true;
      }
    },
    // 社会支持
    socialSupportDis() {
      if (this.ruleForm.socialSupport != null) {
        if (this.ruleForm.socialSupport.indexOf("其他") == -1) {
          this.socialSupportDisabled = true;
          this.ruleForm.socialSupportRemarks = "";
        } else {
          this.socialSupportDisabled = false;
        }
      } else {
        this.socialSupportDisabled = true;
      }
    },
    // 确定按钮
    confirm() {
      this.$confirm("是否保存评估", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        var _this = this;
        this.loading = true;
        let assessment = {
          patientId: this.operationData.patientId,
          allergenicFood: this.ruleForm.allergenicFood.join("-"),
          allergenicFoodRemarks: this.ruleForm.allergenicFoodRemarks,
          communicationBarriers: this.ruleForm.communicationBarriers,
          communicationBarriersRemarks: this.ruleForm
            .communicationBarriersRemarks,
          dataSource: this.ruleForm.dataSource.join("-"),
          dataSourceRemarks: this.ruleForm.dataSourceRemarks,
          drugAllergy: this.ruleForm.drugAllergy.join("-"),
          drugAllergyRemarks: this.ruleForm.drugAllergyRemarks,
          entranceDiagnose: this.ruleForm.entranceDiagnose,
          entrancePathway: this.ruleForm.entrancePathway,
          familyHistory: this.ruleForm.familyHistory.join("-"),
          familyHistoryRemarks: this.ruleForm.familyHistoryRemarks,
          otherAllergens: this.ruleForm.otherAllergens.join("-"),
          otherAllergensRemarks: this.ruleForm.otherAllergensRemarks,
          patientAddress: this.ruleForm.patientAddress,
          patientCostSource: this.ruleForm.patientCostSource,
          patientCulture: this.ruleForm.patientCulture,
          patientDrink: this.ruleForm.patientDrink,
          patientDrinkRemarks: this.ruleForm.patientDrinkRemarks,
          patientDwellingState: this.ruleForm.patientDwellingState,
          patientEconomySource: this.ruleForm.patientEconomySource,
          patientMarriage: this.ruleForm.patientMarriage,
          patientNation: this.ruleForm.patientNation,
          patientPhone: this.ruleForm.patientPhone,
          patientProfession: this.ruleForm.patientProfession,
          patientReligionDemand: this.ruleForm.patientReligionDemand,
          patientReligionDemandRemarks: this.ruleForm
            .patientReligionDemandRemarks,
          patientReligionFaith: this.ruleForm.patientReligionFaith,
          patientSmoke: this.ruleForm.patientSmoke,
          patientSmokeRemarks: this.ruleForm.patientSmokeRemarks,
          previousHistory: this.ruleForm.previousHistory.join("-"),
          previousHistoryRemarks: this.ruleForm.previousHistoryRemarks,
          skinCase: this.ruleForm.skinCase.join("-"),
          skinCaseRemarks: this.ruleForm.skinCaseRemarks,
          socialSupportRemarks: this.ruleForm.socialSupportRemarks,
          specialCrowd: this.ruleForm.specialCrowd,
          socialSupport: this.ruleForm.socialSupport.join("-"),
          specialCrowdRemarks: this.ruleForm.specialCrowdRemarks.join("-"),
          treatmentCompliance: this.ruleForm.treatmentCompliance
        };
        var id = this.dataGetByPatient.id;
        // 判断父组件，确认时修改还是新增
        if (this.NewPatient[9].flag == false) {
          // 新增
          entranceAssessRecord(assessment)
            .then(data => {
              _this.$message({
                showClose: true,
                message: "患者评估成功",
                type: "success"
              });
              if (this.operationData.specificStepId.indexOf("5") == -1) {
                let flowName = Number(this.flowNames);
                let specificStepId = 5;
                putObj(flowName, _this.operationData.id, specificStepId);
              }
              this.evaluation = false;
              this.loading = false;
              this.NewPatient[9].flag = true;
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          // 修改
          entranceAssessRecordUpdate(assessment, id)
            .then(data => {
              _this.$message({
                showClose: true,
                message: "患者评估修改成功",
                type: "success"
              });
              this.getalready(this.pageTwo);
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
          this.evaluation = false;
        }
      });
    },
    evaluationCancel() {
      this.evaluation = false;
      this.ruleForm = {
        // 诊断
        entranceDiagnose: "",
        // 途径
        entrancePathway: "",
        // 电话
        patientPhone: "",
        // 地址
        patientAddress: "",
        // 资料来源
        dataSource: [],
        // 资料来源其他
        dataSourceRemarks: "",
        // 沟通
        communicationBarriers: "",
        // 翻译
        communicationBarriersRemarks: "",
        // 既往史
        previousHistory: [],
        // 既往史其他
        previousHistoryRemarks: "",
        // 家族史
        familyHistory: [],
        // 家族史其他
        familyHistoryRemarks: "",
        // 过敏药物
        drugAllergy: [],
        // 过敏药物其他
        drugAllergyRemarks: "",
        // 过敏食物
        allergenicFood: [],
        // 过敏食物其他
        allergenicFoodRemarks: "",
        // 其他过敏源
        otherAllergens: [],
        // 其他过敏源其他
        otherAllergensRemarks: "",
        // 治疗依从性
        treatmentCompliance: "",
        // 皮肤情况
        skinCase: [],
        // 皮肤情况
        skinCaseRemarks: "",
        // 民族
        patientNation: "",
        // 职业
        patientProfession: "",
        // 文化程度
        patientCulture: "",
        // 婚姻状况
        patientMarriage: "",
        // 居住状况
        patientDwellingState: "",
        // 宗教信仰
        patientReligionFaith: "",
        // 宗教需求
        patientReligionDemand: "",
        // 宗教需求其他
        patientReligionDemandRemarks: "",
        // 费用来源
        patientCostSource: "",
        // 家庭经济来源
        patientEconomySource: "",
        // 抽烟
        patientSmoke: "",
        // 每日
        patientSmokeRemarks: "每日 支,已吸 年",
        // 饮酒
        patientDrink: "",
        // 每次
        patientDrinkRemarks: "每次 两,已喝 年",
        // 特殊人群单选
        specialCrowd: "",
        // 特殊人群多选
        specialCrowdRemarks: [],
        // 社会支持
        socialSupport: [],
        // 社会支持其他
        socialSupportRemarks: ""
      };
    }
  }
};
</script>

<style lang="scss">
.conflict {
  .el-radio,
  .el-checkbox {
    width: 100px;
  }
  .elcheckbox1 {
    width: 170px;
  }
  .clearfix:after {
    content: "";
    display: block;
    clear: both;
  }
  th,
  td,
  tr {
    border: 1px solid #ebeef5;
  }
  .left {
    text-align: left;
  }
  .inlineBlock {
    float: left;
    min-width: 280px;
    padding: 5px;
  }
  .inlineBlock2 {
    float: left;
    padding: 5px;
  }
  .el-input .el-input__inner {
    border: 0 !important;
    border-bottom: 1px #ccc solid !important;
    border-radius: 0 !important;
  }
  .table-bordered {
    width: 100%;
  }
  .span50 {
    display: inline-block;
    margin-left: 20px;
    text-align: center;
  }
  .span100 {
    display: inline-block;
    width: 97px;
  }
  .span110 {
    display: inline-block;
    width: 110px;
  }
  .span120 {
    display: inline-block;
    width: 120px;
  }
  .fontSize {
    font-size: 17px;
  }
  .PreDeclaration .table-bordered td {
    padding: 10px;
  }
  .PreDeclaration .width {
    width: 200px;
  }
  .PreDeclaration .width1 {
    width: 280px;
  }

  .PreDeclaration .el-checkbox {
    color: #606266;
    font-weight: 500;
    font-size: 14px !important;
    margin: 10px;
  }
  .PreDeclaration .el-radio {
    margin: 10px;
  }
  .PreDeclaration .weight {
    font-weight: 600;
    font-size: 16px;
  }
  .marginRight {
    margin: 0;
  }
  .specialPopulations {
    border: 1px solid #ddd;
    border-radius: 10px;
  }
  .panel-heading {
    padding: 10px 15px;
    border-bottom: 1px solid transparent;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    border-color: #ddd;
    line-height: 30px;
  }
  .panel-title {
    float: left;
    font-size: 16px;
    font-weight: 600;
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
  .form {
    margin-top: 10px;
  }
  .minWidth160 {
    min-width: 160px !important;
    float: left;
  }
  .panel-default .avue-tags__menu {
    line-height: 40px;
    padding-right: 10px;
    margin-top: 18px;
    margin-right: 1%;
  }
  .dropdownMenu .el-button {
    margin: 10px 0;
    width: 90px;
    span {
      display: block;
      margin: 0 auto;
      overflow: hidden;
    }
  }
  .dropdownMenu {
    width: 120px !important;
    height: 300px !important;
    text-align: center;
    overflow-y: auto;
  }
}
</style>