import {  dataInfo , caches } from "../state";
import { Query } from "./Distribution_Host";


export async function QueryAll(startTime=Date(),endTime=Date(),edgeName="SIOIROBOT"){
           var timeKey = `${startTime}-${endTime}`
           var ret = await Query.QuerySensorRawData(startTime,endTime,edgeName,'all','all');
           caches.queryResultCaches.lastTimeKey = timeKey;
           caches.queryResultCaches.DataMap[timeKey] = ret;
}