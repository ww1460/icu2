<template>
   <!-- 管道护理 -->
   <div class="pipelineNursing">
      <el-form ref="slippage" :model="slippage" :rules="rules" label-width="120px">
         <el-form-item label="防范措施：" prop="preventives">
            <el-checkbox-group v-model="slippage.preventives">
               <el-checkbox
                  v-for="state in preventive"
                  :key="state.value"
                  :label="state.value"
                  style="word-wrap:break-word;display:block"
                  :disabled="!viewflag"
               >{{state.label}}</el-checkbox>
            </el-checkbox-group>
         </el-form-item>
         <el-form-item label="效果评价：" prop="nursingOutcomes">
            <div>
               <span style="width:100px;display: inline-block;">护理结果：</span>
               <el-radio-group v-model="slippage.nursingOutcomes" @change="control()">
                  <el-radio :label="0" :disabled="!viewflag">未脱管</el-radio>
                  <el-radio :label="1" :disabled="!viewflag">脱管</el-radio>
               </el-radio-group>
            </div>
            <div>
               <span style="width:100px;display: inline-block;">脱管原因：</span>
               <el-radio-group v-model="slippage.causesOfDetachment" @change="controls()">
                  <el-radio
                     v-for="state in causesOf"
                     :key="state.value"
                     :label="state.value"
                     style="display:flex;margin:10px 0px"
                     :disabled="!viewflag"
                  >{{state.label}}</el-radio>
               </el-radio-group>
            </div>
            <div>
               <span style="width:100px;display: inline-block;">脱管后处理：</span>
               <el-radio-group v-model="slippage.handle">
                  <el-radio :label="0" :disabled="!viewflag">未重置管</el-radio>
                  <el-radio :label="1" :disabled="!viewflag">重新置管</el-radio>
               </el-radio-group>
            </div>
            <div>
               <span style="width:100px;display: inline-block;">患者动态：</span>
               <el-radio-group v-model="slippage.patientDynamics">
                  <el-radio
                     v-for="state in departure"
                     :key="state.value"
                     :label="state.value"
                     :disabled="!viewflag"
                  >{{state.label}}</el-radio>
               </el-radio-group>
            </div>
         </el-form-item>
      </el-form>
      <div style="text-align:right">
         <el-button
            type="primary"
            @click="slippageSure('slippage')"
            :loading="tableLoading"
            v-if="viewflag"
         >保 存</el-button>
         <el-button @click="slippageClose('slippage')">取 消</el-button>
      </div>
   </div>
</template>

<script>
import {
   pipelineNursing,
   addSlippage,
   uexDic
} from "@/api/icu/patient/pipelineStatus";

export default {
   name: "pipelineNursing",
   props: {
      messages: Object,
      slippMessages: Object
   },
   watch: {
      slippMessages: {
         handler(newValue, oldValue) {
            if (this.slippMessages) {
               this.backGetList();
            }
         }
      }
   },
   data() {
      return {
         preventive: [],
         causesOf: [],
         departure: [],
         slippage: {
            preventives: [],
            pipingStartTime: "",
            pipUseRecordId: "",
            cannulaNarseId: "",
            patientId: "",
            preventiveMeasures: "",
            nursingOutcomes: "",
            causesOfDetachment: "",
            patientDynamics: "",
            handle: ""
         },
         tableLoading: false,
         viewflag: true,
         rules: {
            preventives: [
               {
                  type: "array",
                  required: true,
                  message: "请至少选择一个防范措施",
                  trigger: "change"
               }
            ],
            nursingOutcomes: [
               { required: true, message: "请选择效果评价", trigger: "change" }
            ]
         }
      };
   },
   mounted() {
      this.dicData();
      if (this.slippMessages) {
         this.backGetList();
      } else {
         this.getList();
      }
   },
   methods: {
      dicData() {
         uexDic("piping_causes_of_slippage").then(res => {
            res.data.data.forEach(item => {
               this.causesOf.push(
                  Object.assign({
                     label: item.label,
                     value: Number(item.value)
                  })
               );
            });
         });
         uexDic("icu_departure").then(res => {
            res.data.data.forEach(item => {
               this.departure.push(
                  Object.assign({
                     label: item.label,
                     value: Number(item.value)
                  })
               );
            });
         });
         uexDic("piping_preventive_measures").then(res => {
            res.data.data.forEach(item => {
               this.preventive.push(
                  Object.assign({
                     label: item.label,
                     value: item.value
                  })
               );
            });
         });
      },
      getList() {
         this.slippage.pipingStartTime = this.messages.pipingStartTime;
         this.slippage.pipUseRecordId = this.messages.pipUseRecordId;
         this.slippage.cannulaNarseId = this.messages.cannulaNarseId;
         this.slippage.patientId = this.messages.patientId;
      },
      // 数据回填
      backGetList() {
         this.slippage = this.slippMessages;
         this.viewflag = this.slippMessages.viewflag;
         if (this.slippMessages.preventiveMeasures) {
            this.slippage.preventives = this.slippMessages.preventiveMeasures.split(
               ","
            );
         }
      },
      control() {
         if (this.slippage.nursingOutcomes == 0) {
            this.slippage.causesOfDetachment = "";
         }
      },
      controls() {
         if (this.slippage.causesOfDetachment) {
            this.slippage.nursingOutcomes = 1;
         }
      },
      slippageClose(formName) {
         this.$refs[formName].resetFields();
         this.slippage.preventiveMeasures = ""
         this.slippage.nursingOutcomes = ""
         this.slippage.causesOfDetachment = ""
         this.slippage.patientDynamics = ""
         this.slippage.handle = ""
         this.slippage.preventives = []
         this.tableLoading = false;
         this.$parent.$parent.slippageCloses();
      },

      slippageSure(formName) {
         this.slippage.preventiveMeasures = this.slippage.preventives.join(",");
         // console.log(this.slippage);
         this.tableLoading = true;
         this.$refs[formName].validate(valid => {
            if (valid) {
               addSlippage(this.slippage)
                  .then(() => {
                     this.$message({
                        showClose: true,
                        message: "提交成功",
                        type: "success"
                     });
                     this.slippageClose("slippage");
                  })
                  .catch(() => {});
            } else {
               this.tableLoading = false;
            }
         });
      }
   }
};
</script>
<style  lang="scss">
</style>


