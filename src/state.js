
var userInfo={
    login:false,
    level:0,
    userName:"Visitor",
    logout(){
        this.login=false;
        this.level=0;
        this.userName="Visitor";
    }
}

/**儲存 */
var dataInfo={
    Dict_GroupSetting: Object,
    eqidls:[],
    fields: [],
    AllSensorInfo:[],
}

var caches={
    realTimeDataCaches:{},
    thresholdsDataCaches:{},
    queryResultCaches:{
        lastTimeKey:'',
        DataMap:{},
        TryGetDataFromCache(startTime,endTime,eqid,field){
            var sensorKey = eqid+"_"+field;
            var timeKey = startTime+"-"+endTime;
            return this.DataMap[timeKey][sensorKey];
        },

        TryGetLastQueryDataFromCache(eqid,field){
            var sensorKey = eqid+"_"+field;
            return this.DataMap[this.lastTimeKey][sensorKey];
        }
    }
}



console.log('state.js');

export {userInfo,dataInfo,caches}