import type { ReactNode } from "react"

type Props = {
  title: string
  subtitle?: string
  children: ReactNode
}

export default function AuthCard({ title, subtitle, children }: Props) {
  return (
    <div className="w-full max-w-md rounded-2xl bg-white shadow-lg p-8 border border-[#E5D5BE]">
      <div className="mb-6 text-center">
        <img src="/logo.png" alt="Ayün Pet" className="mx-auto h-12 mb-2" />
        <h1 className="text-2xl font-semibold tracking-tight text-[#281402]">{title}</h1>
        {subtitle && <p className="text-sm text-[#644C34] mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}