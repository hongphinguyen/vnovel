import React, { createContext, useReducer, FC, useContext } from 'react'

export type ModifierState = { [name: string]: any }
export type ModifierAction = { type: 'update', payload: { name: string, value: any } }
export type ModifierDispatch = (action: ModifierAction) => void

const ModifierStateContext = createContext<ModifierState | undefined>(undefined)
const ModifierDispatchContext = createContext<ModifierDispatch | undefined>(undefined)

const modifierReducer = (state: ModifierState, action: ModifierAction) => {
  switch (action.type) {
    case 'update': {
      const { name, value } = action.payload
      return { ...state, [name]: value }
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

export const ModifierProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(modifierReducer, {})

  return (
    <ModifierStateContext.Provider value={state}>
      <ModifierDispatchContext.Provider value={dispatch}>
        {children}
      </ModifierDispatchContext.Provider>
    </ModifierStateContext.Provider>
  )
}

export const useModifierState = () => {
  const context = useContext(ModifierStateContext)
  if (context === undefined) {
    throw new Error('useModifierState must be used within a ModifierProvider')
  }
  return context
}

export const useModifierDispatch = () => {
  const context = useContext(ModifierDispatchContext)
  if (context === undefined) {
    throw new Error('useModifierDispatch must be used within a ModifierProvider')
  }
  return context
}
