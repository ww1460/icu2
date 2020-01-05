<template>
  <!-- 血栓评估 -->
  <basic-container>
    <div class="panel panel-default">
      <div class="panel-heading clearfix" v-if="!parentIf">
        <h3 class="panel-title">血栓评分</h3>
        <div class="perinfo">
          <span>姓名: &nbsp;{{patInfo.name}}</span>&nbsp;
          <span>性别：&nbsp;{{patInfo.denger == 1?'男':'女'}}</span>&nbsp;
          <span>年龄：&nbsp;{{patInfo.age}}</span>&nbsp;
          <span>入科日期：&nbsp;{{patInfo.entranceTime | timeFl}}</span>&nbsp;
        </div>
      </div>
      <!-- v-if="roleCodes == 'ROLE_NURSE'&&!parentIf" -->
      <div v-if="!parentIf">
        <el-dropdown class="avue-tags__menu">
          <el-button type="primary" size="mini" v-model="patInfo.patientId">
            {{patInfo.patientName}} {{patInfo.bedName}}
            <i
              class="el-icon-arrow-down el-icon--right"
            />
          </el-button>
          <el-dropdown-menu>
            <div class="dropdownMenu">
              <el-button
                v-for="(item,index) in patientNames"
                :key="index"
                :title="item.patientName"
                :class="['el-button--small',(item.patientId == patName?'el-button el-button--primary':'')]"
                @click="patientNameClick(item.patientName,item.id,item.patientId,item)"
              >{{item.patientName}} {{item.bedName}}</el-button>
            </div>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <table
        class="table table-bordered"
        id="basic-table"
        v-for="(items,index) in tableList"
        v-loading="loading"
        :key="index"
      >
        <thead>
          <th colspan="6">{{items.assessType}}</th>
        </thead>
        <tbody v-for="(item1,index1) in groupingData" :key="index1">
          <tr>
            <td colspan="6">
              <span class="green">（{{item1.projectName}}）</span>
            </td>
          </tr>
          <tr v-for="(item2,index2) in item1.arr" :key="index2">
            <td
              v-for="(item3,index3) in item2"
              :key="index3"
              @click="getId(item3,item2,item1,items)"
              :class="item3.falg==true?'el-button--primary':''"
            >{{item3.assessCondition}}</td>
          </tr>
          <tr>
            <td colspan="6">
              <span class="subtotal1">小 计:</span>
              <span class="subtotal2">{{item1.subtotal}}</span>
            </td>
          </tr>
        </tbody>
        <tr>
          <td colspan="6">
            <span class="subtotal1">总 计:</span>
            <span class="subtotal2">{{totalScore}}</span>
          </td>
        </tr>
      </table>
      <div class="content" v-if="!parentIf">
        <el-button size="medium" class="btn-cancle" @click="cancel">清空</el-button>
        <el-button
          @click="submit"
          size="medium"
          class="el-button el-button--primary"
          :loading="loading"
        >提交</el-button>
      </div>
    </div>
  </basic-container>
</template>

<script>
import { getAssess, addAss, getEch } from "@/api/icu/assessment/APACHE.js";
import { mapGetters, mapState } from "vuex";
import { createHash } from "crypto";

