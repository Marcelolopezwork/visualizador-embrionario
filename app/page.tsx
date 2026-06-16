import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ConcebírLogo } from '@/components/ui/ConcebírLogo'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAF7F4] flex flex-col">
      <header className="px-8 py-5 border-b border-[#E2E8F0] bg-white flex items-center justify-between">
        <ConcebírLogo size={32} />
        <Link href="/cases">
          <Button variant="ghost" size="sm">Ver casos guardados</Button>
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-8 py-16">
        <div className="max-w-2xl text-center">
          {/* Hero orb — green palette */}
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" className="mx-auto mb-8">
            <defs>
              <radialGradient id="homeGrad" cx="35%" cy="35%" r="65%">
                <stop stopColor="#D4EDD8" />
                <stop offset="1" stopColor="#7DB88A" />
              </radialGradient>
              <radialGradient id="homeGrad2" cx="35%" cy="35%" r="65%">
                <stop stopColor="#3A7D44" stopOpacity="0.15" />
                <stop offset="1" stopColor="#3A7D44" stopOpacity="0.45" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="url(#homeGrad)" stroke="#3A7D44" strokeWidth="1.5" />
            <circle cx="50" cy="50" r="30" fill="url(#homeGrad2)" opacity="0.5" />
            <circle cx="50" cy="50" r="15" fill="#3A7D44" opacity="0.25" />
            <ellipse cx="36" cy="34" rx="10" ry="7" fill="white" opacity="0.3" />
          </svg>

          <h2 className="font-serif text-4xl text-[#1C2B3A] mb-4">Visualizador de Evolución Embrionaria</h2>
          <div className="w-16 h-px bg-[#C9A84C] mx-auto mb-6" />
          <p className="text-lg text-[#94A3B8] mb-4 leading-relaxed">
            Cargá el informe de laboratorio y generá una presentación visual clara para que tu paciente comprenda su proceso.
          </p>
          <p className="text-sm text-[#94A3B8] mb-10">
            Diseñado para médicos especialistas en fertilidad. No reemplaza el juicio clínico.
          </p>

          <div className="flex gap-4 justify-center">
            <Link href="/new-case">
              <Button size="lg">Nuevo caso</Button>
            </Link>
            <Link href="/cases">
              <Button variant="secondary" size="lg">Casos guardados</Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="px-8 py-4 border-t border-[#E2E8F0] text-center">
        <p className="text-xs text-[#94A3B8]">
          Concebir · Herramienta de apoyo comunicacional · No almacena datos reales hasta activar autenticación.
        </p>
      </footer>
    </div>
  )
}
