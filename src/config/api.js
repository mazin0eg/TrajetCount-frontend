import axios from "axios";

const BASE_URL = "http://127.0.0.1:3000/api/"
export const instance = axios.create({
    baseURL : BASE_URL,
    timeout: 1000

})

instance.interceptors.request.use((cfg) => {
    console.log("Request sended")
    cfg.headers['Authorization'] = `Bearer ${localStorage.getItem('auth_token')}`
    return cfg
})

instance.interceptors.response.use((cfg) => {
    console.log(cfg.status)
    return cfg;
}, ()=> {
        console.log("there is an error here")
})



export const userLogin = async (formData) => {
    try{
        const response = await instance.post('/auth/login', formData);
        localStorage.setItem('auth_token', response.data.token)
        return response.data;
    }catch{
        throw new Error('THere is an error on log in')
    }
}

export const verifyToken = async (token) => {
    if(!token) return ;
    try{
        const response = await instance.get('/auth/me');
        console.log("good")
        return response.data;
    }catch{
        throw new Error('error')
    }
}