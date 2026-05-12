import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import '../styles/ManagementPages.css'

interface Book {
  id: string
  title: string
  author: string
  price: number
  status: string
  category: string
  createdAt: string
}

function Books() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [books, setBooks] = useState<Book[]>([
    { id: '1', title: 'Book One', author: 'Author One', price: 299, status: 'active', category: 'Fiction', createdAt: '2025-01-15' },
    { id: '2', title: 'Book Two', author: 'Author Two', price: 399, status: 'active', category: 'Non-Fiction', createdAt: '2025-01-20' },
    { id: '3', title: 'Book Three', author: 'Author Three', price: 199, status: 'inactive', category: 'Fiction', createdAt: '2025-01-25' }
  ])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ title: '', author: '', price: '', category: '', status: 'active' })
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleAddBook = () => {
    if (formData.title.trim() && formData.author.trim() && formData.price) {
      if (editingId) {
        setBooks(books.map(b => 
          b.id === editingId ? { ...b, title: formData.title, author: formData.author, price: parseInt(formData.price), category: formData.category, status: formData.status } : b
        ))
        setEditingId(null)
      } else {
        setBooks([...books, {
          id: Date.now().toString(),
          title: formData.title,
          author: formData.author,
          price: parseInt(formData.price),
          status: formData.status,
          category: formData.category,
          createdAt: new Date().toISOString().split('T')[0]
        }])
      }
      setFormData({ title: '', author: '', price: '', category: '', status: 'active' })
      setShowForm(false)
    }
  }

  const handleEdit = (book: Book) => {
    setFormData({ 
      title: book.title, 
      author: book.author, 
      price: book.price.toString(),
      category: book.category,
      status: book.status
    })
    setEditingId(book.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    setBooks(books.filter(b => b.id !== id))
  }

  return (
    <div className="dashboard">
      <nav className="dashboard-navbar">
        <div className="navbar-brand">
          <h1>Writers Desk Admin</h1>
        </div>
        <div className="navbar-content">
          <span className="user-info">Welcome, {user?.name}!</span>
          <button onClick={() => logout()} className="logout-button">Logout</button>
        </div>
      </nav>

      <div className="dashboard-container">
        <aside className="sidebar">
          <ul className="sidebar-menu">
            <li><button onClick={() => navigate('/dashboard')}>Dashboard</button></li>
            <li><button onClick={() => navigate('/categories')}>Categories</button></li>
            <li><button onClick={() => navigate('/collections')}>Collections</button></li>
            <li><button onClick={() => navigate('/books')} className="active">Books</button></li>
            <li><button onClick={() => navigate('/user-requests')}>User Requests</button></li>
            <li><button onClick={() => navigate('/settings')}>Settings</button></li>
          </ul>
        </aside>

        <main className="main-content">
          <section className="content-section">
            <div className="page-header">
              <h2>Books Management</h2>
              <button className="btn-primary" onClick={() => {
                setFormData({ title: '', author: '', price: '', category: '', status: 'active' })
                setEditingId(null)
                setShowForm(!showForm)
              }}>
                + Add Book
              </button>
            </div>

        {showForm && (
          <div className="form-container">
            <h3>{editingId ? 'Edit Book' : 'Add New Book'}</h3>
            <input
              type="text"
              placeholder="Book Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="form-input"
            />
            <input
              type="text"
              placeholder="Author"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="form-input"
            />
            <input
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="form-input"
            />
            <input
              type="text"
              placeholder="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="form-input"
            />
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="form-input"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>
            <div className="form-buttons">
              <button className="btn-success" onClick={handleAddBook}>
                {editingId ? 'Update' : 'Add'}
              </button>
              <button className="btn-secondary" onClick={() => {
                setShowForm(false)
                setEditingId(null)
                setFormData({ title: '', author: '', price: '', category: '', status: 'active' })
              }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="table-container">
          <table className="management-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Price</th>
                <th>Category</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map(book => (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>₹{book.price}</td>
                  <td>{book.category}</td>
                  <td><span className={`status ${book.status}`}>{book.status}</span></td>
                  <td className="action-buttons">
                    <button className="btn-sm" onClick={() => handleEdit(book)}>Edit</button>
                    <button className="btn-sm btn-danger" onClick={() => handleDelete(book.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default Books
