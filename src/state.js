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

export {userInfo}