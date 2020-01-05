<template>
   <!-- 患者信息 -->
   <div style="padding:10px 0px;height:800px">
      <el-form
         :label-position="labelPosition"
         label-width="150px"
         :model="formLabelAlign"
         v-loading="loading"
      >
         <el-row>
            <el-col class="el-col el-col-12 el-col-offset-0 el-col-xs-24 el-col-md-8">
               <el-form-item label="住院号:">
                  <el-input v-model="formLabelAlign.hospitalnumber" disabled></el-input>
               </el-form-item>
            </el-col>
            <el-col class="el-col el-col-12 el-col-offset-0 el-col-xs-24 el-col-md-8">
               <el-form-item label="床号:">
                  <el-input v-model="formLabelAlign.bedName" disabled></el-input>
               </el-form-item>
            </el-col>
            <el-col class="el-col el-col-12 el-col-offset-0 el-col-xs-24 el-col-md-8">
               <el-form-item label="患者姓名:">
                  <el-input v-model="formLabelAlign.name" disabled></el-input>
               </el-form-item>
            </el-col>
            <el-col class="el-col el-col-12 el-col-offset-0 el-col-xs-24 el-col-md-8">
               <el-form-item label="性别">
                  <el-select
                     v-model="formLabelAlign.gender"
                     style="width:100%"
                     placeholder
                     disabled
                  >
                     <el-option label="男" value="1"></el-option>
                     <el-option label="女" value="0"></el-option>
                  </el-select>
               </el-form-item>
            </el-col>
            <el-col class="el-col el-col-12 el-col-offset-0 el-col-xs-24 el-col-md-8">
               <el-form-item label="年龄:">
                  <el-input v-model="formLabelAlign.age" disabled></el-input>
               </el-form-item>
            </el-col>
            <!-- <el-col
               class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-8"
            >
               <el-form-item label="月龄:">
                  <el-input v-model="formLabelAlign.monthage" disabled></el-input>
               </el-form-item>
            </el-col>-->
            <el-col class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-8">
               <el-form-item label="新生儿出生体重:">
                  <el-input v-model="formLabelAlign.birthweight" disabled></el-input>
               </el-form-item>
            </el-col>
            <el-col class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-8">
               <el-form-item label="新生儿入院体重:">
                  <el-input v-model="formLabelAlign.hospitalweight" disabled></el-input>
               </el-form-item>
            </el-col>
            <el-col class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-8">
               <el-form-item label="出生日期:">
                  <el-date-picker
                     type="date"
                     v-model="formLabelAlign.birthday"
                     style="width:100%"
                     disabled
                  ></el-date-picker>
               </el-form-item>
            </el-col>
            <el-col class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-8">
               <el-form-item label="民族:">
                  <el-input v-model="formLabelAlign.nation" disabled></el-input>
               </el-form-item>
            </el-col>

            <el-col class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-8">
               <el-form-item label="身份证件号:">
                  <el-input v-model="formLabelAlign.idNumber" disabled></el-input>
               </el-form-item>
            </el-col>
            <el-col class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-8">
               <el-form-item label="身份证件类型:">
                  <el-input v-model="formLabelAlign.idType" disabled></el-input>
               </el-form-item>
            </el-col>
            <el-col class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-8">
               <el-form-item label="婚姻状况:">
                  <el-input v-model="formLabelAlign.marriage" disabled></el-input>
               </el-form-item>
            </el-col>

            <el-col class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-8">
               <el-form-item label="血型:">
                  <el-select v-model="formLabelAlign.blood" style="width:100%" placeholder disabled>
                     <el-option
                        v-for="state in bloodType"
                        :label="state.label"
                        :value="state.value"
                        :key="state.value"
                     ></el-option>
                  </el-select>
               </el-form-item>
            </el-col>
            <el-col class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-8">
               <el-form-item label="入科时间:">
                  <el-date-picker
                     v-model="formLabelAlign.entranceTime"
                     type="datetime"
                     align="right"
                     style="width:100%"
                     disabled
                  ></el-date-picker>
               </el-form-item>
            </el-col>
            <el-col class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-8">
               <el-form-item label="Rfid编号:">
                  <el-input v-model="formLabelAlign.rfidId" disabled></el-input>
               </el-form-item>
            </el-col>

            <el-col class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-8">
               <el-form-item label="入科床位:">
                  <el-input v-model="formLabelAlign.admissionBeds" disabled></el-input>
               </el-form-item>
            </el-col>
            <el-col class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-8">
               <el-form-item label="入科科室:">
                  <el-select
                     v-model="formLabelAlign.admissionDepartment"
                     style="width: 100%;"
                     placeholder
                     disabled
                  >
                     <el-option
                        v-for="state in administrative"
                        :label="state.label"
                        :value="state.value"
                        :key="state.value"
                     ></el-option>
                  </el-select>
               </el-form-item>
            </el-col>
            <el-col class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-8">
               <el-form-item label="入科途径:">
                  <el-input v-model="formLabelAlign.admissionPath" disabled></el-input>
               </el-form-item>
            </el-col>

            <el-col class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-8">
               <el-form-item label="入院时间:">
                  <el-date-picker
                     v-model="formLabelAlign.timeOfAdmission"
                     type="datetime"
                     align="right"
                     style="width:100%"
                     disabled
                  ></el-date-picker>
               </el-form-item>
            </el-col>
            <el-col class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-8">
               <el-form-item label="联系电话:">
                  <el-input v-model="formLabelAlign.phone" disabled></el-input>
               </el-form-item>
            </el-col>
            <el-col class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-8">
               <el-form-item label="在科天数:">
                  <el-input v-model="formLabelAlign.sectionTime" disabled></el-input>
               </el-form-item>
            </el-col>

            <el-col class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-8">
               <el-form-item label="病历号:">
                  <el-input v-model="formLabelAlign.medicalRecords" disabled></el-input>
               </el-form-item>
            </el-col>
            <el-col class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-8">
               <el-form-item label="门诊号:">
                  <el-input v-model="formLabelAlign.outpatient" disabled></el-input>
               </el-form-item>
            </el-col>

            <el-col class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-8">
               <el-form-item label="就诊卡号:">
                  <el-input v-model="formLabelAlign.seedoctor" disabled></el-input>
               </el-form-item>
            </el-col>
            <el-col class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-8">
               <el-form-item label="转科（来源）科室:">
                  <el-input v-model="formLabelAlign.turndepartment" disabled></el-input>
               </el-form-item>
            </el-col>
            <el-col class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-8">
               <el-form-item label="修改时间:">
                  <el-date-picker
                     v-model="formLabelAlign.updateTime"
                     type="datetime"
                     align="right"
                     style="width:100%"
                     disabled
                  ></el-date-picker>
               </el-form-item>
            </el-col>

            <el-col class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-8">
               <el-form-item label="修改该条数据的用户:">
                  <el-input v-model="formLabelAlign.updateUserId" disabled></el-input>
               </el-form-item>
            </el-col>
            <el-col class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-8">
               <el-form-item label="联系人与患者关系:">
                  <el-input v-model="formLabelAlign.relation" disabled></el-input>
               </el-form-item>
            </el-col>

            <el-col class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-8">
               <el-form-item label="联系人所在详情地址:">
                  <el-input v-model="formLabelAlign.contactlocation" disabled></el-input>
               </el-form-item>
            </el-col>
            <el-col class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-8">
               <el-form-item label="患者其他联系人:">
                  <el-input v-model="formLabelAlign.contactperson" disabled></el-input>
               </el-form-item>
            </el-col>

            <el-col class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-8">
               <el-form-item label="联系人联系电话:">
                  <el-input v-model="formLabelAlign.contactphone" disabled></el-input>
               </el-form-item>
            </el-col>
            <el-col class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-8">
               <el-form-item label="创建当前数据的时间:">
                  <el-input v-model="formLabelAlign.createTime" disabled></el-input>
               </el-form-item>
            </el-col>
            <el-col class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-8">
               <el-form-item label="创建当前数据的用户:">
                  <el-input v-model="formLabelAlign.createUserId" disabled></el-input>
               </el-form-item>
            </el-col>

            <el-col class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-8">
               <el-form-item label="现住详细地址:">
                  <el-input v-model="formLabelAlign.currentaddress" disabled></el-input>
               </el-form-item>
            </el-col>
            <el-col class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-8">
               <el-form-item label="现居住城市:">
                  <el-input v-model="formLabelAlign.currentaddresscity" disabled></el-input>
               </el-form-item>
            </el-col>
            <el-col class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-8">
               <el-form-item label="现居住地址区县:">
                  <el-input v-model="formLabelAlign.currentaddresscounty" disabled></el-input>
               </el-form-item>
            </el-col>

            <el-col class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-8">
               <el-form-item label="现住省份:">
                  <el-input v-model="formLabelAlign.currentaddressprovince" disabled></el-input>
               </el-form-item>
            </el-col>
            <el-col class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-8">
               <el-form-item label="出科科室:">
                  <el-input v-model="formLabelAlign.dischargeDepartment" disabled></el-input>
               </el-form-item>
            </el-col>
            <el-col class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-8">
               <el-form-item label="出科时间:">
                  <el-date-picker
                     v-model="formLabelAlign.dischargeTime"
                     type="datetime"
                     align="right"
                     style="width:100%"
                     disabled
                  ></el-date-picker>
               </el-form-item>
            </el-col>

            <el-col class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-8">
               <el-form-item label="出科类型:">
                  <el-select
                     v-model="formLabelAlign.dischargeType"
                     style="width: 100%;"
                     placeholder
                     disabled
                  >
                     <el-option
                        v-for="state in departure"
                        :label="state.label"
                        :value="state.value"
                        :key="state.value"
                     ></el-option>
                  </el-select>
               </el-form-item>
            </el-col>
            <el-col class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-8">
               <el-form-item label="入科开始时间:">
                  <el-date-picker
                     v-model="formLabelAlign.entryStartTime"
                     type="datetime"
                     align="right"
                     style="width:100%"
                     disabled
                  ></el-date-picker>
               </el-form-item>
            </el-col>
            <el-col class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-8">
               <el-form-item label="入科结束时间:">
                  <el-date-picker
                     v-model="formLabelAlign.entryEndTime"
                     type="datetime"
                     align="right"
                     style="width:100%"
                     disabled
                  ></el-date-picker>
               </el-form-item>
            </el-col>
            <el-col class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-8">
               <el-form-item label="评估时间:">
                  <el-date-picker
                     v-model="formLabelAlign.fadvicetime"
                     type="datetime"
                     align="right"
                     style="width:100%"
                     disabled
                  ></el-date-picker>
               </el-form-item>
            </el-col>
            <el-col class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-8">
               <el-form-item label="评估医生姓名:">
                  <el-input v-model="formLabelAlign.fadviceusername" disabled></el-input>
               </el-form-item>
            </el-col>
            <el-col class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-8">
               <el-form-item label="患者住院次数:">
                  <el-input v-model="formLabelAlign.frequency" disabled></el-input>
               </el-form-item>
            </el-col>

            <el-col :span="24" class="el-col-24">
               <el-form-item label="过敏史:">
                  <el-input
                     type="textarea"
                     :autosize="{ minRows: 2, maxRows: 4}"
                     v-model="formLabelAlign.allergichistory"
                     disabled
                  ></el-input>
               </el-form-item>
            </el-col>

            <el-col :span="24" class="el-col-24">
               <el-form-item label="病情描述:">
                  <el-input
                     type="textarea"
                     :autosize="{ minRows: 2, maxRows: 4}"
                     v-model="formLabelAlign.diagnosis"
                     disabled
                  ></el-input>
               </el-form-item>
            </el-col>
         </el-row>
      </el-form>
   </div>
