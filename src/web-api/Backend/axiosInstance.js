import axios from 'axios'
//console.log('環境:',process.env.NODE_ENV);
var apiAxios = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:5000'
      : window.location.protocol + '//' + window.location.host,
})

console.info(apiAxios.defaults.baseURL)
export default apiAxios
