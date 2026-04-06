import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('cognexa_token'))
  const [loading, setLoading] = useState(true)

  // Set axios default authorization header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchMe()
    } else {
      delete axios.defaults.headers.common['Authorization']
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  async function fetchMe() {
    try {
      const { data } = await axios.get('/api/auth/me')
      setUser(data.user)
    } catch {
      logout()
    } finally {
      setLoading(false)
    }
  }

  async function login(email, password) {
    const { data } = await axios.post('/api/auth/login', { email, password })
    localStorage.setItem('cognexa_token', data.token)
    setToken(data.token)
    setUser(data.user)
    return data
  }

  async function register(name, email, password) {
    const { data } = await axios.post('/api/auth/register', { name, email, password })
    localStorage.setItem('cognexa_token', data.token)
    setToken(data.token)
    setUser(data.user)
    return data
  }

  function logout() {
    localStorage.removeItem('cognexa_token')
    setToken(null)
    setUser(null)
    delete axios.defaults.headers.common['Authorization']
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
