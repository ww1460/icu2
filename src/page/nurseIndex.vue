<template>
   <div class="nurseIndex_css">
      <div class="indexCon clearfix">
         <!-- <basic-container> -->
         <div class="indexContent">
            <!-- 标签页tabs -->
            <div class="nurseTabs">
               <el-tabs v-model="activeName" class="avue-tags__box">
                  <el-tab-pane label="任务列表" name="first" lazy>
                     <taskList :messages="message"></taskList>
                  </el-tab-pane>
                  <el-tab-pane label="个人预警" name="second" lazy>
                     <warningRecord :messages="message"></warningRecord>
                  </el-tab-pane>
                  <!-- <el-tab-pane label="护理计划" name="third">护理计划</el-tab-pane> -->
                  <el-tab-pane label="排班计划" name="fourth" lazy>
                     <schedulingPlan></schedulingPlan>
                  </el-tab-pane>
                  <el-tab-pane label="日历记事本" name="fifth" lazy>
                     <notepad></notepad>
                  </el-tab-pane>
                  <el-tab-pane label="职业暴露" name="sixth" lazy>
                     <exposed></exposed>
                  </el-tab-pane>
                  <el-tab-pane label="健康评估" name="seventh" lazy>
                     <healthAss></healthAss>
                  </el-tab-pane>
                  <el-tab-pane label="排班申请" name="eight" lazy>
                     <SchedulingApply></SchedulingApply>
                  </el-tab-pane>
               </el-tabs>

               <el-dropdown class="avue-tags__menu">
                  <el-button v-model="name" type="primary" size="mini">
                     {{ message.name }} {{message.bedName}}
                     <i
                        class="el-icon-arrow-down el-icon--right"
                     />
                  </el-button>
                  <el-dropdown-menu>
                     <div class="dropdownMenu">
                        <el-button
                           v-for="(item,index) in patientNames"
                           :title="item.patientName"
                           :key="index"
                           :class="['el-button--small',(item.id == message.id?'el-button el-button--primary':'')]"
                           @click="patientName(item.name,item.id,item.patientId,item)"
                        >{{ item.name }} {{ item.bedName }}</el-button>
                        <!-- <el-button @click="lookAll()" class="el-button--small">全部患者</el-button> -->
                     </div>
                  </el-dropdown-menu>
               </el-dropdown>
            </div>
         </div>
         <!-- </basic-container> -->
      </div>
   </div>
</template>

<script>
import { addOj, delObj, fetchInfo, getObj } from "@/api/icu/nurse/wel_task";
// import { tableOption } from '@/const/crud/icu/nurse/wel_task'
import taskList from "../views/icu/nurse/nurseIndex/taskList";
import healthAss from "../views/icu/nurse/nurseIndex/healthAss";
import warningRecord from "../views/icu/nurse/nurseIndex/warningRecord";
import schedulingPlan from "../views/icu/nurse/nurseIndex/schedulingPlan";
import notepad from "../views/icu/nurse/nurseIndex/notepad";
import exposed from "../views/icu/nurse/nurseIndex/exposed";
import SchedulingApply from "../views/icu/nurse/nurseIndex/SchedulingApply";
import { mapGetters } from "vuex";

