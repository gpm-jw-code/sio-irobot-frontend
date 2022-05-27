import axios from "axios";


axios.defaults.baseURL="http://192.168.0.201:8080"

/**使用者登入 */
export async function Login(user={userName:"",password:""}){
     var ret = await axios.post('api/login' , user);
     return ret.data;
}

/**Reset Alarm  */
export async function ResetAlarm(props={ eqid:"string",field:"string"}){
    return await new Promise( function(resolve,reject){
        var ws = new WebSocket(`ws://localhost:8090/GPM/AlarmReset/?edgeName=SIOIROBOT&eqid=${props.eqid}&field=${props.field}`);
        ws.onopen=()=>{
            console.log('ws connected');
        }
        ws.onmessage=(ret)=>{
            console.log(ret.data);
            ws.close();
            resolve(ret.data);
        }
        ws.onerror=(error)=> reject(error);
    }
    );
}

/**取得所有設備ID */
export async function GetEQIDList(edgeName="SIOIROBOT"){
    return await new Promise( function(resolve,reject){
        var ws = new WebSocket(`ws://localhost:8090/GPM/Query/?Action=GetEqListOfEdge&EdgeName=${edgeName}`);
        ws.onopen=()=>{
            console.log('ws connected');
        }
        ws.onmessage=(ret)=>{
            ws.close();
            resolve(JSON.parse( ret.data));
        }
        ws.onerror=(error)=> reject(error);
    }
    );
}
/**取得所有感測項目列表 */
export async function GetFieldList(edgeName="SIOIROBOT"){
    return await new  Promise(function(resolve,reject){
        var ws = new WebSocket(`ws://localhost:8090/GPM/Query/?Action=GetSensorTypeListOfEdge&EdgeName=${edgeName}`);
        ws.onopen=()=>{
            console.log('ws connected');
        }
        ws.onmessage=(ret)=>{
            ws.close();
            resolve( JSON.parse( ret.data).sensorTypeList);
        }
        ws.onerror=(err)=>reject(err);
    })
}

/**for 分散式系統 */
export async function SensorRawDataWsConnect(){
    return await new Promise(function(resolve,reject){
        var ws = new WebSocket("ws://localhost:8090/GPM/SensorRawData");
            ws.onopen=()=>{
                console.log('SensorRawData ws connect');
                resolve(ws);
            }
            ws.onerror =(err)=>reject(err);
    })
}


/**for IDMS系統 */
export async function IDMSSensorRawDataWsConnect(){
    return await new Promise(function(resolve,reject){
        var ws = new WebSocket("ws://127.0.0.1:44332/Raw/?distributed=true");
            ws.onopen=()=>{
                console.log('IDMS_SensorRawData ws connect');
                resolve(ws);
            }
            ws.onerror =(err)=>reject(err);
    })
}


/**閥值設定 */
export var ThresHoldSetting={
        /**設定OOC閥值 */
        SetOOC: async function(eqid="",field="",threshold=0) {
          return await new Promise(
              function(resolve,reject){
                  var ws =new WebSocket(`ws://localhost:8090/GPM/ThresholdSetting/?edgeName=SIOIROBOT&eqid=${eqid}&field=${field}&type=OOC&value=${threshold}`);
                    ws.onmessage=(ret)=>resolve(ret.data);
                    ws.onerror=(err)=>reject(err);
            }
          )
        },
        /**設定OOS閥值 
        */
        SetOOS: async function(eqid="",field="",threshold=0) {
            return await new Promise(
                function(resolve,reject){
                    var ws =new WebSocket(`ws://localhost:8090/GPM/ThresholdSetting/?edgeName=SIOIROBOT&eqid=${eqid}&field=${field}&type=OOS&value=${threshold}`);
                    ws.onmessage=(ret)=>resolve(ret.data);
                    ws.onerror=(err)=>reject(err);
                }
            )
        }
}

export var Query ={
    QuerySensorRawData: async function(startTime=Date(),endTime=Date(),edgeName="SIOIROBOT",eqid="eqid", field="field"){
        var sensorName = `${eqid}_${field}`
        return await new Promise(function(resolve,reject){
            var ws = new WebSocket(`ws://localhost:8090/GPM/QuerySensorRawData/?startTime=${startTime}&endTime=${endTime}&edgeName=${edgeName}&sensorName=${sensorName}`);
            ws.onmessage=(e)=>{
                ws.close();
                resolve( JSON.parse(e.data))
            }
        })
    }
}