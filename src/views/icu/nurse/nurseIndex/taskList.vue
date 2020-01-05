<template>
  <!-- 护士首页  任务列表 -->
  <div>
    <div v-if="componentFlag">
      <div v-if="!newPage" class="newPage">
        <!-- 筛选条件 -->
        <div class="task_search clearfix">
          <el-select
            v-model="value2"
            size="small"
            placeholder="任务状态"
            class="task_select child"
            @change="searchTask($event,1)"
          >
            <el-option
              v-for="item in options2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select
            v-if="parentCode=='nurseTask'||parentCode=='matronTask'"
            v-model="patientId"
            size="small"
            class="task_select child"
            style="margin-left:10px"
            placeholder="请选择患者"
            @change="searchTask($event,2)"
          >
            <el-option
              v-for="item in patientNames"
              :key="item.value"
              :label="`${item.patientName}   ${item.bedName}`"
              :value="item.patientId"
            ></el-option>
          </el-select>
          <el-select
            v-if="parentCode=='matronTask'"
            v-model="nurseId"
            class="task_select child"
            size="small"
            style="margin-left:10px"
            placeholder="请选择护士"
            @change="searchTask($event,3)"
          >
            <el-option
              v-for="item in nurseNames"
              :key="item.value"
              :label="item.realName"
              :value="item.nurseId"
            ></el-option>
          </el-select>
          <!-- 快捷任务 -->
          <div class="rapidTask child clearfix" v-if="rapidIf&&roleCodes == 'ROLE_NURSE'">
            <p>
              <el-button icon="el-icon-arrow-left" @click="prev()" class="btn"></el-button>
            </p>
            <div class="btnBox">
              <div class="btnOverflow">
                <p>
                  <el-button
                    v-for="task in rapidTaskData"
                    :key="task.id"
                    round
                    size="small"
                    @click="repaidClick(task)"
                    style="margin-left:10px"
                  >{{task.taskContent}}</el-button>
                </p>
              </div>
            </div>
            <p>
              <el-button icon="el-icon-arrow-right" @click="next()" class="btn"></el-button>
            </p>
          </div>
          <div class="child">
            <el-button
              icon="el-icon-delete"
              size="small"
              style="margin-left:10px"
              @click="clearform"
            >清空</el-button>

            <el-button
              type="primary"
              icon="el-icon-plus"
              size="small"
              style="margin-bottom:2%"
              @click="addTaskClick"
            >新增</el-button>
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="small"
              style="margin-bottom:2%"
              @click="addPlan"
            >护理计划</el-button>
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="small"
              style="margin-bottom:2%"
              @click="changecomponentFlag(1)"
            >病情变化</el-button>
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="small"
              style="margin-bottom:2%"
              @click="changecomponentFlag(3)"
            >护理</el-button>
          </div>
        </div>

        <!-- 任务列表 -->
        <el-table
          v-if="overLoading"
          :border="true"
          :data="tableData"
          v-loading="loading"
          :header-cell-style="{background:'rgb(250, 250, 250)',color: 'rgba(0,0,0,.85)'}"
          stripe
          style="width: 99%;margin-bottom:20px;margin-left:0.5%"
        >
          <el-table-column
            fixed
            label="序号"
            width="50"
            align="center"
            show-overflow-tooltip
            header-align="center"
            background="#000"
          >
            <template scope="scope">
              <span>{{scope.$index+(currentPage - 1) * pageSize + 1}}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="patientName"
            label="患者"
            show-overflow-tooltip
            header-align="center"
            width="100"
          ></el-table-column>
          <el-table-column prop="taskName" label="任务名称" show-overflow-tooltip header-align="center"></el-table-column>
          <el-table-column
            prop="progressBar"
            label="进度"
            show-overflow-tooltip
            header-align="center"
            width="120"
          >
            <template slot-scope="scope">
              <el-progress :percentage="scope.row.progressBar"></el-progress>
            </template>
          </el-table-column>
          <el-table-column
            prop="emergency"
            label="紧急程度"
            show-overflow-tooltip
            header-align="center"
            width="80"
          >
            <template slot-scope="scope">
              <span
                :class="[scope.row.emergency==1?'task-status-1':'',scope.row.emergency==2?'task-status-2':'',scope.row.emergency==3?'task-status-3':'',]"
              >{{ scope.row.emergency | emergencyFl }}</span>
            </template>
          </el-table-column>
          <el-table-column label="计划时间" show-overflow-tooltip header-align="center" width="140">
            <template slot-scope="scope">
              <span
                prop="preStartTime"
                show-overflow-tooltip
                header-align="center"
              >开始: {{scope.row.preStartTime}}</span>
              <br />
              <span
                prop="preEndTime"
                show-overflow-tooltip
                header-align="center"
              >结束: {{scope.row.preEndTime}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="result" label="结果" show-overflow-tooltip header-align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.progressBar==100">{{ scope.row.result}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="state"
            label="任务状态"
            show-overflow-tooltip
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
              <span
                prop="state"
                :class="[scope.row.state==0?'state-0':'',scope.row.state==1?'state-1':'',scope.row.state==2?'state-2':'',scope.row.state==3?'state-3':'',scope.row.state==4?'state-4':'',scope.row.state==5?'state-5':'',scope.row.state==-1?'state-1':'',]"
              >{{ scope.row.state | stateFl }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="taskType"
            label="任务来源"
            show-overflow-tooltip
            header-align="center"
            width="120"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.taskType | fromObj }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="executionType"
            label="执行类型"
            show-overflow-tooltip
            header-align="center"
            width="80"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.executionType | executionTypeFl }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="dosage"
            label="用量"
            show-overflow-tooltip
            header-align="center"
            width="70"
            align="center"
          ></el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="180"
            :border="true"
            show-overflow-tooltip
            header-align="center"
          >
            <template slot-scope="scope">
              <!-- <el-button
                icon="el-icon-thumb"
                size="small"
                type="text"
                :disabled="scope.row.state!=3&&scope.row.state!=5?false:'disabled'"
                @click="assigned(scope.row)"
              >指派</el-button>
              <el-button
                icon="el-icon-copy-document"
                size="small"
                type="text"
                :disabled="scope.row.state!=3&&scope.row.state!=5?false:'disabled'"
                @click="breakUpTask(scope.row)"
              >拆分</el-button>-->
              <el-button icon="el-icon-view" size="small" type="text" @click="details(scope.row)">详情</el-button>
              <!-- <el-button
                icon="el-icon-edit"
                size="small"
                type="text"
                :disabled="scope.row.state!=3&&scope.row.state!=5?false:'disabled'"
                @click="taskEditClick(scope.row)"
              >编辑</el-button>
              <el-button
                type="text"
                icon="el-icon-delete"
                size="small"
                :disabled="scope.row.creatorId==nurseId&&scope.row.state!=3&&scope.row.state!=5?false:'disabled'"
                @click="rowDel(scope.row,scope)"
              >删除</el-button>-->
              <el-button
                prop="state"
                type="text"
                icon="el-icon-check"
                size="small"
                :disabled="roleCodes == 'ROLE_MATRON'"
                @click="changeStatus(scope.row.id,scope.row.state,scope.row)"
              >执行</el-button>
              <el-dropdown style="margin-left:10px" :hide-on-click="true" trigger="click">
                 <el-button
                type="text"
                icon="el-icon-arrow-down"
                class="el-dropdown-link el-link el-link--primary"
                size="small"
                style="font-size:12px"
              >更多</el-button>
                <!-- <span class="el-dropdown-link el-link el-link--primary">
                  <i class="el-icon-arrow-down"></i>

                  操作
                </span> -->
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item class="el-dropdown-menu__item" @click.native="assigned(scope.row)">指派</el-dropdown-item>
                  <el-dropdown-item class="el-dropdown-menu__item" @click.native="breakUpTask(scope.row)">拆分</el-dropdown-item>
                  <el-dropdown-item class="el-dropdown-menu__item" @click.native="taskEditClick(scope.row)">编辑</el-dropdown-item>
                  <el-dropdown-item class="el-dropdown-menu__item" @click.native="rowDel(scope.row,scope)">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <template>
          <div style="width:100%;position:relative;height:50px">
            <el-pagination
              :page-sizes="[10, 20,30,40, 50, 100]"
              :pager-count="7"
              :current-page="currentPage"
              :page-size="pageSize"
              :total="total"
              layout="total, sizes, prev, pager, next, jumper"
              style="margin-bottom:1%;position:absolute;right:1%"
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            ></el-pagination>
          </div>
        </template>
        <!-- 对话框 -->
        <!-- 指派护士对话框 -->
        <el-dialog
          title="指派"
          :visible.sync="dialogAssigned"
          :fullscreen="isFullscreen"
          width="65%"
          @close="assignedClose()"
        >
          <span>指派护士</span>&nbsp;&nbsp;&nbsp;&nbsp;
          <el-button
            style="margin-left:10px"
            :type="!flag?'primary':''"
            @click="assignedSwitch()"
          >当班护士</el-button>
          <el-button
            style="margin-left:10px"
            :type="flag?'primary':''"
            @click="assignedSwitch()"
          >全部护士</el-button>
          <!-- 当班护士 -->
          <div v-if="!allNurseIf" class="assignedBox" v-loading="nurseLoading">
            <el-button
              v-for="(item,id) in onDutyNurse"
              :key="id"
              :type="item.flag?'primary':''"
              style="margin-top:10px"
              @click="assignedClick(item)"
            >{{item.nurseName}}</el-button>
          </div>
          <!-- 所有护士 -->
          <div v-if="allNurseIf" class="assignedBox" v-loading="nurseLoading">
            <el-button
              v-for="(item,id) in allNurse"
              :key="id"
              :type="item.flag?'primary':''"
              style="margin-top:10px"
              @click="assignedClick(item)"
            >{{item.realName}}</el-button>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" :loading="assignedLoading" @click="assignedSave()">保 存</el-button>
            <el-button @click="assignedCancel">取 消</el-button>
          </span>
        </el-dialog>
        <!-- 任务详情对话框 -->
        <el-dialog
          :visible.sync="dialogTableVisible"
          :append-to-body="true"
          @close="viewClose()"
          :fullscreen="isFullscreen"
          width="65%"
          title="任务详情"
        >
          <template v-loading="detailsIf">
            <table v-if="dialogTable" id="basic-table" class="table table-bordered">
              <tr>
                <th>任务来源：</th>
                <td>{{ detailsArr.taskSubTaskVo.taskType | fromObj }}</td>
                <th>任务编号：</th>
                <td>{{ detailsArr.taskSubTaskVo.id }}</td>
                <th>执行类型：</th>
                <td>{{ detailsArr.taskSubTaskVo.executionType | executionTypeFl}}</td>
              </tr>
              <tr>
                <th>责任护士：</th>
                <td>{{ detailsArr.taskSubTaskVo.dutyNurseName }}</td>
                <th>预执行时间：</th>
                <td>{{ detailsArr.taskSubTaskVo.preStartTime }}</td>
                <th>预结束时间：</th>
                <td>{{ detailsArr.taskSubTaskVo.preEndTime }}</td>
              </tr>
              <tr>
                <th>执行状态：</th>
                <td>{{ detailsArr.taskSubTaskVo.state | stateFl }}</td>
                <th>紧急程度：</th>
                <td>
                  <span
                    :class="[detailsArr.taskSubTaskVo.emergency==1?'task-status-1':'',detailsArr.taskSubTaskVo.emergency==2?'task-status-2':'',detailsArr.taskSubTaskVo.emergency==3?'task-status-3':'',]"
                  >{{ detailsArr.taskSubTaskVo.emergency | emergencyFl }}</span>
                </td>
                <th>患者姓名：</th>
                <td>{{ detailsArr.taskSubTaskVo.patientName }}</td>
              </tr>
              <tr>
                <th>接收护士：</th>
                <td>{{ detailsArr.taskSubTaskVo.receptionNurse }}</td>
                <th>接收时间：</th>
                <td>{{ detailsArr.taskSubTaskVo.receiveTime }}</td>
                <th>完成护士：</th>
                <td>{{ detailsArr.taskSubTaskVo.completedNurse }}</td>
              </tr>
              <tr>
                <th>开始时间：</th>
                <td>{{ detailsArr.taskSubTaskVo.startTime }}</td>
                <th>结束时间：</th>
                <td>{{ detailsArr.taskSubTaskVo.endTime }}</td>
                <th></th>
                <td></td>
              </tr>
              <tr>
                <th colspan="3">任务名称：</th>
                <th colspan="3">任务描述：</th>
              </tr>
              <tr>
                <td colspan="3">{{ detailsArr.taskSubTaskVo.taskName }}</td>
                <td colspan="3">{{ detailsArr.taskSubTaskVo.taskDescribe }}</td>
              </tr>
              <tr>
                <th colspan="6">医嘱内容</th>
              </tr>
              <tr v-if="detailsArr.hisDoctorsAdviceVo">
                <th>批次：</th>
                <td>{{detailsArr.hisDoctorsAdviceVo.batchNumber}}</td>
                <th>下嘱日期：</th>
                <td>{{detailsArr.hisDoctorsAdviceVo.createTime}}</td>
                <th>医嘱类型：</th>
                <td>{{detailsArr.hisDoctorsAdviceVo.type|typeFl}}</td>
              </tr>
              <tr v-if="detailsArr.hisDoctorsAdviceVo">
                <th>首次执行时间：</th>
                <td>{{detailsArr.hisDoctorsAdviceVo.firstExecutionTime}}</td>
                <th>自动停止时间：</th>
                <td>{{detailsArr.hisDoctorsAdviceVo.automaticStopTime}}</td>
                <th>执行频率：</th>
                <td>{{detailsArr.hisDoctorsAdviceVo.frequency}}</td>
              </tr>
              <tr v-if="detailsArr.hisDoctorsAdviceVo">
                <th>执行次数：</th>
                <td>{{detailsArr.hisDoctorsAdviceVo.firstExecutionTime}}</td>
                <th></th>
                <td></td>
                <th></th>
                <td></td>
              </tr>
              <tr v-if="detailsArr.hisDoctorsAdviceVo">
                <th colspan="2">内容：</th>
                <th>方式：</th>
                <th>剂量：</th>
                <th>单位：</th>
                <th>备注：</th>
              </tr>

              <tr v-for="(item,id) in detailsArr.projectList " :key="id">
                <td colspan="2">{{ item.content}}</td>
                <td>{{ item.drugUse}}</td>
                <td>{{ item.consumption}}</td>
                <td>{{ item.company}}</td>
                <td>{{ item.remarks}}</td>
              </tr>

              <tr>
                <th colspan="6">交接详情</th>
              </tr>
              <tr v-for="(item,id) in detailsArr.shiftsTask " :key="id">
                <!-- <th>交接备注：</th>
                <td colspan="2">{{ item.shiftsTaskDescribe}}</td>-->
                <th>交接备注：</th>
                <td colspan="5">{{ item.shiftsTaskDescribe}}</td>
              </tr>
            </table>
          </template>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogTableVisible=false;detailsIf=false">取 消</el-button>
          </div>
        </el-dialog>
        <!-- 任务拆分对话框 -->
        <el-dialog
          :visible.sync="breakUpVis"
          :fullscreen="isFullscreen"
          class="taks_edit"
          title="拆分任务"
          @close="breakUpClose()"
        >
          <div>
            <p>原任务</p>
            <el-form ref="oldTask" :model="oldTask">
              <el-row>
                <el-col :span="11">
                  <el-form-item :label-width="formLabelWidth" label="任务名称" prop="taskName">
                    <el-input v-model="oldTask.taskName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item :label-width="formLabelWidth" label="任务描述" prop="taskDescribe">
                    <el-input v-model="oldTask.taskDescribe" auto-complete="off" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="11">
                  <el-form-item :label-width="formLabelWidth" label="患者名字" prop="patientName">
                    <el-input v-model="oldTask.patientName" auto-complete="off" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item :label-width="formLabelWidth" label="用量" prop="dosage">
                    <el-input v-model="oldTask.dosage" auto-complete="off" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div>
            <p>新任务</p>
            <el-form ref="newTask" :model="newTask" :rules="newTaskRules" @validate="refNewTask()">
              <el-row>
                <el-col :span="11">
                  <el-form-item :label-width="formLabelWidth" label="任务名称" prop="taskName">
                    <el-input v-model="newTask.taskName"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item :label-width="formLabelWidth" label="任务描述" prop="taskDescribe">
                    <el-input v-model="newTask.taskDescribe" auto-complete="off"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="11">
                  <el-form-item :label-width="formLabelWidth" label="患者名字" prop="patientName">
                    <el-input v-model="newTask.patientName" auto-complete="off" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11" v-if="oldTask.dosage==0">
                  <el-form-item :label-width="formLabelWidth" label="用量">
                    <el-input
                      v-model.number="newTask.dosage"
                      @change="newDosage()"
                      auto-complete="off"
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11" v-if="oldTask.dosage!=0">
                  <el-form-item :label-width="formLabelWidth" label="用量" prop="dosage">
                    <el-input
                      type="dosage"
                      v-model.number="newTask.dosage"
                      @change="newDosage($event)"
                      auto-complete="off"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" :loading="pdSub" @click="subBreakUp('newTask')">保 存</el-button>
            <el-button @click="breakUpVis=false">取 消</el-button>
          </div>
        </el-dialog>
        <!-- 任务编辑对话框 -->
        <el-dialog
          :visible.sync="dialogFormVisible"
          :append-to-body="true"
          :fullscreen="isFullscreen"
          class="taks_edit"
          title="编辑任务"
          @close="closeDialogEdit(formLib)"
        >
          <el-form ref="formLib" :model="formLib" :rules="rules">
            <el-form-item :label-width="formLabelWidth" label="任务名称" prop="taskName">
              <el-col :span="22">
                <el-input v-model="formLib.taskName"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth" label="任务描述" prop="taskDescribe">
              <el-col :span="22">
                <el-input v-model="formLib.taskDescribe" auto-complete="off"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth" label="患者姓名" prop="patientName">
              <el-select
                v-model="formLib.patientName"
                placeholder="患者姓名"
                class="edit_input"
                :disabled="true"
              >
                <el-option
                  v-for="item in patientNames"
                  :key="item.patientName"
                  :label="item.patientName + item.bedName"
                  :value="item.patientId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label-width="formLabelWidth"
              v-model="formLib.emergency"
              :span="22"
              label="紧急程度"
              prop="emergency"
            >
              <el-button
                style="margin-left:10px"
                :type="formLib.emergency==1?'primary':''"
                @click="normalClick()"
                :value="1"
              >正常</el-button>
              <el-button
                style="margin-left:10px"
                :type="formLib.emergency==2?'primary':''"
                @click="urgentClick()"
                :value="2"
              >加急</el-button>
              <el-button
                style="margin-left:10px"
                :type="formLib.emergency==3?'primary':''"
                @click="urgencyClick()"
                :value="3"
              >紧急</el-button>
            </el-form-item>
            <!-- <el-form-item :label-width="formLabelWidth" :span="22" label="任务性质" prop="state">
              <el-select
                v-model="formLib.state"
                placeholder="任务性质"
                class="edit_input"
                :disabled="true"
                @change="stateChange(formLib.state)"
              >
                <el-option label="正常任务" :value="1"></el-option>
                <el-option label="正常任务" :value="2"></el-option>
                <el-option label="正常任务" :value="4"></el-option>
                <el-option label="开始即结束" :value="6"></el-option>
              </el-select>
            </el-form-item>-->
            <el-form-item :label-width="formLabelWidth" label="预开始时间" prop="preStartTime">
              <el-col :span="22">
                <el-date-picker
                  v-model="formLib.preStartTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :picker-options="pickerOptions"
                  placeholder="选择预开始时间"
                ></el-date-picker>
              </el-col>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth" label="预结束时间" prop="preEndTime">
              <el-col :span="22">
                <el-date-picker
                  v-model="formLib.preEndTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :picker-options="pickerOptions"
                  placeholder="选择预结束时间"
                ></el-date-picker>
              </el-col>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="warning" @click="stopTask(formLib)">暂停</el-button>
            <el-button type="primary" :loading="pdSub" @click="handleUpdate('formLib')">修 改</el-button>
            <el-button @click="closeEditDialog">取 消</el-button>
          </div>
        </el-dialog>
        <!-- 快捷任务完成描述 -->
        <el-dialog
          :visible.sync="repaidVis"
          class="taks_edit"
          title="任务结果"
          @close="clearRepaidResult()"
        >
          <el-form v-if="projectValueList==null" v-loading="repaidLoading">
            <el-form-item :label-width="formLabelWidth" label="任务结果">
              <el-col :span="22">
                <el-input v-model="repaidResult" auto-complete="off"></el-input>
              </el-col>
            </el-form-item>
          </el-form>
          <div
            v-if="projectValueList!=null&&projectValueList.length!=0"
            style="margin-left:120px;width:85%"
            v-loading="repaidLoading"
          >
            <p>请选择任务结果</p>
            <el-button
              style="margin-top:10px;margin-left:10px"
              :type="i.flag?'primary':''"
              v-for="i in projectValueList[0].projectRecordValues"
              :key="i.id"
              @click="repaidBtn(i,i.projectRecordValueId)"
            >{{i.recordValue}}</el-button>
          </div>

          <div slot="footer" class="dialog-footer" v-loading="repaidLoading">
            <el-button type="primary" :loading="pdSub" @click="submitRepaidResult()">保 存</el-button>
            <el-button @click="repaidVis=false">取 消</el-button>
          </div>
        </el-dialog>
        <!-- 完成任务 -->
        <el-dialog
          :visible.sync="dialogcompleteVisible"
          class="taks_edit"
          title="任务结果"
          @close="clearResult()"
        >
          <el-form v-if="!resultList.length!=0">
            <el-form-item :label-width="formLabelWidth" label="任务结果">
              <el-col :span="22">
                <el-input v-model="result" auto-complete="off"></el-input>
              </el-col>
            </el-form-item>
          </el-form>
          <div v-if="resultList.length!=0" style="margin-left:120px;width:85%">
            <p>请选择任务结果</p>
            <el-button
              style="margin-top:10px;margin-left:10px"
              :type="i.flag?'primary':''"
              v-for="i in resultList[0].projectRecordValues"
              :key="i.id"
              @click="resBtn(i,i.projectRecordValueId)"
            >{{i.recordValue}}</el-button>
          </div>

          <div slot="footer" class="dialog-footer">
            <el-button type="primary" :loading="pdSub" @click="submitResult()">保 存</el-button>
            <el-button @click="dialogcompleteVisible=false">取 消</el-button>
          </div>
        </el-dialog>
        <!-- 暂停任务 -->
        <el-dialog :visible.sync="soptTaskVis" class="taks_edit" title="暂停任务">
          <el-form>
            <el-form-item :label-width="formLabelWidth" label="暂停描述">
              <el-col :span="22">
                <el-input v-model="result" auto-complete="off"></el-input>
              </el-col>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" :loading="pdSub" @click="submitStopDes()">保 存</el-button>
            <el-button @click="soptTaskVis=false">取 消</el-button>
          </div>
        </el-dialog>
        <!-- 定制护理计划 -->
        <el-dialog
          :visible.sync="nursingPlan"
          :fullscreen="isFullscreen"
          title="预定护理计划"
          width="70%"
          @close="closePlan"
        >
          <div class="createPer" v-if="roleCodes !='ROLE_MATRON'">
            <label>患者姓名</label>
            <el-button
              v-for="(item,index) in patientNames"
              :key="index"
              :value="item.patientId"
              :class="['patientBtn',(index == ActBtn?'patientBtnAct':'')]"
              style="margin-left:10px;margin-top:10px;text_algin:center;padding:10px;"
              @click="patientName(item,index)"
            >{{ item.patientName }} {{ item.bedName }}</el-button>
          </div>
          <div class="createPer" v-if="roleCodes =='ROLE_MATRON'">
            <label>患者姓名</label> &nbsp; &nbsp;
            <el-select v-model="patientId" placeholder="患者姓名">
              <el-option
                v-for="item in patientNames"
                :key="item.patientName"
                :label="item.name + item.bedName"
                :value="item.patientId"
              ></el-option>
            </el-select>
          </div>
          <el-table
            :data="planData"
            border
            style="width: 100%;margin-top:1%"
            v-loading="planLoading"
            :header-cell-style="{background:'rgb(250, 250, 250)',color: 'rgba(0,0,0,.85)'}"
          >
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column label="调用任务模板名称" align="center">
              <template scope="scope">
                <el-select
                  v-model="scope.row.planValue"
                  style="width:130px"
                  prop="planValue"
                  placeholder="请选择"
                  @change="taskTempChange(scope.row)"
                >
                  <el-option
                    v-for="item in taskTemplateArr"
                    :key="item.id"
                    :label="item.templateContent"
                    :value="item.templateId"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="预开始时间" align="center">
              <template scope="scope">
                <el-date-picker
                  @change="compareTime(1,scope.row)"
                  v-model="scope.row.start"
                  style="width:160px"
                  type="datetime"
                  placeholder="请选择开始时间"
                  :picker-options="pickerOptions"
                  format="MM-dd HH:mm"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </template>
            </el-table-column>
            <el-table-column label="预结束时间" align="center">
              <template scope="scope">
                <el-date-picker
                  @change="compareTime(2,scope.row)"
                  v-model="scope.row.end"
                  style="width:160px"
                  type="datetime"
                  placeholder="请选择结束时间"
                  :picker-options="pickerOptions"
                  format="MM-dd HH:mm"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="cycle" label="循环" align="center" fixed="right" :min-width="200">
              <template scope="scope">
                <el-button
                  v-if="!scope.row.cycle"
                  type="text"
                  size="medium"
                  icon="el-icon-menu"
                  @click="cycleClick(scope.$index)"
                >循环</el-button>
                <div v-if="scope.row.cycle">
                  <el-input
                    v-model="scope.row.intervalTimes"
                    style="width:95px; margin-right:5px"
                    placeholder="间隔/小时"
                  ></el-input>
                  <el-button @click="returnClick(scope.$index)">返回</el-button>
                </div>
              </template>
            </el-table-column>-->
          </el-table>
          <!-- <div class="lineBtn">
            <el-button icon="el-icon-plus" @click="addLine" size="mini"></el-button>
            <el-button icon="el-icon-minus" @click="delLine" size="mini"></el-button>
          </div>-->
          <el-table
            :data="childData"
            v-loading="childLoading"
            style="width: 100%;margin-top:10px"
            border
            stripe
            :header-cell-style="{background:'rgb(250, 250, 250)',color: 'rgba(0,0,0,.85)'}"
          >
            <el-table-column prop="taskContent" label="任务名称" align="center" width="180"></el-table-column>
            <el-table-column prop="taskDescribe" label="任务描述" align="center"></el-table-column>
            <el-table-column prop="preStartTime" label="预开始时间" width="180" align="center">
                <template slot-scope="scope">
                <span>{{scope.row.preStartTime.substr(11)}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="preEndTime" label="预结束时间" width="180" align="center">
                <template slot-scope="scope">
                <span>{{scope.row.preEndTime.substr(11)}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="intervalTime" label="间隔/小时" width="100" align="center"></el-table-column>
            <el-table-column prop="executionType" label="执行类型" width="100" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.executionType|executionTypeFl}}</span>
              </template>
            </el-table-column>
          </el-table>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" :loading="pdSub" @click="submitPlan">保 存</el-button>
            <el-button @click="nursingPlanCancel">取 消</el-button>
          </div>
        </el-dialog>
      </div>
      <!-- 任务新增跳转页面 -->
      <div v-if="newPage" v-loading="newPageLoading">
        <div class="newPageTop" style="padding-left:22px">
          <span>请选择任务来源&nbsp;&nbsp;&nbsp;</span>
          <el-radio-group v-model="taskSource" @change="sourceChange('formList')">
            <el-radio :label="1" border>护理</el-radio>
            <el-radio :label="8" border>任务模板</el-radio>
            <el-radio :label="2" border>项目</el-radio>
          </el-radio-group>
        </div>
        <div v-if="taskSource==2" class="newPageProject" style="margin-top:20px;padding-left:92px">
          <span style="display:inline-block;color: #606266;margin-top:15px">项目</span>
          <div style="display:inline-block;width:95%; vertical-align:top;">
            <el-collapse v-model="activeNames" :accordion="true" style="margin-left:10px">
              <el-collapse-item>
                <el-collapse :accordion="true">
                  <el-collapse-item
                    v-for="(item,index) in  projectList"
                    :key="index"
                    :name="index + 1"
                    :title="item[0].projectType | projectType"
                  >
                    <el-button
                      v-for="(i,index1) in item"
                      v-model="projectName"
                      :key="index1"
                      :type="i.flag?'primary':''"
                      style="margin-top:10px;margin-left:10px"
                      @click="itemBtn(i,i.projectId)"
                    >{{i.projectName}}</el-button>
                  </el-collapse-item>
                </el-collapse>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
        <div v-if="taskSource==8" class="newPageTemplate" style="margin-top:20px;padding-left:62px">
          <span style="display:inline-block;color: #606266;margin-top:15px">任务模板</span>
          <div style="display:inline-block;width:95%; vertical-align:top;">
            <el-collapse v-model="activeNames" :accordion="true" style="margin-left:12px">
              <el-collapse-item>
                <el-button
                  v-for="(k,index2) in taskTemplateArr"
                  v-model="projectName"
                  :key="index2"
                  :type="k.flag?'primary':''"
                  style="margin-top:10px;margin-left:10px"
                  @click="templateBtn(k)"
                >{{k.templateContent}}</el-button>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
        <div style="margin-top:20px;padding-left:10px">
          <!-- 任务新增表单 -->
          <el-form ref="formList" :model="formList" :rules="rules">
            <el-form-item :label-width="formLabelWidth" label="患者姓名" prop="patientId">
              <el-select
                v-model="formList.patientId"
                placeholder="患者姓名"
                class="edit_input"
                @change="patIdChange(formList.patientId)"
              >
                <el-option
                  v-for="item in patientNames"
                  :key="item.patientName"
                  :label="item.patientName +item.bedName"
                  :value="item.patientId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth" label="任务名称" prop="taskName">
              <el-col :span="22">
                <el-input
                  v-model="formList.taskName"
                  class="input-with-select"
                  :disabled="taskDisabled||taskDisa"
                ></el-input>
              </el-col>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth" label="任务描述" prop="taskDescribe">
              <el-col :span="22">
                <el-input
                  v-model="formList.taskDescribe"
                  auto-complete="off"
                  :disabled="taskDisabled"
                ></el-input>
              </el-col>
            </el-form-item>

            <el-form-item
              :label-width="formLabelWidth"
              v-model="formList.emergency"
              :span="22"
              label="紧急程度"
              prop="emergency"
            >
              <el-button
                style="margin-left:10px"
                :type="formList.emergency==1?'primary':''"
                @click="normalClickAdd()"
                :value="1"
              >正常</el-button>
              <el-button
                style="margin-left:10px"
                :type="formList.emergency==2?'primary':''"
                @click="urgentClickAdd()"
                :value="2"
              >加急</el-button>
              <el-button
                style="margin-left:10px"
                :type="formList.emergency==3?'primary':''"
                @click="urgencyClickAdd()"
                :value="3"
              >紧急</el-button>
            </el-form-item>
            <!-- <el-form-item
              :label-width="formLabelWidth"
              v-model="formList.state"
              :span="22"
              label="任务性质"
              prop="state"
            >
              <el-button
                style="margin-left:10px"
                :type="formList.state==1?'primary':''"
                @click="normalStateAdd()"
                :value="1"
              >正常任务</el-button>
              <el-button
                style="margin-left:10px"
                :type="formList.state==-1?'primary':''"
                @click="startEndStateAdd()"
                :value="-1"
              >开始即结束</el-button>
            </el-form-item>-->
            <el-form-item :label-width="formLabelWidth" prop="executionType" label="执行类型">
              <el-button
                style="margin-left:10px"
                :type="formList.executionType==1?'primary':''"
                @click="executeBtn()"
                :value="1"
              >执行</el-button>
              <el-button
                style="margin-left:10px"
                :type="formList.executionType==0?'primary':''"
                @click="remindBtn()"
                :value="0"
              >提醒</el-button>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth" label="预开始时间" prop="preStartTime">
              <el-col :span="22">
                <el-date-picker
                  v-model="formList.preStartTime"
                  type="datetime"
                  placeholder="选择预开始时间"
                  :picker-options="pickerOptions"
                  @change="stateTimeChange()"
                ></el-date-picker>
              </el-col>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth" label="预结束时间" prop="preEndTime">
              <el-col :span="22">
                <el-date-picker
                  v-model="formList.preEndTime"
                  type="datetime"
                  placeholder="选择预结束时间"
                  :picker-options="pickerOptions"
                  :disabled="formList.state==-1"
                ></el-date-picker>
              </el-col>
            </el-form-item>
          </el-form>
        </div>
        <div class="content">
          <el-button
            style="margin-left:5%"
            type="primary"
            @click="handleSave('formList')"
            :loading="pdSub"
          >提交</el-button>
          <el-button @click="closeAdd('formList')">返回</el-button>
        </div>
      </div>
    </div>
    <templateComponent
      v-if="!componentFlag"
      :templateType="templateType"
      :changecomponentFlag="changecomponentFlag"
      :patientId="patientId"
      :patientName="name"
    ></templateComponent>
  </div>
