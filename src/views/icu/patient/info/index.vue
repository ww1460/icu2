<template>
   <!-- 患者首页 -->
   <div class="indexCon patIndex">
      <basic-container>
         <div class="indexContent">
            <div class="nurseTabs">
               <el-tabs v-model="activeName" @tab-click="handleClick" class="avue-tags__box">
                  <el-tab-pane label="患者任务" name="first">
                     <taskList :messages="message" :patientFlag="patientFlag" v-if="tabIndex ==  0" />
                  </el-tab-pane>
                  <el-tab-pane label="生命体征" name="second">
                     <vitalSigns :messages="message" v-if="tabIndex ==  1" />
                  </el-tab-pane>
                  <el-tab-pane label="出入量" name="third">
                     <intakeAndOutput :messages="message" v-if="tabIndex ==  2" />
                  </el-tab-pane>
                  <el-tab-pane label="患者设备" name="fourth">
                     <equipmentStatus :messages="message" v-if="tabIndex ==  3" />
                  </el-tab-pane>
                  <el-tab-pane label="患者管路" name="fifth">
                     <pipelineStatus :messages="message" v-if="tabIndex ==  4" />
                  </el-tab-pane>
                  <el-tab-pane label="患者压疮" name="sixth">
                     <pressureSore :messages="message" v-if="tabIndex ==  5" />
                  </el-tab-pane>
                  <el-tab-pane label="跌倒(坠床)报告" name="seventh">
                     <tumble :messages="message" v-if="tabIndex ==  6" />
                  </el-tab-pane>
                  <el-tab-pane label="约束记录" name="eighth">
                     <constraint :messages="message" v-if="tabIndex ==  7" />
                  </el-tab-pane>
                  <el-tab-pane label="知情文书" name="ten">
                     <document :messages="message" v-if="tabIndex ==  8" />
                  </el-tab-pane>
                  <el-tab-pane label="患者基本信息" name="eleven">
                     <patientNursing :messages="message" v-if="tabIndex ==  9" />
                  </el-tab-pane>
               </el-tabs>
               <el-dropdown class="avue-tags__menu" style="z-index:9999">
                  <el-button type="primary" size="mini" v-model="message.name">
                     {{message.name}} {{message.bedName}}
                     <i
                        class="el-icon-arrow-down el-icon--right"
                     />
                  </el-button>
                  <el-dropdown-menu>
                     <div class="dropdownMenu">
                        <el-button
                           :title="item.name + item.bedName"
                           v-for="(item,index) in patNames"
                           :key="index"
                           :class="[(item.patientId == message.patientId?'el-button el-button--primary':'')]"
                           @click="patient(item)"
                        >{{item.name}} {{item.bedName}}</el-button>
                     </div>
                  </el-dropdown-menu>
               </el-dropdown>
            </div>
         </div>
      </basic-container>
   </div>
</template>

<script>
import { fetchList, getnurse } from "@/api/icu/patient/index";
import { mapGetters, mapState } from "vuex";
import equipmentStatus from "@/views/icu/patient/info/equipmentStatus";
import pipelineStatus from "@/views/icu/patient/info/pipelineStatus";
import vitalSigns from "@/views/icu/patient/info/vitalSigns";
import patientNursing from "@/views/icu/patient/info/patientNursing";
import pressureSore from "@/views/icu/patient/info/pressureSore";
import taskList from "@/views/icu/nurse/nurseIndex/taskList";
import document from "@/views/icu/patient/info/document";
import constraint from "@/views/icu/patient/info/constraint";
import tumble from "@/views/icu/patient/info/tumble";
import intakeAndOutput from "@/views/icu/patient/info/intakeAndOutput";

export default {
   name: "patientHomePage",
   components: {
      equipmentStatus,
      pipelineStatus,
      vitalSigns,
      patientNursing,
      pressureSore,
      taskList,
      document,
      constraint,
      tumble,
      intakeAndOutput
   },
   watch:{
      patientMessage:{
         handler(newValue, oldValue){
            this.patient(newValue)
         }
      }
   },
   data() {
      return {
         // 标签页Tabs
         activeName: "first",
         tabIndex: 0,
         // 患者
         patNames: [],
         // 患者信息
         message: {},
         page: {
            total: 0, // 总页数
            currentPage: 1, // 当前页数
            pageSize: 20 // 每页显示多少条
         },
         disable: false,
         patientFlag:true
      };
   },
   computed: {
      ...mapGetters(["permissions", "all_patients",'patientMessage']),
      ...mapState({
         roleCodes: state => state.user.roleCodes
      })
   },
   created() {
      let data = JSON.parse(sessionStorage.getItem("pigx-all_patients"))
         .content;
      this.patNames = data;
      if (this.$route.query.patient != undefined) {
         data = this.$route.query.patient;
         this.message = data;
      } else {
         this.message = JSON.parse(sessionStorage.getItem("pigx-patientMessage")).content;
      }
      if (this.message) {
         this.patientFlag = true
      }
   },
   activated() {
      let data = JSON.parse(sessionStorage.getItem("pigx-all_patients"))
         .content;
      this.patNames = data;
      if (this.$route.query.patient != undefined) {
         data = this.$route.query.patient;
         this.message = data;
      } else {
         this.message = this.patientMessage
      }
   },
   methods: {
      // 标签页tabs
      handleClick(tab, event) {
         this.tabIndex = Number(tab.index);
      },
      patient(item) {
         this.$store.commit('SET_MESSAGE',item)
         this.message = this.patientMessage
      },
   }
};
</script>



<style  lang="scss">
.indexCon {
   .avue-tags__menu {
      line-height: 40px;
      padding-right: 10px;
      margin-right: 1%;
   }
   .el-tabs__nav-wrap.is-scrollable {
      padding: 0 30px;
   }
   .avue-tags__box {
      padding-right: 0;
   }
   .el-card__body {
      padding-top: 0px;
   }
   .el-tabs__header {
      width: 80%;
   }
}
</style>