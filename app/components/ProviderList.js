'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import AddProviderModal from '@/components/AddProviderModal'
import { Search, PlusIcon } from 'lucide-react'

const categoryColors = {
  "מעצב/ת": { color: "bg-blue-100 text-blue-800", emoji: "🎨" },
  "מפתח/ת": { color: "bg-green-100 text-green-800", emoji: "💻" },
  "מנהל/ת מוצר": { color: "bg-purple-100 text-purple-800", emoji: "📊" },
  "שיווק": { color: "bg-yellow-100 text-yellow-800", emoji: "📢" },
  "רו״ח": { color: "bg-red-100 text-red-800", emoji: "💵" },
  "אחר": { color: "bg-gray-100 text-gray-800", emoji: "🔧" }
}

export default function ProviderList() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [providers, setProviders] = useState([])
  const [upvotedProviders, setUpvotedProviders] = useState({})

  useEffect(() => {
    fetchProviders()
    // Load upvoted providers from local storage
    const storedUpvotes = JSON.parse(localStorage.getItem('upvotedProviders') || '{}')
    setUpvotedProviders(storedUpvotes)
  }, [])

  const fetchProviders = async () => {
    const response = await fetch('/api/providers')
    const data = await response.json()
    setProviders(data)
  }

  const handleUpvote = async (id) => {
    if (upvotedProviders[id]) {
      // Provider already upvoted in this session
      return
    }

    await fetch('/api/providers', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    
    // Update local state
    const updatedUpvotes = { ...upvotedProviders, [id]: true }
    setUpvotedProviders(updatedUpvotes)
    
    // Save to local storage
    localStorage.setItem('upvotedProviders', JSON.stringify(updatedUpvotes))
    
    fetchProviders()
  }

  const handleAddProvider = () => {
    fetchProviders()
  }

  const filteredProviders = providers.filter(provider =>
    provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getCategoryInfo = (category) => {
    return categoryColors[category] || categoryColors["אחר"]
  }

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
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
              <TableCell className="text-right">{provider.phone}</TableCell>
              <TableCell className="text-right">
                <Tooltip>
                  <TooltipTrigger>
                    {truncateText(provider.description, 100)}
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