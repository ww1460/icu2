<template>
  <!-- 枣庄市立医院ICU护理记录单 -->
  <basic-container>
    <div>
      <div>
        <el-dropdown class="avue-tags__menu">
          <el-button v-model="patInfo.patientId" type="primary" size="mini">
            {{ patInfo.name }} {{patInfo.bedName}}
            <i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu>
            <div class="dropdownMenu">
              <el-button
                v-for="(item,index) in patientNames"
                :title="item.patientName"
                :key="index"
                :class="['el-button--small',(item.patientId == patInfo.patientId?'el-button el-button--primary':'')]"
                @click="patientNameClick(item.name,item.id,item.patientId,item)"
              >{{ item.name }} {{item.bedName}}</el-button>
            </div>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <el-button @click="printContent" type="primary">打印</el-button>
      <el-date-picker
        v-model="dateTime"
        type="datetime"
        format="yyyy-MM-dd"
        @change="dateChange"
        placeholder="选择日期"
        style="width:150px;margin-left:20px;"
      ></el-date-picker>
      <!-- 护理记录单 -->
      <div class="panel panel-default" id="panel">
        <div class="panel-heading clearfix">
          <h3 class="panel-title">枣庄市立医院ICU护理记录单(I)</h3>
          <div class="perinfo">
            <span>科室: &nbsp;{{patInfo.delId|depFl}}</span>&nbsp;
            <span>床位: &nbsp;{{patInfo.bedName}}</span>&nbsp;
            <span>住院号: &nbsp;{{patInfo.hospitalnumber}}</span>&nbsp;
            <span>姓名: &nbsp;{{patInfo.name}}</span>&nbsp;
            <span>性别：&nbsp;{{patInfo.gender| genderFl }}</span>&nbsp;
            <span>年龄：&nbsp;{{patInfo.age}}</span>&nbsp;
            <span>入院日期：&nbsp;{{patInfo.entranceTime | timeFl}}</span>&nbsp;
            <span>诊断: &nbsp;{{patInfo.diagnosis}}</span>&nbsp;
          </div>
        </div>
        <!-- 表格 -->
        <div class="assTable" id="assTable">
          <table
            class="table table-bordered"
            id="basic-table"
            v-loading="tabLoad"
            v-if=" reportData.intakeCountVo!=undefined"
            :data="recordData"
          >
            <!-- v-loading="tabLoad" -->

            <thead>
              <tr>
                <td :colspan="2" class="first">
                  <span class="befor_span">&nbsp;项目</span>
                  <span>\</span>

                  <span class="first_span">时间</span>
                </td>
                <td v-for="i in range" :key="i">{{i}}</td>
                <td>项目</td>
                <td>出入量汇总</td>
                <td>白班</td>
                <td>小夜</td>
                <td>大夜</td>
                <td>总计</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <!-- <td :rowspan="TKList.length+1" id="typeTd">{{projectTypeNameTK|typeFl}}</td> -->
                <td :rowspan="1" style="width:80px;text-align:left;padding-left:15px"> </td>
                  <td>神志</td>
                <td
                  v-if="TKList.C!=undefined"
                  v-for="(i,index2) in TKList.C"
                  :key="index2+'TK'"
                >{{i!=null ? i.projectValue :''}}</td>
                <td v-if="TKList.C==undefined" v-for="(i,index2) in list" :key="index2+'TK'"></td>
                 <td :rowspan="7">
                  入量
                  <!-- class="RLtd" -->
                  <!-- <span class="RLtdSpan">入量</span> -->
                </td>
                <td>晶体</td>
                <!-- &&reportData.intakeCountVo!=undefined
