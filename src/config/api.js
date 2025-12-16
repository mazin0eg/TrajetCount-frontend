import axios from "axios";

const BASE_URL = "http://127.0.0.1:3000/api/"
export const instance = axios.create({
    baseURL : BASE_URL,
    timeout: 1000

})

instance.interceptors.request.use((cfg) => {
    cfg.headers['Authorization'] = `Bearer ${localStorage.getItem('auth_token')}`
    return cfg
})

instance.interceptors.response.use((cfg) => {
    return cfg;
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
    if(!token) throw new Error('No token provided') ;
    try{
        const response = await instance.get('/auth/me');
        return response.data;
    }catch{
        localStorage.removeItem('auth_token')
    }
}

export const getDashboardStats = async () => {
    try{
        const response = await instance.get('/admin/dashboard');
        return response.data;
    }catch{
        throw new Error('Failed to fetch dashboard stats')
    }
}

export const getRecentTrajets = async (limit = 10) => {
    try{
        const response = await instance.get(`/trajets?limit=${limit}&sort=-createdAt`);
        return response.data;
    }catch{
        throw new Error('Failed to fetch recent trajets')
    }
}

export const deleteTrajet = async (trajetId) => {
    try{
        const response = await instance.delete(`/trajets/${trajetId}`);
        return response.data;
    }catch{
        throw new Error('Failed to delete trajet')
    }
}