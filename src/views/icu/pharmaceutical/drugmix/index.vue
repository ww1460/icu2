
<template>
  <basic-container>
    <div class="execution_mix">
      <el-button type="primary" icon="el-icon-plus" size="small" @click="outerAdd">新增</el-button>
      <table class="occupation" style="margin-top:20px;">
        <thead class="drug">
          <tr>
            <th>序号</th>
            <th>易混淆的类别</th>
            <th>混淆药品说明</th>
            <th>药品适应症</th>
            <th>药品名称</th>
            <th>药品图片</th>
            <th>药品规格</th>
            <th>药品分级</th>
            <th>药品类别</th>
            <th colspan="2">操作</th>
          </tr>
        </thead>

        <tbody v-for="(item,index) in tableData" :key="index">
          <tr>
            <td :rowspan="item.easilyConfusedParticulars.length + 2">{{index + 1}}</td>
            <td :rowspan="item.easilyConfusedParticulars.length + 2">{{item.drugConfusedType}}</td>
            <td :rowspan="item.easilyConfusedParticulars.length + 2">{{item.drugExplain}}</td>
          </tr>
          <tr
            v-if="item.easilyConfusedParticulars.length != 0"
            v-for="(i,index1) in item.easilyConfusedParticulars"
            :key="index1"
          >
            <td>{{i.drugIndications}}</td>
            <td>{{i.drugName}}</td>
            <td class="img" @click="ImgClick(i)">
              <img
                align="left"
                style="vertical-align:top"
                :id="i.easilyConfusedParticularId"
                :src="i.drugPicture"
                alt
              />
            </td>
            <td>{{i.drugSpecification}}</td>
            <td>{{i.drugTaboo}}</td>
            <td>{{i.drugType}}</td>
            <td>
              <el-button icon="el-icon-edit" type="text" size="mini" @click="singleEdit(1,i)">编辑</el-button>
              <el-button icon="el-icon-delete" type="text" size="mini" @click="singleDel(i)">删除</el-button>
            </td>
            <td v-if="index1 == 0" :rowspan="item.easilyConfusedParticulars.length + 1">
              <el-button icon="el-icon-view" type="text" size="mini" @click="viewClick(2,item)">查看</el-button>
              <el-button icon="el-icon-plus" type="text" size="mini" @click="addClick(3,item)">新增</el-button>
              <el-button icon="el-icon-delete" type="text" size="mini" @click="delClick(item)">删除</el-button>
            </td>
          </tr>

          <tr v-if="item.easilyConfusedParticulars.length == 0">
            <td>暂无数据</td>
            <td class="img">暂无数据</td>
            <td>暂无数据</td>
            <td>暂无数据</td>
            <td>暂无数据</td>
            <td>暂无数据</td>
            <td>
              <el-button icon="el-icon-edit" type="text" size="mini" disabled>编辑</el-button>
              <el-button icon="el-icon-delete" type="text" size="mini" disabled>删除</el-button>
            </td>
            <td>
              <el-button icon="el-icon-view" type="text" size="mini" @click="viewClick(2,item)">查看</el-button>
              <el-button icon="el-icon-plus" type="text" size="mini" @click="addClick(3,item)">新增</el-button>
              <el-button icon="el-icon-delete" type="text" size="mini" @click="delClick(item)">删除</el-button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="tableData.length == 0" class="el-table__empty-block" style="border">
        <span class="el-table__empty-text">
          <div class="avue-crud__empty">
            <div class="avue-empty">
              <div class="avue-empty__image" style="height: 50px;">
                <img
                  src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAxKSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgIDxlbGxpcHNlIGZpbGw9IiNGNUY1RjUiIGN4PSIzMiIgY3k9IjMzIiByeD0iMzIiIHJ5PSI3Ii8+CiAgICA8ZyBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0iI0Q5RDlEOSI+CiAgICAgIDxwYXRoIGQ9Ik01NSAxMi43Nkw0NC44NTQgMS4yNThDNDQuMzY3LjQ3NCA0My42NTYgMCA0Mi45MDcgMEgyMS4wOTNjLS43NDkgMC0xLjQ2LjQ3NC0xLjk0NyAxLjI1N0w5IDEyLjc2MVYyMmg0NnYtOS4yNHoiLz4KICAgICAgPHBhdGggZD0iTTQxLjYxMyAxNS45MzFjMC0xLjYwNS45OTQtMi45MyAyLjIyNy0yLjkzMUg1NXYxOC4xMzdDNTUgMzMuMjYgNTMuNjggMzUgNTIuMDUgMzVoLTQwLjFDMTAuMzIgMzUgOSAzMy4yNTkgOSAzMS4xMzdWMTNoMTEuMTZjMS4yMzMgMCAyLjIyNyAxLjMyMyAyLjIyNyAyLjkyOHYuMDIyYzAgMS42MDUgMS4wMDUgMi45MDEgMi4yMzcgMi45MDFoMTQuNzUyYzEuMjMyIDAgMi4yMzctMS4zMDggMi4yMzctMi45MTN2LS4wMDd6IiBmaWxsPSIjRkFGQUZBIi8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K"
                  alt
                />
              </div>
              <p class="avue-empty__desc">暂无数据</p>
            </div>
          </div>
        </span>
      </div>

      <div class="block">
        <el-pagination
          background
          style="margin-top: 15px;text-align: right;margin-bottom: 10px;"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.total"
        ></el-pagination>
      </div>

      <!-- 最外层新增 -->

      <el-dialog
        title="混淆药物新增"
        :visible.sync="dialogFormVisible_add"
        :fullscreen="isFullscreen"
        @close="closeDilog('form_add')"
      >
        <el-form :model="form_add" ref="form_add" :rules="rules1" :label-width="'120px'">
          <el-row>
            <el-col
              class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            >
              <el-form-item label="	易混淆的类别" prop="drugConfusedType">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  v-model="form_add.drugConfusedType"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col
              class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            >
              <el-form-item label="混淆药品说明" prop="drugExplain">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  v-model="form_add.drugExplain"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>``
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" :loading="outLoading" @click="outerSub('form_add')">保 存</el-button>
          <el-button @click="resetForm('form_add')">取 消</el-button>
        </div>
      </el-dialog>

      <!-- 点击查看 -->
      <el-dialog class="dialog_table" title="混淆药品" :visible.sync="dialogTableVisible">
        <table class="occupation_table">
          <tbody>
            <tr v-for="(item) in itemList" :key="item.id + 1">
              <th>药品不良反应</th>
              <td v-for="i in item.easilyConfusedParticulars" :key="i.id">{{i.adverseReaction}}</td>
            </tr>
            <tr v-for="(item1) in itemList" :key="item1.id + 11">
              <th>药品适应症</th>
              <td v-for="i in item1.easilyConfusedParticulars" :key="i.id">{{i.drugIndications}}</td>
            </tr>
            <tr v-for="(item2) in itemList" :key="item2.id + 111">
              <th>药品名称</th>
              <td v-for="i in item2.easilyConfusedParticulars" :key="i.id">{{i.drugName}}</td>
            </tr>
            <tr v-for="(item3) in itemList" :key="item3.id + 222">
              <th>药品类型</th>
              <td v-for="i in item3.easilyConfusedParticulars" :key="i.id">{{i.drugType}}</td>
            </tr>
            <tr v-for="(item4) in itemList" :key="item4.id + 333">
              <th>药品规格</th>
              <td v-for="i in item4.easilyConfusedParticulars" :key="i.id">{{i.drugSpecification}}</td>
            </tr>
            <tr v-for="(item5) in itemList" :key="item5.id + 444">
              <th>药品分级</th>
              <td v-for="i in item5.easilyConfusedParticulars" :key="i.id">{{i.drugTaboo}}</td>
            </tr>
            <tr v-for="(item6) in itemList" :key="item6.id + 555">
              <th>药理作用</th>
              <td
                v-for="i in item6.easilyConfusedParticulars"
                :key="i.id"
              >{{i.pharmacologicalAction}}</td>
            </tr>
            <tr v-for="(item7) in itemList" :key="item7.id + 666">
              <th>特殊说明</th>
              <td v-for="i in item7.easilyConfusedParticulars" :key="i.id">{{i.remarks}}</td>
            </tr>
            <tr v-for="(item8) in itemList" :key="item8.id + 777">
              <th>药品图片</th>
              <td class="img" v-for="i in item8.easilyConfusedParticulars" :key="i.id">
                <img
                  align="left"
                  style="vertical-align:top"
                  :id="i.easilyConfusedParticularId + 1"
                  :src="i.img"
                  alt
                />
              </td>
            </tr>
          </tbody>
        </table>
      </el-dialog>
      <!-- 给的单个项目添加 -->
      <el-dialog
        :title="flag == 1?'编辑':flag == 3?'新增':''"
        :visible.sync="dialogFormVisible"
        :fullscreen="isFullscreen"
        @close="closeDilog('form')"
      >
        <el-form :model="form" ref="form" :rules="rules" :label-width="'120px'">
          <el-row>
            <el-col
              class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            >
              <el-form-item label="药品不良反应" prop="adverseReaction">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  v-model="form.adverseReaction"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col
              class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            >
              <el-form-item label="药品适应症" prop="drugIndications">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  v-model="form.drugIndications"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col
              class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            >
              <el-form-item label="药品名称" prop="drugName">
                <el-input v-model="form.drugName"></el-input>
              </el-form-item>
            </el-col>
            <el-col
              class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            >
              <el-form-item label="药品类型" prop="drugType">
                <el-input v-model="form.drugType"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col
              class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            >
              <el-form-item label="药品规格">
                <el-input v-model="form.drugSpecification"></el-input>
              </el-form-item>
            </el-col>
            <el-col
              class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            >
              <el-form-item label="药品分级">
                <el-input v-model="form.drugTaboo"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col
              class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            >
              <el-form-item label="药理作用" prop="pharmacologicalAction">
                <el-input v-model="form.pharmacologicalAction"></el-input>
              </el-form-item>
            </el-col>
            <el-col
              class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            >
              <el-form-item label="特殊说明">
                <el-input v-model="form.remarks"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col
              class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            >
              <el-form-item label="药理图片">
                <photoGraph :getImg="getImg" ref="loadImg"></photoGraph>
              </el-form-item>
            </el-col>
            <el-col
              class="el-col el-col-24 el-col-offset-0 el-col-xs-24 el-col-md-12 avue-form__row"
            >
              <el-form-item label="图片">
                <div style="width:230px;height:120px">
                  <img style="width:100%;height:100%" id="div_img" alt />
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" :loading="btbLoading" @click="singleSubmit('form')">保 存</el-button>
          <el-button @click="resetForm('form')">取 消</el-button>
        </div>
      </el-dialog>

      <!-- 点击图片放大 -->
      <el-dialog :visible.sync="dialogTableVisibleImg" class="dialogImg">
        <div class="Img_div">
          <img align="center" id="dia_img" alt />
        </div>
      </el-dialog>
    </div>
  </basic-container>
