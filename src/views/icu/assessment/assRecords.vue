<template>
  <!-- 评估记录 -->
  <basic-container>
    <div class="panel panel-default">
      <div class="panel-heading clearfix">
        <h3 class="panel-title">评估记录</h3>

        <div class="perinfo">
          <span>姓名: &nbsp;{{patInfo.name}}</span>&nbsp;
          <span>性别：&nbsp;{{patInfo.gender| genderFl }}</span>&nbsp;
          <span>年龄：&nbsp;{{patInfo.age}}</span>&nbsp;
          <span>入科日期：&nbsp;{{patInfo.entranceTime | timeFl}}</span>&nbsp;
        </div>
      </div>
      <!-- v-if="roleCodes == 'ROLE_NURSE'" -->
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
                @click="patientNameClick(item.patientName,item.id,item.patientId,item)"
              >{{ item.patientName }} {{item.bedName}}</el-button>
            </div>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <avue-crud
      v-if="viewMoreIf"
      :page="page"
      :data="tableData"
      :permission="permissionList"
      :table-loading="tableLoading"
      :option="tableOption"
      style="margin-top:20px"
      @search-change="search"
      @row-update="handleUpdate"
      @size-change="sizeChange"
      @current-change="currentChange"
      @search-reset="clearform"
    >
      <template slot="search">
        <el-col :md="6" :xs="24" style="margin-right:10px;margin-top:2.5px">
            <el-date-picker
              type="datetimerange"
              :picker-options="pickerOptions2"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
              size="small"
              v-model="value2"
            ></el-date-picker>
        </el-col>
        <el-col :md="3" :xs="2" style="margin-right:10px;margin-top:2.5px">
            <el-input placeholder="请输入最小值" v-model="minScore" size="small" ></el-input>
        </el-col>
        <el-col :md="3" :xs="2" style="margin-right:10px;margin-top:2.5px">
            <el-input placeholder="请输入最大值" v-model="maxScore" size="small"></el-input>
        </el-col>
      </template>
      <template slot="menu" slot-scope="scope">
        <el-button
          :size="scope.size"
          :type="scope.type"
          @click="viewMore(scope.row)"
          icon="el-icon-view"
        >详情</el-button>
        <el-button
          :size="scope.size"
          :type="scope.type"
          @click="rowDel(scope.row,scope.row.$index)"
          icon="el-icon-delete"
        >删除</el-button>
      </template>
    </avue-crud>
    <div v-if="!viewMoreIf">
      <el-button
        icon="el-icon-back"
        type="primary"
        size="small"
        style="margin-top:10px;margin-left:10px"
        @click="returnClick()"
      >返回</el-button>
    </div>
    <APACHE v-if="code =='APACHE-II'" :messages="recordViewData"></APACHE>
    <bloodAss v-if="code =='CAPRINI'" :messages="recordViewData"></bloodAss>
    <calmRestless v-if="code =='RASS'" :messages="recordViewData"></calmRestless>
    <CPOT v-if="code =='CCPOT'" :messages="recordViewData"></CPOT>
    <digitalPain v-if="code =='NRS'" :messages="recordViewData"></digitalPain>
    <fallBed v-if="code =='MORSE'" :messages="recordViewData"></fallBed>
    <infectionAss v-if="code =='INFECTION'" :messages="recordViewData"></infectionAss>
    <MEWS v-if="code =='MEWS'" :messages="recordViewData"></MEWS>
    <painAss v-if="code =='CPOT'" :messages="recordViewData"></painAss>
    <slipAss v-if="code =='SLIPPAGE'" :messages="recordViewData"></slipAss>
    <soresAss v-if="code =='BRADEN'" :messages="recordViewData"></soresAss>
    <strengthAss v-if="code =='MUSCLEFORCE'" :messages="recordViewData"></strengthAss>
    <unscheduledAss v-if="code =='UEX'" :messages="recordViewData"></unscheduledAss>
  </basic-container>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import {
  fetchList,
  getRecord,
  delRecod,
  getRecordView
} from "@/api/icu/assessment/assRecords.js";
import { dateFormat, calcDate } from "@/util/date";
import { tableOption } from "@/const/crud/icu/assessment/assRecords.js";
import APACHE from "./APACHE";
import infectionAss from "./infectionAss";
import CPOT from "./CPOT";
import painAss from "./painAss";
import slipAss from "./slipAss";
import soresAss from "./soresAss";
import strengthAss from "./strengthAss";
import unscheduledAss from "./unscheduledAss";
import calmRestless from "./calmRestless";
import MEWS from "./MEWS";
import bloodAss from "./bloodAss";
import digitalPain from "./digitalPain";
import fallBed from "./fallBed";

