
<template>
<!-- 预警项目 -->
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
        @row-update="handleUpdate"
        @row-save="handleSave"
        @search-change="searchChange"
        @row-del="rowDel">
        <!-- <template
          slot-scope="scope"
          slot="menu">
          <el-button
            v-if="permissions.sys_dict_add"
            type="text"
            size="mini"
            icon="el-icon-menu"
            @click="handleItem(scope.row,scope.index)">字典项
          </el-button>
        </template> -->
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
import { addItemObj, addObj, delItemObj, delObj, fetchItemList, fetchList, putItemObj, putObj } from '@/api/icu/nurse/earlyProject'
import { tableDictItemOption, tableOption } from '@/const/crud/icu/nurse/earlyProject'
import { mapGetters } from 'vuex'

export default {
  name: 'earlyProject',
  data() {
    return {
      searchForm: {},
      form: {
        type: undefined,
        dictId: undefined
      },
      dictType: undefined,
      dictId: undefined,
      dialogFormVisible: false,
      tableData: [],
      tableDictItemData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption,
      tableDictItemOption: tableDictItemOption
    }
  },
  created() {
   
  },
  mounted: function() {
  },
  computed: {
    ...mapGetters(['permissions']),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permissions.sys_dict_add, false),
        delBtn: this.vaildData(this.permissions.sys_dict_del, false),
        editBtn: this.vaildData(this.permissions.sys_dict_edit, false)
      }
    }
  },
  methods: {
    getList(page, params) {
      this.tableLoading = true
      fetchList(Object.assign({
        current: page.currentPage,
        size: page.pageSize
      }, params, this.searchForm)).then(response => {
        this.tableData = response.data.data.records
        this.page.total = response.data.data.total
        this.tableLoading = false
      })
    },

    getDictItemList(dictId, type) {
      this.dictType = type
      this.dictId = dictId
      this.dialogFormVisible = true
      this.tableLoading = true
      fetchItemList(Object.assign({
        current: this.page.currentPage,
        size: this.page.pageSize
      }, { dictId: dictId })).then(response => {
        this.tableDictItemData = response.data.data.records
        this.tableLoading = false
      })
    },
    handleBeforeOpen(done) {
      this.form.type = this.dictType
      this.form.dictId = this.dictId
      done()
    },
    rowDel: function(row) {
      var _this = this
      this.$confirm('是否确认删除数据类型为"' + row.type + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delObj(row)
      }).then(() => {
        this.getList(this.page)
        _this.$message({
          showClose: true,
          message: '删除成功',
          type: 'success'
        })
      }).catch(function() {
      })
    },
    handleUpdate: function(row, index, done) {
      putObj(row).then(() => {
        this.$message({
          showClose: true,
          message: '修改成功',
          type: 'success'
        })
        this.getList(this.page)
        done()
      })
    },
    handleSave: function(row, done) {
      addObj(row).then(() => {
        this.$message({
          showClose: true,
          message: '添加成功',
          type: 'success'
        })
        this.getList(this.page)
        done()
      })
    },
    handleItemSave: function(row, done) {
      addItemObj(row).then(() => {
        this.$message({
          showClose: true,
          message: '添加成功',
          type: 'success'
        })
        this.getDictItemList(row.dictId, row.type)
        done()
      })
    },
    handleItemUpdate: function(row, index, done) {
      putItemObj(row).then(() => {
        this.$message({
          showClose: true,
          message: '修改成功',
          type: 'success'
        })
        this.getDictItemList(row.dictId, row.type)
        done()
      })
    },
    searchChange(form) {
      cosn
      this.searchForm = form
      this.getList(this.page, form)
    },
    handleItem: function(row) {
      this.getDictItemList(row.id, row.type)
    },
    rowItemDel: function(row) {
      var _this = this
      this.$confirm('是否确认删除数据为"' + row.label + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delItemObj(row.id)
      }).then(() => {
        this.getDictItemList(row.dictId, row.type)
        _this.$message({
          showClose: true,
          message: '删除成功',
          type: 'success'
        })
      }).catch(function() {
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

