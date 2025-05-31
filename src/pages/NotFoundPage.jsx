import { Link } from 'react-router-dom'
import { FiArrowLeft, FiHome } from 'react-icons/fi'
import Button from '../components/ui/Button'

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center items-center px-4 py-12">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-600">404</h1>
        <h2 className="mt-4 text-3xl font-bold text-neutral-800">Страница не найдена</h2>
        <p className="mt-4 text-neutral-600 max-w-md mx-auto">
          Запрошенная страница не существует или была перемещена.
        </p>
        
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Button
            variant="primary"
            icon={FiHome}
            as={Link}
            to="/"
          >
            На главную
          </Button>
          
          <Button
            variant="outline"
            icon={FiArrowLeft}
            onClick={() => window.history.back()}
          >
            Вернуться назад
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage