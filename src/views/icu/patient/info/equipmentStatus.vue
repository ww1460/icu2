<template>
   <!-- 设备状态 -->
   <div class="EquipmentStatus">
      <div class="EquipmentStatus_top">
         <span>设备状态:</span>
         <el-button
            v-for="(item,index) in options"
            :class="['el-button--small',(item.value == devBtn?'el-button el-button--primary':'')]"
            :key="index"
            @click="changeDevBtn(item.value)"
         >{{item.label}}</el-button>
      </div>
      <div class="devicewindow">
         <avue-crud
            :data="devBtn==0?data:data1"
            :option="devBtn==0?apparatus:apparatus1"
            :cell-style="cellStyle"
            :table-loading="tableLoading"
         >
            <template slot="menu" slot-scope="scope">
               <el-button
                  type="text"
                  size="small"
                  @click.native="search(scope.row,scope.index)"
               >{{ devBtn == 0 ? "ON" : "OFF" }}</el-button>
            </template>
         </avue-crud>
      </div>
   </div>
</template>

<script>
import {
   fetchUnonnectedList,
   fetchConnectedList,
   addObj,
   delObj
} from "@/api/icu/patient/equipmentStatus";
import { mapGetters } from "vuex";
import { dateFormat, calcDate } from "@/util/date";

export default {
   name: "equipmentStatus",
   props: {
      messages: Object
   },
   data() {
      return {
         page: {
            total: 0, // 总页数
            currentPage: 1, // 当前页数
            pageSize: 20 // 每页显示多少条
         },
         searchForm: {},
         devBtn: 0,
         tableLoading: false,
         // 设备参数
         dialogFormVisible: false,
         options: [
            { value: 0, label: "已连接" },
            { value: 1, label: "未连接" }
         ],
         // 已连接
         data: [],
         apparatus: {
            align: "center",
            addBtn: false,
            editBtn: false,
            delBtn: false,
            stripe: true,
            menuWidth: 120,
            border: true,
            column: [
               {
                  label: "设备名",
                  prop: "deviceName"
               },

               {
                  label: "连接时间",
                  prop: "startTime"
               },
               {
                  label: "在线时长",
                  prop: "totalLengthOfTime"
               },
               {
                  label: "状态",
                  prop: "connected"
               }
            ]
         },
         // 未连接
         data1: [],
         apparatus1: {
            align: "center",
            addBtn: false,
            editBtn: false,
            delBtn: false,
            menuWidth: 120,
            border: true,
            stripe: true,
            column: [
               {
                  label: "设备名",
                  prop: "name"
               },

               {
                  label: "编码",
                  prop: "deviceNumber"
               },
               {
                  label: "型号",
                  prop: "model"
               },
               {
                  label: "状态",
                  prop: "unconnected"
               }
            ]
         }
      };
   },
   computed: {},
   watch: {
      messages: {
         handler(newValue, oldValue) {
            this.messages = newValue;
            this.searchOpenDev(this.messages.patientId);
            this.searchDevice();
         },
         deep: true
      }
   },
   // created() {
   //    this.searchOpenDev(this.patientId);
   // },
   mounted() {
      if (this.messages.patientId) {
         this.searchOpenDev(this.messages.patientId);
      }
      // this.searchDevice(this.messages.patientId);
   },
   methods: {
      // 设备关闭状态
      searchDevice(id) {
         this.tableLoading = true;
         fetchUnonnectedList({ state: 2 })
            .then(response => {
               if (response.data.data) {
                  this.data1 = response.data.data;
                  this.data1.forEach(item => {
                     let unconnected = { unconnected: "● 未使用", state: 2 };
                     Object.assign(item, unconnected);
                  });
               }
               this.tableLoading = false;
            })
            .catch(() => {
               // console.log("1");
            });
      },
      // 设备开启状态
      searchOpenDev(id) {
         this.tableLoading = true;
         fetchConnectedList(Object.assign({ patientId: id }))
            .then(response => {
               // console.log(response.data.data);
               if (response.data.data) {
                  this.data = response.data.data;
                  this.data.forEach(item => {
                     let connected = {
                        connected: "● 使用中",
                        state: 1,
                        // 开始时间
                        startTime: item.startTime.substr(5, 11),
                        // 计算时长
                        totalLengthOfTime: this.calculatingTime(item.startTime)
                     };
                     Object.assign(item, connected);
                  });
               }
               this.tableLoading = false;
            })
            .catch(() => {
               // alert("请求失败")
            });
         // this.getList(this.page);
         // startTime: dateFormat(new Date()).substr(5, 11),
      },
      // 设备连接弹窗
      search(row, index) {
         if (this.devBtn == 0) {
            // console.log(row);
            this.$confirm("是否关闭“" + row.deviceName + "”设备?", {
               confirmButtonText: "确定",
               cancelButtonText: "取消",
               type: "warning"
            })
               .then(function() {
                  return delObj(row.id);
               })
               .then(() => {
                  this.data.splice(index, 1);
                  this.$message({
                     showClose: true,
                     message: "关闭成功",
                     type: "success"
                  });
                  this.searchOpenDev(this.messages.patientId);
               });
         }
         if (this.devBtn == 1) {
            this.$confirm("是否连接“" + row.name + "”设备?", {
               confirmButtonText: "确定",
               cancelButtonText: "取消",
               type: "warning",
               dialogFormVisible: true
            })
               .then(() => {
                  return addObj(
                     Object.assign({
                        deviceId: row.deviceId,
                        patientId: this.messages.patientId
                     })
                  );
               })
               .then(() => {
                  this.$message({
                     showClose: true,
                     message: "添加成功",
                     type: "success"
                  });
                  this.searchDevice(this.messages.patientId);
               });
         }
      },
      // 更改设备按钮状态
      changeDevBtn(data) {
         this.devBtn = data;
         if (data == 0 || this.messages.patientId) {
            this.searchOpenDev(this.messages.patientId);
         }
         if (data == 1) {
            this.searchDevice();
         }
      },
      //运行颜色修改
      cellStyle({ row, column, rowIndex, columnIndex }) {
         if (columnIndex == 3) {
            if (row.state == 1) {
               return {
                  color: "#10ac84"
               };
            } else if (row.state == 2) {
               return {
                  color: "#F56C6C"
               };
            }
         }
      },
      // 计算时长
      calculatingTime(time) {
         let v = calcDate(new Date(time).getTime(), new Date().getTime());
         var result = v.days + "天" + v.hours + "时" + v.minutes + "分";
         return result;
      }
   }
};
</script>
<style scoped="scoped" lang="scss">
.EquipmentStatus {
   width: 100%;
}
.EquipmentStatus_top button {
   margin-left: 1%;
}
.devicewindow {
   margin: 10px auto;
   height: 600px;
   overflow-y: auto;
   // border: 1px solid #EBEEF5;
   border-radius: 5px;
}
.footer {
   padding: 40px 20px 20px;
   text-align: right;
}
</style>


