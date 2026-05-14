import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Category from './pages/Category'
import Collections from './pages/Collections'
import Books from './pages/Books'
import UserRequests from './pages/UserRequests'
import Settings from './pages/Settings'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import './styles/App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <Layout>
                <Category />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/collections"
          element={
            <ProtectedRoute>
              <Layout>
                <Collections />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/books"
          element={
            <ProtectedRoute>
              <Layout>
                <Books />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-requests"
          element={
            <ProtectedRoute>
              <Layout>
                <UserRequests />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/subscribers"
          element={
            <ProtectedRoute>
              <Layout>
                <UserRequests />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Layout>
                <Settings />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  )
}

export default App
