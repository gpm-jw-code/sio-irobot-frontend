import axios from "axios";

console.log('環境:',process.env.NODE_ENV);

if(process.env.NODE_ENV==='development')
    axios.defaults.baseURL ="http://localhost:5021";

console.log(axios.defaults.baseURL);

axios.get("/WeatherForecast");