&&reportData.intakeCountVo!=undefined
&&reportData.intakeCountVo!=undefined
&&reportData.intakeCountVo!=undefined
&&reportData.intakeCountVo!=undefined
&&reportData.intakeCountVo!=undefined
&&reportData.intakeCountVo!=undefined
&&reportData.intakeCountVo!=undefined
                &&reportData.intakeCountVo!=undefined-->
                <td
                  v-if="reportData.intakeCountVo!=undefined&&reportData.intakeCountVo.intake.JINGT!=undefined"
                  v-for="(option,index) in  reportData.intakeCountVo.intake.JINGT"
                  :key="index+'09'"
                >{{option}}</td>
                <td
                  v-if="reportData.intakeCountVo!=undefined&&reportData.intakeCountVo.intake.JINGT==undefined"
                  v-for="(i,index) in arr"
                  :key="index+'09'"
                ></td>
              </tr>
              
              <!-- <tr> 
              <td :rowspan="item.child.length+1" id="typeTd">{{item.typeName}}</td>
              </tr>-->
              <tr>
                <!-- <td :rowspan="TKList.length+1" id="typeTd">{{projectTypeNameTK|typeFl}}</td> -->
                <td :rowspan="3" style="width:80px;text-align:left;padding-left:15px">瞳孔</td>
              </tr>
              <tr>
                <td>瞳孔直径</td>
                <td
                  v-if="TKList.TKZJ!=undefined"
                  v-for="(i,index2) in TKList.TKZJ"
                  :key="index2+'TK'"
                >{{i!=null ? i.projectValue :''}}</td>
                <td v-if="TKList.TKZJ==undefined" v-for="(i,index2) in list" :key="index2+'TK'"></td>
                 <td v-if="TKList.TCGFY==undefined" v-for="(i,index2) in list" :key="index2+'TK'"></td>
                <td>胶体</td>
                <td
                  v-if="reportData.intakeCountVo!=undefined&&reportData.intakeCountVo.intake.JIAOT!=undefined"
                  v-for="(option,index) in  reportData.intakeCountVo.intake.JIAOT"
                  :key="index+'09'"
                >{{option}}</td>
                <td
                  v-if="reportData.intakeCountVo!=undefined&&reportData.intakeCountVo.intake.JIAOT==undefined"
                  v-for="(i,index) in arr"
                  :key="index+'09'"
                ></td>
              </tr>
              <tr>
                <td>瞳孔光反应</td>
                <td
                  v-if="TKList.TCGFY!=undefined"
                  v-for="(i,index2) in TKList.TCGFY"
                  :key="index2+'TK'"
                >{{i!=null ? i.projectValue :''}}</td>
                <td>口服鼻饲</td>
                <td
                  v-if="reportData.intakeCountVo!=undefined&&reportData.intakeCountVo.intake.KFBS!=undefined"
                  v-for="(option,index) in  reportData.intakeCountVo.intake.KFBS"
                  :key="index+'09'"
                >{{option}}</td>
                <td
                  v-if="reportData.intakeCountVo!=undefined&&reportData.intakeCountVo.intake.KFBS==undefined"
                  v-for="(i,index) in arr"
                  :key="index+'09'"
                ></td>
              </tr>
              <tr>
                <td :rowspan="12" style="width:80px;text-align:left;padding-left:15px">生命体征</td>
              </tr>
              <tr>
                <td>T℃</td>
                <td
                  v-if="SMTZList.T!=undefined"
                  v-for="(i,index2) in SMTZList.T"
                  :key="index2+'SMTZ'"
                >{{i!=null ? i.projectValue :''}}</td>
                <td v-if="SMTZList.T==undefined" v-for="(i,index2) in list" :key="index2+'SMTZ'"></td>
                <td>其他</td>
                <td
                  v-if="reportData.intakeCountVo!=undefined&&reportData.intakeCountVo.intake.other!=undefined"
                  v-for="(option,index) in  reportData.intakeCountVo.intake.other"
                  :key="index+'09'"
                >{{option}}</td>
                <td
                  v-if="reportData.intakeCountVo!=undefined&&reportData.intakeCountVo.intake.other==undefined"
                  v-for="(i,index) in arr"
                  :key="index+'09'"
                ></td>
              </tr>
              <tr>
                <td>HR</td>
                <td
                  v-if="SMTZList.HR!=undefined"
                  v-for="(i,index2) in SMTZList.HR"
                  :key="index2+'SMTZ'"
                >{{i!=null ? i.projectValue :''}}</td>
                <td v-if="SMTZList.HR==undefined" v-for="(i,index2) in list" :key="index2+'SMTZ'"></td>
              <td>入量合计</td>
                <td
                  v-if="reportData.intakeCountVo!=undefined&&reportData.intakeCountVo.intake.RLHJ!=undefined"
                  v-for="(option,index) in  reportData.intakeCountVo.intake.RLHJ"
                  :key="index+'09'"
                >{{option}}</td>
                <td
                  v-if="reportData.intakeCountVo!=undefined&&reportData.intakeCountVo.intake.RLHJ==undefined"
                  v-for="(i,index) in arr"
                  :key="index+'09'"
                ></td>
              </tr>
              <tr>
                <td>P</td>
                <td
                  v-if="SMTZList.P!=undefined"
                  v-for="(i,index2) in SMTZList.P"
                  :key="index2+'SMTZ'"
                >{{i!=null ? i.projectValue :''}}</td>
                <td v-if="SMTZList.P==undefined" v-for="(i,index2) in list" :key="index2+'SMTZ'"></td>
                  <td :rowspan="5">出量</td>
                <td>尿液</td>
                <td
                  v-if="reportData.intakeCountVo.outPut.NL!=undefined"
                  v-for="(option,index) in  reportData.intakeCountVo.outPut.NL"
                  :key="index+'09'"
                >{{option}}</td>
                <td
                  v-if="reportData.intakeCountVo.outPut.NL==undefined"
                  v-for="(i,index) in arr"
                  :key="index+'09'"
                ></td>
              </tr>
              <tr>
                <td>心律</td>
                <td
                  v-if="SMTZList.XL!=undefined"
                  v-for="(i,index2) in SMTZList.XL"
                  :key="index2+'SMTZ'"
                >{{i!=null ? i.projectValue :''}}</td>
                <td v-if="SMTZList.XL==undefined" v-for="(i,index2) in list" :key="index2+'SMTZ'"></td>
                <td>痰量</td>
                <td
                  v-if="reportData.intakeCountVo.outPut.TL!=undefined"
                  v-for="(option,index) in  reportData.intakeCountVo.outPut.TL"
                  :key="index+'09'"
                >{{option}}</td>
                <td
                  v-if="reportData.intakeCountVo.outPut.TL==undefined"
                  v-for="(i,index) in arr"
                  :key="index+'09'"
                ></td>
              </tr>
              <tr>
                <td>RR</td>
                <td
                  v-if="SMTZList.RR!=undefined"
                  v-for="(i,index2) in SMTZList.RR"
                  :key="index2+'SMTZ'"
                >{{i!=null ? i.projectValue :''}}</td>
                <td v-if="SMTZList.RR==undefined" v-for="(i,index2) in list" :key="index2+'SMTZ'"></td>
               <td>其他</td>
                <td
                  v-if="reportData.intakeCountVo.outPut.other!=undefined"
                  v-for="(option,index) in  reportData.intakeCountVo.outPut.other"
                  :key="index+'094'"
                >{{option}}</td>
                <td
                  v-if="reportData.intakeCountVo.outPut.other==undefined"
                  v-for="(i,index) in arr"
                  :key="index+'09'"
                ></td>
              </tr>
              <tr>
                <td>SBP</td>
                <td
                  v-if="SMTZList.SBP!=undefined"
                  v-for="(i,index2) in SMTZList.SBP"
                  :key="index2+'SMTZ'"
                >{{i!=null ? i.projectValue :''}}</td>
                <td v-if="SMTZList.SBP==undefined" v-for="(i,index2) in list" :key="index2+'SMTZ'"></td>
                 <td>出量合计</td>
                <td
                  v-if="reportData.intakeCountVo.outPut.CLHJ!=undefined"
                  v-for="(option,index) in  reportData.intakeCountVo.outPut.CLHJ"
                  :key="index+'09'"
                >{{option}}</td>
                <td
                  v-if="reportData.intakeCountVo.outPut.CLHJ==undefined"
                  v-for="(i,index) in arr"
                  :key="index+'09'"
                ></td>
              </tr>
              <tr>
                <td>DBP</td>
                <td
                  v-if="SMTZList.DBP!=undefined"
                  v-for="(i,index2) in SMTZList.DBP"
                  :key="index2+'SMTZ'"
                >{{i!=null ? i.projectValue :''}}</td>
                <td v-if="SMTZList.DBP==undefined" v-for="(i,index2) in list" :key="index2+'SMTZ'"></td>
                 <td>平衡</td>
                <td
                  v-if="reportData.intakeCountVo.equilibriumAmount!=undefined"
                  v-for="(option,index) in  reportData.intakeCountVo.equilibriumAmount"
                  :key="index+'094'"
                >{{option}}</td>
                <td
                  v-if="reportData.intakeCountVo.equilibriumAmount==undefined"
                  v-for="(i,index) in arr"
                  :key="index+'09'"
                ></td>
              </tr>
              <tr>
                <td>CVP</td>
                <td
                  v-if="SMTZList.CVP!=undefined"
                  v-for="(i,index2) in SMTZList.CVP"
                  :key="index2+'SMTZ'"
                >{{i!=null ? i.projectValue :''}}</td>
                <td v-if="SMTZList.CVP==undefined" v-for="(i,index2) in list" :key="index2+'SMTZ'"></td>
                 <td :rowspan="2" :colspan="3">24小时总平衡 ( ml )</td>
                <td :rowspan="2" :colspan="3">
                  <span
                    v-if="reportData.intakeCountVo.equilibriumAmount!=undefined"
                  >{{reportData.intakeCountVo.equilibriumAmount[3]}}</span>
                </td>
              </tr>
              <tr>
                <td>SpO2</td>
                <td
                  v-if="SMTZList.SPO2!=undefined"
                  v-for="(i,index2) in SMTZList.SPO2"
                  :key="index2+'SMTZ'"
                >{{i!=null ? i.projectValue :''}}</td>
                <td v-if="SMTZList.SPO2==undefined" v-for="(i,index2) in list" :key="index2+'SMTZ'"></td>
            
              </tr>
              <tr>
                <td>MAP</td>
                <td
                  v-if="SMTZList.MAP!=undefined"
                  v-for="(i,index2) in SMTZList.MAP"
                  :key="index2+'SMTZ'"
                >{{i!=null ? i.projectValue :''}}</td>
                <td v-if="SMTZList.MAP==undefined" v-for="(i,index2) in list" :key="index2+'SMTZ'"></td>
                  <td :rowspan="17">备注</td>
                <td :rowspan="17" :colspan="5"></td>
              </tr>
              <tr>
                <td>IAP</td>
                <td
                  v-if="SMTZList.IAP!=undefined"
                  v-for="(i,index2) in SMTZList.IAP"
                  :key="index2+'SMTZ'"
                >{{i!=null ? i.projectValue :''}}</td>
                <td v-if="SMTZList.IAP==undefined" v-for="(i,index2) in list" :key="index2+'SMTZ'"></td>
              
              </tr>
              <tr>
                <td :rowspan="8">呼吸机条件</td>
              </tr>
              <tr>
                <td style="width:80px;text-align:center;padding-left:15px">呼吸形式</td>
                <td v-for="(k,index1) in breathData" :key="index1">{{k.val}}</td>
                <!-- <td>痰量</td>
                        <td></td>
                        <td></td>
                        <td></td>
                <td></td>-->
              </tr>
              <tr>
                <td style="width:80px;text-align:center;padding-left:15px">VT</td>
                <td v-for="(k,index1) in breathData" :key="index1">{{k.val}}</td>
                <!-- <td>小计</td>
                        <td></td>
                        <td></td>
                        <td></td>
                <td></td>-->
              </tr>
              <tr>
                <td style="width:80px;text-align:center;padding-left:15px">Fio2</td>
                <td v-for="(k,index1) in breathData" :key="index1">{{k.val}}</td>
                <!-- <td>平衡</td>
                        <td></td>
                        <td></td>
                        <td></td>
                <td></td>-->
              </tr>
              <tr>
                <td style="width:80px;text-align:center;padding-left:15px">f</td>
                <td v-for="(k,index1) in breathData" :key="index1">{{k.val}}</td>
              </tr>
              <tr>
                <td style="width:80px;text-align:center;padding-left:15px">PSV</td>
                <td v-for="(k,index1) in breathData" :key="index1">{{k.val}}</td>
              </tr>
              <tr>
                <td style="width:80px;text-align:center;padding-left:15px">PEEP</td>
                <td v-for="(k,index1) in breathData" :key="index1">{{k.val}}</td>
              </tr>
              <tr>
                <td style="width:80px;text-align:center;padding-left:15px">Flow</td>
                <td v-for="(k,index1) in breathData" :key="index1">{{k.val}}</td>
              </tr>
              <tr></tr>
              <tr>
                <td :rowspan="4">入量</td>
              </tr>
              <tr>
                <td>静脉入量</td>
                <td
                  v-if="reportData.intakeShows.JMRL!=undefined"
                  v-for="(i,index2) in reportData.intakeShows.JMRL"
                  :key="index2+'SMTZ'"
                >
                  <p v-if="i!=null" v-for="(items,index9) in i" :key="index9">
                    <span
                      v-if="items.causeRemark!=null&&items.causeRemark!=''"
                    >[{{items.causeRemark}}]</span>
                    {{items.intakeOutputValue}}
                  </p>
                </td>
                <td
                  v-if="reportData.intakeShows.JMRL==undefined"
                  v-for="(i,index2) in list"
                  :key="index2+'SMTZ'"
                ></td>
              </tr>
              <tr>
                <td>口服鼻饲</td>
                <td
                  v-if="reportData.intakeShows.KFBS!=undefined"
                  v-for="(i,index2) in reportData.intakeShows.KFBS"
                  :key="index2+'SMTZ'"
                >
                  <p v-if="i!=null" v-for="(items,index9) in i" :key="index9">
                    <span
                      v-if="items.causeRemark!=null&&items.causeRemark!=''"
                    >[{{items.causeRemark}}]</span>
                    {{items.intakeOutputValue}}
                  </p>
                </td>
                <td
                  v-if="reportData.intakeShows.KFBS==undefined"
                  v-for="(i,index2) in list"
                  :key="index2+'SMTZ'"
                ></td>
              </tr>
              <tr>
                <td>其他</td>
                <td
                  v-if="reportData.intakeShows.other!=undefined"
                  v-for="(i,index2) in reportData.intakeShows.other"
                  :key="index2+'SMTZ'"
                >
                  <p v-if="i!=null" v-for="(items,index9) in i" :key="index9">
                    <span
                      v-if="items.causeRemark!=null&&items.causeRemark!=''"
                    >[{{items.causeRemark}}]</span>
                    {{items.intakeOutputValue}}
                  </p>
                </td>
                <td
                  v-if="reportData.intakeShows.other==undefined"
                  v-for="(i,index2) in list"
                  :key="index2+'SMTZ'"
                ></td>
              </tr>

              <!-- <tr v-for="(value,key) in reportData.intakeShows" :key="key">
                <td style="width:80px;text-align:left;padding-left:15px">{{key}}</td>
                <td v-for="(item,index8) in value" :key="index8">
                  <p v-for="(items,index9) in item" :key="index9">
                    <span
                      v-if="items.causeRemark!=null&&items.causeRemark!=''"
                    >[{{items.causeRemark}}]</span>
                    {{items.intakeOutputValue}}
                  </p>
                </td>
              </tr>-->
              <tr>
                <td :rowspan="4">出量</td>
              </tr>
              <tr>
                <td>尿量</td>
                <td
                  v-if="reportData.outputShows.NL!=undefined"
                  v-for="(i,index2) in reportData.outputShows.NL"
                  :key="index2+'SMTZ'"
                >
                  <p
                    v-if="i!=null"
                    v-for="(items,index9) in i"
                    :key="index9"
                  >{{items.intakeOutputValue}}</p>
                </td>
                <td
                  v-if="reportData.outputShows.NL==undefined"
                  v-for="(i,index2) in list"
                  :key="index2+'SMTZ'"
                ></td>
               
              </tr>
              <tr>
                <td>痰量</td>
                <td
                  v-if="reportData.outputShows.TL!=undefined"
                  v-for="(i,index2) in reportData.outputShows.TL"
                  :key="index2+'SMTZ'"
                >
                  <p
                    v-if="i!=null"
                    v-for="(items,index9) in i"
                    :key="index9"
                  >{{items.intakeOutputValue}}</p>
                </td>
                <td
                  v-if="reportData.outputShows.TL==undefined"
                  v-for="(i,index2) in list"
                  :key="index2+'SMTZ'"
                ></td>
                 <td :rowspan="5">
                  复
                  <br />核
                  <br />签
                  <br />字
                </td>
                <td :rowspan="5" :colspan="5"></td>
              </tr>
              <tr>
                <td>其他</td>
                <td
                  v-if="reportData.outputShows.other!=undefined"
                  v-for="(i,index2) in reportData.outputShows.other"
                  :key="index2+'SMTZ'"
                >
                  <p
                    v-if="i!=null"
                    v-for="(items,index9) in i"
                    :key="index9"
                  >{{items.intakeOutputValue}}</p>
                </td>
                <td
                  v-if="reportData.outputShows.other==undefined"
                  v-for="(i,index2) in list"
                  :key="index2+'SMTZ'"
                ></td>
              </tr>
              <!-- <tr v-for="(value,key,index19) in reportData.outputShows" :key="key">
                <td style="width:80px;text-align:left;padding-left:15px">{{key}}</td>
                <td v-for="(item,index8) in value" :key="index8">
                  <p v-for="(items,index9) in item" :key="index9">{{items.intakeOutputValue}}</p>
                </td>
                <td :rowspan="5" v-if="index19==1">
                  复
                  <br />核
                  <br />签
                  <br />字
                </td>
                <td :rowspan="5" v-if="index19==1" :colspan="5"></td>
              </tr>-->
              <tr>
                <td :rowspan="3">汇总</td>
              </tr>
              <tr>
                <td style="width:80px;text-align:left;padding-left:15px">每小时平衡</td>
                <td
                  v-if=" reportData.countNum!=undefined"
                  v-for="(item,index) in reportData.countNum"
                  :key="index"
                >{{item}}</td>
                <td
                  v-if="reportData.countNum==undefined"
                  v-for="(i,index2) in list"
                  :key="index2+'SMTZ'"
                ></td>
              </tr>
              <tr>
                <td style="width:80px;text-align:left;padding-left:15px">签名</td>
                <td
                  :colspan="8"
                  style="text-align:left;padding-left:20px"
                  v-if=" recordData.nurseName!=undefined"
                  v-for="(n,index) in this.recordData.nurseName"
                  :key="index+'name'"
                >
                  <img
                    v-if="n.signature!=null&&n.signature!=undefined"
                    :src="n.signature"
                    alt
                    width="80"
                    height="30"
                  />
                  <span v-if="n.signature==null||n.signature==undefined">{{n.realName}}</span>
                </td>
                <td v-if="recordData.nurseName==undefined" :colspan="8"></td>
                <td v-if="recordData.nurseName==undefined" :colspan="8"></td>
                <td v-if="recordData.nurseName==undefined" :colspan="8"></td>
              </tr>
              <tr>
                <td :colspan="1" :rowspan="2">注释</td>
                <td :colspan="31" style="text-align:left;padding-left:10px">
                  <div
                    v-for="(Q,index0) in reportData"
                    :key="index0"
                    v-if="Q ==reportData.intakeShows"
                  >
                    <span v-for="(j,index3) in reportData.intakeShows.HS" :key="index3+'1'">
                      <span
                        v-for="i in j"
                        :key="i.intakeOutputId"
                      >{{i.valueDescription}} &nbsp; &nbsp;</span>
                    </span>
                    <span v-for="(j,index31) in reportData.intakeShows.JMRL" :key="index31+'2'">
                      <span
                        v-for="i in j"
                        :key="i.intakeOutputId"
                      >{{i.valueDescription}} &nbsp; &nbsp;</span>
                    </span>
                    <span v-for="(j,index32) in reportData.intakeShows.KFBS" :key="index32+'3'">
                      <span
                        v-for="i in j"
                        :key="i.intakeOutputId"
                      >{{i.valueDescription}} &nbsp; &nbsp;</span>
                    </span>
                    <span v-for="(j,index33) in reportData.intakeShows.SY" :key="index33+'4'">
                      <span
                        v-for="i in j"
                        :key="i.intakeOutputId"
                      >{{i.valueDescription}} &nbsp; &nbsp;</span>
                    </span>
                  </div>
                  <span>&nbsp;</span>
                </td>
              </tr>
            </tbody>
            <tfoot></tfoot>
          </table>
        </div>
      </div>
    </div>
    <el-dialog title="修改" :visible.sync="editconNameVis" :fullscreen="isFullscreen">
      <el-form :model="form">
        <el-form-item label="时间" :label-width="formLabelWidth">
          <el-input v-model="form.time" autocomplete="off" :disabled="editIf"></el-input>
        </el-form-item>
        <el-form-item label="内容" :label-width="formLabelWidth">
          <el-input v-model="form.conName" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editconNameVis = false">保 存</el-button>

        <el-button @click="editconNameVis = false">取 消</el-button>
      </div>
    </el-dialog>
  </basic-container>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { dateFormat } from "@/util/date";
