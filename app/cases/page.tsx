'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getCases } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function CasesPage() {
  const [cases, setCases] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCases().then(data => { setCases(data); setLoading(false) })
  }, [])

  return (
    <div className="min-h-screen bg-[#FAF7F4]">
      <header className="px-8 py-5 border-b border-[#E2E8F0] bg-white flex items-center justify-between">
        <div>
          <h1 className="font-serif text-xl text-[#1C2B3A]">Casos guardados</h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">Historial de casos ingresados</p>
        </div>
        <div className="flex gap-2">
          <Link href="/"><Button variant="ghost" size="sm">Inicio</Button></Link>
          <Link href="/new-case"><Button size="sm">Nuevo caso</Button></Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-8 py-10">
        {!process.env.NEXT_PUBLIC_SUPABASE_URL && (
          <div className="bg-amber-50 border border-amber-200 rounded p-4 mb-6 text-sm text-amber-800">
            Supabase no está configurado. Los casos se guardan solo localmente durante la sesión.
            Configure NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY para persistencia.
          </div>
        )}

        {loading && <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-[#3A7D44] border-t-transparent rounded-full animate-spin" /></div>}

        {!loading && cases.length === 0 && (
          <div className="text-center py-16 text-[#94A3B8]">
            <p className="text-lg mb-2">No hay casos guardados</p>
            <p className="text-sm">Los casos se guardan en Supabase cuando se configura correctamente.</p>
          </div>
        )}

        <div className="space-y-3">
          {cases.map(c => (
            <Card key={c.id} className="p-5 flex items-center justify-between hover:shadow-md transition-shadow">
              <div>
                <p className="font-medium text-[#1C2B3A]">{c.patient_name}</p>
                <p className="text-sm text-[#94A3B8]">{c.procedure_type} · {c.procedure_date ? new Date(c.procedure_date).toLocaleDateString('es-AR') : '—'}</p>
              </div>
              <Link href={`/presentation/${c.id}`}>
                <Button variant="secondary" size="sm">Ver presentación</Button>
              </Link>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