export default {
   name: "nurseIndex",
   components: {
      taskList,
      warningRecord,
      schedulingPlan,
      notepad,
      healthAss,
      exposed,
      SchedulingApply
   },

   data() {
      return {
         activeNames: ["1", "2", "3", "4"],
         DATA: [],
         patInfo: {},
         nurseInfo: [],
         patientNames: [],
         message: {},
         text: "",
         actor: "",
         count: 0,
         name: "",
         id: "",
         // isText: false,
         progress: 20,

         hoverIndex: -1, //表示当前hover的是第几个li 初始为 -1 或 null 不能为0 0表示第一个li
         // clickIndex: -1, //表示当前点击的是第几个li 初始为 -1 或 null 不能为0 0表示第
         // 标签页Tabs
         activeName: "first"
      };
   },
   computed: {
      ...mapGetters(["permissions", "nurse_patients","patientMessage","nurseIndexFlag"]),
      permissionList() {
         return {
            addBtn: this.vaildData(this.permissions.icu_task_add, false),
            delBtn: this.vaildData(this.permissions.icu_task_del, false),
            editBtn: this.vaildData(this.permissions.icu_task_edit, false)
         };
      }
   },
    watch: {
      patientMessage: {
         handler(newValue, oldValue) {
            this.name = newValue.patientName;
            this.patInfo = newValue;
            this.message = newValue;
         }
      }
   },
   created() {
      if (JSON.parse(sessionStorage.getItem("pigx-nurseIndexFlag"))) {
         this.getNursePatients();
      }else{
         this.$store.dispatch("getAllPatients").then(res => {
            this.getNursePatients();
            
         });
      }
      
      this.getList();

      //  this.patientNames = [];
      // console.log(this.patientNames)
      // 在页面加载时读取sessionStorage里的状态信息
      // if (sessionStorage.getItem("store") ) {
      //     this.$store.replaceState(Object.assign({}, this.$store.state,JSON.parse(sessionStorage.getItem("store"))))
      // }

      // //在页面刷新时将vuex里的信息保存到sessionStorage里
      // window.addEventListener("beforeunload",()=>{
      //     sessionStorage.setItem("store",JSON.stringify(this.$store.state))
      // })
   },
   mounted() {
      //  this.message.patientId=this.patientNames[0].patientId
      // this.message.id=this.patientNames[0].id
      // this.name = "所有患者"
      // alert(this.nurse_patients)
      // console.log(this.nurse_patients)
   },
   methods: {
      // 获取护士个人信息

      patientName(patientName, id, patientId, item) {
         this.name = patientName;
         this.patInfo = item;
         // 存参
         // this.message.id = id;
         // this.message.name = patientName;
         // this.message.patientId = patientId;
         this.$store.commit("SET_MESSAGE", item);
         this.message = this.patientMessage;
         // console.log(this.message)
      },
      lookAll() {
         this.name = "全部患者";
         this.patInfo.bedName = "";
         // this.message.id = null;
         // this.message.name= null
         // this.message.patientId = null;
      },
      // 标签页tabs
      handleClick(tab, event) {
         // console.log(tab, event)
      },
      getNursePatients() {
         var data = [],
            data1 = [];

         if (
            JSON.parse(sessionStorage.getItem("pigx-all_patients")).dataType ===
            "undefined"
         ) {
         } else {
            data = JSON.parse(sessionStorage.getItem("pigx-all_patients"))
               .content;
            data1 = JSON.parse(sessionStorage.getItem("pigx-patientMessage"))
               .content;
         }
         // data.unshift({
         //    name: "全部患者",
         //    patientId: null,
         //    patientName: "全部患者",
         //    bedName: null
         // });
         this.patientNames = data;
         if (data.length == 0) {
            //  this.$message.warning('没有患者 请接班或者进行患者入科后再操作')
         } else {
            this.patName = data1.patientId;
            this.message = data1;
            this.name = data1.patientName;
         }
         this.$store.commit('SET_NURSEINDEXFLAG', true)
         // this.message.id = patName
         // this.message.patientId = null
         // this.patInfo = data[0];
         // this.$store.dispatch("getPatientsByNurseId").then(response => {
         // this.patientNames = this.nurse_patients;
         // this.name = "全部";
         // console.log("getPatientsByNurseId succes")
         // console.log(response)
         // });
      },
      getList() {
         this.tableLoading = true;
         fetchInfo().then(response => {
            this.nurseInfo = response.data.data;
         });
         // console.log(this.nurseInfo.nurseId)
      }
   }
};
</script>
<style lang="scss">
.nurseIndex_css {
   .indexCon .avue-tags__box {
      padding-right: 0;
   }
   .indexCon .el-tabs__header {
      width: 92% !important;
   }
   @media screen and (max-width: 1024px) {
      .indexCon .el-tabs__header {
         width: 85% !important;
      }
   }
}
</style>
<style scoped lang="scss">
.wel-contailer {
   position: relative;
}

