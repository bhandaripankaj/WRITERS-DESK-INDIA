import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { bookAPI, categoryAPI, collectionAPI } from '../services/api'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import '../styles/Dashboard.css'

function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [books, setBooks] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [collections, setCollections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [booksRes, categoriesRes, collectionsRes] = await Promise.all([
        bookAPI.getAll(),
        categoryAPI.getAll(),
        collectionAPI.getAll()
      ])
      setBooks(booksRes.data)
      setCategories(categoriesRes.data)
      setCollections(collectionsRes.data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Pie chart data for book status
  const pieData = [
    { name: 'Active', value: books.filter(b => b.status === 'active').length },
    { name: 'Inactive', value: books.filter(b => b.status === 'inactive').length },
    { name: 'Draft', value: books.filter(b => b.status === 'draft').length }
  ]

  // Bar chart data for categories
  const categoryData = categories.map(cat => ({
    name: cat.name,
    books: books.filter(book => book.categories.some((c: any) => c._id === cat._id)).length
  }))

  // Bar chart data for collections
  const collectionData = collections.map(col => ({
    name: col.name,
    books: books.filter(book => book.collections.some((c: any) => c._id === col._id)).length
  }))

  const COLORS = ['#3498db', '#e74c3c', '#f39c12']

  return (
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
          <h3>Categories</h3>
          <p className="stat-value">{categories.length}</p>
        </div>
        <div className="stat-card">
          <h3>Collections</h3>
          <p className="stat-value">{collections.length}</p>
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

              <section className="chart-section">
                <h3>Books by Category</h3>
                {loading ? (
                  <p className="loading">Loading data...</p>
                ) : categoryData.length === 0 ? (
                  <p className="no-data">No categories found</p>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={categoryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="books" fill="#3498db" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </section>

              <section className="chart-section">
                <h3>Books by Collection</h3>
                {loading ? (
                  <p className="loading">Loading data...</p>
                ) : collectionData.length === 0 ? (
                  <p className="no-data">No collections found</p>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={collectionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="books" fill="#27ae60" />
                    </BarChart>
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
  )
}

export default Dashboard

