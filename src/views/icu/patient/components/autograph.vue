<template>
   <!-- 签名组件 -->
   <div>
      <div class="avueSign">
         <avue-sign ref="sign"></avue-sign>
         <div class="operation">
            <el-button type="primary" @click="handleSubmit">生成</el-button>
            <!-- <el-button type="danger" @click="$refs.sign.getStar('icu重症监护室','青岛百杉','12345678')">图章</el-button> -->
            <el-button @click="$refs.sign.clear()">清空</el-button>
            <el-button @click="close()">返回</el-button>
         </div>
      </div>
   </div>
</template>

<script>
export default {
   name: "autograph",

   data() {
      return {
         img: ""
      };
   },
   created() {},
   methods: {
      handleSubmit() {
         this.img = this.$refs.sign.submit(80, 50);
         this.close();
      },
      close() {
         this.$parent.return(this.img);
      }
   }
};
</script>
<style  lang="scss">
.avueSign {
   margin: 50px 50px;
   .avue-sign__canvas {
      width: 100%;
      height: 400px;
   }
}

.avueSign .operation {
   text-align: center;
   padding: 50px 0;
   background-color: #fff !important;
}
.avueSign .operation button + button {
   margin-left: 30px;
}
</style>