import {
  getRecords,
  getDict,
  getReport,
  getsection
} from "@/api/icu/nursingRecord/nursingRecord.js";
let that;
export default {
  beforeCreate: function () {
    that = this;
  },
  filters: {
    depFl: data => {
      for (let i in that.depList) {
        if (data == that.depList[i].depId) {
          return that.depList[i].name;
        }
      }
    },
    keyFl: data => {
      return that.reportData.projectName[data];
      // return Object.values(that.reportData.projectName)[Object.keys(that.reportData.projectName).indexOf(data)]
    },
    typeFl: data => {
      for (let i in that.dicData) {
        if (data == that.dicData[i].value) {
          return that.dicData[i].label;
        }
      }
    },
    timeFl: data => {
      if (data) {
        data = data.substr(0, 11);
      }

      return data;
    },
    genderFl: data => {
      switch (data) {
        case "0":
          return "女";

        case "1":
          return "男";
      }
    }
  },
  data() {
    return {
      list: [],
      arr: [],
      depList: [],
      projectId: "",
      min: "",
      max: "",
      name: "",
      range: [],
      // 合计
      combined: 0,
      total: [],
      // 患者
      patName: "",
      patientNames: [],
      flagAct: "",
      patInfo: {},
      rangeIf: true,
      isFullscreen: false,
      screenWidth: document.body.clientWidth, // 屏幕尺寸
      watchArr: [],
      year: "",
      dateTime: new Date(),
      tabLoad: true,
      recordData: [],
      reportData: [],
      editconNameVis: false,
      form: {},
      formLabelWidth: "100px",
      editIf: true,
      dicData: [],
      typeLengthTK: 0,
      typeLengthSMTZ: 0,
      inLength: 0,
      outLength: 0,
      projectTypeNameTK: "",
      projectTypeNameSMTZ: "",
      TKList: {},
      SMTZList: {},
      breathData: []
    };
  },
  computed: {
    ...mapGetters(["permissions", "nurse_patients", "dep_patients", "patientMessage"]),
    ...mapState({
      roleCodes: state => state.user.roleCodes
    }),
    permissionList() {
      return {};
    }
  },
  watch: {
    patientMessage: {
      handler(newValue, oldValue) {
        this.patientNameClick(newValue.name, newValue.id, newValue.patientId, newValue)
      }
    }
  },
  created() {
    this.getNursePatients();
    this.getDic();
    getsection().then(response => {
      // console.log(response.data.data)
      this.depList = response.data.data;
    });
  },
  // activated() {
  //   this.getNursePatients();
  //   this.getDic();
  //   getsection().then(response => {
  //     // console.log(response.data.data)
  //     this.depList = response.data.data;
  //   });
  // },
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
  },
  methods: {
    // 请求患者列表
    getNursePatients() {
      this.tabLoad = true;
      let data = JSON.parse(sessionStorage.getItem("pigx-all_patients"))
        .content;
      this.patientNames = data;
      this.patInfo = JSON.parse(sessionStorage.getItem("pigx-patientMessage")).content;
      if (data == undefined) {
        this.$message.warning('没有患者')
      }
      this.patName = this.patInfo.patientId;
      this.name = this.patInfo.name;
      this.getList();
    },
    //  getNursePatients() {

    // },
    patientNameClick(patientName, id, patientId, item) {
      this.patName = patientId;
      this.name = patientName;
      this.$store.commit('SET_MESSAGE', item)
      this.patInfo = this.patientMessage
      this.getList();
    },
    dateChange(val) {
      if (
        dateFormat(val).substr(0, 10) ==
        dateFormat(new Date()).substr(0, 10)
      ) {
        this.dateTime = new Date();
      }

      this.getList();
    },
    //请求字典表
    getDic() {
      getDict().then(response => {
        this.dicData = response.data.data;
      });
    },
    getList() {
      this.count = null;
      let obj = {
        patientId: this.patName,
        endTime: dateFormat(this.dateTime),
        nursingReportFlag: 1
      };
      this.TKList = {}
      this.SMTZList = {}
      this.tabLoad = true;
      getRecords(obj).then(response => {
        this.TKList = {}
        this.SMTZList = {}
        this.recordData = response.data.data;
        // this.projectTypeNameTK = this.recordData.nursingReportVos[0].projectType;
        // this.projectTypeNameSMTZ = this.recordData.nursingReportVos[this.recordData.nursingReportVos.length - 1].projectType;
        for (let i in this.recordData.nursingReportVos) {
          if (8 == this.recordData.nursingReportVos[i].projectType) {
            // this.TKList.push(this.recordData.nursingReportVos[i])
            this.$set(this.TKList, this.recordData.nursingReportVos[i].projectCode, this.recordData.nursingReportVos[i].projectRecordDuplicates)
          }
        }
        for (let i in this.recordData.nursingReportVos) {
          if (1 == this.recordData.nursingReportVos[i].projectType) {
            this.$set(this.SMTZList, this.recordData.nursingReportVos[i].projectCode, this.recordData.nursingReportVos[i].projectRecordDuplicates)
            // this.SMTZList.push(this.recordData.nursingReportVos[i])
          }
        }
        // console.log(this.TKList)
        // console.log(this.SMTZList)
        if (this.inLength != 0 && this.recordData.nursingReportVos != undefined && this.recordData.nursingReportVos != null) {
          this.tabLoad = false
        }
        this.list = []
        for (let i = 0; i <= 23; i++) {
          this.$set(this.list, i, null)
        }
        this.arr = []
        for (let i = 0; i <= 3; i++) {
          this.$set(this.arr, i, null)
        }
        this.range = [];

        for (let i = this.recordData.hour; i <= 24; i++) {
          if (i == 24) {
            i = 0;
          }
          this.range.push(i);
          if (this.range.length == 24) {
            return;
          }
        }
        // for(let i in this.recordData.nursingReportVos){

        // }
      });
      //请求出入量
      getReport(obj).then(response => {
        this.reportData = response.data.data;
        this.inLength = Object.keys(this.reportData.intakeShows).length + 1;
        this.outLength =
          Object.keys(this.reportData.outputShows).length + 1;
        if (this.inLength != 0 && this.recordData.nursingReportVos != undefined && this.recordData.nursingReportVos != null) {
          this.tabLoad = false
        }
      });

      this.breathData = [];
      for (let j = 0; j < 24; j++) {
        this.breathData.push([]);
      }

      this.$forceUpdate()
    },
    //打印页面内容
    printContent() {
      let wpt = document.getElementById("panel");
      let newContent = wpt.innerHTML;
      let oldContent = document.body.innerHTML;

      document.body.innerHTML = newContent;
      window.print(); //打印方法
      window.location.reload();
      document.body.innerHTML = oldContent;
    },
    setconName(val) {
      // console.log(val);
      if (val.conName == undefined) {
        this.editIf = false;
      } else {
        this.editIf = true;
      }
      this.form = val;
      this.editconNameVis = true;
    }
  }
};
</script>

