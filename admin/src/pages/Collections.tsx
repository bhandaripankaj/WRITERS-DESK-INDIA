import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { collectionAPI } from '../services/api'
import '../styles/ManagementPages.css'

interface Collection {
  _id: string
  name: string
  description: string
  showHome: boolean
  ranking: number
  createdAt: string
}

function Collections() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', description: '', showHome: false, ranking: 0 })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  useEffect(() => {
    fetchCollections()
  }, [])

  const fetchCollections = async () => {
    try {
      const response = await collectionAPI.getAll()
      setCollections(response.data)
    } catch (error) {
      console.error('Error fetching collections:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCollection = async () => {
    if (!validateForm()) return

    try {
      const collectionData = {
        name: formData.name,
        description: formData.description,
        showHome: formData.showHome,
        ranking: formData.ranking,
      }

      if (editingId) {
        await collectionAPI.update(editingId, collectionData)
        setEditingId(null)
      } else {
        await collectionAPI.create(collectionData)
      }

      setFormData({ name: '', description: '', showHome: false, ranking: 0 })
      setShowForm(false)
      setErrors({})
      fetchCollections()
    } catch (error) {
      console.error('Error saving collection:', error)
    }
  }

  const handleEdit = (collection: Collection) => {
    setFormData({ 
      name: collection.name,
      description: collection.description || '',
      showHome: collection.showHome,
      ranking: collection.ranking || 0,
    })
    setEditingId(collection._id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this collection?')) {
      try {
        await collectionAPI.delete(id)
        fetchCollections()
      } catch (error) {
        console.error('Error deleting collection:', error)
      }
    }
  }

  return (
    <section className="content-section">
      <div className="page-header">
        <h2>Collections Management</h2>
        <button className="btn-primary" onClick={() => {
          setFormData({ name: '', description: '', showHome: false })
          setEditingId(null)
          setErrors({})
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
            {errors.name && <div className="error-message">{errors.name}</div>}
            <textarea
              placeholder="Description (optional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-textarea"
            ></textarea>
            <input
              type="number"
              placeholder="Ranking"
              value={formData.ranking}
              onChange={(e) => setFormData({ ...formData, ranking: Number(e.target.value) })}
              className="form-input"
              min={0}
            />
            <label>Show on Home Page:</label>
            <select
              value={formData.showHome ? 'yes' : 'no'}
              onChange={(e) => setFormData({ ...formData, showHome: e.target.value === 'yes' })}
              className="form-input"
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
            <div className="form-buttons">
              <button className="btn-success" onClick={handleAddCollection}>
                {editingId ? 'Update' : 'Add'}
              </button>
              <button className="btn-secondary" onClick={() => {
                setShowForm(false)
                setEditingId(null)
                setFormData({ name: '', description: '', showHome: false, ranking: 0 })
                setErrors({})
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
                    <th>Rank</th>
                    <th>Description</th>
                    <th>Show on Home</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5}>Loading...</td>
                    </tr>
                  ) : collections.length === 0 ? (
                    <tr>
                      <td colSpan={5}>No collections found</td>
                    </tr>
                  ) : (
                    collections.map(collection => (
                      <tr key={collection._id}>
                        <td>{collection.name}</td>
                        <td>{collection.ranking}</td>
                        <td>{collection.description || '-'}</td>
                        <td>{collection.showHome ? 'Yes' : 'No'}</td>
                        <td>{new Date(collection.createdAt).toLocaleDateString()}</td>
                        <td className="action-buttons">
                          <button className="btn-sm" onClick={() => handleEdit(collection)}>Edit</button>
                          <button className="btn-sm btn-danger" onClick={() => handleDelete(collection._id)}>Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
  )
}

export default Collections
