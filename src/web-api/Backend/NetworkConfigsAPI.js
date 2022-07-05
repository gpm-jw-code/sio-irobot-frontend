import apiAxios from './axiosInstance'
export async function GetNetworkConfigs() {
  var ret = await apiAxios.get('api/Network').catch((e) => {
    return {
      data: 'network_error',
    }
  })
  return ret.data
}
