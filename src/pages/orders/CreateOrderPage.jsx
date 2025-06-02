import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiPlus, FiSearch, FiTrash2 } from 'react-icons/fi'
import { toast } from 'react-toastify'
import api from '../../services/api'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

const CreateOrderPage = () => {
  const navigate = useNavigate()
  const [inventory, setInventory] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    customer: {
      name: '',
      email: '',
      phone: '',
      address: ''
    },
    items: [],
    pickup: '',
    comment: ''
  })
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedItems, setSelectedItems] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [errors, setErrors] = useState({})
  
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await api.get('/inventory')
        setInventory(response.data.filter(item => item.quantity > 0))
        setIsLoading(false)
      } catch (error) {
        console.error('Ошибка загрузки товаров:', error)
        setIsLoading(false)
      }
    }
    
    fetchInventory()
  }, [])
  
  useEffect(() => {
    if (searchTerm.length >= 2) {
      const filtered = inventory.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.sku.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setSearchResults(filtered)
      setShowSearchResults(true)
    } else {
      setShowSearchResults(false)
    }
  }, [searchTerm, inventory])
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    if (name.startsWith('customer.')) {
      const customerField = name.split('.')[1]
      setFormData({
        ...formData,
        customer: {
          ...formData.customer,
          [customerField]: value
        }
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
    
    // Очищаем ошибку при изменении поля
    if (name.startsWith('customer.')) {
      const customerField = name.split('.')[1]
      if (errors[`customer.${customerField}`]) {
        setErrors({ ...errors, [`customer.${customerField}`]: '' })
      }
    } else if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }
  
  const handleAddItem = (item) => {
    const existingItemIndex = selectedItems.findIndex(i => i.id === item.id)
    
    if (existingItemIndex >= 0) {
      // Если товар уже есть в списке, увеличиваем количество
      const updatedItems = [...selectedItems]
      if (updatedItems[existingItemIndex].quantity < item.quantity) {
        updatedItems[existingItemIndex].quantity += 1
        setSelectedItems(updatedItems)
      } else {
        toast.warning(`Достигнуто максимальное количество для товара "${item.name}"`)
      }
    } else {
      // Добавляем новый товар
      setSelectedItems([...selectedItems, { ...item, quantity: 1 }])
    }
    
    setSearchTerm('')
    setShowSearchResults(false)
  }
  
  const handleRemoveItem = (id) => {
    setSelectedItems(selectedItems.filter(item => item.id !== id))
  }
  
  const handleItemQuantityChange = (id, newQuantity) => {
    console.log('handleItemQuantityChange called with newQuantity:', newQuantity)
    const item = inventory.find(i => i.id === id)
    const maxQuantity = item ? item.quantity : 0

    let quantityInt = parseInt(newQuantity)
    console.log('Parsed quantityInt:', quantityInt)
    if (isNaN(quantityInt)) {
      quantityInt = 1
    }

    if (quantityInt > maxQuantity) {
      toast.warning(`Доступно только ${maxQuantity} единиц товара`)
      quantityInt = maxQuantity
    }

    if (quantityInt < 1) {
      quantityInt = 1
    }

    setSelectedItems(selectedItems.map(item =>
      item.id === id ? { ...item, quantity: quantityInt } : item
    ))
  }
  
  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }
  
  const validate = () => {
    const newErrors = {}
    
    if (!formData.customer.name) {
      newErrors['customer.name'] = 'Введите ФИО клиента'
    }
    
    if (!formData.customer.phone) {
      newErrors['customer.phone'] = 'Введите телефон клиента'
    }
    
    if (!formData.customer.email) {
      newErrors['customer.email'] = 'Введите email клиента'
    } else if (!/\S+@\S+\.\S+/.test(formData.customer.email)) {
      newErrors['customer.email'] = 'Неверный формат email'
    }
    
    if (!formData.pickup) {
      newErrors.pickup = 'Выберите пункт выдачи'
    }
    
    if (selectedItems.length === 0) {
      newErrors.items = 'Добавьте хотя бы один товар'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) return

    const orderData = {
      customer: {
        name: formData.customer.name,
        email: formData.customer.email,
        phone: formData.customer.phone,
        address: formData.customer.address,
      },
      items: selectedItems.map(item => ({
        id: item.id,
        quantity: item.quantity,
      })),
      pickup: formData.pickup,
      comment: formData.comment,
    }

    try {
      const response = await api.post('/orders', orderData)
      toast.success(`Заказ успешно создан: ${response.data.id}`)
      navigate('/orders')
    } catch (error) {
      console.error('Ошибка создания заказа:', error)
      toast.error('Не удалось создать заказ')
    }
  }
  
  const pickupPoints = [
    'ПВЗ №1 - ул. Ленина, 10',
    'ПВЗ №2 - ул. Гагарина, 25',
    'ПВЗ №3 - ул. Пушкина, 15',
    'ПВЗ №5 - ул. Мира, 78',
    'ПВЗ №8 - пр. Комсомольский, 42',
    'ПВЗ №12 - ул. Советская, 31'
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
            onClick={() => navigate('/orders')}
          >
            Назад
          </Button>
          <h1 className="text-2xl font-bold text-neutral-800">
            Создание нового заказа
          </h1>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Информация о клиенте */}
          <Card className="lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Информация о клиенте</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="customer.name" className="block text-sm font-medium text-neutral-700 mb-1">
                  ФИО клиента *
                </label>
                <input
                  type="text"
                  id="customer.name"
                  name="customer.name"
                  value={formData.customer.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${errors['customer.name'] ? 'border-error-300' : 'border-neutral-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                />
                {errors['customer.name'] && <p className="mt-1 text-sm text-error-600">{errors['customer.name']}</p>}
              </div>
              
              <div>
                <label htmlFor="customer.email" className="block text-sm font-medium text-neutral-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="customer.email"
                  name="customer.email"
                  value={formData.customer.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${errors['customer.email'] ? 'border-error-300' : 'border-neutral-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                />
                {errors['customer.email'] && <p className="mt-1 text-sm text-error-600">{errors['customer.email']}</p>}
              </div>
              
              <div>
                <label htmlFor="customer.phone" className="block text-sm font-medium text-neutral-700 mb-1">
                  Телефон *
                </label>
                <input
                  type="tel"
                  id="customer.phone"
                  name="customer.phone"
                  value={formData.customer.phone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${errors['customer.phone'] ? 'border-error-300' : 'border-neutral-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                  placeholder="+7 (___) ___-__-__"
                />
                {errors['customer.phone'] && <p className="mt-1 text-sm text-error-600">{errors['customer.phone']}</p>}
              </div>
              
              <div>
                <label htmlFor="pickup" className="block text-sm font-medium text-neutral-700 mb-1">
                  Пункт выдачи *
                </label>
                <select
                  id="pickup"
                  name="pickup"
                  value={formData.pickup}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${errors.pickup ? 'border-error-300' : 'border-neutral-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                >
                  <option value="">Выберите пункт выдачи</option>
                  {pickupPoints.map((point, index) => (
                    <option key={index} value={point}>{point}</option>
                  ))}
                </select>
                {errors.pickup && <p className="mt-1 text-sm text-error-600">{errors.pickup}</p>}
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="customer.address" className="block text-sm font-medium text-neutral-700 mb-1">
                  Адрес
                </label>
                <input
                  type="text"
                  id="customer.address"
                  name="customer.address"
                  value={formData.customer.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="comment" className="block text-sm font-medium text-neutral-700 mb-1">
                  Комментарий к заказу
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  value={formData.comment}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                ></textarea>
              </div>
            </div>
          </Card>
          
          {/* Товары и итоги */}
          <Card>
            <h2 className="text-lg font-semibold mb-4">Итоги заказа</h2>
            
            <div className="mb-4">
              <div className="flex justify-between">
                <p className="text-neutral-600">Товары ({selectedItems.length})</p>
                <p className="font-medium">{calculateTotal().toLocaleString('ru-RU')} ₽</p>
              </div>
              <div className="flex justify-between mt-2">
                <p className="text-neutral-600">Доставка</p>
                <p className="font-medium">0 ₽</p>
              </div>
              <div className="flex justify-between mt-4 text-lg border-t border-neutral-200 pt-2">
                <p className="font-medium">Итого</p>
                <p className="font-bold">{calculateTotal().toLocaleString('ru-RU')} ₽</p>
              </div>
            </div>
            
            <div className="mt-6">
              <Button
                type="submit"
                variant="primary"
                icon={FiPlus}
                className="w-full"
              >
                Создать заказ
              </Button>
            </div>
          </Card>
          
          {/* Выбор товаров */}
          <Card className="lg:col-span-3">
            <h2 className="text-lg font-semibold mb-4">Товары в заказе</h2>
            
            {errors.items && (
              <div className="mb-4 p-3 bg-error-50 border border-error-200 rounded-md text-error-700">
                {errors.items}
              </div>
            )}
            
            <div className="relative mb-6">
              <div className="flex">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Поиск товаров по названию или артикулу..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  variant="primary"
                  className="rounded-l-none"
                >
                  Найти
                </Button>
              </div>
              
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg overflow-hidden">
                  <ul className="max-h-60 overflow-y-auto py-1">
                    {searchResults.map((item) => (
                      <li 
                        key={item.id} 
                        className="px-4 py-2 hover:bg-neutral-50 cursor-pointer"
                        onClick={() => handleAddItem(item)}
                      >
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-neutral-500">Артикул: {item.sku}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{item.price.toLocaleString('ru-RU')} ₽</p>
                            <p className="text-sm text-neutral-500">В наличии: {item.quantity} шт.</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {showSearchResults && searchResults.length === 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg overflow-hidden">
                  <div className="px-4 py-3 text-neutral-500">
                    Товары не найдены
                  </div>
                </div>
              )}
            </div>
            
            {selectedItems.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Товар
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Артикул
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Кол-во
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Цена
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Сумма
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    {selectedItems.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-neutral-800">{item.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                          {item.sku}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex justify-center">
                            <div className="w-20">
                              <div className="flex items-center space-x-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const currentQuantity = item.quantity
                                    const maxQuantity = inventory.find(i => i.id === item.id)?.quantity || 0
                                    if (currentQuantity > 1) {
                                      handleItemQuantityChange(item.id, currentQuantity - 1)
                                    }
                                  }}
                                  className="px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300 select-none"
                                  aria-label="Уменьшить количество"
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  min="1"
                                  max={item.quantity}
                                  value={item.quantity}
                                  onChange={(e) => handleItemQuantityChange(item.id, e.target.value)}
                                  className="w-16 px-2 py-1 text-center border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                  style={{ MozAppearance: 'textfield' }}
                                  // This style hides the default spinner in Firefox
                                  onWheel={(e) => e.target.blur()} 
                                  // Prevent mouse wheel from changing value
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const currentQuantity = item.quantity
                                    const maxQuantity = inventory.find(i => i.id === item.id)?.quantity || 0
                                    if (currentQuantity < maxQuantity) {
                                      handleItemQuantityChange(item.id, currentQuantity + 1)
                                    }
                                  }}
                                  className="px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300 select-none"
                                  aria-label="Увеличить количество"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {item.price.toLocaleString('ru-RU')} ₽
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                          {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-error-600 hover:text-error-900"
                          >
                            <FiTrash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-neutral-50">
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-right font-medium">
                        Итого:
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-bold">
                        {calculateTotal().toLocaleString('ru-RU')} ₽
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 bg-neutral-50 rounded-md border border-neutral-200">
                <p className="text-neutral-500">Товары не добавлены</p>
                <p className="text-sm text-neutral-400 mt-1">Воспользуйтесь поиском выше, чтобы добавить товары</p>
              </div>
            )}
          </Card>
        </div>
      </form>
    </div>
  )
}

export default CreateOrderPage