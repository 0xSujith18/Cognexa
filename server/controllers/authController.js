import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export async function register(req, res) {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email and password are required.' })

    const exists = await User.findOne({ email })
    if (exists)
      return res.status(409).json({ message: 'An account with this email already exists.' })

    const user  = await User.create({ name, email, password })
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.status(201).json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required.' })

    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid email or password.' })

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export async function getMe(req, res) {
  try {
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ message: 'User not found.' })
    res.json({ user: { _id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
