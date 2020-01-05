
<template>
   <div class="patientManagement">
      <basic-container>
         <div>
            <el-input
               placeholder="住院号搜索"
               v-model="searchForm.hospitalnumber"
               style="width:14.5%;margin:1%"
               class="smallScreen"
               size="small"
               @input="search"
               clearable
            />
            <el-input
               placeholder="患者姓名"
               v-model="searchForm.name"
               style="width:14.5%;margin:1%;"
               class="smallScreen"
               size="small"
               @input="search"
               clearable
            />
            <el-input
               placeholder="目标科室"
               v-model="searchForm.dischargeWhereAbout"
               style="width:14.5%;margin:1%"
               class="smallScreen"
               size="small"
               @input="search"
               clearable
            />
            <el-input
               placeholder="诊断"
               v-model="searchForm.diagnosis"
               style="width:14.5%;margin:1%"
               class="smallScreen"
               size="small"
               @input="search"
               clearable
            />
            <el-radio-group
               v-model="searchForm.dischargeType"
               size="small"
               style="width:31%;margin:1%"
               class="smallScreen"
               @change="search"
               clearable
            >
               <el-radio
                  v-for="item in icu_departure"
                  :key="item.value"
                  :label="item.value"
                  border
               >{{item.label}}</el-radio>
            </el-radio-group>
            <el-date-picker
               v-model="entryValue"
               type="datetimerange"
               range-separator="至"
               start-placeholder="入科日期"
               end-placeholder="入科日期"
               align="right"
               format="yyyy-MM-dd"
               style="width:31%;margin:1%"
               class="smallScreen"
               size="small"
               @change="changeEntryValue"
            ></el-date-picker>
            <el-date-picker
               v-model="outValue"
               type="datetimerange"
               range-separator="至"
               start-placeholder="出科日期"
               end-placeholder="出科日期"
               align="right"
               format="yyyy-MM-dd"
               style="width:31%;margin:1%"
               class="smallScreen"
               size="small"
               @change="changeOutValue"
            ></el-date-picker>
            <el-button
               type="primary"
               icon="el-icon-delete"
               size="small"
               style="margin:1%"
               @click="search"
            >搜索</el-button>
            <el-button icon="el-icon-delete" size="small" style="margin:1%" @click="clearform">清空</el-button>
            <el-button
               type="primary"
               icon="el-icon-plus"
               style="margin:1%"
               size="small"
               @click="printContent"
            >打印</el-button>
         </div>
         <div id="print">
            <div class="panel-heading">
               <h3 class="panel-title">出院病人登记簿</h3>
               <div class="panel-content">
                  <p>科室：ICU</p>
                  <p>日期：{{startTime}} 至 {{endTime}}</p>
               </div>
            </div>
            <div>
               <div v-loading="tableLoading">
                  <table class="table table-bordered">
                     <thead>
                        <tr>
                           <!-- <th style="width:80px;">序号</th> -->
                           <th style="width:40px;">床号</th>
                           <th style="width:100px;">住院号</th>
                           <th style="width:42px;">患者姓名</th>
                           <th style="width:22px;">性别</th>
                           <th style="width:24px;">年龄</th>
                           <th style="width:80px;">联系电话</th>
                           <th style="width:95px;">入院日期</th>
                           <th style="width:95px;">入科日期</th>
                           <th style="width:95px;">出科日期</th>
                           <th style="width:40px;">入科天数</th>
                           <th style="width:40px;">出科类型</th>
                           <th style="width:40px;">目标科室</th>
                           <th style="width:100px;">诊断</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="(item) in tableData" :key="item.id">
                           <!-- <td
                              style="text-align: center;"
                           >{{index+(page.currentPage - 1) * page.pageSize + 1}}</td>-->
                           <td style="text-align: center;">{{item.bedName}}&nbsp;</td>
                           <td>{{item.hospitalnumber}}</td>
                           <td>{{item.name}}</td>
                           <td style="text-align: center;">{{item.gender | sex}}</td>
                           <td style="text-align: center;">{{item.age}}</td>
                           <td>{{item.phone}}</td>
                           <td>{{item.timeOfAdmission}}</td>
                           <td>{{item.entranceTime}}</td>
                           <td>{{item.dischargeTime}}</td>
                           <td>{{item.sectionTime}}</td>
                           <td>{{item.dischargeType | departure}}</td>
                           <td>{{item.dischargeWhereAbout}}</td>
                           <td style="font-size:8px;">{{item.diagnosis}}</td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
         <template>
            <div style="width:100%;position:relative;height:50px">
               <el-pagination
                  :page-sizes="[10, 20,30,40, 50, 100]"
                  :pager-count="7"
                  :current-page="page.currentPage"
                  :page-size="page.pageSize"
                  :total="page.total"
                  layout="total, sizes, prev, pager, next, jumper"
                  style="margin:1% 0px;position:absolute;right:1%"
                  background
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
               ></el-pagination>
            </div>
         </template>
      </basic-container>
   </div>
</template>

