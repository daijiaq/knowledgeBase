import request from '../utils/request'
// 登录
export const userLogin=(email:string,password:string)=>{
    return request({
        url:`/api/users/login?email=${email}&password=${password}`,
        method:'POST',
    })
}