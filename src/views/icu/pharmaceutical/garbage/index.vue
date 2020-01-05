
<template>
  <!-- 药品垃圾 -->
  <div>
    <basic-container>
      <div class="searchBox clearfix">
        <div>
          <el-select
            v-model="pat"
            @change="searchChange"
            size="small"
            style="margin-right:10px"
            clearable
            placeholder="患者姓名"
            class="selectBox"
          >
            <el-option
              v-for="item in patientNames"
              :key="item.value"
              :label="item.patientName+item.bedName"
              :value="item.patientId"
            ></el-option>
          </el-select>
        </div>
        <div class="addBox">
          <el-button type="primary" icon="el-icon-search" size="small" @click="searchChange">搜索</el-button>
          <el-button icon="el-icon-delete" size="small">清空</el-button>
          <!-- <el-button type="primary" size="small" icon="el-icon-plus" @click="addDia(1)">新增</el-button> -->
        </div>
      </div>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :permission="permissionList"
        :table-loading="tableLoading"
        :option="tableOption"
        @on-load="getList"
        @row-del="rowDel"
      >
        <template slot-scope="scope" slot="menu">
          <el-button type="text" icon="el-icon-view" size="small" @click="view(2,scope.row)">查看</el-button>
          <el-button type="text" icon="el-icon-edit" size="small" @click="edit(3,scope.row)">编辑</el-button>
          <el-button type="text" icon="el-icon-delete" size="small" @click="rowDel(scope.row)">删除</el-button>
        </template>
      </avue-crud>
      <el-dialog
        :title="flag == 1?'新增':flag == 3? '编辑': flag == 2?'查看':''"
        :visible.sync="dialogFormVisible"
        :fullscreen="isFullscreen"
        width="60%"
        @close="closeDialog('form')"
      >
        <div style="width:95%">
          <el-form :model="form" :rules="rules" ref="form" :label-width="'120px'">
            <el-form-item prop="hisDoctorsAdviceId" label="医嘱名称">
              <el-select
                v-model="form.hisDoctorsAdviceId"
                :disabled="flag == 2"
                placeholder="请选择医嘱名称"
                style="width:100%"
              >
                <el-option
                  v-for="item in adviceList"
                  :key="item.doctorsAdviceCodeId"
                  :label="item.doctorsAdviceContent"
                  :value="item.doctorsAdviceCodeId"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="transfusePatientId" label="患者姓名">
              <el-select
                v-model="form.transfusePatientId"
                :disabled="flag == 2"
                placeholder="请选择患者姓名"
                @change="patChange"
                style="width:100%"
              >
                <el-option
                  v-for="item in patientNames"
                  :key="item.patientId"
                  :label="item.patientName+item.bedName"
                  :value="item.patientId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="drugName" label="药品名称">
              <el-input
                :disabled="flag == 2"
                v-model="form.drugName"
                placeholder="请输入药品名称"
                clearable
              ></el-input>
            </el-form-item>

            <el-form-item prop="dispensingDrugTime" label="配药时间">
              <el-date-picker
                :disabled="flag == 2"
                style="width:100%"
                v-model="form.dispensingDrugTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择配药时间"
              ></el-date-picker>
            </el-form-item>
            <el-form-item prop="dispensingDrugNurseId" label="配药护士">
              <el-select
                v-model="form.dispensingDrugNurseId"
                :disabled="flag == 2"
                placeholder="请选择配药护士"
                style="width:100%"
              >
                <el-option
                  v-for="item in nurseList"
                  :key="item.nurseId"
                  :label="item.realName"
                  :value="item.nurseId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="transfuseStartTime" label="输液开始时间">
              <el-date-picker
                :disabled="flag == 2"
                style="width:100%"
                v-model="form.transfuseStartTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择输液开始时间"
              ></el-date-picker>
            </el-form-item>
            <el-form-item prop="transfuseEndTime" label="输液结束时间">
              <el-date-picker
                :disabled="flag == 2"
                style="width:100%"
                v-model="form.transfuseEndTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="选择输液结束时间"
              ></el-date-picker>
            </el-form-item>

            <el-form-item prop="transfuseNurseId" label="输液护士">
              <el-select
                v-model="form.transfuseNurseId"
                :disabled="flag == 2"
                placeholder="请选择输液护士"
                style="width:100%"
              >
                <el-option
                  v-for="item in nurseList"
                  :key="item.nurseId"
                  :label="item.realName"
                  :value="item.nurseId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="discardTime" label="废弃时间">
              <el-date-picker
                :disabled="flag == 2"
                style="width:100%"
                v-model="form.discardTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择废弃时间"
              ></el-date-picker>
            </el-form-item>
            <el-form-item prop="discardNurseId" label="废弃护士">
              <el-select
                v-model="form.discardNurseId"
                :disabled="flag == 2"
                placeholder="请选择废弃护士"
                style="width:100%"
              >
                <el-option
                  v-for="item in nurseList"
                  :key="item.nurseId"
                  :label="item.realName"
                  :value="item.nurseId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>

        <div slot="footer" class="dialog-footer">
          <el-button
            :disabled="flag == 2"
            type="primary"
            :loading="temSubLoading"
            @click="handleSave('form')"
          >保 存</el-button>
          <el-button @click="dialogFormVisible = false">取 消</el-button>
        </div>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import { addObj, delObj, fetchList, putObj, UpdateObj, addPreJump, getNurse } from '@/api/icu/pharmaceutical/garbage/garbage'
