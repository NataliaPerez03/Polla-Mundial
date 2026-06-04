'use client'

import * as React from 'react'
import type { ToastProps } from '@/components/ui/toast'

const TOAST_LIMIT = 3
const TOAST_REMOVE_DELAY = 5000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactElement
}

let count = 0
function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

type Action =
  | { type: 'ADD_TOAST'; toast: ToasterToast }
  | { type: 'UPDATE_TOAST'; toast: Partial<ToasterToast> }
  | { type: 'DISMISS_TOAST'; toastId?: string }
  | { type: 'REMOVE_TOAST'; toastId?: string }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_TOAST':
      return { ...state, toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT) }
    case 'UPDATE_TOAST':
      return { ...state, toasts: state.toasts.map(t => t.id === action.toast.id ? { ...t, ...action.toast } : t) }
    case 'DISMISS_TOAST': {
      const { toastId } = action
      if (toastId) {
        if (!toastTimeouts.has(toastId)) {
          toastTimeouts.set(toastId, setTimeout(() => {
            toastTimeouts.delete(toastId)
            dispatch({ type: 'REMOVE_TOAST', toastId })
          }, TOAST_REMOVE_DELAY))
        }
      } else {
        state.toasts.forEach(t => {
          if (!toastTimeouts.has(t.id)) {
            toastTimeouts.set(t.id, setTimeout(() => {
              toastTimeouts.delete(t.id)
              dispatch({ type: 'REMOVE_TOAST', toastId: t.id })
            }, TOAST_REMOVE_DELAY))
          }
        })
      }
      return { ...state, toasts: state.toasts.map(t => (t.id === toastId || !toastId) ? { ...t, open: false } : t) }
    }
    case 'REMOVE_TOAST':
      return { ...state, toasts: action.toastId ? state.toasts.filter(t => t.id !== action.toastId) : [] }
  }
}

const listeners: ((state: State) => void)[] = []
let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach(l => l(memoryState))
}

function toast(props: Omit<ToasterToast, 'id'>) {
  const id = genId()
  dispatch({ type: 'ADD_TOAST', toast: { ...props, id, open: true, onOpenChange: (open) => { if (!open) dispatch({ type: 'DISMISS_TOAST', toastId: id }) } } })
  return { id, dismiss: () => dispatch({ type: 'DISMISS_TOAST', toastId: id }) }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)
  React.useEffect(() => {
    listeners.push(setState)
    return () => { const index = listeners.indexOf(setState); if (index > -1) listeners.splice(index, 1) }
  }, [])
  return { ...state, toast, dismiss: (id?: string) => dispatch({ type: 'DISMISS_TOAST', toastId: id }) }
}

export { useToast, toast }
