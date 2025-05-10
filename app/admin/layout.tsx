import type React from "react"
import { SimpleAuthGuard } from "@/components/simple-auth-guard"
import { AdminNav } from "@/components/admin-nav"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SimpleAuthGuard>
      <div className="min-h-screen bg-gray-50">
        <AdminNav />
        {children}
      </div>
    </SimpleAuthGuard>
  )
}
