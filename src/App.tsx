import React, { FC, useState, useEffect } from 'react'
import ExampleScript from './scripts/example'
import { Script, Choice, Type } from './scripts/tools'
import { ModifierProvider, useModifierState, useModifierDispatch } from './contexts/modifier-context'
import * as SC from './App.styled'

interface ScriptSet {
  script: Script
  parentScriptSet?: {
    scriptSet: ScriptSet
    lastPosition: number
  }
}

interface Props {
  initialScriptSet: ScriptSet
  initialScriptPosition?: number
  initialLineNumber?: number
}

const forecastTypes = [Type.Modification, Type.Backdrop]

const Novel: FC<Props> = ({ initialScriptSet, initialScriptPosition = 0, initialLineNumber = 0 }) => {
  const [scriptSet, setScriptSet] = useState<ScriptSet>(initialScriptSet)
  const [scriptPosition, setScriptPosition] = useState(initialScriptPosition)
  const [lineNumber, setLineNumber] = useState(initialLineNumber)
  const modifierState = useModifierState()
  const modifierDispatch = useModifierDispatch()
  const [backdrop, setBackdrop] = useState<undefined | string>()

  const current = scriptSet.script[scriptPosition]

  useEffect(() => {
    const currentFragment = scriptSet.script[scriptPosition]

    if (!currentFragment || !forecastTypes.includes(currentFragment.type)) {
      return
    }

    switch (currentFragment.type) {
      case (Type.Modification): {
        const [name, value] = currentFragment.data
        modifierDispatch({
          type: 'update',
          payload: {
            name,
            value: value(modifierState)
          }
        })
        break
      }

      case (Type.Backdrop): {
        setBackdrop(currentFragment.data)
        break
      }
    }

    setScriptPosition(position => position + 1)
  }, [scriptPosition])

  const handleNext = () => {
    /** Recursively get out of roadblocks at the end of a script. This means that when you reach a roadblock
     * on a child script, when you go up one level and the next script position is also a roadblock, the code
     * will keep on going up to a fork level where you can proceed the script.
     */
    if (scriptSet.script.length - 1 === scriptPosition) {
      let newScriptSet = scriptSet.parentScriptSet
      while (true) {
        if (!newScriptSet) {
          alert(
            `DEVELOPER WARNING: You have reached a roadblock. ` +
            `You can fix this problem by adding a meaningful resolution to the end of this script (or subscript).`
          )
          return
        }

        if (newScriptSet.scriptSet.script.length - 1 === newScriptSet.lastPosition) {
          newScriptSet = newScriptSet.scriptSet.parentScriptSet
        } else {
          setScriptSet(newScriptSet.scriptSet)
          setScriptPosition(newScriptSet.lastPosition + 1)
          break
        }
      }
    }
    
    else if (current.type === Type.Dialogue) {
      if (current.data.lines.length - 1 > lineNumber) {
        setLineNumber(lineNumber + 1)
      } else {
        setLineNumber(0)
        setScriptPosition(scriptPosition + 1)
      }
    }
  }

  const handleChoiceButton = (choice: Choice) => {
    setScriptPosition(0)
    setScriptSet({
      script: choice.outcome,
      parentScriptSet: {
        scriptSet,
        lastPosition: scriptPosition
      }
    })
  }

  return (
    <SC.App backdrop={backdrop}>
      <SC.Novel>
        {current.type === Type.Dialogue && (
          <SC.DialogueBox onClick={handleNext}>
            {current.data.speaker && <SC.Caption>{current.data.speaker}</SC.Caption>}
            <span>{current.data.lines[lineNumber]}</span>
          </SC.DialogueBox>
        )}
        {current.type === Type.Fork && (
          <SC.ForkOverlay>
            <SC.ForkDialogue>
              {current.data.map((choice) => (
                <button
                  onClick={() => handleChoiceButton(choice)}
                  key={choice.label}
                >
                  {choice.label}
                </button>
              ))}
            </SC.ForkDialogue>
          </SC.ForkOverlay>
        )}
      </SC.Novel>

      {Object.keys(modifierState).length > 0 && (
        <SC.Modifiers>
          <SC.Caption>Modifier</SC.Caption>
          {Object.entries(modifierState).map(([key, value]) => (
            <span>
              <strong>{key}</strong>: {value}
            </span>
          ))}
        </SC.Modifiers>
      )}
    </SC.App>
  )
}

export default () => (
  <ModifierProvider>
    <Novel initialScriptSet={{ script: ExampleScript }} />
  </ModifierProvider>
)
