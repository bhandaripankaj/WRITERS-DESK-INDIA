import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import '../styles/ManagementPages.css'

function Settings() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [settings, setSettings] = useState({
    siteName: 'Writers Desk India',
    email: 'admin@writersdesh.com',
    phone: '+91-XXXXXXXXXX',
    currency: 'INR',
    timezone: 'IST',
    maintenanceMode: false,
    emailNotifications: true,
    darkMode: false
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value })
  }

  const handleSaveSettings = () => {
    alert('Settings saved successfully!')
  }

  return (
    <section className="content-section">
      <div className="page-header">
        <h2>Settings</h2>
      </div>

      <div className="settings-container">
        <div className="settings-section">
          <h3>General Settings</h3>
          
          <div className="setting-item">
            <label>Site Name</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => handleSettingChange('siteName', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="setting-item">
            <label>Email</label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => handleSettingChange('email', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="setting-item">
            <label>Phone</label>
            <input
              type="tel"
              value={settings.phone}
              onChange={(e) => handleSettingChange('phone', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="setting-item">
            <label>Currency</label>
            <select
              value={settings.currency}
              onChange={(e) => handleSettingChange('currency', e.target.value)}
              className="form-input"
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>

          <div className="setting-item">
            <label>Timezone</label>
            <select
              value={settings.timezone}
              onChange={(e) => handleSettingChange('timezone', e.target.value)}
              className="form-input"
            >
              <option value="IST">IST (UTC+5:30)</option>
              <option value="UTC">UTC (UTC+0)</option>
              <option value="EST">EST (UTC-5)</option>
            </select>
          </div>
        </div>

        <div className="settings-section">
          <h3>Features & Preferences</h3>
          
          <div className="setting-toggle">
            <label>
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
              />
              Maintenance Mode
            </label>
          </div>

          <div className="setting-toggle">
            <label>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
              />
              Email Notifications
            </label>
          </div>

          <div className="setting-toggle">
            <label>
              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
              />
              Dark Mode
            </label>
          </div>
        </div>

        <div className="settings-buttons">
          <button className="btn-success" onClick={handleSaveSettings}>Save Settings</button>
          <button className="btn-secondary">Reset to Default</button>
        </div>
      </div>
    </section>
  )
}

export default Settings
