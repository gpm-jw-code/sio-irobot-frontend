import {  dataInfo , caches } from "../state";
import { Query } from "./Distribution_Host";


export async function QueryAll(startTime=Date(),endTime=Date(),GroupName,RowNames,SensorTypes){
           var timeKey = `${startTime}-${endTime}`
           var stringRowNames = RowNames.join(',');
           var stringsensorTypes=SensorTypes.join(',');
           var ret = await Query.QuerySensorRawData(startTime,endTime,GroupName,stringRowNames,stringsensorTypes);
           caches.queryResultCaches.lastTimeKey = timeKey;
           caches.queryResultCaches.DataMap[timeKey] = ret;
           return ret;
}