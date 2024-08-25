'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import AddProviderModal from '@/components/AddProviderModal'
import { Search, PlusIcon, Phone } from 'lucide-react'
import { useRouter } from 'next/navigation'

const categoryColors = {
  "מעצב/ת": { color: "bg-blue-100 text-blue-800", emoji: "🎨" },
  "מפתח/ת": { color: "bg-green-100 text-green-800", emoji: "💻" },
  "מנהל/ת מוצר": { color: "bg-purple-100 text-purple-800", emoji: "📊" },
  "שיווק": { color: "bg-yellow-100 text-yellow-800", emoji: "📢" },
  "רו״ח": { color: "bg-red-100 text-red-800", emoji: "💵" },
  "אחר": { color: "bg-gray-100 text-gray-800", emoji: "🔧" }
}

const formatPhoneNumber = (phoneNumber) => {
  // Remove non-digit characters
  const cleaned = ('' + phoneNumber).replace(/\D/g, '')
  
  // Format the number
  return `0${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`
}

const getWhatsAppLink = (phoneNumber) => {
  // Remove non-digit characters and ensure it starts with country code
  const cleaned = ('' + phoneNumber).replace(/\D/g, '')
  const withCountryCode = cleaned.startsWith('972') ? cleaned : `972${cleaned.slice(1)}`
  return `https://wa.me/${withCountryCode}`
}

export default function ProviderList() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [providers, setProviders] = useState([])
  const [upvotedProviders, setUpvotedProviders] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const isAuthorized = localStorage.getItem('isAuthorized')
        if (!isAuthorized) {
          router.push('/gate')
          return
        }

        const response = await fetch('/api/providers')
        if (response.status === 401) {
          localStorage.removeItem('isAuthorized')
          router.push('/gate')
          return
        }
        const data = await response.json()
        setProviders(data)
      } catch (error) {
        console.error('Error fetching providers:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProviders()
  }, [router])

  const handleUpvote = async (id) => {
    if (upvotedProviders[id]) return

    try {
      const response = await fetch('/api/providers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      if (response.ok) {
        setProviders(providers.map(p => 
          p._id === id ? { ...p, upvotes: p.upvotes + 1 } : p
        ))
        setUpvotedProviders({ ...upvotedProviders, [id]: true })
      }
    } catch (error) {
      console.error('Error upvoting provider:', error)
    }
  }

  const handleAddProvider = (newProvider) => {
    setProviders([...providers, newProvider])
  }

  const filteredProviders = providers.filter(provider =>
    provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getCategoryInfo = (category) => {
    return categoryColors[category] || categoryColors["אחר"]
  }

  if (isLoading) {
    return <div>טוען...</div>
  }

  return (
    <TooltipProvider>
      <div className="flex flex-row-reverse justify-between items-center mb-4">
        <div className="relative">
          <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="חיפוש..."
            className="pr-8 text-right"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusIcon className="w-5 h-5 mr-2" /> הוסף מומלץ חדש
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">שם</TableHead>
            <TableHead className="text-right">קטגוריה</TableHead>
            <TableHead className="text-right">טלפון</TableHead>
            <TableHead className="text-right">תיאור</TableHead>
            <TableHead className="text-right">פעולות</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProviders.map((provider) => (
            <TableRow key={provider._id}>
              <TableCell className="text-right">{provider.name}</TableCell>
              <TableCell className="text-right">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryInfo(provider.category).color}`}>
                  {getCategoryInfo(provider.category).emoji} {provider.category}
                </span>
              </TableCell>
              <TableCell className="text-left">
                <a 
                  href={getWhatsAppLink(provider.phone)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center hover:text-green-600 transition-colors"
                  dir="ltr"
                >
                  <Phone className="w-4 h-4 mr-1" />
                  {formatPhoneNumber(provider.phone)}
                </a>
              </TableCell>
              <TableCell className="text-right">
                <Tooltip>
                  <TooltipTrigger>
                    {provider.description}
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-sm">
                    <p>{provider.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleUpvote(provider._id)}
                  disabled={upvotedProviders[provider._id]}
                >
                  {upvotedProviders[provider._id] ? 'הצבעת' : '👍 +1'} ({provider.upvotes})
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AddProviderModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAddProvider={handleAddProvider} 
      />
    </TooltipProvider>
  )
}