</template>

<script>
import {
  addObj,
  delObj,
  fetchList,
  putObj,
  putState,
  putAll,
  getTaskTemplate,
  addTasks,
  addTiming,
  fetchInfo,
  getProject,
  getDict,
  selectProjectValue,
  getNurse,
  assistNurse,
  taskEntrust,
  getDetails,
  getState,
  getRapidTask,
  getTemplateProjectValue,
  postInsertTemplate,
  breakUp,
  getTemplate,
  getSubTask,
  getasktType
} from "@/api/icu/nurse/taskList";
import { dateFormat } from "@/util/date";
import { mapGetters, mapState } from "vuex";
import { constants } from "buffer";
import templateComponent from "@/views/icu/nursingRecord/templateComponent";
let that;
export default {
  name: "taskList",
  components: {
    templateComponent
  },
  props: {
    messages: Object,
    parents: Object,
    patientFlag: Boolean
  },
  filters: {
    projectType: data => {
      for (var i in that.dictionary) {
        if (that.dictionary[i].value == data) {
          return that.dictionary[i].label;
        }
      }
    },
    typeFl: data => {
      switch (data) {
        case 0:
          return "临时";
        case 1:
          return "长期";
      }
    },
    fromObj: data => {
      for (var i in that.typeList) {
        if (that.typeList[i].value == data) {
          return that.typeList[i].label;
        }
      }
      // switch (data) {
      //   case 1:
      //     return "护理";
      //   case 2:
      //     return "项目";
      //   case 3:
      //     return "模板自建";
      //   case 4:
      //     return "模板项目";
      //   case 5:
      //     return "医嘱";
      //   case 6:
      //     return "医嘱项目";
      //   case 7:
      //     return '医嘱自建';
      //     case 8:
      //     return '模板';
      //     case 9:
      //     return '快捷模板';
      //     case 10:
      //     return '快捷模板项目';
      //     case 11:
      //     return '快捷模板自建';
      //   default:
      // }
    },
    stateFl: data => {
      for (let i in that.stateList) {
        if (data == that.stateList[i].value) {
          return that.stateList[i].label;
        }
      }
    },
    executionTypeFl: data => {
      switch (data) {
        case 0:
          return "提醒";
        case 1:
          return "执行";
      }
    },
    emergencyFl: data => {
      switch (data) {
        case 1:
          return "● 正常";
        case 2:
          return "● 加急";
        case 3:
          return "● 紧急";
        default:
          return "● 正常";
      }
    }
  },
  watch: {
    messages: {
      handler(newValue, oldValue) {
        this.patientId = newValue.patientId;
        this.name = newValue.name
        let params = {
          size: this.pageSize,
          current: 1,
          patientId: newValue.patientId,
          state: this.value2
        };
        this.getList(params);
      },
      deep: true
    },
    patientMessage: {
      handler(newValue, oldValue) {
        this.patientInfo = JSON.parse(JSON.stringify(newValue))
        this.searchTask(this.patientInfo.patientId, 4);
      }
    }
  },

  data() {
    var validateDosage = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用量'));
      } else
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字类型'));
        } else
          if (value <= 0) {
            callback(new Error('用量不能小于等于0'));
          } else
            if (value >= this.oldTask.dosage) {
              callback(new Error('用量不能大于等于原任务用量'));
            } else {
              callback()
            }
    };
    return {
      childLoading: false,
      childData: [],
      templateType: '',
      //拆分任务
      newTaskRules: {
        dosage: [
          { validator: validateDosage, trigger: 'blur' }
        ],
      },
      oldTask: {},
      newTask: {},
      breakUpVis: false,
      pickerOptions: {
        // 限制时间
        // selectableRange: ['22:00:00 - 23:59:59','00:00:00 - 02:00:00'],
        // 限制日期
        disabledDate: this.disabledDate
      },
      exeOptions: [
        {
          label: "提醒",
          value: 0
        },
        {
          label: "执行",
          value: 1
        }
      ],
      nurseNames: [],
      parentCode: "nurseIndex",
      // <!-- 快捷任务完成描述 -->
      rapidIf: false,
      repaidLoading: false,
      repaidSubObj: {},
      repaidVis: false,
      repaidResult: "",
      projectValueList: [],
      rapidTaskData: [],
      taskDisa: false,
      stateList: [],
      nurseLoading: false,
      flag: false,
      detailsIf: false,
      dialogAssigned: false,
      allNurse: [],
      onDutyNurse: [],
      assignedObj: {},
      planLoading: false,
      allNurseIf: false,
      entrustNurse: "",
      assignedLoading: false,
      btnDescription: "当班护士",
      nurseId: "",
      dictionary: [],
      projectName: "",
      projectList: {},
      newPage: false,
      isFullscreen: false,
      screenWidth: document.body.clientWidth, // 屏幕尺寸
      soptTaskVis: false,
      activeNames: ["0"],
      resultList: [],
      taskSource: 1,
      newPageLoading: false,
      stopArr: [],
      seen: "",
      pdSub: false,
      patientId: "",
      // 详情数据
      detailsArr: {},
      // 全部接收数组
      receiveArr: [],
      //患者姓名
      patientNames: [],
      //任务模板数组
      taskTemplateArr: [],
      select: "",
      taskDisabled: false,
      loading: false,
      name: "",
      ActBtn: 0,
      formList: {
        taskName: "",
        patientId: "",
        state: 1,
        taskDescribe: "",
        emergency: 1,
        preStartTime: "",
        preEndTime: "",
        taskType: 2,
        executionType: 1
      },
      formLib: {
        taskName: "",
        patientId: "",
        state: "",
        taskDescribe: "",
        emergency: "",
        preStartTime: "",
        preEndTime: ""
      },
      rules: {
        patientId: [
          { required: true, message: "请选择患者", trigger: "change" }
        ],
        taskName: [
          { required: true, message: "请填写任务名称", trigger: "blur" }
        ],
        taskDescribe: [
          { required: true, message: "请填写任务描述", trigger: "blur" }
        ],
        emergency: [
          { required: true, message: "请选择紧急程度", trigger: "change" }
        ],
        state: [
          { required: true, message: "请选择任务性质", trigger: "change" }
        ],
        preStartTime: [
          {
            required: true,
            message: "请选择预开始时间",
            trigger: "change"
          }
        ],
        preEndTime: [
          {
            required: true,
            message: "请选择预结束时间",
            trigger: "change"
          }
        ],
        executionType: [
          { required: true, message: "请选择执行类型", trigger: "change" }
        ]
      },
      result: "",
      resultState: [],
      pageSize: 10,
      currentPage: 1,
      total: 0,
      value: "",
      value2: "",
      overLoading: true,
      formLabelWidth: "120px",
      dialogTable: false,
      dialogTableVisible: false,
      dialogFormVisible: false,
      dialogAddVisible: false,
      dialogcompleteVisible: false,

      page: "",
      tableData: [],
      tableDatas: [],

      options2: [
        {
          value: "1",
          label: "预执行"
        },
        {
          value: "3",
          label: "已完成"
        },
        {
          value: "4",
          label: "已暂停"
        },
        {
          value: "5",
          label: "已出科"
        }
      ],
      state: "",
      editTask: {
        id: "",
        taskName: "",
        taskDescribe: "",
        state: "",
        preStartTime: "",
        preEndTime: "",
        patientRecordsId: "",
        emergency: "",
        per: ""
      },
      DisID: "",
      // 护理计划
      none: false,
      nursingPlan: false,
      planValue: [],
      cycleBtn: true, //循环
      submitPlanArr: [],
      submitTaskArr: [],
      patientId: "",
      planData: [
        {
          task: "",
          start: "",
          end: "",
          cycle: 0,
          intervalTimes: "",
          name: "",
          planValue: ""
        }
      ],
      componentFlag: true,
      patientInfo: {},
      typeList: []
    };
  },
  computed: {
    ...mapGetters(["permissions", "nurse_patients", "dep_patients", "patientMessage", "all_patients", "nurseIndexFlag"]),
    ...mapState({
      roleCodes: state => state.user.roleCodes
    }),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permissions.icu_task_add, false),
        delBtn: this.vaildData(this.permissions.icu_task_del, false),
        editBtn: this.vaildData(this.permissions.icu_task_edit, false)
      };
    }
  },
  created() {
    getasktType().then(response => {
      this.typeList = response.data.data
    })
    getRapidTask().then(response => {
      // console.log(response.data.data)
      this.rapidTaskData = response.data.data;
      if (this.rapidTaskData.length < 1) {
      } else {
        this.rapidIf = true;
      }
      // console.log(response.data.data)
    });
    var params = {};
    if (this.parents != undefined) {
      this.parentCode = this.parents.code;
      this.patientId = JSON.parse(sessionStorage.getItem("pigx-patientMessage")).content.patientId
      params = {
        patientId: this.patientId
      };
    }
    if (this.messages != undefined) {
      if (this.messages.patientId) {
        this.patientId = this.messages.patientId;
        params = {
          patientId: this.messages.patientId
        };
      }
      // if (this.patientFlag) {

      // }else{
      // //    this.patientId = "";
      // //   params = {
      // //     patientId: ""
      // //   };
      // }
    }
    //  this.$forceUpdate();
    this.getList(params);
    getState().then(response => {
      this.stateList = response.data.data;
      // this.$forceUpdate();
    });

    //  this.patientNames = [];
    if (JSON.parse(sessionStorage.getItem("pigx-nurseIndexFlag"))) {
      this.getDepPatients();
    } else {
      this.$store.dispatch("getAllPatients").then(res => {
        this.getDepPatients();
      });
    }


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
  },
  beforeCreate: function () {
    that = this;
  },
  methods: {
    executeBtn() {
      this.formList.executionType = 1
    },
    remindBtn() {
      this.formList.executionType = 0
    },
    //日期处理
    disabledDate(time) {
      return time.getTime() < Date.now() - 8.64e7;
    },
    //调用护理模板
    changecomponentFlag(flag) {
      if (this.patientId != null && this.patientId != '' && this.patientId != 0) {
        this.templateType = flag
        this.componentFlag = !this.componentFlag;
      } else {
        this.$message.warning('请选择患者')
      }
    },
    //临时任务页面获取患者
    getDepPatients() {
      let data = JSON.parse(sessionStorage.getItem("pigx-all_patients"))
        .content;
      this.patientNames = data;
      this.patientInfo = JSON.parse(
        sessionStorage.getItem("pigx-patientMessage")
      ).content;
      if (this.patientInfo) {
        this.patientId = this.patientInfo.patientId;
      } else {
        this.patientId = null;
      }
      // console.log(data)
      if (data == undefined || data == null) {
        this.$message.warning('没有患者')
      }
      if (this.roleCodes == "ROLE_NURSE") {
        fetchInfo().then(response => {
          this.nurseId = response.data.data.nurseId;
        });
      }
      if (this.parentCode == "matronTask") {
        this.$store.dispatch("getPatientsByDep").then(response => {
          this.nurseNames = this.dep_patients.nurses;
        });
      }
      this.$store.commit('SET_NURSEINDEXFLAG', true)
    },
    //判断时间
    compareTime(flag, row) {
      if (row.end != "" && row.start != "") {
        if (row.start > row.end) {
          this.$message({
            showClose: true,
            message: "开始时间晚于结束时间",
            type: "warning"
          });
          if (flag == 1) {
            row.start = "";
          } else {
            row.end = "";
          }
        }
      }
    },
    // <!-- 快捷任务完成描述 -->
    next() {
      this.rapidTaskData.push(this.rapidTaskData.shift());
    },
    prev() {
      this.rapidTaskData.unshift(this.rapidTaskData.pop());
    },
    repaidClick(task) {
      console.log(task);
      this.repaidSubObj = JSON.parse(JSON.stringify(task));
      // this.repaidSubObj.templateSourceItemsId = task.taskTypeId
      // this.repaidSubObj.taskTypeId = task.taskTemplateId
      // this.repaidSubObj.taskName = task.templateContent
      // this.repaidSubObj.taskDescribe = task.templateDescribe
      if (
        this.patientId == "" ||
        this.patientId == null ||
        this.patientId == undefined
      ) {
        this.$message({
          type: "warning",
          showClose: true,
          message: "请选择患者后再进行操作"
        });
        return;
      } else {
        this.repaidSubObj.patientId = this.patientId;
      }
      this.repaidVis = true;
      // console.log(task)
      this.repaidLoading = true;
      getTemplateProjectValue(task).then(response => {
        // console.log(response.data.data.data)
        this.projectValueList = response.data.data.data;
        this.repaidLoading = false;

        this.repaidSubObj.templateSourceItemsId;
      });
    },
    repaidBtn(item, projectRecordValueId) {
      for (let i in this.projectValueList[0].projectRecordValues) {
        if (
          projectRecordValueId ==
          this.projectValueList[0].projectRecordValues[i].projectRecordValueId
        ) {
          if (this.projectValueList[0].projectRecordValues[i].flag == true) {
            this.projectValueList[0].projectRecordValues[i].flag = false;
            this.repaidResult = "";
            this.repaidSubObj.recordValue = "";
            this.repaidSubObj.dataFlag = "";
          } else {
            this.projectValueList[0].projectRecordValues[i].flag = true;
            this.repaidResult = this.projectValueList[0].projectRecordValues[
              i
            ].recordValue;
            this.repaidSubObj.recordValue = this.projectValueList[0].projectRecordValues[
              i
            ].recordValue;
            this.repaidSubObj.dataFlag = this.projectValueList[0].projectRecordValues[
              i
            ].dataFlag;
          }
        } else {
          this.projectValueList[0].projectRecordValues[i].flag = false;
        }
      }
      this.$forceUpdate();
    },
    submitRepaidResult() {
      // console.log(this.repaidSubObj)
      // console.log(this.repaidResult)
      // return
      if (this.repaidSubObj.source == 2 || this.repaidSubObj.source == 4 || this.repaidSubObj.source == 6 || this.repaidSubObj.source == 10) {
        if (this.repaidResult == "" || this.repaidResult == null) {
          this.$message({
            type: "warning",
            showClose: true,
            message: "与项目相关联的任务必须有任务结果"
          });
          return;
        }
        if (this.projectValueList != null && this.repaidResult == "") {
          this.$message({
            type: "warning",
            showClose: true,
            message: "请选择任务结果"
          });
          return;
        }
      }


      // return;
      this.pdSub = true;
      this.repaidSubObj.result = this.repaidResult;
      // console.log(this.repaidSubObj)
      // this.repaidSubObj.source = 
      // return
      postInsertTemplate(this.repaidSubObj)
        .then(data => {
          this.$message({
            showClose: true,
            message: "任务已完成",
            type: "success"
          });
          this.pdSub = false;
          this.repaidVis = false;
          let params = new URLSearchParams();
          params.append("size", this.pageSize);
          params.append("current", this.currentPage);
          params.append("state", this.value2);
          if (this.patientId !== "" && this.patientId !== null) {
            params.append("patientId", this.patientId);
          }
          this.getList(params);
        })
        .catch(() => {
          this.pdSub = false;
        });
    },
    clearRepaidResult() {
      this.repaidResult = "";
      this.projectValueList = [];
      this.pdSub = false;
    },
    // 指派护士
    assigned(row) {
      for (let i in this.tableDatas) {
        if (row.id == this.tableDatas[i].id) {
          this.assignedObj = this.tableDatas[i];
        }
      }
      this.dialogAssigned = true;
      this.nurseLoading = true;
      getNurse().then(response => {
        this.onDutyNurse = response.data.data.byDate;
        this.allNurse = response.data.data.nurses;
        this.nurseLoading = false;
      });
    },
    assignedSwitch() {
      if (this.flag == true) {
        for (let i in this.allNurse) {
          this.allNurse[i].flag = false;
        }
        this.entrustNurse = "";
        this.allNurseIf = false;
        this.flag = false;
        // this.btnDescription = "当班护士";
      } else {
        for (let i in this.onDutyNurse) {
          this.onDutyNurse[i].flag = false;
        }
        this.entrustNurse = "";
        this.allNurseIf = true;
        this.flag = true;
        // this.btnDescription = "所有护士";
      }
    },
    assignedClose() {
      this.nurseLoading = false;
      this.entrustNurse = "";
      this.allNurseIf = false;
      this.flag = false;
      // this.btnDescription = "当班护士";
      this.assignedObj = {};
      for (let i in this.allNurse) {
        this.allNurse[i].flag = false;
      }
      for (let i in this.onDutyNurse) {
        this.onDutyNurse[i].flag = false;
      }
    },
    assignedClick(item) {
      if (this.allNurseIf == false) {
        for (let i in this.onDutyNurse) {
          if (item.id == this.onDutyNurse[i].id) {
            this.onDutyNurse[i].flag = true;
            this.entrustNurse = item.nurseId;
          } else {
            this.onDutyNurse[i].flag = false;
          }
        }
      } else {
        for (let i in this.allNurse) {
          if (item.id == this.allNurse[i].id) {
            this.allNurse[i].flag = true;
            this.entrustNurse = item.nurseId;
          } else {
            this.allNurse[i].flag = false;
          }
        }
      }
      this.$forceUpdate();
    },
    assignedSave() {
      this.assignedLoading = true;
      let assistNurseObj = {
        patientId: this.assignedObj.patientId,
        nurseId: this.entrustNurse
      };
      this.assignedObj.receptionNurseId = this.entrustNurse;
      assistNurse(assistNurseObj)
        .then(response => {
          // console.log("关联成功");
          taskEntrust(this.assignedObj)
            .then(response => {
              this.$message({
                type: "success",
                showClose: true,
                message: "指派成功"
              });
              this.assignedLoading = false;
              this.dialogAssigned = false;
              let params = new URLSearchParams();
              params.append("size", this.pageSize);
              params.append("current", this.currentPage);
              params.append("state", this.value2);
              if (this.patientId !== "" && this.patientId !== null) {
                params.append("patientId", this.patientId);
              }
              if (this.parentCode == "matronTask") {
                if (this.nurseId != null && this.nurseId != '') {
                  params.append("associatedNurse", this.nurseId);
                }
              }
              this.getList(params);
            })
            .catch(() => {
              this.assignedLoading = false;
              this.dialogAssigned = false;
            });
        })
        .catch(() => {
          this.assignedLoading = false;
          this.dialogAssigned = false;
        });
    },
    assignedCancel() {
      this.dialogAssigned = false;
    },
    // 任务详情按钮
    details(row) {
      // console.log(row.taskId)
      this.dialogTableVisible = true;
      this.detailsIf = true;
      getDetails(row.id).then(response => {
        this.detailsArr = response.data.data;
        if (
          this.detailsArr.hisDoctorsAdviceVo == undefined ||
          this.detailsArr.hisDoctorsAdviceVo == null
        ) {
          this.detailsArr.projectList = [];
        } else {
          this.detailsArr.projectList = this.detailsArr.hisDoctorsAdviceVo.projectList;
        }
        // console.log(this.detailsArr)
        this.detailsIf = false;
        this.dialogTable = true;
      });
    },
    viewClose() {
      this.detailsIf = false;
      this.dialogTable = false;
      this.detailsArr = [];
    },
    // 表单中任务状态改变按钮
    stateChange(state) {
      if (state == 3) {
        this.formList.preStartTime = new Date();
        this.formList.preEndTime = new Date();
      }
    },
    //  分页事件
    handleSizeChange(val) {
      this.pageSize = val;
      let params = new URLSearchParams();
      params.append("size", this.pageSize);
      params.append("current", this.currentPage);
      if (this.patientId !== "" && this.patientId !== null) {
        params.append("patientId", this.patientId);
      }
      if (this.nurseId !== "" && this.nurseId !== null) {
        params.append("nurseId", this.nurseId);
      }
      this.getList(params);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      let params = new URLSearchParams();
      params.append("size", this.pageSize);
      params.append("current", this.currentPage);
      if (this.patientId !== "" && this.patientId !== null) {
        params.append("patientId", this.patientId);
      }
      if (this.nurseId !== "" && this.nurseId !== null) {
        params.append("nurseId", this.nurseId);
      }
      this.getList(params);
    },

    // 新增按钮
    addTaskClick() {
      this.newPage = true;
      this.newPageLoading = true;
      getTemplate().then(response => {
        this.taskTemplateArr = response.data.data;
      });
      getProject().then(response => {
        this.projectList = response.data.data;
        this.newPageLoading = false;
      });
      getDict().then(res => {
        this.dictionary = res.data.data;
      });
      if (this.patientId != "" && this.patientId != null) {
        this.formList.patientId = this.patientId;
      } else {
        this.formList.patientId = "";
      }
      this.$forceUpdate();
      this.dialogAddVisible = true;
    },
    patIdChange(patientId) { },
    closeAdd(formList) {
      this.closeDialog(formList);
      this.formList.patientId = "";
      this.newPage = false;
      this.taskSource = 2;
      let params = new URLSearchParams();
      params.append("size", this.pageSize);
      params.append("state", this.value2);
      params.append("current", 1);
      if (this.patientId !== "" && this.patientId !== null) {
        params.append("patientId", this.patientId);
      }
      if (this.parentCode == "matronTask") {
        if (this.nurseId != "" && this.nurseId != null) {
          params.append("associatedNurse", this.nurseId);
        }
      }
      this.getList(params);
    },
    sourceChange(formList) {
      let formPatId = this.formList.patientId;
      this.$refs[formList].resetFields();
      // this.formList.patientId = "";
      this.formList.patientId = formPatId;
      this.activeNames = [];
      this.formList.taskType = this.taskSource;

      if (this.formList.taskType == 8) {
        this.taskDisabled = true;
      } else if (this.formList.taskType == 4) {
        this.taskDisa = true;
        this.taskDisabled = false;
      } else {
        this.taskDisabled = false;
        this.taskDisa = false;
      }
      // console.log(this.formList);
    },
    itemBtn(item, id) {
      for (var i in this.projectList) {
        for (var j in this.projectList[i]) {
          if (this.projectList[i][j].projectId == item.projectId) {
            if (!this.projectList[i][j].flag) {
              this.projectList[i][j].flag = true;
              this.formList.taskTypeId = item.projectId;
              this.formList.taskName = item.projectName;
            } else {
              this.projectList[i][j].flag = false;
              this.formList.taskTypeId = "";
              this.formList.taskName = "";
            }
          } else {
            this.projectList[i][j].flag = false;
          }
        }
      }
      this.$forceUpdate();
    },
    resBtn(item, projectRecordValueId) {
      for (let i in this.resultList[0].projectRecordValues) {
        if (
          projectRecordValueId ==
          this.resultList[0].projectRecordValues[i].projectRecordValueId
        ) {
          if (this.resultList[0].projectRecordValues[i].flag == true) {
            this.resultList[0].projectRecordValues[i].flag = false;
            this.result = "";
            this.resultState.recordValue = "";
            this.resultState.dataFlag = "";
          } else {
            this.resultList[0].projectRecordValues[i].flag = true;
            this.result = this.resultList[0].projectRecordValues[i].recordValue;
            this.resultState.recordValue = this.resultList[0].projectRecordValues[
              i
            ].recordValue;
            this.resultState.dataFlag = this.resultList[0].projectRecordValues[
              i
            ].dataFlag;
          }
        } else {
          this.resultList[0].projectRecordValues[i].flag = false;
        }
      }
      this.$forceUpdate();
    },
    templateBtn(k) {
      for (var i in this.taskTemplateArr) {
        if (this.taskTemplateArr[i].id == k.id) {
          if (!this.taskTemplateArr[i].flag) {
            this.taskTemplateArr[i].flag = true;
            this.formList.taskName = this.taskTemplateArr[i].templateContent;
            this.formList.taskDescribe = this.taskTemplateArr[i].templateDescribe;
            this.formList.taskTypeId = this.taskTemplateArr[
              i
            ].templateId;
          } else {
            this.taskTemplateArr[i].flag = false;
            this.formList.taskName = "";
            this.formList.taskDescribe = "";
            this.formList.taskTypeId = "";
          }
        } else {
          this.taskTemplateArr[i].flag = false;
        }
      }
      this.$forceUpdate();
    },
    clearResult() {
      this.result = "";
      this.resultList = [];
      this.pdSub = false;
    },
    // 任务新增
    handleSave(formList) {
      // console.log(this.formList);
      if (
        this.formList.taskType == 2 &&
        (this.formList.taskTypeId == "" ||
          this.formList.taskTypeId == undefined ||
          this.formList.taskTypeId == null)
      ) {
        this.$message({
          type: "warning",
          showClose: true,
          message: "请选择项目"
        });
        return;
      }
      if (
        this.formList.taskType == 8 &&
        (this.formList.taskTypeId == "" ||
          this.formList.taskTypeId == undefined ||
          this.formList.taskTypeId == null)
      ) {
        this.$message({
          type: "warning",
          showClose: true,
          message: "请选择任务模板"
        });
        return;
      }
      this.$refs[formList].validate(valid => {
        if (valid) {
          if (
            new Date(this.formList.preStartTime).getTime() <=
            new Date(this.formList.preEndTime).getTime()
          ) {
            this.formList.preStartTime = dateFormat(this.formList.preStartTime);
            this.formList.preEndTime = dateFormat(this.formList.preEndTime);
            this.pdSub = true;
            addObj(this.formList)
              .then(data => {
                this.$message({
                  showClose: true,
                  message: "添加成功",
                  type: "success"
                });
                this.pdSub = false;
                // this.dialogAddVisible = false;
                this.closeAdd(formList);
                let params = new URLSearchParams();
                params.append("size", this.pageSize);
                params.append("current", this.currentPage);
                if (this.patientId !== "" && this.patientId !== null) {
                  params.append("patientId", this.patientId);
                }
                this.getList(params);
              })
              .catch(() => {
                this.pdSub = false;
              });
          } else {
            this.$message({
              showClose: true,
              message: "结束时间不能小于开始时间",
              type: "error"
            });
            return;
          }
        } else {
          return false;
        }
      });
    },
    // 预定护理计划
    closePlan() {
      this.submitPlanArr = [];
      this.submitTaskArr = [];
      this.planValue = [];
      this.childLoading = false
      this.childData = []
      this.planData = [
        {
          task: "",
          start: "",
          end: "",
          cycle: 0,
          intervalTimes: "",
          name: "",
          planValue: ""
        }
      ];
    },
    // 预定护理计划
    addPlan() {
      if (this.patientNames.length > 0) {
        this.patName = this.patientNames[0].patientId;
        this.ActBtn = 0;
        // for (let i in this.patientNames) {
        //   if (this.patientNames[i].patientId == this.patientId) {
        //     this.ActBtn = i;
        //     this.patName = this.patientNames[i].patientId;
        //   }
        // }
      } else {
        this.$message.warning('没有患者')
        // this.patientId = this.patientNames[0].patientId;
        // this.ActBtn = 0;
      }

      this.nursingPlan = true;
      this.planLoading = true;
      getTemplate().then(response => {
        this.taskTemplateArr = response.data.data;
        this.planLoading = false;
      });
    },
    //拆分任务
    refNewTask() {
      if (this.newTask.dosage >= this.oldTask.dosage) {
        this.newTask.dosage = ""
      }
      if (this.newTask.dosage <= 0) {
        this.newTask.dosage = ""
      }
      if (!Number.isInteger(this.newTask.dosage)) {
        this.newTask.dosage = ""
      }
    },
    breakUpTask(row) {
      for (let i in this.tableDatas) {
        if (row.id == this.tableDatas[i].id) {
          this.oldTask = this.tableDatas[i]
        }
      }
      // console.log(this.oldTask.dosage)
      this.newTask = JSON.parse(JSON.stringify(this.oldTask))
      this.newTask.dosage = ""
      this.newTask.id = null
      this.newTask.taskSubTaskId = null
      this.breakUpVis = true
    },
    newDosage($event) {
    },
    subBreakUp(formName) {
      this.$refs[formName].validate((valid) => {

        if (valid) {
          if (this.oldTask.dosage != 0) {
            if (this.newTask.dosage == this.oldTask.dosage || this.newTask.dosage > this.oldTask.dosage) {
              this.$message.warning('新任务用量不能大于等于原任务')
              return
            }
          }
          this.pdSub = true
          let list = []
          list.push(this.oldTask)
          list.push(this.newTask)
          breakUp(list).then(response => {
            this.$message.success('拆分成功')
            this.breakUpVis = false
            this.pdSub = false
            let params = new URLSearchParams();
            params.append("size", this.pageSize);
            params.append("state", this.value2);
            params.append("current", 1);
            if (this.patientId != "" && this.patientId != null) {
              params.append("patientId", this.patientId);
            }
            if (this.parentCode == "matronTask") {
              if (this.nurseId != null && this.nurseId != '') {
                params.append("associatedNurse", this.nurseId);
              }
            }
            this.getList(params)
          }).catch(() => {
            this.pdSub = false
            this.breakUpVis = false
            this.$message.error('拆分出错 请稍后再试')
          })
        } else {
          if (this.newTask.dosage >= this.oldTask.dosage) {
            this.newTask.dosage = ""
          }
          if (this.newTask.dosage <= 0) {
            this.newTask.dosage = ""
          }
          if (!Number.isInteger(this.newTask.dosage)) {
            this.newTask.dosage = ""
          }
          return false;
        }
      });
    },
    breakUpClose() {
      this.$refs['oldTask'].resetFields();
      this.$refs['newTask'].resetFields();
      this.oldTask = {}
      this.newTask = {}
    },
    //  编辑任务取消按钮
    closeEditDialog() {
      this.dialogFormVisible = false;
    },
    // 编辑任务
    taskEditClick(row) {
      this.formLib = [];
      this.dialogFormVisible = true;
      for (let i in this.tableDatas) {
        if (row.id == this.tableDatas[i].id) {
          this.formLib = this.tableDatas[i];
          this.formLib.preStartTime = this.formLib.preStartTime;
          if (this.formLib.preEndTime == null) {
            this.formLib.preEndTime = this.tableDatas[i].preStartTime;
          } else {
            this.formLib.preEndTime = this.tableDatas[i].preEndTime;
          }
        }
      }
    },
    normalClick() {
      this.formLib.emergency = 1;
    },
    normalClickAdd() {
      this.formList.emergency = 1;
    },
    urgentClick() {
      this.formLib.emergency = 2;
    },
    urgentClickAdd() {
      this.formList.emergency = 2;
    },
    urgencyClick() {
      this.formLib.emergency = 3;
    },
    urgencyClickAdd() {
      this.formList.emergency = 3;
    },
    //新增表单中的
    normalStateAdd() {
      this.formList.state = 1;
    },
    startEndStateAdd() {
      this.formList.state = -1;
      if (this.formList.preStartTime != "") {
        this.formList.preEndTime = this.formList.preStartTime;
      }
    },
    stateTimeChange() {
      if (this.formList.state == -1) {
        this.formList.preEndTime = this.formList.preStartTime;
      }
    },
    taskTemplateClear() {
      this.taskDisabled = false;
      this.select = "";
      this.formList = {
        taskName: "",
        patientId: "",
        state: 1,
        taskDescribe: "",
        emergency: 1,
        preStartTime: "",
        preEndTime: "",
        taskType: 2,
        executionType: 1
      };
    },
    //关闭对话框清空form表单的值
    closeDialog(formList) {
      this.pdSub = false;
      this.select = "";
      this.$refs[formList].resetFields();
      this.taskTemplateClear();
      this.taskDisa = false;
      this.taskDisabled = false;
      this.taskTemplateArr = [];
      this.result = "";
    },
    closeDialogEdit(formLib) {
      this.formLib = {
        taskName: "",
        patientName: "",
        state: "",
        taskDescribe: "",
        emergency: "",
        preStartTime: "",
        preEndTime: ""
      };
      this.taskTemplateClear();
      this.taskDisabled = false;
    },
    // 清空筛选条件
    clearform() {
      this.value2 = "";
      this.nurseId = "";
      this.patientId = null
      this.ActBtn = null
      let params = {};
      // params.append("size", this.pageSize);
      // params.append("current", this.currentPage);
      params.size = this.pageSize
      params.current = this.currentPage
      // params.append("patientId", this.patientId);
      params.patientId = this.patientId
      // if (this.parentCode == "nurseIndex" && this.roleCodes == "ROLE_NURSE") {
      //   if (this.patientId !== "" && this.patientId !== null) {

      //   }
      // } else {
      //   this.patientId = "";
      // }
      // console.log(this.patientFlag)
      if (this.patientFlag) {
        this.patientId = this.messages.patientId
        params.patientId = this.patientId
      }
      console.log(params)
      this.getList(params);
    },
    // 任务状态查询
    searchTask(event, judge) {
      if (judge == 4) {
        let val = JSON.parse(JSON.stringify(event))
        if (event) {
          this.patientNames.forEach(item => {
            if (item.patientId == event) {
              this.name = item.patientName
              this.patientId = event;
              // this.$store.commit("SET_MESSAGE", item);
            }
          });
        }
      }
      if (judge == 2) {
        if (event) {
          this.patientNames.forEach(item => {
            if (item.patientId == event) {
              this.name = item.patientName
              this.patientId = event;
              this.$store.commit("SET_MESSAGE", item);
            }
          });
        }
      }
      this.doctorOrdersFlag = true;
      let params = new URLSearchParams();
      params.append("size", this.pageSize);
      params.append("state", this.value2);
      params.append("current", 1);
      if (this.patientId != "" && this.patientId != null) {
        params.append("patientId", this.patientId);
      }
      if (this.parentCode == "matronTask") {
        if (this.nurseId != null && this.nurseId != '') {
          params.append("associatedNurse", this.nurseId);
        }
      }
      this.getList(params);
    },
    // 更改任务状态
    changeStatus(id, state, row) {
      // console.log(row);
      this.result = "";
      this.resultState = [];
      this.patientId = row.patientId;
      if (row.executionType == 1) {
        for (let i in this.tableDatas) {
          if (this.tableDatas[i].id === id) {
            if (state == 1) {
              this.resultState = this.tableDatas[i];
              selectProjectValue(this.tableDatas[i])
                .then(response => {
                  if (response.data.data == null) {
                    this.resultList = [];
                  } else {
                    this.resultList = response.data.data;
                  }
                  this.dialogcompleteVisible = true;
                })
                .catch(() => {
                  this.$message({
                    type: "error",
                    showClose: true,
                    message: "加载失败"
                  });
                });
            }
            if (state == 3) {
              this.$message.success("已完成");
            }
            if (state == 4) {
              this.$confirm("是否继续该任务?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              })
                .then(() => {
                  putState(this.tableDatas[i]).then(data => {
                    this.$message({
                      showClose: true,
                      message: "任务已继续",
                      type: "success"
                    });
                    let params = new URLSearchParams();
                    params.append("size", this.pageSize);
                    params.append("current", this.currentPage);
                    params.append("state", this.value2);
                    if (this.patientId !== "" && this.patientId !== null) {
                      params.append("patientId", this.patientId);
                    }
                    this.getList(params);
                  });
                })
                .catch(() => {
                  this.$message({
                    type: "success",
                    showClose: true,
                    message: "已取消操作"
                  });
                });
            }
            if (state == 5) {
              this.$message({
                type: "warning",
                showClose: true,
                message: "患者已出科或出院"
              });
            }
            if (state == -1) {
              this.resultState = this.tableDatas[i];

              // if (row.taskType == 4) {
              selectProjectValue(this.tableDatas[i])
                .then(response => {
                  if (response.data.data == null) {
                    this.resultList = [];
                  } else {
                    this.resultList = response.data.data;
                  }
                  this.dialogcompleteVisible = true;
                })
                .catch(() => {
                  this.$message({
                    type: "error",
                    showClose: true,
                    message: "加载失败"
                  });
                });
              // } else {
              //   this.dialogcompleteVisible = true;
              // }
            }
          }
        }
      }
      if (row.executionType === 0) {
        for (let i in this.tableDatas) {
          if (this.tableDatas[i].id === id) {
            if (state == 1 || state == -1) {
              this.resultState = this.tableDatas[i]
              this.resultState.result = this.result;
              this.$confirm("是否完成该任务?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              })
                .then(() => {
                  putState(this.resultState)
                    .then(data => {
                      this.$message({
                        showClose: true,
                        message: "任务已完成",
                        type: "success"
                      });
                      // this.pdSub = false;
                      // this.dialogcompleteVisible = false;
                      let params = new URLSearchParams();
                      params.append("size", this.pageSize);
                      params.append("current", this.currentPage);
                      params.append("state", this.value2);
                      if (this.patientId !== "" && this.patientId !== null) {
                        params.append("patientId", this.patientId);
                      }
                      this.getList(params);
                    })
                    .catch(() => {
                    });
                })
            } else {
              this.$message({
                type: "warning",
                showClose: true,
                message: "任务已完成"
              });
            }
          }
        }
      }
    },
    // 任务结果提交
    submitResult() {
      if (this.resultState.taskType == 2 || this.resultState.taskType == 4 || this.resultState.taskType == 6 || this.resultState.taskType == 10) {
        if (this.result == "" || this.result == null) {
          this.$message({
            type: "warning",
            showClose: true,
            message: "与项目相关联的任务必须有任务结果"
          });
          return;
        }
        if (this.resultList.length != 0 && this.result == "") {
          this.$message({
            type: "warning",
            showClose: true,
            message: "请选择任务结果"
          });
          return;
        }
      }

      this.pdSub = true;
      this.resultState.result = this.result;
      putState(this.resultState)
        .then(data => {
          this.$message({
            showClose: true,
            message: "任务已完成",
            type: "success"
          });
          this.pdSub = false;
          this.dialogcompleteVisible = false;
          let params = new URLSearchParams();
          params.append("size", this.pageSize);
          params.append("current", this.currentPage);
          params.append("state", this.value2);
          if (this.patientId !== "" && this.patientId !== null) {
            params.append("patientId", this.patientId);
          }
          this.getList(params);
        })
        .catch(() => {
          this.pdSub = false;
        });
    },
    //暂停描述提交
    submitStopDes() {
      if (this.result == "" || this.result == null) {
        this.$message({
          showClose: true,
          message: "请填写暂停描述",
          type: "warning"
        });
      } else {
        this.pdSub = true;
        this.stopArr.result = this.result;
        putState(this.stopArr)
          .then(data => {
            this.$message({
              showClose: true,
              message: "任务已暂停",
              type: "success"
            });
            this.dialogFormVisible = false;
            this.pdSub = false;
            this.soptTaskVis = false;
            if (
              this.patientId == null ||
              this.patientId == undefined ||
              this.patientId == ""
            ) {
              let params = {
                size: this.pageSize,
                current: this.currentPage
              };
              this.getList(params);
            } else {
              let params = {
                patientId: this.patientId,
                size: this.pageSize,
                current: this.currentPage
              };
              this.getList(params);
            }
          })
          .catch(() => {
            this.pdSub = false;
          });
      }
    },
    getList(params) {
      this.loading = true;
      fetchList(
        // Object.assign(
        //   {
        //     current: this.currentPage,
        //     size: this.pageSize,
        //     patientId: this.patientId
        //   }),
        params
        // this.searchForm
      )
        .then(response => {
          this.tableData = [];
          this.tableDatas = [];
          this.tableDatas = response.data.data.records;
          this.tableData = JSON.parse(JSON.stringify(this.tableDatas));
          this.loading = false;
          this.total = response.data.data.total;
          this.currentPage = response.data.data.current;
          this.pageSize = response.data.data.size;
        })
        .then(() => {
          for (let i in this.tableData) {
            if (this.tableData[i].startTime !== null) {
              this.tableData[i].startTime = this.tableData[i].startTime.substr(
                5,
                11
              );
            }
            if (this.tableData[i].endTime !== null) {
              this.tableData[i].endTime = this.tableData[i].endTime.substr(
                5,
                11
              );
            }
            if (this.tableData[i].receiveTime !== null) {
              this.tableData[i].receiveTime = this.tableData[
                i
              ].receiveTime.substr(5, 11);
            }
            if (this.tableData[i].preStartTime !== null) {
              this.tableData[i].preStartTime = this.tableData[
                i
              ].preStartTime.substr(5, 11);
            }
            if (this.tableData[i].preEndTime !== null) {
              this.tableData[i].preEndTime = this.tableData[
                i
              ].preEndTime.substr(5, 11);
            } else {
              this.tableData[i].preEndTime = this.tableData[i].preStartTime;
            }
          }
        });
    },
    rowDel: function (row, scope) {
      // console.log(scope);
      let index = scope.$index + 1;
      this.$confirm("是否删除序号为  " + index + "  的任务", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function () {
          return delObj(row.id);
        })
        .then(data => {
          this.$message({
            showClose: true,
            message: "删除成功",
            type: "success"
          });
          this.getList();
        });
    },
    //任务编辑
    handleUpdate(formLib) {
      this.$refs[formLib].validate(valid => {
        if (valid) {
          if (
            new Date(this.formLib.preStartTime).getTime() <=
            new Date(this.formLib.preEndTime).getTime()
          ) {
            // this.formLib.preStartTime = dateFormat(this.formLib.preStartTime);
            // this.formLib.preEndTime = dateFormat(this.formLib.preEndTime);
            this.pdSub = true;
            putObj(this.formLib)
              .then(data => {
                this.$message({
                  showClose: true,
                  message: "修改成功",
                  type: "success"
                });
                this.pdSub = false;
                this.dialogFormVisible = false;
                let params = new URLSearchParams();
                params.append("size", this.pageSize);
                params.append("current", this.currentPage);
                params.append("state", this.value2);
                if (this.patientId !== "" && this.patientId !== null) {
                  params.append("patientId", this.patientId);
                }

                this.getList(params);
              })
              .catch(() => {
                this.pdSub = false;
              });
          } else {
            this.$message({
              showClose: true,
              message: "结束时间不能小于开始时间",
              type: "error"
            });
            return;
          }
        } else {
          return false;
        }
      });
    },
    //暂停任务
    stopTask() {
      this.soptTaskVis = true;
      // this.formLib.preStartTime = dateFormat(this.formLib.preStartTime);
      // this.formLib.preEndTime = dateFormat(this.formLib.preEndTime);
      let stopTaskArr = this.formLib;
      stopTaskArr.state = 4;
      this.stopArr = stopTaskArr;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    // 护理计划
    nursingPlanCancel() {
      this.nursingPlan = false;
    },
    patientName(item, index) {
      this.ActBtn = index;
      this.patName = item.patientId;
    },
    //护理计划提交
    taskTempChange(row) {
      // console.log(row);
      this.childLoading = true
      for (let i in this.taskTemplateArr) {
        if (row.planValue == this.taskTemplateArr[i].templateId) {
          row.result = this.taskTemplateArr[i].result;
          row.taskName = this.taskTemplateArr[i].templateContent;
          row.taskDescribe = this.taskTemplateArr[i].templateDescribe;
          row.taskType = 3;
        }
      }
      getSubTask(row.planValue).then(response => {
        this.childData = response.data.data
        this.childLoading = false
      })
    },
    submitPlan() {
      // this.submitPlanArr = [];
      // this.submitTaskArr = [];
      var ifCon = false;
      for (let i in this.planData) {
        if (this.planData[i].planValue !== "") {
          ifCon = true;
          for (let j in this.taskTemplateArr) {
            if (
              this.planData[i].planValue ==
              this.taskTemplateArr[j].templateId
            ) {
              this.planData[i].result = this.taskTemplateArr[j].result;
              this.planData[i].taskName = this.taskTemplateArr[j].templateContent;
              this.planData[i].taskDescribe = this.taskTemplateArr[
                j
              ].templateDescribe;
              this.planData[i].taskType = 8;
              this.planData[i].executionType = 1;

              this.planData[i].patientId = this.patName;
            }
          }
          if (this.planData[i].start == "" || this.planData[i].start == null) {
            this.$message({
              type: "error",
              showClose: true,
              message: "请输入预执行开始时间"
            });
            return;
          } else {
            if (this.planData[i].end == "" || this.planData[i].end == null) {
              this.$message({
                type: "error",
                showClose: true,
                message: "请输入预执行结束时间"
              });
              return;
            } else {
              if (
                new Date(this.planData[i].end).getTime() <=
                new Date(this.planData[i].start).getTime()
              ) {
                this.$message({
                  type: "warning",
                  showClose: true,
                  message: "结束时间不能小于开始时间"
                });
                return;
              }
              if (this.planData[i].cycle == 1) {
                this.planData[i].taskType = 8;
                this.planData[i].sourceId = this.planData[i].planValue;
                this.planData[i].patientId = this.patName;
                this.planData[i].preStartTime = this.planData[i].start;
                this.planData[i].preEndTime = this.planData[i].end;
                // this.planData[i].templateId = this.planData[i].planValue;
                // this.submitPlanArr.push(this.planData[i]);
                // }
              }
              if (this.planData[i].cycle == 0) {
                // 短期任务
                this.planData[i].taskType = 8;
                this.planData[i].patientId = this.patName;
                this.planData[i].preStartTime = this.planData[i].start;
                this.planData[i].preEndTime = this.planData[i].end;
                this.planData[i].taskTypeId = this.planData[i].planValue;
                // this.submitTaskArr.push(this.planData[i]);
                this.pdSub = true;
                addTasks(this.planData[0])
                  .then(response => {
                    this.$message({
                      type: "success",
                      showClose: true,
                      message: "短期任务添加成功"
                    });
                    this.pdSub = false;
                    this.nursingPlan = false;
                    this.childLoading = false
                    let params = new URLSearchParams();
                    params.append("size", this.pageSize);
                    params.append("current", this.currentPage);
                    if (this.patientId !== "" && this.patientId !== null) {
                      params.append("patientId", this.patientId);
                    }
                    this.getList(params);
                  })
                  .catch(() => {
                    this.pdSub = false;
                  });
              }
            }
          }
        } else {
        }
      }
      if (ifCon == false) {
        this.$message({
          type: "error",
          showClose: true,
          message: "请最少输入一项任务"
        });
      }
    },
    cycleClick(index1) {
      this.planData.forEach((item, index) => {
        if (index === index1) {
          item.cycle = 1;
          // item.start = "";
          // item.end = "";
        }
      });
    },
    returnClick(index1) {
      this.planData.forEach((item, index) => {
        if (index === index1) {
          item.cycle = 0;
          // item.start = "";
          // item.end = "";
        }
      });
    },
    addLine(row, index) {
      var list = {
        task: "",
        start: "",
        end: "",
        cycle: 0,
        intervalTimes: "",
        name: "",
        planValue: ""
      };
      this.planData.push(list);
    },
    delLine(row, index) {
      if (this.planData.length === 1) {
        this.$message({
          showClose: true,
          type: "warning",
          message: "已达到最小行数"
        });
      } else {
        this.planData.splice(this.planData.length - 1, 1);
      }
    }
  }
};
</script>
<style  lang="scss" scoped >
button.btn {
  line-height: 0px !important;
}
.cell {
  color: #000 !important;
}

.nursePatients {
  margin-top: 24px;
  padding-top: 24px;
  border-top: #eee dashed 1px;
}
.nurseName {
  font-size: 20px;
  font-weight: 500;
}
.nurseInfo > span {
  display: inline-block;
  margin-bottom: 8px;
}
.nursePatients > font {
  margin-bottom: 12px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 600;
  font-size: 15px;
}
.nur_pat_name {
  margin-left: 10%;
}
.nur_pat_name > span {
  display: inline-block;
  margin: 5px 0 10px 10px;
}
.hoverBg {
  color: #1890ff;
  cursor: pointer;
}
#basic-table {
  height: 50%;
}
#basic-table th {
  background: #f7f7f7;
  width: 16%;
  font-size: 12px;
}
#basic-table td {
  color: #8b8b8b;
}
#basic-table td,
#basic-table th {
  padding: 8px;
  border: #ddd solid 1px;
  text-align: center;
  width: 16%;
}

