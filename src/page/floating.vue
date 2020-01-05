<template>
  <div>
    <div class="floating">
      <!-- PC端登录 -->
      <div id="floating_PC" v-if="!isMobileFlag">
        <p @click="Float_PC_click">录入数据</p>
        <div class="entering" v-if="enteringFlag">
          <el-input
            size="small"
            placeholder="请输入录入内容"
            v-model="enterContent"
            @keyup.enter.native="Submit"
            class="input-with-select"
            clearable
          >
            <el-select @change="chosePatient" v-model="patientId" slot="prepend" placeholder="请选择">
              <el-option
                v-for="item in patientList"
                :label="`${item.name} ${item.bedCode}`"
                :value="item.patientId"
                :key="item.id"
              ></el-option>
            </el-select>
            <el-button slot="append" :loading="loading" @click="entering">录入</el-button>
          </el-input>
        </div>
      </div>

      <!-- 移动端登录 -->
      <div
        id="floating_Ipd"
        @mousedown.stop="down"
        @touchstart.stop="down"
        @mousemove.stop="move"
        @touchmove.stop="move"
        @mouseup.stop="end"
        @touchend.stop="end"
        v-if="isMobileFlag"
      >
        <p @click.stop="Float_PC_click($event)">录入数据</p>
        <div class="entering" v-if="enteringFlag">
          <el-input
            size="small"
            placeholder="请输入录入内容"
            v-model="enterContent"
            class="input-with-select"
            clearable
          >
            <el-select @change="chosePatient" v-model="patientId" slot="prepend" placeholder="请选择">
              <el-option
                v-for="item in patientList"
                :label="`${item.name} ${item.bedCode}`"
                :value="item.patientId"
                :key="item.id"
              ></el-option>
            </el-select>
            <el-button slot="append" :loading="loading" @click="entering">录入</el-button>
          </el-input>
        </div>
      </div>
      <el-dialog
        class="dia_z-index"
        @close="clearDia"
        :model="true"
        :visible.sync="centerDialogVisible"
        width="0"
        :fullscreen="false"
      ></el-dialog>
    </div>
  </div>
