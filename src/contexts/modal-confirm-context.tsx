"use client"

import { createContext, useCallback, useContext, useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ModalConfirmData {
  title: string
  message: string
  onConfirm: () => void
}

interface ModalConfirmContextType {
  open: (data: ModalConfirmData) => void
}

const ModalConfirmContext = createContext<ModalConfirmContextType | undefined>(undefined)

export const useModalConfirm = (): ModalConfirmContextType => {
  const context = useContext(ModalConfirmContext)
  if (!context) {
    throw new Error("useModalConfirm deve ser usado dentro de ModalConfirmProvider")
  }
  return context
}

export const ModalConfirmProvider = ({ children }: { children: React.ReactNode }) => {
  const [modalData, setModalData] = useState<ModalConfirmData | null>(null)

  const open = useCallback((data: ModalConfirmData) => {
    setModalData(data)
  }, [])

  const handleClose = () => setModalData(null)

  const handleConfirm = () => {
    modalData?.onConfirm()
    handleClose()
  }

  return (
    <ModalConfirmContext.Provider value={{ open }}>
      {children}

      <Dialog open={!!modalData} onOpenChange={handleClose}>
        <DialogContent className="rounded-xl max-w-4/5 sm:max-w-md p-4">
          <DialogHeader>
            <DialogTitle className="font-extrabold text-[#005345] text-xl mb-2">{modalData?.title}</DialogTitle>
            <DialogDescription className="text-base mb-2">{modalData?.message}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-4">
            <Button variant="outline" className="py-6" onClick={handleClose}>
              Cancelar
            </Button>
            <Button onClick={handleConfirm} className="bg-[#ff7100] hover:bg-[#ff8f36] text-white py-6">
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ModalConfirmContext.Provider>
  )
}
