// lib/adminAuth.js
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function useAdminAuth() {
  const router = useRouter()
  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/auth/login')
    }
  }, [])
}
