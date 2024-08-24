import ProviderList from '@/components/ProviderList'

export default function Home() {
  return (
    <main className="container mx-auto p-8 text-right">
      <h1 className="text-3xl font-bold mb-6">מומלצים של אינדי TLV 🌟</h1>
      <ProviderList />
    </main>
  )
}