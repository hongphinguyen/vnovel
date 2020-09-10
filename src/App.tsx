import React, { FC, useState } from 'react'
import './App.css'
import ExampleScript from './scripts/example'
import { Script, Choice, Type } from './scripts/tools'
import { ModifierProvider, useModifierState, useModifierDispatch } from './contexts/modifier-context'

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

const forecastTypes = [Type.Modification]

const Novel: FC<Props> = ({ initialScriptSet, initialScriptPosition = 0, initialLineNumber = 0 }) => {
  const [scriptSet, setScriptSet] = useState<ScriptSet>(initialScriptSet)
  const [scriptPosition, setScriptPosition] = useState(initialScriptPosition)
  const [lineNumber, setLineNumber] = useState(initialLineNumber)
  const modifierState = useModifierState()
  const modifierDispatch = useModifierDispatch()

  const current = scriptSet.script[scriptPosition]

  const handleNext = () => {
    let skipForecastNumber = 1
    let currentForecastIndex = scriptPosition + 1

    /** Recursively forecast special fragments, process them immediately and skip to the next dialogue or choice. */
    while (true) {
      const forecastedFragment = scriptSet.script[currentForecastIndex]
      
      if (!forecastedFragment || !forecastTypes.includes(forecastedFragment.type)) {
        break
      }

      if (forecastedFragment.type === Type.Modification) {
        const [name, value] = forecastedFragment.data
        modifierDispatch({
          type: 'update',
          payload: {
            name,
            value: value(modifierState)
          }
        })
      }
      
      skipForecastNumber++
      currentForecastIndex++
    }

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
          setScriptPosition(newScriptSet.lastPosition + skipForecastNumber)
          break
        }
      }
    }
    
    else if (current.type === Type.Dialogue) {
      if (current.data.lines.length - 1 > lineNumber) {
        setLineNumber(lineNumber + 1)
      } else {
        setLineNumber(0)
        setScriptPosition(scriptPosition + skipForecastNumber)
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
    <div className="App">
      <div className="Novel">
        {current.type === Type.Dialogue && (
          <div>
            <div className="Speaker">
              <h1>{current.data.speaker}</h1>
            </div>
            <p>{current.data.lines[lineNumber]}</p>
            <button onClick={handleNext}>Next</button>
          </div>
        )}
        {current.type === Type.Fork && (
          <div>
            {current.data.map((choice) => (
              <button
                onClick={() => handleChoiceButton(choice)}
                key={choice.label}
              >
                {choice.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {Object.keys(modifierState).length > 0 && (
        <div>
          <h3>Modifier</h3>
          {Object.entries(modifierState).map(([key, value]) => (
            <p>
              <strong>{key}</strong>: {value}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

export default () => (
  <ModifierProvider>
    <Novel initialScriptSet={{ script: ExampleScript }} />
  </ModifierProvider>
)
