import axios from 'axios';


const api = axios.create({
    baseURL: 'https://ecoleta-srv.herokuapp.com'
})

export default api;