<template>
   <!-- 难免压疮风险告知书 -->
   <div>
      <div v-if="flag" class="pressureNotice">
         <div style="margin-bottom:5px">
            <el-button
               type="primary"
               @click="printBtn"
               class="el-button el-button--primary el-button--small"
            >
               <i class="el-icon-plus" id="btn"></i>
               <span style="margin-left: 5px;font-size:12px">打&nbsp;印</span>
            </el-button>
         </div>
         <div style="border:1px solid #EBEEF5;padding:20px 25px" id="print">
            <div class="ql-container ql-snow">
               <div class="ql-editor">
                  <div v-html="knowWrit.writContent"></div>
               </div>
            </div>
            <p>
               <span style="font-weight: 600;">
                  （六)患方家属提出的保留事项：
                  <input
                     type="text"
                     v-model="matter"
                     id="matter"
                     style="width: 50%;height:30px;border-top: 0;border-left:0;border-right:0;text-indent:5px;"
                  />
               </span>
               <br />&nbsp;&nbsp;以上风险请家属理解并配合我们的治疗。
               <br />&nbsp;&nbsp;压疮的复杂性、难治性，家属陪护人员不尽防范压疮的义务所应承担的责任，我们患者病情和身体原因将可能发生难免压疮，病房护士已经向我详细告知，我们对压疮的风险表示理解，因此发生的风险，我们愿意承担。
            </p>
            <p style="text-align: right;font-weight: 100;font-size: 18px;line-height:50px">
               患者
               <span v-cloak>{{patientName}}</span>
               的家属签字：
               <span
                  @click="auto()"
                  style="width:100px;height:50px;display:inline-block"
               >
                  <img :src="img" alt width="100" height="50" />
               </span>
            </p>
            <p
               style="text-align: right;font-weight: 100;font-size: 18px;letter-spacing:5px"
            >{{year}}年{{month+1}}月{{day}}日</p>
         </div>
      </div>
      <div class="operation_top" v-if="flag">
         <el-button @click="sub()" class="el-button el-button--primary" :loading="subLoading">提交</el-button>
         <el-button @click="close()">返回</el-button>
      </div>
      <div v-if="!flag">
         <autograph />
      </div>
   </div>
</template>

<script>
import autograph from "@/views/icu/patient/components/autograph";
import {
   patientDocuments,
   informedDocuments
} from "@/api/icu/matron/document/docManage";
import { upDateProcess } from "@/api/icu/patient/process";
import { dateFormat, calcDate } from "@/util/date";
export default {
   name: "pressureNotice",
   props: {
      message: Object
   },
   watch: {
      message: {
         handler(newValue, oldValue) {
            this.message = newValue;
            this.close();
         }
      }
   },
   components: {
      autograph
   },
   data() {
      return {
         flag: true,
         img: "",
         year: "",
         month: "",
         day: "",
         knowWrit: {},
         matter: "",
         patientName: "",
         subLoading: false
      };
   },
   mounted() {
      this.patientName = this.message.name;
      this.gerList();
   },
   methods: {
      gerList() {
         this.year = new Date().getFullYear();
         this.month = new Date().getMonth();
         this.day = new Date().getDate();
         informedDocuments("gwjgwfxgzs")
            .then(response => {
               this.knowWrit = response.data.data[0];
               // console.log(this.knowWrit);
            })
            .catch(() => {
               // alert("请求失败");
            });
      },
      close() {
         this.$parent.returnMethod();
      },
      auto() {
         this.flag = false;
      },
      return(img) {
         this.flag = true;
         // console.log(1);
         this.img = img;
      },
      printBtn() {
         var newstr = document.getElementById("print").innerHTML;
         document.body.innerHTML = newstr;
         window.print();
         window.location.reload();
      },
      sub() {
         // var newstr = document.getElementById("print").innerHTML;
         var newstr = document
            .getElementById("print")
            .innerHTML.replace(
               '<input type="text" id="matter" style="width: 50%; height: 30px; border-top: 0px; border-left: 0px; border-right: 0px; text-indent: 5px;">',
               this.matter
            );
         switch ("") {
            case this.matter:
               this.$message.warning("请填写患方家属提出的保留事项");
               break;
            case this.img:
               this.$message.warning(`请患者 ${this.patientName} 的家属签字`);
               break;
            default:
               this.subLoading = true;
               patientDocuments({
                  knowWritContent: newstr,
                  patientId: this.$parent.patient.patientId,
                  knowWritId: this.knowWrit.knowWritId,
                  patientName: this.$parent.patient.name,
                  signatureTime: dateFormat(new Date())
               }).then(response => {
                  this.$message({
                     message: "提交成功",
                     type: "success"
                  });
                  if (this.$parent.processArr.indexOf("12") == -1) {
                     upDateProcess({
                        flowName: 3,
                        specificStepId: 12,
                        patientId: this.$parent.patient.patientId,
                        id: this.$parent.processId
                     });
                  }
                  this.$parent.twelfthColor = true;
                  this.$parent.addGetList();
                  this.close();
                  this.subLoading = false;
               });
               break;
         }
      }
   }
};
</script>
<style lang="scss">
.weight {
   font-weight: 500;
}
.weight:nth-child(2) {
   font-size: 20px;
}
.weight:nth-child(3) {
   font-weight: 100;
   font-size: 18px;
}
.pressureNotice p {
   line-height: 35px;
   padding: 0 28px;
}
.pressureNotice .span {
   font-weight: 600;
}
.matter {
   width: 50%;
   .center {
      border-radius: 0px;
   }
}
@media screen and (max-width: 1024px) {
   .matter {
      width: 40%;
   }
}
#print .ql-container.ql-snow {
   border: 0px !important;
   padding: 0px !important;
}
.ql-align-center {
   text-align: center;
}
.pressureNotice {
   .el-input__inner {
      border-radius: 0;
   }
}
</style>


