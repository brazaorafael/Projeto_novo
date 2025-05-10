import BreedersList from "./breeders-list"

export default function BreedersPage() {
  return (
    <>
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">Gerenciamento de Criadores</h1>
        <BreedersList />
      </div>
    </>
  )
}
