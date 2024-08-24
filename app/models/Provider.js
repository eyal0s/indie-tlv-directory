import mongoose from 'mongoose'

const ProviderSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  website: String,
  socialLinks: String,
  category: String,
  description: String,
  upvotes: { type: Number, default: 0 },
})

export default mongoose.models.Provider || mongoose.model('Provider', ProviderSchema)