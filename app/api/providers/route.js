import { NextResponse } from 'next/server'
import connectDB from '@/lib/connectDB'
import Provider from '@/models/Provider'

export async function GET() {
  await connectDB()
  const providers = await Provider.find({})
  return NextResponse.json(providers)
}

export async function POST(request) {
  const body = await request.json()
  await connectDB()
  const newProvider = new Provider(body)
  await newProvider.save()
  return NextResponse.json(newProvider, { status: 201 })
}

export async function PUT(request) {
  const { id } = await request.json()
  await connectDB()
  const provider = await Provider.findByIdAndUpdate(id, { $inc: { upvotes: 1 } }, { new: true })
  return NextResponse.json(provider)
}