<style lang="scss" scoped >
.table {
  border-collapse: collapse;
  // width: 2000px;
}
table,
tr,
td {
  border: 1px solid black;
  white-space: nowrap;
}
.RLtd {
  vertical-align: bottom;
  position: relative;
  border-bottom-color: #fff;
}
.RLtdSpan {
  position: absolute;
  bottom: -12px;
  right: 8px;
}
.RLTD {
  border-top-color: #fff;
}
.assTable table {
  border-collapse: collapse;
}
.assTable table td {
  width: 50px;
}
.first {
  position: relative;
}
.befor_span {
  position: absolute;
  left: 5px;
}
.first_span {
  position: absolute;
  right: 5px;
}
.clearfix:after {
  content: '';
  display: block;
  clear: both;
}
.panel-heading {
  padding: 10px 15px;
  border-bottom: 1px solid transparent;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border-color: #ddd;
}
.panel-title {
  text-align: center;
  font-size: 16px;
  font-weight: 600;
}
.perinfo {
  margin-right: 100px;
  line-height: 30px;
  font-size: 12px;
}
.patient_name {
  margin-top: 5px;
  margin-left: 1%;
}
.assTable {
  width: 100%;
  margin-bottom: 30px;
  padding-bottom: 10px;
  // overflow-x: scroll;
}
@media screen and (max-width: 1750px) {
  .assTable {
    overflow-x: scroll;
  }
  .table {
    border-collapse: collapse;
    width: 1500px;
  }
}

.avue-tags__menu {
  line-height: 40px;
  padding-right: 10px;
  margin-top: 18px;
  margin-right: 1%;
  z-index: 500;
}

.patientBtn {
  width: 90px;
  margin: 3%;
  // padding: 10px;
  // margin-left: 2px;
  overflow: hidden;
}
.patientBtn span {
  text-align: center;
}
.ActBtn {
  background: #409eff !important;
  color: #fff !important;
}
</style>
