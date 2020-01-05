<template>
  <div>
    <!-- 头部 -->
    <div class="ant-page-header">
      <div class="ant-page-header-content">
        <div class="ant-pro-page-header-wrap-detail">
          <div class="ant-pro-page-header-wrap-main">
            <div class="ant-pro-page-header-wrap-row">
              <div class="ant-pro-page-header-wrap-content">
                <div class="antd-pro-pages-dashboard-workplace-style-pageHeaderContent">
                  <div class="antd-pro-pages-dashboard-workplace-style-avatar">
                    <span class="ant-avatar ant-avatar-lg ant-avatar-circle ant-avatar-image">
                      <img id="thumbnail1" class="top-bar__img" />
                    </span>
                  </div>
                  <div class="antd-pro-pages-dashboard-workplace-style-content">
                    <div
                      class="antd-pro-pages-dashboard-workplace-style-contentTitle"
                    >{{matronInfo.realName}} 祝您今天过得愉快！</div>
                    <div>伟大不只在事业上惊天动地，他时常不声不响地深思熟虑！！！</div>
                  </div>
                </div>
              </div>
              <div class="ant-pro-page-header-wrap-extraContent">
                <div class="antd-pro-pages-dashboard-workplace-style-extraContent">
                  <div class="antd-pro-pages-dashboard-workplace-style-statItem">
                    <div class="ant-statistic">
                      <div class="ant-statistic-title">在科护士</div>
                      <div class="ant-statistic-content">
                        <span class="ant-statistic-content-value">
                          <span class="ant-statistic-content-value-int">{{nurseLists.length}}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="antd-pro-pages-dashboard-workplace-style-statItem">
                    <div class="ant-statistic">
                      <div class="ant-statistic-title">未使用床位</div>
                      <div class="ant-statistic-content">
                        <span class="ant-statistic-content-value">
                          <span class="ant-statistic-content-value-int">{{Emptybeds.length}}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="antd-pro-pages-dashboard-workplace-style-statItem">
                    <div class="ant-statistic">
                      <div class="ant-statistic-title">在科患者</div>
                      <div class="ant-statistic-content">
                        <span class="ant-statistic-content-value">
                          <span class="ant-statistic-content-value-int">{{patientsList.length}}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 中间部分 -->
    <div class="matron_content">
      <!-- 左边部分 -->
      <div class="matron_content_left">
        <div class="content_left_top">
          <div class="top_title">
            <div class="list_title">患者信息</div>
            <div class="top_btn">
              <!-- 全部任务 -->
            </div>
          </div>
          <div class="top_content" v-if="patientInfo">
            <span
              style="margin-left:30px"
            >患者姓名：{{patientInfo.name}}&nbsp;&nbsp;&nbsp;&nbsp;性别：{{patientInfo.gender == 1?'男':patientInfo.gender == 0?"女":''}}&nbsp;&nbsp;&nbsp;&nbsp;住院号：{{patientInfo.hospitalnumber}}&nbsp;&nbsp;&nbsp;&nbsp;入科时间:{{patientInfo.entranceTime}}</span>
            <el-link style="margin-right:30px" type="success" @click="skipNurse">详情</el-link>
          </div>
        </div>
        <div class="left_buttom">
          <div class="left_buttom_title">预警</div>
          <div class="left_buttom_content">
            <div class="left_list">
              <ul>
                <li class="ul_li" v-for="item in warningList" :key="item.id">
                  <div>
                    <p>
                      <span class="el-button--text">{{item.bedCode}}</span>床的
                      <span class="el-button--text">{{item.patientName}}</span>
                      {{item.warmContent}}
                    </p>
                    <p class="time">{{item.updataTime?updataTime: item.createTime}}</p>
                  </div>
                </li>
                <li class="last_li">
                  <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="[10, 20, 30, 40,50,100]"
                    :page-size="page.size"
                    layout="sizes, prev, pager, next"
                    :total="page.total"
                  ></el-pagination>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <!-- 右边部分 -->
      <div class="matron_content_right">
        <div class="content_right_btn">
          <div class="content_right_title">
            <p>床位展示</p>
            <div>
              <!-- <el-button size="mini">在科患者</el-button> -->
              <el-button
                :plain="index==flag?false:true"
                size="mini"
                v-for="(item,index) in changeBtn"
                :key="item.id"
                :type="item.id == 1?'primary':item.id==2?'info':item.id ==0? 'danger':''"
                @click="changeBed(item.id,index)"
              >{{item.name}}</el-button>
              <el-button
                :plain="5==flag?false:true"
                size="mini"
                type="primary"
                @click="changeBed(5,3)"
              >全部</el-button>
            </div>
          </div>
          <div class="content_right_list">
            <el-button
              :autofocus="false"
              size="mini"
              v-for="item in bedList"
              :key="item.id"
              :plain="(item.bedId== bedFlag)?false:true"
              :type="item.useFlag == 0?'danger':item.useFlag==2?'info':item.useFlag ==1? 'primary':''"
              @click="ToNurse(item)"
            >{{item.bedCode}}</el-button>
          </div>
        </div>
        <div class="right_list">
          <div class="right_list_title">
            <!-- <span>选择护士</span> -->
            <el-button size="mini" type="text" @click="Allnurse">全部护士</el-button>
            <el-button size="mini" type="primary" @click="goPatient">在科患者</el-button>
          </div>
          <div class="right_list_all">
            <el-button
              v-for="item in nurseList"
              :key="item.nurseId"
              size="mini"
              @click="goNurseInfo(item.realName?item.realName:item.nurseName)"
            >{{item.realName?item.realName:item.nurseName}}</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getMatronInfo,
  getNurseInfo,
  getBedlist,
  getNurse_patient,
  get_warning,
  get_taskWarning
} from "@/api/icu/matron/matronInfo/matronInfo";
// import { tableOption } from '@/const/crud/icu/matron/info/info'
import { fullscreenToggel, handleImg, listenfullscreen } from "@/util/util";
import { mapGetters } from "vuex";
import { get } from "https";

