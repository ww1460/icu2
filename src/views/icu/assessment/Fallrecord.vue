
<template>
  <div class="execution">
    <basic-container>
      <avue-crud
        v-if="flag"
        ref="crud"
        :page="page"
        :data="tableData"
        :permission="permissionList"
        :table-loading="tableLoading"
        :option="tableOption"
        @search-change="searchChange"
        @search-reset="crearChage"
        @size-change="sizeChange"
        @current-change="currentChange"
      >
        <!-- <template slot="search">
               <el-col :md="5" :xs="2">
                  <el-form-item>
                     <el-select v-model="patientId" size="small">
                        <el-option
                           v-for="(item,index) in patientNames"
                           :key="index"
                           :label="item.name + item.bedName"
                           :value="item.patientId"
                        ></el-option>
                     </el-select>
                  </el-form-item>
               </el-col>
        </template>-->
        <template slot="menuLeft">
          <el-button type="primary" size="small" icon="el-icon-plus" @click="rowAdd(1)">新增</el-button>
        </template>
        <template slot-scope="scope" slot="menu">
          <el-button
            type="text"
            icon="el-icon-view"
            size="small"
            @click="handleUpdate(scope.row,scope.index,3)"
          >查看</el-button>
          <el-button
            type="text"
            icon="el-icon-edit"
            size="small"
            @click="handleUpdate(scope.row,scope.index,2)"
          >编辑</el-button>
          <el-button
            type="text"
            icon="el-icon-delete"
            size="small"
            @click="rowDel(scope.row,scope.index)"
          >删除</el-button>
        </template>
      </avue-crud>
      <div v-if="flag">
        <el-dropdown class="avue-tags__menu">
          <el-button type="primary" size="mini" v-model="patientInfo.patientId">
            {{patientInfo.patientName}} {{patientInfo.bedName}}
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
                :class="['el-button--small',(item.patientId == patientInfo.patientId?'el-button el-button--primary':'')]"
                @click="patientNameClick(item.patientName,item.id,item.patientId,item)"
                style="margin-left: 0px !important;"
              >{{item.patientName}} {{item.bedName}}</el-button>
            </div>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <fallSdrop :changeflag="changeFlag" :patientInfo="patientInfo" :flagnum="flagnum" v-else></fallSdrop>
    </basic-container>
  </div>
</template>

<script>
import {
  addObj,
  delObj,
  fetchListTwo,
  putObj,
  UpdateObj,
  getList,
  getnurse
} from "@/api/icu/assessment/Fallrecord";
import { tableOption } from "@/const/crud/icu/assessment/fallSdrop";
import { mapGetters } from "vuex";
import fallSdrop from "./fallSdrop";

export default {
  components: {
    fallSdrop
  },
  name: "Fallrecord",
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
      tableOption: tableOption,
      flag: true,
      flagnum: 1,
      patientsNurseList: [],
      patientId: "",
      patientInfo: {},
      patientNames: [],
      patientName: ""
    };
  },
  computed: {
    ...mapGetters([
      "permissions",
      "nurse_patients",
      "dep_patients",
      "userInfo",
      "patientMessage"
    ]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permissions.icu_nurse_add, false),
        delBtn: this.vaildData(this.permissions.icu_nurse_del, false),
        editBtn: this.vaildData(this.permissions.icu_nurse_edit, false)
      };
    }
  },
  watch: {
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
  created() {
    let data = JSON.parse(sessionStorage.getItem("pigx-all_patients")).content;
    this.patientInfo = JSON.parse(
      sessionStorage.getItem("pigx-patientMessage")
    ).content;
    this.patientNames = data;
    this.patientId = this.patientInfo.patientId;
    this.patientName = this.patientInfo.name;
    this.patientInfo = this.patientInfo;
    this.searchForm = { patientId: this.patientInfo.patientId };
    this.getList();
  },
  activated() {
    let data = JSON.parse(sessionStorage.getItem("pigx-all_patients")).content;
    this.patientNames = data;
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
    //点击切换护士
    changeNurse(id, index, name) {
      this.name = name;
      this.nurseID = id;
      this.getList(this.page, this.nurseID);
    },
    //新增
    rowAdd(flag) {
      if (!this.patientId) {
        this.$message({
          showClose: true,
          message: "请先选择患者",
          type: "warning"
        });
      } else {
        this.patientNames.filter(item => {
          if (this.patientId == item.patientId) {
            this.patientInfo = item;
            this.flag = false;
            this.flagnum = flag;
          }
        });
      }
    },
    changeFlag(val) {
      this.flag = true;
      this.patientInfo = val;
      this.patientInfo.bedName = this.patientInfo.bedCode;
      this.patientId = this.patientInfo.patientId;
      this.searchForm = {
        patientId: this.patientId
      };
      this.getList();
    },
    patientNameClick(name, id, patientId, item) {
      this.patientId = patientId;
      this.patientName = name;
      this.page.currentPage = 1;
      this.page.pageSize = 10;
      this.$store.commit("SET_MESSAGE", item);
      this.patientInfo = this.patientMessage;
      this.searchForm = { patientId: this.patientInfo.patientId };
      this.getList();
    },
    getList(params) {
      this.tableLoading = true;
      fetchListTwo(
        Object.assign(
          {
            current: this.page.currentPage,
            size: this.page.pageSize
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
      var _this = this;
      this.$confirm("是否确认删除" + row.patientName, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return delObj(row.id);
        })
        .then(data => {
          _this.$message({
            showClose: true,
            message: "删除成功",
            type: "success"
          });
          this.getList();
        });
    },
    /**
     * @title 数据更新
     * @param row 为当前的数据
     * @param index 为当前更新数据的行数
     * @param done 为表单关闭函数
     *
     **/
    //点击编辑
    handleUpdate(row, index, flag) {
      //编辑
      if (flag == 2) {
        putObj(row.id)
          .then(res => {
            this.patientInfo = res.data.data;
            this.flagnum = flag;
            this.flag = false;
          })
          .catch(() => {});
      }
      //查看
      if (flag == 3) {
        putObj(row.id).then(res => {
          this.patientInfo = res.data.data;
          console.log(this.patientInfo);
          this.flagnum = flag;
          this.flag = false;
        });
      }
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
          this.getList();
          this.searchForm = { patientId: this.patientId };
          done();
        })
        .catch(() => {
          loading();
        });
    },
    crearChage() {
      this.searchForm = {};
      this.patientId = "";
      this.getList();
    },
    /**
     * 搜索回调
     */
    searchChange(form) {
      form.patientId = this.patientId;
      this.searchForm = form;
      this.getList();
    }
  }
};
</script>

<style lang="scss" scoped>
.avue-tags__menu {
  line-height: 40px;
  padding-right: 10px;
  margin-top: 10px;
  margin-right: 1%;
  z-index: 900;
}
// .el-button + .el-button {
//    margin-left: 0px !important;
// }
//
</style>
