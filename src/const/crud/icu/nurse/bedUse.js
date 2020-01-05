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
    //   {
    //     label: '床位id',
    //     prop: 'bedId',
    //     search:true,
    //     // hide: true,
    //     // editDisabled: true,
    //     // addDisplay: false
    //   },
    {
      label: '床位',
      prop: 'bedCode',
      search: true
      // searchMenu:false
    },

    {
      label: '患者姓名',
      prop: 'patientName'

    },
    {
      label: '开始时间',
      prop: 'startTime',
      type: 'datetime',
      format: 'MM-dd HH:mm',
      valueFormat: 'yyyy-MM-dd HH:mm:ss',

    },
    {
      label: '结束时间',
      prop: 'endTime',
      type: 'datetime',
      format: 'MM-dd HH:mm',
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
    },

    {
      label: '使用时长(小时)',
      prop: 'totalTime'
    }

  ]
}


