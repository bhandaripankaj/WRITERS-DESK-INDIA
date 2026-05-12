import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
import { useAuthStore } from '../store/authStore'
import '../styles/Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Static login credentials for testing
      const ADMIN_EMAIL = 'admin@gmail.com'
      const ADMIN_PASSWORD = 'Admin@123'

      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        // Create mock user and token
        const mockUser = {
          id: '1',
          email: email,
          name: 'Admin User',
          role: 'admin'
        }
        const mockToken = 'mock_jwt_token_' + Date.now()

        login(mockUser, mockToken)
        navigate('/dashboard')
      } else {
        setError('Invalid email or password. Use admin@gmail.com / Admin@123')
      }
    } catch (err: any) {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Writers Desk India</h1>
        <h2>Admin Login</h2>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="login-footer">
          <p>© 2026 Writers Desk India. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default Login
