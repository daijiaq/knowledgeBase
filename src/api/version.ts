import request from '../utils/request'
// 获取历史版本
export const getHistoryVersion = (documentId: number) => {
    return request({
        url: `/versions/${documentId}`,
        method: 'GET'
    })
}


// 获取特定版本内容
export const getVersionContent = (documentId: number, versionNumber: number) => {
    return request({
        url: `/versions/${documentId}/${versionNumber}`,
        method: 'GET'
    })
}

// 删除特定版本
export const deleteVersion = (documentId: number, versionNumber: number) => {
    return request({
        url: `/versions/${documentId}/${versionNumber}`,
        method: 'DELETE'
    })
}

// 版本回退
export const revertToVersion = (documentId: number, versionNumber: number) => {
    return request({
        url: `/versions/${documentId}/${versionNumber}/rollback`,
        method: 'POST'
    })
}

// 历史版本对比
export const compareVersions = (documentId: number, versionNumber1: number, versionNumber2: number) => {
    return request({
        url: `/versions/compare/${documentId}/${versionNumber1}/${versionNumber2}`,
        method: 'GET',
        data: { versionNumber1, versionNumber2 }
    })
}