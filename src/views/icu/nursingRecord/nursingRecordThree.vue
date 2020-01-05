<template>
   <!-- 枣庄市立医院ICU护理记录单 -->
   <basic-container>
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
            <h3 class="panel-title">枣庄市立医院ICU护理记录单(III)</h3>
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
         </div>
         <!-- 表格 -->
         <div class="assTable" id="assTable" v-loading="tabLoad">
            <table class="table table-bordered" id="basic-table">
               <thead>
                  <tr>
                     <td :colspan="2" class="first">{{year}}年</td>

                     <td :colspan="16" :rowspan="2">皮肤、病情及护理记录</td>
                     <td :rowspan="2">签名</td>
                  </tr>
                  <tr>
                     <td>日期</td>
                     <td>时间</td>
                  </tr>
               </thead>
               <tbody>
                  <!-- <tr> 
              <td :rowspan="item.child.length+1" id="typeTd">{{item.typeName}}</td>
                  </tr>-->
                  <!-- <tr>
              <td :rowspan="item.child.length+1" id="typeTd"  >{{item.typeName}}</td>
             
                  </tr>-->
                  <tr v-for="(item,index) in recordData" :key="index">
                     <td>{{item.createTime.substr(5,5)}}&nbsp;</td>
                     <td>{{item.createTime.substr(11,5)}}</td>
                     <td
                        :colspan="16"
                        style="text-align:left;padding-left:10px;"
                     >{{item.recordContent}}</td>
                     <td>
                        <img v-if="item.signature!=null&&item.signature!=undefined" :src="item.signature" alt width="80" height="30" />
                        <span v-if="item.signature==null||item.signature==undefined">{{item.nurseName}}</span>
                     </td>
                  </tr>
               </tbody>
               <tfoot></tfoot>
            </table>
         </div>
         <div class="content"></div>
      </div>
      <el-dialog title="提示" :visible.sync="dialogVisible" :fullscreen="isFullscreen" width="60%">
         <avue-sign ref="sign" :width="500"></avue-sign>

         <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleSubmit">保 存</el-button>
            <el-button @click="$refs.sign.clear()">清 空</el-button>
            <el-button @click="dialogVisible = false,$refs.sign.clear()">取 消</el-button>
         </span>
      </el-dialog>
   </basic-container>
</template>

<script>
import { dateFormat } from "@/util/date";
import { mapGetters, mapState } from "vuex";
import {
   getAssess,
   addAss,
   getsection
} from "@/api/icu/nursingRecord/nursingRecordThree.js";
let that;
export default {
   beforeCreate: function() {
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
         img: "",
         depList: [],
         projectCode: "APACHE-II",
         projectId: "",
         min: "",
         max: "",
         name: "",
         range: [],
         isFullscreen: false,
         screenWidth: document.body.clientWidth, // 屏幕尺寸
         dialogVisible: false,
         // 合计
         combined: 0,
         total: [],
         // 患者
         patName: "",
         patientNames: [],

         flagAct: "",
         patInfo: {},
         rangeIf: true,
         num: "",
         watchArr: [],

         recordData: [],
         tabLoad: false,
         year: "",
         dateTime: new Date()
      };
   },
   computed: {
      ...mapGetters(["permissions", "nurse_patients", "dep_patients","patientMessage"]),
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
   created() {
      this.getNursePatients();
      getsection().then(response => {
         this.depList = response.data.data;
      });
   },
   // activated() {
   //    this.getNursePatients();
   //    getsection().then(response => {
   //       this.depList = response.data.data;
   //    });
   // },
   methods: {
      // 请求患者列表
      getNursePatients() {
         this.tabLoad = true;
         let data = JSON.parse(sessionStorage.getItem("pigx-all_patients"))
            .content;
         this.patientNames = data;
         this.patInfo = JSON.parse(sessionStorage.getItem("pigx-patientMessage")).content;
          if(data==undefined){
         this.$message.warning('没有患者')
      }
         this.patName = this.patInfo.patientId;
         this.name = this.patInfo.name;
         
         this.getList();
      },
      patientNameClick(patientName, id, patientId, item) {
         this.patName = patientId;
         this.name = patientName;
         this.$store.commit('SET_MESSAGE',item)
         this.patInfo = this.patientMessage
         this.getList();
      },
      dateChange(val) {
         if (
            dateFormat(val).substr(0, 10) ==
            dateFormat(new Date()).substr(0, 10)
         ) {
            this.dateTime = new Date();
         }

         this.getList();
      },
      getList() {
         this.count = null;

         let params = {
            patientId: this.patName,
            endTime: dateFormat(this.dateTime)
         };
         getAssess(params).then(response => {
            this.recordData = response.data.data;
            this.tabLoad = false;
            if (this.recordData.length > 0) {
               this.year = this.recordData[0].createTime.substr(0, 4);
            } else {
               this.year = dateFormat(new Date()).substr(0, 4);
            }
            // console.log(this.recordData)
            // let numTime
            // if(this.recordData.length==0){
            //     numTime = dateFormat(this.dateTime).substr(0, 10);
            // }else{
            //    numTime = this.recordData[this.recordData.length-1].createTime.substr(0, 10);
            // }
            // console.log(numTime)
            // console.log(this.recordData.length)
            for (let i = this.recordData.length + 1; i <= 24; i++) {
               this.recordData.push({
                  recordContent: "",
                  createTime: '',
                  nurseName: ""
               });
               if (this.recordData.length == 24) {
                  return;
               }
            }
         });
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
      handleSubmit() {
         this.img = this.$refs.sign.submit(80, 30);
         console.log(this.img);
         this.dialogVisible = false;
      }
   }
};
</script>

<style lang="scss" scoped>
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
   width: 100px;
}
.clearfix:after {
   content: "";
   display: block;
   clear: both;
}
.panel-heading {
   padding: 10px 15px;
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
}
.avue-tags__menu {
   line-height: 40px;
   padding-right: 10px;
   margin-top: 18px;
   margin-right: 1%;
   z-index: 100;
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