import { useState } from 'react'
import { FiBarChart2, FiDownload, FiFilter, FiPieChart, FiTrendingUp } from 'react-icons/fi'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

const ReportsPage = () => {
  const [dateRange, setDateRange] = useState({
    from: '2024-01-01',
    to: '2024-01-31'
  })
  const [reportType, setReportType] = useState('sales')
  
  const handleDateChange = (e) => {
    const { name, value } = e.target
    setDateRange({
      ...dateRange,
      [name]: value
    })
  }
  
  // Демо-данные для отчетов
  const salesData = [
    { date: '01.01', orders: 8, revenue: 245000 },
    { date: '02.01', orders: 12, revenue: 358000 },
    { date: '03.01', orders: 10, revenue: 312000 },
    { date: '04.01', orders: 15, revenue: 425000 },
    { date: '05.01', orders: 18, revenue: 520000 },
    { date: '06.01', orders: 14, revenue: 390000 },
    { date: '07.01', orders: 16, revenue: 460000 },
    { date: '08.01', orders: 20, revenue: 580000 },
    { date: '09.01', orders: 22, revenue: 630000 },
    { date: '10.01', orders: 17, revenue: 490000 },
    { date: '11.01', orders: 15, revenue: 420000 },
    { date: '12.01', orders: 13, revenue: 380000 },
    { date: '13.01', orders: 18, revenue: 510000 },
    { date: '14.01', orders: 22, revenue: 640000 },
    { date: '15.01', orders: 25, revenue: 720000 },
  ]
  
  const productCategoryData = [
    { name: 'Электроника', value: 35 },
    { name: 'Компьютеры', value: 25 },
    { name: 'Бытовая техника', value: 15 },
    { name: 'Аудио', value: 10 },
    { name: 'ТВ', value: 8 },
    { name: 'Прочее', value: 7 },
  ]
  
  const pickupPointData = [
    { name: 'ПВЗ №12', orders: 85 },
    { name: 'ПВЗ №5', orders: 63 },
    { name: 'ПВЗ №3', orders: 58 },
    { name: 'ПВЗ №8', orders: 42 },
    { name: 'ПВЗ №1', orders: 37 },
    { name: 'ПВЗ №2', orders: 29 },
  ]
  
  const COLORS = ['#2563eb', '#14b8a6', '#f97316', '#ef4444', '#a855f7', '#737373']
  
  const generateReport = () => {
    // В реальном приложении здесь был бы код для генерации отчета на основе выбранных параметров
    console.log('Генерация отчета:', { dateRange, reportType })
  }
  
  const downloadReport = () => {
    // В реальном приложении здесь был бы код для скачивания отчета
    console.log('Скачивание отчета:', { dateRange, reportType })
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-neutral-800 flex items-center">
          <FiBarChart2 className="mr-2" /> Отчеты и аналитика
        </h1>
      </div>
      
      <Card>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h2 className="text-lg font-semibold">Параметры отчета</h2>
          
          <div className="flex gap-2">
            <Button
              variant="primary"
              icon={FiFilter}
              onClick={generateReport}
            >
              Сформировать
            </Button>
            
            <Button
              variant="outline"
              icon={FiDownload}
              onClick={downloadReport}
            >
              Скачать
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              С даты
            </label>
            <input
              type="date"
              name="from"
              value={dateRange.from}
              onChange={handleDateChange}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              По дату
            </label>
            <input
              type="date"
              name="to"
              value={dateRange.to}
              onChange={handleDateChange}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Тип отчета
            </label>
            <select
              name="reportType"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="sales">Продажи</option>
              <option value="products">Товары</option>
              <option value="pickupPoints">Пункты выдачи</option>
            </select>
          </div>
        </div>
      </Card>
      
      {reportType === 'sales' && (
        <>
          <Card title="Продажи за период" icon={FiTrendingUp}>
            <div className="mb-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Сводная информация</h3>
                <div className="text-right">
                  <p className="text-sm text-neutral-500">Всего заказов: <span className="font-medium">265</span></p>
                  <p className="text-sm text-neutral-500">Выручка: <span className="font-medium">7,580,000 ₽</span></p>
                </div>
              </div>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={salesData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="orders" 
                    name="Заказы (шт)" 
                    stroke="#2563eb" 
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="revenue" 
                    name="Выручка (₽)" 
                    stroke="#f97316" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Топ-5 товаров по продажам" icon={FiBarChart2}>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Смартфон Samsung Galaxy A52', sales: 42 },
                      { name: 'Наушники Sony WH-1000XM4', sales: 35 },
                      { name: 'Умные часы Xiaomi Mi Band 6', sales: 28 },
                      { name: 'Ноутбук ASUS VivoBook', sales: 22 },
                      { name: 'Телевизор LG OLED C1', sales: 18 },
                    ]}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sales" name="Продажи (шт)" fill="#2563eb" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
            
            <Card title="Статусы заказов" icon={FiPieChart}>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Выполнен', value: 145 },
                        { name: 'В обработке', value: 35 },
                        { name: 'Отправлен', value: 55 },
                        { name: 'Отменен', value: 12 },
                        { name: 'Доставлен в ПВЗ', value: 18 },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {productCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} шт.`, 'Количество']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </>
      )}
      
      {reportType === 'products' && (
        <>
          <Card title="Распределение товаров по категориям" icon={FiPieChart}>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={productCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {productCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Доля']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Топ-5 товаров с низким остатком" icon={FiBarChart2}>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Кофемашина DeLonghi ECAM', quantity: 2 },
                      { name: 'Фотоаппарат Canon EOS 250D', quantity: 3 },
                      { name: 'Телевизор LG OLED C1', quantity: 4 },
                      { name: 'Наушники Sony WH-1000XM4', quantity: 5 },
                      { name: 'Планшет Apple iPad Air', quantity: 6 },
                    ]}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="quantity" name="Остаток (шт)" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
            
            <Card title="Оборачиваемость товаров" icon={FiTrendingUp}>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Умные часы Xiaomi Mi Band 6', turnover: 12.5 },
                      { name: 'Смартфон Samsung Galaxy A52', turnover: 10.8 },
                      { name: 'Наушники Sony WH-1000XM4', turnover: 8.6 },
                      { name: 'Ноутбук ASUS VivoBook', turnover: 5.2 },
                      { name: 'Телевизор LG OLED C1', turnover: 3.1 },
                    ]}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="turnover" name="Оборачиваемость (раз/мес)" fill="#14b8a6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </>
      )}
      
      {reportType === 'pickupPoints' && (
        <>
          <Card title="Загруженность пунктов выдачи" icon={FiBarChart2}>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={pickupPointData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="orders" name="Заказов (шт)" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Средний чек по пунктам выдачи" icon={FiBarChart2}>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'ПВЗ №12', amount: 32450 },
                      { name: 'ПВЗ №5', amount: 28760 },
                      { name: 'ПВЗ №3', amount: 35980 },
                      { name: 'ПВЗ №8', amount: 29200 },
                      { name: 'ПВЗ №1', amount: 27450 },
                      { name: 'ПВЗ №2', amount: 31250 },
                    ]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value.toLocaleString('ru-RU')} ₽`, 'Средний чек']} />
                    <Legend />
                    <Bar dataKey="amount" name="Средний чек (₽)" fill="#f97316" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
            
            <Card title="Процент отмен по пунктам выдачи" icon={FiPieChart}>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'ПВЗ №12', rate: 5.2 },
                      { name: 'ПВЗ №5', rate: 3.8 },
                      { name: 'ПВЗ №3', rate: 2.5 },
                      { name: 'ПВЗ №8', rate: 4.1 },
                      { name: 'ПВЗ №1', rate: 6.3 },
                      { name: 'ПВЗ №2', rate: 3.2 },
                    ]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, 'Процент отмен']} />
                    <Legend />
                    <Bar dataKey="rate" name="Процент отмен (%)" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}

export default ReportsPage