export default {
  components: {
    APACHE,
    infectionAss,
    CPOT,
    painAss,
    slipAss,
    soresAss,
    strengthAss,
    unscheduledAss,
    calmRestless,
    MEWS,
    bloodAss,
    digitalPain,
    fallBed
  },

  filters: {
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
  watch:{
     patientMessage: {
         handler(newValue, oldValue) {
            this.patientNameClick(newValue.patientName,newValue.id,newValue.patientId,newValue);
         }
      }
  },
  data() {
    return {
      message: {},
      code: "",
      viewMoreIf: true,
      recordViewData: [],
      projectCode: "Braden",
      projectId: "",
      min: "",
      max: "",
      range: [],
      //avue-crud
      patientId: "",
      searchForm: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption,
      // viewIf: true,
      // 患者
      name: "",
      patName: "",
      patName: "",
      patientNames: [],
      patInfo: {},
      pickerOptions2: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      value2: "",
      maxScore: null,
      minScore: null
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

  created() {
    this.getNursePatients();
  },
  activated() {
    this.getNursePatients();
  },
  mounted() {},
  methods: {
    // 请求患者列表
    getNursePatients() {
      let data = JSON.parse(sessionStorage.getItem("pigx-all_patients"))
        .content;
      this.patInfo = JSON.parse(sessionStorage.getItem("pigx-patientMessage")).content;
      this.patientNames = data;
      this.patName =this.patInfo.patientId;
      this.name = this.patInfo.name;
      let params = {
        patientId:this.patInfo.patientId
      };
      this.searchForm.patientId = this.patName;
      this.getList(this.page, this.searchForm);
    },
    sizeChange(val) {
      this.page.pageSize = val;
      this.searchForm.patientId = this.patName;
      this.getList(this.page, this.searchForm);
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.searchForm.patientId = this.patName;
      this.getList(this.page, this.searchForm);
    },
    patientNameClick(patientName, id, patientId, item) {
      this.viewMoreIf = true;
      this.code = "";
      this.patName = patientId;
      this.name = patientName;
      this.$store.commit('SET_MESSAGE',item)
      this.patInfo = this.patientMessage
      let params = {
        patientId: this.patName
      };
      this.searchChange(this.patName);
    },
    getList(page, params) {
      this.tableLoading = true;
      fetchList(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize
          },
          params,
          this.searchForm
        )
      )
        .then(response => {
          this.tableData = response.data.data.records;
          this.page.pageSize = response.data.data.size;
          this.page.currentPage = response.data.data.current;
          this.page.total = response.data.data.total;
          // console.log(this.tableData);
          this.tableLoading = false;
        })
        .catch(() => {
          this.tableLoading = false;
        });
    },
    rowDel: function(row, index) {
      // console.log(row)
      // console.log(index)
      var _this = this;
      this.$confirm("是否确认删除ID为" + row.id, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return delRecod(row.id);
        })
        .then(data => {
          _this.tableData.splice(index, 1);
          _this.$message({
            showClose: true,
            message: "删除成功",
            type: "success"
          });
          this.getList(this.page);
        });
    },
    /**
     * @title 数据更新
     * @param row 为当前的数据
     * @param index 为当前更新数据的行数
     * @param done 为表单关闭函数
     *
     **/
    handleUpdate: function(row, index, done, loading) {
      putObj(row)
        .then(data => {
          this.tableData.splice(index, 1, Object.assign({}, row));
          this.$message({
            showClose: true,
            message: "修改成功",
            type: "success"
          });
          done();
          this.getList(this.page);
        })
        .catch(() => {
          loading();
        });
    },
    /**
     * @title 数据添加
     * @param row 为当前的数据
     * @param done 为表单关闭函数
     *
     **/
    handleSave: function(row, done, loading) {
      addObj(row)
        .then(data => {
          this.tableData.push(Object.assign({}, row));
          this.$message({
            showClose: true,
            message: "添加成功",
            type: "success"
          });
          done();
          this.getList(this.page);
        })
        .catch(() => {
          loading();
        });
    },
    /**
     * 搜索回调
     */
    search(val) {
      this.page = {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      };
      if (this.patName != null && this.patName != "") {
        this.searchForm.patientId = this.patName;
      }
      if (this.value2) {
        this.searchForm.statrTime = dateFormat(this.value2[0]);
        this.searchForm.endTime = dateFormat(this.value2[1]);
      }
      if (this.minScore != null) {
        this.searchForm.minScore = this.minScore;
      }
      if (this.maxScore) {
        this.searchForm.maxScore = this.maxScore;
      }
      this.searchForm.projectName = val.projectName;
      this.getList(this.page, this.searchForm);
    },
    clearform() {
      this.minScore = null
      this.maxScore = null
      this.value2 = "";
      this.page = {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      };

      this.searchForm = {};
      this.getList(this.page);
    },
    searchChange(patientId) {
      // console.log(patientId);
      this.page.currentPage = 1;
      this.searchForm.patientId = patientId;
      this.getList(this.page, this.searchForm);
    },
    clearSearch() {
      delete this.searchForm.patientId;
      this.patientId = null;
      this.getList(this.page);
    },
    /**
     * 刷新回调
     */
    refreshChange() {
      this.getList(this.page);
    },

    //详情
    viewMore(row) {
      console.log(row);

      let params = {
        projectId: row.projectId,
        assessRecordId: row.assessRecordId
      };
      getRecordView(params).then(response => {
        // console.log(response);
        this.recordViewData = response.data.data.data;
        this.recordViewData[0].patientId = this.patName;
        // console.log(this.recordViewData)
        this.viewMoreIf = false;
        this.code = row.projectCode;
      });
    },
    returnClick() {
      (this.code = ""), (this.viewMoreIf = true);
    }
  }
};
</script>

