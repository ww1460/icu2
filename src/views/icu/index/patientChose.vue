<template>
   <el-select
      v-model="patientId"
      placeholder="患者姓名"
      size="small"
      @change="chosePatient($event,true)"
      clearable
   >
      <el-option
         v-for="item in patientLists"
         :key="item.id"
         :label="item.patientName + ' ' +item.bedName"
         :value="item.patientId"
         style="width:100%"
      ></el-option>
   </el-select>
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
   name: "patientChose",
   props: {
      getList: Function,
      page: Object
   },
   computed: {
      ...mapGetters(["permissions", "all_patients", "patientMessage"]),
      ...mapState({
         roleCodes: state => state.user.roleCodes
      })
   },
   watch: {
      patientMessage: {
         handler(newValue, oldValue) {
            this.chosePatient(newValue.patientId, false);
         }
      }
   },
   data() {
      return {
         patientLists: [],
         // 选中患者的所有信息
         patientInfo: {},
         // 选中患者id
         patientId: ""
      };
   },
   created() {
      this.getNursePatients();
   },
   activated() {
      this.getNursePatients();
   },
   methods: {
      getNursePatients() {
         let data = JSON.parse(sessionStorage.getItem("pigx-all_patients"))
            .content;
         this.patientInfo = JSON.parse(
            sessionStorage.getItem("pigx-patientMessage")
         ).content;
         this.patientLists = data;
         if (this.patientInfo) {
            this.patientId = this.patientInfo.patientId;
         } else {
            this.patientId = null;
         }
         this.getList({ patientId: this.patientId });
      },
      chosePatient(val, flag) {
         var parmars = {};
         if (flag) {
            if (val) {
               this.patientLists.forEach(item => {
                  if (item.patientId == val) {
                     this.$store.commit("SET_MESSAGE", item);
                  }
               });
            } else {
               parmars = {};
               this.getList(parmars);
            }
         } else {
            if (val) {
               this.patientLists.forEach(item => {
                  if (item.patientId == val) {
                     this.patientId = val;
                     parmars = {
                        current: 1,
                        size: 10,
                        patientId: this.patientId
                     };
                  }
               });
            } else {
               parmars = {};
            }
            this.page.total = 0;
            this.page.currentPage = 1;
            this.page.pageSize = 10;
            this.getList(parmars);
         }
      },
      // 清空患者
      patientReset() {
         this.patientId = "";
      }
   }
};
</script>
