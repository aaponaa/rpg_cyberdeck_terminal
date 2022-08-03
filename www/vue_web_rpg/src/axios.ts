import axios from 'axios'

const client = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
})

client.interceptors.response

export default client
