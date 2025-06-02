import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { 
  FiArrowLeft, 
  FiEdit, 
  FiPrinter, 
  FiUser, 
  FiPackage, 
  FiTruck, 
  FiClock,
  FiClipboard
} from 'react-icons/fi'
import { toast } from 'react-toastify'
import api from '../../services/api'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

const OrderDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await api.get(`/orders/${id}`)
        setOrder(response.data)
        setIsLoading(false)
      } catch (error) {
        console.error('Ошибка загрузки информации о заказе:', error)
        setIsLoading(false)
        toast.error('Не удалось загрузить информацию о заказе')
      }
    }
    
    fetchOrderDetails()
  }, [id])
  
  const getBadgeVariant = (status) => {
    switch (status) {
      case 'Выполнен': return 'success'
      case 'В обработке': return 'primary'
      case 'Отправлен': 
      case 'Доставлен в ПВЗ': return 'accent'
      case 'Отменен': return 'error'
      case 'Собран': return 'secondary'
      default: return 'neutral'
    }
  }
  
  const handleUpdateStatus = async (newStatus) => {
    try {
      await api.updateOrder(id, { 
        customer: order.customer,
        items: order.items,
        pickup: order.pickup,
        comment: order.comment,
        status: newStatus
      })
      setOrder({ ...order, status: newStatus })
      toast.success(`Статус заказа изменен на "${newStatus}"`)
    } catch (error) {
      console.error('Ошибка обновления статуса:', error)
      toast.error('Не удалось обновить статус заказа')
    }
  }
  
  const handlePrintOrder = () => {
    // В реальном приложении здесь был бы код для печати заказа
    toast.info('Подготовка заказа к печати...')
  }
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }
  
  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-neutral-700">Заказ не найден</h2>
        <Button
          variant="primary"
          className="mt-4"
          onClick={() => navigate('/orders')}
        >
          Вернуться к списку заказов
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
            onClick={() => navigate('/orders')}
          >
            Назад
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">
              Заказ {order.number}
            </h1>
            <p className="text-neutral-500">от {order.date}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            icon={FiEdit}
            onClick={() => navigate(`/orders/${id}/edit`)}
          >
            Редактировать
          </Button>
          <Button
            variant="outline"
            icon={FiPrinter}
            onClick={handlePrintOrder}
          >
            Печать
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Основная информация */}
        <Card className="lg:col-span-2">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Детали заказа</h2>
            <Badge
              variant={getBadgeVariant(order.status)}
              size="lg"
              rounded
            >
              {order.status}
            </Badge>
          </div>
          
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {order.items.map((item, index) => (
                  <tr key={index} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-neutral-800">{item.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                      {item.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {item.price.toLocaleString('ru-RU')} ₽
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                      {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-neutral-50">
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-right font-medium">
                    Подытог:
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                    {order.subtotal.toLocaleString('ru-RU')} ₽
                  </td>
                </tr>
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-right font-medium">
                    Скидка:
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-accent-600">
                    {order.discount}%
                  </td>
                </tr>
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-right font-medium text-lg">
                    Итого:
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-lg">
                    {order.total.toLocaleString('ru-RU')} ₽
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>
        
        {/* Правая колонка */}
        <div className="space-y-6">
          {/* Информация о клиенте */}
          <Card>
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FiUser className="mr-2 text-primary-600" /> Информация о клиенте
            </h2>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-neutral-500">ФИО</p>
                <p className="font-medium">{order.customer.name}</p>
              </div>
              
              <div>
                <p className="text-sm text-neutral-500">Email</p>
                <p className="font-medium">{order.customer.email}</p>
              </div>
              
              <div>
                <p className="text-sm text-neutral-500">Телефон</p>
                <p className="font-medium">{order.customer.phone}</p>
              </div>
              
              <div>
                <p className="text-sm text-neutral-500">Адрес</p>
                <p className="font-medium">{order.customer.address}</p>
              </div>
            </div>
          </Card>
          
          {/* Информация о доставке */}
          <Card>
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FiTruck className="mr-2 text-primary-600" /> Информация о доставке
            </h2>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-neutral-500">Пункт выдачи</p>
                <p className="font-medium">{order.pickup}</p>
              </div>
              
              <div>
                <p className="text-sm text-neutral-500">Трек-номер</p>
                <p className="font-medium">{order.trackingNumber}</p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-neutral-200">
              <h3 className="text-md font-medium mb-2">Изменить статус</h3>
              
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleUpdateStatus('В обработке')}
                >
                  В обработке
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleUpdateStatus('Собран')}
                >
                  Собран
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleUpdateStatus('Отправлен')}
                >
                  Отправлен
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleUpdateStatus('Доставлен в ПВЗ')}
                >
                  Доставлен в ПВЗ
                </Button>
                <Button 
                  variant="success" 
                  className="w-full"
                  onClick={() => handleUpdateStatus('Выполнен')}
                >
                  Выполнен
                </Button>
                <Button 
                  variant="error" 
                  className="w-full"
                  onClick={() => handleUpdateStatus('Отменен')}
                >
                  Отменен
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      {/* История заказа */}
      <Card>
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <FiClock className="mr-2 text-primary-600" /> История заказа
        </h2>
        
        <div className="relative pl-8 before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200">
          {order.history.map((event, index) => (
            <div key={index} className="mb-6 relative">
              <div className="absolute -left-8 mt-1.5 w-4 h-4 rounded-full bg-primary-500"></div>
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <div>
                  <h3 className="text-md font-medium">{event.status}</h3>
                  <p className="text-sm text-neutral-600">{event.comment}</p>
                </div>
                <div className="text-sm text-neutral-500 mt-1 sm:mt-0">
                  {event.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default OrderDetailsPage