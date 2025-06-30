import request from '../utils/request'

export const createCommentApi = (textNanoid:string,comment:string,userId:Number,documentId:Number) =>{
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

export const removeCommentApi = (commentId:Number,textNanoid:Number) => {
    return request({
        url: `/text-comments/${commentId}`,
        method:'DELETE',
        data:{
            textNanoid:textNanoid,
        }
    })
}

export const getCommentApi = (textNanoid:String) => {
    return request({
        url:`/text-comments/${textNanoid}`,
        method: 'GET',
    })
}