</template>

<script>
import {
  addObj,
  delObj,
  fetchList,
  putObj,
  UpdateObj,
  singleObj,
  singleUpdate,
  outerObj
} from "@/api/icu/pharmaceutical/drugmix/drugmix";
import { tableOption } from "@/const/crud/icu/pharmaceutical/drugmix/drugmix";
import photoGraph from "@/views/icu/patient/components/pressureSore/photoGraph";
import { handleImg, handle } from "@/util/util";
import { mapGetters } from "vuex";

export default {
  name: "drugmix",
  components: {
    photoGraph
  },
  data() {
    return {
      isFullscreen: false,
      dialogTableVisibleImg: false,
      form: {
        adverseReaction: "",
        drugIndications: "",
        drugName: "",
        drugPicture: "",
        drugSpecification: "",
        drugTaboo: "",
        drugType: "",
        pharmacologicalAction: "",
        remarks: ""
      },
      dialogFormVisible: false,
      searchForm: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        current: 1, // 当前页数
        pageSize: 5 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption,
      easilyConfusedCatalogId: "",
      flag: "",
      dialogTableVisible: false,
      dialogFormVisible_add: false,
      itemList: [],
      form_add: {
        drugConfusedType: "",
        drugExplain: ""
      },
      rules: {
        adverseReaction: [
          { required: true, message: "请输入药品不良反应", trigger: "blur" }
        ],
        drugIndications: [
          { required: true, message: "请输入药品适应症", trigger: "blur" }
        ],
        drugName: [
          { required: true, message: "请输入药品名称", trigger: "blur" }
        ],
        drugType: [
          { required: true, message: "请输入药品类型", trigger: "blur" }
        ],
        pharmacologicalAction: [
          { required: true, message: "请输入药理作用", trigger: "blur" }
        ]
      },
      rules1: {
        drugConfusedType: [
          { required: true, message: "请输入易混淆的类别", trigger: "blur" }
        ],
        drugExplain: [
          { required: true, message: "请输入混淆药品说明", trigger: "blur" }
        ]
      },
      btbLoading: false,
      outLoading: false
    };
  },
  watch: {
    dialogFormVisible(val) {
      if (val == false) {
        this.$refs.loadImg.deleteImg();
        var img = document.getElementById("div_img");
        if (img) {
          img.src = "";
        }
      }
    }
  },
  computed: {
    ...mapGetters(["permissions", "userInfo"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permissions.icu_nurse_add, false),
        delBtn: this.vaildData(this.permissions.icu_nurse_del, false),
        editBtn: this.vaildData(this.permissions.icu_nurse_edit, false)
      };
    }
  },
  created() {
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
    this.getList();
  },

  methods: {
    //传给子组件的方法
    async getImg(name) {
      var img = document.getElementById("div_img");
      await handle(name, "div_img");
    },
    closeDilog(formName) {
      this.$nextTick(() => {
        this.$refs[formName].resetFields();
      });
    },

    //关闭表单验证
    resetForm(formName) {
      this.$nextTick(() => {
        this.dialogFormVisible = false;
        this.dialogFormVisible_add = false;
        this.$refs[formName].resetFields();
      });
    },
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.page.current = val;
      this.getList();
    },

    //图片点击
    ImgClick(row) {
      var img = document.getElementById("dia_img");
      handle(row.img, "dia_img").then(res => {});
      if (img) {
        img.src = "";
      }
      this.dialogTableVisibleImg = true;
    },
    //外层删除
    delClick(row) {
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          outerObj(row.id).then(res => {
            this.$message({
              showClose: true,
              message: "删除成功",
              type: "success"
            });
            this.getList(this.page);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消提交"
          });
        });
    },

    //外层新增
    outerAdd() {
      this.form_add = {
        drugConfusedType: "",
        drugExplain: ""
      };
      this.dialogFormVisible_add = true;
    },
    //外层提交
    outerSub(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.outLoading = true;
          addObj(this.form_add).then(res => {
            this.$message({
              showClose: true,
              message: "添加成功",
              type: "success"
            });
            this.outLoading = false;
            this.getList();
            this.dialogFormVisible_add = false;
          });
        } else {
          return false;
        }
      });
    },
    //点击查看
    viewClick(flag, row) {
      this.itemList = [];
      this.dialogTableVisible = true;
      for (var i in row.easilyConfusedParticulars) {
        handle(
          row.easilyConfusedParticulars[i].img,
          row.easilyConfusedParticulars[i].easilyConfusedParticularId + 1
        ).then(res => {});
      }
      this.itemList.push(row);
    },
    //单行删除
    singleDel(row) {
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delObj(row.id).then(res => {
            this.$message({
              showClose: true,
              message: "删除成功",
              type: "success"
            });
            this.getList(this.page);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消提交"
          });
        });
    },

    //单项新增
    addClick(flag, row) {
      this.flag = flag;
      this.form = {
        adverseReaction: "",
        drugIndications: "",
        drugName: "",
        drugPicture: "",
        drugSpecification: "",
        drugTaboo: "",
        drugType: "",
        pharmacologicalAction: "",
        remarks: ""
      };
      this.easilyConfusedCatalogId = row.easilyConfusedCatalogId;
      this.dialogFormVisible = true;
    },
    //单行编辑
    async singleEdit(flag, row) {
      try {
        this.flag = flag;
        this.form = JSON.parse(JSON.stringify(row));

        var img = document.getElementById("dia_img");
        await handle(row.img, "div_img");
        if (img) {
          img.src = "";
        }
      } catch (error) {}

      this.dialogFormVisible = true;
    },
    singleSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.btbLoading = true;
          this.form.easilyConfusedCatalogId = this.easilyConfusedCatalogId;
          this.form.drugPicture = "";
          if (this.flag == 1) {
            this.form.drugPicture = this.$refs.loadImg.fileName;
            singleUpdate(this.form).then(res => {
              this.$message({
                showClose: true,
                message: "修改成功",
                type: "success"
              });
              this.btbLoading = false;
              this.dialogFormVisible = false;
              this.getList();
              this.$refs.loadImg.deleteImg();
            });
          }
          if (this.flag == 3) {
            this.form.drugPicture = this.$refs.loadImg.fileName;
            singleObj(this.form).then(res => {
              this.$message({
                showClose: true,
                message: "新增成功",
                type: "success"
              });
              this.btbLoading = false;
              this.dialogFormVisible = false;
              this.getList();
              this.$refs.loadImg.deleteImg();
            });
          }
        } else {
          this.btbLoading = false;
          return false;
        }
      });
    },

    handleCreate(row, index, done, loading) {
      putObj(row.nurseId)
        .then(data => {
          this.$refs.crud.rowView(data.data.data, index);
          done();
        })
        .catch(() => {});
    },

    getList(page, params) {
      this.tableLoading = true;
      fetchList(
        Object.assign(
          {
            current: this.page.current,
            size: this.page.pageSize
          },
          params,
          this.searchForm
        )
      )
        .then(response => {
          this.tableData = response.data.data.records;
          this.page.total = response.data.data.total;
          this.tableLoading = false;
          for (var i in this.tableData) {
            for (var k in this.tableData[i].easilyConfusedParticulars) {
              this.tableData[i].easilyConfusedParticulars[
                k
              ].img = this.tableData[i].easilyConfusedParticulars[
                k
              ].drugPicture;
              handle(
                this.tableData[i].easilyConfusedParticulars[k].drugPicture,
                this.tableData[i].easilyConfusedParticulars[k]
                  .easilyConfusedParticularId
              ).then(res => {});
            }
          }
        })
        .catch(() => {
          this.tableLoading = false;
        });
    }
  }
};
</script>

