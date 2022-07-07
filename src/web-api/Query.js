import { dataInfo, caches } from '../state'
import { Query } from './Distribution_Host'

export async function QueryAll(
  startTime = Date(),
  endTime = Date(),
  groupName = 'SIOIROBOT',
) {
  var timeKey = `${startTime}-${endTime}`
  var ret = await Query.QuerySensorRawData(
    startTime,
    endTime,
    groupName,
    'all',
    'all',
  )
  caches.queryResultCaches.lastTimeKey = timeKey
  caches.queryResultCaches.DataMap[timeKey] = ret
}
