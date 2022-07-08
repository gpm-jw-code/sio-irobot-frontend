import { dataInfo, caches } from '../state'
import { Query } from './Distribution_Host'

export async function QueryAll(
  startTime = Date(),
  endTime = Date(),
  groupName = 'SIOIROBOT',
  sensorNames = [],
  sensorTypes = [],
) {
  var timeKey = `${startTime}-${endTime}`
  var sensorNamesStr = sensorNames.join(',')
  var sensorTypesStr = sensorTypes.join(',')
  var ret = await Query.QuerySensorRawData(
    startTime,
    endTime,
    groupName,
    sensorNamesStr,
    sensorTypesStr,
  )
  caches.queryResultCaches.lastTimeKey = timeKey
  caches.queryResultCaches.DataMap[timeKey] = ret
  return ret
}
