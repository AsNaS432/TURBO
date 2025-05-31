import { useState } from 'react'
import { FiUser, FiEdit, FiKey, FiSave } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { useAuth } from '../contexts/AuthContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const ProfilePage = () => {
  const { user } = useAuth()
  
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
  })
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  
  const [editingProfile, setEditingProfile] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [errors, setErrors] = useState({})
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileForm({ ...profileForm, [name]: value })
    
    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordForm({ ...passwordForm, [name]: value })
    
    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }
  
  const validateProfile = () => {
    const newErrors = {}
    
    if (!profileForm.name) {
      newErrors.name = 'Введите имя'
    }
    
    if (!profileForm.email) {
      newErrors.email = 'Введите email'
    } else if (!/\S+@\S+\.\S+/.test(profileForm.email)) {
      newErrors.email = 'Неверный формат email'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const validatePassword = () => {
    const newErrors = {}
    
    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = 'Введите текущий пароль'
    }
    
    if (!passwordForm.newPassword) {
      newErrors.newPassword = 'Введите новый пароль'
    } else if (passwordForm.newPassword.length < 6) {
      newErrors.newPassword = 'Пароль должен быть не менее 6 символов'
    }
    
    if (!passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Подтвердите новый пароль'
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSaveProfile = async (e) => {
    e.preventDefault()
    
    if (!validateProfile()) return
    
    try {
      // В реальном приложении здесь будет запрос к API
      // await api.put('/users/profile', profileForm)
      
      toast.success('Профиль успешно обновлен')
      setEditingProfile(false)
    } catch (error) {
      console.error('Ошибка обновления профиля:', error)
      toast.error('Не удалось обновить профиль')
    }
  }
  
  const handleSavePassword = async (e) => {
    e.preventDefault()
    
    if (!validatePassword()) return
    
    try {
      // В реальном приложении здесь будет запрос к API
      // await api.put('/users/change-password', passwordForm)
      
      toast.success('Пароль успешно изменен')
      setChangingPassword(false)
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (error) {
      console.error('Ошибка изменения пароля:', error)
      toast.error('Не удалось изменить пароль')
    }
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-neutral-800 flex items-center">
        <FiUser className="mr-2" /> Мой профиль
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Информация о профиле */}
        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Личная информация</h2>
            {!editingProfile && (
              <Button
                variant="outline"
                icon={FiEdit}
                onClick={() => setEditingProfile(true)}
              >
                Редактировать
              </Button>
            )}
          </div>
          
          {editingProfile ? (
            <form onSubmit={handleSaveProfile}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                    Имя
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    className={`w-full px-3 py-2 border ${errors.name ? 'border-error-300' : 'border-neutral-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                  />
                  {errors.name && <p className="mt-1 text-sm text-error-600">{errors.name}</p>}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    className={`w-full px-3 py-2 border ${errors.email ? 'border-error-300' : 'border-neutral-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                  />
                  {errors.email && <p className="mt-1 text-sm text-error-600">{errors.email}</p>}
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="+7 (___) ___-__-__"
                  />
                </div>
                
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-neutral-700 mb-1">
                    Роль
                  </label>
                  <input
                    type="text"
                    id="role"
                    value={user?.role === 'admin' ? 'Администратор' : 'Пользователь'}
                    disabled
                    className="w-full px-3 py-2 border border-neutral-300 bg-neutral-50 rounded-md shadow-sm"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingProfile(false)}
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  icon={FiSave}
                >
                  Сохранить
                </Button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-neutral-500">Имя</p>
                <p className="font-medium">{user?.name || profileForm.name}</p>
              </div>
              
              <div>
                <p className="text-sm text-neutral-500">Email</p>
                <p className="font-medium">{user?.email || profileForm.email}</p>
              </div>
              
              <div>
                <p className="text-sm text-neutral-500">Телефон</p>
                <p className="font-medium">{profileForm.phone || 'Не указан'}</p>
              </div>
              
              <div>
                <p className="text-sm text-neutral-500">Роль</p>
                <p className="font-medium">{user?.role === 'admin' ? 'Администратор' : 'Пользователь'}</p>
              </div>
            </div>
          )}
        </Card>
        
        {/* Изменение пароля */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Безопасность</h2>
            {!changingPassword && (
              <Button
                variant="outline"
                icon={FiKey}
                onClick={() => setChangingPassword(true)}
              >
                Изменить пароль
              </Button>
            )}
          </div>
          
          {changingPassword ? (
            <form onSubmit={handleSavePassword}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-neutral-700 mb-1">
                    Текущий пароль
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    className={`w-full px-3 py-2 border ${errors.currentPassword ? 'border-error-300' : 'border-neutral-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                  />
                  {errors.currentPassword && <p className="mt-1 text-sm text-error-600">{errors.currentPassword}</p>}
                </div>
                
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-neutral-700 mb-1">
                    Новый пароль
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    className={`w-full px-3 py-2 border ${errors.newPassword ? 'border-error-300' : 'border-neutral-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                  />
                  {errors.newPassword && <p className="mt-1 text-sm text-error-600">{errors.newPassword}</p>}
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1">
                    Подтверждение пароля
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    className={`w-full px-3 py-2 border ${errors.confirmPassword ? 'border-error-300' : 'border-neutral-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                  />
                  {errors.confirmPassword && <p className="mt-1 text-sm text-error-600">{errors.confirmPassword}</p>}
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setChangingPassword(false)}
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  icon={FiSave}
                >
                  Сохранить
                </Button>
              </div>
            </form>
          ) : (
            <div className="py-2">
              <p className="text-neutral-600">
                Для обеспечения безопасности вашего аккаунта рекомендуется регулярно менять пароль и использовать сложные комбинации символов.
              </p>
              
              <div className="mt-4 pt-4 border-t border-neutral-200">
                <h3 className="text-md font-medium mb-2">Дополнительные настройки</h3>
                
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full"
                  >
                    Настройки уведомлений
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                  >
                    История входов
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default ProfilePage