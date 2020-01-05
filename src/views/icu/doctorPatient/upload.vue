<template>
  <basic-container v-loading="imgListLoading">
    <el-button
      icon="el-icon-plus"
      type="primary"
      size="small"
      style="margin-top:10px;margin-bottom:10px"
      @click="addDialog = true"
    >上传图片</el-button>
    <el-row :gutter="20">
      <el-col  :xs="{span: 6}"
          :sm="{span: 6}"
          :md="{span: 6}"
          :lg=" {span: 4}" v-for="(item, index) in imgData" :key="index">
        <el-card :body-style="{ padding: '0px' }" shadow="always" class="imgCard">
          <img class="image" :id="'img'+`${index}`" />
          <div style="padding: 14px;">
            <span>{{item.title}}</span>
            <div class="bottom clearfix">
              <el-button type="text" class="button" @click="imgDel(item)">删除</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog title="图片上传" :visible.sync="addDialog" width="50%" @close="handleClose">
      <div style="padding-left:10%">
        标题 &nbsp;&nbsp;
        <div>
          <el-input v-model="title" style="width:80%"></el-input>
          <el-upload
            class="upload-demo"
            style="margin-top:10px"
            ref="upload"
            :headers="headers"
            action="/admin/sys-file/upload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-exceed="handleExceed"
            :on-success="handleAvatarSuccess"
            :limit="1"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="imgAddLoading" @click="imgAdd()">保 存</el-button>
        <el-button @click="addDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <div style="width:100%;padding-left:65%">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total"
      ></el-pagination>
    </div>
  </basic-container>
</template>
<script>
import { feachList, addCommunicate, delCommunicate } from '@/api/icu/doctorPatient/upload'
import { handleImg, handle } from "@/util/util";
import store from "@/store";
import request from "@/router/axios";
export default {
  data() {
    return {
      imgUrl: '',
      fileName: "",
      addList: {},
      title: "",
      imgData: [],
      pageSize: 10,
      currentPage: 1,
      total: 0,
      dialogImageUrl: '',
      addDialog: false,
      imgAddLoading: false,
      imgListLoading: false,
      headers: {
        Authorization: "Bearer " + store.getters.access_token
      },
    }
  },
  created() {
  },
  mounted() {
    this.getAll()
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
      this.getAll()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getAll()
    },
    getAll() {
      let params = {
        pageSize: this.pageSize,
        currentPage: this.currentPage
      }
      this.imgListLoading = true
      feachList(params).then(response => {
        this.imgData = response.data.data.records
        this.total = response.data.data.total
        if (this.imgData.length == 0) {
          this.imgListLoading = false
        }
        for (let i in this.imgData) {
          handle(this.imgData[i].titlePicture, 'img' + i).then(res => {
          });
          if (i == this.imgData.length - 1) {
            this.imgListLoading = false
          }
        }
      }).catch(() => {
        this.$message.error('请求失败');
      })
    },
    handleRemove(file) {
    },
    handlePreview(file) {
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleDownload(file) {

    },
    beforeUpload(file) {

    },
    handleAvatarSuccess(res, file) {
      this.imgUrl = URL.createObjectURL(file.raw);
      this.fileName = res.data.fileName;
    },
    imgAdd() {
      if (this.title == "" | this.title == null) {
        this.$message({
          type: 'warning',
          showClose: true,
          message: '请输入标题'
        })
        return
      }
      if (this.fileName == "" || this.fileName == null) {
        this.$message({
          type: "warning",
          showClose: true,
          message: "请上传图片"
        })
        return
      }
      this.addList.title = this.title
      this.addList.titlePicture = this.fileName
      this.imgAddLoading = true
      addCommunicate(this.addList).then(response => {
        this.$message.success("上传成功")
        this.addDialog = false
        this.getAll()
      }).catch(() => {
        this.$message.error('上传失败')
        this.addDialog = false
      })
    },
    imgDel(item) {
      this.$confirm('是否确认删除  ' + item.title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delCommunicate(item.id).then(response => {
          this.$message.success('删除成功')
          this.getAll()
        })
      })
    },
    handleClose() {
      this.imgAddLoading = false
      this.title = ''
      this.fileName = ''
      this.$refs.upload.clearFiles()
    },
    handleExceed(files) {
      this.$message.warning(`单次上传一张图片`);
    },
  },
}
</script>
<style lang="scss" scoped>
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}

.clearfix:after {
  clear: both;
}
.imgCard {
  margin-top: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.imgCard:hover {
    -webkit-box-shadow: 0 15px 30px rgba(0,0,0,.2);
    box-shadow: 0 15px 30px rgba(0,0,0,.2);
    -webkit-transform: translate3d(0,-5px,0);
    transform: translate3d(0,-5px,0);
}
</style>