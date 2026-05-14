import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { collectionAPI } from '../services/api'
import '../styles/ManagementPages.css'

interface Collection {
  _id: string
  name: string
  description: string
  icon?: string
  createdAt: string
}

function Collections() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', description: '', icon: '' })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)

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
    if (!formData.name.trim()) return

    try {
      let iconUrl = formData.icon
      
      // Handle file upload (for now, convert to base64)
      if (selectedFile) {
        const base64 = await convertFileToBase64(selectedFile)
        iconUrl = base64
      }

      const collectionData = {
        ...formData,
        icon: iconUrl
      }

      if (editingId) {
        await collectionAPI.update(editingId, collectionData)
        setEditingId(null)
      } else {
        await collectionAPI.create(collectionData)
      }
      setFormData({ name: '', description: '', icon: '' })
      setSelectedFile(null)
      setShowForm(false)
      fetchCollections()
    } catch (error) {
      console.error('Error saving collection:', error)
    }
  }

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleEdit = (collection: Collection) => {
    setFormData({ 
      name: collection.name, 
      description: collection.description || '', 
      icon: collection.icon || ''
    })
    setSelectedFile(null)
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
          setFormData({ name: '', description: '', icon: '' })
          setSelectedFile(null)
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
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="form-input"
            />
            {selectedFile && (
              <div className="file-preview">
                <p>Selected: {selectedFile.name}</p>
                <img src={URL.createObjectURL(selectedFile)} alt="Preview" style={{ maxWidth: '100px', maxHeight: '100px' }} />
              </div>
            )}
            {!selectedFile && formData.icon && (
              <div className="file-preview">
                <p>Current Icon:</p>
                <img src={formData.icon} alt="Current icon" style={{ maxWidth: '100px', maxHeight: '100px' }} />
              </div>
            )}
            <textarea
              placeholder="Description (optional)"
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
                setFormData({ name: '', description: '', icon: '' })
                setSelectedFile(null)
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
                    <th>Icon</th>
                    <th>Description</th>
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
                        <td>
                          {collection.icon ? (
                            <img src={collection.icon} alt={collection.name} style={{ maxWidth: '50px', maxHeight: '50px' }} />
                          ) : (
                            '-'
                          )}
                        </td>
                        <td>{collection.description || '-'}</td>
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
