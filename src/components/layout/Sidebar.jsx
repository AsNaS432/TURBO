import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { 
  FiHome, 
  FiPackage, 
  FiShoppingCart, 
  FiBarChart2, 
  FiUsers, 
  FiSettings,
  FiX
} from 'react-icons/fi'

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, hasRole } = useAuth()
  const [showHeader, setShowHeader] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  
  // Создаем класс для активных ссылок
  const activeLink = "flex items-center px-4 py-2 mt-2 text-white bg-primary-700 rounded-md"
  const inactiveLink = "flex items-center px-4 py-2 mt-2 text-neutral-600 transition-colors duration-200 rounded-md hover:bg-neutral-100"
  
  const toggleHeader = () => {
    setShowHeader(!showHeader)
  }
  
  const handleMouseEnter = () => {
    setIsHovered(true)
  }
  
  const handleMouseLeave = () => {
    setIsHovered(false)
  }
  
  return (
    <>
      {/* Мобильное затемнение */}
      {(isHovered || isOpen) && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={toggleSidebar || handleMouseLeave}
        ></div>
      )}
      {/* Боковое меню */}
      <aside 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto bg-white shadow-md transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:block`}
      >
        {/* <div className="px-4 py-6 border-b border-neutral-200">
          <span className="block text-2xl font-extrabold text-primary-600 tracking-tight">
            Склад Турбо
          </span>
        </div> */}
        
        <nav className="mt-5 px-4">
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => isActive ? activeLink : inactiveLink}
          >
            <FiHome className="w-5 h-5 mr-3" />
            <span>Дашборд</span>
          </NavLink>
          
          <NavLink 
            to="/inventory" 
            className={({ isActive }) => isActive ? activeLink : inactiveLink}
          >
            <FiPackage className="w-5 h-5 mr-3" />
            <span>Товары</span>
          </NavLink>
          
          <NavLink 
            to="/orders" 
            className={({ isActive }) => isActive ? activeLink : inactiveLink}
          >
            <FiShoppingCart className="w-5 h-5 mr-3" />
            <span>Заказы</span>
          </NavLink>
          
          <NavLink 
            to="/reports" 
            className={({ isActive }) => isActive ? activeLink : inactiveLink}
          >
            <FiBarChart2 className="w-5 h-5 mr-3" />
            <span>Отчеты</span>
          </NavLink>
          
          {/* Раздел только для администраторов */}
          {hasRole('admin') && (
            <NavLink 
              to="/admin/users" 
              className={({ isActive }) => isActive ? activeLink : inactiveLink}
            >
              <FiUsers className="w-5 h-5 mr-3" />
              <span>Пользователи</span>
            </NavLink>
          )}
          
          <div className="mt-8 pt-4 border-t border-neutral-200">
            <NavLink 
              to="/profile" 
              className={({ isActive }) => isActive ? activeLink : inactiveLink}
            >
              <FiSettings className="w-5 h-5 mr-3" />
              <span>Настройки</span>
            </NavLink>
          </div>
        </nav>
        
        <div className="absolute bottom-0 w-full p-4 bg-neutral-50 border-t border-neutral-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white">
              {user?.name?.charAt(0) || 'П'}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-neutral-700">{user?.name || 'Пользователь'}</p>
              <p className="text-xs text-neutral-500">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
