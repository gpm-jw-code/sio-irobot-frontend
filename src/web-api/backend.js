import axios from "axios";

/**使用者登入 */
export async function Login(user={userName:"",password:""}){
     var ret = await axios.post('api/login' , user);
     return ret.data;
}

/**Reset Alarm  */
export async function ResetAlarm(props={ eqid:"string",field:"string"}){
    var ret = await axios.post('api/ResetAlarm',props);
    return ret.data;
}

/**取得所有設備ID */
export async function GetEQIDList(){
    var ret = await axios.get('api/GetEQIDList');
    return ret.data;
}
/**取得所有感測項目列表 */
export async function GetFieldList(){
    var ret = await axios.get('api/GetEQIDList');
    return ret.data;
}



/**閥值設定 */
export var ThresHoldSetting={
        /**設定OOC閥值 */
        SetOOC: async function(eqKey,threshold) {
          alert(`Set ${eqKey} OOC Threshold=${threshold}`);
        },
        /**設定OOS閥值 
        */
        SetOOS: async function(eqKey,threshold) {
            alert(`Set ${eqKey} OOS Threshold=${threshold}`);
            
        }
}