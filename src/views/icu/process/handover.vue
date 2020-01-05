
<template>
  <el-dialog
    title="转科评估"
    :visible.sync="evaluation"
    @close="evaluationCancel"
    :destroy-on-close="true"
    :fullscreen="isFullscreen"
    class="handover"
    width="70%"
  >
    <!-- 评估内容 -->
    <div style="margin-bottom:40px;" class="clearfix" id="panel">
      <el-form ref="form" :rules="rules" :model="form" label-width="85px" class="clearfix">
        <div class="clearfix">
          <el-form-item
            label="姓名:"
            prop="patientName"
            class="el-col el-col-5 el-col-offset-0 el-col-xs-5 el-col-md-5 avue-form__row"
          >
            <el-input v-model="form.patientName"></el-input>
          </el-form-item>
          <el-form-item
            label="性别:"
            prop="patientSex"
            class="el-col el-col-4 el-col-offset-0 el-col-xs-4 el-col-md-4 avue-form__row"
          >
            <el-input v-model="form.patientSex"></el-input>
          </el-form-item>
          <el-form-item
            label="年龄:"
            prop="patientAge"
            class="el-col el-col-4 el-col-offset-0 el-col-xs-4 el-col-md-4 avue-form__row"
          >
            <el-input v-model="form.patientAge"></el-input>
          </el-form-item>
          <el-form-item
            label="诊断:"
            prop="patientDiagnose"
            class="el-col el-col-5 el-col-offset-0 el-col-xs-5 el-col-md-5 avue-form__row"
          >
            <el-input v-model="form.patientDiagnose"></el-input>
          </el-form-item>
          <el-form-item
            label="住院号:"
            prop="patientAdmissionNumber"
            class="el-col el-col-6 el-col-offset-0 el-col-xs-6 el-col-md-6 avue-form__row"
          >
            <el-input v-model="form.patientAdmissionNumber"></el-input>
          </el-form-item>
        </div>
        <!-- </el-form> -->
        <div class="nav">
          <label for="T" class="el-col el-col-1 el-col-offset-0 el-col-xs-1 el-col-md-1 center">T:</label>
          <input
            type="text"
            id="T"
            class="el-col el-col-2 el-col-offset-0 el-col-xs-2 el-col-md-2 border"
            v-model="form.patientTemperature"
          />
          <span class="el-col el-col-1 el-col-offset-0 el-col-xs-1 el-col-md-1 center">℃</span>
          <label for="P" class="el-col el-col-1 el-col-offset-0 el-col-xs-1 el-col-md-1 center">P:</label>
          <input
            type="text"
            id="P"
            class="el-col el-col-2 el-col-offset-0 el-col-xs-2 el-col-md-2 border"
            v-model="form.patientPulse"
          />
          <span class="el-col el-col-2 el-col-offset-0 el-col-xs-2 el-col-md-2 center">次/分</span>
          <label for="R" class="el-col el-col-1 el-col-offset-0 el-col-xs-1 el-col-md-1 center">R:</label>
          <input
            type="text"
            id="R"
            class="el-col el-col-2 el-col-offset-0 el-col-xs-2 el-col-md-2 border"
            v-model="form.patientBreathe"
          />
          <span class="el-col el-col-2 el-col-offset-0 el-col-xs-2 el-col-md-2 center">次/分</span>
          <label for="BP" class="el-col el-col-1 el-col-offset-0 el-col-xs-1 el-col-md-1 center">BP:</label>
          <input
            type="text"
            id="BP"
            class="el-col el-col-2 el-col-offset-0 el-col-xs-2 el-col-md-2 border"
            v-model="form.patientBloodPressure"
          />
          <span class="el-col el-col-2 el-col-offset-0 el-col-xs-2 el-col-md-2 center">mmHg</span>
          <label
            for="Pain"
            class="el-col el-col-2 el-col-offset-0 el-col-xs-2 el-col-md-2 center"
          >疼痛:</label>
          <input
            type="text"
            id="Pain"
            class="el-col el-col-2 el-col-offset-0 el-col-xs-2 el-col-md-2 border"
            v-model="form.patientPain	"
          />
          <span class="el-col el-col-1 el-col-offset-0 el-col-xs-1 el-col-md-1 center">分</span>

          <!-- <el-form
          ref="form"
          :model="form"
          :rules="rules"
          label-width="85px"
          style="margin-left:1.5%"
          class="clearfix"
          >-->
          <div class="clearfix">
            <span
              style="float:left; line-height:40px;"
              class="span100"
            >意&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;识:</span>
            <div style="margin-left:85px;">
              <el-radio-group
                v-model="form.patientConsciousness"
                style="display: contents;line-height:40px;"
              >
                <el-radio label="清醒" name="patientConsciousness"></el-radio>
                <el-radio label="嗜睡" name="patientConsciousness"></el-radio>
                <el-radio label="模糊" name="patientConsciousness"></el-radio>
                <el-radio label="浅昏迷" name="patientConsciousness"></el-radio>
                <el-radio label="深昏迷" name="patientConsciousness"></el-radio>
              </el-radio-group>
            </div>
          </div>
          <div class="clearfix">
            <span style="float:left; line-height:40px;" class="span100">心理状态:</span>
            <div style="margin-left:85px;">
              <el-radio-group
                v-model="form.patientPsychological"
                style="display: contents; line-height:40px;"
                @change="patientPsychologicalDis"
              >
                <el-radio label="稳定" name="patientPsychological"></el-radio>
                <el-radio label="紧张" name="patientPsychological"></el-radio>
                <el-radio label="焦虑" name="patientPsychological"></el-radio>
                <el-radio label="哭闹" name="patientPsychological"></el-radio>
                <el-radio label="烦躁" name="patientPsychological"></el-radio>
                <el-radio label="抑郁" name="patientPsychological"></el-radio>
                <el-radio label="其他:" name="patientPsychological">
                  <span>其他:</span>&nbsp;&nbsp;
                  <el-input
                    placeholder="其他注明"
                    style="max-width:200px"
                    v-model="form.patientPsychologicalRemarks"
                    :disabled="patientPsychologicalDisabled"
                  ></el-input>
                </el-radio>
              </el-radio-group>
            </div>
          </div>
          <div class="clearfix">
            <span style="float:left; line-height:40px;" class="span100">自理能力:</span>
            <div style="margin-left:85px;">
              <el-radio-group v-model="form.patientCareOneself" style="display: contents;">
                <el-radio label="不需依赖" name="patientCareOneself"></el-radio>
                <el-radio label="轻度依赖" name="patientCareOneself"></el-radio>
                <el-radio label="中度依赖" name="patientCareOneself"></el-radio>
                <el-radio label="重度依赖" name="patientCareOneself"></el-radio>
              </el-radio-group>
            </div>
          </div>
          <div class="clearfix">
            <span style="float:left; line-height:40px;" class="span100">皮肤黏膜:</span>
            <div style="margin-left:85px;">
              <el-radio-group
                v-model="form.patientSkinMucosa"
                style="display: contents;"
                @change="patientSkinMucosaDis"
              >
                <el-radio label="正常" name="patientSkinMucosa"></el-radio>
                <el-radio label="水肿" name="patientSkinMucosa"></el-radio>
              </el-radio-group>
              <span style="margin-left: 50px">(部位:</span>&nbsp;&nbsp;
              <el-input
                placeholder="请输入部位"
                style="max-width:200px"
                v-model="form.patientSkinMucosaRemarks"
                :disabled="patientSkinMucosaDisabled"
              ></el-input>
              <span>)</span>
            </div>
          </div>
          <div class="clearfix">
            <span
              style="float:left; line-height:40px;"
              class="span100"
            >压&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;疮:</span>
            <div style="margin-left:85px;">
              <el-radio-group
                v-model="form.patientPressure"
                style="display: contents;"
                @change="patientPressureDis"
              >
                <el-radio label="无" name="patientPressure"></el-radio>
                <el-radio label="有" name="patientPressure"></el-radio>
              </el-radio-group>
              <span style="margin-left: 50px">分期;部位;范围:</span>&nbsp;&nbsp;
              <el-input
                placeholder="请输入分期/部位/范围"
                style="max-width:200px"
                v-model="form.patientPressureRemarks"
                :disabled="patientPressureDisabled"
              ></el-input>
            </div>
          </div>
          <div class="clearfix">
            <span style="float:left; line-height:40px;" class="span100">静脉输入:</span>
            <div style="margin-left:85px;">
              <el-radio-group
                v-model="form.patientTransfusion"
                style="display: contents;"
                @change="patientTransfusionDis"
              >
                <el-radio label="无" name="patientTransfusion"></el-radio>
                <el-radio label="有" name="patientTransfusion"></el-radio>
              </el-radio-group>
              <span style="margin-left: 50px">(</span>&nbsp;&nbsp;
              <el-radio-group
                v-model="form.patientTransfusionRemarks"
                style="display: contents;"
                :disabled="patientTransfusionDisabled"
                @change="patientTransfusionRemarksDis"
              >
                <el-radio label="通畅" name="patientTransfusionRemarks"></el-radio>
                <el-radio label="堵塞" name="patientTransfusionRemarks"></el-radio>
                <el-radio label="留置针" name="patientTransfusionRemarks"></el-radio>
                <el-radio label="其他" name="patientTransfusionRemarks">
                  <span>其他:</span>&nbsp;&nbsp;
                  <el-input
                    placeholder="其他注明"
                    style="max-width:200px"
                    v-model="form.state"
                    :disabled="patientTransfusionRemarksDisabled"
                  ></el-input>
                </el-radio>
              </el-radio-group>
              <span style="margin-left: 5px;">)</span>
            </div>
          </div>
          <div class="clearfix">
            <span style="float:left; line-height:40px;" class="span100">药物交接:</span>
            <div style="margin-left:85px;">
              <el-radio-group
                v-model="form.patientDrugDelivery"
                style="display: contents;"
                @change="patientDrugDeliveryDis"
              >
                <el-radio label="无" name="patientDrugDelivery"></el-radio>
                <el-radio label="有" name="patientDrugDelivery"></el-radio>
              </el-radio-group>
              <span style="margin-left: 50px">药物名称:</span>&nbsp;&nbsp;
              <el-input
                placeholder="请输入药物名称"
                style="max-width:300px"
                v-model="form.patientDrugDeliveryRemarks"
                :disabled="patientDrugDeliveryDisabled"
              ></el-input>
            </div>
          </div>
          <div class="clearfix">
            <span style="float:left; line-height:40px;" class="span100">管道情况:</span>
            <div style="margin-left:85px;">
              <el-checkbox-group
                v-model="form.pipeline"
                style="display: contents;"
                @change="medicalDis"
              >
                <el-checkbox label="无" name="pipeline"></el-checkbox>
                <el-checkbox label="胃管" name="pipeline">
                  <span>胃管 (</span>&nbsp;&nbsp;
                  <el-radio-group
                    v-model="form.stomach"
                    style="display: contents;"
                    :disabled="stomachDisabled"
                  >
                    <el-radio label="通畅" name="stomach"></el-radio>
                    <el-radio label="堵塞" name="stomach"></el-radio>
                  </el-radio-group>
                  <span>)</span>
                </el-checkbox>
                <el-checkbox label="尿管" name="pipeline">
                  <span>尿管 (</span>&nbsp;&nbsp;
                  <el-radio-group
                    v-model="form.urine"
                    style="display: contents;"
                    :disabled="urineDisabled"
                  >
                    <el-radio label="通畅" name="urine"></el-radio>
                    <el-radio label="堵塞" name="urine"></el-radio>
                  </el-radio-group>
                  <span>)</span>
                </el-checkbox>
                <el-checkbox label="胸腔引流管" name="pipeline">
                  <span>胸腔引流管 (</span>&nbsp;&nbsp;
                  <el-radio-group
                    v-model="form.pleural"
                    style="display: contents;"
                    :disabled="pleuralDisabled"
                  >
                    <el-radio label="通畅" name="pleural"></el-radio>
                    <el-radio label="堵塞" name="pleural"></el-radio>
                  </el-radio-group>
                  <span>)</span>
                </el-checkbox>
                <el-checkbox label="T型管" name="pipeline">
                  <span>T型管 (</span>&nbsp;&nbsp;
                  <el-radio-group
                    v-model="form.tTube"
                    style="display: contents;"
                    :disabled="tTubeDisabled"
                  >
                    <el-radio label="通畅" name="tTube"></el-radio>
                    <el-radio label="堵塞" name="tTube"></el-radio>
                  </el-radio-group>
                  <span>)</span>
                </el-checkbox>
                <el-checkbox label="其他管道" name="pipeline">
                  <span>其他管道:</span>&nbsp;&nbsp;
                  <el-input
                    placeholder="其他注明"
                    style="max-width:200px"
                    v-model="form.conduitMark"
                    :disabled="conduitMarkDisabled"
                  ></el-input>
                  <span>(</span>
                  <el-radio-group
                    v-model="form.conduitOther"
                    style="display: contents;"
                    :disabled="conduitMarkDisabled"
                  >
                    <el-radio label="通畅" name="conduitOther"></el-radio>
                    <el-radio label="堵塞" name="conduitOther"></el-radio>
                  </el-radio-group>
                  <span>)</span>
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <div class="clearfix">
            <span
              style="float:left; line-height:40px;"
              class="span100"
            >伤&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;口:</span>
            <div style="margin-left:85px;">
              <el-radio-group
                v-model="form.patientWound"
                style="display: contents;"
                @change="patientWoundDis"
              >
                <el-radio label="无" name="patientWound"></el-radio>
                <el-radio label="有" name="patientWound"></el-radio>
              </el-radio-group>
              <span style="margin-left: 50px">(具体描述:</span>&nbsp;&nbsp;
              <el-input
                placeholder="请输入部位"
                style="max-width:300px"
                v-model="form.patientWoundRemarks"
                :disabled="patientWoundDisabled"
              ></el-input>
              <span>)</span>
            </div>
          </div>
          <div class="clearfix">
            <span
              style="float:left; line-height:40px;"
              class="span100"
            >其&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;他:</span>
            <div style="margin-left:85px;">
              <el-input
                placeholder="请输入其他情况"
                style="width:95%"
                v-model="form.patientOthers"
                class="width1"
              ></el-input>
            </div>
          </div>
          <el-form-item
            label="转出科室:"
            prop="patientDischargeDept"
            class="el-col el-col-8 el-col-offset-0 el-col-xs-8 el-col-md-8 width"
          >
            <el-input v-model="form.patientDischargeDept"></el-input>
          </el-form-item>
          <el-form-item
            label="护士:"
            prop="nurseName"
            class="el-col el-col-8 el-col-offset-0 el-col-xs-8 el-col-md-8 width"
          >
            <el-input v-model="form.nurseName"></el-input>
          </el-form-item>
          <el-form-item
            label="转出时间:"
            prop="patientDischargeTime"
            class="el-col el-col-8 el-col-offset-0 el-col-xs-8 el-col-md-8 width"
          >
            <el-date-picker
              class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-24"
              v-model="form.patientDischargeTime"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <!-- <el-button @click="printContent" type="primary">打印</el-button> -->
      <el-button type="primary" @click="confirm('form')" :loading="loading">保 存</el-button>
      <el-button @click="evaluationCancel()">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  transferRecordOldData,
  transferRecordAdd,
  transferRecordUpdate,
  transferRecordTransferRecord
} from "@/api/icu/process/handover";
import { putObj } from "@/api/icu/process/entryDepartment";

