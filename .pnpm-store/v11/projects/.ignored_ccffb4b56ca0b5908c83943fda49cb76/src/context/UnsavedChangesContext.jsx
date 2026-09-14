import { createContext, useContext, useMemo, useState } from "react"

const UnsavedChangesContext = createContext(null)

export const UnsavedChangesProvider = ({ children }) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showUnsavedModal, setShowUnsavedModal] = useState(false)
  const [pendingAction, setPendingAction] = useState(null)

  const requestNavigation = (action) => {
    if (!hasUnsavedChanges) {
      action?.()
      return
    }

    setPendingAction(() => action)
    setShowUnsavedModal(true)
  }

  const confirmNavigation = () => {
    const action = pendingAction
    setShowUnsavedModal(false)
    setPendingAction(null)
    action?.()
  }

  const cancelNavigation = () => {
    setShowUnsavedModal(false)
    setPendingAction(null)
  }

  const value = useMemo(
    () => ({
      hasUnsavedChanges,
      setHasUnsavedChanges,
      showUnsavedModal,
      requestNavigation,
      confirmNavigation,
      cancelNavigation
    }),
    [hasUnsavedChanges, showUnsavedModal, pendingAction]
  )

  return (
    <UnsavedChangesContext.Provider value={value}>
      {children}
    </UnsavedChangesContext.Provider>
  )
}

export const useUnsavedChanges = () => {
  const context = useContext(UnsavedChangesContext)

  if (!context) {
    throw new Error("useUnsavedChanges must be used within UnsavedChangesProvider")
  }

  return context
}