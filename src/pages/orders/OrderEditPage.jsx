import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FiArrowLeft, FiSave, FiEdit, FiTrash2 } from 'react-icons/fi'
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
  const [isEditing, setIsEditing] = useState(false)
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
    status: '', // added status field
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
          status: response.data.status || '', // set status from response
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
      setOrder(formData)
      setIsEditing(false)
      toast.success('Заказ успешно обновлен')
      navigate(`/orders/${id}`)
    } catch (error) {
      console.error('Ошибка обновления заказа:', error)
      toast.error('Не удалось обновить заказ')
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Вы уверены, что хотите удалить этот заказ?')) {
      try {
        await api.delete(`/orders/${id}`)
        toast.success('Заказ успешно удален')
        navigate('/orders')
      } catch (error) {
        console.error('Ошибка удаления заказа:', error)
        toast.error('Не удалось удалить заказ')
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
          <h1 className="text-2xl font-bold text-neutral-800">Заказ №{order.number}</h1>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
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
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false)
                  setFormData(order)
                }}
              >
                Отмена
              </Button>
              <Button
                variant="primary"
                icon={FiSave}
                onClick={handleSubmit}
              >
                Сохранить
              </Button>
            </>
          )}
        </div>
      </div>

      {!isEditing ? (
        <Card>
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Информация о клиенте</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">ФИО</p>
                  <p>{order.customer.name}</p>
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <p>{order.customer.email}</p>
                </div>
                <div>
                  <p className="font-medium">Телефон</p>
                  <p>{order.customer.phone}</p>
                </div>
                <div>
                  <p className="font-medium">Адрес</p>
                  <p>{order.customer.address}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Товары</h2>
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 mb-2">
                  <p>ID товара: {item.product_id}</p>
                  <p>Количество: {item.quantity}</p>
                </div>
              ))}
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Пункт выдачи</h2>
              <p>{order.pickup}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Статус заказа</h2>
              <p>{order.status}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Комментарий</h2>
              <p>{order.comment}</p>
            </div>
          </div>
        </Card>
      ) : (
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
              <h2 className="text-lg font-semibold mb-2">Статус заказа</h2>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              >
                <option value="">Выберите статус</option>
                <option value="Выполнен">Выполнен</option>
                <option value="В обработке">В обработке</option>
                <option value="Отправлен">Отправлен</option>
                <option value="Отменен">Отменен</option>
              </select>
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
      )}
    </div>
  )
}

export default OrderEditPage
