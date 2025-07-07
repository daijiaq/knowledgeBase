/**
 * 用户注册
 */
interface userRegister {
  /**
   * 用户名称
   */
  username: string;
  /**
   * 邮箱
   */
  email: string;
  /**
   * 密码
   */
  password: string;
}

// 用户信息
export interface userInfo {
  username: string;
  id: number;
  email: string;
}
//搜索的列表信息
export interface searchItem extends userInfo {
  checked: boolean;
}

export interface userResponse {
  code: number;
  data: userResponseData;
  message: string;
}

export interface userResponseData {
  createdAt: string;
  email: string;
  id: number;
  isActive: boolean;
  updatedAt: string;
  username: string;
}