export default {
  name: "matronIndex",
  data() {
    return {
      matronInfo: {},
      Emptybeds: [],
      nurseLists: [],
      patientsList: [],
      nurseList: [],
      bedList: [],
      bedLists: [],
      nurse_patient: [],
      patientInfo: {},
      flag: 5,
      changeBtn: [
        { id: 1, name: "使用中" },
        { id: 0, name: "未使用" },
        { id: 2, name: "维护中" }
      ],
      warningList: [],
      bedInfo: {},
      bedFlag: "",
      page: {
        total: 20, // 总页数
        current: 1, // 当前页数
        size: 20 // 每页显示多少条
      }
    };
  },
  computed: {
    ...mapGetters(["permissions", "nurse_patients", "dep_patients", "userInfo"])
  },

  created() {
    //在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem("store")) {
      this.$store.replaceState(
        Object.assign(
          {},
          this.$store.state,
          JSON.parse(sessionStorage.getItem("store"))
        )
      );
    }
    if (JSON.parse(sessionStorage.getItem("pigx-nurseIndexFlag"))) {
      this.getNursePatients();
    } else {
      this.$store.dispatch("getAllPatients").then(res => {
        this.getNursePatients();
      });
    }
    // //任务预警
    // get_taskWarning().then(res=>{
    // })
    //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener("beforeunload", () => {
      sessionStorage.setItem("store", JSON.stringify(this.$store.state));
    });
    this.getDepPatients();
    this.getMatron();
    this.getBed();
    handleImg(this.userInfo.avatar, "thumbnail1");
  },

  methods: {
    getNursePatients() {
      var data = [],
        data1 = [];

      if (
        JSON.parse(sessionStorage.getItem("pigx-all_patients")).dataType ===
        "undefined"
      ) {
      } else {
        data = JSON.parse(sessionStorage.getItem("pigx-all_patients")).content;
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
      this.$store.commit("SET_NURSEINDEXFLAG", true);
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
    //点击详情 跳转页面
    skipNurse() {
      this.$router.push({
        path: "/icu/patient/info/index",
        query: this.bedInfo
      });
    },
    //跳转在科患者
    goPatient() {
      this.$router.push({
        path: "/icu/patientManagement/patientList/index"
      });
    },
    //跳转到护士信息
    goNurseInfo(realName) {
      this.$router.push({
        path: "/icu/matron/info/index",
        query: {
          realName
        }
      });
    },
    //点击 切换床位状态
    changeBed(id, index) {
      this.bedList = this.bedLists;
      if (index != 3) {
        this.flag = index;
      } else {
        this.flag = 5;
      }
      if (id != 5) {
        this.bedList = this.bedList.filter(item => {
          if (item.useFlag == id) {
            return this.bedList;
          }
        });
      }
    },
    //点击显示所有护士
    Allnurse() {
      this.nurseList = [];
      this.nurseList = this.dep_patients.nurses;
    },
    //点击床位 通过床位去查询患者 护士  展示
    ToNurse(item) {
      if (item.useFlag == 0) {
        this.$message({
          message: "该床位未使用",
          type: "warning"
        });
      } else if (item.useFlag == 2) {
        this.$message({
          message: "该床位维护中",
          type: "warning"
        });
      } else {
        this.bedFlag = item.bedId;
        this.nurseList = [];
        getNurse_patient(item.patientId).then(res => {
          this.nurseList = res.data.data;
        });
        this.bedInfo = item;
        this.patientInfo = item.patient;
      }
    },
    get_data() {
      //请求预警
      get_warning(this.page).then(res => {
        this.page.total = res.data.data.total;
        this.warningList = res.data.data.records;
      });
    },
    //请求患者床位
    getBed() {
      //请求患者
      getBedlist()
        .then(res => {
          this.bedList = res.data.data;
          this.bedLists = res.data.data;

          this.bedInfo = this.bedList[0];
          this.patientInfo = res.data.data[0].patient;
          this.Emptybeds = this.bedList.filter(item => {
            if (item.useFlag == 0) return this.bedList;
          });
        })
        .catch(() => {});
      this.get_data();
    },
    //分页
    handleCurrentChange(val) {
      this.page.current = val;
      this.get_data();
    },
    handleSizeChange(val) {
      this.page.size = val;
      this.get_data();
    },
    //请求护士长信息
    getMatron() {
      getMatronInfo()
        .then(res => {
          this.matronInfo = res.data.data;
        })
        .catch(() => {});
    },
    getDepPatients() {
      this.$store.dispatch("getPatientsByDep").then(response => {
        this.nurseList = this.dep_patients.nurses;
        this.nurseLists = this.dep_patients.nurses;
        this.patientsList = this.dep_patients.patients;
      });
    }
  }
};
</script>
<style lang="scss">
.flagBed {
  color: #fff;
  background: #409eff;
}
.flagBtn {
  color: #409eff !important;
}
.ant-page-header {
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5;
  list-style: none;
  font-feature-settings: "tnum";
  position: relative;
  padding: 16px 24px;
  background: #fff;
}
.ant-page-header-heading {
  margin-top: 12px;
}
.antd-pro-pages-dashboard-workplace-style-pageHeaderContent
  .antd-pro-pages-dashboard-workplace-style-content {
  position: relative;
  top: 4px;
  flex: 1 1 auto;
  margin-left: 24px;
  color: rgba(0, 0, 0, 0.45);
  line-height: 22px;
}
.ant-page-header-heading-title {
  display: inline-block;
  // padding-right: 12px;
  padding: 10px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 700;
  font-size: 16px;
  line-height: 1.4;
}
.ant-pro-page-header-wrap-main .ant-pro-page-header-wrap-row {
  display: flex;
  width: 100%;
}
.ant-pro-page-header-wrap-main .ant-pro-page-header-wrap-content,
.ant-pro-page-header-wrap-main .ant-pro-page-header-wrap-title {
  flex: auto;
}
.antd-pro-pages-dashboard-workplace-style-pageHeaderContent {
  display: flex;
}
.antd-pro-pages-dashboard-workplace-style-pageHeaderContent
  .antd-pro-pages-dashboard-workplace-style-avatar {
  flex: 0 1 72px;
}
.antd-pro-pages-dashboard-workplace-style-pageHeaderContent
  .antd-pro-pages-dashboard-workplace-style-avatar
  > span {
  display: block;
  width: 72px;
  height: 72px;
  border-radius: 72px;
}
.ant-avatar > img {
  display: block;
  width: 100%;
  height: 100%;
}
.ant-pro-page-header-wrap-main .ant-pro-page-header-wrap-extraContent {
  min-width: 242px;
  margin-left: 88px;
  text-align: right;
}
.antd-pro-pages-dashboard-workplace-style-pageHeaderContent
  .antd-pro-pages-dashboard-workplace-style-content
  .antd-pro-pages-dashboard-workplace-style-contentTitle {
  margin-bottom: 12px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
}
.antd-pro-pages-dashboard-workplace-style-extraContent {
  zoom: 1;
  float: right;
  white-space: nowrap;
}
.antd-pro-pages-dashboard-workplace-style-extraContent
  .antd-pro-pages-dashboard-workplace-style-statItem {
  position: relative;
  display: inline-block;
  padding: 0 32px;
}
.ant-statistic {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5;
  list-style: none;
  font-feature-settings: "tnum";
}
.ant-statistic-title {
  margin-bottom: 4px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
}
.ant-statistic-content {
  text-align: center;
  color: rgba(0, 0, 0, 0.85);
  font-size: 24px;
  font-family: Tahoma, Helvetica Neue, -apple-system, BlinkMacSystemFont,
    Segoe UI, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica, Arial,
    sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol;
}
.matron_content {
  // display: flex;
  width: 96%;
  margin: 30px 2% 0;
}
.matron_content_left {
  width: 60%;
  float: left;
  // background: #fff;
}
.content_left_top {
  background: #fff;
}
.top_title {
  min-height: 48px;
  margin-bottom: -1px;
  padding: 0 24px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  font-size: 16px;
  background: transparent;
  border-bottom: 1px solid #e8e8e8;
  border-radius: 2px 2px 0 0;
  zoom: 1;
}
.top_title .list_title {
  display: inline-block;
  flex: 1 1;
  padding: 16px 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.top_title .top_btn {
  float: right;
  margin-left: auto;
  padding: 16px 0;
  font-weight: 400;
  font-size: 14px;
  color: #1890ff;
  text-decoration: none;
  background-color: transparent;
  outline: none;
  cursor: pointer;
  transition: color 0.3s;
}
.top_content {
  padding-top: 10px;
  height: 60px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  // display: flex;
}
.content_item {
  float: left;
  width: 33.33%;
  border: 0;

  .center {
    box-sizing: border-box;
    margin: 0;
    padding: 20px;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5;
    list-style: none;
    font-feature-settings: "tnum";
    position: relative;
    background: #fff;
    border-radius: 2px;
    transition: all 0.3s;
    border-radius: 0;
    box-shadow: 1px 0 0 0 #e8e8e8, 0 1px 0 0 #e8e8e8, 1px 1px 0 0 #e8e8e8,
      inset 1px 0 0 0 #e8e8e8, inset 0 1px 0 0 #e8e8e8;
  }
}
div.center:hover {
  box-shadow: 2px 0 0 0 #e8e8e8, 0 2px 0 0 #e8e8e8, 2px 2px 0 0 #e8e8e8,
    inset 2px 0 0 0 #e8e8e8, inset 0 2px 0 0 #e8e8e8;
  transition: all 0.3s;
}

.content_item .content_item_title {
  display: inline-block;
  height: 24px;
  margin-left: 12px;
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  line-height: 24px;
  vertical-align: top;
}
.content_item .content_item_main {
  height: 44px;
  padding: 3px 0;
  overflow: hidden;
  color: rgba(0, 0, 0, 0.45);
  line-height: 22px;
}
.content_name .name {
  display: inline-block;
  flex: 1 1;
  color: rgba(0, 0, 0, 0.45);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break: break-all;
}
.content_name .time {
  flex: 0 0 auto;
  float: right;
  color: rgba(0, 0, 0, 0.25);
}

.matron_content_right {
  float: left;
  margin-left: 2%;
  width: 38%;
}
.content_right_btn {
  background: #fff;
}
.content_right_list {
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.content_right_list button {
  margin: 10px;
  width: 18%;
}
.content_right_list p {
  width: 18%;
  margin: 15px;
  height: 30px;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: center;
  line-height: 30px;
}

.matron_content_right .right_list {
  margin-top: 20px;
  background: #fff;
  margin-bottom: 20px;
}
.matron_content_right .right_list .right_list_title {
  display: flex;
  justify-content: space-between;
  margin-bottom: -1px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  font-size: 16px;
  background: transparent;
  border-bottom: 1px solid #e8e8e8;
  border-radius: 2px 2px 0 0;
  zoom: 1;
  padding: 8px 24px;
  line-height: 48px;
}
.matron_content_right .right_list .right_list_all {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  // padding: 20px 0 8px 24px;
  width: 100%;
  // font-size: 16px;
}
.matron_content_right .right_list .right_list_all button {
  margin: 10px;
  width: 18%;
}
//  .matron_content_right .right_list
.content_right_title {
  display: flex;
  justify-content: space-between;
  min-height: 48px;
  margin-bottom: -1px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  font-size: 16px;
  background: transparent;
  border-bottom: 1px solid #e8e8e8;
  border-radius: 2px 2px 0 0;
  zoom: 1;
  padding: 8px 24px;
  line-height: 48px;
  div {
    display: flex;
    align-items: center;
    p {
      margin-right: 10px;
      width: 50px;
      height: 30px;
      border-radius: 5px;
      text-align: center;
      line-height: 30px;
      font-size: 12px;
      cursor: pointer;
    }
  }
}
.left_buttom {
  min-height: 48px;
  margin-bottom: 30px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  font-size: 16px;
  border-radius: 2px 2px 0 0;
  zoom: 1;
  background: #fff;
  margin-top: 20px;
  float: left;
  width: 100%;
}
.left_buttom_title {
  // padding:16px 0;
  padding: 16px 24px;
  border-bottom: 1px solid #e8e8e8;
}
.left_buttom_content {
  padding: 0px;
}
.left_list {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5;
  list-style: none;
  font-feature-settings: "tnum";
  position: relative;
}
.left_list ul {
  .ul_li:hover {
    transition: all 0.5s;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  }
  .ul_li { 
    padding: 9px 17px 5px 26px;
    border-bottom: 1px solid #e8e8e8;
    // span {
    //   color: #409eff;
    // }
    .time {
      font-size: 12px;
      padding-top: 3px;
      color: rgba(0, 0, 0, 0.25);
    }
  }
  .last_li {
    padding: 15px;
    text-align: right;
  }
}
.list_item {
  padding-top: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e8e8e8;
}
@media screen and (max-width: 1200px) {
  .matron_content_left {
    width: 100%;
  }
  .matron_content_right {
    width: 100%;
    margin-top: 20px;
    margin-left: 0%;
  }
}
@media screen and (max-width: 768px) {
  .content_item {
    width: 50%;
    min-width: 652px;
  }
}
</style>

