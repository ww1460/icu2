<template>
   <!-- 模型图 -->
   <div class="flip" style="display:flex">
      <!-- 女 -->
      <div v-show="form.gender == 0" class="person">
         <img
            data-toggle="modal"
            data-target="#myModel3"
            v-for="(item,index) in frontModel"
            :key="index"
            @click="setInfo(item)"
            :class="item.femaleClassName"
            :src="item.flag?item.femalePositive:item.brightFemalePositive"
            alt
         />
      </div>
      <div v-show="form.gender == 0" class="person">
         <img
            data-toggle="modal"
            data-target="#myModel3"
            v-for="(item,index) in backModel"
            :key="index"
            @click="setInfo(item)"
            :class="item.femaleClassName"
            :src="item.flag?item.femaleBack:item.brightFemaleBack"
            alt
         />
      </div>
      <!-- 男 -->
      <div v-show="form.gender == 1" class="person">
         <img
            data-toggle="modal"
            data-target="#myModel3"
            v-for="(item,index) in frontModel"
            :key="index"
            @click="setInfo(item)"
            :class="item.maleClassName"
            :src="item.flag?item.malePositive:item.brightMalePositive"
            alt
         />
      </div>
      <div v-show="form.gender == 1" class="person">
         <img
            data-toggle="modal"
            data-target="#myModel3"
            v-for="(item,index) in backModel"
            :key="index"
            @click="setInfo(item)"
            :class="item.maleClassName"
            :src="item.flag?item.maleBack:item.brightMaleBack"
            alt
         />
      </div>
      <!-- 新增任务遮罩层 -->
      <el-dialog
         title="任务新增"
         :visible.sync="dialogFormVisible"
         :fullscreen="isFullscreen"
         width="70%"
      >
         <el-form ref="form" :model="form" label-width="80px" :rules="rules">
            <el-form-item label="患者姓名">
               <el-input v-model="form.patientName" disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="压疮部位">
               <el-input v-model="form.prePosition" disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="评估结果">
               <el-input v-model="form.assessmentResults" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="压疮分期" prop="byStages">
               <el-radio-group v-model="form.byStages">
                  <el-radio
                     v-for="item in byStages"
                     :key="item.value"
                     :label="item.value"
                     style="margin-right:10px"
                     :title="item.description"
                  >{{item.label}}</el-radio>
               </el-radio-group>
               <!-- <el-select v-model="form.byStages" placeholder="请选择" style="width:100%">
                  <el-option
                     v-for="item in byStages"
                     :key="item.value"
                     :label="item.label + '：'+item.description"
                     :value="item.value"
                  ></el-option>
               </el-select>-->
            </el-form-item>
            <el-row>
               <el-col class="el-col el-col-12 el-col-offset-0 el-col-xs-24 el-col-md-12">
                  <el-form-item label="发生时间" prop="occurrenceTime">
                     <el-date-picker
                        v-model="form.occurrenceTime"
                        type="datetime"
                        placeholder="选择压疮发生时间"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :picker-options="pickerOptions"
                        style="width:100%"
                     ></el-date-picker>
                  </el-form-item>
               </el-col>
               <el-col class="el-col el-col-12 el-col-offset-0 el-col-xs-24 el-col-md-12">
                  <el-form-item label="压疮面积" prop="soreRange">
                     <el-input v-model="form.soreRange" placeholder="请输入压疮面积  长 x 宽 x 深"></el-input>
                  </el-form-item>
               </el-col>
               <el-col class="el-col el-col-12 el-col-offset-0 el-col-xs-24 el-col-md-12">
                  <el-form-item label="皮肤颜色" prop="skinColor">
                     <el-input v-model="form.skinColor" placeholder="请输入皮肤颜色"></el-input>
                  </el-form-item>
               </el-col>
               <el-col class="el-col el-col-12 el-col-offset-0 el-col-xs-24 el-col-md-12">
                  <el-form-item label="渗出液体" prop="exudate">
                     <el-input v-model="form.exudate" placeholder="请输入渗出液体"></el-input>
                  </el-form-item>
               </el-col>
            </el-row>
            <el-form-item label="局部情况" prop="skinSituation">
               <el-input type="textarea" v-model="form.skinSituation" placeholder="请填写皮肤局部情况"></el-input>
            </el-form-item>
            <el-form-item label="护理措施" prop="nursingMeasures">
               <el-input type="textarea" v-model="form.nursingMeasures" placeholder="请填写护理措施"></el-input>
            </el-form-item>
            <el-form-item label="皮肤情况">
               <photoGraph ref="photoGraphChild" />
            </el-form-item>
            <el-form-item style="text-align: right;">
               <el-button type="primary" @click="submitAdd('form')" :loading="submitAddLoading">增加</el-button>
               <el-button @click="close('form')">取消</el-button>
            </el-form-item>
         </el-form>
      </el-dialog>
   </div>
