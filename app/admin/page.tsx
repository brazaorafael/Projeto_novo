import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AdminPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Painel Administrativo</h1>

      <div className="grid gap-4">
        <Link href="/admin/contacts">
          <Button className="w-full bg-amber-700 hover:bg-amber-800">Gerenciar Contatos</Button>
        </Link>

        <Link href="/admin/breeds">
          <Button className="w-full bg-amber-700 hover:bg-amber-800">Gerenciar Raças</Button>
        </Link>

        <Link href="/admin/system">
          <Button className="w-full bg-amber-700 hover:bg-amber-800">Status do Sistema</Button>
        </Link>
      </div>
    </div>
  )
}
