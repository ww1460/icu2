
<template>
  <div class="execution">
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :permission="permissionList"
        :table-loading="tableLoading"
        :option="tableOption"
        @on-load="getList"
        @search-change="searchChange"
        @refresh-change="refreshChange"
        @row-update="Update"
        @row-save="handleSave"
      >
        <template slot="menuLeft">
          <el-button type="primary" size="small" @click="handleUpdate()">自定义按钮</el-button>
        </template>
        <template slot="menuRight">
          <el-button type="primary" icon="el-icon-edit" circle size="small">211</el-button>
        </template>
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
import {
  addObj,
  delObj,
  fetchList,
  putObj,
  UpdateObj
} from "@/api/icu/matron/NursingTemplate/NursingTemplate";
import { tableOption } from "@/const/crud/icu/matron/NursingTemplate/NursingTemplate";
import { mapGetters } from "vuex";
import { getStore } from '@/util/store.js'
import * as SockJS from "sockjs-client";
import store from "@/store";
import Stomp from "stomp-websocket";

export default {
  name: "NursingTemplate",
  data() {
    return {
      searchForm: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption,
      // 刷新token锁
      refreshLock: false,
      // 刷新token的时间
      refreshTime: "",
      // 计时器
      timer: ""
    };
  },
  beforeRouteLeave(to, form, next) {
    clearInterval(this.timer)
    this.disconnect();
    next()
  },
  computed: {
    ...mapGetters(["permissions"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permissions.icu_nurse_add, false),
        delBtn: this.vaildData(this.permissions.icu_nurse_del, false),
        editBtn: this.vaildData(this.permissions.icu_nurse_edit, false)
      };
    }
  },
  mounted() {
    this.initWebSocket();
  },
  destroyed(){
  },
  methods: {
    
    connection() {

      const token = store.getters.access_token;
      const TENANT_ID = getStore({ name: "tenantId" })
        ? getStore({ name: "tenantId" })
        : "1";
      const headers = {
        Authorization: "Bearer " + token
      };
      // 建立连接对象
      this.socket = new SockJS("/icu/ws"); // 连接服务端提供的通信接口，连接以后才可以订阅广播消息和个人消息
      // 获取STOMP子协议的客户端对象
      this.stompClient = Stomp.over(this.socket);
      this.stompClient.debug = null;
      // 向服务器发起websocket连接
      this.stompClient.connect(
        headers,
        () => {
          this.stompClient.subscribe(
            "/topic/notify",
            msg => {
              // 订阅服务端提供的某个topic;
              this.$notify({
                title: "协同提醒",
                type: "warning",
                dangerouslyUseHTMLString: true,
                message: msg.body + "任务，请及时处理",

                offset: 60
              });
            }
          );
        },
        err => {}
      );
    },
    handleUpdate(){
      try {
          this.stompClient.send("/app/msg", {atytopic:"greetings"}, "name");
        } catch (err) {
          console.log("断线了: " + err);
          this.connection();
        }
    },
    initWebSocket() {
      this.connection();
      const self = this;
      // 断开重连机制,尝试发送消息,捕获异常发生时重连
      this.timer = setInterval(() => {
        try {
          self.stompClient.send("/app/msg", {atytopic:"greetings"}, "name");
        } catch (err) {
          console.log("断线了: " + err);
          self.connection();
        }
      }, 5000);
    },
    disconnect() {
      if (this.stompClient != null) {
        this.stompClient.disconnect()
        console.log('Disconnected')
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
