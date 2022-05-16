import {GetEQIDList,GetFieldList } from './web-api/backend'

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
    eqidls:['Robot-1','Robot-2'],
    fields: [{field:'vac_upper_arm',label:"上手臂VAC"},
    {field:'vac_lower_arm',label:"下手臂VAC"},
    {field:'x_axis_torge',label:"X軸扭力"},
    {field:'x_axis_motor_temp',label:"X軸馬達溫度"}]
    ,
    async GetInfoFromBackend(){
        this.eqidls = await GetEQIDList();
        this.fields = await GetFieldList();
    }    
}

export {userInfo,dataInfo}