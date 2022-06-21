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

export async function SetStartUpPageMode() {
  var result = await apiAxios
    .post('api/UIInitialize/SetStartUpPageMode', {
      PAGE_MODE: 1,
      spefic_edge_name: '88Robot',
    })
    .catch((e) => {
      return {
        data: {
          message: e.message,
        },
      }
    })
  console.info(result.data)
  return result.data
}
