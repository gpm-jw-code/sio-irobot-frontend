import axios from "axios";

/**使用者登入 */
export async function Login(user={userName:"",password:""}){
     var ret = await axios.post('api/login' , user);
     return ret.data;
}


export async function ResetAlarm(props={ eqid:"string",field:"string"}){
    var ret = await axios.post('api/ResetAlarm',props);
    return ret.data;
}

export var ThresHoldSetting={
      SetOOC: async function(eqKey,threshold) {
          alert(`Set ${eqKey} OOC Threshold=${threshold}`);
        },
        SetOOS: async function(eqKey,threshold) {
            alert(`Set ${eqKey} OOS Threshold=${threshold}`);
            
        }
}