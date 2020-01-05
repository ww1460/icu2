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
var DIC = {
  usingState: [{
    label: '排班',
    value: '1'
  }, {
    label: '调班',
    value: '0'
  }]
}

var flag = {
  usingState: [{
    label: '批准',
    value: 0
  }, {
    label: '拒绝',
    value: 1
  }, {
    label: '处理中',
    value: 2
  }]
}

export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  align: 'center',
  viewBtn: true,
  menu: false,
  column: [
    {
      label: '类型',
      prop: 'applyType',
      dicData: DIC.usingState,
      search: true,
      type: 'select'
    }, {
      label: '排班日期',
      prop: 'dateTime',
      type: 'datetime',
      format: 'MM-dd HH:mm',
      valueFormat: 'yyyy-MM-dd HH:mm:ss'
    }, {
      label: '调班护士',
      prop: 'changeNurseName'
    }, {
      label: '原始班次',
      prop: 'originalShift',
      dicUrl: '/admin/dict/type/arrange_shift'
    }, {
      label: '意愿班次',
      prop: 'hopeShift',
      dicUrl: '/admin/dict/type/arrange_shift'
    }, {
      label: '申请理由',
      prop: 'applyReason'
    }, {
      label: '处理意见',
      prop: 'approvalOpinion'
    }, {
      label: '处理状态',
      prop: 'approvalFlag',
      dicData: flag.usingState,
      search: true,
      type: 'select'
    }]
}

export const tableOption1 = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  align: 'center',
  viewBtn: false,
  column: [
    {
      label: '申请人',
      prop: 'initiatorNurseName'
    },
    {
      label: '类型',
      prop: 'applyType',
      dicData: DIC.usingState,
      search: true,
      type: 'select'
    }, {
      label: '排班日期',
      prop: 'dateTime',
      type: 'datetime',
      format: 'MM-dd HH:mm',
      valueFormat: 'yyyy-MM-dd HH:mm:ss'
    }, {
      label: '调班护士',
      prop: 'changeNurseName'
    }, {
      label: '原始班次',
      prop: 'originalShift',
      dicUrl: '/admin/dict/type/arrange_shift'
    }, {
      label: '意愿班次',
      prop: 'hopeShift',
      dicUrl: '/admin/dict/type/arrange_shift'
    }, {
      label: '申请理由',
      prop: 'applyReason'
    }, {
      label: '处理意见',
      prop: 'approvalOpinion',
      type: 'textarea'
    }, {
      label: '处理状态',
      prop: 'approvalFlag',
      dicData: flag.usingState,
      search: true,
      type: 'select'

    }]
}
