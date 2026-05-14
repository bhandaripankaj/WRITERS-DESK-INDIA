import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import '../styles/Dashboard.css'

interface LayoutProps {
  children: React.ReactNode
}

function Layout({ children }: LayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <div className="dashboard">
      <nav className="dashboard-navbar">
        <div className="navbar-brand">
          <h1>📚 Writers Desk Admin</h1>
        </div>
        <div className="navbar-content">
          <span className="user-info">Welcome, {user?.name}!</span>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-container">
        <aside className="sidebar">
          <ul className="sidebar-menu">
            <li><button onClick={() => navigate('/dashboard')} className={isActive('/dashboard') ? 'active' : ''}><span className="menu-icon">📊</span> Dashboard</button></li>
            <li><button onClick={() => navigate('/categories')} className={isActive('/categories') ? 'active' : ''}><span className="menu-icon">🏷️</span> Categories</button></li>
            <li><button onClick={() => navigate('/collections')} className={isActive('/collections') ? 'active' : ''}><span className="menu-icon">📚</span> Collections</button></li>
            <li><button onClick={() => navigate('/books')} className={isActive('/books') ? 'active' : ''}><span className="menu-icon">📖</span> Books</button></li>
            <li><button onClick={() => navigate('/user-requests')} className={isActive('/user-requests') ? 'active' : ''}><span className="menu-icon">👥</span> User Requests</button></li>
                        <li><button onClick={() => navigate('/subscribers')} className={isActive('/subscribers') ? 'active' : ''}><span className="menu-icon">👥</span> Subscribers & Newsletters</button></li>
            <li><button onClick={() => navigate('/settings')} className={isActive('/settings') ? 'active' : ''}><span className="menu-icon">⚙️</span> Settings</button></li>
          </ul>
        </aside>

        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout