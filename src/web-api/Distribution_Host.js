import { GetNetworkConfigs } from '../web-api/Backend/NetworkConfigsAPI'
import Bus from '../bus'

GetNetworkConfigs().then((config) => {
  if (config != 'network_error') {
    control_center_ws_host = config.controlCenterWsHost
  }
  Bus.$emit('network_configs_download_done')
})

var control_center_ws_host = 'ws://localhost:8090'
/**Reset Alarm  */
export async function ResetAlarm(GroupName, RowName, DataName) {
  return await new Promise(function (resolve, reject) {
    var ws = new WebSocket(
      `${control_center_ws_host}/GPM/AlarmReset/?GroupName=${GroupName}&RowName=${RowName}&DataName=${DataName}`,
    )
    ws.onopen = () => {
      console.log('ws Alarm connected')
    }
    ws.onmessage = (ret) => {
      console.log(ret.data)
      ws.close()
      resolve(ret.data)
    }
    ws.onerror = (error) => reject(error)
  })
}

/**取得所有設備ID */
export async function GetEQIDList(edgeName = 'SIOIROBOT') {
  return await new Promise(function (resolve, reject) {
    var ws = new WebSocket(
      `${control_center_ws_host}/GPM/Query/?Action=GetEqListOfEdge&EdgeName=${edgeName}`,
    )

    ws.onopen = () => {
      console.log('ws IDList connected')
    }
    ws.onmessage = (ret) => {
      ws.close()
      resolve(JSON.parse(ret.data))
    }
    ws.onerror = (error) => {
      console.info('errorororor', error)
      resolve('network_error')
    }
  })
}
export async function GetSensorInfo() {
  return await new Promise(function (resolve, reject) {
    var ws = new WebSocket(`ws://localhost:8090/GPM/SensorInfo`)
    ws.onopen = () => {
      console.log('ws SensorInfo Connect')
    }
    ws.onmessage = (ret) => {
      ws.close()
      resolve(JSON.parse(ret.data))
    }
  })
}

/**取得所有感測項目列表 */
export async function GetFieldList(edgeName = 'SIOIROBOT') {
  return await new Promise(function (resolve, reject) {
    var ws = new WebSocket(
      `${control_center_ws_host}/GPM/Query/?Action=GetSensorTypeListOfEdge&EdgeName=${edgeName}`,
    )
    ws.onopen = () => {
      console.log('ws FieldList connected')
    }
    ws.onmessage = (ret) => {
      ws.close()
      resolve(JSON.parse(ret.data).sensorTypeList)
    }
    ws.onerror = (err) => reject(err)
  })
}

/**for 分散式系統 */
export async function SensorRawDataWsConnect() {
  return await new Promise(function (resolve, reject) {
    var ws = new WebSocket(
      `${control_center_ws_host}/GPM/SensorRawData/?EdgeName=SIOIROBOT`,
    )
    ws.onopen = () => {
      console.log('SensorRawData ws connect')
      resolve(ws)
    }
    ws.onerror = (err) => {
      resolve('network_error')
    }
  })
}

export async function GroupSettingWSConnect() {
  return await new Promise(function (resolve, reject) {
    var ws = new WebSocket(`${control_center_ws_host}/GPM/GroupSetting`)
    ws.onopen = () => {
      console.log('GroupSetting ws connect')
      resolve(ws)
    }
    ws.onerror = (err) => {
      resolve(null)
    }
  })
}

/**for IDMS系統 */
export async function IDMSSensorRawDataWsConnect() {
  return await new Promise(function (resolve, reject) {
    var ws = new WebSocket('ws://127.0.0.1:44332/Raw/?distributed=true')
    ws.onopen = () => {
      console.log('IDMS_SensorRawData ws connect')
      resolve(ws)
    }
    ws.onerror = (err) => resolve(null)
  })
}

export async function getThresholdSetting(GroupName, RowName, ColumnName) {
  return await new Promise(function (resolve, reject) {
    var ws = new WebSocket(
      `${control_center_ws_host}/GPM/GetThreshold/?groupName=${GroupName}&rowName=${RowName}&Data=${ColumnName}`,
    )
    ws.onmessage = (ret) => resolve(ret.data)
    ws.onerror = (err) => resolve(null)
  })
}
/**閥值設定 */
export var ThresHoldSetting = {
  /**設定OOC閥值 */
  SetOOC: async function (
    groupName = '',
    rowName = '',
    field = '',
    threshold = 0,
  ) {
    return await new Promise(function (resolve, reject) {
      var ws = new WebSocket(
        `${control_center_ws_host}/GPM/ThresholdSetting/?groupName=${groupName}&rowName=${rowName}&field=${field}&type=OOC&value=${threshold}`,
      )
      ws.onmessage = (ret) => resolve(ret.data)
      ws.onerror = (err) => reject(err)
    })
  },
  /**設定OOS閥值
   */
  SetOOS: async function (
    groupName = '',
    rowName = '',
    field = '',
    threshold = 0,
  ) {
    return await new Promise(function (resolve, reject) {
      var ws = new WebSocket(
        `${control_center_ws_host}/GPM/ThresholdSetting/?groupName=${groupName}&rowName=${rowName}&field=${field}&type=OOS&value=${threshold}`,
      )
      ws.onmessage = (ret) => resolve(ret.data)
      ws.onerror = (err) => reject(err)
    })
  },
}

export var Query = {
  QuerySensorRawData: async function (
    startTime = Date(),
    endTime = Date(),
    edgeName = 'SIOIROBOT',
    eqid = 'eqid',
    field = 'field',
  ) {
    var sensorName = `${eqid}_${field}`
    return await new Promise(function (resolve, reject) {
      var ws = new WebSocket(
        `${control_center_ws_host}/GPM/QuerySensorRawData/?startTime=${startTime}&endTime=${endTime}&edgeName=${edgeName}&sensorName=${sensorName}`,
      )
      ws.onmessage = (e) => {
        ws.close()
        resolve(JSON.parse(e.data))
      }
    })
  },
}

export const inner_functions = {
  change_control_center_ws_host(newHost) {
    console.log('ori-host:', control_center_ws_host)
    control_center_ws_host = newHost
    console.log('new-host:', control_center_ws_host)
  },
}
