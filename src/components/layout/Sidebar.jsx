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
  
  // Создаем класс для активных ссылок
  const activeLink = "flex items-center px-4 py-2 mt-2 text-white bg-primary-700 rounded-md"
  const inactiveLink = "flex items-center px-4 py-2 mt-2 text-neutral-600 transition-colors duration-200 rounded-md hover:bg-neutral-100"
  
  return (
    <>
      {/* Мобильное затемнение */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Боковое меню */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto bg-white shadow-md transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-5">
          <div className="flex items-center">
            <span className="text-xl font-bold text-primary-600">
              Склад Турбо
            </span>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1 -mr-1 rounded-md md:hidden focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>
        
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