import { mapGetters, mapState } from "vuex";

export default {
  name: "child",
  data() {
    return {
      // 流程
      flowName: "2",
      // 禁用
      patientWoundDisabled: true,
      conduitMarkDisabled: true,
      tTubeDisabled: true,
      pleuralDisabled: true,
      urineDisabled: true,
      stomachDisabled: true,
      patientDrugDeliveryDisabled: true,
      patientTransfusionDisabled: true,
      patientTransfusionRemarksDisabled: true,
      patientPressureDisabled: true,
      patientSkinMucosaDisabled: true,
      patientPsychologicalDisabled: true,
      // 防重提交
      loading: false,
      // 屏幕
      isFullscreen: false,
      screenWidth: document.body.clientWidth, // 屏幕尺寸
      // 评估
      evaluation: false,
      // 评估内容
      form: {
        patientId: "",
        patientName: "",
        patientSex: "",
        patientAge: "",
        patientDiagnose: "",
        patientAdmissionNumber: "",
        patientTemperature: "",
        patientPulse: "",
        patientBreathe: "",
        patientBloodPressure: "",
        patientPain: "",
        patientConsciousness: "",
        patientPsychological: "",
        patientPsychologicalRemarks: "",
        patientCareOneself: "",
        patientSkinMucosa: "",
        patientSkinMucosaRemarks: "",
        patientPressure: "",
        patientPressureRemarks: "",
        patientTransfusion: "",
        patientTransfusionRemarks: "",
        state: "",
        patientDrugDelivery: "",
        patientDrugDeliveryRemarks: "",
        pipeline: [],
        stomach: "",
        urine: "",
        pleural: "",
        tTube: "",
        conduitMark: "",
        conduitOther: "",
        patientWoundRemarks: "",
        patientWound: "",
        patientOthers: "",
        patientDischargeDept: "",
        patientDischargeTime: "",
        nurseName: "",
        id: ""
      },
      // 必选
      rules: {
        patientName: [
          { required: true, message: "请输入患者姓名", trigger: "blur" }
        ],
        patientSex: [
          { required: true, message: "请输入患者性别", trigger: "blur" }
        ],
        patientAge: [
          { required: true, message: "请输入患者年龄", trigger: "blur" }
        ],
        patientDiagnose: [
          { required: true, message: "请输入诊断", trigger: "blur" }
        ],
        patientAdmissionNumber: [
          { required: true, message: "请输入患者住院号", trigger: "blur" }
        ],
        patientDischargeDept: [
          { required: true, message: "请输入转出科室", trigger: "blur" }
        ],
        nurseName: [{ required: true, message: "请输入护士", trigger: "blur" }],
        patientDischargeTime: [
          { required: true, message: "请选择转出时间", trigger: "blur" }
        ]
      }
    };
  },
  props: {
    // 父对象数据
    NewPatient: Array,
    operationData: Object
  },
  computed: {},
  watch: {
    // 监听父对象数据变化
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
    }
  },
  mounted() {
    // 屏幕大小
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
    // 调用判断
    judge() {
      this.medicalDis();
      this.patientPsychologicalDis();
      this.patientSkinMucosaDis();
      this.patientPressureDis();
      this.patientTransfusionDis();
      this.patientTransfusionRemarksDis();
      this.patientDrugDeliveryDis();
      this.patientWoundDis();
    },
    // 已知数据回填
    backfill() {
      let _this = this;
      let patientId = {
        patientId: _this.form.patientId
      };
      transferRecordOldData(patientId).then(data => {
        _this.form.patientTemperature = data.data.data.patientTemperature;
        _this.form.patientPulse = data.data.data.patientPulse;
        _this.form.patientBreathe = data.data.data.patientBreathe;
        _this.form.patientBloodPressure = data.data.data.patientBloodPressure;
        _this.form.patientPain = data.data.data.patientPain;
        _this.form.patientConsciousness = data.data.data.patientConsciousness;
        _this.form.patientPressure = data.data.data.patientPressure;
        _this.form.patientPressureRemarks =
          data.data.data.patientPressureRemarks;
        _this.$forceUpdate(); //强制页面进行刷新
        this.patientPressureDis();
      });
    },
    // 判断是否禁用
    // 管道
    medicalDis() {
      if (this.form.pipeline.length >= 2) {
        for (const i in this.form.pipeline) {
          if (i > 0) {
            if (this.form.pipeline[i] == "无") {
              this.form.pipeline = ["无"];
            }
          } else {
            if (this.form.pipeline[0] == "无") {
              this.form.pipeline.splice(0, 1);
            }
          }
        }
      }
      if (this.form.pipeline != null) {
        if (this.form.pipeline.indexOf("胃管") == -1) {
          this.stomachDisabled = true;
          this.form.stomach = "";
        } else {
          this.stomachDisabled = false;
        }
      } else {
        this.stomachDisabled = true;
      }
      if (this.form.pipeline != null) {
        if (this.form.pipeline.indexOf("尿管") == -1) {
          this.urineDisabled = true;
          this.form.urine = "";
        } else {
          this.urineDisabled = false;
        }
      } else {
        this.urineDisabled = true;
      }
      if (this.form.pipeline != null) {
        if (this.form.pipeline.indexOf("胸腔引流管") == -1) {
          this.pleuralDisabled = true;
          this.form.pleural = "";
        } else {
          this.pleuralDisabled = false;
        }
      } else {
        this.pleuralDisabled = true;
      }
      if (this.form.pipeline != null) {
        if (this.form.pipeline.indexOf("T型管") == -1) {
          this.tTubeDisabled = true;
          this.form.tTube = "";
        } else {
          this.tTubeDisabled = false;
        }
      } else {
        this.tTubeDisabled = true;
      }
      if (this.form.pipeline != null) {
        if (this.form.pipeline.indexOf("其他管道") == -1) {
          this.conduitMarkDisabled = true;
          this.form.conduitMark = "";
          this.form.conduitOther = "";
        } else {
          this.conduitMarkDisabled = false;
        }
      } else {
        this.conduitMarkDisabled = true;
      }
    },
    // 心理
    patientPsychologicalDis() {
      if (this.form.patientPsychological != null) {
        if (this.form.patientPsychological.indexOf("其他") == -1) {
          this.patientPsychologicalDisabled = true;
          this.form.patientPsychologicalRemarks = "";
        } else {
          this.patientPsychologicalDisabled = false;
        }
      } else {
        this.patientPsychologicalDisabled = true;
      }
    },
    // 皮肤
    patientSkinMucosaDis() {
      if (this.form.patientSkinMucosa != null) {
        if (this.form.patientSkinMucosa.indexOf("水肿") == -1) {
          this.patientSkinMucosaDisabled = true;
          this.form.patientSkinMucosaRemarks = "";
        } else {
          this.patientSkinMucosaDisabled = false;
        }
      } else {
        this.patientSkinMucosaDisabled = true;
      }
    },
    // 压疮
    patientPressureDis() {
      if (this.form.patientPressure != null) {
        if (this.form.patientPressure.indexOf("有") == -1) {
          this.patientPressureDisabled = true;
          this.form.patientPressureRemarks = "";
        } else {
          this.patientPressureDisabled = false;
        }
      } else {
        this.patientPressureDisabled = true;
      }
    },
    // 静脉
    patientTransfusionDis() {
      if (this.form.patientTransfusion != null) {
        if (this.form.patientTransfusion.indexOf("有") == -1) {
          this.patientTransfusionDisabled = true;
          this.patientTransfusionRemarksDisabled = true;
          this.form.patientTransfusionRemarks = "";
          this.form.state = "";
        } else {
          this.patientTransfusionDisabled = false;
        }
      } else {
        this.patientTransfusionDisabled = true;
      }
    },
    // 静脉其他
    patientTransfusionRemarksDis() {
      if (this.form.patientTransfusionRemarks != null) {
        if (this.form.patientTransfusionRemarks.indexOf("其他") == -1) {
          this.patientTransfusionRemarksDisabled = true;
          this.form.state = "";
        } else {
          this.patientTransfusionRemarksDisabled = false;
        }
      } else {
        this.patientTransfusionRemarksDisabled = true;
      }
    },
    // 药物
    patientDrugDeliveryDis() {
      if (this.form.patientDrugDelivery != null) {
        if (this.form.patientDrugDelivery.indexOf("有") == -1) {
          this.patientDrugDeliveryDisabled = true;
          this.form.patientDrugDeliveryRemarks = "";
        } else {
          this.patientDrugDeliveryDisabled = false;
        }
      } else {
        this.patientDrugDeliveryDisabled = true;
      }
    },
    // 伤口
    patientWoundDis(form) {
      if (this.form.patientWound != null) {
        if (this.form.patientWound.indexOf("有") == -1) {
          this.patientWoundDisabled = true;
          this.form.patientWoundRemarks = "";
        } else {
          this.patientWoundDisabled = false;
        }
      } else {
        this.patientWoundDisabled = true;
      }
    },
    // 确定按钮
    confirm(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.loading = true;
          let _this = this;
          // 传输数据
          let obj = {
            patientId: this.form.patientId,
            patientName: this.form.patientName,
            patientSex: this.form.patientSex,
            patientAge: this.form.patientAge,
            patientDiagnose: this.form.patientDiagnose,
            patientAdmissionNumber: this.form.patientAdmissionNumber,
            patientTemperature: this.form.patientTemperature,
            patientPulse: this.form.patientPulse,
            patientBreathe: this.form.patientBreathe,
            patientBloodPressure: this.form.patientBloodPressure,
            patientPain: this.form.patientPain,
            patientConsciousness: this.form.patientConsciousness,
            patientPsychological: this.form.patientPsychological,
            patientPsychologicalRemarks: this.form.patientPsychologicalRemarks,
            patientCareOneself: this.form.patientCareOneself,
            patientSkinMucosa: this.form.patientSkinMucosa,
            patientSkinMucosaRemarks: this.form.patientSkinMucosaRemarks,
            patientPressure: this.form.patientPressure,
            patientPressureRemarks: this.form.patientPressureRemarks,
            patientTransfusion: this.form.patientTransfusion,
            patientTransfusionRemarks: JSON.stringify({
              patientTransfusionRemarks: this.form.patientTransfusionRemarks,
              state: this.form.state
            }),
            patientDrugDelivery: this.form.patientDrugDelivery,
            patientDrugDeliveryRemarks: this.form.patientDrugDeliveryRemarks,
            patientPipeline: JSON.stringify({
              pipeline: this.form.pipeline,
              stomach: this.form.stomach,
              urine: this.form.urine,
              pleural: this.form.pleural,
              tTube: this.form.tTube,
              conduitMark: this.form.conduitMark,
              conduitOther: this.form.conduitOther
            }),
            patientWoundRemarks: this.form.patientWoundRemarks,
            patientWound: this.form.patientWound,
            patientOthers: this.form.patientOthers,
            patientDischargeDept: this.form.patientDischargeDept,
            patientDischargeTime: this.form.patientDischargeTime,
            nurseName: this.form.nurseName
          };
          // 新增
          if (this.NewPatient[7].flag != true) {
            this.$confirm("是否保存数据", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                transferRecordAdd(obj).then(data => {
                  this.$message({
                    showClose: true,
                    message: "转科评估成功",
                    type: "success"
                  });
                  // 流程高亮
                  let flowName = Number(this.flowName);
                  let specificStepId = 8;
                  putObj(flowName, _this.operationData.id, specificStepId);
                  this.evaluation = false;
                  this.loading = false;
                  this.NewPatient[7].flag = true;
                });
              })
              .catch(() => {
                this.loading = false;
              });
          } else {
            // 修改
            obj.id = this.form.id;
            this.$confirm("是否修改数据", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                transferRecordUpdate(obj).then(data => {
                  this.$message({
                    showClose: true,
                    message: "转科评估修改成功",
                    type: "success"
                  });
                  this.evaluation = false;
                  this.loading = false;
                  this.NewPatient[7].flag = true;
                });
              })
              .catch(() => {
                this.loading = false;
              });
          }
        } else {
          return false;
        }
      });
    },
    // 取消
    evaluationCancel(form) {
      this.evaluation = false;
      // this.$refs[form].resetFields();
      // 清空表单
      this.form = {
        patientId: "",
        patientName: "",
        patientSex: "",
        patientAge: "",
        patientDiagnose: "",
        patientAdmissionNumber: "",
        patientTemperature: "",
        patientPulse: "",
        patientBreathe: "",
        patientBloodPressure: "",
        patientPain: "",
        patientConsciousness: "",
        patientPsychological: "",
        patientPsychologicalRemarks: "",
        patientCareOneself: "",
        patientSkinMucosa: "",
        patientSkinMucosaRemarks: "",
        patientPressure: "",
        patientPressureRemarks: "",
        patientTransfusion: "",
        patientTransfusionRemarks: "",
        state: "",
        patientDrugDelivery: "",
        patientDrugDeliveryRemarks: "",
        pipeline: [],
        stomach: "",
        urine: "",
        pleural: "",
        tTube: "",
        conduitMark: "",
        conduitOther: "",
        patientWoundRemarks: "",
        patientWound: "",
        patientOthers: "",
        patientDischargeDept: "",
        patientDischargeTime: "",
        nurseName: "",
        id: ""
      };
    }
    // 打印
    // printContent() {
    //   let wpt = document.getElementById("panel");
    //   let newContent = wpt.innerHTML;
    //   let oldContent = document.body.innerHTML;

    //   document.body.innerHTML = newContent;
    //   window.print(); //打印方法
    //   window.location.reload();
    //   document.body.innerHTML = oldContent;
    // }
  }
};
</script>

