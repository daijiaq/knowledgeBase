import request from '../utils/request'
// 登录
export const userLogin=(emial:string,password:string)=>{
    return request({
        url:`/api/users/login?emial=${emial}&password=${password}`,
        method:'POST',
    })
}