</template>
<script>
import { mapGetters } from "vuex";
import { recordDic, addRecord } from "@/api/icu/patient/pressureSore";
import photoGraph from "@/views/icu/patient/components/pressureSore/photoGraph";
import { setTimeout } from "timers";
import { dateFormat, calcDate } from "@/util/date";
export default {
   name: "humanModel",
   props: {
      patientRecord: Object,
      byStage: Array,
      prePosition: Array
   },
   components: {
      photoGraph
   },
   watch: {
      patientRecord: {
         handler(newValue, oldValue) {
            this.form.patientName = newValue.name;
            this.gender = newValue.gender;
            this.form.hospitalnumber = newValue.hospitalnumber;
            this.form.age = newValue.age;
            this.form.patientId = newValue.patientId;
            this.form.gender = newValue.gender;
            this.form.assessmentResults = this.$parent.assessResult;
         },
         deep: true
      },
      byStage: {
         handler(newValue, oldValue) {
            this.byStages = newValue;
         },
         deep: true
      },
      prePosition: {
         handler(newValue, oldValue) {
            this.positionList = newValue;
         },
         deep: true
      },
      screenWidth(val) {
         // console.log(val);
         if (this.screenWidth <= 768) {
            this.isFullscreen = true;
         } else {
            this.isFullscreen = false;
         }
      }
   },
   data() {
      return {
         // 遮罩层
         dialogFormVisible: false,
         isText: false,
         submitAddLoading: false,
         isFullscreen: false,
         screenWidth: document.body.clientWidth, // 屏幕尺寸
         // 部位
         positionList: [],
         byStages: [],
         form: {
            // 患者信息
            patientName: "",
            age: "",
            gender: "",
            hospitalnumber: "",
            // 压疮部位
            prePosition: "",
            // 压疮分期
            byStages: "",
            // 评估结果
            assessmentResults: "",
            // 压疮面积
            soreRange: "",
            // 护理措施
            nursingMeasures: "",
            skinConditionPicture: "",
            skinSituation: "",
            skinColor: "",
            exudate: "",
            occurrenceTime: "",
            noteTime:""
         },
         rules: {
            byStages: [
               { required: true, message: "请选择压疮分期", trigger: "change" }
            ],
            occurrenceTime: [
               {
                  required: true,
                  message: "请选择压疮时间",
                  trigger: "change"
               }
            ],
            soreRange: [
               { required: true, message: "请输入压疮面积", trigger: "blur" }
            ],
            skinColor: [
               { required: true, message: "请输入皮肤颜色", trigger: "blur" }
            ],
            exudate: [
               { required: true, message: "请输入渗出液体", trigger: "blur" }
            ],
            skinSituation: [
               {
                  required: true,
                  message: "请填写皮肤局部情况",
                  trigger: "blur"
               }
            ],
            nursingMeasures: [
               { required: true, message: "请填写护理措施", trigger: "blur" }
            ]
         },
         positionValue: "",
         // 字典路径
         dicList: [],
         highlightState: "",
         // 正面人体模型图
         frontModel: [
            {
               label: "头部",
               position: "A",
               femaleClassName: "w-head",
               maleClassName: "m-head",
               femalePositive: "/img/woman/女正面暗切图/woman-head.png",
               malePositive: "/img/man/男正面暗切图/man-head.png",
               brightFemalePositive: "/img/woman/女正面亮切图/woman-head.png",
               brightMalePositive: "/img/man/男正面亮切图/man-head.png",
               flag: true
            },
            {
               label: "喉咙",
               position: "B",
               femaleClassName: "w-neck",
               maleClassName: "m-neck",
               femalePositive: "/img/woman/女正面暗切图/woman-neck.png",
               malePositive: "/img/man/男正面暗切图/man-neck.png",
               brightFemalePositive: "/img/woman/女正面亮切图/woman-neck.png",
               brightMalePositive: "/img/man/男正面亮切图/man-neck.png",
               flag: true
            },
            {
               label: "胸部",
               position: "C",
               femaleClassName: "w-thorax",
               maleClassName: "m-thorax",
               femalePositive: "/img/woman/女正面暗切图/woman-thorax.png",
               malePositive: "/img/man/男正面暗切图/man-thorax.png",
               brightFemalePositive: "/img/woman/女正面亮切图/woman-thorax.png",
               brightMalePositive: "/img/man/男正面亮切图/man-thorax.png",
               flag: true
            },
            {
               label: "腹部",
               position: "D",
               femaleClassName: "w-belly",
               maleClassName: "m-belly",
               femalePositive: "/img/woman/女正面暗切图/woman-belly.png",
               malePositive: "/img/man/男正面暗切图/man-belly.png",
               brightFemalePositive: "/img/woman/女正面亮切图/woman-belly.png",
               brightMalePositive: "/img/man/男正面亮切图/man-belly.png",
               flag: true
            },
            {
               label: "左肩",
               position: "E",
               femaleClassName: "w-arm1",
               maleClassName: "m-arm3",
               femalePositive: "/img/woman/女正面暗切图/woman-arm3.png",
               malePositive: "/img/man/男正面暗切图/man-arm3.png",
               brightFemalePositive: "/img/woman/女正面亮切图/woman-arm3.png",
               brightMalePositive: "/img/man/男正面亮切图/man-arm3.png",
               flag: true
            },
            {
               label: "左臂",
               position: "F",
               femaleClassName: "w-arm2",
               maleClassName: "m-arm4",
               femalePositive: "/img/woman/女正面暗切图/woman-arm4.png",
               malePositive: "/img/man/男正面暗切图/man-arm4.png",
               brightFemalePositive: "/img/woman/女正面亮切图/woman-arm4.png",
               brightMalePositive: "/img/man/男正面亮切图/man-arm4.png",
               flag: true
            },
            {
               label: "右肩",
               position: "G",
               femaleClassName: "w-arm3",
               maleClassName: "m-arm1",
               femalePositive: "/img/woman/女正面暗切图/woman-arm1.png",
               malePositive: "/img/man/男正面暗切图/man-arm1.png",
               brightFemalePositive: "/img/woman/女正面亮切图/woman-arm1.png",
               brightMalePositive: "/img/man/男正面亮切图/man-arm1.png",
               flag: true
            },
            {
               label: "右臂",
               position: "H",
               femaleClassName: "w-arm4",
               maleClassName: "m-arm2",
               femalePositive: "/img/woman/女正面暗切图/woman-arm2.png",
               malePositive: "/img/man/男正面暗切图/man-arm2.png",
               brightFemalePositive: "/img/woman/女正面亮切图/woman-arm2.png",
               brightMalePositive: "/img/man/男正面亮切图/man-arm2.png",
               flag: true
            },
            {
               label: "左大腿",
               position: "I",
               femaleClassName: "w-leg1",
               maleClassName: "m-leg3",
               femalePositive: "/img/woman/女正面暗切图/woman-leg3.png",
               malePositive: "/img/man/男正面暗切图/man-leg3.png",
               brightFemalePositive: "/img/woman/女正面亮切图/woman-leg3.png",
               brightMalePositive: "/img/man/男正面亮切图/man-leg3.png",
               flag: true
            },
            {
               label: "左膝盖",
               position: "J",
               femaleClassName: "w-knee1",
               maleClassName: "m-knee2",
               femalePositive: "/img/woman/女正面暗切图/woman-knee2.png",
               malePositive: "/img/man/男正面暗切图/man-knee2.png",
               brightFemalePositive: "/img/woman/女正面亮切图/woman-knee2.png",
               brightMalePositive: "/img/man/男正面亮切图/man-knee2.png",
               flag: true
            },
            {
               label: "左小腿",
               position: "K",
               femaleClassName: "w-leg2",
               maleClassName: "m-leg4",
               femalePositive: "/img/woman/女正面暗切图/woman-leg4.png",
               malePositive: "/img/man/男正面暗切图/man-leg4.png",
               brightFemalePositive: "/img/woman/女正面亮切图/woman-leg4.png",
               brightMalePositive: "/img/man/男正面亮切图/man-leg4.png",
               flag: true
            },
            {
               label: "右大腿",
               position: "L",
               femaleClassName: "w-leg3",
               maleClassName: "m-leg1",
               femalePositive: "/img/woman/女正面暗切图/woman-leg1.png",
               malePositive: "/img/man/男正面暗切图/man-leg1.png",
               brightFemalePositive: "/img/woman/女正面亮切图/woman-leg1.png",
               brightMalePositive: "/img/man/男正面亮切图/man-leg1.png",
               flag: true
            },
            {
               label: "右膝盖",
               position: "M",
               femaleClassName: "w-knee2",
               maleClassName: "m-knee1",
               femalePositive: "/img/woman/女正面暗切图/woman-knee1.png",
               malePositive: "/img/man/男正面暗切图/man-knee1.png",
               brightFemalePositive: "/img/woman/女正面亮切图/woman-knee1.png",
               brightMalePositive: "/img/man/男正面亮切图/man-knee1.png",
               flag: true
            },
            {
               label: "右小腿",
               position: "N",
               femaleClassName: "w-leg4",
               maleClassName: "m-leg2",
               femalePositive: "/img/woman/女正面暗切图/woman-leg2.png",
               malePositive: "/img/man/男正面暗切图/man-leg2.png",
               brightFemalePositive: "/img/woman/女正面亮切图/woman-leg2.png",
               brightMalePositive: "/img/man/男正面亮切图/man-leg2.png",
               flag: true
            }
         ],
         // 背面人体模型图
         backModel: [
            {
               label: "头部",
               position: "A",
               femaleClassName: "w-head",
               maleClassName: "m-head",
               femaleBack: "/img/woman/女背面暗切图/woman-head.png",
               maleBack: "/img/man/男背面暗切图/man-head.png",
               brightFemaleBack: "/img/woman/女背面亮切图/woman-head.png",
               brightMaleBack: "/img/man/男背面亮切图/man-head.png",
               flag: true
            },
            {
               label: "颈部",
               position: "O",
               femaleClassName: "w-neck",
               maleClassName: "m-neck",
               femaleBack: "/img/woman/女背面暗切图/woman-neck.png",
               maleBack: "/img/man/男背面暗切图/man-neck.png",
               brightFemaleBack: "/img/woman/女背面亮切图/woman-neck.png",
               brightMaleBack: "/img/man/男背面亮切图/man-neck.png",
               flag: true
            },
            {
               label: "背部",
               position: "P",
               femaleClassName: "w-thorax",
               maleClassName: "m-thorax",
               femaleBack: "/img/woman/女背面暗切图/woman-back.png",
               maleBack: "/img/man/男背面暗切图/man-back.png",
               brightFemaleBack: "/img/woman/女背面亮切图/woman-back.png",
               brightMaleBack: "/img/man/男背面亮切图/man-back.png",
               flag: true
            },
            {
               label: "臀部",
               position: "Q",
               femaleClassName: "w-belly",
               maleClassName: "m-belly",
               femaleBack: "/img/woman/女背面暗切图/woman-pygal.png",
               maleBack: "/img/man/男背面暗切图/man-pygal.png",
               brightFemaleBack: "/img/woman/女背面亮切图/woman-pygal.png",
               brightMaleBack: "/img/man/男背面亮切图/man-pygal.png",
               flag: true
            },
            {
               label: "左肩",
               position: "E",
               femaleClassName: "w-arm1",
               maleClassName: "m-arm3",
               femaleBack: "/img/woman/女背面暗切图/woman-arm3.png",
               maleBack: "/img/man/男背面暗切图/man-arm3.png",
               brightFemaleBack: "/img/woman/女背面亮切图/woman-arm3.png",
               brightMaleBack: "/img/man/男背面亮切图/man-arm3.png",
               flag: true
            },
            {
               label: "左臂",
               position: "F",
               femaleClassName: "w-arm2",
               maleClassName: "m-arm4",
               femaleBack: "/img/woman/女背面暗切图/woman-arm4.png",
               maleBack: "/img/man/男背面暗切图/man-arm4.png",
               brightFemaleBack: "/img/woman/女背面亮切图/woman-arm4.png",
               brightMaleBack: "/img/man/男背面亮切图/man-arm4.png",
               flag: true
            },
            {
               label: "右肩",
               position: "G",
               femaleClassName: "w-arm3",
               maleClassName: "m-arm1",
               femaleBack: "/img/woman/女背面暗切图/woman-arm1.png",
               maleBack: "/img/man/男背面暗切图/man-arm1.png",
               brightFemaleBack: "/img/woman/女背面亮切图/woman-arm1.png",
               brightMaleBack: "/img/man/男背面亮切图/man-arm1.png",
               flag: true
            },
            {
               label: "右臂",
               position: "H",
               femaleClassName: "w-arm4",
               maleClassName: "m-arm2",
               femaleBack: "/img/woman/女背面暗切图/woman-arm2.png",
               maleBack: "/img/man/男背面暗切图/man-arm2.png",
               brightFemaleBack: "/img/woman/女背面亮切图/woman-arm2.png",
               brightMaleBack: "/img/man/男背面亮切图/man-arm2.png",
               flag: true
            },
            {
               label: "左大腿",
               position: "I",
               femaleClassName: "w-leg1",
               maleClassName: "m-leg3",
               femaleBack: "/img/woman/女背面暗切图/woman-leg3.png",
               maleBack: "/img/man/男背面暗切图/man-leg3.png",
               brightFemaleBack: "/img/woman/女背面亮切图/woman-leg3.png",
               brightMaleBack: "/img/man/男背面亮切图/man-leg3.png",
               flag: true
            },
            {
               label: "左膝盖",
               position: "J",
               femaleClassName: "w-knee1",
               maleClassName: "m-knee2 m-knee2s",
               femaleBack: "/img/woman/女背面暗切图/woman-knee2.png",
               maleBack: "/img/man/男背面暗切图/man-knee2.png",
               brightFemaleBack: "/img/woman/女背面亮切图/woman-knee2.png",
               brightMaleBack: "/img/man/男背面亮切图/man-knee2.png",
               flag: true
            },
            {
               label: "左小腿",
               position: "K",
               femaleClassName: "w-leg2",
               maleClassName: "m-leg4 m-leg4s",
               femaleBack: "/img/woman/女背面暗切图/woman-leg4.png",
               maleBack: "/img/man/男背面暗切图/man-leg4.png",
               brightFemaleBack: "/img/woman/女背面亮切图/woman-leg4.png",
               brightMaleBack: "/img/man/男背面亮切图/man-leg4.png",
               flag: true
            },
            {
               label: "右大腿",
               position: "L",
               femaleClassName: "w-leg3",
               maleClassName: "m-leg1",
               femaleBack: "/img/woman/女背面暗切图/woman-leg1.png",
               maleBack: "/img/man/男背面暗切图/man-leg1.png",
               brightFemaleBack: "/img/woman/女背面亮切图/woman-leg1.png",
               brightMaleBack: "/img/man/男背面亮切图/man-leg1.png",
               flag: true
            },
            {
               label: "右膝盖",
               position: "M",
               femaleClassName: "w-knee2",
               maleClassName: "m-knee1",
               femaleBack: "/img/woman/女背面暗切图/woman-knee1.png",
               maleBack: "/img/man/男背面暗切图/man-knee1.png",
               brightFemaleBack: "/img/woman/女背面亮切图/woman-knee1.png",
               brightMaleBack: "/img/man/男背面亮切图/man-knee1.png",
               flag: true
            },
            {
               label: "右小腿",
               position: "N",
               femaleClassName: "w-leg4",
               maleClassName: "m-leg2",
               femaleBack: "/img/woman/女背面暗切图/woman-leg2.png",
               maleBack: "/img/man/男背面暗切图/man-leg2.png",
               brightFemaleBack: "/img/woman/女背面亮切图/woman-leg2.png",
               brightMaleBack: "/img/man/男背面亮切图/man-leg2.png",
               flag: true
            }
         ],
         assessResult: "",
         pickerOptions: {
            disabledDate(time) {
               return time.getTime() > Date.now();
            }
         }
      };
   },
   created() {
      window.addEventListener("resize", this.init);
   },
   mounted() {
      this.init();
   },

   methods: {
      init() {
         window.screenWidth = document.body.clientWidth;
         this.screenWidth = window.screenWidth;
         if (this.screenWidth <= 768) {
            this.isFullscreen = true;
         } else {
            this.isFullscreen = false;
         }
         window.onresize = () => {
            setTimeout(() => {
               window.screenWidth = document.body.clientWidth;
               this.screenWidth = window.screenWidth;
            }, 0);
         };
      },
      setInfo(data) {
         setTimeout(() => {
            this.dialogFormVisible = true;
            this.form.assessmentResults = this.assessResult;
            this.positionList.forEach(item => {
               if (item.value === data.position) {
                  this.form.prePosition = item.label;
                  this.positionValue = item.value;
               }
            });
         }, 0);
      },
      brightMethods(data) {
         this.frontModel.forEach(i => {
            if (i.position === data) {
               i.flag = false;
            }
         });
         this.backModel.forEach(j => {
            if (j.position === data) {
               j.flag = false;
            }
         });
      },
      clearBright() {
         this.frontModel.forEach(i => {
            i.flag = true;
         });
         this.backModel.forEach(j => {
            j.flag = true;
         });
      },
      clearForm() {
         this.form.prePosition = "";
         this.form.byStages = "";
         this.form.assessmentResults = "";
         this.form.soreRange = "";
         this.form.nursingMeasures = "";
         this.form.skinConditionPicture = "";
      },
      submitAdd(form) {
         this.$refs[form].validate(valid => {
            if (valid) {
               this.form.skinConditionPicture = this.$refs.photoGraphChild.fileName;
               this.form.noteTime = dateFormat(new Date())
               this.submitAddLoading = true;
               // console.log(this.form)
               addRecord(this.form)
                  .then(response => {})
                  .then(() => {
                     this.$message({
                        showClose: true,
                        message: "添加成功",
                        type: "success"
                     });
                     // 刷新表格
                     this.brightMethods(this.positionValue);
                     this.$parent.addGetList();
                     this.$refs.photoGraphChild.deleteImg();
                     this.clearForm();
                     this.dialogFormVisible = false;
                     this.submitAddLoading = false;
                  });
            } else {
               console.log("error submit!!");
               return false;
            }
         });
      },
      close(form) {
         this.clearForm();
         this.$refs.photoGraphChild.deleteImg();
         this.dialogFormVisible = false;
         this.$refs[form].resetFields();
      }
   }
};
</script>
<style scoped="scoped">
.person {
   width: 164px;
   height: 331px;
   position: relative;
   top: -15px;
   margin: 0 auto;
   transform: scale(0.9);
}
/* 头 */
.w-head {
   position: absolute;
   left: 50%;
   top: 4px;
   transform: translateX(-50%);
   cursor: pointer;
}
/* 喉咙 */
.w-neck {
   position: absolute;
   top: 46px;
   left: 50%;
   transform: translateX(-55%);
   cursor: pointer;
}
/* 胸部 */
.w-thorax {
   position: absolute;
   top: 57px;
   left: 50%;
   transform: translateX(-59%);
   cursor: pointer;
}
/* 腹部 */
.w-belly {
   position: absolute;
   top: 111px;
   left: 50%;
   transform: translateX(-56%);
   cursor: pointer;
}
/* 右肩 */
.w-arm1 {
   position: absolute;
   cursor: pointer;
   right: 2px;
   top: 53px;
}
/* 右臂 */
.w-arm2 {
   position: absolute;
   cursor: pointer;
   right: -13px;
   top: 114px;
}
/* 左肩 */
.w-arm3 {
   position: absolute;
   cursor: pointer;
   left: 0px;
   top: 57px;
}
/* 左臂 */
.w-arm4 {
   position: absolute;
   cursor: pointer;
   left: -19px;
   top: 112px;
}
/* 右大腿 */
.w-leg1 {
   position: absolute;
   cursor: pointer;
   right: 52px;
   top: 155px;
}
/* 右膝盖 */
.w-knee1 {
   position: absolute;
   cursor: pointer;
   right: 46px;
   top: 215px;
}
/* 右小腿 */
.w-leg2 {
   position: absolute;
   cursor: pointer;
   right: 38px;
   top: 236px;
}
/* 左大腿 */
.w-leg3 {
   position: absolute;
   cursor: pointer;
   left: 43px;
   top: 155px;
}
/* 左膝盖 */
.w-knee2 {
   position: absolute;
   cursor: pointer;
   left: 40px;
   top: 215px;
}
/* 左小腿 */
.w-leg4 {
   position: absolute;
   cursor: pointer;
   left: 23px;
   top: 236px;
}

