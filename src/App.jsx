import { useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Layout from './components/layout/Layout'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import InventoryPage from './pages/inventory/InventoryPage'
import InventoryItemPage from './pages/inventory/InventoryItemPage'
import AddInventoryItemPage from './pages/inventory/AddInventoryItemPage'
import OrdersPage from './pages/orders/OrdersPage'
import OrderDetailsPage from './pages/orders/OrderDetailsPage'
import CreateOrderPage from './pages/orders/CreateOrderPage'
import UsersPage from './pages/admin/UsersPage'
import ReportsPage from './pages/reports/ReportsPage'
import ProfilePage from './pages/ProfilePage'
import NotFoundPage from './pages/NotFoundPage'
import GuestPage from './pages/GuestPage'

// Защищенный маршрут для пользователей с определенной ролью
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard\" replace />
  }
  
  return children
}

// Маршрут только для неаутентифицированных пользователей
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  
  if (isAuthenticated) {
    // Перенаправляем на dashboard или страницу, с которой пришли
    const from = location.state?.from?.pathname || '/dashboard'
    return <Navigate to={from} replace />
  }
  
  return children
}

function App() {
  const { checkAuth } = useAuth()
  
  useEffect(() => {
    // Проверяем аутентификацию при загрузке приложения
    checkAuth()
  }, [checkAuth])
  
  return (
    <Routes>
      {/* Публичные маршруты */}
      <Route path="/guest" element={<GuestPage />} />
      <Route path="/login" element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <RegisterPage />
        </PublicRoute>
      } />
      
      {/* Защищенные маршруты */}
      <Route path="/" element={
        <ProtectedRoute allowedRoles={['user', 'admin']}>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard\" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="inventory/add" element={<AddInventoryItemPage />} />
        <Route path="inventory/:id" element={<InventoryItemPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="orders/create" element={<CreateOrderPage />} />
        <Route path="orders/:id" element={<OrderDetailsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        
        {/* Маршруты только для админа */}
        <Route path="admin/users" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <UsersPage />
          </ProtectedRoute>
        } />
      </Route>
      
      {/* Маршрут 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App