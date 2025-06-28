import request from '../utils/request'
//创建文件夹
export const createFolderApi = (knowledgeBaseId:number,name:string,parentFolderId:number|null)=>{
  return request({
      url:'/folders',
      method:'POST',
      data:{
          knowledgeBaseId,
          name,
          parentFolderId
      }
  })
}

//获取文件夹里面的内容
export const getFolderContentApi = (folderId:number)=>{
  return request({
      url:`/folders/${folderId}/content`,
      method:'GET'
  })
}

//删除文件夹
export const deleteFolderApi = (folderId:number)=>{
  return request({
      url:`/folders/${folderId}`,
      method:'DELETE'
  })
}

//编辑文件夹名称
export const editFolderApi = (folderId:number,name:string)=>{
  return request({
      url:`/folders/${folderId}`,
      method:'PUT',
      data:{
          name
      }
  })
}