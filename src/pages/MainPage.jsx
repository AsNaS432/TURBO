import { useAuth } from '../contexts/AuthContext'
import Layout from '../components/layout/Layout'
import GuestPage from './GuestPage'
import DashboardPage from './DashboardPage'

const MainPage = () => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <GuestPage />
  }

  return (
    <Layout>
      <DashboardPage />
    </Layout>
  )
}

export default MainPage
