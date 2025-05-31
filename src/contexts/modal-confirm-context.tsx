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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{modalData?.title}</DialogTitle>
            <DialogDescription>{modalData?.message}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button onClick={handleConfirm} className="bg-red-600 hover:bg-red-700 text-white">
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ModalConfirmContext.Provider>
  )
}
