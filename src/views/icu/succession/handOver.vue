<template>
  <!-- 交班 -->
  <div class="execution">
    <basic-container>
      <div class="left">
        <div class="page1">
          <div class="createPer" style="margin-bottom:1%">
            <label>患者:</label>
            <el-button
              v-for="(item,index) in patientNames"
              :class="['patientBtn',(index == ActBtn?'patientBtnAct':'')]"
              :key="index"
              style="margin-left:1%;text_algin:center;padding:10px;"
              @click="patientNameClick(item.patientId,item.patientName,index)"
            >{{ item.patientName }} {{item.bedName}}</el-button>
            <!-- <el-button
              class="refreshBtn"
              type="primary"
              plain
              size="medium"
              :loading="refBtn"
              @click="refPat()"
            >刷新患者</el-button>-->
          </div>

          <el-collapse v-model="activeNames" accordion @change="handleChange">
            <el-collapse-item title="病情报表" name="1">
              <avue-crud
                ref="cruds"
                :page="page"
                :data="reportData"
                :permission="permissionList"
                :table-loading="reportLoading"
                :option="reportOption"
                @size-change="sizeChange"
                @current-change="currentChange"
              />
              <div>
                <el-button
                  type="primary"
                  style="marginLeft:85%"
                  :loading="pdSub"
                  @click="generateClick()"
                >确认</el-button>
              </div>
            </el-collapse-item>
            <!-- <el-collapse-item title="护士长点评" name="2">
              <div>
                <el-button type="primary" style="marginLeft:85%" @click="illnessClick()">确认</el-button>
              </div>
            </el-collapse-item>-->
            <el-collapse-item title="交班" name="2" @click="acceptClick()">
              <avue-crud
                ref="crud"
                :data="tableData"
                :permission="permissionList"
                :table-loading="tableLoading"
                :option="tableOption"
                @selection-change="selectionChange"
                @search-change="searchChange"
                @refresh-change="refreshChange"
                @row-update="handleUpdate"
              >
                <template slot="shiftsTaskDescribe" slot-scope="scope">
                  <el-input
                    v-model="scope.row.shiftsTaskDescribe"
                    @change="DescribeChange(scope.row)"
                  ></el-input>
                </template>
              </avue-crud>
              <div style="marginTop:2%">
                <el-button type="primary" :loading="pdSub" @click="saveDes()">保存</el-button>
                <el-button @click="toggleSelection()">取消选择</el-button>
                <el-button
                  type="primary"
                  style="marginLeft:85%"
                  :loading="pdSub"
                  @click="shiftsBtn()"
                >交班</el-button>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>

      <div class="right">
        <!-- 流程图 -->
        <div class="figure">
          <div
            v-for="item in NewPatient"
            :key="item.id"
            :class="item.inline?'dis':''"
            @click="changeType(item.id)"
          >
            <p>
              <img v-if="item.img !=''" :src="item.flag?item.ActImg:item.img" alt />
              <br v-if="item.img !=''" />
              <span v-if="item.title !='' ">{{ item.title }}</span>
            </p>
          </div>
        </div>
      </div>
      <el-dialog title="交接班描述" :visible.sync="shiftDescribeVis" width="50%">
        <el-form>
          <el-form-item label="交接班描述" :label-width="formLabelWidth">
            <el-input v-model="shiftDescribe" ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="shiftsClick()">确 定</el-button>
          <el-button @click="shiftDescribeVis = false">取 消</el-button>
        </span>
      </el-dialog>
    </basic-container>
  </div>
</template>
<script>
import {
  addObj,
  delObj,
  getPat,
  putObj,
  getShiftsTask,
  saveDescribe,
  shifts,
  getRecords
} from "@/api/icu/nurse/handOver";
import { tableOption, reportOption } from "@/const/crud/icu/nurse/handOver";
// import disInfoSheet from "./changeShifts/disInfoSheet";
import { mapGetters } from "vuex";
// import { format } from 'path'

