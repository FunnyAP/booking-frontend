// pages/admin/auth/login.js
import { useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:8000/api/admin/login', {
        email,
        password,
      })
      localStorage.setItem('admin_token', res.data.token)
      router.push('/admin/dashboard')
    } catch (err) {
      alert('Sai tài khoản hoặc mật khẩu')
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          className="w-full mb-3 p-2 border rounded"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Đăng nhập
        </button>
      </div>
    </div>
  )
}
