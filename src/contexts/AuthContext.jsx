import { createContext, useContext, useState, useCallback } from 'react'
import { toast } from 'react-toastify'
import { jwtDecode } from 'jwt-decode'
import api from '../services/api'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  
  // Проверка аутентификации при запуске приложения
  const checkAuth = useCallback(async () => {
    setLoading(true)
    const token = localStorage.getItem('token')
    
    if (token) {
      try {
        // Проверяем валидность токена
        const decoded = jwtDecode(token)
        const currentTime = Date.now() / 1000
        
        if (decoded.exp && decoded.exp < currentTime) {
          // Токен истек
          localStorage.removeItem('token')
          setIsAuthenticated(false)
          setUser(null)
        } else {
          // Устанавливаем заголовок авторизации для всех запросов
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
          
          // Получаем данные пользователя
          const response = await api.get('/users/me')
          setUser(response.data)
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error('Ошибка проверки аутентификации:', error)
        localStorage.removeItem('token')
        setIsAuthenticated(false)
        setUser(null)
      }
    }
    
    setLoading(false)
  }, [])
  
  // Функция для входа в систему
  const login = async (credentials) => {
    try {
      console.log('Login request data:', credentials)
      const response = await api.post('/login', credentials)
      console.log('Login response:', response)
      const { token, user } = response.data
      localStorage.setItem('token', token)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(user)
      setIsAuthenticated(true)
      toast.success('Вход выполнен успешно')
      return true
    } catch (error) {
      console.error('Ошибка входа:', error)
      toast.error(error.response?.data?.error || 'Ошибка входа в систему')
      return false
    }
  }
  
  // Функция для регистрации
  const register = async (userData) => {
    try {
      console.log('Register request data:', userData)
      const response = await api.post('/register', userData)
      console.log('Register response:', response)
      toast.success('Регистрация успешна! Теперь вы можете войти.')
      return true
    } catch (error) {
      console.error('Ошибка регистрации:', error)
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(`Ошибка при регистрации: ${error.response.data.error}`)
      } else {
        toast.error('Ошибка при регистрации')
      }
      return false
    }
  }
  
  // Функция для выхода из системы
  const logout = () => {
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
    setIsAuthenticated(false)
    toast.info('Вы вышли из системы')
  }
  
  // Проверка роли пользователя
  const hasRole = (roles) => {
    if (!user) return false
    if (typeof roles === 'string') return user.role === roles
    return roles.includes(user.role)
  }
  
  const value = {
    user,
    isAuthenticated,
    loading,
    checkAuth,
    login,
    register,
    logout,
    hasRole
  }
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}