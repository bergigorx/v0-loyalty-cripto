import Image from "next/image"
import Link from "next/link"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizes = {
    sm: { width: 24, height: 24 },
    md: { width: 32, height: 32 },
    lg: { width: 48, height: 48 },
  }

  const { width, height } = sizes[size]

  return (
    <Link href="/" className={`flex items-center space-x-2 ${className}`}>
      <div className="relative">
        <Image
          src="/logo.png"
          alt="Loyalty Cripto Logo"
          width={width}
          height={height}
          className="object-contain"
          priority
        />
      </div>
      <span className="inline-block font-bold">Loyalty Cripto</span>
    </Link>
  )
}
