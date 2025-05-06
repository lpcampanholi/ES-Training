import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./styles/globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Plataforma de Testes Online",
  description: "Descubra seu nível em diferentes tecnologias",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-slate-50`}>{children}</body>
    </html>
  )
}