.taskList {
  margin-bottom: 20px;
}
.table {
  margin-top: -20px;
}

.state-0,
.state-1,
.state-2,
.state-4,
.state-5 {
  opacity: 0.8;
  border: none;
}
.state-0 {
  color: #ee5253;
}
.state-1 {
  color: #0abde3;
}
.state-2 {
  color: #f56c6c;
}

.state-4 {
  color: #8395a7;
}
.task-status-1,
.task-status-2,
.task-status-3 {
  position: relative;
  font-weight: 600;
}
// .task-status-1{
//    color: #8395a7;
// }
.task-status-2 {
  color: #ffb749;
}
.task-status-3 {
  color: #f56c6c;
}
.emptyBtn {
  padding: 5px;
}
.edit_input {
  width: 91.5% !important;
}
.task_search {
  // margin-top: 1%;
  margin-bottom: 10px;
  width: 99%;
  margin-left: 0.5%;
}
.task_search > .child {
  float: left;
}
.patientBtnAct {
  background: #409eff !important;
  color: #fff !important;
}
// .current_page_classname /deep/ .el-table__row {
//   td:not(.is-hidden):last-child {
//     right: -1px;
//   }
// }
// .el-table__row {
//   td:not(.is-hidden):last-child {
//     right: -1px;
//   }
// }
.el-select {
  width: 130px;
}
.lineBtn {
  margin-top: 1%;
  padding-left: 43.1%;
}
@media screen and (max-width: 1024px) {
  .task_select {
    width: 96%;
    margin-left: 10px;
    margin-bottom: 20px;
  }
}
@media screen and (max-width: 1600px) {
  .rapidTask {
    width: 560px;
    margin-bottom: 4px !important;
  }
}