/* 头 */
.m-head {
   position: absolute;
   left: 50%;
   top: 3px;
   transform: translateX(-50%);
   cursor: pointer;
}
/* 喉咙 */
.m-neck {
   position: absolute;
   top: 44px;
   left: 50%;
   transform: translateX(-50%);
   cursor: pointer;
}
/* 胸部 */
.m-thorax {
   position: absolute;
   top: 55px;
   left: 50%;
   transform: translateX(-50%);
   cursor: pointer;
}
/* 腹部 */
.m-belly {
   position: absolute;
   top: 107px;
   left: 50%;
   transform: translateX(-50%);
   cursor: pointer;
}
/* 胳膊左上 */
.m-arm1 {
   position: absolute;
   cursor: pointer;
   left: 20px;
   top: 52px;
}
/* 左臂 */
.m-arm2 {
   position: absolute;
   cursor: pointer;
   left: -32px;
   top: 87px;
}
/* 右肩 */
.m-arm3 {
   position: absolute;
   cursor: pointer;
   right: 19px;
   top: 52px;
}
/* 右臂 */
.m-arm4 {
   position: absolute;
   cursor: pointer;
   right: -33px;
   top: 88px;
}
/* 左大腿 */
.m-leg1 {
   position: absolute;
   cursor: pointer;
   left: 48px;
   top: 160px;
}
/* 左膝盖 */
.m-knee1 {
   position: absolute;
   cursor: pointer;
   left: 47px;
   top: 216px;
}
/* 左小腿 */
.m-leg2 {
   position: absolute;
   cursor: pointer;
   left: 27px;
   top: 241px;
}
/* 右大腿 */
.m-leg3 {
   position: absolute;
   cursor: pointer;
   right: 47px;
   top: 160px;
}
/* 右膝盖 */
.m-knee2 {
   position: absolute;
   cursor: pointer;
   right: 45px;
   top: 216px;
}
/* 右小腿 */
.m-leg4 {
   position: absolute;
   cursor: pointer;
   right: 29px;
   top: 241px;
}
.m-knee2s {
   right: 46px;
}
.m-leg4s {
   right: 25px;
}
</style>
