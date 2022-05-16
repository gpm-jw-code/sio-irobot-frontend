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
    eqidls:['1','2']
}

export {userInfo,dataInfo}