
import { useEffect } from "react"

export function useConfirmBeforeLeave(shouldBlock: boolean) {
  useEffect(() => {
    if (!shouldBlock) return

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      // Required for Chrome to show the dialog
      e.returnValue = ""
    }

    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [shouldBlock])
}
