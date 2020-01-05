
<template>
  <!-- 引流液属性-->
  <div class="execution">
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :permission="permissionList"
        :table-loading="tableLoading"
        :option="tableOption"
        :cell-style="cellStyle"
        @on-load="getList"
        @row-update="handleUpdate"
        @row-save="handleSave"
        @search-change="searchChange"
        @row-del="rowDel"
         @size-change="sizeChange"
        @current-change="currentChange"
      ></avue-crud>
    </basic-container>
  </div>
</template>

<script>
import {
  addObj,
  delObj,
  fetchList,
  putObj
} from "@/api/icu/drainage/attribute";
import { tableOption } from "@/const/crud/icu/drainage/attribute";
import { mapGetters } from "vuex";

export default {
  name: "drainageType",
  data() {
    return {
      searchForm: {},
      form: {
        type: undefined,
        dictId: undefined,
        solt: undefined
      },
      dictType: undefined,
      dictId: undefined,
      dialogFormVisible: false,
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
  created() {
  },
  activated() {
    this.getList(this.page)
  },
  mounted: function() {},
  computed: {
    ...mapGetters(["permissions"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permissions.icu_drainage_add, false),
        delBtn: this.vaildData(this.permissions.icu_drainage_del, false),
        editBtn: this.vaildData(this.permissions.icu_drainage_edit, false)
      };
    }
  },
  methods: {
    // 修复分页BUG
     sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.getList();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.getList();
    },
    // 字体变色
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 4) {
        if (row.normal == 0) {
          return {
            color: "#67C23A"
          };
        } else if (row.normal == 1) {
          return {
            color: "#F56C6C"
          };
        }
      }
    },
    // 分页查询
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
      ).then(response => {
        this.tableData = response.data.data.records;
        this.page.total = response.data.data.total;
        this.tableLoading = false;
      });
    },
    // 删除
    rowDel: function(row) {
      var _this = this;
      this.$confirm(
        '是否确认删除属性类型为"' + row.attributeType + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delObj(row);
        })
        .then(() => {
          this.getList(this.page);
          _this.$message({
            showClose: true,
            message: "删除成功",
            type: "success"
          });
        })
        .catch(function() {});
    },
    // 修改
    handleUpdate: function(row, index, done) {
      putObj(row).then(() => {
        this.$message({
          showClose: true,
          message: "修改成功",
          type: "success"
        });
        this.getList(this.page);
        done();
      });
    },
    // 保存
    handleSave: function(row, done, loading) {
      this.tableLoading = true
      addObj(row)
        .then(data => {
          this.tableData.push(Object.assign({}, row));
          this.$message({
            showClose: true,
            message: "添加成功",
            type: "success"
          });
           this.tableLoading = false
          this.getList(this.page);
        })
        .catch(() => {
          this.tableLoading = false
        });
    },
    // 搜索
    searchChange(form) {
      this.searchForm = form
      this.getList(this.page, form)
    }
  }
};
</script>

<style lang="scss" scoped>

</style>

