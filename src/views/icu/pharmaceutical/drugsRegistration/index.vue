
<template>
  <div class="execution">
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :permission="permissionList"
        :table-loading="tableLoading"
        :option="tableOption"
        @on-load="getList"
        @search-change="searchChange"
        @refresh-change="refreshChange"
        @row-update="Update"
        @row-save="handleSave"
        @row-del="rowDel"
        @search-reset="clearform"
      >
        <template slot="searchMenu">
          <el-button type="primary" size="small" icon="el-icon-plus" @click="rowAdd">新增</el-button>
        </template>
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
import {
  addObj,
  delObj,
  fetchList,
  putObj,
  UpdateObj
} from "@/api/icu/pharmaceutical/drugsRegistration/drugsRegistration";
import { tableOption } from "@/const/crud/icu/pharmaceutical/drugsRegistration/drugsRegistration";
import { mapGetters } from "vuex";

export default {
  name: "drugsRegistration",
  data() {
    return {
      searchForm: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        current: 1, // 当前页数
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
        addBtn: this.vaildData(this.permissions.icu_nurse_add, true),
        delBtn: this.vaildData(this.permissions.icu_nurse_del, true),
        editBtn: this.vaildData(this.permissions.icu_nurse_edit, true),
        viewBtn: this.vaildData(this.permissions.icu_nurse_view, true)
      };
    }
  },
  methods: {
    rowAdd() {
      this.$refs.crud.rowAdd();
    },
    handleCreate(row, index, done, loading) {
      putObj(row.nurseId)
        .then(data => {
          this.$refs.crud.rowView(data.data.data, index);
          done();
        })
        .catch(() => {});
    },
    //点击修改提交
    Update(row, index, loading) {
      UpdateObj(row)
        .then(data => {
          this.$refs.crud.rowEdit(data.data.data, index);
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
      this.$confirm("是否确认删除序号为" + index, "提示", {
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
    //点击编辑
    handleUpdate: function(row, index, done, loading) {
      putObj(row.nurseId)
        .then(data => {
          this.$refs.crud.rowEdit(data.data.data, index);
          done();
        })
        .catch(() => {});
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
    },
        //清空回调
    clearform() {
      this.page = {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      };
      this.searchForm = {};
      this.getList(this.page);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
