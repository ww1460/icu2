
<template>
  <div class="execution">
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :table-loading="tableLoading"
        :option="tableOption"
        :permission="permissionList"
        @on-load="getList"
        @search-change="searchChange"
        @refresh-change="refreshChange"
        @row-update="handleUpdate"
        @row-save="handleSave"
        @row-del="handleDelete"
      >
        <template slot="searchMenu">
          <el-button type="primary" size="small" icon="el-icon-plus" @click="rowAdd">新增</el-button>
        </template>
      </avue-crud>
    </basic-container>
  </div>
</template>
    </basic-container>
  </div>
</template>

<script>
import {
  addObj,
  delObj,
  fetchList,
  putObj
} from "@/api/icu/matron/taskTemplate/taskTemplate";
import { tableOption } from "@/const/crud/icu/matron/taskTemplate/taskTemplate";
import { mapGetters } from "vuex";

export default {
  name: "taskTemplate",
  data() {
    return {
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
  created() {},
  mounted: function() {},
  computed: {
    ...mapGetters(["permissions"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permissions.taskTemplate_add, false),
        delBtn: this.vaildData(this.permissions.taskTemplate_del, false),
        editBtn: this.vaildData(this.permissions.taskTemplate_edit, false)
      };
    }
  },
  methods: {
    rowAdd() {
      this.$refs.crud.rowAdd();
    },
    getList(page, params) {
      this.tableLoading = true;
      fetchList(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize
          },
          params
        )
      ).then(response => {
        this.tableData = response.data.data.records;
        this.page.total = response.data.data.total;
        this.tableLoading = false;
      });
    },
    handleDelete: function(row, index) {
      var _this = this;
      this.$confirm("是否确认删除内容为" + row.templateContent, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return delObj(row.id);
        })
        .then(() => {
          _this.tableData.splice(index, 1);
          _this.$message({
            showClose: true,
            message: "删除成功",
            type: "success"
          });
          this.refreshChange();
        })
        .catch(function() {});
    },
    handleUpdate: function(row, index, done) {
      putObj(row).then(() => {
        this.tableData.splice(index, 1, Object.assign({}, row));
        this.$message({
          showClose: true,
          message: "修改成功",
          type: "success"
        });
        this.refreshChange();
        done();
      });
    },
    handleSave: function(row, done) {
      addObj(row).then(() => {
        this.tableData.push(Object.assign({}, row));
        this.$message({
          showClose: true,
          message: "添加成功",
          type: "success"
        });
        this.refreshChange();
        done();
      });
    },
    refreshChange() {
      this.getList(this.page);
    },
    searchChange(form) {
      this.getList(this.page, form);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

