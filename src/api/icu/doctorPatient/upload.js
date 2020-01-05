import request from '@/router/axios'

export function getselectAll(){
    return request({
        url:"/icu/patientcommunicate/selectAll",
        method:'get'
    })
} 
export function addCommunicate(obj){
    return request({
        url:"/icu/patientcommunicate/add",
        method:'post',
        data: obj
    })
} 
export function feachList(query){
    return request({
        url:"/icu/patientcommunicate/page",
        method:'get',
        params: query
    })
} 
export function delCommunicate(id){
    return request({
        url:"/icu/patientcommunicate/"+id,
        method:'delete',
    })
} 


