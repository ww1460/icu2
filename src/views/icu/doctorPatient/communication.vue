<template>
  <basic-container>
    <div style="padding-top:100px" v-loading="imgListLoading">
      <div class="swiper-container imgDiv" v-loading="swiperLoading">
        <div class="swiper-wrapper" style="width:500px;height:500px">
          <div
            class="swiper-slide"
            v-for="(item,index) in imgData"
            :key="index"
            :id="item.id"
          >
            <img class="image swiper-img" :id="'img'+`${index}`" style="width:500px;height:500px" />
          </div>
        </div>
        <!--  -->
        <!-- <div class="swiper-container swiper-container-thumbs" v-loading="swiperLoading">
          <div class="swiper-wrapper">
            <div
              class="swiper-slide"
              v-for="(item, index) in imgDatas"
              :key="index"
              style="width:100px;height:100px"
              :id="item.id"
            >
              <img class="image swiper-img" :id="'imgs'+`${index}`" style="width:500px;height:500px" />
            </div>
        </div>-->
        <!-- <div class="swiper-container-thumbs"></div> -->
        <!-- 如果需要分页器 -->
        <!-- <div class="swiper-pagination"></div> -->

        <!-- 如果需要导航按钮 -->
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>

        <!-- 如果需要滚动条 -->
        <!-- <div class="swiper-scrollbar"></div> -->
      </div>
      <div style="margin-top:30px;border-top:1px solid #eee">
        <el-row :gutter="20">
          <el-col
            :xs="{span: 6}"
            :sm="{span: 6}"
            :md="{span: 6}"
            :lg=" {span: 4}"
            v-for="(item, index) in imgDatas"
            :key="index"
          >
            <el-card
              :body-style="{ padding: '0px' }"
              shadow="always"
              class="imgCard"
              @click="magnifyClick(item)"
            >
              <img class="images" :id="'imgs'+`${index}`" />
              <div style="padding: 14px;">
                <span>{{item.title}}</span>
                <div class="bottom clearfix">
                  <el-button type="text" class="button" @click="magnifyClick(item)">放大</el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <el-dialog :title="imgTitle" :visible.sync="imgVis" :fullscreen="isFullscreen" width="60%" style="text-align:center">
        <img :id="'imgDia'" style="width:600px;height:600px;margin:auto auto" />
        <span slot="footer" class="dialog-footer">
          <el-button @click="imgVis = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </basic-container>
</template>
<script>
import Swiper from "swiper";
import { getselectAll } from '@/api/icu/doctorPatient/doctorPatientCommunication'
import { handleImg, handle } from "@/util/util";
export default {
  data() {
    return {
      imgTitle: '',
      swiperLoading: false,
      imgVis: false,
      imgData: [],
      imgDatas: [],
      imgListLoading: false,
      isFullscreen: false,
      screenWidth: document.body.clientWidth, // 屏幕尺寸
    }
  },
  created() {
  },
  mounted() {
    const that = this;
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth;
        that.screenWidth = window.screenWidth;
      })();
    };
    if (that.screenWidth <= 1024) {
      this.isFullscreen = true;
    }
    this.getAll()
  },
  methods: {
    // 缩略图点击放大
    magnifyClick(item) {
      this.imgVis = true
      handle(item.titlePicture, 'imgDia').then(res => {
      });
    },
    getAll() {
      this.imgListLoading = true
      this.swiperLoading = true
      getselectAll().then(response => {
        this.imgData = response.data.data
        this.imgDatas = JSON.parse(JSON.stringify(this.imgData))
        if (this.imgData.length == 0) {
          this.imgListLoading = false
        }

        for (let i in this.imgDatas) {
          handle(this.imgDatas[i].titlePicture, 'imgs' + i).then(res => {
          });
          if (i == this.imgDatas.length - 1) {
            this.imgListLoading = false
          }
        }

        for (let i in this.imgData) {
          handle(this.imgData[i].titlePicture, 'img' + i).then(res => {
          });
          // if (i == this.imgData.length - 1) {
          //   this.imgListLoading = false
          // }
        }

      }).then(() => {
        this.$nextTick(() => {
          // var thumbsSwiper = new Swiper('#thumbs', {
          //   spaceBetween: 10,
          //   slidesPerView: 4,
          //   watchSlidesVisibility: true,//防止不可点击
          // })
          var mySwiper = new Swiper('.imgDiv', {
            // thumbs: {
            //   swiper: {
            //     el: '.swiper-container-thumbs', //注意此处的设置方式
            //     // slidesPerView: 5,
            //     watchSlidesVisibility: true,
            //   }
            // },
            effect:"coverflow",
            spaceBetween: 20,
            direction: 'horizontal', // 横向切换选项
            // loop: true, // 循环模式选项   循环模式下 向右循环会出现img路径丢失的问题
            // loopAdditionalSlides : 3,               // 循环模式下路径丢失  目前不知道是什么原因
            autoHeight: true,//高度随着内容变化而变化
            preloadImages: true,//强制加载所有图片
            updateOnImagesReady: true,//当所有的内嵌图像（img标签）加载完成后Swiper会重新初始化。使用此选项需要先开启preloadImages: true
            // centeredSlides: true,
            slidesPerView: 3,
            // 如果需要分页器
            // pagination: {
            //   el: '.swiper-pagination',
            // },
            // 如果需要前进后退按钮
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            },
            // 如果需要滚动条
            // scrollbar: {
            //   el: '.swiper-scrollbar',
            // }
          })
          this.swiperLoading = false
        })
      })
    },

  },
}
</script>
<style lang="scss" scoped>
// .swiper-container {
//     width: 600px;
//     height: 300px;
// }
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  // background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  // background-color: #d3dce6;
}
.image {
  height: 300px;
  // width: 70%;
}
</style>
<style lang="scss" scoped >
// .el-carousel__container {
//   height: 300px!important
// }
.swiper-slide {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
}
.imgCard {
  margin-top: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.imgCard:hover {
  -webkit-box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  -webkit-transform: translate3d(0, -5px, 0);
  transform: translate3d(0, -5px, 0);
}

.images {
  width: 100%;
  display: block;
}
.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}

.clearfix:after {
  clear: both;
}
</style>