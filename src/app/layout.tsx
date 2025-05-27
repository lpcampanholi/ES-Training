import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./styles/globals.css"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Formação SmartES | Excel Solutions",
  description:
    "Transforme dados em informações úteis que fazem a diferença! A Formação Inteligente em Análise de Dados da Excel Solutions.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={`${inter.className} bg-slate-50`}>
        <main>
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  )
}
