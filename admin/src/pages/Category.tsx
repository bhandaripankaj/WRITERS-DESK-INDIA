import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import '../styles/ManagementPages.css'

interface Category {
  id: string
  name: string
  description: string
  createdAt: string
}

function Category() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Fiction', description: 'Fiction books', createdAt: '2025-01-15' },
    { id: '2', name: 'Non-Fiction', description: 'Non-fiction books', createdAt: '2025-01-20' }
  ])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', description: '' })
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleAddCategory = () => {
    if (formData.name.trim()) {
      if (editingId) {
        setCategories(categories.map(c => 
          c.id === editingId ? { ...c, name: formData.name, description: formData.description } : c
        ))
        setEditingId(null)
      } else {
        setCategories([...categories, {
          id: Date.now().toString(),
          name: formData.name,
          description: formData.description,
          createdAt: new Date().toISOString().split('T')[0]
        }])
      }
      setFormData({ name: '', description: '' })
      setShowForm(false)
    }
  }

  const handleEdit = (category: Category) => {
    setFormData({ name: category.name, description: category.description })
    setEditingId(category.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    setCategories(categories.filter(c => c.id !== id))
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
            <li><button onClick={() => navigate('/categories')} className="active">Categories</button></li>
            <li><button onClick={() => navigate('/collections')}>Collections</button></li>
            <li><button onClick={() => navigate('/books')}>Books</button></li>
            <li><button onClick={() => navigate('/user-requests')}>User Requests</button></li>
            <li><button onClick={() => navigate('/settings')}>Settings</button></li>
          </ul>
        </aside>

        <main className="main-content">
          <section className="content-section">
            <div className="page-header">
              <h2>Categories Management</h2>
              <button className="btn-primary" onClick={() => {
                setFormData({ name: '', description: '' })
                setEditingId(null)
                setShowForm(!showForm)
              }}>
                + Add Category
              </button>
            </div>

            {showForm && (
              <div className="form-container">
                <h3>{editingId ? 'Edit Category' : 'Add New Category'}</h3>
                <input
                  type="text"
                  placeholder="Category Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                />
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-textarea"
                ></textarea>
                <div className="form-buttons">
                  <button className="btn-success" onClick={handleAddCategory}>
                    {editingId ? 'Update' : 'Add'}
                  </button>
                  <button className="btn-secondary" onClick={() => {
                    setShowForm(false)
                    setEditingId(null)
                    setFormData({ name: '', description: '' })
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
                    <th>Name</th>
                    <th>Description</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(category => (
                    <tr key={category.id}>
                      <td>{category.name}</td>
                      <td>{category.description}</td>
                      <td>{category.createdAt}</td>
                      <td className="action-buttons">
                        <button className="btn-sm" onClick={() => handleEdit(category)}>Edit</button>
                        <button className="btn-sm btn-danger" onClick={() => handleDelete(category.id)}>Delete</button>
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

export default Category
