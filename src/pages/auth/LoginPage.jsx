import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

const LoginPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }
  
  const validate = () => {
    const newErrors = {}
    
    if (!formData.email) {
      newErrors.email = 'Email обязателен'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Неверный формат email'
    }
    
    if (!formData.password) {
      newErrors.password = 'Пароль обязателен'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validate()) return
    
    setIsLoading(true)
    
    try {
      const success = await login(formData)
      
      if (success) {
        // Перенаправляем на страницу, с которой пришли, или на дашборд
        const from = location.state?.from?.pathname || '/dashboard'
        navigate(from)
      }
    } catch (error) {
      console.error('Ошибка входа:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleGuestAccess = () => {
    navigate('/guest')
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-neutral-900">
            Вход в систему
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            Склад Турбо - система складского учета
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Email"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@company.com"
              error={errors.email}
              required
              icon={FiMail}
            />
            
            <Input
              label="Пароль"
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Введите пароль"
              error={errors.password}
              required
              icon={FiLock}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-700">
                Запомнить меня
              </label>
            </div>
            
            <div className="text-sm">
              <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                Забыли пароль?
              </a>
            </div>
          </div>
          
          <div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isLoading}
              icon={FiLogIn}
            >
              {isLoading ? 'Вход...' : 'Войти'}
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-neutral-600">
              Нет аккаунта?{' '}
              <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                Зарегистрироваться
              </Link>
            </p>
          </div>
          
          <div className="mt-4 pt-4 border-t border-neutral-200">
            <Button
              type="button"
              variant="outline"
              size="md"
              className="w-full"
              onClick={handleGuestAccess}
            >
              Войти как гость
            </Button>
          </div>
        </form>
        
        <div className="mt-4 text-center text-xs text-neutral-500">
          <p>Для демонстрации</p>
          <p className="mt-1">Администратор: admin@example.com / admin123</p>
          <p>Пользователь: user@example.com / user123</p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage