
<template>
  <!-- 职业暴露 -->
  <div>
    <div class="execution" v-if="flag == false">
      <table class="occupation">
        <thead>
          <th colspan="6">一、基本情况</th>
        </thead>
        <tbody>
          <tr>
            <td colspan="2">
              <div class="demo-input-suffix">
                &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;姓名：
                <el-input
                  disabled
                  placeholder="请输入姓名"
                  style="width:70%"
                  v-model="nursingOccupationalExposure.nurseName"
                ></el-input>
              </div>
            </td>
            <td colspan="2">
              性别：
              <el-radio-group :disabled="ident == 2" v-model="nursingOccupationalExposure.nurseSex">
                <el-radio label="1" value="1">男</el-radio>
                <el-radio label="0" value="0">女</el-radio>
              </el-radio-group>
            </td>

            <td colspan="2">
              <div class="demo-input-suffix">
                &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;年龄：
                <el-input
                  :disabled="ident == 2"
                  v-model="nursingOccupationalExposure.nurseAge"
                  placeholder="请输入年龄"
                  style="width:70%"
                ></el-input>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <div class="demo-input-suffix">
                &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;职业：
                <el-input
                  :disabled="ident == 2"
                  v-model="nursingOccupationalExposure.nurseProfession"
                  placeholder="请输入职业"
                  style="width:70%"
                ></el-input>
              </div>
            </td>
            <td colspan="2">
              <div class="demo-input-suffix">
                科室：
                <el-input
                  disabled
                  v-model="nursingOccupationalExposure.nurseDept"
                  placeholder="请输入科室"
                  style="width:70%"
                ></el-input>
              </div>
            </td>

            <td colspan="2">
              <div class="block">
                发生时间：
                <el-date-picker
                  :disabled="ident == 2"
                  v-model="nursingOccupationalExposure.occurrenceTime"
                  placeholder="选择日期时间"
                  style="width:70%"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="6">
              <div class="demo-input-suffix">
                发生地点：
                <el-input
                  :disabled="ident == 2"
                  v-model="nursingOccupationalExposure.occurrenceSite"
                  placeholder="请输入发生地点"
                  style="width:70%"
                ></el-input>
              </div>
            </td>
          </tr>
          <tr>
            <th colspan="6">二、暴露方式</th>
          </tr>
          <tr class="tdrow">
            <td colspan="6">(一)接触暴露</td>
          </tr>
          <tr>
            <td colspan="2">
              1、皮肤：
              <el-radio-group
                :disabled="ident == 2"
                v-model="nursingOccupationalExposure.exposureSkin"
              >
                <el-radio label="1" value="1">无破损</el-radio>
                <el-radio label="2" value="2">有破损</el-radio>
              </el-radio-group>
            </td>
            <td colspan="2">
              2、粘膜：
              <el-checkbox
                :disabled="ident == 2"
                v-model="nursingOccupationalExposure.exposureMucosa"
              ></el-checkbox>
            </td>
            <td colspan="2">
              <div class="demo-input-suffix">
                3、接触部位：
                <el-input
                  :disabled="ident == 2"
                  v-model="nursingOccupationalExposure.exposurePart"
                  placeholder
                  style="width:50%"
                ></el-input>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <div class="demo-input-suffix">
                4、接触面积：
                <el-input
                  :disabled="ident == 2"
                  v-model="nursingOccupationalExposure.exposureArea"
                  placeholder
                  style="width:50%"
                ></el-input>
              </div>
            </td>
            <td colspan="4">
              5、污染物来源
              <template>
                <el-radio-group
                  :disabled="ident == 2"
                  v-model="nursingOccupationalExposure.contaminantSource"
                >
                  <el-radio label="1">血液</el-radio>
                  <el-radio label="2">何种体液</el-radio>
                  <el-radio label="3">其他</el-radio>
                </el-radio-group>
              </template>
            </td>
          </tr>
          <tr class="tdrow">
            <td colspan="6">(二)针刺或锐器刺伤</td>
          </tr>
          <tr>
            <td colspan="6">
              1、何种器械：
              <template>
                <el-radio-group
                  :disabled="ident == 2"
                  v-model="nursingOccupationalExposure.applianceKind"
                >
                  <el-radio label="1">空心针</el-radio>
                  <el-radio label="2">实心针</el-radio>
                  <el-radio label="3">其他器械</el-radio>
                </el-radio-group>
              </template>
            </td>
          </tr>
          <tr>
            <td colspan="6">
              2、损伤程度、危险度：
              <template>
                <el-radio-group
                  :disabled="ident == 2"
                  v-model="nursingOccupationalExposure.injuryDegreeAndRisk"
                >
                  <el-radio label="1">表皮擦伤、针刺 低危</el-radio>
                  <el-radio label="2">伤口较深、器皿上看见血液、高危</el-radio>
                </el-radio-group>
              </template>
            </td>
          </tr>
          <tr>
            <td colspan="6">
              3、污染物来源：
              <template>
                <el-radio-group
                  :disabled="ident == 2"
                  v-model="nursingOccupationalExposure.applianceContaminantSource"
                >
                  <el-radio label="1">血液</el-radio>
                  <el-radio label="2">含血体液</el-radio>
                  <el-radio label="3">其他</el-radio>
                </el-radio-group>
              </template>
            </td>
          </tr>
          <tr class="tdrow">
            <td colspan="6">(三)其他方式</td>
          </tr>
          <tr>
            <td colspan="3">
              致伤方式：
              <template>
                <el-radio-group
                  :disabled="ident == 2"
                  v-model="nursingOccupationalExposure.injuryWay"
                >
                  <el-radio value="1" label="1">抓伤</el-radio>
                  <el-radio value="2" label="2">咬伤</el-radio>
                  <el-radio value="3" label="3">其他</el-radio>
                </el-radio-group>
              </template>
            </td>
            <td colspan="3">
              破损、出血：
              <template>
                <template>
                  <el-radio-group
                    :disabled="ident == 2"
                    v-model="nursingOccupationalExposure.breakageAndBleeding"
                  >
                    <el-radio label="1">有</el-radio>
                    <el-radio label="2">无</el-radio>
                  </el-radio-group>
                </template>
              </template>
            </td>
          </tr>
          <tr>
            <th colspan="6">三、暴露源严重程度</th>
          </tr>
          <tr class="tdrow">
            <td colspan="6">(一) 实验室标本</td>
          </tr>
          <tr>
            <td colspan="6">
              <el-checkbox
                :disabled="ident == 2"
                v-model="nursingOccupationalExposure.labBlood"
              >1、血液</el-checkbox>
              <el-checkbox
                :disabled="ident == 2"
                v-model="nursingOccupationalExposure.labBodyFluidKind"
              >2、何种体液</el-checkbox>
              <el-checkbox
                :disabled="ident == 2"
                v-model="nursingOccupationalExposure.labOther"
              >3、其他</el-checkbox>
              <el-checkbox
                :disabled="ident == 2"
                v-model="nursingOccupationalExposure.labOtherCondition"
              >4、其他情况</el-checkbox>5、病毒含量：
              <el-radio-group
                :disabled="ident == 2"
                v-model="nursingOccupationalExposure.labVirusContent"
              >
                <el-radio value="1" label="1">低度低</el-radio>
                <el-radio value="2" label="2">低度高</el-radio>
              </el-radio-group>
            </td>
          </tr>
          <tr class="tdrow">
            <td colspan="6">(二) 来源于患者</td>
          </tr>
          <tr>
            <td colspan="2">
              <div class="demo-input-suffix">
                患者姓名：
                <el-input
                  :disabled="ident == 2"
                  v-model="nursingOccupationalExposure.patientName"
                  placeholder="请输入患者姓名"
                  style="width:70%"
                ></el-input>
              </div>
            </td>
            <td colspan="2">
              性别：
              <el-radio-group
                :disabled="ident == 2"
                v-model="nursingOccupationalExposure.patientSex"
              >
                <el-radio label="1">男</el-radio>
                <el-radio label="2">女</el-radio>
              </el-radio-group>
            </td>
            <td colspan="2">
              <div class="demo-input-suffix">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;年龄：
                <el-input
                  :disabled="ident == 2"
                  v-model="nursingOccupationalExposure.patientAge"
                  placeholder="请输入年龄"
                  style="width:70%"
                ></el-input>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="4">
              患者病情：
              <template>
                <el-radio-group
                  :disabled="ident == 2"
                  v-model="nursingOccupationalExposure.patientIllness"
                >
                  <el-radio label="1">无症状HTV感染者</el-radio>
                  <el-radio label="2">有症状，但不同于艾滋病</el-radio>
                  <el-radio label="3">艾滋病症</el-radio>
                </el-radio-group>
              </template>
            </td>
            <td colspan="2">
              <template>
                <div class="block">
                  确诊时间：
                  <el-date-picker
                    :disabled="ident == 2"
                    v-model="nursingOccupationalExposure.patientConfirmedTime"
                    placeholder="选择日期时间"
                    style="width:70%"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  ></el-date-picker>
                </div>
              </template>
            </td>
          </tr>
          <tr>
            <td colspan="3">
              <div class="demo-input-suffix">
                病毒载量：
                <el-input
                  :disabled="ident == 2"
                  v-model="nursingOccupationalExposure.viralLoad"
                  placeholder
                  style="width:70%"
                ></el-input>
              </div>
            </td>
            <td colspan="3">
              <div class="demo-input-suffix">
                CD4细胞计数：
                <el-input
                  :disabled="ident == 2"
                  v-model="nursingOccupationalExposure.cellCounting"
                  placeholder
                  style="width:70%"
                ></el-input>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="3">
              <div class="demo-input-suffix">
                &nbsp;&nbsp;&nbsp;填表人：
                <el-input
                  :disabled="ident == 2"
                  placeholder="请输入姓名"
                  style="width:70%"
                  v-model="nursingOccupationalExposure.preparerName"
                ></el-input>
              </div>
            </td>
            <td colspan="3">
              <div class="demo-input-suffix">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;联系电话：
                <el-input
                  :disabled="ident == 2"
                  placeholder="请输入联系电话"
                  style="width:70%"
                  v-model="nursingOccupationalExposure.preparerPhone"
                ></el-input>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="3">
              <template>
                <div class="block">
                  填表时间：
                  <el-date-picker
                    :disabled="ident == 2"
                    v-model="nursingOccupationalExposure.preparerTime"
                    type="datetime"
                    placeholder="选择日期时间"
                    style="width:70%"
                    format="yyyy-MM-dd HH:mm"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  ></el-date-picker>
                </div>
              </template>
            </td>
            <td colspan="3">
              <template>
                <div class="block">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;审核时间：
                  <el-date-picker
                    :disabled="ident == 2"
                    v-model="nursingOccupationalExposure.reviewTime"
                    type="datetime"
                    placeholder="选择日期时间"
                    style="width:70%"
                    format="yyyy-MM-dd HH:mm"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  ></el-date-picker>
                </div>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="sub_btn">
        <el-button @click="getBack">返 回</el-button>
        <el-button type="primary" :disabled="ident == 2" @click="open">提 交</el-button>
      </div>
    </div>
    <avue-crud
      v-else
      ref="crud"
      :page="page"
      :data="tableData"
      :permission="permissionList"
      :table-loading="tableLoading"
      :option="tableOption"
      @on-load="getList"
      @search-change="searchChange"
      @refresh-change="refreshChange"
      @search-reset="clearform"
      @size-change="sizeChange"
      @current-change="currentChange"
    >
      <template slot="searchMenu">
        <el-button type="primary" icon="el-icon-plus" @click="increased(1)" size="small">新增</el-button>
      </template>
      <template slot="search">
        <el-col :md="4" :xs="24">
          <el-form-item>
            <el-select style="width:100%" placeholder="请选择护士" v-model="nurseName" size="small">
              <el-option
                v-for="item in nurseList"
                :key="item.id"
                :value="item.nurseId"
                :label="item.realName"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </template>
      <template slot="menu" slot-scope="scope">
        <el-button
          type="text"
          size="mini"
          icon="el-icon-view"
          @click="ViewBtn(2,scope.row,scope.index)"
        >查看</el-button>
        <el-button
          type="text"
          size="mini"
          icon="el-icon-edit"
          @click="EditBtn(3,scope.row,scope.index)"
        >编辑</el-button>
        <el-button
          type="text"
          size="mini"
          icon="el-icon-delete"
          @click="rowDel(scope.row,scope.index)"
        >删除</el-button>
      </template>
    </avue-crud>
  </div>
