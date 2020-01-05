
<template>
   <div class="writearticle">
      <avue-form ref="form" :option="option" v-model="form" v-if="!viewFlag">
         <template  slot="picture">
            <div>
               <el-upload
                  :headers="headers"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  class="avatar-uploader"
                  action="/admin/sys-file/upload"
               >
                  <img v-if="form.picture" :src="imageUrl" class="avatar" id="avatar" />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
               </el-upload>
            </div>
         </template>
         <template slot="menuForm">
            <el-button
               @click="handleSubmit"
               size="medium"
               icon="el-icon-check"
               type="primary"
               :loading="loading"
               v-if="form.showFlag"
            >提 交</el-button>
            <el-button
               @click="emptytChange"
               size="medium"
               icon="el-icon-delete"
               v-if="form.showFlag"
            >重 置</el-button>
            <el-button
               @click="save"
               size="medium"
               icon="el-icon-download"
               type="primary"
               :loading="loading"
               v-if="form.showFlag"
            >保 存</el-button>
            <el-button @click="close(1)" size="medium" icon="el-icon-back">返 回</el-button>
         </template>
      </avue-form>
      <avue-article :option="option1" :data="data" v-if="viewFlag">
         <!-- <img  :src="imageUrl" class="avatar" id="avatar1" /> -->
      </avue-article>
      <div style="text-align:center;padding:10px" v-if="viewFlag">
         <el-button @click="close1(1)" size="medium" icon="el-icon-back">返 回</el-button>
      </div>
   </div>
</template>


<script>
import {
   addObj,
   delObj,
   editObj
} from "@/api/icu/articleSummary/personalSummary";
var baseUrl = "https://cli2.avuejs.com/api/area";
import { mapGetters } from "vuex";
import { handleImg, openWindow } from "@/util/util";
import store from '@/store'

export default {
   name: "writearticle",
   props: {
      returnClose: Function,
      rowData: Object,
      dictionary: Array
   },
   data() {
      return {
         headers: {
            Authorization: "Bearer " + store.getters.access_token
         },
         option: {
            emptyBtn: false,
            submitBtn: false,
            column: [
               {
                  type: "input",
                  label: "标题",
                  span: 12,
                  display: true,
                  prop: "title",
                  rules: [
                     {
                        required: true,
                        message: "请填写标题",
                        trigger: "blur"
                     }
                  ]
               },
               {
                  type: "input",
                  label: "关键字",
                  span: 12,
                  display: true,
                  prop: "keyword",
                  rules: [
                     {
                        required: true,
                        message: "请填写关键字",
                        trigger: "blur"
                     }
                  ]
               },
               {
                  type: "select",
                  label: "类型",
                  span: 12,
                  display: true,
                  prop: "category",
                  dicUrl: "/admin/dict/type/category_type",
                  rules: [
                     {
                        required: true,
                        message: "请选择类型",
                        trigger: "blur"
                     }
                  ]
               },
               {
                  formslot: true,
                  label: "封面图片",
                  prop: "picture",
                  // type: "upload",
                  // listType: "picture-img",
                  span: 24,
                  // tip: "只能上传jpg/png用户头像，且不超过500kb",
                  // action: "/admin/sys-file/upload",
                  // propsHttp: {
                  //    res: "data"
                  // },
                  // dataType: "string",
                  // rules: [
                  //    {
                  //       required: true,
                  //       message: "请选择封面图片"
                  //    }
                  // ]
               },
               {
                  type: "ueditor",
                  component: "ueditor",
                  label: "内容",
                  span: 24,
                  display: true,
                  upload: {
                     action: "/admin/sys-file/upload"
                  },
                  prop: "content"
               }
            ]
         },
         form: {
            title: "",
            keyword: "",
            category: "",
            picture: "",
            content: ""
         },
         loading: false,
         option1: {
            props: {
               title: "title",
               meta: "keyword",
               lead: "category",
               body: "content"
            }
         },
         data: {
            title: "",
            meta: "",
            lead: "",
            body: ""
         },
         viewFlag: false,
         imageUrl: ""
      };
   },
   created() {
      this.getList();
   },
   mounted: function() {},
   computed: {
      ...mapGetters(["permissions"]),
      permissionList() {
         return {
            addBtn: this.vaildData(this.permissions.personalSummary_add, false),
            delBtn: this.vaildData(this.permissions.personalSummary_del, false),
            editBtn: this.vaildData(
               this.permissions.personalSummary_edit,
               false
            )
         };
      }
   },
   methods: {
      getList() {
         if (this.rowData.viewFlag) {
            for (var i in this.dictionary) {
               if (this.dictionary[i].value == this.rowData.category) {
                  this.data.lead = `文章类型：${this.dictionary[i].label}${'\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0' } 关键字： ${this.rowData.keyword}`
               }
            }
            // handleImg(this.rowData.picture,'avatar1')
            this.data.title = this.rowData.title;
            // this.data.meta = this.rowData.keyword;
            this.data.body = this.rowData.content;
            this.viewFlag = this.rowData.viewFlag;
         } else {
            this.form = this.rowData;
            this.rowData.viewFlag = false;
            handleImg(this.form.picture, 'avatar')
         }
         // console.log(this.viewFlag);
      },
      handleSubmit(form) {
         this.$refs.form.validate(valid => {
            if (valid) {
               this.loading = true;
               Object.assign(this.form, {
                  publishStatus: 1,
                  delFlag: 0,
                  collectCount: 0
               });
               if (this.rowData.editFlag) {
                  editObj(this.form).then(res => {
                     this.loading = false;
                     this.close(3);
                  });
               } else {
                  addObj(this.form).then(res => {
                     this.loading = false;
                     this.close(3);
                  });
               }
            }
         });
      },
      emptytChange() {
         this.$refs.form.resetForm();
      },
      save() {
         console.log(this.form)
         this.$refs.form.validate(valid => {
            if (valid) {
               this.loading = true;
               Object.assign(this.form, {
                  publishStatus: 0,
                  delFlag: 0,
                  collectCount: 0
               });
               if (this.rowData.editFlag) {
                  editObj(this.form).then(res => {
                     this.loading = false;
                     this.close(2);
                  });
               } else {
                  addObj(this.form).then(res => {
                     this.loading = false;
                     this.close(2);
                  });
               }
            }
         });
      },
      handleAvatarSuccess(res, file) {
         this.imageUrl = URL.createObjectURL(file.raw);
         this.form.picture = res.data.bucketName + '-' + res.data.fileName
      },
      close(num) {
         this.returnClose(Object.assign({ num: num }, this.form));
         this.emptytChange();
      },
      close1(num) {
         this.returnClose({ num: num });
         this.rowData.viewFlag = false;
      }
   }
};
</script>

<style lang="scss">
.avatar-uploader .el-upload {
   border: 1px dashed #d9d9d9;
   border-radius: 6px;
   cursor: pointer;
   position: relative;
   overflow: hidden;
}
.avatar-uploader .el-upload:hover {
   border-color: #409eff;
}
.avatar-uploader-icon {
   font-size: 28px;
   color: #8c939d;
   width: 178px;
   height: 178px;
   line-height: 178px;
   text-align: center;
}
.avatar {
   width: 178px;
   height: 178px;
   display: block;
}
</style>

