import axios from "axios";

const BASE_URL = "http://127.0.0.1:3000/api/"
export const instance = axios.create({
    baseURL : BASE_URL,
    timeout: 1000

})

instance.interceptors.request.use((cfg) => {
    console.log("Request sended")
    return cfg
})

instance.interceptors.response.use((cfg) => {
    console.log(cfg.status)
    return cfg;
}, ()=> {
        console.log("there is an error here")
})
