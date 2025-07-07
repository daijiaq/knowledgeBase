import request from '../utils/request'

export const createCommentApi = (textNanoid:string|null,comment:string,documentId:number|null,parentId:number | null = null): Promise<any> =>{
    return request({
        url:'/text-comments/add',
        method:'POST',
        data:{
            textNanoid: textNanoid,
            comment: comment,
            documentId: documentId,
            parentId: parentId,
        }
    })
}

export const removeCommentApi = (commentId:number): Promise<any> => {
    return request({
        url: `/text-comments/${commentId}`,
        method:'DELETE',
    })
}

export const getCommentApi = (textNanoid:string): Promise<any> => {
    return request({
        url:`/text-comments/${textNanoid}`,
        method: 'GET',
    })
}

export const getParentCommentApi = (textNanoid:string,page:number,pageSize:number):Promise<any> => {
    return request({
        url:`/text-comments/parents/${textNanoid}?page=${page}&pageSize=${pageSize}`,
        method: 'GET',
    })
}

export const getChildCommentApi = (parentId:number,page:number,pageSize:number):Promise<any> => {
    return request({
        url: `/text-comments/children/${parentId}?page=${page}&pageSize=${pageSize}`,
        method:'GET',
    })
}