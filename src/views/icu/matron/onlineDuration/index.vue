<template>
   <!-- 患者首页 -->
   <div>
      <basic-container>
         <div class="onlineNurse">
            <div class="clearfix">
               <div class="echarts">
                  <div id="my-echarts"></div>
               </div>
               <div class="crud">
                  <el-button
                     icon="el-icon-document-checked"
                     size="small"
                     :type="tigger == 1?'primary':''"
                     @click="viewClick(1)"
                  >本 日</el-button>
                  <el-button
                     icon="el-icon-tickets"
                     size="small"
                     :type="tigger == 2?'primary':''"
                     @click="viewClick(2)"
                  >本 周</el-button>
                  <el-button
                     icon="el-icon-document-copy"
                     size="small"
                     :type="tigger == 3?'primary':''"
                     @click="viewClick(3)"
                  >本 月</el-button>
                  <avue-crud
                     ref="crud"
                     :data="tableData"
                     :table-loading="tableLoading"
                     :option="tableOption"
                     @row-click="handleRowClick"
                  >
                     <template slot="bedCode" slot-scope="scope">
                        <div>
                           <span
                              :style="'background:' + scope.row.color+';display: inline-block;width: 10px;height:10px;border-radius: 10px;'"
                           ></span>
                           <span>&nbsp;&nbsp;{{scope.row.bedCode}}&nbsp;&nbsp;</span>
                        </div>
                     </template>
                     <template slot="count" slot-scope="scope">
                        <div>{{scope.row.count}}</div>
                     </template>
                  </avue-crud>
               </div>
            </div>
            <el-dropdown class="avue-tags__menu" style="z-index:9999">
               <el-button type="primary" size="mini" v-model="nurseInfo.nurseId">
                  {{nurseInfo.realName}}
                  <i class="el-icon-arrow-down el-icon--right" />
               </el-button>
               <el-dropdown-menu>
                  <div class="dropdownMenu">
                     <el-button
                        :title="item.realName"
                        v-for="(item,index) in nurseList"
                        :key="index"
                        :type="item.nurseId == nurseInfo.nurseId ?'primary':''"
                        @click="choseNurse(item)"
                     >{{item.realName}}</el-button>
                  </div>
               </el-dropdown-menu>
            </el-dropdown>
         </div>
      </basic-container>
   </div>
</template>

<script>
import {
   putNurse,
   nurseWorkTime
} from "@/api/icu/matron/Management/Management";
import { mapGetters } from "vuex";

