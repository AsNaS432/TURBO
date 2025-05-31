import { useState, useEffect } from 'react'
import { FiUsers, FiPlus, FiSearch, FiEdit, FiTrash2, FiUserCheck, FiUserX } from 'react-icons/fi'
import { toast } from 'react-toastify'
import api from '../../services/api'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

const UsersPage = () => {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddUserForm, setShowAddUserForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    password: '',
    confirmPassword: ''
  })
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users')
        setUsers(response.data)
        setFilteredUsers(response.data)
        setIsLoading(false)
      } catch (error) {
        console.error('Ошибка загрузки пользователей:', error)
        setIsLoading(false)
        toast.error('Не удалось загрузить список пользователей')
      }
    }
    
    fetchUsers()
  }, [])
  
  useEffect(() => {
    // Применяем поиск
    if (searchTerm) {
      const filtered = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredUsers(filtered)
    } else {
      setFilteredUsers(users)
    }
  }, [searchTerm, users])
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }
  
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'user',
      password: '',
      confirmPassword: ''
    })
    setEditingUser(null)
  }
  
  const handleAddUser = () => {
    setShowAddUserForm(true)
    resetForm()
  }
  
  const handleEditUser = (user) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      password: '',
      confirmPassword: ''
    })
    setShowAddUserForm(true)
  }
  
  const handleCancelForm = () => {
    setShowAddUserForm(false)
    resetForm()
  }
  
  const handleSubmitForm = async (e) => {
    e.preventDefault()
    
    // Проверка пароля при создании нового пользователя
    if (!editingUser && formData.password !== formData.confirmPassword) {
      toast.error('Пароли не совпадают')
      return
    }
    
    try {
      if (editingUser) {
        // Обновление существующего пользователя
        // В реальном приложении здесь будет запрос к API
        // await api.put(`/users/${editingUser.id}`, formData)
        
        // Обновляем пользователя в списке
        const updatedUsers = users.map(user => 
          user.id === editingUser.id ? { ...user, ...formData } : user
        )
        setUsers(updatedUsers)
        toast.success('Пользователь успешно обновлен')
      } else {
        // Создание нового пользователя
        // В реальном приложении здесь будет запрос к API
        // const response = await api.post('/users', formData)
        
        // Добавляем нового пользователя в список
        const newUser = {
          id: users.length + 1,
          ...formData,
          lastLogin: '-',
          status: 'Активен'
        }
        setUsers([...users, newUser])
        toast.success('Пользователь успешно создан')
      }
      
      setShowAddUserForm(false)
      resetForm()
    } catch (error) {
      console.error('Ошибка сохранения пользователя:', error)
      toast.error(editingUser ? 'Не удалось обновить пользователя' : 'Не удалось создать пользователя')
    }
  }
  
  const handleToggleStatus = (user) => {
    const newStatus = user.status === 'Активен' ? 'Неактивен' : 'Активен'
    
    // В реальном приложении здесь будет запрос к API
    // await api.put(`/users/${user.id}/status`, { status: newStatus })
    
    const updatedUsers = users.map(u => 
      u.id === user.id ? { ...u, status: newStatus } : u
    )
    setUsers(updatedUsers)
    
    toast.success(`Статус пользователя изменен на "${newStatus}"`)
  }
  
  const handleDeleteUser = (user) => {
    if (window.confirm(`Вы уверены, что хотите удалить пользователя ${user.name}?`)) {
      // В реальном приложении здесь будет запрос к API
      // await api.delete(`/users/${user.id}`)
      
      const updatedUsers = users.filter(u => u.id !== user.id)
      setUsers(updatedUsers)
      toast.success('Пользователь успешно удален')
    }
  }
  
  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'admin': return 'primary'
      case 'user': return 'secondary'
      default: return 'neutral'
    }
  }
  
  const getStatusBadgeVariant = (status) => {
    return status === 'Активен' ? 'success' : 'error'
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-neutral-800 flex items-center">
          <FiUsers className="mr-2" /> Управление пользователями
        </h1>
        
        <Button 
          variant="primary" 
          icon={FiPlus}
          onClick={handleAddUser}
        >
          Добавить пользователя
        </Button>
      </div>
      
      {showAddUserForm && (
        <Card className="animate-fade-in">
          <h2 className="text-lg font-semibold mb-4">
            {editingUser ? `Редактирование пользователя: ${editingUser.name}` : 'Добавление нового пользователя'}
          </h2>
          
          <form onSubmit={handleSubmitForm}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                  ФИО
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-neutral-700 mb-1">
                  Роль
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="user">Пользователь</option>
                  <option value="admin">Администратор</option>
                </select>
              </div>
              
              {!editingUser && (
                <>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
                      Пароль
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required={!editingUser}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1">
                      Подтверждение пароля
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required={!editingUser}
                    />
                  </div>
                </>
              )}
              
              {editingUser && (
                <div className="md:col-span-2">
                  <p className="text-sm text-neutral-500 italic">
                    Оставьте поля пароля пустыми, если не хотите его менять.
                  </p>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelForm}
              >
                Отмена
              </Button>
              <Button
                type="submit"
                variant="primary"
              >
                {editingUser ? 'Сохранить изменения' : 'Добавить пользователя'}
              </Button>
            </div>
          </form>
        </Card>
      )}
      
      <Card>
        <div className="mb-4">
          <div className="relative max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Поиск пользователей..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Пользователь
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Роль
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Последний вход
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-neutral-800">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-neutral-600">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge 
                        variant={getRoleBadgeVariant(user.role)} 
                        rounded
                      >
                        {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-neutral-500">
                      {user.lastLogin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge 
                        variant={getStatusBadgeVariant(user.status)} 
                        rounded
                      >
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className={`p-1 rounded-full ${
                            user.status === 'Активен' 
                              ? 'text-error-600 hover:bg-error-50' 
                              : 'text-success-600 hover:bg-success-50'
                          }`}
                          title={user.status === 'Активен' ? 'Деактивировать' : 'Активировать'}
                        >
                          {user.status === 'Активен' ? <FiUserX className="h-5 w-5" /> : <FiUserCheck className="h-5 w-5" />}
                        </button>
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-1 rounded-full text-primary-600 hover:bg-primary-50"
                          title="Редактировать"
                        >
                          <FiEdit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="p-1 rounded-full text-error-600 hover:bg-error-50"
                          title="Удалить"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-neutral-500">
                      Пользователи не найдены
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}

export default UsersPage