</template>
<script>
import { addObj } from "@/api/icu/matron/top-search/top-search";
import { mapGetters, mapState } from "vuex";
export default {
  name: "floating",
  data() {
    return {
      enteringFlag: false,
      patientList: [],
      loading: false,
      patientId: "",
      enterContent: "",
      patientInfo: {},
      centerDialogVisible: false,
      isMobileFlag: false,
      flags: false,
      position: { x: 0, y: 0 },
      nx: "",
      ny: "",
      dx: "",
      dy: "",
      xPum: "",
      yPum: "",
      offetFlag: false
    };
  },
  created() {
    this.isMobileFlag = this.isMobile();
  },
  computed: {
    ...mapGetters(["patientMessage"])
  },
  watch: {
    patientMessage: {
      handler(newValue, oldValue) {
        this.chosePatient(newValue.patientId);
      }
    }
  },
  mounted() {
    if (!this.isMobileFlag) {
      this.Float_PC();
    }
  },
  methods: {
    down() {
      this.flags = true;
      var touch;
      if (event.touches) {
        touch = event.touches[0];
      } else {
        touch = event;
      }
      this.position.x = touch.clientX;
      this.position.y = touch.clientY;
      this.dx = floating_Ipd.offsetLeft;
      this.dy = floating_Ipd.offsetTop;
    },
    move() {
      if (this.flags) {
        var touch;
        if (event.touches) {
          touch = event.touches[0];
        } else {
          touch = event;
        }
        this.nx = touch.clientX - this.position.x;
        this.ny = touch.clientY - this.position.y;
        this.xPum = this.dx + this.nx;
        this.yPum = this.dy + this.ny;
        if (this.xPum <= 0) {
          this.xPum = 0;
        }
        if (this.yPum <= 0) {
          this.yPum = 0;
        }
        var windowWidth =
          document.documentElement.clientWidth || document.body.clientWidth;
        if (this.xPum >= windowWidth - 80) {
          this.xPum = windowWidth - 80;
        }
        var windowHeight =
          document.documentElement.clientHeight || document.body.clientHeight;
        if (this.yPum >= windowHeight - 30) {
          this.yPum = windowHeight - 30;
        }
        floating_Ipd.style.left = this.xPum + "px";
        floating_Ipd.style.top = this.yPum + "px";
        //阻止页面的滑动默认事件
        document.addEventListener(
          "touchmove",
          function() {
            // 1.2 如果碰到滑动问题，请注意是否获取到 touchmove
            // event.preventDefault(); //jq 阻止冒泡事件
            event.stopPropagation(); // 如果没有引入jq 就用 stopPropagation()
          },
          false
        );
      }
    },
    //鼠标释放时候的函数
    end() {
      this.flags = false;
    },
    clearDia() {
      this.centerDialogVisible = false;
      this.enteringFlag = false;
    },
    chosePatient(val) {
      if (val) {
        this.patientList.forEach(item => {
          if (item.patientId == val) {
            this.$store.commit("SET_MESSAGE", item);
            this.patientId = item.patientId;
          }
        });
      }
    },
    //悬浮窗点击录入
    entering() {
      this.loading = true;
      if (this.patientId != "" && this.enterContent != "") {
        addObj(this.patientId, this.enterContent)
          .then(res => {
            this.loading = false;
            this.$message({
              showClose: true,
              message: "录入成功",
              type: "success"
            });
            this.patientId = "";
            this.enterContent = "";
            this.enteringFlag = false;
            this.centerDialogVisible = false;
          })
          .catch(err => {
            this.loading = false;
            this.enterContent = "";
          });
      } else {
        this.$message({
          message: "请先选择完患者填入数据在录入哦。",
          type: "warning"
        });
        this.loading = false;
      }
    },
    //按下回车
    Submit() {
      this.entering();
    },
    //点击悬浮窗
    Float_PC_click() {
      //状态没有根据移动发生改变时，执行点击事件
      if (!this.offetFlag) {
        if (JSON.parse(sessionStorage.getItem("pigx-nurseIndexFlag"))) {
          let data = JSON.parse(sessionStorage.getItem("pigx-all_patients"))
            .content;
          if (data == undefined) {
            this.patientId = "";
          } else {
            this.patientList = data;
            this.patientInfo = JSON.parse(
              sessionStorage.getItem("pigx-patientMessage")
            ).content;
            this.patientId = this.patientInfo.patientId;
          }
        } else {
          this.$store.dispatch("getAllPatients").then(res => {
            let data = JSON.parse(sessionStorage.getItem("pigx-all_patients"))
              .content;
            if (data == undefined) {
              this.patientId = "";
            } else {
              this.patientList = data;
              this.patientInfo = JSON.parse(
                sessionStorage.getItem("pigx-patientMessage")
              ).content;
            }
          });
        }
        this.centerDialogVisible = !this.centerDialogVisible;
        this.enteringFlag = !this.enteringFlag;
      }
    },
    Float_PC() {
      var oDiv = document.getElementById("floating_PC");
      this.limitDrag(oDiv);
    },
    limitDrag(node) {
      let that = this
      var offsetX = 0;
      var offsetY = 0;
      node.onmousedown = function(ev) {
        //每次按下鼠标 清空
        that.offetFlag = false;
        var e = ev || window.event;
        //1、记录相对位置
        offsetX = e.clientX - node.offsetLeft;
        offsetY = e.clientY - node.offsetTop;

        //2、添加鼠标移动
        document.onmousemove = function(ev) {
          //当拖动之后 改变状态
          that.offetFlag = true;
          var e = ev || window.event;
          var l = e.clientX - offsetX;
          if (l <= 0) {
            l = 0;
          }
          var windowWidth =
            document.documentElement.clientWidth || document.body.clientWidth;
          if (l >= windowWidth - node.offsetWidth) {
            l = windowWidth - node.offsetWidth;
          }
          var t = e.clientY - offsetY;
          if (t <= 0) {
            t = 0;
          }
          var windowHeight =
            document.documentElement.clientHeight || document.body.clientHeight;
          if (t >= windowHeight - node.offsetHeight) {
            t = windowHeight - node.offsetHeight;
          }

          node.style.left = l + "px";
          node.style.top = t + "px";
        };
      };

      document.onmouseup = function() {
        document.onmousemove = null;
      };
    },
    //判断是移动端 还是PC   true为移动端  false PC端
    isMobile() {
      var userAgentInfo = navigator.userAgent;
      var Agents = [
        "Android",
        "iPhone",
        "SymbianOS",
        "Windows Phone",
        "iPad",
        "iPod"
      ];
      var flag = false;
      for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
          flag = true;
          break;
        }
      }
      return flag;
    }
  }
};
</script>
<style lang="scss" scope>
.floating {
  width: 100%;
  // height: 100%;
  position: fixed;
  z-index: 2003;
  #floating_PC,
  #floating_Ipd {
    position: absolute;
    text-align: center;
    line-height: 30px;
    width: 80px;
    height: 30px;
    right: 10%;
    top: 70px;
    background: #409eff;
    color: #fff;
    border-radius: 5px;
    cursor: pointer;
  }
  .entering {
    width: 400px;
    height: 30px;
    position: relative;
    right: 400px;
    bottom: 30px;
    z-index: 2003 !important;
    .el-input-group__prepend {
      width: 70px !important;
    }
  }
}
.el-popper {
  z-index: 22200 !important;
}
.v-modal {
  z-index: 2000 !important;
}
.dia_z-index {
  z-index: 2000 !important;
}
</style>