</template>

<script>
import { mapGetters } from "vuex";
import { dateFormat, calcDate } from "@/util/date";
import { getObj, departure, getsection } from "@/api/icu/patient/index";

export default {
   computed: {
      ...mapGetters(["screen"])
   },
   props: {
      messages: Object
   },
   watch: {
      messages: {
         handler(newValue, oldValue) {
            this.messages = newValue;
            this.clearForm();
            this.getList(this.messages.id);
         },
         deep: true
      }
   },
   data() {
      return {
         labelPosition: "right",
         loading: false,
         // 出院类型
         departure: [],
         // 科室
         administrative: [],
         // 血型
         bloodType: [],
         formLabelAlign: {
            hospitalnumber: "",
            name: "",
            gender: "",
            age: "",
            monthage: "",
            birthweight: "",
            hospitalweight: "",
            birthday: "",
            nation: "",
            idNumber: "",
            idType: "",
            marriage: "",
            blood: "",
            entranceTime: "",
            rfidId: "",
            admissionBeds: "",
            admissionDepartment: "",
            admissionPath: "",
            timeOfAdmission: "",
            phone: "",
            sectionTime: "",
            medicalRecords: "",
            outpatient: "",
            seedoctor: "",
            turndepartment: "",
            updateTime: "",
            updateUserId: "",
            relation: "",
            contactlocation: "",
            contactperson: "",
            contactphone: "",
            createTime: "",
            createUserId: "",
            currentaddress: "",
            currentaddresscity: "",
            currentaddresscounty: "",
            currentaddressprovince: "",
            dischargeDepartment: "",
            dischargeTime: "",
            dischargeType: "",
            entryStartTime: "",
            entryEndTime: "",
            fadvicetime: "",
            fadviceusername: "",
            frequency: "",
            allergichistory: "",
            diagnosis: ""
         }
      };
   },
   mounted() {
      this.getDicData();
      if (this.messages.id) {
         this.getList(this.messages.id);
      } else {
         this.$message.warning("无患者");
      }
   },
   methods: {
      getList(id) {
         this.loading = true;
         getObj(id).then(response => {
            this.formLabelAlign = response.data.data;
            // console.log(this.formLabelAlign);
            this.loading = false;
            if (this.formLabelAlign.birthweight) {
               this.formLabelAlign.birthweight =
                  this.formLabelAlign.birthweight + "kg";
            } else {
            }
            if (this.formLabelAlign.hospitalweight) {
               this.formLabelAlign.hospitalweight =
                  this.formLabelAlign.hospitalweight + "kg";
            }
         });
      },
      getDicData() {
         departure("icu_departure").then(res => {
            this.departure = res.data.data;
         });
         departure("blood_type").then(res => {
            this.bloodType = res.data.data;
         });
         getsection().then(res => {
            res.data.data.forEach(i => {
               this.administrative.push({
                  value: String(i.deptId),
                  label: i.name
               });
            });
         });
      },
      clearForm() {
         this.departure = [];
         this.administrative = [];
         this.bloodType = [];
         this.formLabelAlign = {
            hospitalnumber: "",
            name: "",
            gender: "",
            age: "",
            monthage: "",
            birthweight: "",
            monthage: "",
            birthday: "",
            nation: "",
            idNumber: "",
            idType: "",
            marriage: "",
            blood: "",
            entranceTime: "",
            rfidId: "",
            admissionBeds: "",
            admissionDepartment: "",
            admissionPath: "",
            timeOfAdmission: "",
            phone: "",
            sectionTime: "",
            medicalRecords: "",
            outpatient: "",
            seedoctor: "",
            turndepartment: "",
            updateTime: "",
            updateUserId: "",
            relation: "",
            contactlocation: "",
            contactperson: "",
            contactphone: "",
            createTime: "",
            createUserId: "",
            currentaddress: "",
            currentaddresscity: "",
            currentaddresscounty: "",
            currentaddressprovince: "",
            dischargeDepartment: "",
            dischargeTime: "",
            dischargeType: "",
            entryStartTime: "",
            entryEndTime: "",
            fadvicetime: "",
            fadviceusername: "",
            frequency: "",
            allergichistory: "",
            diagnosis: ""
         };
      }
   }
};
</script>

<style scoped>
@media only screen and (max-width: 992px) {
   .el-col-24 {
      width: 50%;
   }
}
@media only screen and (max-width: 750px) {
   .el-col-24 {
      width: 100%;
   }
}
</style>
<style lang="scss" scoped>
.el-col {
   margin-bottom: 0px;
}
</style>
