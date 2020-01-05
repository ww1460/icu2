/*
 *    Copyright (c) 2018-2025, lengleng All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 * Neither the name of the pig4cloud.com developer nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 * Author: lengleng (wangiegie@gmail.com)
 */
export const tableOption = {
    border: true,
    index: true,
    indexLabel: '序号',
    stripe: true,
    menuAlign: 'center',
    align: 'center',
    refreshBtn: false,
    showClomnuBtn: false,
    searchSize: 'mini',
    viewBtn:true,
    labelWidth:100,
    column: [
      {
      label: '患者姓名',
      prop: 'type',
      type:'select',
      'search': true,
      editDisabled:false,
      rules: [{
        message: '请选择患者姓名',
        trigger: 'blur'
      }]
    }, {
      search: true,
      label: '患者病情',
      prop: 'description',
      rules: [{
        message: '请输入患者病情',
        trigger: 'blur'
      }]
    }, 
    {
      hide:true,
      label: '开始用药时间',
      prop: 'www',
      type:'datetime',
      format: 'MM-dd HH:mm',
      valueFormat: 'MM-dd HH:mm:ss'
    }, 
    {
      hide:true,
      label: '停止用药时间',
      prop: 'www',
      type:'datetime',
      format: 'MM-dd HH:mm',
      valueFormat: 'MM-dd HH:mm:ss'
    }, {
      label: '发生时间',
      prop: 'createTime',
      type: 'datetime',
      // addDisplay: false,
      editDisplay: false,
      search: true,
      format: 'MM-dd HH:mm',
      valueFormat: 'MM-dd HH:mm:ss'
    }, {
      label: '不良反应名称',
      prop: 'remarks',
      rules: [{
        message: '请输入不良反应名称',
        trigger: 'blur'
      }]
    }, {
      search: true,
      label: '药物名称',
      prop: 'aaa',
      rules: [{
        message: '请输入药物名称',
        trigger: 'blur'
      }]
    }, {
      hide:true,
      label: '药品用法用量',
      prop: 'ccc',
      rules: [{
        message: '请输入用法用量',
        trigger: 'blur'
      }]
    },{
      hide:true,
      label: '记录人',
      prop: 'a121',
      rules: [{
        message: '请输入记录人',
        trigger: 'blur'
      }]
    },
    {
      span:24,
      type:'textarea',
      width: 150,
      label: '不良反应症状',
      prop: 'description',
      // addDisplay: false,
      editDisabled: true,
      rules: [{
        message: '请输入症状',
        trigger: 'blur'
      }]
   
    }, {
      hide:true,
      span:24,
      type:'textarea',
      label: '处理过程',
      prop: 'dadada',
      // addDisplay: false,
      editDisabled: true,
      rules: [{
        message: '请输入症状',
        trigger: 'blur'
      }]
   
    }, {
      hide:true,
      span:24,
      type:'textarea',
      label: '处理结果',
      prop: 'aadsad',
      // addDisplay: false,
      editDisabled: true,
      rules: [{
        message: '请输入症状',
        trigger: 'blur'
      }]
   
    },]
  }
  
  // export const tableDictItemOption = {
  //   border: true,
  //   index: true,
  //   indexLabel: '序号',
  //   stripe: true,
  //   menuAlign: 'center',
  //   align: 'center',
  //   refreshBtn: false,
  //   showClomnuBtn: false,
  //   searchSize: 'mini',
  //   column: [{
  //     label: '类型',
  //     prop: 'type',
  //     addDisabled: true,
  //     editDisabled: true
  //   }, {
  //     width: 150,
  //     label: '数据值',
  //     prop: 'value',
  //     rules: [{
  //   
  //       message: '请输入数据值',
  //       trigger: 'blur'
  //     }]
  //   }, {
  //     label: '标签名',
  //     prop: 'label',
  //     rules: [{
  //   
  //       message: '请输入标签名',
  //       trigger: 'blur'
  //     }]
  //   }, {
  //     label: '描述',
  //     prop: 'description',
  //     rules: [{
  //   
  //       message: '请输入字典描述',
  //       trigger: 'blur'
  //     }]
  //   }, {
  //     label: '排序',
  //     prop: 'sort',
  //     type: 'number',
  //     rules: [{
  //   
  //       message: '请输入排序',
  //       trigger: 'blur'
  //     }]
  //   }, {
  //     label: '备注信息',
  //     prop: 'remarks'
  //   }]
  // }
  