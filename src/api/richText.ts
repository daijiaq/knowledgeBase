import request from '../utils/request'

export const getContent = (documentId:Number) => {
    return request({
        url: `/documents/${documentId}`,
        method: 'GET',
    })
}

export const saveContent = (documentId:Number) => {
    return request({
        url:'/documents/save',
        method:'POST',
        data: {
            documentId: documentId,
        }
    })
}

