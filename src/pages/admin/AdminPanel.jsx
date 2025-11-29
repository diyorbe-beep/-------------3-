import { useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import DashboardPage from './DashboardPage'
import OrdersPage from './OrdersPage'
import CustomersPage from './CustomersPage'
import FragranceProfilesPage from './FragranceProfilesPage'
import DiscountsPage from './DiscountsPage'
import FeedbackPage from './FeedbackPage'
import SettingsPage from './SettingsPage'
import SurveysPage from './SurveysPage'

function AdminPanel({ onNavigate }) {
  const [currentPage, setCurrentPage] = useState('dashboard')

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />
      case 'orders':
        return <OrdersPage />
      case 'customers':
        return <CustomersPage />
      case 'profiles':
        return <FragranceProfilesPage />
      case 'discounts':
        return <DiscountsPage />
      case 'feedback':
        return <FeedbackPage />
      case 'surveys':
        return <SurveysPage />
      case 'settings':
        return <SettingsPage />
      default:
        return <DashboardPage />
    }
  }

  return (
    <AdminLayout 
      currentPage={currentPage} 
      onNavigate={setCurrentPage}
      onBack={onNavigate ? () => onNavigate('home') : undefined}
    >
      {renderPage()}
    </AdminLayout>
  )
}

export default AdminPanel

