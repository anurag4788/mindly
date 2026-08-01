import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import styles from './AuthPage.module.css'

function AuthPage() {
  const navigate = useNavigate()
  const [isSignUp, setIsSignUp] = useState(false)

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  })

  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLoginChange = (e) => {
    setLoginData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSignupChange = (e) => {
    setSignupData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await api.post('/auth/login', loginData)
      localStorage.setItem('token', res.data.token)
      navigate('/diary')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSignupSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await api.post('/auth/register', signupData)
      setIsSignUp(false)
      setSignupData({ name: '', email: '', password: '' })
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={`${styles.card} ${isSignUp ? styles.active : ''}`}>
        <div className={styles.slideTrack}>
          <div className={styles.formPanel}>
            <form className={styles.form} onSubmit={handleLoginSubmit}>
              <h2>Welcome Back</h2>
              <p>Sign in to continue to Mindly.</p>

              <div className={styles.field}>
                <label htmlFor="login-email">Email</label>
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  placeholder="Enter your email"
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="login-password">Password</label>
                <input
                  id="login-password"
                  type="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  placeholder="Enter your password"
                />
              </div>

              {error && <p className={styles.error}>{error}</p>}

              <button type="submit" disabled={loading}>
                {loading ? 'Signing in...' : 'Login'}
              </button>

              <p className={styles.switchText}>
                Don’t have an account?{' '}
                <span onClick={() => setIsSignUp(true)}>Sign Up</span>
              </p>
            </form>
          </div>

          <div className={styles.formPanel}>
            <form className={styles.form} onSubmit={handleSignupSubmit}>
              <h2>Create Account</h2>
              <p>Join Mindly and start your private diary.</p>

              <div className={styles.field}>
                <label htmlFor="signup-name">Name</label>
                <input
                  id="signup-name"
                  type="text"
                  name="name"
                  value={signupData.name}
                  onChange={handleSignupChange}
                  placeholder="Enter your name"
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="signup-email">Email</label>
                <input
                  id="signup-email"
                  type="email"
                  name="email"
                  value={signupData.email}
                  onChange={handleSignupChange}
                  placeholder="Enter your email"
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="signup-password">Password</label>
                <input
                  id="signup-password"
                  type="password"
                  name="password"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  placeholder="Create a password"
                />
              </div>

              {error && <p className={styles.error}>{error}</p>}

              <button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Sign Up'}
              </button>

              <p className={styles.switchText}>
                Already have an account?{' '}
                <span onClick={() => setIsSignUp(false)}>Login</span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthPage