
<template>
  <!-- 个人预警记录 -->
  <!-- <div class="execution"> -->
    <!-- <basic-container> -->
    <avue-crud
      ref="crud"
      :data="tableData"
      :permission="permissionList"
      :table-loading="tableLoading"
      :option="tableOption"
      :page="page"
      style="margin-bottom:20px;margin-top:-3px"
      @on-load="getList"
      @refresh-change="refreshChange"
    >
     <template slot-scope="scope" slot="menu">
     <el-button icon="el-icon-check" type="text" size="small" @click="rowDel(scope.row)">已处理</el-button>
  </template>
    </avue-crud>
    <!-- </basic-container> -->
  <!-- </div> -->
</template>

<script>
import {
  // addObj,
  delObj,
  fetchList
  // putObj
} from '@/api/icu/nurse/warningRecord'
import { tableOption } from '@/const/crud/icu/nurse/warningRecord'
import { mapGetters } from 'vuex'

export default {
  name: 'warningRecord',
    props: {
    messages: Object
  },
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
    }
  },
    watch: {
    messages: {
      handler(newValue, oldValue) {
        // console.log('监听到了')
       this.searchForm = {
          patientId: newValue.patientId,
        };
        
        this.getList(this.searchForm);
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters(['permissions']),
    permissionList() {
      return {
        delBtn: this.vaildData(this.permissions.icu_task_del, false)
      }
    }
  },
  methods: {
    getList(page, params) {
      this.tableLoading = true
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
          this.tableData = response.data.data.records
          this.page.total = response.data.data.total
          this.tableLoading = false
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    rowDel(row) {
      var _this = this
      this.$confirm('是否确认删除序号为' + row.id +'的预警记录', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          return delObj(row.id)
        })
        .then(data => {
          _this.tableData.splice(row.$index, 1)
          _this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
          this.getList(this.page)
        })
    },

    /**
     * 搜索回调
     */
    searchChange(form) {
      this.searchForm = form
      this.getList(this.page, form)
    },
    /**
     * 刷新回调
     */
    refreshChange() {
      this.getList(this.page)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
