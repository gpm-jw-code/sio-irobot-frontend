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