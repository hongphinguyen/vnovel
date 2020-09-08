import React, { createContext, useReducer, FC, useContext } from 'react'

type State = { [name: string]: any }
type Action = { type: 'update', payload: { name: string, value: any } }
type Dispatch = (action: Action) => void

const ModifierStateContext = createContext<State | undefined>(undefined)
const ModifierDispatchContext = createContext<Dispatch | undefined>(undefined)

const modifierReducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'update': {
      const { name, value } = action.payload
      return { [name]: value }
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
