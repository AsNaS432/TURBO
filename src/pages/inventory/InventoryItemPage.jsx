import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FiEdit, FiTrash2, FiArrowLeft, FiPackage, FiMap, FiCalendar, FiTag, FiUser } from 'react-icons/fi'
import { toast } from 'react-toastify'
import api from '../../services/api'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

const InventoryItemPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({})
  
  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await api.get(`/inventory/${id}`)
        setItem(response.data)
        setFormData(response.data)
        setIsLoading(false)
      } catch (error) {
        console.error('Ошибка загрузки информации о товаре:', error)
        setIsLoading(false)
        toast.error('Не удалось загрузить информацию о товаре')
      }
    }
    
    fetchItemDetails()
  }, [id])
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === 'price' || name === 'quantity' ? parseInt(value) : value
    })
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await api.put(`/inventory/${id}`, formData)
      setItem(formData)
      setIsEditing(false)
      toast.success('Информация о товаре обновлена')
    } catch (error) {
      console.error('Ошибка обновления товара:', error)
      toast.error('Не удалось обновить информацию о товаре')
    }
  }
  
  const handleDelete = async () => {
    if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      try {
        // В реальном приложении здесь будет запрос к API
        // await api.delete(`/inventory/${id}`)
        
        toast.success('Товар успешно удален')
        navigate('/inventory')
      } catch (error) {
        console.error('Ошибка удаления товара:', error)
        toast.error('Не удалось удалить товар')
      }
    }
  }
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }
  
  if (!item) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-neutral-700">Товар не найден</h2>
        <Button
          variant="primary"
          className="mt-4"
          onClick={() => navigate('/inventory')}
        >
          Вернуться к списку товаров
        </Button>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Шапка */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center">
          <Button
            variant="outline"
            icon={FiArrowLeft}
            className="mr-4"
            onClick={() => navigate('/inventory')}
          >
            Назад
          </Button>
          <h1 className="text-2xl font-bold text-neutral-800">
            {item.name}
          </h1>
        </div>
        
        <div className="flex gap-2">
          {!isEditing && (
            <>
              <Button
                variant="primary"
                icon={FiEdit}
                onClick={() => setIsEditing(true)}
              >
                Редактировать
              </Button>
              <Button
                variant="error"
                icon={FiTrash2}
                onClick={handleDelete}
              >
                Удалить
              </Button>
            </>
          )}
        </div>
      </div>
      
      {isEditing ? (
        /* Форма редактирования */
        <Card>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                  Наименование
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
                <label htmlFor="sku" className="block text-sm font-medium text-neutral-700 mb-1">
                  Артикул (SKU)
                </label>
                <input
                  type="text"
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-neutral-700 mb-1">
                  Категория
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label htmlFor="barcode" className="block text-sm font-medium text-neutral-700 mb-1">
                  Штрих-код
                </label>
                <input
                  type="text"
                  id="barcode"
                  name="barcode"
                  value={formData.barcode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-neutral-700 mb-1">
                  Количество
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  min="0"
                />
              </div>
              
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-neutral-700 mb-1">
                  Цена (₽)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  min="0"
                />
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-neutral-700 mb-1">
                  Местоположение на складе
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-neutral-700 mb-1">
                  Статус
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="В наличии">В наличии</option>
                  <option value="Нет в наличии">Нет в наличии</option>
                  <option value="Ожидается">Ожидается</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1">
                  Описание
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                ></textarea>
              </div>
              
              <div>
                <label htmlFor="supplier" className="block text-sm font-medium text-neutral-700 mb-1">
                  Поставщик
                </label>
                <input
                  type="text"
                  id="supplier"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Отмена
              </Button>
              <Button
                type="submit"
                variant="primary"
              >
                Сохранить изменения
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        /* Отображение информации о товаре */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <FiPackage className="mr-2 text-primary-600" /> Основная информация
                </h2>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-neutral-500">Наименование</p>
                    <p className="font-medium">{item.name}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-neutral-500">Артикул (SKU)</p>
                    <p className="font-medium">{item.sku}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-neutral-500">Категория</p>
                    <p className="font-medium">{item.category}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-neutral-500">Штрих-код</p>
                    <div className="flex items-center">
                      <FiTag className="mr-2" />
                      <p className="font-medium">{item.barcode}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-neutral-500">Описание</p>
                    <p>{item.description}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <FiTag className="mr-2 text-primary-600" /> Данные товара
                </h2>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-neutral-500">Статус</p>
                    <Badge 
                      variant={item.status === 'В наличии' ? 'success' : 'error'} 
                      rounded
                    >
                      {item.status}
                    </Badge>
                  </div>
                  
                  <div>
                    <p className="text-sm text-neutral-500">Количество</p>
                    <p className="font-medium">{item.quantity} шт.</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-neutral-500">Цена</p>
                    <p className="font-medium">{item.price.toLocaleString('ru-RU')} ₽</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-neutral-500">Местоположение на складе</p>
                    <div className="flex items-center">
                      <FiMap className="mr-2" />
                      <p className="font-medium">{item.location}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-neutral-500">Поставщик</p>
                    <div className="flex items-center">
                      <FiUser className="mr-2" />
                      <p className="font-medium">{item.supplier}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          <Card>
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FiCalendar className="mr-2 text-primary-600" /> Даты и события
            </h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-neutral-500">Дата добавления</p>
                <p className="font-medium">{item.dateAdded}</p>
              </div>
              
              <div>
                <p className="text-sm text-neutral-500">Последнее обновление</p>
                <p className="font-medium">{item.lastUpdated}</p>
              </div>
              
              <div className="pt-4 border-t border-neutral-200">
                <h3 className="text-md font-medium mb-2">Быстрые действия</h3>
                
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    Пополнить запасы
                  </Button>
                  <Button variant="outline" className="w-full">
                    История движения
                  </Button>
                  <Button variant="outline" className="w-full">
                    Печать этикетки
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default InventoryItemPage