'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function AddProviderModal({ isOpen, onClose, onAddProvider }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    category: '',
    description: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.category) {
      alert('שם וקטגוריה הם שדות חובה')
      return
    }
    await fetch('/api/providers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    onAddProvider()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="text-right">
        <DialogHeader>
          <DialogTitle>הוסף ספק שירות חדש</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">שם *</Label>
            <Input
              id="name"
              placeholder="שם"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="text-right"
            />
          </div>
          <div>
            <Label htmlFor="category">קטגוריה *</Label>
            <Input
              id="category"
              placeholder="קטגוריה"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
              className="text-right"
            />
          </div>
          <div>
            <Label htmlFor="email">אימייל</Label>
            <Input
              id="email"
              type="email"
              placeholder="אימייל"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="text-right"
            />
          </div>
          <div>
            <Label htmlFor="phone">טלפון</Label>
            <Input
              id="phone"
              placeholder="טלפון"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="text-right"
            />
          </div>
          <div>
            <Label htmlFor="website">אתר אינטרנט</Label>
            <Input
              id="website"
              placeholder="אתר אינטרנט"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="text-right"
            />
          </div>
          <div>
            <Label htmlFor="description">תיאור</Label>
            <Textarea
              id="description"
              placeholder="תיאור"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="text-right"
            />
          </div>
          <Button type="submit">שגר</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}