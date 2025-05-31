import axios from 'axios'

// Базовая конфигурация axios
const api = axios.create({
  baseURL: 'http://localhost:4000/api', // Вернул /api для корректной работы с backend
  headers: {
    'Content-Type': 'application/json',
  },
})

// Перехватчик для добавления токена к запросам
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Перехватчик для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Обработка ошибки 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Функция для имитации задержки API в демо-режиме
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Эмуляция API для демо-версии
const mockApi = {
  // Эмуляция получения списка товаров
  async getInventory() {
    await delay(500)
    return {
      data: [
        { id: 1, name: 'Смартфон Samsung Galaxy A52', sku: 'SM-A52-BLK', quantity: 15, category: 'Электроника', price: 24999, location: 'A1-B3', status: 'В наличии' },
        { id: 2, name: 'Ноутбук ASUS VivoBook', sku: 'VB-15-SLV', quantity: 8, category: 'Компьютеры', price: 46990, location: 'A2-C1', status: 'В наличии' },
        { id: 3, name: 'Наушники Sony WH-1000XM4', sku: 'WH-1000XM4-BLK', quantity: 5, category: 'Аудио', price: 29990, location: 'B1-D2', status: 'В наличии' },
        { id: 4, name: 'Планшет Apple iPad Air', sku: 'IPD-AIR-64-SG', quantity: 0, category: 'Электроника', price: 54990, location: 'A1-B5', status: 'Нет в наличии' },
        { id: 5, name: 'Умные часы Xiaomi Mi Band 6', sku: 'MI-BAND-6-BLK', quantity: 20, category: 'Гаджеты', price: 3990, location: 'C2-A4', status: 'В наличии' },
        { id: 6, name: 'Фотоаппарат Canon EOS 250D', sku: 'CAN-EOS-250D-BLK', quantity: 3, category: 'Фото', price: 39990, location: 'B2-C3', status: 'В наличии' },
        { id: 7, name: 'Кофемашина DeLonghi ECAM', sku: 'DL-ECAM-22.360', quantity: 2, category: 'Бытовая техника', price: 42990, location: 'D1-A2', status: 'В наличии' },
        { id: 8, name: 'Игровая консоль PlayStation 5', sku: 'PS5-DISC', quantity: 0, category: 'Игры', price: 59990, location: 'A3-B1', status: 'Нет в наличии' },
        { id: 9, name: 'Телевизор LG OLED C1', sku: 'LG-OLED55C1', quantity: 4, category: 'ТВ', price: 129990, location: 'D2-B4', status: 'В наличии' },
        { id: 10, name: 'Пылесос Dyson V11', sku: 'DYS-V11-ABS', quantity: 6, category: 'Бытовая техника', price: 45990, location: 'C1-D3', status: 'В наличии' },
      ]
    }
  },
  
  // Эмуляция получения деталей товара
  async getInventoryItem(id) {
    await delay(300)
    const items = [
      { id: 1, name: 'Смартфон Samsung Galaxy A52', sku: 'SM-A52-BLK', quantity: 15, category: 'Электроника', price: 24999, location: 'A1-B3', status: 'В наличии', 
        description: 'Смартфон Samsung Galaxy A52 с 6.5" Super AMOLED экраном, 6GB RAM, 128GB памяти и камерой 64MP.',
        supplier: 'ООО "Технопарк"', dateAdded: '2023-10-15', lastUpdated: '2024-01-20', barcode: '8801643566577' },
      { id: 2, name: 'Ноутбук ASUS VivoBook', sku: 'VB-15-SLV', quantity: 8, category: 'Компьютеры', price: 46990, location: 'A2-C1', status: 'В наличии',
        description: 'Ноутбук ASUS VivoBook с 15.6" FHD экраном, процессором Intel i5-1135G7, 8GB RAM и 512GB SSD.',
        supplier: 'ООО "КомпМаркет"', dateAdded: '2023-11-05', lastUpdated: '2024-01-18', barcode: '4718017886055' }
    ]
    
    return { data: items.find(item => item.id === parseInt(id)) || null }
  },
  
  // Эмуляция получения списка заказов
  async getOrders() {
    await delay(600)
    return {
      data: [
        { id: 1001, number: 'ORD-1001', customer: 'Иванов Иван', status: 'Выполнен', date: '2024-01-15', items: 3, total: 35980, pickup: 'ПВЗ №12' },
        { id: 1002, number: 'ORD-1002', customer: 'Петрова Анна', status: 'В обработке', date: '2024-01-18', items: 1, total: 54990, pickup: 'ПВЗ №5' },
        { id: 1003, number: 'ORD-1003', customer: 'Сидоров Алексей', status: 'Отправлен', date: '2024-01-16', items: 2, total: 49980, pickup: 'ПВЗ №8' },
        { id: 1004, number: 'ORD-1004', customer: 'Козлова Екатерина', status: 'Отменен', date: '2024-01-12', items: 4, total: 12970, pickup: 'ПВЗ №12' },
        { id: 1005, number: 'ORD-1005', customer: 'Новиков Дмитрий', status: 'Выполнен', date: '2024-01-10', items: 1, total: 39990, pickup: 'ПВЗ №3' },
        { id: 1006, number: 'ORD-1006', customer: 'Морозова Ольга', status: 'В обработке', date: '2024-01-19', items: 2, total: 7980, pickup: 'ПВЗ №12' },
        { id: 1007, number: 'ORD-1007', customer: 'Волков Сергей', status: 'Отправлен', date: '2024-01-17', items: 5, total: 86950, pickup: 'ПВЗ №5' },
        { id: 1008, number: 'ORD-1008', customer: 'Лебедева Наталья', status: 'Выполнен', date: '2024-01-11', items: 3, total: 28970, pickup: 'ПВЗ №8' },
      ]
    }
  },
  
  // Эмуляция получения деталей заказа
  async getOrderDetails(id) {
    await delay(400)
    const orders = [
      { 
        id: 1001, 
        number: 'ORD-1001', 
        customer: {
          name: 'Иванов Иван',
          email: 'ivanov@example.com',
          phone: '+7 (926) 123-45-67',
          address: 'г. Москва, ул. Ленина, д. 10, кв. 5'
        },
        status: 'Выполнен', 
        date: '2024-01-15', 
        items: [
          { id: 1, name: 'Смартфон Samsung Galaxy A52', sku: 'SM-A52-BLK', quantity: 1, price: 24999 },
          { id: 3, name: 'Наушники Sony WH-1000XM4', sku: 'WH-1000XM4-BLK', quantity: 1, price: 29990 },
        ], 
        subtotal: 54989,
        discount: 10,
        total: 49490,
        pickup: 'ПВЗ №12',
        trackingNumber: 'TRK123456789',
        history: [
          { date: '2024-01-15 18:30', status: 'Выполнен', comment: 'Заказ получен клиентом' },
          { date: '2024-01-15 12:15', status: 'Доставлен в ПВЗ', comment: 'Заказ доставлен в пункт выдачи' },
          { date: '2024-01-14 09:45', status: 'Отправлен', comment: 'Заказ передан в доставку' },
          { date: '2024-01-13 14:20', status: 'Собран', comment: 'Заказ собран и готов к отправке' },
          { date: '2024-01-12 10:30', status: 'В обработке', comment: 'Заказ принят в обработку' },
        ]
      }
    ]
    
    return { data: orders.find(order => order.id === parseInt(id)) || null }
  },
  
  // Эмуляция получения списка пользователей (только для админа)
  async getUsers() {
    await delay(700)
    return {
      data: [
        { id: 1, name: 'Администратор', email: 'admin@example.com', role: 'admin', lastLogin: '2024-01-20 14:30', status: 'Активен' },
        { id: 2, name: 'Петров Иван', email: 'petrov@example.com', role: 'user', lastLogin: '2024-01-19 09:15', status: 'Активен' },
        { id: 3, name: 'Сидорова Анна', email: 'sidorova@example.com', role: 'user', lastLogin: '2024-01-18 11:40', status: 'Активен' },
        { id: 4, name: 'Козлов Алексей', email: 'kozlov@example.com', role: 'user', lastLogin: '2024-01-15 16:20', status: 'Неактивен' },
        { id: 5, name: 'Новикова Ольга', email: 'novikova@example.com', role: 'user', lastLogin: '2024-01-17 10:05', status: 'Активен' },
      ]
    }
  },
  
  // Эмуляция получения статистики для дашборда
  async getDashboardStats() {
    await delay(400)
    return {
      data: {
        totalInventory: 63,
        lowStockItems: 7,
        pendingOrders: 12,
        completedOrders: 35,
        recentActivity: [
          { id: 1, type: 'order', action: 'Новый заказ', details: 'Заказ #ORD-1010 создан', time: '10 минут назад' },
          { id: 2, type: 'inventory', action: 'Обновление склада', details: 'Добавлено 5 единиц товара "Смартфон Xiaomi Redmi Note 11"', time: '30 минут назад' },
          { id: 3, type: 'order', action: 'Статус заказа', details: 'Заказ #ORD-1008 отмечен как выполненный', time: '1 час назад' },
          { id: 4, type: 'user', action: 'Новый пользователь', details: 'Зарегистрирован пользователь user@example.com', time: '2 часа назад' },
          { id: 5, type: 'inventory', action: 'Обновление склада', details: 'Списание товара "Планшет Apple iPad Air" (2 шт.)', time: '3 часа назад' },
        ],
        inventoryByCategory: [
          { category: 'Электроника', count: 25 },
          { category: 'Компьютеры', count: 12 },
          { category: 'Бытовая техника', count: 8 },
          { category: 'Аудио', count: 5 },
          { category: 'ТВ', count: 4 },
          { category: 'Прочее', count: 9 },
        ],
        ordersByStatus: [
          { status: 'В обработке', count: 12 },
          { status: 'Отправлен', count: 8 },
          { status: 'Доставлен', count: 25 },
          { status: 'Выполнен', count: 35 },
          { status: 'Отменен', count: 5 },
        ],
        salesData: [
          { date: '2024-01-15', orders: 8, revenue: 245000 },
          { date: '2024-01-16', orders: 12, revenue: 358000 },
          { date: '2024-01-17', orders: 10, revenue: 312000 },
          { date: '2024-01-18', orders: 15, revenue: 425000 },
          { date: '2024-01-19', orders: 18, revenue: 520000 },
          { date: '2024-01-20', orders: 14, revenue: 390000 },
          { date: '2024-01-21', orders: 16, revenue: 460000 },
        ]
      }
    }
  }
}

