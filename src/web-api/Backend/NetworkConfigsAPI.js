import apiAxios from './axiosInstance'
export async function GetNetworkConfigs() {
  var ret = await apiAxios.get('api/Network').catch((e) => {
    console.error('從後端取得網路參數配置失敗,使用預設值')
    return {
      data: {
        controlCenterWsHost: 'ws://localhost:8090',
        idmsWsHost: 'ws://localhost:44332',
      },
    }
  })
  return ret.data
}
