import Admin from '../models/Admin.js'
import { generateToken } from '../config/jwt.js'

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const admin = await Admin.findOne({ email })

    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const isPasswordValid = await admin.comparePassword(password)

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = generateToken(admin._id)

    res.json({
      message: 'Login successful',
      user: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      },
      token
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const logout = (req, res) => {
  // Token is handled client-side by removing from localStorage
  res.json({ message: 'Logout successful' })
}