export default {
  name: "bloodAss",
  props: {
    messages: Array
  },
  watch: {
    messages: {
      handler(newValue, oldValue) {
        if (newValue == undefined) {
          return;
        }
        // console.log(newValue[0].patientId)
        this.tableList = JSON.parse(JSON.stringify(newValue));
        this.grouping();
        //   console.log(1);
        this.parentIf = true;
        for (let i in this.tableList) {
          if (this.tableList[i].assessProjects[0].pitchOnId == null) {
            // 第一次评估
            for (const t in this.groupingData) {
              for (const j in this.groupingData[t].arr) {
                for (const k in this.groupingData[t].arr[j]) {
                  this.groupingData[t].arr[j][k].falg = false;
                  this.groupingData[t].arr[j][k].assessScore = 0;
                }
              }
            }
          } else {
            //  有过评估记录后  将上次评估的结果渲染
            for (const t in this.groupingData) {
              for (const j in this.groupingData[t].arr) {
                for (const k in this.groupingData[t].arr[j]) {
                  for (const v in this.groupingData[t].pitchOnId) {
                    if (
                      this.groupingData[t].arr[j][k].assessConditionId ==
                      this.groupingData[t].pitchOnId[v]
                    ) {
                      this.groupingData[t].arr[j][k].falg = true;
                      this.groupingData[t].arr[j][k].assessScore = Number(
                        this.groupingData[t].arr[j][k].assessResult
                      );
                      this.submitData[t].push(this.groupingData[t].arr[j][k]);
                      this.arr1.push(this.groupingData[t].arr[j][k]);
                    }
                  }
                }
              }
              for (const l in this.arr1) {
                this.groupingData[t].subtotal += Number(
                  this.arr1[l].assessScore
                );
              }
              this.totalScore += this.groupingData[t].subtotal;
              this.arr1 = [];
            }
            this.submitItem = this.tableList[i];
          }
        }
        this.$forceUpdate();
        this.loading = false;
      },
      deep: true,
      immediate: true
    },

    patientMessage: {
      handler(newValue, oldValue) {
        this.patientNameClick(
          newValue.patientName,
          newValue.id,
          newValue.patientId,
          newValue
        );
      }
    }
  },
  filters: {
    timeFl: data => {
      if (data) {
        data = data.substr(0, 11);
      }

      return data;
    }
  },
  data() {
    return {
      parentIf: false,
      // 患者
      patName: "",
      patientNames: [],
      patientName: "",
      // 患者信息
      patInfo: [],
      tableList: [],
      groupingData: [],
      arr: [],
      arr1: [],
      arr2: [],
      // 总计
      totalScore: 0,
      loading: false,
      // 提交
      submitData: [],
      submitItem: "",
      length: 0
    };
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
  created() {
    if (this.parentIf == false) {
      this.getNursePatients();
    }
  },
  activated() {
    if (this.parentIf == false) {
      this.getNursePatients();
    }
  },
  methods: {
    // 请求数据
    getRequest() {
      this.arr = [];
      this.arr2 = [];
      this.arr1 = [];
      this.groupingData = [];
      this.totalScore = 0;
      let query = {
        patientId: this.patName,
        projectCode: "Caprini"
      };
      this.loading = true;
      getAssess(query).then(response => {
        this.tableList = response.data.data.data;
        this.grouping();
        // console.log(this.tableList)
        this.projectId = this.tableList[0].projectId;
        for (let i in this.tableList) {
          if (this.tableList[i].assessProjects[0].pitchOnId == null) {
            // 第一次评估
            for (const t in this.groupingData) {
              for (const j in this.groupingData[t].arr) {
                for (const k in this.groupingData[t].arr[j]) {
                  this.groupingData[t].arr[j][k].falg = false;
                  this.groupingData[t].arr[j][k].assessScore = 0;
                }
              }
            }
          } else {
            //  有过评估记录后  将上次评估的结果渲染
            this.totalScore = 0
            for (const t in this.groupingData) {
              for (const j in this.groupingData[t].arr) {
                for (const k in this.groupingData[t].arr[j]) {
                  for (const v in this.groupingData[t].pitchOnId) {
                    if (
                      this.groupingData[t].arr[j][k].assessConditionId ==
                      this.groupingData[t].pitchOnId[v]
                    ) {
                      this.groupingData[t].arr[j][k].falg = true;
                      this.groupingData[t].arr[j][k].assessScore = Number(
                        this.groupingData[t].arr[j][k].assessResult
                      );
                      this.submitData[t].push(this.groupingData[t].arr[j][k]);
                      this.arr1.push(this.groupingData[t].arr[j][k]);
                    }
                  }
                }
              }
              for (const l in this.arr1) {
                this.groupingData[t].subtotal += Number(
                  this.arr1[l].assessScore
                );
              }
              this.totalScore += this.groupingData[t].subtotal;
              this.arr1 = [];
            }
            this.submitItem = this.tableList[i];
          }
        }
        this.$forceUpdate(); //强制页面进行刷新
        this.loading = false;
      });
    },
    // 请求后数据分组
    grouping() {
      var _this = this;
      this.arr = [];
      this.arr2 = [];
      this.groupingData = [];
      // 定义数组拆分方法
      function group(array, subGroupLength) {
        let index = 0;
        let newArray = [];
        while (index < array.length) {
          newArray.push(array.slice(index, (index += subGroupLength)));
        }
        return newArray;
      }
      // 遍历请求的数据 添加给数组 tableList1
      for (const i in this.tableList) {
        for (const j in this.tableList[i].assessProjects) {
          this.groupingData.push(this.tableList[i].assessProjects[j]);
        }
      }
      for (const k in this.groupingData) {
        this.submitData[k] = [];
        // 判断是否大于6个;
        if (this.groupingData[k].projectConditions.length < 7) {
          this.arr = [];
          this.arr.push(this.groupingData[k].projectConditions);
          // 判断某一项是否为undefined 并push进数组arr
          for (let l = 0; l < 6; l++) {
            if (this.groupingData[k].projectConditions[l] == undefined) {
              let g = {
                assessCondition: "",
                assessConditionId: "",
                assessProjectId: "",
                assessResult: "",
                assessScore: 0,
                createTime: "",
                createUserId: "",
                delFlag: "",
                id: ""
              };
              this.arr[0].push(g);
            }
          }
          let thisArr = this.arr;
          this.groupingData[k].arr = thisArr;
          this.groupingData[k].subtotal = 0;
        } else {
          // 拆分数组
          this.arr2 = [];
          this.arr2 = group(_this.groupingData[k].projectConditions, 6);
          // 分次添加给 groupingData
          for (let q = 0; q < this.arr2.length; q++) {
            // 判断tableList1里某一项是否为undefined 并push进数组arr
            for (let w = 0; w < 6; w++) {
              if (this.arr2[q][w] == undefined) {
                let g = {
                  assessCondition: "",
                  assessConditionId: "",
                  assessProjectId: "",
                  assessResult: "",
                  assessScore: 0,
                  createTime: "",
                  createUserId: "",
                  delFlag: "",
                  id: ""
                };
                this.arr2[q].push(g);
              }
            }
          }
          this.groupingData[k].arr = this.arr2;
          this.groupingData[k].subtotal = 0;
        }
      }
      // 小计赋值 高亮显示
      for (const i in this.groupingData) {
        for (const j in this.groupingData[i].arr) {
          for (const k in this.groupingData[i].arr[j]) {
            this.groupingData[i].arr[j][k].falg = false;
            this.groupingData[i].arr[j][k].assessScore = 0;
          }
        }
      }
    },
    getNursePatients() {
      let data = JSON.parse(sessionStorage.getItem("pigx-all_patients"))
        .content;
      this.patInfo = JSON.parse(
        sessionStorage.getItem("pigx-patientMessage")
      ).content;
      this.patientNames = data;
      this.patientName = this.patInfo.name;
      this.patName = this.patInfo.patientId;
      this.getRequest();
    },
    patientNameClick(patientName, id, patientId, item) {
      this.patName = patientId;
      this.patientName = patientName;
      this.$store.commit("SET_MESSAGE", item);
      this.patInfo = this.patientMessage;
      this.getRequest();
    },
    patient(name, id, patientId) {
      this.patName = patientId;
      for (const i in this.patientNames) {
        if (this.patientNames[i].id == id) {
          this.patientName = this.patientNames[i].name;
          this.patInfo = this.patientNames[i];
        }
      }
      this.getRequest();
    },
    getId(item3, item2, item1, items) {
      if (this.parentIf == true) {
        return;
      }
      this.submitItem = items;
      if (item3.id != "") {
        if (item3.falg == true) {
          item3.falg = false;
          for (const i in this.groupingData) {
            this.arr1 = [];
            this.groupingData[i].subtotal = 0;
            for (const b in this.submitData[i]) {
              if (item3.id == this.submitData[i][b].id) {
                this.submitData[i].splice(b, 1);
              }
            }
            for (const j in this.groupingData[i].arr) {
              for (const k in this.groupingData[i].arr[j]) {
                if (item3.id == this.groupingData[i].arr[j][k].id) {
                  this.groupingData[i].arr[j][k].assessScore = 0;
                }
                this.arr1.push(this.groupingData[i].arr[j][k]);
              }
            }
            for (const l in this.arr1) {
              this.groupingData[i].subtotal += Number(this.arr1[l].assessScore);
            }
          }
          // 分值
        } else {
          item3.falg = true;
          for (const i in this.groupingData) {
            this.groupingData[i].subtotal = 0;
            this.arr1 = [];
            if (this.groupingData[i].assessProjectId == item1.assessProjectId) {
              this.submitData[i].push(item3);
            }

            for (const j in this.groupingData[i].arr) {
              for (const k in this.groupingData[i].arr[j]) {
                if (item3.id == this.groupingData[i].arr[j][k].id) {
                  this.groupingData[i].arr[j][k].assessScore = Number(
                    this.groupingData[i].arr[j][k].assessResult
                  );
                }
                this.arr1.push(this.groupingData[i].arr[j][k]);
              }
            }
            for (const l in this.arr1) {
              this.groupingData[i].subtotal += Number(this.arr1[l].assessScore);
            }
          }
        }
        this.totalScore = 0;
        for (const q in this.groupingData) {
          this.totalScore += this.groupingData[q].subtotal;
        }
        this.$forceUpdate(); //强制页面进行刷新
      }
    },
    // 取消
    cancel() {
      for (const i in this.groupingData) {
        for (const j in this.groupingData[i].arr) {
          for (const k in this.groupingData[i].arr[j]) {
            this.groupingData[i].arr[j][k].falg = false;
            this.groupingData[i].arr[j][k].assessScore = 0;
          }
        }
        this.groupingData[i].subtotal = 0;
        this.totalScore = 0;
      }
      this.arr1 = [];
      this.$forceUpdate(); //强制页面进行刷新
    },
    // 提交
    submit() {
      this.$confirm("是否确认提交", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.length = 0;
          for (const a in this.submitData) {
            this.length += Number(this.submitData[a].length);
          }
          if (this.length == 0) {
            this.$message({
              message: "请至少选择一项条件",
              type: "warning"
            });
          } else {
            let _this = this;
            let assessRecord = {
              assessResult: this.totalScore,
              projectId: this.submitItem.projectId,
              patientId: this.patName
            };
            let assessProjectRecords = [];
            for (const i in this.groupingData) {
              for (const j in this.submitData[i]) {
                let g = {
                  assessConditionId: this.submitData[i][j].assessConditionId,
                  assessProjectId: this.groupingData[i].assessProjectId,
                  patientId: this.patName
                };
                assessProjectRecords.push(g);
              }
            }

            let params = {
              assessProjectRecords: assessProjectRecords,
              assessRecord: assessRecord
            };
            addAss(params).then(response => {
              this.$message({
                type: "success",
                showClose: true,
                message: "提交成功"
              });
              this.getRequest();
            });
          }
          this.$forceUpdate(); //强制页面进行刷新
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消提交"
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
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
.perinfo span {
  margin: 0 3px;
}
.patient_name {
  margin-top: 5px;
  margin-left: 1%;
}
.active {
  background: #409eff !important;
  color: #fff !important;
  text-align: center;
}
.patientBtn {
  text-align: center;
  overflow: hidden;
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
#basic-table {
  width: 96%;
  margin: 2%;
  border: 1px solid #ddd;
}
#basic-table td,
#basic-table th {
  width: 16.666%;
  line-height: 45px;
  border: 1px solid #ddd;
  text-align: center;
  vertical-align: middle;
}
.green {
  color: rgba(245, 41, 41, 0.83);
}
.subtotal1,
.subtotal2 {
  display: inline-block;
  width: 30%;
  text-align: center;
}
.subtotal1 {
  margin-right: 20%;
}
.subtotal2 {
  margin-left: 20%;
}
.ActBtn {
  background: #409eff !important;
  color: #fff !important;
  text-align: center;
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