export default {
  name: "handOver",
  components: {
    // disInfoSheet
  },
  data() {
    return {
      seen1: false,
      shiftDescribeVis: false,
      formLabelWidth: "120px",
      pdSub: false,
      refBtn: false,
      shiftDescribe: '',
      patientNames: [],
      activeNames: ["1"],
      patientId: "",
      nurseId: "",
      ActBtn: 0,
      changeShiftsArr: [],
      // 操作后获取的数据
      reportData: [],
      operationData: "",

      // 主页面
      processFigure: false, //控制流程图点击
      NewPatient: [
        { id: -1, flag: false },
        {
          id: 1,
          title: "患者",
          ActImg: "/img/entryDepartment/lc_lan_1_01.png",
          img: "/img/entryDepartment//lc_hui_1_01.png",
          flag: false
        },
        {
          title: "",
          ActImg: "/img/entryDepartment/lc_1_01.png",
          img: "/img/entryDepartment/lc_1_01.png",
          flag: false
        },
        {
          id: 2,
          title: "病情报表",
          ActImg: "/img/entryDepartment/lc_lan_1_02.png",
          img: "/img/entryDepartment/lc_hui_1_02.png",
          flag: false,
          inline: true
        },
        {
          title: "",
          ActImg: "/img/entryDepartment/lc_1_01.png",
          img: "/img/entryDepartment/lc_1_01.png",
          flag: false
        },
        // {
        //   id: 3,
        //   title: '护士长点评',
        //   ActImg: '/img/entryDepartment/lc_lan_1_03.png',
        //   img: '/img/entryDepartment/lc_hui_1_03.png',
        //   flag: false
        // },
        // {
        //   title: '',
        //   ActImg: '/img/entryDepartment/lc_1_01.png',
        //   img: '/img/entryDepartment/lc_1_01.png',
        //   flag: false
        // },
        {
          id: 3,
          title: "交班",
          ActImg: "/img/entryDepartment/lc_lan_1_04.png",
          img: "/img/entryDepartment/lc_hui_1_04.png",
          flag: false
        }
      ],
      waitingData: [],
      alreadyData: [],
      badsData: [],

      searchForm: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      reportLoading: false,
      tableLoading: false,
      tableOption: tableOption,
      reportOption: reportOption,
      saveArr: [],
      rowList: []
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
    permissionList() {
      return {};
    }
  },

  created() {
    // console.log(123)
    this.getPatient();
    this.saveArr = [];
  },
  mounted() { },
  methods: {
    handleChange(val) {
      if (val == "") {
        // console.log(123)
      } else {
        if (val == 2 && this.NewPatient[3].flag == false) {
          // console.log(123)
          this.$message({
            showClose: true,
            message: "病情报表未提交",
            type: "warning"
          });
          this.activeNames = ["1"];
        }
      }
    },
    //患者姓名选择
    patientNameClick(id, name, index) {
      this.activeNames = ["1"];
      this.tableData = [];
      this.toggleSelection();
      this.patientId = id;
      this.ActBtn = index;
      this.page = {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
        // this.arr = []
        // this.tableData = []
        // this.tableData = this.arr2
        this.NewPatient.forEach(i => {
          // console.log(i)
        });
      for (var i in this.NewPatient) {
        this.NewPatient[i].flag = false;
      }
      this.NewPatient[1].title = name;
      this.NewPatient[1].flag = true;
      this.processFigure = true;
      this.tableData = [];
      this.reportLoading = true
      this.getRec()
      this.getList();
    },
    acceptClick() {
      if (this.NewPatient[3].flag === true) {
        // this.NewPatient[7].flag = true
        this.activeNames = ["2"];
      } else {
        this.$message({
          showClose: true,
          message: "病情报表未提交",
          type: "error"
        });
        this.activeNames = ["1"];
      }
    },
    // 交班按钮
    shiftsBtn() {
      if (this.patientId == "" || this.patientId == null) {
        this.$message.warning('您不是责任护士,不需要交接班')
        return
      }
      this.shiftDescribeVis = true
    },
    shiftsClick() {
      this.$confirm('是否确定进行交接班?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.NewPatient[5].flag = true;
        for (let i in this.tableData) {
          this.tableData[i].taskId = this.tableData[i].taskSubTaskId
          if (this.tableData[i].shiftsTaskDescribe == undefined) {
            this.tableData[i].shiftsTaskDescribe = "";
          }
        }
        let obj = {
          patientId: this.patientId,
          taskCondition: this.tableData.length,
          shiftDescribe: this.shiftDescribe
        };
        let params = {
          changeShiftsRecord: obj,
          list: this.tableData
        };
        this.pdSub = true;
        console.log(params)
        shifts(params).then(response => {
          this.$message({
            showClose: true,
            message: "交班成功",
            type: "success"
          });
          this.$store.dispatch("getAllPatients");
          this.shiftDescribeVis = false
          this.shiftDescribe = ''
          this.pdSub = false;
          this.activeNames = ["1"];
          this.NewPatient[3].flag = false;
          this.NewPatient[5].flag = false;
          // this.patientNames=[]
          this.getPatient()
        });
      })

      //  this.$message.warning('交班中请勿重复点击')
      //   setTimeout(()=>{
      //     loading()
      //     this.$message.warning('交班中请勿重复点击')
      //   },1000)
      //   setTimeout(()=>{
      //   },3000)
    },
    // 护士长点评按钮
    // illnessClick() {
    //   if (this.NewPatient[3].flag === true) {
    //     this.NewPatient[5].flag = true;
    //     this.activeNames = ["3"];
    //   } else {
    //     this.$message({
    //       showClose: true,
    //       message: "病情报表未提交",
    //       type: "error"
    //     });
    //     this.activeNames = ["1"];
    //   }
    // },
    // 病情报表确认按钮
    generateClick() {
      this.activeNames = ["2"];
      this.NewPatient[3].flag = true;
      // if (this.NewPatient[5].flag === true) {
      //   this.NewPatient[7].flag = true
      //   this.activeNames = ['4']
      // } else {
      //   this.$message({
      //     showClose: true,
      //     message: '病情报表未提交',
      //     type: 'error'
      //   })
      //   this.activeNames = ['2']
      // }
    },
    // 流程图id
    changeType(id) {
      this.changeTypeId = id;
      for (var i in this.NewPatient) {
        if (this.processFigure === false) {
          break;
        } else {
          if (this.NewPatient[i].id === this.changeTypeId) {
            if (this.changeTypeId === 1) {
              return false;
            }
            if (this.changeTypeId === 2) {
              // this.beds = true
              // console.log(666)
              this.activeNames = ["1"];
            }
            if (this.changeTypeId === 3) {
              // this.distribution = true
              this.activeNames = ["2"];
            }
          }
        }
      }
    },
    // 选中状态
    selectionChange(list) {
      // this.$message.success('选中的数据'+ JSON.stringify(list));
      this.saveArr = list;
    },

    toggleSelection(val) {
      this.$refs.crud.toggleSelection(val);
    },

    DescribeChange(row, index) {
      // this.$refs.crud.toggleRowSelection(row,true);
      //  this.rowList.push(row)
      //   for(var i in this.rowList){
      //     this.$refs.crud.toggleRowSelection(this.rowList[i],true);
      //     console.log
      //   }
      //   console.log(this.rowList)
      //   console.log(row)
    },
    // 保存描述
    saveDes() {
      let saveDesArr = [];
      for (let i in this.saveArr) {
        saveDesArr.push({
          taskId: this.saveArr[i].taskSubTaskId,
          shiftsTaskDescribe: this.saveArr[i].shiftsTaskDescribe
        });
      }
      saveDescribe(saveDesArr).then(response => {
        this.$message({
          showClose: true,
          message: "保存成功",
          type: "success"
        });
      });
    },
    refPat() {
      this.refBtn = true;
      this.getPatient();
    },
    // 获取负责的患者及任务
    getPatient() {
          this.patientNames=[]
          this.patientId=''
          this.reportData=[]
          this.tableData=[]
      getPat()
        .then(response => {
          this.patientNames = response.data.data;
          this.nurseId = this.patientNames[0].nurseId;
          this.patientId = this.patientNames[0].patientId;
          this.NewPatient[1].title = this.patientNames[0].patientName;
          this.NewPatient[1].flag = true;
          this.processFigure = true;
          if (this.NewPatient[0].id === -1) {
            this.processFigure = false;
          } else {
            this.processFigure = true;
          }
          this.ActBtn = 0;
          this.refBtn = false;
          this.getRec();
          this.getList();
        })
        .catch(() => {
          this.refBtn = false;
        });
    },
    //获取病情报表
    getRec() {
      let params = {
        patientId: this.patientId,
        recordScope: "病情护理"
      }
      getRecords(Object.assign({
        current: this.page.currentPage,
        size: this.page.pageSize
      }, params, this.searchForm)).then(response => {
        this.reportLoading = false
        this.reportData = response.data.data.records
        this.page.pageSize = response.data.data.size
        this.page.currentPage = response.data.data.current
        this.page.total = response.data.data.total
      });
    },
    //病情报表分页 
    sizeChange(val) {
      this.page.pageSize = val
      this.getRec()
    },
    currentChange(val) {
      this.page.currentPage = val
      this.getRec()
    },
    getList() {
      this.reportLoading = true
      getShiftsTask({
        patientId: this.patientId
      })
        .then(response => {
          this.tableData = response.data.data;
          this.tableLoading = false;
        })
        .catch(() => {
          this.tableLoading = false;
        });
    },
    /**
     * @title 数据更新
     * @param row 为当前的数据
     * @param index 为当前更新数据的行数
     * @param done 为表单关闭函数
     *
     **/
    handleUpdate: function (row, index, done, loading) {
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
     * 搜索回调
     */
    searchChange(form) {
      this.searchForm = form;
      this.getList(this.page, form);
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
.createPer {
  position: relative;
}
.refreshBtn {
  position: absolute;
  right: 20px;
  top: -5px;
}
</style>