</template>

<script>
import {
  addObj,
  delObj,
  fetchList,
  putObj,
  UpdateObj
} from "@/api/icu/nurse/exposed";
import { getNursList } from "@/api/icu/matron/constraintsRecord/constraintsRecord";
import { tableOption } from "@/const/crud/icu/nurse/exposed";
import { getNurseInfo } from "@/api/admin/user";
import { mapGetters } from "vuex";

export default {
  name: "exposed",
  data() {
    return {
      ident: 1,
      searchForm: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption,
      flag: true,
      nursingOccupationalExposure: {
        nurseName: "",
        nurseSex: "",
        nurseAge: "",
        nurseProfession: "",
        nurseDept: "",
        occurrenceSite: "",
        occurrenceTime: "",
        exposureSkin: "",
        exposureMucosa: "",
        exposurePart: "",
        exposureArea: "",
        contaminantSource: "",
        applianceKind: "",
        breakageAndBleeding: "",
        preparerName: "",
        injuryWay: "",

        labBlood: "",
        labBodyFluidKind: "",
        labOther: "",
        labVirusContent: "",
        labOtherCondition: "",
        patientName: "",
        patientAge: "",
        patientSex: "",
        patientConfirmedTime: "",
        patientIllness: "",
        viralLoad: "",
        cellCounting: ""
      },
      nurseList: [],
      nurseName: "",
      nurseInfo: {}
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permissions.icu_task_add, false),
        delBtn: this.vaildData(this.permissions.icu_task_del, false),
        editBtn: this.vaildData(this.permissions.icu_task_edit, false)
      };
    }
  },
  created() {
    this.getNurse();
    this.getInfo();
  },
  methods: {
    
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.getList();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.getList();
    },
    async getInfo() {
      try {
        let nurseInfo = await getNurseInfo();
        if (nurseInfo.data.data) {
          this.nurseInfo = nurseInfo.data.data;
        }
      } catch (err) {}
    },
    //
    async getNurse() {
      try {
        let nurseList = await getNursList();
        if (nurseList.data.data) {
          this.nurseList = nurseList.data.data;
        }
      } catch (err) {}
    },

    //点击提交判断  新增还是修改   使用不同的接口
    open() {
      switch ("") {
        case this.nursingOccupationalExposure.occurrenceTime:
          this.$message({
            message: "请选择发生时间",
            type: "warning"
          });
          break;
        case this.nursingOccupationalExposure.occurrenceSite:
          this.$message({
            message: "请输入发生地点",
            type: "warning"
          });
          break;
        default:
          this.$confirm("是否确认提交,?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              // console.log(this.ident);
              if (this.ident == 1) {
                this.submit_form();
              } else if (this.ident == 3) {
                this.updateList();
              }
              this.flag = true;
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消提交"
              });
            });
          break;
      }
    },
    submit_form() {
      // console.log(this.nursingOccupationalExposure);
      addObj(this.nursingOccupationalExposure).then(res => {
        this.$message({
          type: "success",
          message: "添加成功!"
        });
      });
    },
    //新增
    increased(number) {
      if (this.nurseName) {
        this.nursingOccupationalExposure = {
          nurseName: "",
          nurseSex: "",
          nurseAge: "",
          nurseProfession: "",
          nurseDept: "",
          occurrenceSite: "",
          occurrenceTime: "",
          exposureSkin: "",
          exposureMucosa: "",
          exposurePart: "",
          exposureArea: "",
          contaminantSource: "",
          applianceKind: "",
          breakageAndBleeding: "",
          preparerName: "",
          injuryWay: "",

          labBlood: "",
          labBodyFluidKind: "",
          labOther: "",
          labVirusContent: "",
          labOtherCondition: "",
          patientName: "",
          patientAge: "",
          patientSex: "",
          patientConfirmedTime: "",
          patientIllness: "",
          viralLoad: "",
          cellCounting: "",
          nurseId: ""
        };
        this.nursingOccupationalExposure.nurseDept = this.nurseInfo.deptName;
        this.nursingOccupationalExposure.nurseId = this.nurseName;
        for (var i in this.nurseList) {
          if (this.nurseList[i].nurseId == this.nurseName) {
            this.nursingOccupationalExposure.nurseName = this.nurseList[
              i
            ].realName;
          }
        }

        this.ident = number;
        this.flag = false;
      } else {
        this.$message({
          type: "warning",
          message: "请先选择护士"
        });
      }
    },
    //查看
    ViewBtn(number, row, index) {
      this.ident = number;
      putObj(row.id).then(res => {
        this.nursingOccupationalExposure = res.data.data;
      });
      this.flag = false;
    },
    //编辑
    EditBtn(number, row, index) {
      this.ident = number;
      putObj(row.id).then(res => {
        this.nursingOccupationalExposure = res.data.data;
      });
      this.flag = false;
    },
    //返回
    getBack() {
      this.flag = true;
    },
    //修改接口
    updateList() {
      UpdateObj(this.nursingOccupationalExposure).then(res => {
        this.$message({
          type: "success",
          message: "修改成功!"
        });
      });
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
          this.page.total = response.data.data.total;
          this.tableLoading = false;
        })
        .catch(() => {
          this.tableLoading = false;
        });
    },
    rowDel: function(row, index) {
      index += 1;
      var _this = this;
      this.$confirm("是否确认删除为序号" + index, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return delObj(row.id);
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
    /**
     * @title 数据添加
     * @param row 为当前的数据
     * @param done 为表单关闭函数
     *
     **/
    /**
     * 搜索回调
     */
    searchChange(form) {
      this.page = {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      }
      form.nurseId = this.nurseName
      this.searchForm = form;
      this.getList(this.page, form);
    },
    //清空
    clearform() {
      this.nurseName = "";
      this.page = {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      };
      this.searchForm = {};
      this.getList(this.page);
    },
    /**
     * 刷新回调
     */
    refreshChange() {
      this.getList(this.page);
    }
  }
};
</script>

<style lang="scss" scope>
.el-card__body {
  // padding: 0!important;
}
.execution {
  overflow-x: auto !important;
  // min-width: 834px;
  .occupation {
    width: 100%;

    th,
    td {
      border: 1px solid #ebeef5;
      line-height: 45px;
    }
    th {
      text-align: center;
      vertical-align: middle;
    }
    td {
      padding-left: 2%;
    }
    .tdrow {
      text-align: center;
      vertical-align: middle;
    }
    input {
      border: none;
      border-radius: 0;
      border-bottom: 1px solid #dcdfe6;
    }
  }
  .sub_btn {
    margin-bottom: 30px;
    margin-top: 30px;
    display: flex;
    justify-content: center;
  }
}
</style>
