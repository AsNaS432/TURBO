import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiPlus, FiTag } from 'react-icons/fi'
import { toast } from 'react-toastify'
import api from '../../services/api'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

const AddInventoryItemPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    quantity: 0,
    price: 0,
    location: '',
    status: 'В наличии',
    description: '',
    supplier: '',
    barcode: ''
  })
  
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === 'price' || name === 'quantity' ? parseInt(value) : value
    })
    
    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }
  
  const validate = () => {
    const newErrors = {}
    
    if (!formData.name) newErrors.name = 'Введите наименование товара'
    if (!formData.sku) newErrors.sku = 'Введите артикул (SKU)'
    if (!formData.category) newErrors.category = 'Выберите категорию'
    if (formData.price < 0) newErrors.price = 'Цена не может быть отрицательной'
    if (formData.quantity < 0) newErrors.quantity = 'Количество не может быть отрицательным'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validate()) return
    
    setIsLoading(true)
    
    try {
      // В реальном приложении здесь будет запрос к API
      // const response = await api.post('/inventory', formData)
      
      toast.success('Товар успешно добавлен')
      navigate('/inventory')
    } catch (error) {
      console.error('Ошибка добавления товара:', error)
      toast.error('Не удалось добавить товар')
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleScanBarcode = () => {
    // В реальном приложении здесь был бы код для сканирования штрих-кода
    toast.info('Функция сканирования штрих-кода в разработке')
  }
  
  const categories = [
    'Электроника',
    'Компьютеры',
    'Аудио',
    'ТВ',
    'Гаджеты',
    'Фото',
    'Бытовая техника',
    'Игры',
    'Прочее'
  ]
  
  return (
    <div className="space-y-6">
      {/* Шапка */}
      <div className="flex items-center justify-between">
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
            Добавление нового товара
          </h1>
        </div>
      </div>
      
      <Card>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                Наименование *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${errors.name ? 'border-error-300' : 'border-neutral-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
              />
              {errors.name && <p className="mt-1 text-sm text-error-600">{errors.name}</p>}
            </div>
            
            <div>
              <label htmlFor="sku" className="block text-sm font-medium text-neutral-700 mb-1">
                Артикул (SKU) *
              </label>
              <input
                type="text"
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${errors.sku ? 'border-error-300' : 'border-neutral-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
              />
              {errors.sku && <p className="mt-1 text-sm text-error-600">{errors.sku}</p>}
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-neutral-700 mb-1">
                Категория *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${errors.category ? 'border-error-300' : 'border-neutral-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
              >
                <option value="">Выберите категорию</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-sm text-error-600">{errors.category}</p>}
            </div>
            
            <div>
              <label htmlFor="barcode" className="block text-sm font-medium text-neutral-700 mb-1">
                Штрих-код
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="barcode"
                  name="barcode"
                  value={formData.barcode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <button
                  type="button"
                  className="bg-neutral-100 px-3 py-2 border border-neutral-300 border-l-0 rounded-r-md hover:bg-neutral-200 focus:outline-none"
                  onClick={handleScanBarcode}
                >
                  <FiTag className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-neutral-700 mb-1">
                Количество *
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${errors.quantity ? 'border-error-300' : 'border-neutral-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                min="0"
              />
              {errors.quantity && <p className="mt-1 text-sm text-error-600">{errors.quantity}</p>}
            </div>
            
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-neutral-700 mb-1">
                Цена (₽) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${errors.price ? 'border-error-300' : 'border-neutral-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                min="0"
              />
              {errors.price && <p className="mt-1 text-sm text-error-600">{errors.price}</p>}
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
                placeholder="Например: A1-B3"
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
              onClick={() => navigate('/inventory')}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={FiPlus}
              disabled={isLoading}
            >
              {isLoading ? 'Добавление...' : 'Добавить товар'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default AddInventoryItemPage