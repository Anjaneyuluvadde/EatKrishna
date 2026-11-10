import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { signIn, signUp, supabase } from '../services/supabase'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [mode, setMode] = useState('login')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.email || !form.password) return toast.error('Please fill all fields')
    setLoading(true)
    try {
      if (mode === 'login') {
        const { error } = await signIn(form.email, form.password)
        if (error) throw error
        toast.success('Welcome back! 🙏')
        navigate(from, { replace: true })
      } else {
        const { data, error } = await signUp(form.email, form.password)
        if (error) throw error

        const user = data.user
        if (user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: user.id,
                full_name: form.name,
                email: form.email,
              },
            ])

          if (profileError) throw profileError
        }

        toast.success('Account created! 🙏')
        navigate(from, { replace: true })
      }
    } catch (err) {
      toast.error(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const inp = {
    width: '100%',
    padding: '12px 14px 12px 40px',
    borderRadius: 10,
    border: '1.5px solid rgba(200,150,12,0.25)',
    background: '#FFFBF4',
    fontFamily: 'Poppins,sans-serif',
    fontSize: 14, color: '#333', outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFF5E1 0%, #F5E6C8 50%, #FFF5E1 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '100px clamp(16px, 4vw, 24px) 40px',
    }}>
      {/* Decorative bg blobs */}
      <div style={{ position: 'fixed', top: '15%', left: '10%', width: 260, height: 260, borderRadius: '50%', background: 'rgba(200,150,12,0.06)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '20%', right: '8%', width: 200, height: 200, borderRadius: '50%', background: 'rgba(139,0,0,0.04)', pointerEvents: 'none' }} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: '100%', maxWidth: 420 }}
      >
        {/* Card */}
        <div style={{
          background: '#fff',
          borderRadius: 20,
          padding: '36px 36px 32px',
          border: '1px solid rgba(200,150,12,0.15)',
          boxShadow: '0 20px 60px rgba(200,150,12,0.1), 0 4px 20px rgba(0,0,0,0.06)',
        }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              style={{ fontSize: 36, marginBottom: 8 }}
            >
              🪈
            </motion.div>
            <h1 style={{
              fontFamily: '"Playfair Display",serif', fontWeight: 700,
              fontSize: 22, color: '#C8960C', letterSpacing: '0.04em', marginBottom: 4,
            }}>
              Kbite
            </h1>
            <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: 13, color: '#aaa' }}>
              {mode === 'login' ? 'Welcome back!' : 'Create your account'}
            </p>
          </div>

          {/* Mode tabs */}
          <div style={{
            display: 'flex', background: '#FFF5E1', borderRadius: 10,
            padding: 4, marginBottom: 24,
            border: '1px solid rgba(200,150,12,0.12)',
          }}>
            {['login', 'signup'].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                flex: 1, padding: '9px 0', borderRadius: 8,
                border: 'none', cursor: 'pointer',
                fontFamily: 'Poppins,sans-serif', fontSize: 14,
                fontWeight: mode === m ? 600 : 400,
                transition: 'all 0.2s',
                background: mode === m ? '#C8960C' : 'transparent',
                color: mode === m ? '#fff' : '#888',
              }}>
                {m === 'login' ? 'Login' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <AnimatePresence>
                {mode === 'signup' && (
                  <motion.div key="name" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                    <div style={{ position: 'relative' }}>
                      <User size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#C8960C' }} />
                      <input name="name" value={form.name} onChange={onChange} placeholder="Full name" style={inp} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#C8960C' }} />
                <input name="email" type="email" value={form.email} onChange={onChange} placeholder="Email address" style={inp} />
              </div>

              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#C8960C' }} />
                <input name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={onChange} placeholder="Password" style={{ ...inp, paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                  {showPass ? <EyeOff size={16} color="#aaa" /> : <Eye size={16} color="#aaa" />}
                </button>
              </div>

              {mode === 'login' && (
                <div style={{ textAlign: 'right', marginTop: -6 }}>
                  <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Poppins,sans-serif', fontSize: 12, color: '#C8960C' }}>
                    Forgot password?
                  </button>
                </div>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02, boxShadow: '0 6px 24px rgba(200,150,12,0.35)' }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                style={{
                  width: '100%', padding: '13px 0',
                  background: loading ? '#e0c97a' : '#C8960C',
                  color: '#fff', border: 'none', borderRadius: 10,
                  fontFamily: 'Poppins,sans-serif', fontSize: 15, fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  marginTop: 4, letterSpacing: '0.02em', transition: 'background 0.2s',
                }}
              >
                {loading
                  ? <div style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  : <>{mode === 'login' ? 'Login' : 'Create Account'} <ArrowRight size={16} /></>
                }
              </motion.button>
            </div>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(200,150,12,0.12)' }} />
            <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: 12, color: '#ccc' }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(200,150,12,0.12)' }} />
          </div>

          {/* Google */}
          <button style={{
            width: '100%', padding: '12px 0', background: '#fff',
            border: '1.5px solid rgba(200,150,12,0.2)', borderRadius: 10,
            fontFamily: 'Poppins,sans-serif', fontSize: 14, color: '#555',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M5.26 9.77A7.15 7.15 0 0 1 12 4.85c1.73 0 3.28.62 4.52 1.64l3.35-3.35A11.98 11.98 0 0 0 12 .85C7.63.85 3.82 3.34 1.98 7l3.28 2.77Z"/>
              <path fill="#FBBC05" d="M16.52 17.82A7.14 7.14 0 0 1 12 19.15a7.15 7.15 0 0 1-6.73-4.73l-3.28 2.54A12 12 0 0 0 12 23.15c3.1 0 5.91-1.12 8.07-2.96l-3.55-2.37Z"/>
              <path fill="#4285F4" d="M23.15 12c0-.85-.07-1.65-.2-2.44H12v4.61h6.27a5.34 5.34 0 0 1-2.32 3.5l3.55 2.37C21.78 18.1 23.15 15.27 23.15 12Z"/>
              <path fill="#34A853" d="M5.27 14.42A7.24 7.24 0 0 1 4.85 12c0-.85.15-1.67.42-2.44L1.98 6.97A12.02 12.02 0 0 0 .85 12c0 1.93.46 3.74 1.13 5.38l3.29-2.96Z"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <p style={{ textAlign: 'center', fontFamily: 'Poppins,sans-serif', fontSize: 12, color: '#bbb', marginTop: 16 }}>
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </motion.div>
    </div>
  )
}
