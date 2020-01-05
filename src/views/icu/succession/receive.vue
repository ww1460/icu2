<template>
  <!-- 接班 -->

  <basic-container>
    <div class="page1">
      <div class="createPer" style="margin-bottom:1%;padding-top:7px;padding-bottom:3px;">
        <label>接班</label>
        <!-- <el-button  class="refreshBtn"  type="primary" plain size="medium" :loading="refBtn"   @click="getPatient()">刷新患者</el-button> -->
      </div>

      <el-collapse v-model="activeNames" accordion @change="handleChange">
        <el-collapse-item title="待接班患者" name="1">
          <avue-crud
            ref="crud"
            :data="patientNames"
            :permission="permissionList"
            :table-loading="tableLoading"
            :option="tableOption"
            
            @on-load="getPatient"
          >
            <template slot-scope="scope" slot="menu">
              <el-button  size="small" @click="seeTask(scope.row)">查看</el-button>
            </template>
          </avue-crud>
        </el-collapse-item>
        <el-collapse-item title="待接班任务列表" name="2">
          <avue-crud
                ref="crud"
                :data="taskData"
                :permission="permissionList"
                :table-loading="taskLoading"
                :option="taskOption"
              >
          </avue-crud>
          <div style="marginTop:2%">
            <el-button type="primary" style="marginLeft:85%" :loading="pdSub" @click="shiftsClick()">接班</el-button>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </basic-container>
</template>
<script>
import { getSuc, clickSuc,succession } from "@/api/icu/nurse/receive";
import { tableOption,taskOption} from "@/const/crud/icu/nurse/receive";
import { mapGetters } from "vuex";
// import { format } from 'path'

export default {
  name: "receive",
  components: {},
  data() {
    return {
      seen1: false,
      patientNames: [],
      activeNames: ["1"],
      patientId: "",
      ActBtn: 0,
      changeShiftsRecordId:'',
      choosePat:false,
      changeShiftsArr: [],
      // 操作后获取的数据
      refBtn:false,
      pdSub:false,
      searchForm: {},
      tableData: [],
      taskData:[],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption,
      taskOption:taskOption,
      taskLoading:false
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
    permissionList() {
      return {
        receiveBtn: this.vaildData(this.permissions.icu_process_receive, false)
      };
    }
  },

  created() {
    // console.log(123)
    // this.getPatient();
  },
  mounted() {
    // this.patientNames = this.nurse_patients;
    // this.patName = this.patientNames[0].patientId;
  },
  methods: {
    handleChange(val) {
       if(val==""){
        // console.log(123)
      }else{
        if(val==2&&this.choosePat==false){
          // console.log(123)
           this.$message({
          showClose: true,
          message: '请选择患者',
          type: 'warning'
        })
        this.activeNames = ['1']

        }
      }
    },
    //患者姓名选择
    patientNameClick(id, name, index) {},
   //查看患者待接班任务
    seeTask(row){
        // console.log(row)
        this.choosePat=true
        this.activeNames=["2"]
        this.patientId=row.patientId
        this.changeShiftsRecordId=row.changeShiftsRecordId
        // console.log(this.patientId)
        this.getList()
    },
    shiftsClick(){
        // this.activeNames=["1"]
        this.pdSub=true
        this.choosePat=false
        // let successArr=[]
        // console.log(this.taskData)
        // for(let i in this.taskData){
        //     successArr.push({
        //         taskId: this.taskData[i].taskId,
        //         patientId:this.taskData[i].patientId
        //     })
        // }
        let obj={
            changeShiftsRecordId:this.changeShiftsRecordId
        }
        let params = {
            changeShiftsRecord:obj,
            list:this.taskData
        }
        succession(params).then(response=>{
             this.$message({
            showClose: true,
            message: "接班成功",
            type: "success"
          });
         this.$store.dispatch("getAllPatients");
         this.pdSub=false
          this.activeNames=['1']
          this.getPatient()
        })
    },
    // 获取在科患者及任务
    getPatient() {
      this.refBtn=true
       this.tableLoading = true;
      getSuc()
        .then(response => {
          this.patientNames = response.data.data

          // console.log(response);
           this.refBtn=false
          this.tableLoading = false;
        })
        .catch(() => {
           this.refBtn=false
        });
    },
    getList() {
        clickSuc({
            changeShiftsRecordId:this.changeShiftsRecordId
        })
          .then(response => {
            this.taskData = response.data.data;
            // for(let i in this.tableData){
            //   this.tableData[i].$cellEdit=true
            // }
            // console.log(response);
            this.taskLoading = false;
          })
          .catch(() => {
            this.taskLoading = false;
          });
    },
    // /**
    //  * @title 数据更新
    //  * @param row 为当前的数据
    //  * @param index 为当前更新数据的行数
    //  * @param done 为表单关闭函数
    //  *
    //  **/
    // handleUpdate: function(row, index, done, loading) {
    //   putObj(row)
    //     .then(data => {
    //       this.tableData.splice(index, 1, Object.assign({}, row));
    //       this.$message({
    //         showClose: true,
    //         message: "修改成功",
    //         type: "success"
    //       });
    //       done();
    //       this.getList(this.page);
    //     })
    //     .catch(() => {
    //       loading();
    //     });
    // },
    // /**
    //  * 搜索回调
    //  */
    // searchChange(form) {
    //   this.searchForm = form;
    //   this.getList(this.page, form);
    // },
    // /**
    //  * 刷新回调
    //  */
    // refreshChange() {
    //   this.getList(this.page);
    // }
  }
};
</script>

<style lang="scss" scoped>
.patientBtnAct {
  background: #409eff !important;
  color: #fff !important;
}

.left {
  width: 77%;
  height: 650px;
  overflow-y: scroll;
  float: left;
  margin-top: -5%;
  padding-top: 5%;
}
.right {
  width: 20%;
  float: right;
}
@media screen and (max-width: 1200px) {
  .left {
    width: 100%;
    height: 100%;
  }
  .right {
    margin-top: 30px;
    width: 100%;
    margin-bottom: 50px;
  }
}
.right div {
  text-align: center;
}
.dis {
  display: inline-block;
}
.figure div:nth-child(10),
.figure div:nth-child(11),
.figure div:nth-child(12),
.figure div:nth-child(13),
.figure div:nth-child(14) {
  margin: 0 14px;
}
.AllNurse {
  width: 100%;
  height: 150px;
  border: 1px solid rgb(238, 238, 238);
  overflow-y: auto;
  button {
    width: 75px;
    margin-left: 1%;
    margin: 3% 4% 0 4%;
  }
}
.devBtn {
  background: #409eff !important;
  color: #fff !important;
}
.disBlock {
  display: inline-block;
}
.disNone {
  display: none;
}
#interval {
  width: 100px;
}
.lineBtn {
  text-align: center;
  margin: 10px;
}
.createPer{
  position: relative;
}
.refreshBtn{
  position: absolute;
  right: 20px;
 top:-5px;
}
</style>
