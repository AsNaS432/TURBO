import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiShoppingCart, FiPlus, FiSearch, FiFilter, FiDownload } from 'react-icons/fi'
import api from '../../services/api'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Table from '../../components/ui/Table'
import Badge from '../../components/ui/Badge'

const OrdersPage = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState({
    status: '',
    dateFrom: '',
    dateTo: '',
    pickup: '',
  })
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders')
        console.log('Полученные данные заказов:', response.data)
        setOrders(response.data)
        setFilteredOrders(response.data)
        setIsLoading(false)
      } catch (error) {
        console.error('Ошибка загрузки данных заказов:', error)
        setIsLoading(false)
      }
    }
    
    fetchOrders()
  }, [])
  
  useEffect(() => {
    // Применяем поиск и фильтры
    let result = orders
    
    // Поиск
    if (searchTerm) {
      result = result.filter(item => 
        item.number.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.pickup.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Фильтр по статусу
    if (filters.status) {
      result = result.filter(item => item.status === filters.status)
    }
    
    // Фильтр по дате (с)
    if (filters.dateFrom) {
      const dateFrom = new Date(filters.dateFrom)
      result = result.filter(item => new Date(item.date) >= dateFrom)
    }
    
    // Фильтр по дате (по)
    if (filters.dateTo) {
      const dateTo = new Date(filters.dateTo)
      dateTo.setHours(23, 59, 59) // Конец дня
      result = result.filter(item => new Date(item.date) <= dateTo)
    }
    
    // Фильтр по пункту выдачи
    if (filters.pickup) {
      result = result.filter(item => item.pickup === filters.pickup)
    }
    
    setFilteredOrders(result)
    console.log('Фильтрованные заказы:', filteredOrders)
  }, [searchTerm, filters, orders])
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters({ ...filters, [name]: value })
  }
  
  const resetFilters = () => {
    setFilters({
      status: '',
      dateFrom: '',
      dateTo: '',
      pickup: '',
    })
    setSearchTerm('')
  }
  
  const statuses = [...new Set(orders.map(item => item.status))].sort()
  const pickupPoints = [...new Set(orders.map(item => item.pickup))].sort()
  
  const handleRowClick = (item) => {
    navigate(`/orders/${item.id}`)
  }
  
  const getBadgeVariant = (status) => {
    switch (status) {
      case 'Выполнен': return 'success'
      case 'В обработке': return 'primary'
      case 'Отправлен': return 'accent'
      case 'Отменен': return 'error'
      default: return 'neutral'
    }
  }

  const handleDeleteOrder = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот заказ?')) {
      return
    }
    try {
      await api.delete(`/orders/${id}`)
      // Обновляем список заказов после удаления
      const response = await api.get('/orders')
      setOrders(response.data)
      setFilteredOrders(response.data)
    } catch (error) {
      console.error('Ошибка при удалении заказа:', error)
      alert('Не удалось удалить заказ. Попробуйте позже.')
    }
  }
  
  const columns = [
    {
      header: 'Номер',
      accessor: 'number',
      cell: (row) => {
        if (!row.number || row.number === '') {
          console.log('Номер отсутствует в заказе:', row);
          return <div className="font-medium text-primary-600">Не указан</div>;
        }
        return <div className="font-medium text-primary-600">{row.number}</div>;
      }
    },
    {
      header: 'Клиент',
      accessor: 'customer',
    },
    {
      header: 'Дата',
      accessor: 'date',
      cell: (row) => {
        if (!row.date) {
          console.log('Дата отсутствует в заказе:', row);
          return <div>Не указана</div>;
        }
        let date = new Date(row.date);
        if (isNaN(date.getTime())) {
          // Попытка преобразовать дату из формата 'DD.MM.YYYY' в ISO
          const parts = row.date.split('.');
          if (parts.length === 3) {
            const isoDateStr = `${parts[2]}-${parts[1]}-${parts[0]}`;
            date = new Date(isoDateStr);
            if (!isNaN(date.getTime())) {
              return <div>{date.toLocaleDateString('ru-RU')}</div>;
            }
          }
          console.log('Невалидная дата в заказе:', row.date, row);
          return <div>Не указана</div>;
        }
        return <div>{date.toLocaleDateString('ru-RU')}</div>;
      }
    },
    {
      header: 'Статус',
      accessor: 'status',
      cell: (row) => {
        const statusText = row.status && row.status !== '' ? row.status : 'Не указан';
        return (
          <div>
            <Badge 
              variant={getBadgeVariant(statusText)} 
              rounded
            >
              {statusText}
            </Badge>
          </div>
        )
      }
    },
    {
      header: 'Товары',
      accessor: 'items',
      cell: (row) => {
        // row.items is expected to be an array of objects with quantity
        const totalQuantity = Array.isArray(row.items)
          ? row.items.reduce((sum, item) => sum + (item.quantity || 0), 0)
          : 0;
        return (
          <div className="text-right">
            {totalQuantity} шт.
          </div>
        )
      }
    },
    {
      header: 'Пункт выдачи',
      accessor: 'pickup',
    },
    {
      header: 'Сумма',
      accessor: 'total',
      cell: (row) => {
        if (row.total === undefined || row.total === null) {
          console.log('Сумма отсутствует в заказе:', row);
          return <div className="text-right font-medium">0 ₽</div>;
        }
        const total = Number(row.total);
        if (isNaN(total)) {
          console.log('Некорректная сумма в заказе:', row.total, row);
          return <div className="text-right font-medium">0 ₽</div>;
        }
        return <div className="text-right font-medium">{total.toLocaleString('ru-RU')} ₽</div>;
      }
    },
    {
      header: 'Действия',
      accessor: 'actions',
      cell: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleDeleteOrder(row.id)
          }}
          className="text-red-600 hover:text-red-800 font-medium"
          title="Удалить заказ"
        >
          Удалить
        </button>
      )
    }
  ]
  
  const validOrders = filteredOrders.map(order => ({
    ...order,
    number: order.number || 'Не указан',
    customer: order.customer?.name || 'Не указан',
    date: order.date || 'Не указана',
    status: order.status || 'Не указан',
  }));

  console.log('Исключенные заказы:', filteredOrders.filter(order => !order.number || !order.customer || !order.date || !order.status));
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-neutral-800 flex items-center">
          <FiShoppingCart className="mr-2" /> Управление заказами
        </h1>
        
        <Button 
          variant="primary" 
          icon={FiPlus}
          onClick={() => navigate('/orders/create')}
        >
          Создать заказ
        </Button>
      </div>
      
      <Card>
        <div className="flex flex-col md:flex-row justify-between gap-4">
          {/* Поиск */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Поиск по номеру, клиенту или пункту выдачи..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          {/* Кнопки фильтрации и экспорта */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              icon={FiFilter}
              onClick={() => setFilterOpen(!filterOpen)}
            >
              Фильтры
            </Button>
            
            <Button
              variant="outline"
              icon={FiDownload}
            >
              Экспорт
            </Button>
          </div>
        </div>
        
        {/* Блок фильтров */}
        {filterOpen && (
          <div className="mt-4 p-4 bg-neutral-50 rounded-md border border-neutral-200 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Статус
                </label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Все статусы</option>
                  {statuses.map((status, index) => (
                    <option key={index} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Дата с
                </label>
                <input
                  type="date"
                  name="dateFrom"
                  value={filters.dateFrom}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Дата по
                </label>
                <input
                  type="date"
                  name="dateTo"
                  value={filters.dateTo}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Пункт выдачи
                </label>
                <select
                  name="pickup"
                  value={filters.pickup}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Все пункты</option>
                  {pickupPoints.map((point, index) => (
                    <option key={index} value={point}>{point}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button
                variant="ghost"
                onClick={resetFilters}
                className="mr-2"
              >
                Сбросить
              </Button>
              <Button
                variant="primary"
                onClick={() => setFilterOpen(false)}
              >
                Применить
              </Button>
            </div>
          </div>
        )}
        
        <div className="mt-4">
          <p className="text-sm text-neutral-500 mb-2">
            Найдено заказов: {filteredOrders.length}
          </p>
          
          <Table
            columns={columns}
            data={validOrders}
            onRowClick={handleRowClick}
            isLoading={isLoading}
            emptyMessage="Заказы не найдены. Измените параметры поиска или создайте новый заказ."
          />
        </div>
      </Card>
    </div>
  )
}

export default OrdersPage
