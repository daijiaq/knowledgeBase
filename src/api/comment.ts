import request from '../utils/request'

export const createCommentApi = (textNanoid:string,comment:string,documentId:number): Promise<any> =>{
    return request({
        url:'/text-comments/add',
        method:'POST',
        data:{
            textNanoid: textNanoid,
            comment: comment,
            documentId: documentId,
        }
    })
}

export const removeCommentApi = (commentId:number): Promise<any> => {
    return request({
        url: `/text-comments/${commentId}`,
        method:'DELETE',
    })
}

export const getCommentApi = (textNanoid:String): Promise<any> => {
    return request({
        url:`/text-comments/${textNanoid}`,
        method: 'GET',
    })
}