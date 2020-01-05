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
  stripe: false,
  addBtn:true,
  delBtn:false,
  editBtn:false,
  menuAlign: 'center',
  align: 'center',
  labelWidth:100,
  column: [
    {
      label: '患者id',
      prop: 'id',
      hide: true,
      editDisabled: true,
      addDisplay: false
    },
    {
      label: '任务来源',
      prop: 'name',
      // dicUrl: '/admin/dict/type/status_type', //这个地方是下拉框显示的数据内容 需要更改
      type: 'select',
      search:true
    },
    {
      label: '患者',
      prop: 'code'
    },
    {
      label: '预执行时间',
      prop: 'status',
      value: 'datetimerange',
      type: 'datetimerange',
      span: 12,
      row: true,
      startPlaceholder: '开始时间',
      endPlaceholder: '结束时间'
     
    },
    {
      label: '预执行护士',
      prop: 'endTime'
      
    },
    {
      label:'任务内容',
      prop:''
    },
    {
      label:'任务进度',
      prop:'progress',
      type:'select',
      progressList:[{
        label:'进度',
        list:['20','30','40']
      }]
    },
    {
      label:'任务状态',
      prop:'',
      type:'select',
      search:true
    }
    // {
    //   label: '状态',
    //   prop: 'status',
    //   type: 'select',
    //   dicUrl: '/admin/dict/type/status_type',  /// 项目名称  这个要改的
    //   search: true
    // }
  ]
}