.banner-text {
   position: relative;
   padding: 0 20px;
   font-size: 20px;
   text-align: center;
   color: #333;
}

.banner-img {
   position: absolute;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   opacity: 0.8;
   display: none;
}

.actor {
   height: 250px;
   overflow: hidden;
   font-size: 18px;
   color: #333;
}

.actor:after {
   content: "";
   width: 3px;
   height: 25px;
   vertical-align: -5px;
   margin-left: 5px;
   background-color: #333;
   display: inline-block;
   animation: blink 0.4s infinite alternate;
}

.typeing:after {
   animation: none;
}

.avue-view {
   padding: 20px;
}
.indexCon {
   //  width: 100%;
   background-color: #f0f2f5 !important;
}
.indexNurse {
   width: 26%;
   float: left;
   background-color: #fff;
   padding-left: 1%;
   padding-right: 1%;
   margin-left: 1%;
   margin-top: 5px;
}
.indexContent {
   width: 96%;

   background-color: #fff;
   padding-left: 1%;
   padding-right: 1%;
   margin-left: 1%;
   margin-right: 1%;
   margin-top: 5px;
   margin-bottom: 100px;
}
.indexCon .avue-tags__box {
   padding-right: 0;
}
.indexCon .el-tabs__header .is-top {
   width: 85% !important;
}
@media screen and (max-width: 1024px) {
   .indexNurse {
      width: 96%;
   }
   .indexContent {
      width: 96%;
   }
}
.clearfix:after {
   content: "";
   clear: both;
   display: block;
}
.nursePhoto {
   text-align: center;
   background-color: #fff;
   padding-top: 24px;
}
.nursePhoto > div {
   margin-bottom: 5px;
   // font-size: 16px;
}
.nursePhoto > img {
   width: 30%;
   margin-bottom: 10px;
}
.nursePatients {
   margin-top: 24px;
   padding-top: 24px;
   border-top: #eee dashed 1px;
}
.nurseName {
   font-size: 20px;
   font-weight: 500;
}
.nurseInfo > span {
   display: inline-block;
   margin-bottom: 8px;
}
.nursePatients > font {
   margin-bottom: 12px;
   color: rgba(0, 0, 0, 0.85);
   font-weight: 600;
   font-size: 15px;
}
.nur_pat_name {
   margin-left: 10%;
}
.nur_pat_name > span {
   display: inline-block;
   margin: 5px 0 10px 10px;
}
.nur_pat_name :hover {
   color: #1890ff;
}
.hoverBg {
   color: #1890ff;
   cursor: pointer;
}
#basic-table {
   height: 50%;
}
#basic-table th {
   background: #f7f7f7;
   font-size: 12px;
}
#basic-table td {
   color: #8b8b8b;
}
#basic-table td,
#basic-table th {
   padding: 8px;
   border: #ddd solid 1px;
   text-align: center;
   // vertical-align: middle;
}

.task_list {
   margin-bottom: 20px;
}
.table {
   margin-top: -20px;
}

.avue-tags__menu {
   line-height: 40px;
   padding-right: 10px;
   margin-right: 1%;
   z-index: 900;
}

// .el-dropdown-menu {
//   width: 100px;
//   // height: 250px;
//   max-height: 500px !important;

//   text-align: center;
//   overflow-y: auto;
// }

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
<style lang="scss">
/*滚动条样式*/
.el-dropdown-menu::-webkit-scrollbar {
   /*滚动条整体样式*/
   width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
   height: 4px;
}
.el-dropdown-menu::-webkit-scrollbar-thumb {
   /*滚动条里面小方块*/
   border-radius: 5px;
   -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
   background: rgba(0, 0, 0, 0.2);
}
.el-dropdown-menu::-webkit-scrollbar-track {
   /*滚动条里面轨道*/
   -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
   border-radius: 0;
   background: rgba(0, 0, 0, 0.1);
}
</style>