import { tableOption } from '@/const/crud/icu/pharmaceutical/garbage/garbage'
import { mapGetters } from 'vuex'

export default {
  name: 'Errormanagement',
  data() {
    return {
      flag: '',
      pat: "",
      dialogFormVisible: false,
      isFullscreen: false,
      temSubLoading: false,
      screenWidth: document.body.clientWidth, // 屏幕尺寸
      searchForm: {},
      patientNames: [],
      adviceList: [],
      nurseList: [],
      form: {
        hisDoctorsAdviceId: "",//关联医嘱id
        drugName: "",//药品
        dispensingDrugTime: "",//配药时间
        dispensingDrugNurseId: "", //配药护士id
        transfuseStartTime: "", //开始时间
        transfuseEndTime: "", //结束时间
        transfusePatientId: "", //患者id
        bedId: "",//床位id
        transfuseNurseId: "", //输液护士id
        discardTime: "", //废弃时间
        discardNurseId: "",//废弃护士id
      },
      rules: {
        hisDoctorsAdviceId: [
          { required: true, message: '请选择医嘱内容', trigger: 'change' }
        ],
        dispensingDrugTime: [
          { required: true, message: '请选择配药时间', trigger: 'change' }
        ],
        transfuseStartTime: [
          { required: true, message: '请选择输液开始时间', trigger: 'change' }
        ],
        transfuseEndTime: [
          { required: true, message: '请选择输液结束时间', trigger: 'change' }
        ],
        discardTime: [
          { required: true, message: '请选择废弃时间', trigger: 'change' }
        ],
        transfusePatientId: [
          { required: true, message: '请选择患者姓名', trigger: 'change' }
        ],
        dispensingDrugNurseId: [
          { required: true, message: '请选择配药护士', trigger: 'change' }
        ],
        transfuseNurseId: [
          { required: true, message: '请选择输液护士', trigger: 'change' }
        ],
        discardNurseId: [
          { required: true, message: '请选择废弃护士', trigger: 'change' }
        ],
        drugName: [
          { required: true, message: "请输入药品名称", trigger: "blur" }
        ],
      },
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption
    }
  },
  computed: {
    ...mapGetters(["permissions", "nurse_patients", "patientMessage", "nurseIndexFlag"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permissions.icu_nurse_add, false),
        delBtn: this.vaildData(this.permissions.icu_nurse_del, false),
        editBtn: this.vaildData(this.permissions.icu_nurse_edit, false)
      }
    }
  },
  created() {
    if (JSON.parse(sessionStorage.getItem("pigx-nurseIndexFlag"))) {
      this.getNursePatients();
    } else {
      this.$store.dispatch("getAllPatients").then(res => {
        this.getNursePatients();

      });
    }
    addPreJump().then(response => {
      this.adviceList = response.data.data.doctorsAdviceCodes
    })
    getNurse().then(response => {
      this.nurseList = response.data.data.nurses
    })
  },
  mounted() {
    const that = this;
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth;
        that.screenWidth = window.screenWidth;
      })();
    };
    if (that.screenWidth <= 1024) {
      this.isFullscreen = true;
    }
  },
  methods: {
    addDia() {
      this.flag = 1
      this.dialogFormVisible = true
    },
    closeDialog(formName) {
      this.$refs[formName].resetFields();
      this.form = {}
    },
    patChange(event) {
      for (let i in this.patientNames) {
        if (this.patientNames[i].patientId == event) {
          this.form.bedId = this.patientNames[i].bedId
        }
      }
    },
    getNursePatients() {
      var data = [],
        data1 = [];
      if (
        JSON.parse(sessionStorage.getItem("pigx-all_patients")).dataType ===
        "undefined"
      ) {
      } else {
        data = JSON.parse(sessionStorage.getItem("pigx-all_patients"))
          .content;
        data1 = JSON.parse(sessionStorage.getItem("pigx-patientMessage"))
          .content;
      }
      this.patientNames = data;
      if (data.length == 0) {
      }
      this.$store.commit('SET_NURSEINDEXFLAG', true)
    },
    getList(page, params) {
      this.tableLoading = true
      fetchList(Object.assign({
        current: page.currentPage,
        size: page.pageSize
      }, params, this.searchForm)).then(response => {

        this.tableData = response.data.data.records
        this.page.total = response.data.data.total
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    rowDel: function (row) {
      var _this = this
      this.$confirm('是否确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return delObj(row.id)
      }).then(data => {
        _this.$message({
          showClose: true,
          message: '删除成功',
          type: 'success'
        })
        this.getList(this.page)
      })
    },
    /**
       * @title 数据更新
       * @param row 为当前的数据
       * @param index 为当前更新数据的行数
       * @param done 为表单关闭函数
       *
       **/
    handleSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.temSubLoading = true
          if (this.flag == 1) {
            addObj(this.form).then(data => {
              // this.tableData.push(Object.assign({}, row))
              this.$message({
                showClose: true,
                message: '添加成功',
                type: 'success'
              })
              this.dialogFormVisible = false
              this.temSubLoading = false
              this.getList(this.page)
            }).catch(() => {
              this.temSubLoading = false
            })
          }
          if (this.flag == 3) {
            UpdateObj(this.form).then(response => {
              this.$message({
                showClose: true,
                message: '修改成功',
                type: 'success'
              })
              this.dialogFormVisible = false
              this.temSubLoading = false
              this.getList(this.page)
            }).catch(() => {
              this.temSubLoading = false
            })
          }
        }
      })

    },
    view(flag, row) {
      this.flag = flag
      this.form = row
      this.dialogFormVisible = true
    },
    edit(flag, row) {
      this.flag = flag
      this.form = row
      this.dialogFormVisible = true
    },
    /**
       * 搜索回调
       */
    searchChange() {
      this.searchForm.patientId = this.pat
      this.getList(this.page, this.searchForm)
    },
  }
}
</script>

<style lang="scss" scoped>
.clearfix:after {
  content: '';
  clear: both;
  display: block;
}
.searchBox {
  padding-left: 6px;
  margin-bottom: 10px;
}
.searchBox > div {
  float: left;
}
@media screen and (max-width: 1024px) {
  .searchBox {
    padding-left: 6px;
    width: 100%;
    margin-bottom: 10px;
  }
  .selectBox {
    width: 96%;
    margin-right: 10px;
  }
  .searchBox > div {
    float: none;
    width: 100%;
  }
  .addBox {
    margin-top: 10px;
  }
}
</style>
