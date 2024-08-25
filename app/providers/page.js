'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProviderList from '@/components/ProviderList'

export default function ProvidersPage() {
  const router = useRouter()

  useEffect(() => {
    const isAuthorized = localStorage.getItem('isAuthorized')
    if (!isAuthorized) {
      router.push('/gate')
    }
  }, [router])

  return (
    <main className="container mx-auto p-8 text-right min-h-screen flex flex-col">
      <h1 className="text-3xl font-bold mb-6">ספקי שירות מומלצים בקהילה 🌟</h1>
      <ProviderList />
      <footer className="mt-auto pt-8 text-center text-sm text-gray-500">
        <p>
          🚀 רוצה לתרום? בקר ב-
          <a 
            href="https://github.com/eyal0s/indie-tlv-directory" 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline hover:text-gray-700 transition-colors"
          >
            GitHub Repository
          </a>
          {' '} 🌈
        </p>
      </footer>
    </main>
  )
}