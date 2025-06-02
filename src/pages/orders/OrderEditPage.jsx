import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FiArrowLeft, FiSave } from 'react-icons/fi'
import { toast } from 'react-toastify'
import api from '../../services/api'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

const OrderEditPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    customer: {
      name: '',
      email: '',
      phone: '',
      address: '',
    },
    items: [],
    pickup: '',
    comment: '',
  })

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/orders/${id}`)
        setOrder(response.data)
        setFormData({
          customer: {
            name: response.data.customer.name || '',
            email: response.data.customer.email || '',
            phone: response.data.customer.phone || '',
            address: response.data.customer.address || '',
          },
          items: response.data.items.map(item => ({
            product_id: item.product_id || item.id || item.productId || item.id,
            quantity: item.quantity || 1,
          })),
          pickup: response.data.pickup || '',
          comment: response.data.comment || '',
        })
        setIsLoading(false)
      } catch (error) {
        console.error('Ошибка загрузки заказа:', error)
        toast.error('Не удалось загрузить заказ')
        setIsLoading(false)
      }
    }
    fetchOrder()
  }, [id])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      customer: {
        ...prev.customer,
        [name]: value,
      }
    }))
  }

  const handlePickupChange = (e) => {
    setFormData(prev => ({
      ...prev,
      pickup: e.target.value,
    }))
  }

  const handleCommentChange = (e) => {
    setFormData(prev => ({
      ...prev,
      comment: e.target.value,
    }))
  }

  const handleItemQuantityChange = (index, value) => {
    setFormData(prev => {
      const newItems = [...prev.items]
      newItems[index].quantity = Number(value)
      return {
        ...prev,
        items: newItems,
      }
    })
  }

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { product_id: '', quantity: 1 }],
    }))
  }

  const handleRemoveItem = (index) => {
    setFormData(prev => {
      const newItems = [...prev.items]
      newItems.splice(index, 1)
      return {
        ...prev,
        items: newItems,
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.updateOrder(id, formData)
      toast.success('Заказ успешно обновлен')
      navigate(`/orders/${id}`)
    } catch (error) {
      console.error('Ошибка обновления заказа:', error)
      toast.error('Не удалось обновить заказ')
    }
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center">
          <Button
            variant="outline"
            icon={FiArrowLeft}
            className="mr-4"
            onClick={() => navigate(`/orders/${id}`)}
          >
            Назад
          </Button>
          <h1 className="text-2xl font-bold text-neutral-800">Редактирование заказа {order.number}</h1>
        </div>
        <Button
          variant="primary"
          icon={FiSave}
          onClick={handleSubmit}
        >
          Сохранить
        </Button>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Информация о клиенте</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="ФИО"
                name="name"
                value={formData.customer.name}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.customer.email}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Телефон"
                name="phone"
                value={formData.customer.phone}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Адрес"
                name="address"
                value={formData.customer.address}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Товары</h2>
            {formData.items.map((item, index) => (
              <div key={index} className="flex items-center gap-4 mb-2">
                <Input
                  label={`ID товара`}
                  value={item.product_id}
                  readOnly
                />
                <Input
                  label="Количество"
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleItemQuantityChange(index, e.target.value)}
                  required
                />
                <Button
                  variant="error"
                  onClick={() => handleRemoveItem(index)}
                  type="button"
                >
                  Удалить
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={handleAddItem}
              type="button"
            >
              Добавить товар
            </Button>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Пункт выдачи</h2>
            <Input
              label="Пункт выдачи"
              value={formData.pickup}
              onChange={handlePickupChange}
              required
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Комментарий</h2>
            <textarea
              className="w-full border border-neutral-300 rounded-md p-2"
              value={formData.comment}
              onChange={handleCommentChange}
              rows={4}
            />
          </div>
        </form>
      </Card>
    </div>
  )
}

export default OrderEditPage
