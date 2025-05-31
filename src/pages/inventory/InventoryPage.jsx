import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiPackage, FiPlus, FiSearch, FiFilter, FiDownload } from 'react-icons/fi'
import api from '../../services/api'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Table from '../../components/ui/Table'
import Badge from '../../components/ui/Badge'

const InventoryPage = () => {
  const navigate = useNavigate()
  const [inventory, setInventory] = useState([])
  const [filteredInventory, setFilteredInventory] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    minQuantity: '',
    maxQuantity: '',
  })
  
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await api.get('/inventory')
        setInventory(response.data)
        setFilteredInventory(response.data)
        setIsLoading(false)
      } catch (error) {
        console.error('Ошибка загрузки данных инвентаря:', error)
        setIsLoading(false)
      }
    }
    
    fetchInventory()
  }, [])
  
  useEffect(() => {
    // Применяем поиск и фильтры
    let result = inventory
    
    // Поиск
    if (searchTerm) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Фильтр по категории
    if (filters.category) {
      result = result.filter(item => item.category === filters.category)
    }
    
    // Фильтр по статусу
    if (filters.status) {
      result = result.filter(item => item.status === filters.status)
    }
    
    // Фильтр по количеству
    if (filters.minQuantity) {
      result = result.filter(item => item.quantity >= parseInt(filters.minQuantity))
    }
    
    if (filters.maxQuantity) {
      result = result.filter(item => item.quantity <= parseInt(filters.maxQuantity))
    }
    
    setFilteredInventory(result)
  }, [searchTerm, filters, inventory])
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters({ ...filters, [name]: value })
  }
  
  const resetFilters = () => {
    setFilters({
      category: '',
      status: '',
      minQuantity: '',
      maxQuantity: '',
    })
    setSearchTerm('')
  }
  
  const categories = [...new Set(inventory.map(item => item.category))].sort()
  const statuses = [...new Set(inventory.map(item => item.status))].sort()
  
  const handleRowClick = (item) => {
    navigate(`/inventory/${item.id}`)
  }
  
  const columns = [
    {
      header: 'Наименование',
      accessor: 'name',
      cell: (row) => (
        <div>
          <div className="font-medium text-neutral-800">{row.name}</div>
          <div className="text-xs text-neutral-500">Артикул: {row.sku}</div>
        </div>
      )
    },
    {
      header: 'Категория',
      accessor: 'category',
    },
    {
      header: 'Количество',
      accessor: 'quantity',
      cell: (row) => (
        <div className="text-right">
          <span className={`font-medium ${row.quantity === 0 ? 'text-error-600' : 'text-neutral-800'}`}>
            {row.quantity} шт.
          </span>
        </div>
      )
    },
    {
      header: 'Место',
      accessor: 'location',
    },
    {
      header: 'Цена',
      accessor: 'price',
      cell: (row) => (
        <div className="text-right font-medium">
          {row.price.toLocaleString('ru-RU')} ₽
        </div>
      )
    },
    {
      header: 'Статус',
      accessor: 'status',
      cell: (row) => (
        <div>
          <Badge 
            variant={row.status === 'В наличии' ? 'success' : 'error'} 
            rounded
          >
            {row.status}
          </Badge>
        </div>
      )
    },
  ]
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-neutral-800 flex items-center">
          <FiPackage className="mr-2" /> Управление товарами
        </h1>
        
        <Button 
          variant="primary" 
          icon={FiPlus}
          onClick={() => navigate('/inventory/add')}
        >
          Добавить товар
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
              placeholder="Поиск по названию, артикулу или категории..."
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
                  Категория
                </label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Все категории</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
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
                  Мин. количество
                </label>
                <input
                  type="number"
                  name="minQuantity"
                  value={filters.minQuantity}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Макс. количество
                </label>
                <input
                  type="number"
                  name="maxQuantity"
                  value={filters.maxQuantity}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  min="0"
                />
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
            Найдено товаров: {filteredInventory.length}
          </p>
          
          <Table
            columns={columns}
            data={filteredInventory}
            onRowClick={handleRowClick}
            isLoading={isLoading}
            emptyMessage="Товары не найдены. Измените параметры поиска или добавьте новый товар."
          />
        </div>
      </Card>
    </div>
  )
}

export default InventoryPage