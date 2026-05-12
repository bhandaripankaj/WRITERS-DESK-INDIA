import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import '../styles/ManagementPages.css'

interface UserRequest {
  id: string
  name: string
  email: string
  message: string
  status: string
  createdAt: string
}

function UserRequests() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [requests, setRequests] = useState<UserRequest[]>([
    { id: '1', name: 'John Doe', email: 'john@example.com', message: 'Want a new book category', status: 'pending', createdAt: '2025-01-22' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', message: 'Found a bug', status: 'resolved', createdAt: '2025-01-20' }
  ])
  const [filterStatus, setFilterStatus] = useState('all')

  const handleStatusChange = (id: string, newStatus: string) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: newStatus } : r))
  }

  const handleDelete = (id: string) => {
    setRequests(requests.filter(r => r.id !== id))
  }

  const filteredRequests = filterStatus === 'all' ? requests : requests.filter(r => r.status === filterStatus)

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
            <li><button onClick={() => navigate('/books')}>Books</button></li>
            <li><button onClick={() => navigate('/user-requests')} className="active">User Requests</button></li>
            <li><button onClick={() => navigate('/settings')}>Settings</button></li>
          </ul>
        </aside>

        <main className="main-content">
          <section className="content-section">
            <div className="page-header">
              <h2>User Requests</h2>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Requests</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

        <div className="table-container">
          <table className="management-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map(request => (
                <tr key={request.id}>
                  <td>{request.name}</td>
                  <td>{request.email}</td>
                  <td>{request.message}</td>
                  <td>
                    <select 
                      value={request.status}
                      onChange={(e) => handleStatusChange(request.id, e.target.value)}
                      className="status-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="resolved">Resolved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                  <td>{request.createdAt}</td>
                  <td className="action-buttons">
                    <button className="btn-sm btn-danger" onClick={() => handleDelete(request.id)}>Delete</button>
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

export default UserRequests
