<template>
  <!-- 拍照组件 -->
  <div class="upload">
    <el-upload
      ref="upload"
      class="upload-demo"
      :headers="headers"
      action="/admin/sys-file/upload"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      multiple
      :limit="3"
      :on-exceed="handleExceed"
      :before-upload="beforeAvatarUpload"
      :on-success="handleAvatarSuccess"
    >
      <el-button size="small" type="primary">
        点击上传
        <i class="el-icon-upload el-icon--right"></i>
      </el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
    </el-upload>
  </div>
</template>

<script>
import store from "@/store";
import request from "@/router/axios";
export default {
  name: "photoGraph",
  data() {
    return {
      imgUrl: "",
      headers: {
        Authorization: "Bearer " + store.getters.access_token
      },
      fileName: ""
    };
  },
  props: {
    getImg: {
      type: Function
    }
  },
  methods: {
    handleRemove(file, fileList) {
      // console.log(file, fileList);
    },
    handlePreview(file) {
      // console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    handleAvatarSuccess(res, file) {
      this.imgUrl = URL.createObjectURL(file.raw);
      this.fileName = res.data.fileName;

      if (this.getImg) {
        this.getImg(this.fileName);
      }
    },
    deleteImg() {
      this.imgUrl = "";
      this.fileName = "";
      this.$refs.upload.clearFiles();
    }
  }
};
</script>
<style scoped="scoped" lang="scss">
</style>