const usingMockApi = false

export default usingMockApi ? {
  // Аутентификация
  get: (url) => {
    if (url === '/users/me') {
      // Имитация получения данных пользователя
      const token = localStorage.getItem('token')
      if (token === 'demo_admin_token') {
        return Promise.resolve({ 
          data: {
            id: 1,
            name: 'Администратор',
            email: 'admin@example.com',
            role: 'admin'
          }
        })
      } else if (token === 'demo_user_token') {
        return Promise.resolve({ 
          data: {
            id: 2,
            name: 'Пользователь',
            email: 'user@example.com',
            role: 'user'
          }
        })
      }
      return Promise.reject({ response: { status: 401 } })
    }
    
    // Имитация других GET запросов
    if (url.startsWith('/inventory')) {
      const id = url.split('/')[2]
      if (id) {
        return mockApi.getInventoryItem(id)
      }
      return mockApi.getInventory()
    }
    
    if (url.startsWith('/orders')) {
      const id = url.split('/')[2]
      if (id) {
        return mockApi.getOrderDetails(id)
      }
      return mockApi.getOrders()
    }
    
    if (url === '/users') {
      return mockApi.getUsers()
    }
    
    if (url === '/dashboard/stats') {
      return mockApi.getDashboardStats()
    }
    
    return Promise.reject({ message: 'Неизвестный URL' })
  },
  post: () => Promise.resolve({ data: { success: true } }),
  put: () => Promise.resolve({ data: { success: true } }),
  delete: () => Promise.resolve({ data: { success: true } }),
  defaults: {
    headers: {
      common: {}
    }
  },
  interceptors: {
    request: { use: () => {} },
    response: { use: () => {} }
  }
} : api
