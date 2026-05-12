import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import '../styles/ManagementPages.css'

interface Collection {
  id: string
  name: string
  description: string
  bookCount: number
  createdAt: string
}

function Collections() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [collections, setCollections] = useState<Collection[]>([
    { id: '1', name: 'Best Sellers', description: 'Top selling books', bookCount: 25, createdAt: '2025-01-10' },
    { id: '2', name: 'New Releases', description: 'Latest books', bookCount: 12, createdAt: '2025-01-18' }
  ])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', description: '' })
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleAddCollection = () => {
    if (formData.name.trim()) {
      if (editingId) {
        setCollections(collections.map(c => 
          c.id === editingId ? { ...c, name: formData.name, description: formData.description } : c
        ))
        setEditingId(null)
      } else {
        setCollections([...collections, {
          id: Date.now().toString(),
          name: formData.name,
          description: formData.description,
          bookCount: 0,
          createdAt: new Date().toISOString().split('T')[0]
        }])
      }
      setFormData({ name: '', description: '' })
      setShowForm(false)
    }
  }

  const handleEdit = (collection: Collection) => {
    setFormData({ name: collection.name, description: collection.description })
    setEditingId(collection.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    setCollections(collections.filter(c => c.id !== id))
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
            <li><button onClick={() => navigate('/collections')} className="active">Collections</button></li>
            <li><button onClick={() => navigate('/books')}>Books</button></li>
            <li><button onClick={() => navigate('/user-requests')}>User Requests</button></li>
            <li><button onClick={() => navigate('/settings')}>Settings</button></li>
          </ul>
        </aside>

        <main className="main-content">
          <section className="content-section">
            <div className="page-header">
              <h2>Collections Management</h2>
              <button className="btn-primary" onClick={() => {
                setFormData({ name: '', description: '' })
                setEditingId(null)
                setShowForm(!showForm)
              }}>
                + Add Collection
              </button>
            </div>

        {showForm && (
          <div className="form-container">
            <h3>{editingId ? 'Edit Collection' : 'Add New Collection'}</h3>
            <input
              type="text"
              placeholder="Collection Name"
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
              <button className="btn-success" onClick={handleAddCollection}>
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
                <th>Books</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {collections.map(collection => (
                <tr key={collection.id}>
                  <td>{collection.name}</td>
                  <td>{collection.description}</td>
                  <td>{collection.bookCount}</td>
                  <td>{collection.createdAt}</td>
                  <td className="action-buttons">
                    <button className="btn-sm" onClick={() => handleEdit(collection)}>Edit</button>
                    <button className="btn-sm btn-danger" onClick={() => handleDelete(collection.id)}>Delete</button>
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

export default Collections
