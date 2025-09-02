import { forwardRef } from "react"
import type { InputHTMLAttributes } from "react"

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
}

const TextField = forwardRef<HTMLInputElement, Props>(({ label, error, className, ...rest }, ref) => {
  return (
    <label className="block mb-4">
      <span className="block text-sm font-medium text-[#281402] mb-1">{label}</span>
      <input
        ref={ref}
        className={`w-full rounded-xl border px-3 py-2 outline-none transition
          border-[#E5D5BE] focus:ring-2 focus:ring-[#FBDBA8] focus:border-[#644C34] bg-white/95
          placeholder:text-[#A68F6D]/80
          ${error ? "border-rose-400 focus:ring-rose-300 focus:border-rose-400" : ""}
          ${className ?? ""}`}
        {...rest}
      />
      {error && <span className="text-xs text-rose-600 mt-1 block">{error}</span>}
    </label>
  )
})

export default TextField
