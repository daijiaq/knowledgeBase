import request from '../utils/request'

//创建文档
export const createDocument = (knowledgeBaseId: number, title: string, folderId: number|null): Promise<any> => {
  let data: any = {}
  //如果没有传入文件夹id，则创建在根目录下
  if(folderId==null){
    data = {
      title,
      knowledgeBaseId
    }
  }else{
    data = {
      title,
      knowledgeBaseId,
      folderId
  }} 
  console.log(111,folderId);
  
  return request({
    url:'/documents/create',
    method: 'POST',
    data
  })
}

//获取文档内容
export const getDocumentContent = (documentId: number): Promise<any> => {
  return request({
    url:`/documents/${documentId}`,
    method:'GET'
  })
}

//删除文档
export const deleteDocument = (documentId: number): Promise<any> => {
  return request({
    url:`/documents/${documentId}`,
    method:'DELETE'
  })
}

//保存文档
export const saveDocumentContent = (documentId: number, newContent: string): Promise<any> => {
  return request({
    url:'/documents/save',
    method:'POST',
    data: {
      newContent,
      documentId
    }
  })
}

//修改文档名称
export const editDocumentName = (documentId: number, newName: string): Promise<any> => {
  return request({
    url:`/documents/${documentId}`,
    method:'PUT',
    data: {
      title:newName
    }
  })
}