<style lang="scss">
// @media print {
//   .clearfix:after {
//     content: "";
//     display: block;
//     clear: both;
//     margin-bottom: 5px;
//   }
//   .el-input .el-input__inner {
//     border: 0 !important;
//     border-bottom: 1px #ccc solid !important;
//     border-radius: 0 !important;
//   }
//   .nav {
//     border: 1px #ccc solid;
//     padding: 15px 0 0 0;
//     .center {
//       text-align: center;
//       line-height: 30px;
//     }
//     .border {
//       border: 0;
//       border-bottom: 1px #ccc solid;
//       line-height: 25px;
//       text-align: center;
//     }
//     .el-radio {
//       line-height: 40px !important;
//       margin-right: 20px !important;
//     }
//     .elFormItem {
//       margin-bottom: 0 !important;
//     }
//     .span100 {
//       display: inline-block;
//       width: 72px;
//     }
//     .width{
//       max-width: 200px!important;
//     }
//     .width1{
//       max-width: 600px!important;
//     }
//   }
//   // .avue-form__row {
//   //   margin-bottom: 20px !important;
//   // }
// }
.handover {
  .clearfix:after {
    content: "";
    display: block;
    clear: both;
    margin-bottom: 5px;
  }
  .el-input .el-input__inner {
    border: 0 !important;
    border-bottom: 1px #ccc solid !important;
    border-radius: 0 !important;
  }
  .nav {
    border: 1px #ccc solid;
    padding: 10px 1% 0;
    .width {
      padding: 10px 0 0 0;
    }
  }
  // .avue-form__row {
  //   margin-bottom: 20px !important;
  // }
  .center {
    text-align: center;
    line-height: 30px;
  }
  .border {
    border: 0;
    border-bottom: 1px #ccc solid;
    line-height: 25px;
    text-align: center;
  }
  .el-radio {
    line-height: 40px !important;
    margin-right: 20px !important;
  }
  .elFormItem {
    margin-bottom: 0 !important;
  }
  .span100 {
    display: inline-block;
    width: 72px;
  }
}
</style>