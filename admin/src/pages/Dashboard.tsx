import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import '../styles/Dashboard.css'

function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [books, setBooks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const mockBooks = [
    { _id: '1', title: 'Book 1', author: 'Author 1', price: 299, status: 'active' },
    { _id: '2', title: 'Book 2', author: 'Author 2', price: 399, status: 'active' },
    { _id: '3', title: 'Book 3', author: 'Author 3', price: 199, status: 'inactive' }
  ]

  useEffect(() => {
    setTimeout(() => {
      setBooks(mockBooks)
      setLoading(false)
    }, 500)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Pie chart data
  const pieData = [
    { name: 'Active', value: books.filter(b => b.status === 'active').length },
    { name: 'Inactive', value: books.filter(b => b.status === 'inactive').length }
  ]

  const COLORS = ['#3498db', '#e74c3c']

  return (
    <div className="dashboard">
      <nav className="dashboard-navbar">
        <div className="navbar-brand">
          <h1>Writers Desk Admin</h1>
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
            <li><button onClick={() => navigate('/dashboard')} className="active">Dashboard</button></li>
            <li><button onClick={() => navigate('/categories')}>Categories</button></li>
            <li><button onClick={() => navigate('/collections')}>Collections</button></li>
            <li><button onClick={() => navigate('/books')}>Books</button></li>
            <li><button onClick={() => navigate('/user-requests')}>User Requests</button></li>
            <li><button onClick={() => navigate('/settings')}>Settings</button></li>
          </ul>
        </aside>

        <main className="main-content">
          <section className="content-section">
            <h2>Dashboard</h2>
            
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Books</h3>
                <p className="stat-value">{books.length}</p>
              </div>
              <div className="stat-card">
                <h3>Active Books</h3>
                <p className="stat-value">{books.filter(b => b.status === 'active').length}</p>
              </div>
              <div className="stat-card">
                <h3>Collections</h3>
                <p className="stat-value">--</p>
              </div>
              <div className="stat-card">
                <h3>User Requests</h3>
                <p className="stat-value">--</p>
              </div>
            </div>

            <div className="dashboard-grid">
              <section className="chart-section">
                <h3>Book Status Distribution</h3>
                {loading ? (
                  <p className="loading">Loading data...</p>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </section>

              <section className="books-section">
                <div className="section-header">
                  <h3>Recent Books</h3>
                  <button className="btn-primary" onClick={() => navigate('/books')}>
                    + Manage Books
                  </button>
                </div>

                {loading && <p className="loading">Loading books...</p>}
                {error && <p className="error">{error}</p>}

                {!loading && books.length === 0 && (
                  <p className="no-data">No books found</p>
                )}

                {!loading && books.length > 0 && (
                  <div className="books-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Author</th>
                          <th>Price</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {books.slice(0, 5).map((book) => (
                          <tr key={book._id}>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>₹{book.price}</td>
                            <td>
                              <span className={`status ${book.status}`}>
                                {book.status}
                              </span>
                            </td>
                            <td>
                              <button className="btn-sm">Edit</button>
                              <button className="btn-sm btn-danger">Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default Dashboard

