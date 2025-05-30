"use client"

import Link from "next/link"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, Users, LogOut, House } from "lucide-react"
import Image from "next/image"
import { User } from "@/types/prisma"

export default function AdminHeader({ user }: { user: User }) {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-12">
          <Link href="/admin/questions" className="font-bold text-xl">
            <Image src="/logo.png" alt="Excel Solutions" width={110} height={20} className="h-10 w-auto" priority={false} />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/admin/questions" className="text-slate-700 transition-colors hover:text-blue-600">
              Questões
            </Link>
            <Link href="/admin/leads" className="text-slate-700 transition-colors hover:text-blue-600">
              Leads
            </Link>
            <Link href="/admin/users" className="text-slate-700 transition-colors hover:text-blue-600">
              Usuários
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.image || "/user.png"} alt={'icone do usuario'} />
                  <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/" className="cursor-pointer">
                  <House className="mr-2 h-4 w-4" />
                  <span>Home</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/questions" className="cursor-pointer">
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span>Questões</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/leads" className="cursor-pointer">
                  <Users className="mr-2 h-4 w-4" />
                  <span>Leads</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={() => signOut({ callbackUrl: "/admin/login" })}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
