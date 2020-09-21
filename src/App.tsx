import React, { FC, useState, useEffect } from 'react'
import ExampleScript from './scripts/example'
import { Script, Choice, Type } from './scripts/tools'
import { ModifierProvider, useModifierState, useModifierDispatch } from './contexts/modifier-context'
import * as SC from './App.styled'
import { glossary } from './scripts/glossary/glossary'

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

const Novel: FC<Props> = ({ initialScriptSet, initialScriptPosition = 0, initialLineNumber = 0 }) => {
  const [scriptSet, setScriptSet] = useState<ScriptSet>(initialScriptSet)
  const [scriptPosition, setScriptPosition] = useState(initialScriptPosition)
  const [lineNumber, setLineNumber] = useState(initialLineNumber)
  const modifierState = useModifierState()
  const modifierDispatch = useModifierDispatch()
  const [backdrop, setBackdrop] = useState<undefined | string>()
  const [showGlossary, setShowGlossary] = useState(false)

  const current = scriptSet.script[scriptPosition]

  const proceed = () => {
    if (scriptSet.script.length - 1 === scriptPosition) {
      let newScriptSet = scriptSet.parentScriptSet
      while (true) {
        if (!newScriptSet) {
          alert(
            `DEVELOPER WARNING: You have reached a roadblock. ` +
            `You can fix this problem by adding a meaningful resolution to the end of this script (or subscript).`
          )
          break
        }
        if (newScriptSet.scriptSet.script.length - 1 === newScriptSet.lastPosition) {
          newScriptSet = newScriptSet.scriptSet.parentScriptSet
        } else {
          setScriptSet(newScriptSet.scriptSet)
          setScriptPosition(newScriptSet.lastPosition + 1)
          break
        }
      }
    } else {
      setScriptPosition(scriptPosition + 1)
    }
  }

  useEffect(() => {
    switch (current.type) {
      default: return
      case (Type.Modification): {
        const [name, value] = current.data
        modifierDispatch({
          type: 'update',
          payload: {
            name,
            value: value(modifierState)
          }
        })
        proceed()
        break
      }
      case (Type.Backdrop): {
        setBackdrop(current.data)
        proceed()
        break
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptPosition])

  const handleNext = () => {
    if (current.type !== Type.Dialogue) {
      return
    }

    if (current.data.lines.length - 1 > lineNumber) {
      setLineNumber(lineNumber + 1)
    } else {
      setLineNumber(0)
      proceed()
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
              {current.options.caption && <SC.Caption>{current.options.caption}</SC.Caption>}
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

      {showGlossary && (
        <SC.DialogueBox>
          {JSON.stringify(glossary())}
        </SC.DialogueBox>
      )}

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
