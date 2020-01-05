<template>
  <div id="app">
    <floating class="floating_app" v-if="loginFlag"></floating>
    <router-view />
  </div>
</template>

<script>
import floating from "@/page/floating";
export default {
  components: {
    floating
  },
  name: "App",
  data() {
    return {
      loginFlag: false
    };
  },
  computed: {},
  watch: {
    //监听登录页是否显示
    $route(to, from) {
      if (to.path != "/login" && to.path != "/404") {
        this.loginFlag = true;
      } else {
        this.loginFlag = false;
      }
    }
  },
  created() {},

  methods: {}
};
</script>
<style lang="scss">
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
// .floating_app {
//   width: 100%;
//   position: absolute;
//   // left: 85%;
// }
</style>
