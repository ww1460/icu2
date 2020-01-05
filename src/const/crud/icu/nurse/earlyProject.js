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
  addDisplay:false,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  align: 'center',
  refreshBtn: false,
  showClomnuBtn: false,
  searchSize: 'mini',
  viewBtn:true,
  column: [{
    label: '项目名称',
    prop: 'type',
    'search': true,
    type:'select',
    rules: [{
      required: true,
      message: '请选择项目',
      trigger: 'change'
    }]
  }, {
    label: '最大值',
    prop: 'description',
  }, {
    label: '最小值',
    prop: 'system',
  
  }]
}

export const tableDictItemOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  align: 'center',
  refreshBtn: false,
  showClomnuBtn: false,
  searchSize: 'mini',
  column: [{
    label: '项目名称',
    prop: 'type',
    addDisabled: true,
    editDisabled: true
  }, {
    width: 150,
    label: '最大值',
    prop: 'value',
    rules: [{
      required: true,
      trigger: 'blur'
    }]
  }, {
    label: '最小值',
    prop: 'label',
    rules: [{
      required: true,
      trigger: 'blur'
    }]
  }]
}