<style lang="scss" scoped>
.el-col{
 margin-bottom: 0%!important;
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
  font-size: 16px;
  font-weight: 600;
  float: left;
}
.perinfo {
  margin-right: 100px;
  line-height: 30px;
  font-size: 12px;
  float: right;
}
.patient_name {
  margin-top: 5px;
  margin-left: 1%;
}
.ActBtn {
  background: #409eff !important;
  color: #fff !important;
  text-align: center;
}
.patientBtn {
  text-align: center;
  overflow: hidden;
}
#basic-table {
  width: 96%;
  margin-left: 2%;
  border: 1px solid #ddd;
}
#basic-table td,
#basic-table th {
  // line-height: 30px;
  width: 115px;
  height: 65px;
  padding: 0;
  border: 1px solid #ddd;
  // text-align: center;
  // vertical-align: middle;
}
.content {
  margin-top: 20px;
  text-align: center;
}
.submit {
  background: #409eff !important;
  color: #fff !important;
  text-align: center;
}
.combined {
  display: inline-block;
  width: 24%;
  margin-right: 33%;
}
.total {
  display: inline-block;
  width: 9.4%;
  margin-left: 33.4%;
}
#input {
  width: 15%;
}
#typeTd {
  width: 20%;
}
// @media screen and (max-width: 1024px) {
//   .main {
//     width: 830px;
//   }
// }
// @media screen and (max-width: 768px) {
//   .main {
//     width: 600px;
//   }
// }
.td_span {
  // display: inline-block;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 65px;
  // height: 100%;

  overflow: hidden;
}

.avue-tags__menu {
  line-height: 40px;
  padding-right: 10px;
  margin-top: 18px;
  margin-right: 1%;
  z-index: 900;
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