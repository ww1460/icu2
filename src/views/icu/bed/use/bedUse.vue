<template>
  <!-- 床位使用记录 -->
  <basic-container>
    <avue-crud
      ref="crud"
      :page="page"
      :data="tableData"
      :permission="permissionList"
      :table-loading="tableLoading"
      :option="tableOption"
      @search-change="searchChange"
      @refresh-change="refreshChange"
      @row-del="rowDel"
      @size-change="sizeChange"
      @current-change="currentChange"
      @search-reset="clearform"
    />
  </basic-container>
</template>
<script>
import { addObj, delObj, fetchList, putObj } from "@/api/icu/nurse/bedUse";
import { tableOption } from "@/const/crud/icu/nurse/bedUse";
import { mapGetters } from "vuex";
export default {
  name: "bedUse",
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
      tableOption: tableOption
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
    permissionList() {
      return {
        //  addBtn: this.vaildData(this.permissions.icu_task_add, false),
        delBtn: this.vaildData(this.permissions.icu_bedUse_del, false)
        // editBtn: this.vaildData(this.permissions.icu_task_edit, false)
      };
    }
  },
  created() {},
  activated() {
    this.getList();
  },
  methods: {
    // 分页bug
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.getList();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.getList();
    },

    getList(page, params) {
      // console.log(params)
      this.tableLoading = true;
      fetchList(
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
          // console.log(this.tableData)
          this.tableLoading = false;
        })
        .catch(() => {
          this.tableLoading = false;
        });
    },

    rowDel: function(row, index) {
      // console.log(row.endTime)
      var _this = this;
      if (row.endTime == null) {
        _this.$message({
          showClose: true,
          message: "未使用结束的床位记录不能删除",
          type: "error"
        });
      } else {
        this.$confirm("是否确认删除ID为" + row.id, "提示", {
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
      }
    },
      //清空回调
    clearform() {
      this.page = {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      };
      this.searchForm = "";
      this.getList(this.page);
    },
    /**
     * 搜索回调
     */
    searchChange(form) {
      // console.log(form)
      this.searchForm = form;
      this.page = {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      }
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
<style lang="scss" scoped="scoped">
// .bedUselist{
//      width: 96%;

//   background-color: #fff;
//   padding-left: 0.5%;
//   padding-right: 0.5%;
//   margin-left: 1%;
//   margin-right: 1%;
//   margin-top: 5px;
//   margin-bottom: 100px;
//   padding-top: 1%
// }
</style>
