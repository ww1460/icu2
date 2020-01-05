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
//  所有的数据拿到接口后都要重新替换
export const tableOption = {

  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  addBtn: false,
  editBtn: false,
  menuAlign: 'center',
  align: 'center',
  column: [
    {
      label: '序号',
      prop: 'id',
      hide: true,
      editDisabled: true,
      addDisplay: false
    },
    {
      label: '评估时间',
      prop: 'assessTime',
      width:'200'
    },
    {
      label: '评估题目',
      prop: 'indicator',
      width:'200'

    },
    //   {
    //       label:'评估描述',
    //       prop:'indicatorScript'
    //   },
    {
      label: '评估分数',
      prop: 'indicatorValue',
      width:'80'
    },

    {
      label: '护士长建议',
      prop: 'indicatorValueOfMatron'
      // type: 'data',
      // dicUrl: '/admin/dict/type/status_type', //这个地方是下拉框显示的数据内容 需要更改
      // type: 'select',
      // search:true,
      // rules: [{
      //   required: true,
      //   message: '请选择患者姓名',
      //   trigger: 'blur'
      // }]
    }
    // {
    //   label: '数据来源',
    //   prop: 'source',
    //   type: 'select',
    //   // format: 'yyyy-MM-dd',
    //   // valueFormat: 'yyyy-MM-dd',
    //   rules: [{
    //     required: true,
    //     message: '请选择数据来源',
    //     trigger: 'blur'
    //   }]
    // },
    //   {
    //     label:'预警详情',
    //     prop:'warmContent',
    //     // rules: [{
    //     //   required: true,
    //     //   message: '请输入预警详情',
    //     //   trigger: 'blur'
    //     // }]
    //   },
    // {
    //   label: '状态',
    //   prop: 'status',
    //   type: 'select',
    //   dicUrl: '/admin/dict/type/status_type',  /// 项目名称  这个要改的
    //   search: true
    // }
  ]
}
