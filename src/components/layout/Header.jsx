import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { FiMenu, FiBell, FiUser, FiLogOut, FiSettings } from 'react-icons/fi'

const Header = ({ toggleSidebar }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    // Проверяем localStorage при инициализации
    return localStorage.getItem('theme') === 'dark';
  });
  const dropdownRef = useRef(null)
  const notificationsRef = useRef(null)
  
  const notifications = [
    { id: 1, text: 'Новый заказ #ORD-1010', time: '10 минут назад', unread: true },
    { id: 2, text: 'Товар "Смартфон Xiaomi" добавлен', time: '30 минут назад', unread: true },
    { id: 3, text: 'Заказ #ORD-1008 выполнен', time: '1 час назад', unread: false },
    { id: 4, text: 'Нужно обновить остатки', time: '3 часа назад', unread: false },
  ]
  
  // Закрываем дропдауны при клике вне их области
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
      
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  const handleLogout = () => {
    logout()
    navigate('/login')
  }
  
  const handleToggleTheme = () => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem('theme', next ? 'dark' : 'light');
      return next;
    });
  }
  
  return (
    <header className="z-10 py-4 bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-6">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-1 mr-4 -ml-1 rounded-md md:hidden focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <FiMenu className="w-6 h-6" />
          </button>
          
          <h1 className="text-xl font-bold text-primary-600 lg:text-2xl">
            Склад Турбо
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Уведомления */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 relative"
            >
              <FiBell className="w-6 h-6" />
              <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-error-500 rounded-full"></span>
            </button>
            
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-10 animate-fade-in">
                <div className="px-4 py-2 border-b border-neutral-200">
                  <h3 className="text-sm font-semibold text-neutral-700">Уведомления</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className={`px-4 py-3 hover:bg-neutral-50 ${notification.unread ? 'bg-primary-50' : ''}`}>
                      <p className="text-sm font-medium text-neutral-800">{notification.text}</p>
                      <p className="text-xs text-neutral-500 mt-1">{notification.time}</p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-neutral-200">
                  <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                    Просмотреть все
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Переключатель темы */}
          <button
            onClick={handleToggleTheme}
            className="rounded-full p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
            title={darkMode ? 'Светлая тема' : 'Тёмная тема'}
            style={{ fontSize: 20 }}
          >
            {darkMode ? '🌙' : '☀️'}
          </button>
          
          {/* Профиль пользователя */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full"
            >
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white">
                <FiUser />
              </div>
              <span className="hidden md:block ml-2 text-sm font-medium text-neutral-700">
                {user?.name || 'Пользователь'}
              </span>
            </button>
            
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 animate-fade-in">
                <div className="px-4 py-2 text-sm text-neutral-700 border-b border-neutral-200">
                  {user?.role === 'admin' ? 'Администратор' : 'Пользователь'}
                </div>
                <Link 
                  to="/profile"
                  className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                >
                  <FiUser className="mr-2 h-4 w-4" />
                  Мой профиль
                </Link>
                <Link 
                  to="/profile/settings"
                  className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                >
                  <FiSettings className="mr-2 h-4 w-4" />
                  Настройки
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                >
                  <FiLogOut className="mr-2 h-4 w-4" />
                  Выйти
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header