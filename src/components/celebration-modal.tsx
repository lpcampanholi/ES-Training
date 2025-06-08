"use client"

import { useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Award, ArrowRight } from "lucide-react"
import confetti from "canvas-confetti"
import { getLevelName } from "@/utils"
import type { Level } from "@/types"

export interface CelebrationModalProps {
  isOpen: boolean
  onClose: () => void
  previousLevel: Level
  nextLevel: Level
  message?: string
}

export function CelebrationModal({ isOpen, onClose, previousLevel, nextLevel, message }: CelebrationModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Dispara confetti quando o modal é aberto
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-[#005345] text-2xl">Parabéns!</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center py-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <Award className="h-12 w-12 text-green-600" />
          </div>

          <h3 className="text-xl font-bold text-[#005345] text-center mb-4">Você passou para o nível {getLevelName(nextLevel)}!</h3>

          <p className="text-center text-slate-600 mb-6">
            {message ||
              `Você superou o nível ${getLevelName(previousLevel)} e agora vai enfrentar questões mais desafiadoras.`}
          </p>

          <Button onClick={onClose} className="rounded-xl w-[50%] bg-[#ff7100] hover:bg-[#ff8f36]">
            Continuar <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
