import ChatPopup from '../components/ui/ChatPopup'

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiPackage, FiShoppingCart, FiSearch, FiArrowRight, FiUser } from 'react-icons/fi'
import api from '../services/api'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'

const GuestPage = () => {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/inventory')
        setProducts(response.data)
        setIsLoading(false)
      } catch (error) {
        console.error('Ошибка загрузки товаров:', error)
        setIsLoading(false)
      }
    }
    
    fetchProducts()
  }, [])
  
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Шапка */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-primary-600 lg:text-2xl">
              Склад Турбо
            </h1>
            <span className="ml-2 px-2 py-1 bg-accent-100 text-accent-800 text-xs font-medium rounded-full">
              Гостевой доступ
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="primary" icon={FiUser}>
                Войти
              </Button>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Основное содержимое */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-neutral-800 mb-4">
            Информационная система складского учета
          </h2>
          <p className="text-neutral-600 max-w-3xl">
            Добро пожаловать в демонстрационный режим системы Склад Турбо! Здесь вы можете просмотреть доступные товары на складе. Для доступа к полному функционалу необходимо авторизоваться.
          </p>
        </div>
        
        {/* Поиск */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Поиск товаров..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Информационные карточки */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card 
            title="Товары на складе" 
            icon={FiPackage}
            className="animate-fade-in"
          >
            <div className="text-center py-4">
              <p className="text-3xl font-bold text-primary-600">{products.length}</p>
              <p className="text-neutral-600 mt-1">наименований товаров</p>
            </div>
          </Card>
          
          <Card 
            title="Статусы заказов" 
            icon={FiShoppingCart}
            className="animate-fade-in delay-75"
          >
            <div className="py-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-neutral-600">В обработке</span>
                <Badge variant="warning" rounded>12</Badge>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-neutral-600">Отправлены</span>
                <Badge variant="primary" rounded>8</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Выполнены</span>
                <Badge variant="success" rounded>35</Badge>
              </div>
            </div>
          </Card>
          
          <Card 
            title="Ограниченный доступ" 
            className="bg-neutral-50 border border-neutral-200 animate-fade-in delay-150"
          >
            <div className="py-2">
              <p className="text-neutral-600 mb-4">
                В гостевом режиме доступен только просмотр каталога товаров.
              </p>
              <Link to="/login">
                <Button variant="primary" className="w-full" icon={FiArrowRight}>
                  Войти в систему
                </Button>
              </Link>
            </div>
          </Card>
        </div>
        
        {/* Список товаров */}
        <h3 className="text-xl font-semibold text-neutral-800 mb-4">
          Доступные товары на складе
        </h3>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-neutral-200 transition-all duration-200 hover:shadow-lg animate-fade-in">
                <div className="p-4">
                  <div className="flex justify-between">
                    <Badge 
                      variant={product.status === 'В наличии' ? 'success' : 'error'} 
                      rounded
                    >
                      {product.status}
                    </Badge>
                    <span className="text-sm text-neutral-500">{product.category}</span>
                  </div>
                  
                  <h4 className="mt-2 text-lg font-medium text-neutral-800 line-clamp-2">
                    {product.name}
                  </h4>
                  
                  <div className="mt-3 flex justify-between items-end">
                    <div>
                      <p className="text-sm text-neutral-500">Артикул: {product.sku}</p>
                      <p className="text-sm text-neutral-500">На складе: {product.quantity} шт.</p>
                    </div>
                    <p className="text-lg font-bold text-neutral-900">
                      {product.price.toLocaleString('ru-RU')} ₽
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredProducts.length === 0 && (
              <div className="col-span-full py-8 text-center">
                <p className="text-neutral-500">Товары не найдены</p>
              </div>
            )}
          </div>
        )}
      </main>
      
      {/* Подвал */}
      <footer className="bg-white border-t border-neutral-200 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-neutral-600">
              &copy; {new Date().getFullYear()} Склад Турбо. Все права защищены.
            </p>
            <div className="mt-4 md:mt-0">
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Войти в систему
              </Link>
            </div>
          </div>
        </div>
      </footer>
      <ChatPopup />
    </div>
  )
}

export default GuestPage
