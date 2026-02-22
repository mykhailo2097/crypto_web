import axios from 'axios'
import { useApiStore } from '../store/apiStore'

const httpClient = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': import.meta.env.VITE_API_KEY,
  },
})

httpClient.interceptors.request.use((config) => {
  config.baseURL = useApiStore.getState().getBaseUrl()
  return config
})

httpClient.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
)

export default httpClient
