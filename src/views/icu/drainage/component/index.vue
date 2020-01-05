
<template>
  <div class="drainageAdd">
    <el-dialog
      title="新增记录"
      :visible.sync="recordAdd"
      @close="cancel"
      width="80%"
      style="margin-top: -50px"
      :fullscreen="isFullscreen"
    >
      <div class="tableWidth">
        <table class="table">
          <thead>
            <tr>
              <th>管路/患者</th>
              <th>引流液名称</th>
              <th style="width:110px">引流液属性</th>
              <th style="width:220px">属性详情</th>
              <th style="min-width:240px">建议措施</th>
              <th style="min-width:240px">实际措施</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="width:135px">
                <div class="auto">
                  <div
                    v-for="(items) in pipeData"
                    :key="items.id"
                    @click="pipeClick(items,items.id)"
                    :class="['itemsDiv',( pipeId== items.id?'el-button--primary':'')]"
                  >{{items.pipingName}}/{{items.patientName}}</div>
                </div>
              </td>
              <td style="width:110px">
                <div>{{liquidName}}</div>
                <span v-if="liquidNameIf">请选择管路/患者</span>
              </td>
              <td style="width:110px">
                <div class="type">
                  <div style="position: absolute;left:0;">
                    <div
                      v-for="(items) in liquidAttribute"
                      :key="items"
                      :class="['AttributeDiv',(liquidAttribute.length == 1?'AttributeDiv2':'')]"
                    >{{items}}</div>
                  </div>
                  <div style="position: absolute;right:0; width:220px;">
                    <div class="liquidType">
                      <div class="smell" v-for="(items) in liquidType" :key="items.id">
                        <div
                          v-for="(items1,index) in items"
                          :key="items1.id"
                          @click="liquidTypeClick(items1,items1.id,index,items)"
                          :class="['liquidTypeDiv',(items1.flag==true?'el-button--primary':''),(items1.normal==1?'abnormal':'')]"
                          :id="items1.id"
                        >{{items1.attributeType}}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              <td></td>
              <td >
                <div class="auto1" v-html="measures"></div>
              </td>
              <td>
                <textarea
                  type="textarea"
                  v-model="form.measures"
                  style="resize:none; border:0;padding:10px;width:90%;height:300px"
                ></textarea>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <el-form ref="form" :model="form" label-width="80px" style="margin:20px">
        <div class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row">
          <el-form-item label="引流液值">
            <el-input type="input" v-model="form.value" placeholder="请输入引流液值"></el-input>
          </el-form-item>
        </div>
        <div class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row">
          <el-form-item label="属性状态">
            <el-radio-group v-model="form.resource">
              <el-radio label="0">正 常</el-radio>
              <el-radio label="1">异 常</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirm">保 存</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addObj, pipe, liquid, dictionary } from "@/api/icu/drainage/recorder";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      isFullscreen: false,
      screenWidth: document.body.clientWidth, // 屏幕尺寸
      recordAdd: false,
      measuresType: "",
      nameType: "",
      // 患者
      pipingRow: "",
      // 措施
      measures: "",
      measures1: [],
      liquidNameIf: true,
      pipeId: "",
      form: {
        value: "",
        resource: "",
        measures: ""
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      // 管路
      pipeData: [],
      liquidData: {},
      // 引流液名称
      liquidName: "",
      // 引流液属性
      liquidAttribute: [],
      // 属性详情
      liquidType: "",
      drainageAttribute: ""
    };
  },
  created() {
    // 调用字典查询
    this.dictionaryData();
  },
  mounted() {
    // 小屏幕全屏
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
  },
  methods: {
    // 字典
    dictionaryData() {
      dictionary().then(response => {
        this.drainageAttribute = response.data.data;
      });
    },
    postPipe() {
      this.pipeData = [];
      this.liquidName = "";
      this.liquidAttribute = [];
      this.liquidType = [];
      this.form.value = "";
      this.form.resource = "";
      this.form.measures = "";
      pipe().then(response => {
        this.pipeData = response.data.data;
      });
    },
    // 患者页面管路中引流液
    drainage(val) {
      this.liquidName = "";
      this.liquidAttribute = [];
      this.liquidType = [];
      this.form.value = "";
      this.form.resource = "";
      this.form.measures = "";
      this.pipeData = [];
      this.pipeData.push({
        patientName: val.patientName,
        pipingName: val.pipingName,
        id: val.id,
        pipingId: val.pipingId
      });
    },
    // 患者
    pipeClick(row, id) {
      this.measures = "";
      this.measuresType = "";
      this.measures1 = [];
      this.pipingRow = row;
      this.pipeId = row.id;
      var pipingId = row.pipingId;
      this.liquidData = "";
      this.liquidName = "";
      this.liquidNameIf = true;
      this.liquidAttribute = "";
      this.liquidType = "";
      // 请求
      liquid(pipingId).then(response => {
        this.liquidData = response.data.data;
        this.liquidName = this.liquidData.piping.drainageName;
        // this.liquidName = Object.values(this.liquidData)
        // console.log(this.liquidName)
        if (this.liquidData == null) {
          this.liquidNameIf = true;
        } else {
          this.liquidNameIf = false;
        }
        // 页面引流液属性渲染
        this.liquidAttribute = Object.keys(this.liquidData.attributeType);
        for (const i in this.liquidAttribute) {
          for (const j in this.drainageAttribute) {
            if (this.liquidAttribute[i] == this.drainageAttribute[j].value) {
              this.liquidAttribute[i] = this.drainageAttribute[j].label;
            }
          }
        }
        // 页面引流液属性详情渲染
        this.liquidType = Object.values(this.liquidData.attributeType);
      });
    },
    // 属性点击事件
    liquidTypeClick(row, id, index, items) {
      // 建议措施拼接
      // 查找方法，获取index
      function findIndex(l, o) {
        var objStr = JSON.stringify(o);
        return l.reduce((index, ele, i) => {
          if (JSON.stringify(ele) === objStr) {
            return i;
          } else {
            return index;
          }
        }, -1);
      }
      // 查找是否存在相同attributeName的对象
      var data = this.measures1.filter(function(item) {
        return item.attributeName == row.attributeName;
      });
      // 查找存在想同attributeName的对象的index
      var index2 = findIndex(this.measures1, data[0]);
      // 对象重新赋值
      this.measures = "";
      this.nameType = "";
      this.measuresType = "";
      //新增数组 判断数组长度
      if (this.measures1.length == 0) {
        this.measures1.push(row);
      } else {
        // 循环数组
        for (var i in this.measures1) {
          // 判断数组中是否存在 row.attributeName
          if (
            this.measures1.find(item => {
              return item.attributeName == row.attributeName;
            })
          ) {
            // 判断替换还是删除
            if (data[0].id == id) {
              this.measures1.splice(index2, 1);
              row.flag = false;
            } else {
              this.measures1.splice(index2, 1, row);
            }
          } else if (
            this.measures1.find(item => {
              return item.attributeName != row.attributeName;
            })
          ) {
            // console.log(this.measures1[i].attributeName);
            this.measures1.push(row);
            break;
          }
        }
      }

      // 循环数组,添加给 measures ,页面渲染measures
      for (var i in this.measures1) {
        if (this.measures1[i].measures == null) {
          this.measures1[i].measures = "无";
        }
        // if (row.measures == null) {
        //   alert("该患者暂无建议措施");
        // } else {
        this.measures +=
          this.liquidAttribute[i] +
          "&nbsp;" +
          "(" +
          this.measures1[i].attributeType +
          ")" +
          ":" +
          "&nbsp;&nbsp;" +
          this.measures1[i].measures +
          "," +
          "<br>";
        // }
        this.measuresType +=
          this.liquidAttribute[i] +
          "(" +
          this.measures1[i].attributeType +
          ")" +
          ":" +
          this.measures1[i].measures +
          ",";
        this.nameType +=
          this.liquidAttribute[i] + ":" + this.measures1[i].attributeType;
      }
      //点击后高亮显示
      // 查找是否存在相同id的对象
      var highlighted = this.measures1.filter(function(item) {
        return item.id == row.id;
      });
      var indexI = findIndex(items, highlighted[0]);
      // 遍历数组，添加标识 判断
      for (var i in items) {
        items[i].flag = false;
        if (indexI != -1) {
          items[indexI].flag = true;
        }
      }
    },
    // 弹出框取消
    cancel() {
      this.recordAdd = false;
      this.measures = "";
      this.pipeId = "";
    },
    // 弹出框确定
    confirm(row, done, loading) {
      this.$emit("confirm");
    }
  }
};
</script>
<style lang="scss" scoped>
.drainageAdd {
  .devBtn {
    background: #409eff !important;
    color: #fff !important;
  }
  .liquidTypeDiv,
  .AttributeDiv,
  .itemsDiv,
  .smell {
    border-bottom: 1px solid #cdcdcd;
    vertical-align: middle;
    text-align: center;
  }
  .liquidTypeDiv {
    float: right;
    width: 97%;
    cursor: pointer;
    padding: 0 0 0 5px;
  }
  // .liquidType {
  //   width: 50%;
  //   position: absolute;
  //   right:0;
  // }
  .AttributeDiv {
    width: 110px;
    line-height: 168.5px;
  }
  .AttributeDiv2{
    border-bottom: 1px solid #ddd !important;
  }
  .AttributeDiv:last-child
// .itemsDiv:last-child,
// #smell:last-child
  {
    border-bottom: 0;
  }
  .tableWidth {
    width: 95%;
    margin: 0 auto;
    padding: 5px;
    overflow-x: auto;
  }
  .table {
    min-width: 1070px;
  }
  .table th {
    background-color: #fafafa;
  }
  th,
  td {
    border: 1px solid #cdcdcd;
    vertical-align: middle;
    text-align: center;
    line-height: 45px;
    padding: 0px;
  }
  .color {
    background-color: #409eff;
    color: #fff;
  }
  .abnormal {
    color: rgb(172, 64, 64);
  }
  // 滚动条
  .auto {
    height: 335px;
    overflow-y: auto;
  }
  .auto1 {
    height: 335px;
    overflow-y: auto;
    text-align: left;
    padding: 0 0 0 10px;
  }
  .type {
    position: relative;
    height: 335px;
    width: 301.5%;
    overflow-y: scroll;
    // position: relative;
  }
  .smell {
    height: 167.5px;
    overflow-y: auto;
    overflow-x: 0;
    margin: 0;
  }
  // 滚动条样式

  .type::-webkit-scrollbar-track-piece,
  .smell::-webkit-scrollbar-track-piece,
  textarea::-webkit-scrollbar-track-piece,
  .auto::-webkit-scrollbar-track-piece,
  .auto1::-webkit-scrollbar-track-piece {
    //滚动条凹槽的颜色，还可以设置边框属性
    background-color: #f8f8f8;
  }
  .type::-webkit-scrollbar,
  .smell::-webkit-scrollbar,
  textarea::-webkit-scrollbar,
  .auto::-webkit-scrollbar,
  .auto1::-webkit-scrollbar {
    //滚动条的宽度
    width: 3px;
  }
  .type::-webkit-scrollbar-thumb,
  .smell::-webkit-scrollbar-thumb,
  textarea::-webkit-scrollbar-thumb,
  .auto::-webkit-scrollbar-thumb,
  .auto1::-webkit-scrollbar-thumb {
    //滚动条的设置
    border-radius: 8px;
    background-color: #ccc;
    background-clip: padding-box;
  }
  .type::-webkit-scrollbar-thumb:hover,
  .smell::-webkit-scrollbar-thumb:hover,
  textarea::-webkit-scrollbar-thumb:hover,
  .auto::-webkit-scrollbar-thumb:hover,
  .auto1::-webkit-scrollbar-thumb:hover {
    background-color: #606266;
  }
}
</style>
