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

import request from '@/router/axios'

export function fetchList(date) {
  return request({
    url: '/icu/personalNotes/getByDate',
    method: 'post',
    data: {
      createTime: date
    }
  })
}

export function getByday(date) {
  return request({
    url: '/icu//personalNotes/getByDay',
    method: 'post',
    data: {
      createTime: date
    }
  })
}

export function addObj(content, date) {

  return request({
    url: '/icu/personalNotes/add',
    method: 'post',
    data: {
      content: content,
      createTime: date
    }
  })
}
export function delObj(id) {
  return request({
    url: '/icu/personalNotes/' + id,
    method: 'delete'
  })
}

export function putObj(content, personalNotesId, id) {
  return request({
    url: '/icu/personalNotes/update',
    method: 'put',
    data: {
      id: id,
      content: content,
      personalNotesId: personalNotesId
    }
  })
}
