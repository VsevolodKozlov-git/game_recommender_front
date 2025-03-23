import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:8000', // or process.env.BACKEND_URL based on your environment setup
})

// Add interceptor to include Authorization header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default apiClient
