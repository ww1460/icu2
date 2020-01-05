<template>
  <div>
    <!-- <div :class="['top-search',(!flag ?'display':''),'top-input']">
         <el-input
            placeholder="请输入录入内容"
            v-model="enterContent"
            class="input-with-select"
            @keyup.enter.native="Submit"
         >
            <el-select v-model="patientId" slot="prepend" placeholder="请选择">
               <el-option
                  v-for="item in patientList"
                  :label="`${item.name} ${item.bedCode}`"
                  :value="item.patientId"
                  :key="item.id"
               ></el-option>
            </el-select>
            <el-button slot="append" :loading="loading" @click="entering">录入</el-button>
         </el-input>
    </div>-->
    <div :class="['top-search',(!flag ?'display':''),'Slide_top']" id="Slide_top">
      <div class="swiper-container swiper_Top">
        <div class="swiper-wrapper">
          <div
            class="swiper-slide avue-breadcrumb"
            v-for="(item,index) in WranimgList"
            :key="index"
          >{{item.patientId? item.bedCode + '床的' + item.patientName + item.warmContent :item.bedCode}}</div>
        </div>
        <!-- 如果需要分页器 -->
        <!-- <div class="swiper-pagination"></div> -->

        <!-- 如果需要导航按钮 -->
        <!-- <div class="swiper-button-prev"></div> -->
        <!-- <div class="swiper-button-next"></div> -->
      </div>
    </div>
  </div>
</template>

<script>
let mySwiper
import Swiper from "swiper";
import config from "../sidebar/config.js";
import { addObj, getWarning } from "@/api/icu/matron/top-search/top-search";
import { mapGetters, mapState } from "vuex";
import { constants } from "crypto";
export default {
  data() {
    return {
      flag: true,
      enterContent: "",
      patientId: "",
      patientList: [],
      loading: false,
      WranimgList: []
    };
  },
  computed: {
    ...mapGetters(["isCollapse", "nurse_patients", "dep_patients"]),
    ...mapState({
      roleCodes: state => state.user.roleCodes
    })
  },
  created() {
    window.onresize = () => {
      if (document.body.clientWidth < 930 && !this.isCollapse) {
        this.flag = false;
      } else {
        this.flag = true;
      }
    };
    // this.$store.dispatch("getAllPatients").then(res => {
    //    let data = JSON.parse(sessionStorage.getItem("pigx-all_patients"))
    //       .content;
    //    this.patientList = data;
    //    this.patientInfo = JSON.parse(
    //       sessionStorage.getItem("pigx-patientMessage")
    //    ).content;
    // });
  },
  watch: {
    isCollapse(val) {
      if (document.body.clientWidth < 930 && !this.isCollapse) {
        this.flag = false;
      } else {
        this.flag = true;
      }
    }
    // $route(to, from) {
    //   this.$nextTick(() => {
    //     this.creSwiper();
    //   });
    // }
  },
  mounted() {
    this.creSwiper();
    this.timer = setInterval(() => {
      mySwiper.destroy(false)
      this.creSwiper();
    }, 300000);
  },
  methods: {
    creSwiper() {
      this.WranimgList = [];
      getWarning().then(res => {
        this.WranimgList = res.data.data;
        this.$nextTick(() => {
            mySwiper = new Swiper(".swiper_Top", {
            direction: "vertical", // 垂直切换选项
            loop: true, // 循环模式选项
            autoplay: true,
            // observer: true, //修改swiper自己或子元素时，自动初始化swiper
            // observeParents: true, //修改swiper的父元素时，自动初始化swiper
            // onSlideChangeEnd: function(swiper) {
            //   swiper.update();
            //   mySwiper.startAutoplay();
            //   mySwiper.reLoop();
            // } //修改swiper的父元素时，自动初始化swiper

            // // 如果需要分页器
            // pagination: {
            //   el: ".swiper-pagination"
            // },
            // // 如果需要前进后退按钮
            // navigation: {
            //   nextEl: ".swiper-button-next",
            //   prevEl: ".swiper-button-prev"
            // },
            // // 如果需要滚动条
            // scrollbar: {
            //   el: ".swiper-scrollbar"
            // }
          });
        });
      });
    },
    //按下回车
    Submit() {
      this.entering();
    },
    //悬浮窗点击录入
    entering() {
      this.loading = true;
      if (this.patientId != "" && this.enterContent != "") {
        addObj(this.patientId, this.enterContent).then(res => {
          this.loading = false;
          this.$message({
            showClose: true,
            message: "录入成功",
            type: "success"
          });
          this.patientId = "";
          this.enterContent = "";
        });
      } else {
        this.$message({
          message: "请先选择完患者填入数据在录入哦。",
          type: "warning"
        });
        this.loading = false;
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
  }
};
</script>

<style lang="scss">
// input::-webkit-input-placeholder {
//   color: #909399 !important;
// }
// .top-input {
//   > div {
//     border: 1px solid #eae5e5;
//     border-radius: 3px;
//   }
// }
// .top-input .el-select .el-input {
//   width: 130px;
// }
// .top-input .input-with-select .el-input-group__prepend {
//   background-color: #fff;
//   border: 0;
// }
// .top-input .el-input__inner {
//   color: #909399;
// }
// .top-input .input-with-select input {
//   background: #fff !important;
//   color: #909399 !important;
//   // border-radius: 4px;
// }
// .top-input .el-input--suffix {
//   width: 120px !important;
// }
// .top-input .el-input-group__append {
//   padding: 0 10px !important;
//   border: none;
//   background: #fff;
// }
.display {
  display: none;
}

.Slide_top {
  .swiper-slide {
    line-height: 60px;
    // height: 50px !important;
  }
}
</style>
