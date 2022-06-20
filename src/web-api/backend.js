import axios from "axios";

//console.log('環境:',process.env.NODE_ENV);
if(process.env.NODE_ENV==='development')
    axios.defaults.baseURL ="http://localhost:5021";
console.log(axios.defaults.baseURL);

/**
 * 登入動作
 * @param {string} userName 
 * @param {string} password 
 * @returns {object} 登入結果 {}
 */
async function  Login(userName,password){
     var result =  await  axios.post("api/User/Login",{
            UserName:userName,
            Password : password
        }).catch(e=>{
            console.log('登入時發生網路錯誤');
            return {
                data:{
                    success:false,
                    message:"Network Error."
                }
            }
        });
    
    console.log(result.data);
    return result.data;
}


/**
 * 註冊帳戶
 * @param {String} accountName 用戶名
 * @param {String} userName 帳戶
 * @param {String} password 密碼
 * @returns 
 */
async function Regist(accountName,userName,password)
{
    return await axios.post("api/User/Regist",{
        UserName:userName,
        Password : password,
        AccountName : accountName
    });
}

export {Login}