<style lang="scss">
.dialogImg {
  .el-dialog__body {
    width: 100%;
    padding: 30px 0px;
    text-align: center;
    .Img_div {
      display: inline-block;
      width: 95%;
      text-align: center;

      img {
        width: 100%;
        height: 100%;
        max-height: 500px;
      }
    }
  }
}
.dialog_table {
  .el-dialog {
    width: 60%;
  }
}
.execution_mix {
  .img {
    cursor: pointer;
    width: 15vw;
    height: 10vw;
    img {
      width: 100%;
      height: 100%;
    }
  }
  td {
    padding-left: 0;
  }
  overflow-x: auto !important;
  .occupation {
    width: 100%;
    min-width: 1300px;

    th,
    td {
      border: 1px solid #ebeef5;
      line-height: 45px;
      text-align: center;
      vertical-align: middle;

      p {
        border-bottom: 1px solid #ebeef5;
      }
      p:last-child {
        border: none;
      }
    }
    th:first-child {
      width: 80px;
    }
    th:nth-child(2) {
      width: 120px;
    }
    th:nth-child(3) {
      width: 180px;
    }
    th:nth-child(4) {
      width: 200px;
    }
    th:nth-child(5) {
      width: 140px;
    }
    th:nth-child(6) {
      width: 140px;
    }
    th:nth-child(7) {
      width: 100px;
    }
    th:nth-child(8) {
      width: 100px;
    }
    th:nth-child(9) {
      width: 100px;
    }
    th:last-child {
      width: 280px;
      min-width: 280px;
    }
  }
}
.drug {
  th {
    background: #fafafa !important;
  }
}
.occupation_table {
  width: 100%;
  tr {
    th {
      width: 100px;
    }
    td {
      max-width: 200px;
    }
  }
  td,
  th {
    border: 1px solid #ebeef5;
    line-height: 45px;
    text-align: center;
    vertical-align: middle;
  }
}
</style>
