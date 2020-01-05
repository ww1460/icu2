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
  stripe: true,
  menu: false,
  addBtn: false,
  menuAlign: 'center',
  align: 'center',
  submitBtn: true,
  column: [{
    label: '星期/等级',
    prop: ''
  }, {
    label: 'N0',
    prop: '33',
    cell: 'true'
    // rules: [{
    //     required: true,
    //     message: '请输入性别',
    //     trigger: 'blur'
    //   }]
  }, {
    cell: 'true',
    label: 'N1',
    prop: 'ccc',
    editVisdiplay: false,
    addVisdiplay: false

  }, {
    cell: 'true',
    label: 'N2',
    prop: 'rsc',
    overHidden: true

  },
  {
    cell: 'true',
    label: 'N3',
    prop: 'ddd',
    overHidden: true

  }, {
    cell: 'true',
    label: 'N4',
    prop: 'aaa',
    overHidden: true

  }]
}
