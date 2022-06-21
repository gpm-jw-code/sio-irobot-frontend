import apiAxios from './axiosInstance'

/**
 * 登入動作
 * @param {string} userName
 * @param {string} password
 * @returns {object} 登入結果 {}
 */
export async function Login(userName, password) {
  var result = await apiAxios
    .post('api/User/Login', {
      UserName: userName,
      Password: password,
    })
    .catch((e) => {
      console.log('登入時發生網路錯誤')
      return {
        data: {
          success: false,
          message: 'Network Error.',
        },
      }
    })

  console.log(result.data)
  return result.data
}

/**
 * 註冊帳戶
 * @param {String} accountName 用戶名
 * @param {String} userName 帳戶
 * @param {String} password 密碼
 * @returns
 */
export async function Regist(accountName, userName, password) {
  return await apiAxios.post('api/User/Regist', {
    UserName: userName,
    Password: password,
    AccountName: accountName,
  })
}

/**
 * 取得用戶列表
 * @returns
 */
export async function GetAllUserList() {
  var ret = await apiAxios.get('api/User/').catch((e) => {
    return {
      data: 'error',
    }
  })
  return ret.data
}

export async function UpdateUsersInfo(userList) {
  var ret = await apiAxios
    .post('api/User/UpdateUserList', userList)
    .catch((e) => {
      return {
        data: {
          success: false,
          message: e.message,
        },
      }
    })

  return ret.data
}

export async function ChangePassword(changeInfo) {
  var ret = await apiAxios
    .post('api/User/ChangePassword', changeInfo)
    .catch((e) => {
      return {
        data: {
          success: false,
          message: e.message,
        },
      }
    })

  return ret.data
}
