import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { categoryAPI } from '../services/api'
import '../styles/ManagementPages.css'
const VITE_IMAGE_URL = import.meta.env.VITE_IMAGE_URL

interface Category {
  _id: string
  name: string
  description: string
  icon?: string
  createdAt: string
}

function Category() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', description: '', image: '' })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll()
      setCategories(response.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

 const handleAddCategory = async () => {
  if (!formData.name.trim()) return

  try {
    const data = new FormData()

    data.append('name', formData.name)
    data.append('description', formData.description)

    // IMPORTANT
    if (selectedFile) {
      data.append('image', selectedFile)
    }

    if (editingId) {
      await categoryAPI.update(editingId, data)
      setEditingId(null)
    } else {
      await categoryAPI.create(data)
    }

    setFormData({
      name: '',
      description: '',
      image: ''
    })

    setSelectedFile(null)
    setShowForm(false)

    fetchCategories()
  } catch (error) {
    console.error('Error saving category:', error)
  }
}

  // const convertFileToBase64 = (file: File): Promise<string> => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader()
  //     reader.readAsDataURL(file)
  //     reader.onload = () => resolve(reader.result as string)
  //     reader.onerror = error => reject(error)
  //   })
  // }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleEdit = (category: Category) => {
    setFormData({ 
      name: category.name, 
      description: category.description || '', 
      image: category.icon || '' 
    })
    setSelectedFile(null)
    setEditingId(category._id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await categoryAPI.delete(id)
        fetchCategories()
      } catch (error) {
        console.error('Error deleting category:', error)
      }
    }
  }

  return (
    <section className="content-section">
      <div className="page-header">
        <h2>Categories Management</h2>
        <button className="btn-primary" onClick={() => {
          setFormData({ name: '', description: '', image: '' })
          setSelectedFile(null)
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
                {!selectedFile && formData.image && (
                  <div className="file-preview">
                    <p>Current Icon:</p>
                    <img src={formData.image} alt="Current icon" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                  </div>
                )}
                <textarea
                  placeholder="Description (optional)"
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
                    setFormData({ name: '', description: '', image: '' })
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
                  ) : categories.length === 0 ? (
                    <tr>
                      <td colSpan={5}>No categories found</td>
                    </tr>
                  ) : (
                    categories.map(category => (
                      <tr key={category._id}>
                        <td>{category.name}</td>
                        <td>
                          {category.icon ? (
                            <img src={VITE_IMAGE_URL + category.icon} alt={category.name} style={{ maxWidth: '50px', maxHeight: '50px', borderRadius: '4px' }} />
                          ) : (
                            '-'
                          )}
                        </td>
                        <td>{category.description || '-'}</td>
                        <td>{new Date(category.createdAt).toLocaleDateString()}</td>
                        <td className="action-buttons">
                          <button className="btn-sm" onClick={() => handleEdit(category)}>Edit</button>
                          <button className="btn-sm btn-danger" onClick={() => handleDelete(category._id)}>Delete</button>
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

export default Category
