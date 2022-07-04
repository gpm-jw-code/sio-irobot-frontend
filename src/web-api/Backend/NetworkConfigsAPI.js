import apiAxios from './axiosInstance'
export async function GetNetworkConfigs() {
  var ret = await apiAxios.get('api/Network').catch((e) => {
    console.error('從後端取得網路參數配置失敗,使用預設值')
    return {
      data: {
        controlCenterWsHost: 'ws://192.168.0.201:8090',
        idmsWsHost: 'ws://192.168.0.201:44332',
      },
    }
  })
  return ret.data
}
