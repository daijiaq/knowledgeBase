import request from '../utils/request'
// 登录
export const userLogin = (email: string, password: string) => {
    return request({
        url: '/users/login',
        method: 'POST',
        data: { email, password }
    })
}
// 注册
export const userRegister = (username: string, email: string, password: string) => {
    return request({
        url: '/users/register',
        method: 'POST',
        data: { username, email, password }
    })
}
//根据邮箱搜索用户
export const userSearch = (keyword:string)=>{
    return request({
        url:'/users/search',
        method:'GET',
        params:{
            email:keyword
        }
    })
}