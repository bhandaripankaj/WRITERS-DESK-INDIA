import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { bookAPI, categoryAPI, collectionAPI } from '../services/api'
import '../styles/ManagementPages.css'

interface Category {
  _id: string
  name: string
}

interface Collection {
  _id: string
  name: string
}

interface Book {
  _id: string
  title: string
  author: string
  subject?: string
  price: number
  status: string
  categories: Category[]
  collections: Collection[]
  cover?: string
  createdAt: string
}

function Books() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [books, setBooks] = useState<Book[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ 
    title: '', 
    author: '', 
    subject: '',
    price: '', 
    categories: [] as string[], 
    collections: [] as string[], 
    status: 'active',
    cover: ''
  })
  const [selectedCoverFile, setSelectedCoverFile] = useState<File | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [showCollectionDropdown, setShowCollectionDropdown] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest('.dropdown-container')) {
        setShowCategoryDropdown(false)
        setShowCollectionDropdown(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchData = async () => {
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
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddBook = async () => {
    if (!formData.title.trim() || !formData.author.trim() || !formData.price) return

    try {
      let coverUrl = formData.cover
      
      // Handle file upload (for now, convert to base64)
      if (selectedCoverFile) {
        const base64 = await convertFileToBase64(selectedCoverFile)
        coverUrl = base64
      }

      const bookData = {
        title: formData.title,
        author: formData.author,
        subject: formData.subject,
        price: parseFloat(formData.price),
        categories: formData.categories,
        collections: formData.collections,
        status: formData.status,
        cover: coverUrl
      }

      if (editingId) {
        await bookAPI.update(editingId, bookData)
        setEditingId(null)
      } else {
        await bookAPI.create(bookData)
      }
      setFormData({ title: '', author: '', subject: '', price: '', categories: [], collections: [], status: 'active', cover: '' })
      setSelectedCoverFile(null)
      setShowForm(false)
      fetchData()
    } catch (error) {
      console.error('Error saving book:', error)
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

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedCoverFile(file)
    }
  }

  const handleEdit = (book: Book) => {
    setFormData({ 
      title: book.title, 
      author: book.author, 
      subject: book.subject || '',
      price: book.price.toString(),
      categories: book.categories.map(c => c._id),
      collections: book.collections.map(c => c._id),
      status: book.status,
      cover: book.cover || ''
    })
    setSelectedCoverFile(null)
    setEditingId(book._id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await bookAPI.delete(id)
        fetchData()
      } catch (error) {
        console.error('Error deleting book:', error)
      }
    }
  }

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      categories: checked 
        ? [...prev.categories, categoryId]
        : prev.categories.filter(id => id !== categoryId)
    }))
  }

  const handleCollectionChange = (collectionId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      collections: checked 
        ? [...prev.collections, collectionId]
        : prev.collections.filter(id => id !== collectionId)
    }))
  }

  const handleCategorySelect = (categoryId: string) => {
    if (!formData.categories.includes(categoryId)) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, categoryId]
      }))
    }
    setShowCategoryDropdown(false)
    setSearchTerm('')
  }

  const handleCollectionSelect = (collectionId: string) => {
    if (!formData.collections.includes(collectionId)) {
      setFormData(prev => ({
        ...prev,
        collections: [...prev.collections, collectionId]
      }))
    }
    setShowCollectionDropdown(false)
    setSearchTerm('')
  }

  const removeCategory = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(id => id !== categoryId)
    }))
  }

  const removeCollection = (collectionId: string) => {
    setFormData(prev => ({
      ...prev,
      collections: prev.collections.filter(id => id !== collectionId)
    }))
  }

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredCollections = collections.filter(col => 
    col.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <section className="content-section">
      <div className="page-header">
        <h2>Books Management</h2>
        <button className="btn-primary" onClick={() => {
          setFormData({ title: '', author: '', subject: '', price: '', categories: [], collections: [], status: 'active', cover: '' })
          setSelectedCoverFile(null)
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
              type="text"
              placeholder="Subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="form-input"
            />
            <input
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="form-input"
            />
            
            <div className="form-group">
              <label>Cover Image:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverFileChange}
                className="form-input"
              />
              {selectedCoverFile && (
                <div className="file-preview">
                  <p>Selected: {selectedCoverFile.name}</p>
                  <img src={URL.createObjectURL(selectedCoverFile)} alt="Cover preview" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                </div>
              )}
              {!selectedCoverFile && formData.cover && (
                <div className="file-preview">
                  <p>Current Cover:</p>
                  <img src={formData.cover} alt="Current cover" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label>Categories:</label>
              <div className="selected-items">
                {formData.categories.map(catId => {
                  const category = categories.find(c => c._id === catId)
                  return category ? (
                    <span key={catId} className="selected-item">
                      {category.name}
                      <button type="button" onClick={() => removeCategory(catId)}>×</button>
                    </span>
                  ) : null
                })}
              </div>
              <div className="dropdown-container">
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setShowCategoryDropdown(true)}
                  className="form-input"
                />
                <button type="button" onClick={() => navigate('/categories')} className="add-new-btn">
                  + Add New Category
                </button>
                {showCategoryDropdown && (
                  <div className="dropdown-list">
                    {filteredCategories
                      .filter(cat => !formData.categories.includes(cat._id))
                      .map(category => (
                        <div
                          key={category._id}
                          className="dropdown-item"
                          onClick={() => handleCategorySelect(category._id)}
                        >
                          {category.name}
                        </div>
                      ))}
                    {filteredCategories.filter(cat => !formData.categories.includes(cat._id)).length === 0 && (
                      <div className="dropdown-item disabled">No categories found</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Collections:</label>
              <div className="selected-items">
                {formData.collections.map(colId => {
                  const collection = collections.find(c => c._id === colId)
                  return collection ? (
                    <span key={colId} className="selected-item">
                      {collection.name}
                      <button type="button" onClick={() => removeCollection(colId)}>×</button>
                    </span>
                  ) : null
                })}
              </div>
              <div className="dropdown-container">
                <input
                  type="text"
                  placeholder="Search collections..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setShowCollectionDropdown(true)}
                  className="form-input"
                />
                <button type="button" onClick={() => navigate('/collections')} className="add-new-btn">
                  + Add New Collection
                </button>
                {showCollectionDropdown && (
                  <div className="dropdown-list">
                    {filteredCollections
                      .filter(col => !formData.collections.includes(col._id))
                      .map(collection => (
                        <div
                          key={collection._id}
                          className="dropdown-item"
                          onClick={() => handleCollectionSelect(collection._id)}
                        >
                          {collection.name}
                        </div>
                      ))}
                    {filteredCollections.filter(col => !formData.collections.includes(col._id)).length === 0 && (
                      <div className="dropdown-item disabled">No collections found</div>
                    )}
                  </div>
                )}
              </div>
            </div>

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
                setFormData({ title: '', author: '', subject: '', price: '', categories: [], collections: [], status: 'active', cover: '' })
                setSelectedCoverFile(null)
                setShowCategoryDropdown(false)
                setShowCollectionDropdown(false)
                setSearchTerm('')
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
                <th>Cover</th>
                <th>Title</th>
                <th>Author</th>
                <th>Subject</th>
                <th>Price</th>
                <th>Categories</th>
                <th>Collections</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9}>Loading...</td>
                </tr>
              ) : books.length === 0 ? (
                <tr>
                  <td colSpan={9}>No books found</td>
                </tr>
              ) : (
                books.map(book => (
                  <tr key={book._id}>
                    <td>
                      {book.cover ? (
                        <img src={book.cover} alt={book.title} style={{ maxWidth: '50px', maxHeight: '50px', borderRadius: '4px' }} />
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.subject || '-'}</td>
                    <td>₹{book.price}</td>
                    <td>{book.categories.map(c => c.name).join(', ') || '-'}</td>
                    <td>{book.collections.map(c => c.name).join(', ') || '-'}</td>
                    <td><span className={`status ${book.status}`}>{book.status}</span></td>
                    <td className="action-buttons">
                      <button className="btn-sm" onClick={() => handleEdit(book)}>Edit</button>
                      <button className="btn-sm btn-danger" onClick={() => handleDelete(book._id)}>Delete</button>
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

export default Books
