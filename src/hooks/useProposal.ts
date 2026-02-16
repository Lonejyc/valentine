import { useState } from 'react'

export const useProposal = () => {
  const [yesButtonSize, setYesButtonSize] = useState(1)
  const [noButtonSize, setNoButtonSize] = useState(1)
  const [isOpen, setIsOpen] = useState(false)

  const handleRefusal = () => {
    setYesButtonSize(size => size * 1.6)
    setNoButtonSize(size => size / 1.2)
  }

  const handleAccept = () => {
    setIsOpen(true)
  }

  return {
    yesButtonSize,
    noButtonSize,
    isOpen,
    setIsOpen,
    handleRefusal,
    handleAccept
  }
}
