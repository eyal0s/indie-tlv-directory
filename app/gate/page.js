'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function GatePage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const response = await fetch('/api/verify-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    })

    if (response.ok) {
      localStorage.setItem('isAuthorized', 'true')
      router.push('/providers')
    } else {
      setError('סיסמה שגויה. נסה שוב.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">ברוכים הבאים</h2>
          <p className="mt-2 text-sm text-gray-600">אנא הזן את הסיסמה כדי להיכנס</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <Input
              type="password"
              required
              className="text-right"
              placeholder="סיסמה"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div>
            <Button type="submit" className="w-full">
              כניסה
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}