.content {
  margin-top: 20px;
  margin-bottom: 20px;
  text-align: center;
}
.newPageTop {
  padding: 0 0 10px 10px;
  border-bottom: 1px solid #ebeef5;
}
// @media screen and (max-width: 768px) {
//   .taks_edit {
//     position: absolute;
//     top: 0;
//     left: 0;
//     width: 100% !important;
//     height: 100% !important;
//   }
// }
.assignedBox > button {
  margin-left: 0px !important;
  margin-right: 10px !important;
}

.newPage {
  position: relative;
}
.rapidTask {
  width: 560px;
}
.rapidTask .btn {
  float: left;
  // padding: 0 5px 0 5px !important;
  width: 30px !important;
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
}
.btnBox {
  width: 400px;
  height: 35px;
  float: left !important;
  // overflow: hidden;
  overflow-x: scroll;
  scrollbar-width: none;
  overflow: -moz-scrollbars-none;
  // position: relative;
}
.btnOverflow {
  // width: 10000px
  // position: absolute
  white-space: nowrap;
}
.clearfix:after {
  content: '';
  clear: both;
  display: block;
}
</style>
<style lang="scss" >
.el-table__fixed-right::before,
.el-table__fixed::before {
  content: none;
}
// btnBox
/*滚动条样式*/
.btnBox::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 0px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 0px;
}
.btnBox::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px #fff;
  background: #fff;
}
.btnBox::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px #fff;
  border-radius: 0;
  background: #fff;
}
</style>