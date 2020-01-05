<template>
  <div>
    <!-- <el-form
      ref="loginForm"
      :rules="loginRules"
      :model="loginForm"
      class="login-form"
      status-icon
      label-width="0"
      v-if="flag">
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          size="small"
          auto-complete="off"
          placeholder="请输入用户名"
          @keyup.enter.native="handleLogin"
        >
          <i slot="prefix" class="icon-yonghu" />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          :type="passwordType"
          v-model="loginForm.password"
          size="small"
          auto-complete="off"
          placeholder="请输入密码"
          @keyup.enter.native="handleLogin"
        >
          <i slot="suffix" class="el-icon-view el-input__icon" @click="showPassword" />
          <i slot="prefix" class="icon-mima" />
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          size="small"
          class="login-submit"
          @click.native.prevent="handleLogin"
        >登录</el-button>
      </el-form-item>
    </el-form>-->
    <el-form class="noLogin">
      <!-- <el-form-item>
        <el-button @click="chose(i)" v-for="(i,index) in userName" :key="index">{{i}}</el-button>
      </el-form-item>-->
      <div :class="['noLogin-flex',(noLogin?'noLogin-flex1':'')]">
        <div v-for="i in userName" :key="i" style="margin-top: 26px">
          <p class="noLogin-p1"></p>
          <p class="noLogin-p2">
            <span
              style="color:#409EFF;display:block;margin:20px;font-size:18px;font-weight:600"
            >{{i}}</span>
            <el-button @click="chose(i)" type="primary" round>登录</el-button>
          </p>
        </div>
      </div>
    </el-form>
    <!-- <el-button @click="tigger" class="tigger">{{flag?'免密登录':'去登录'}}</el-button> -->
  </div>
</template>

<script>
import { newLogin } from "@/api/login";
import { randomLenNum } from "@/util/util";
import { mapGetters } from "vuex";

export default {
  name: "noUserLogin",
  data() {
    return {
      loginForm: {
        username: "test",
        password: "1234567",
        login_type: "noPwd"
      },
      loginRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, message: "密码长度最少为6位", trigger: "blur" }
        ]
      },
      passwordType: "password",
      userName: [],
      noLogin:false
    };
  },
  created() {
    this.userName = this.$route.query;
    if (JSON.parse(JSON.stringify(this.userName))[1] === undefined) {
      this.noLogin = true
    }
  },
  computed: {
    ...mapGetters(["tagWel"])
  },
  props: [],
  methods: {
    showPassword() {
      this.passwordType == ""
        ? (this.passwordType = "password")
        : (this.passwordType = "");
    },
    chose(i) {
      this.loginForm.username = i;
      this.$store
        .dispatch("noLoginByUsername", this.loginForm)
        .then(() => {
          this.$router.push({ path: this.tagWel.value });
        })
        .catch(() => {
          console.log("登录失败")
        });
    }
  }
};
</script>

<style lang="scss">
.noLogin {
  .el-button {
    margin: 20px 10px !important;
  }
  .el-form-item__content {
    display: flex;
    flex-wrap: wrap;
    //   flex: auto;
    //   justify-content:center;
  }
  .noLogin-p1 {
    width: 150px;
    height: 5px;
    background: #409EFF;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  .noLogin-p2 {
    width: 150px;
    height: 150px;
    border: 1px solid #ebebeb;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  .noLogin-flex {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-top:-20px
  }
  .noLogin-flex1{
    justify-content:center;
  }
}
@media screen and (max-width: 552px) {
  .noLogin-flex {
    justify-content: center !important;
  }
}
// .tigger {
//   position: absolute;
//   right: 50px;
//   bottom: 50px;
// }
</style>