<script>
import { fetchList, dicData } from "@/api/icu/patientManagement/listOfSubjects";
import { mapGetters, mapState } from "vuex";
import { dateFormat } from "@/util/date";
let that;
export default {
   name: "patientManagement",
   watch: {
      entryValue: {
         handler(newValue, oldValue) {
            if (newValue == null) {
               this.entryValue = [];
               this.search();
            }
         }
      },
      outValue: {
         handler(newValue, oldValue) {
            if (newValue == null) {
               this.outValue = [];
               this.search();
            }
         }
      }
   },
   data() {
      return {
         searchForm: {},
         tableData: [],
         page: {
            total: 0, // 总页数
            currentPage: 1, // 当前页数
            pageSize: 10 // 每页显示多少条
         },
         tableLoading: false,
         icu_departure: [],
         // hideNoData: false,
         entryValue: [],
         outValue: [],
         startTime: "",
         endTime: "",
         isFullscreen: false
      };
   },
   created() {
      this.getDicData();
      // window.addEventListener("resize", this.init);
   },
   destroyed() {
      // window.removeEventListener("resize", this.init);
   },
   mounted() {
      // this.init();
      this.timeProcessing();
   },
   methods: {
      getDicData() {
         dicData("icu_departure").then(res => {
            this.icu_departure = res.data.data;
         });
      },
      getList(page, parmars) {
         this.tableLoading = true;
         fetchList(
            Object.assign(
               {
                  current: page.currentPage,
                  size: page.pageSize
               },
               parmars
            )
         )
            .then(response => {
               this.tableData = response.data.data.records;
               if (this.tableData.length < this.page.pageSize) {
                  let j = this.page.pageSize - this.tableData.length;
                  for (let i = 0; i < j; i++) {
                     this.tableData.push({});
                  }
               }
               // console.log(this.tableData)
               this.page.total = response.data.data.total;
               this.tableLoading = false;
            })
            .catch(() => {
               this.tableLoading = false;
               // this.hideNoData = true;
            });
      },
      // 屏幕检测
      init() {
         if (document.body.clientWidth > 1024) {
            this.isFullscreen = true;
         } else {
            this.isFullscreen = false;
         }
         window.onresize = () => {
            if (document.body.clientWidth > 1024) {
               this.isFullscreen = true;
            } else {
               this.isFullscreen = false;
            }
         };
      },
      // 时间处理
      timeProcessing() {
         this.searchForm.dischargeStartTime = this.startTime =
            dateFormat(new Date(new Date() - 7 * 24 * 3600 * 1000)).substr(
               0,
               10
            ) + " 00:00:00";
         this.searchForm.dischargeEndTime = this.endTime =
            dateFormat(new Date()).substr(0, 10) + " 00:00:00";
         this.outValue = [this.startTime, this.endTime];
         this.getList(this.page, this.searchForm);
      },
      // 入科查询
      changeEntryValue(val) {
         if (val) {
            this.page.currentPage = 1;
            this.page.pageSize = 10;
            this.search();
         }
      },
      // 出科查询
      changeOutValue(val) {
         if (val) {
            this.startTime = String(dateFormat(val[0]));
            this.endTime = String(dateFormat(val[1]));
            this.$forceUpdate();
            this.page.currentPage = 1;
            this.page.pageSize = 10;
            this.search();
         }
      },
      search() {
         for (var i in this.searchForm) {
            this.searchForm[i] = this.searchForm[i].replace(/\s*/g, "");
         }
         this.searchForm.dischargeStartTime =
            this.startTime.substr(0, 10) + " 00:00:00";
         this.searchForm.dischargeEndTime =
            this.endTime.substr(0, 10) + " 00:00:00";
         //  入科
         if (this.entryValue.length > 1) {
            this.searchForm.entryStartTime = String(
               dateFormat(this.entryValue[0]).substr(0, 10) + " 00:00:00"
            );
            this.searchForm.entryEndTime = String(
               dateFormat(this.entryValue[1]).substr(0, 10) + " 00:00:00"
            );
         } else {
            this.searchForm.entryEndTime = "";
            this.searchForm.entryStartTime = "";
         }
         // 出科
         if (this.outValue.length > 1) {
         } else {
            this.searchForm.dischargeStartTime = "";
            this.searchForm.dischargeEndTime = "";
         }
         // console.log(this.searchForm);
         this.getList(this.page, this.searchForm);
      },
      clearform() {
         this.searchForm = {};
         this.entryValue = [];
         this.outValue = [];
         this.timeProcessing();
      },
      //  分页事件
      handleSizeChange(val) {
         this.page.pageSize = val;
         this.search();
      },
      handleCurrentChange(val) {
         this.page.currentPage = val;
         this.search();
      },
      //打印页面内容
      printContent() {
         var newstr = document.getElementById("print").innerHTML;
         document.body.innerHTML = newstr;
         window.print();
         window.location.reload();
      }
   },
   beforeCreate: function() {
      that = this;
   },
   filters: {
      sex: data => {
         switch (data) {
            case "0":
               return "女";

            case "1":
               return "男";

            default:
         }
      },
      departure: data => {
         for (var i in that.icu_departure) {
            if (that.icu_departure[i].value == data) {
               return that.icu_departure[i].label;
            }
         }
      }
   }
};
</script>

<style lang="scss" scoped>
.table-bordered th,
.table-bordered td,
.table-bordered tr {
   border: 1px solid #000;
   text-align: center;
   padding: 5px;
   font-size: 8px;
}
// .table-bordered th {
//    text-align: center;
// }
.panel-heading {
   padding: 20px 20px;
   border-bottom: 1px solid transparent;
   border-top-left-radius: 3px;
   border-top-right-radius: 3px;
   border-color: #ddd;
}
.panel-title {
   text-align: center;
   font-size: 16px;
   font-weight: 600;
}
.panel-content {
   display: flex;
   justify-content: space-between;
}
@media screen and (max-width: 1024px) {
   .smallScreen {
      width: 48% !important;
   }
}

.el-table .cell.el-tooltip {
   white-space: pre-wrap;
}
.el-radio {
   margin: 0px;
}
.el-radio.is-bordered + .el-radio.is-bordered {
   margin-left: 6%;
}
// .radioflex {
//    // display: flex;
// }
// .radiojust {
//    // display: flex;
//    // justify-content: space-between;
// }
</style>
