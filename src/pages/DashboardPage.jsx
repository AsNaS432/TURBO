import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  FiPackage, 
  FiShoppingCart, 
  FiUsers, 
  FiBarChart2, 
  FiPlus, 
  FiClock, 
  FiAlertCircle,
  FiCheckCircle
} from 'react-icons/fi'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import api from '../services/api'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const DashboardPage = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Добавлена проверка структуры данных перед использованием
  const validateStats = (data) => {
    return (
      data &&
      typeof data.totalInventory === 'number' &&
      typeof data.lowStockItems === 'number' &&
      typeof data.pendingOrders === 'number' &&
      typeof data.completedOrders === 'number'
    );
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/dashboard/stats');
        console.log('Ответ API:', response.data); // Логирование ответа API

        // Приведение числовых полей к числам
        const parsedData = {
          ...response.data,
          totalInventory: Number(response.data.totalInventory),
          lowStockItems: Number(response.data.lowStockItems),
          pendingOrders: Number(response.data.pendingOrders),
          completedOrders: Number(response.data.completedOrders),
        };

        const validData = validateStats(parsedData);
        setStats(
          validData
            ? parsedData
            : {
                totalInventory: 0,
                lowStockItems: 0,
                pendingOrders: 0,
                completedOrders: 0,
              }
        );
        setIsLoading(false);
      } catch (error) {
        console.error('Ошибка загрузки данных дашборда:', error);
        setStats({
          totalInventory: 0,
          lowStockItems: 0,
          pendingOrders: 0,
          completedOrders: 0,
        });
        setIsLoading(false);
      }
    };

    fetchDashboardData();

    const interval = setInterval(fetchDashboardData, 10000); // Обновление каждые 10 секунд

    return () => clearInterval(interval);
  }, [])
  
  const COLORS = ['#2563eb', '#14b8a6', '#f97316', '#ef4444', '#a855f7', '#737373']
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }
  
  // Добавлена проверка на наличие данных перед использованием map
  if (!stats || !Array.isArray(stats.recentActivity)) {
    return <p>Данные недоступны</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-neutral-800">
          Дашборд
        </h1>
        <p className="text-neutral-500">
          Добро пожаловать, {user?.name || 'Пользователь'}!
        </p>
      </div>
      
      {/* Основные показатели */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-primary-500 to-primary-600 text-white animate-fade-in">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white text-opacity-80 font-medium">Всего товаров</p>
              <p className="text-3xl font-bold mt-2">{stats.totalInventory}</p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <FiPackage className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <Link to="/inventory" className="text-sm text-white text-opacity-90 hover:text-opacity-100">
              Управление товарами →
            </Link>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-accent-500 to-accent-600 text-white animate-fade-in delay-75">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white text-opacity-80 font-medium">Заказы в обработке</p>
              <p className="text-3xl font-bold mt-2">{stats.pendingOrders}</p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <FiShoppingCart className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <Link to="/orders" className="text-sm text-white text-opacity-90 hover:text-opacity-100">
              Просмотреть заказы →
            </Link>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-error-500 to-error-600 text-white animate-fade-in delay-150">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white text-opacity-80 font-medium">Заканчиваются</p>
              <p className="text-3xl font-bold mt-2">{stats.lowStockItems}</p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <FiAlertCircle className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <Link to="/inventory?filter=lowStock" className="text-sm text-white text-opacity-90 hover:text-opacity-100">
              Пополнить запасы →
            </Link>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-success-500 to-success-600 text-white animate-fade-in delay-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white text-opacity-80 font-medium">Выполнено заказов</p>
              <p className="text-3xl font-bold mt-2">{stats.completedOrders}</p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <FiCheckCircle className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <Link to="/reports" className="text-sm text-white text-opacity-90 hover:text-opacity-100">
              Подробная статистика →
            </Link>
          </div>
        </Card>
      </div>
      
      {/* Графики и диаграммы */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* График продаж */}
        <Card 
          title="Продажи за неделю" 
          icon={FiBarChart2}
          className="animate-fade-in"
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={stats.salesData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  name="Выручка (₽)" 
                  stroke="#2563eb" 
                  fill="#3b82f6" 
                  fillOpacity={0.3} 
                />
                <Area 
                  type="monotone" 
                  dataKey="orders" 
                  name="Заказы (шт)" 
                  stroke="#f97316" 
                  fill="#fb923c" 
                  fillOpacity={0.3} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        {/* Распределение товаров по категориям */}
        <div className="grid grid-cols-1 gap-6">
          <Card 
            title="Товары по категориям" 
            icon={FiPackage}
            className="animate-fade-in delay-75"
          >
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.inventoryByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="category"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {stats.inventoryByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} шт.`, 'Количество']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Нижний блок */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Последние активности */}
        <Card 
          title="Последние активности" 
          icon={FiClock}
          className="lg:col-span-2 animate-fade-in"
        >
          <div className="space-y-3">
            {/* Очистка списка последних активностей */}
          </div>
          
          <div className="mt-4 text-center">
            <button className="text-primary-600 text-sm font-medium hover:text-primary-700">
              Показать все активности
            </button>
          </div>
        </Card>
        
        {/* Быстрые действия */}
        <Card 
          title="Быстрые действия" 
          className="animate-fade-in delay-75"
        >
          <div className="space-y-3">
            <Link to="/inventory/add">
              <Button
                variant="primary"
                size="md"
                className="w-full mb-3"
                icon={FiPlus}
              >
                Добавить товар
              </Button>
            </Link>
            
            <Link to="/orders/create">
              <Button
                variant="accent"
                size="md"
                className="w-full mb-3"
                icon={FiShoppingCart}
              >
                Создать заказ
              </Button>
            </Link>
            
            <Link to="/reports">
              <Button
                variant="outline"
                size="md"
                className="w-full"
                icon={FiBarChart2}
              >
                Сформировать отчет
              </Button>
            </Link>
          </div>
          
          <div className="mt-6 pt-4 border-t border-neutral-200">
            <h4 className="text-sm font-medium text-neutral-700 mb-3">Заказы по статусам</h4>
            <div className="space-y-2">
              {stats.ordersByStatus.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">{item.status}</span>
                  <span className="text-sm font-medium text-neutral-800">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default DashboardPage