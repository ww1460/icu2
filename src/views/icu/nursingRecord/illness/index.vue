<template>
  <!-- 患者病情护理 -->
  <div v-loading="loading" class="nursing_patient">
    <div class="condition">
      <basic-container>
        <el-dialog title="固定值" :visible.sync="dialogFormVisible">
          <div style="display: flex; flex-wrap: wrap;
    justify-content: space-between;">
            <el-button
              style="margin-top:10px"
              :type="item.id == itemFlag?'primary':''"
              @click="chageItem(item.id,item.recordValue)"
              v-for="item in fixedValueList"
              :key="item.id"
            >{{item.recordValue}}</el-button>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
          </div>
        </el-dialog>

        <div class="panel-heading clearfix">
          <div class="perinfo">
            <span>姓名: &nbsp;{{patInfo.name}}</span>&nbsp;
            <span>性别：&nbsp;{{patInfo.gender | genderFl }}</span>&nbsp;
            <span>年龄：&nbsp;{{patInfo.age}}</span>&nbsp;
            <span>入科日期：&nbsp;{{patInfo.entranceTime | timeFl}}</span>&nbsp;
          </div>
        </div>
        <!-- <div v-if="roleCodes == 'ROLE_NURSE'">
          <el-dropdown class="avue-tags__menu">
            <el-button v-model="name" type="primary" size="mini">
              {{ name }}
              <i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu>
              <el-button
                v-for="(item,index) in patientNames"
                :title="item.patientName"
                :key="index"
                :class="['patientBtn',(item.patientId == patName?'ActBtn':'')]"
                @click="patientNameClick(item.patientName,item.id,item.patientId,item)"
              >{{ item.patientName }}</el-button>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div v-else-if="roleCodes == 'ROLE_MATRON'">
          <el-dropdown class="avue-tags__menu">
            <el-button v-model="name" type="primary" size="mini">
              {{ name }}
              <i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu>
              <el-button
                v-for="(item,index) in patientNames"
                :title="item.name"
                :key="index"
                :class="['patientBtn',(item.patientId == patName?'ActBtn':'')]"
                @click="patientIdChange(item.name,item.id,item.patientId,item)"
              >{{ item.name }}</el-button>
            </el-dropdown-menu>
          </el-dropdown>
        </div>-->
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
        <div class="table_illness">
          <table class="table table-bordered" id="basic-table" style="min-width:1200px">
            <thead>
              <tr rowspan="2">
                <th rowspan="2">基本项目</th>
                <th rowspan="2">项目类型</th>
                <th rowspan="2">正常情况</th>
                <th rowspan="2">异常情况</th>
                <th rowspan="2">患者病情</th>
                <th colspan="2">护理措施</th>
              </tr>
              <tr>
                <th>建议措施</th>
                <th>实施措施</th>
              </tr>
            </thead>
            <tbody v-for="(item,index) in nursingList" :key="index">
              <tr :rowspan="item.length + 1">
                <td :rowspan="item.length +1">{{item[0].illnessNursingTypeFlag | projectType}}</td>
              </tr>

              <tr v-for="(i,index1) in item" :key="index1">
                <td>{{i.projectName}}</td>
                <td>
                  <p
                    style="padding:80px 0;"
                    v-if="j.projectStateFlag == 0"
                    v-for="(j,index2) in i.illness"
                    :key="index2"
                    :class="j.flag?'el-button--primary':''"
                    @click="unusual(i.projectId,j.illnessNursingStateId,item[0].illnessNursingTypeFlag)"
                  >{{j.projectState}}</p>
                </td>

                <td>
                  <p
                    style="padding:15px;border:1px solid #ebeef5"
                    v-for="(j,index2) in i.illness"
                    :key="index2"
                    v-if="j.projectStateFlag == 1"
                    :class="j.flag?'el-button--primary':''"
                    @click="unusual(i.projectId,j.illnessNursingStateId,item[0].illnessNursingTypeFlag)"
                  >{{ j.projectState}}</p>
                </td>
                <td>
                  <el-input
                    v-if="item[index1].projectRecordValueFlag == 0"
                    :autosize="{ minRows: 8, maxRows: 12}"
                    @change="changerd(item[index1].projectId,item[index1].projectRecord)"
                    type="textarea"
                    scoped
                    v-model="item[index1].projectRecord"
                    @focus="Inputfocus(item[index1].projectId,item[index1],item[index1].projectRecord)"
                  ></el-input>

                  <el-input
                    v-else-if="item[index1].projectRecordValueFlag == 1"
                    :autosize="{ minRows: 8, maxRows: 12}"
                    @change="changerd(item[index1].projectId,item[index1].projectRecord)"
                    type="textarea"
                    scoped
                    v-model="item[index1].projectRecord"
                  ></el-input>
                </td>
                <td>
                  <div v-if="j.flag" v-for="(j,index2) in i.illness" :key="index2">
                    <p
                      style="border:1px solid #ebeef5;padding:10px"
                      v-for="(k,index3) in j.illnessAdvices"
                      :key="index3"
                      @click="measure(k,item[index1].projectId)"
                      :class="k.flag?'el-button--primary':''"
                    >{{k.nursingAdvice}}</p>
                  </div>
                </td>
                <td style="step">
                  <el-input
                    style="height:100%"
                    :autosize="{ minRows: 8, maxRows: 12}"
                    @change="change(item[index1].projectId,item[index1].nursingMeasure)"
                    type="textarea"
                    v-model="item[index1].nursingMeasure"
                  ></el-input>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="hideNoData" class="el-table__empty-block" style="border">
            <span class="el-table__empty-text">
              <div class="avue-crud__empty">
                <div class="avue-empty">
                  <div class="avue-empty__image" style="height: 50px;">
                    <img
                      src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAxKSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgIDxlbGxpcHNlIGZpbGw9IiNGNUY1RjUiIGN4PSIzMiIgY3k9IjMzIiByeD0iMzIiIHJ5PSI3Ii8+CiAgICA8ZyBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0iI0Q5RDlEOSI+CiAgICAgIDxwYXRoIGQ9Ik01NSAxMi43Nkw0NC44NTQgMS4yNThDNDQuMzY3LjQ3NCA0My42NTYgMCA0Mi45MDcgMEgyMS4wOTNjLS43NDkgMC0xLjQ2LjQ3NC0xLjk0NyAxLjI1N0w5IDEyLjc2MVYyMmg0NnYtOS4yNHoiLz4KICAgICAgPHBhdGggZD0iTTQxLjYxMyAxNS45MzFjMC0xLjYwNS45OTQtMi45MyAyLjIyNy0yLjkzMUg1NXYxOC4xMzdDNTUgMzMuMjYgNTMuNjggMzUgNTIuMDUgMzVoLTQwLjFDMTAuMzIgMzUgOSAzMy4yNTkgOSAzMS4xMzdWMTNoMTEuMTZjMS4yMzMgMCAyLjIyNyAxLjMyMyAyLjIyNyAyLjkyOHYuMDIyYzAgMS42MDUgMS4wMDUgMi45MDEgMi4yMzcgMi45MDFoMTQuNzUyYzEuMjMyIDAgMi4yMzctMS4zMDggMi4yMzctMi45MTN2LS4wMDd6IiBmaWxsPSIjRkFGQUZBIi8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K"
                      alt
                    />
                  </div>
                  <p class="avue-empty__desc">暂无数据</p>
                </div>
              </div>
            </span>
          </div>
        </div>
        <div v-if="btnFlag" class="operation_top">
          <el-button type="primary" @click="sub()">提交</el-button>
        </div>
      </basic-container>
    </div>
  </div>