export default {
   name: "onlineDuration",
   data() {
      return {
         nurseList: [],
         nurseInfo: {},
         colorList: [],
         tigger: 1,
         page: {
            total: 0, // 总页数
            current: 1, // 当前页数
            pageSize: 10 // 每页显示多少条
         },
         tableLoading: false,
         tableData: [],
         tableOption: {
            border: true,
            index: false,
            indexLabel: "序号",
            stripe: false,
            addBtn: false,
            menuAlign: "center",
            align: "center",
            menu: false,
            labelWidth: 100,
            menuWidth: 0,
            highlightCurrentRow: true,
            column: [
               {
                  label: "床位",
                  prop: "bedCode",
                  slot: true
               },
               {
                  label: "时长",
                  prop: "count",
                  slot: true
               },
               {
                  label: "比例",
                  prop: "proportion"
               }
            ]
         },
         legendData: [],
         seriesData: [],
         selectedData: [],
         count: 0,
         indexs: -1
      };
   },
   watch: {
      indexs(newval, oldval) {
         var myChart = this.$echarts.init(
            document.getElementById("my-echarts")
         );
         myChart.dispatchAction({
            type: "highlight",
            seriesIndex: 0,
            dataIndex: newval
         });
         myChart.dispatchAction({
            type: "showTip",
            seriesIndex: 0,
            dataIndex: newval
         });
         myChart.dispatchAction({
            type: "downplay",
            seriesIndex: 0,
            dataIndex: oldval
         });
      },
      theme(val) {
         this.getNurse();
      }
   },
   computed: {
      ...mapGetters(["permissions", "theme"])
   },
   created() {
      this.getNurse();
   },
   methods: {
      getList(id) {
         nurseWorkTime(
            Object.assign({ timeFlag: this.tigger, nurseId: id })
         ).then(res => {
            this.tableData = res.data.data;
            this.getEcharts();
         });
      },
      //请求护士
      getNurse() {
         putNurse()
            .then(res => {
               this.nurseList = res.data.data;
               this.nurseInfo = this.nurseList[0];
               this.getList(this.nurseInfo.nurseId);
            })
            .catch(() => {});
      },
      // 选择护士
      choseNurse(item) {
         this.nurseInfo = item;
         this.getList(this.nurseInfo.nurseId);
      },
      viewClick(num) {
         this.tigger = num;
         this.getList(this.nurseInfo.nurseId);
      },
      // echars图
      getEcharts() {
         this.colorData();
         var myChart = this.$echarts.init(
            document.getElementById("my-echarts")
         );
         window.onresize = function() {
            myChart.resize();
         };
         var that = this;
         myChart.setOption({
            tooltip: {
               trigger: "item",
               formatter: "{a} <br/> {c}分钟 ({d}%)"
            },
            legend: {
               x: "left",
               data: that.legendData
            },
            textStyle: {
               fontSize: 18
            },
            graphic: {
               type: "text",
               left: "center",
               top: "center",
               style: {
                  text:
                     that.legendData.length == 0
                        ? "暂无数据"
                        : `总时长\n\n${that.formatMinutes(that.count)}`,
                  textAlign: "center",
                  fill: that.theme,
                  width: 50,
                  height: 50,
                  fontSize: 18
               }
            },
            series: [
               {
                  name: "护士在线时长",
                  type: "pie",
                  radius: ["40%", "60%"],
                  center: ["50%", "50%"],
                  data: that.seriesData,
                  itemStyle: {
                     emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: "rgba(0, 0, 0, 0.5)"
                     },
                     normal: {
                        color: function(params) {
                           return that.colorList[params.dataIndex];
                        }
                     }
                  }
               }
            ]
         });
      },
      handleRowClick(row) {
         this.indexs = row.$index;
      },
      // 对数剧加颜色
      colorData() {
         this.colorList = [];
         this.count = 0;
         this.legendData = [];
         this.seriesData = [];
         this.indexs = -1;
         var j = "";
         for (let i = 0; i < this.tableData.length; i++) {
            j = this.random_load();
            this.colorList.push(j);
            // echars
            // 个位补0
            if (this.tableData[i].bedCode < 10) {
               this.tableData[i].bedCode = "0" + this.tableData[i].bedCode;
            }
            this.legendData.push(this.tableData[i].bedCode);
            this.seriesData.push({
               value: this.tableData[i].count,
               name: this.tableData[i].bedCode
            });

            this.count += parseInt(this.tableData[i].count);
            // 颜色
            Object.assign(this.tableData[i], {
               color: j,
               count:
                  this.tableData[i].count == 0
                     ? "0分钟"
                     : this.formatMinutes(this.tableData[i].count),
               proportion: this.toPercent(this.tableData[i].proportion)
            });
         }
         if (this.isRepeat(this.colorList)) {
            this.colorData();
         }
      },
      // 随机生成颜色
      random_load() {
         var R = this.hao(0, 255).toString(16);
         var G = this.hao(0, 255).toString(16);
         var B = this.hao(0, 255).toString(16);
         return "#" + this.aaa(R, G, B);
      },
      aaa(r, g, b) {
         r = r.length == 1 ? "0" + r : r;
         g = g.length == 1 ? "0" + g : g;
         b = b.length == 1 ? "0" + b : b; //随机会获取到5位的十六进制数，不能作为颜色值，所以用这个方法解决，还请前辈多多指点  ^-^！
         return r + g + b;
      },
      hao(min, max) {
         return parseInt(Math.random() * (max - min + 1) + min);
      },
      // 判断是否有重复元素
      isRepeat(arr) {
         if (!arr || arr.length < 1) {
            return false;
         }
         var hash = {};
         for (var i in arr) {
            if (hash[arr[i]]) {
               return true;
            }
            hash[arr[i]] = true;
         }
         return false;
      },
      // 分钟转小时天
      formatMinutes(minutes) {
         var day = parseInt(Math.floor(minutes / 1440));

         var hour =
            day > 0
               ? Math.floor((minutes - day * 1440) / 60)
               : Math.floor(minutes / 60);

         var minute =
            hour > 0 ? Math.floor(minutes - day * 1440 - hour * 60) : minutes;

         var time = "";

         if (day > 0) time += day + "天";

         if (hour > 0) time += hour + "小时";

         if (minute > 0) time += minute + "分钟";

         return time;
      },
      // 小数转百分比
      toPercent(point) {
         var str = Number(point * 100).toFixed(2);
         str += "%";
         return str;
      }
   }
};
</script>



<style  lang="scss">
.onlineNurse {
   .avue-tags__menu {
      line-height: 40px;
      padding-right: 10px;
      margin-right: 1%;
   }
   .el-tabs__nav-wrap.is-scrollable {
      padding: 0 30px;
   }
   .avue-tags__box {
      padding-right: 0;
   }
   .el-card__body {
      padding-top: 0px;
   }
   .el-tabs__header {
      width: 80%;
   }
   #my-echarts {
      min-height: 500px;
   }
   .echarts {
      width: 45%;
   }
   .crud {
      width: 55%;
   }
   .avue-crud {
      margin-top: 20px;
      width: 100%;
   }
   .clearfix {
      display: flex;
   }
   @media screen and (max-width: 1000px) {
      .echarts {
         width: 100%;
      }
      .crud {
         width: 100%;
      }
      .clearfix {
         display: block;
      }
   }
   .el-table--border,
   .el-table--group {
      border-right: 0px !important;
   }
   .el-table--border th:last-child {
      border-right: 0px !important;
   }
}
</style>