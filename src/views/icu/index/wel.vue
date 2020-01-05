<template>
  <div>
    <!-- <basic-container> -->
      <div class="indexCon clearfix">
         <div class="indexNurse">
            <div class="nursePhoto">
                <img src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png" alt="">
                  <div class="nurseName">
                    <span>姓名: </span> <span>小丽</span>
                  </div>
                  <div class="department">
                    <span>科室: </span> <span>急诊科</span>
                  </div>
            </div>
            <div class="nurseInfo">
               <span> 护 士</span><br>
               <span> 内 科</span><br>
               <span> 枣 庄 市 立 医 院</span>
            </div>
            <div class="nurseTags">
              <el-tag
  :key="tag"
  v-for="tag in dynamicTags"
  closable
  :disable-transitions="false"
  @close="handleClose(tag)">
  {{tag}}
</el-tag>
<el-input
  class="input-new-tag"
  v-if="inputVisible"
  v-model="inputValue"
  ref="saveTagInput"
  size="small"
  @keyup.enter.native="handleInputConfirm"
  @blur="handleInputConfirm"
>
</el-input>
<el-button v-else class="button-new-tag" size="small" @click="showInput">+</el-button>

            </div>
         </div>
         <div class="indexContent">
           <div class="nurseTabs">
             <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="用户管理" name="first">123456</el-tab-pane>
                <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
                <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
                <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
              </el-tabs>
           </div>
         </div>
      </div>
     
    <!-- </basic-container> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Wel',
  data() {
    return {
      activeNames: ['1', '2', '3', '4'],
      DATA: [],
      text: '',
      actor: '',
      count: 0,
      isText: false,

      //标签tags
       dynamicTags: ['标签一', '标签二', '标签三'],
        inputVisible: false,
        inputValue: '',

      // 标签页Tabs
       activeName: 'second'
    }
  },
  computed: {
    ...mapGetters(['website'])
  },
  methods: {
    getData() {
      if (this.count < this.DATA.length - 1) {
        this.count++
      } else {
        this.count = 0
      }
      this.isText = true
      this.actor = this.DATA[this.count]
    },
    setData() {
      let num = 0
      let count = 0
      let active = false
      const timeoutstart = 5000
      const timeoutend = 1000
      const timespeed = 10
      setInterval(() => {
        if (this.isText) {
          if (count == this.actor.length) {
            active = true
          } else {
            active = false
          }
          if (active) {
            num--
            this.text = this.actor.substr(0, num)
            if (num == 0) {
              this.isText = false
              setTimeout(() => {
                count = 0
                this.getData()
              }, timeoutend)
            }
          } else {
            num++
            this.text = this.actor.substr(0, num)
            if (num == this.actor.length) {
              this.isText = false
              setTimeout(() => {
                this.isText = true
                count = this.actor.length
              }, timeoutstart)
            }
          }
        }
      }, timespeed)
    },
    // 标签
     handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      },

      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.dynamicTags.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },

      // 标签页tabs
      handleClick(tab, event) {
      }
  }
}
</script>

<style scoped="scoped" lang="scss">
  .wel-contailer {
    position: relative;
  }

  .banner-text {
    position: relative;
    padding: 0 20px;
    font-size: 20px;
    text-align: center;
    color: #333;
  }

  .banner-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.8;
    display: none;
  }

  .actor {
    height: 250px;
    overflow: hidden;
    font-size: 18px;
    color: #333;
  }

  .actor:after {
    content: '';
    width: 3px;
    height: 25px;
    vertical-align: -5px;
    margin-left: 5px;
    background-color: #333;
    display: inline-block;
    animation: blink 0.4s infinite alternate;
  }

  .typeing:after {
    animation: none;
  }

//  .el-card__body{
//    background-color: #f0f2f5 !important;
//  }
// .basic-container{
//    background-color: #f0f2f5 !important;
//  }
.avue-view{
  padding: 20px;
}
 .indexCon{
  //  width: 100%;
   background-color: #f0f2f5 !important;
 }
.indexNurse{
    width: 26%;
    float: left;
    background-color:#fff;
    padding-left: 1%;
    padding-right: 1%;
    margin-left: 1%;
    margin-top: 5px;
}
 .indexContent{
    width: 68%;
    float: left;
    background-color:#fff;
    padding-left: 1%;
    padding-right: 1%;
    margin-left: 1%;
    margin-top: 5px;

}
  
  @media screen and (max-width: 1024px) {
.indexNurse{
  width: 100%;

}
  .indexContent{
    width: 100%;

}
  }
.clearfix:after{
  content: '';
  clear: both;
  display: block;
}
.nursePhoto{
  text-align: center;
  background-color: #fff;
  padding-top: 24px;
}
.nursePhoto>div{
  margin-bottom: 10px;
  font-size: 16px;
}
.nursePhoto>img{
  width: 30%;
  margin-bottom: 10px;
}
.nurseTags{
  margin-top: 24px;
  padding-top: 24px;
  border-top: #eee dashed 1px;
}
</style>
