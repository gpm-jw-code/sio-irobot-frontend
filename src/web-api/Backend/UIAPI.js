import apiAxios from './axiosInstance'

export async function GetUIStartupConfig() {
  var result = await apiAxios.get('api/UIInitialize').catch((e) => {
    return {
      data: {
        message: e.message,
      },
    }
  })
  console.info(result.data)
  return result.data
}
