import React from 'react'

export const metadata = {
  title: 'Swiss Ephemeris Query Tool',
  description: 'Query Swiss Ephemeris directly with custom parameters'
}

export default function SwissEphLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  )
}