</template>

<script>
let that;
import { mapGetters, mapState } from "vuex";
import {
  illnessNursingState,
  getType,
  subData,
  getfixedValue
} from "@/api/icu/nurse/illness";
import { pbkdf2 } from "crypto";

export default {
  data() {
    return {
      btnFlag: false,
      itemFlag: "",
      dialogFormVisible: false,
      nursingList: [],
      illnessNursingStateId: "",
      projectIdList: [],
      itemList: {},
      stateIdList: [],
      nursingData: [],
      // 患者
      name: "",
      patName: "",
      patientNames: [],
      patInfo: {},
      typeList: [],
      loading: true,
      fixedValueList: [],
      text: "",
      projectId: "",
      hideNoData: false
    };
  },
  beforeCreate: function() {
    that = this;
  },
  filters: {
    projectType: data => {
      for (var i in that.typeList) {
        if (that.typeList[i].value == data) {
          return that.typeList[i].label;
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
  computed: {
    ...mapGetters([
      "permissions",
      "nurse_patients",
      "dep_patients",
      "patientMessage"
    ]),
    ...mapState({
      roleCodes: state => state.user.roleCodes
    }),
    permissionList() {
      return {};
    }
  },
  watch: {
    patientMessage: {
      handler(newValue, oldValue) {
        this.patientNameClick(
          newValue.name,
          newValue.id,
          newValue.patientId,
          newValue
        );
      }
    }
  },

  //   created() {
  //     this.getNursePatients();
  //   },
  activated() {
    this.getNursePatients();
  },
  methods: {
    chageItem(id, text) {
      this.itemFlag = id;
      for (var i in this.nursingList) {
        for (var k in this.nursingList[i]) {
          if (this.nursingList[i][k].projectId == this.projectId) {
            this.nursingList[i][k].projectRecord = text;
          }
        }
      }

      this.$forceUpdate();
    },
    //有固定值的焦点事件
    Inputfocus(id, item, text) {
      this.projectId = item.projectId;
      this.$forceUpdate();
      getfixedValue(id).then(res => {
        this.fixedValueList = res.data.data;
        this.dialogFormVisible = true;
      });
    },
    // 请求患者列表
    getNursePatients() {
      // if (this.roleCodes == "ROLE_MATRON") {
      //   this.$store.dispatch("getPatientsByDep").then(response => {
      //     this.patientNames = this.dep_patients.patients;
      //     this.patName = this.patientNames[0].patientId;
      //     this.name = this.patientNames[0].name;
      //     this.patInfo = this.patientNames[0];
      //     this.getList();
      //   });
      // }
      // if (this.roleCodes == "ROLE_NURSE") {
      //   this.$store.dispatch("getPatientsByNurseId").then(response => {
      //     this.patientNames = this.nurse_patients;
      //     this.patName = this.patientNames[0].patientId;
      //     this.name = this.patientNames[0].patientName;
      //     this.patInfo = this.patientNames[0].patient;
      //     this.getList();
      //   });
      // }
      let data = JSON.parse(sessionStorage.getItem("pigx-all_patients"))
        .content;
      if (data != undefined) {
        this.patientNames = data;
        this.patName = data[0].patientId;
        this.name = data[0].name;
        this.patInfo = data[0];
        this.getList();
      } else {
        this.loading = false;
        this.$message({
          type: "warning",
          message: "暂无患者!"
        });
        this.hideNoData = true;
      }
    },
    patientNameClick(patientName, id, patientId, item) {
      this.patName = patientId;
      this.name = patientName;
      this.$store.commit("SET_MESSAGE", item);
      this.patInfo = this.patientMessage;
      this.getList();
    },
    patientIdChange(name, id, patientId, item) {
      // console.log(item);
      this.patName = patientId;
      this.name = name;
      this.patInfo = item;
      this.getList();
    },

    getList() {
      this.loading = true;
      getType().then(res => {
        this.typeList = res.data.data;
      });

      illnessNursingState(this.patName).then(res => {
        if (res.data.code == 0) {
          if (JSON.stringify(res.data.data) === "{}") {
            this.loading = false;
            this.hideNoData = true;
          } else {
            this.nursingList = res.data.data;
            this.loading = false;
            this.btnFlag = true;
          }
        }
      });
    },
    change(id, text) {
      for (var i in this.nursingData) {
        if (this.nursingData[i].projectId == id) {
          this.nursingData[i].nursingMeasure = text;
        }
      }
    },
    changerd(id, text) {
      for (var i in this.nursingData) {
        if (this.nursingData[i].projectId == id) {
          this.nursingData[i].illnessRecord = text;
        }
      }
    },
    //点击提交
    sub() {
      this.$confirm("是否确认提交, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          subData(this.nursingData).then(res => {
            this.$message({
              type: "success",
              message: "提交成功!"
            });
            this.$router.push({
              path: "/icu/nursingRecord/nursingRecord/index"
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消提交"
          });
        });
    },
    //措施点击
    measure(item, id) {
      var str = "";
      if (item.flag) {
        item.flag = false;
        for (let i in this.nursingList) {
          for (let k in this.nursingList[i]) {
            if (id == this.nursingList[i][k].projectId) {
              // this.nursingList[1][i].nursingMeasure = "";
              this.nursingList[i][k].nursingMeasure = this.nursingList[i][
                k
              ].nursingMeasure.replace(`${item.nursingAdvice};`, "");
              str = this.nursingList[i][k].nursingMeasure;
            }
          }
        }
      } else {
        item.flag = true;
        for (let i in this.nursingList) {
          for (let k in this.nursingList[i]) {
            if (id == this.nursingList[i][k].projectId) {
              this.nursingList[i][k].nursingMeasure += `${item.nursingAdvice};`;
              str = this.nursingList[i][k].nursingMeasure;
            }
          }
        }
      }

      for (let i in this.nursingData) {
        if (this.nursingData[i].projectId == id) {
          this.nursingData[i].illnessRecord = str;
        }
      }
      this.$forceUpdate();
    },

    //正异常点击
    unusual(projectId, illnessNursingStateId, illnessNursingTypeFlag) {
      this.itemList = {};
      for (var i in this.nursingList) {
        if (
          this.nursingList[i][0].illnessNursingTypeFlag ==
          illnessNursingTypeFlag
        ) {
          // console.log(this.nursingList[i]);
          for (var k in this.nursingList[i]) {
            // this.nursingList[i][k].nursingMeasure = this.nursingList[i][k].nursingMeasure
            for (var j in this.nursingList[i][k].illness) {
              if (this.nursingList[i][k].projectId == projectId) {
                if (
                  this.nursingList[i][k].illness[j].illnessNursingStateId ==
                  illnessNursingStateId
                ) {
                  if (this.nursingList[i][k].illness[j].flag == true) {
                    this.nursingList[i][k].illness[j].flag = false;
                    this.itemList = {};
                    this.nursingList[i][k].value = "";
                    // console.log(this.nursingList[i][k].illness[j]);
                    // console.log(this.nursingData);
                    //判断提交的的数组里面有没有当前ID
                    for (var l in this.nursingData) {
                      if (
                        this.nursingData[l].illnessNursingStateId ==
                        illnessNursingStateId
                      ) {
                        this.nursingData.splice(l, 1);
                      }
                    }
                  } else {
                    //如果长度小于0  直接push   否则 继续循环
                    if (this.nursingData.length != 0) {
                      for (var m in this.nursingData) {
                        //如果项目ID 相同 删除当前 重新push 一条数据
                        if (this.nursingData[m].projectId == projectId) {
                          this.nursingData.splice(m, 1);
                        }
                      }
                      this.nursingData.push({
                        projectState: this.nursingList[i][k].illness[j]
                          .projectState,
                        projectId: this.nursingList[i][k].projectId,
                        nursingAdvice: this.nursingList[i][k].illness[j]
                          .nursingAdvice,
                        illnessRecord: this.nursingList[i][k].projectRecord,
                        nursingMeasure: this.nursingList[i][k].nursingMeasure,
                        patientId: this.patName
                      });
                    } else {
                      this.nursingData.push({
                        projectState: this.nursingList[i][k].illness[j]
                          .projectState,
                        projectId: this.nursingList[i][k].projectId,
                        nursingAdvice: this.nursingList[i][k].illness[j]
                          .nursingAdvice,
                        illnessRecord: this.nursingList[i][k].projectRecord,
                        nursingMeasure: this.nursingList[i][k].nursingMeasure,
                        patientId: this.patName
                      });
                    }

                    this.nursingList[i][k].illness[j].flag = true;
                    //点击的当前选项下面 建议措施 取消选中
                    for (var v in this.nursingList[i][k].illness[j]
                      .illnessAdvices) {
                      this.nursingList[i][k].illness[j].illnessAdvices[
                        v
                      ].flag = false;
                    }
                    this.itemList.nursingAdvice = this.nursingList[i][
                      k
                    ].illness[j].nursingAdvice;
                    this.nursingList[i][k].value = this.nursingList[i][
                      k
                    ].illness[j].nursingAdvice;
                  }

                  // this.projectIdList.push
                } else {
                  if (this.nursingList[i][k].projectId == projectId) {
                    this.nursingList[i][k].illness[j].flag = false;
                    this.nursingList[i][k].nursingMeasure = "";
                  }
                }
              }
            }
          }
        }
      }
      this.$forceUpdate();
      // console.log(this.itemList);
    }
  }
};
</script>

<style lang="scss">
.nursing_patient {
  .perinfo {
    height: 40px;
  }
  .condition .el-textarea__inner {
    border: none !important;
  }
  .condition .cell {
    text-align: center;
  }
  .condition #basic-table thead {
    background: #fafafa;
  }
  .condition .table-bordered th,
  .condition .table-bordered td {
    width: 200px;
    padding: 0 !important;
    border: 1px solid #ebeef5;
    p:last-child {
      border-bottom: 0px;
    }
    p:first-child {
      border-top: 0px;
    }
  }
  .condition.table-bordered div:last-child {
    border-bottom: 0;
  }
  .condition .mal {
    padding: 0px;
    min-width: 80px;
    max-width: 200px;
    min-height: 80px;
    max-height: 200px;
    cursor: pointer;
    overflow-y: auto;
  }
  .condition .widths {
    width: 150px;
    height: 200px;
    overflow-y: auto;
  }
  .condition .border {
    border: 0;
    height: 200px;
  }
  .condition .left {
    text-align: left;
  }
  .condition .operation_top {
    text-align: center;
    margin: 50px 0;
  }
}
.table_illness {
  overflow-x: auto;
  border: 1px solid #ebeef5;
}
</style>


<style lang="scss" scoped>
.avue-tags__menu {
  line-height: 40px;
  padding-right: 16px;
  margin-top: 10px;
  margin-right: 1%;
  z-index: 2004;
}

.patientBtn {
  width: 90px;
  margin: 3%;

  overflow: hidden;
}
.patientBtn span {
  text-align: center;
}
.ActBtn {
  background: #409EFF ;
  color: #fff !important;
}
</style>