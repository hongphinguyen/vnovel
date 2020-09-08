import React, { FC, useState } from 'react'
import './App.css'
import ExampleScript, { Choice, Script } from './scripts/example'

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

  const current = scriptSet.script[scriptPosition]

  const handleNext = () => {
    /* Recursively get out of roadblocks at the end of a script. This means that when you reach a roadblock
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
    
    else if (current.type === 'dialogue') {
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
    <div className="App">
      {current.type === 'dialogue' && (
        <div>
          <div className="Speaker">
            <h1>{current.data.speaker}</h1>
          </div>
          <p>{current.data.lines[lineNumber]}</p>
          <button onClick={handleNext}>Next</button>
        </div>
      )}
      {current.type === 'fork' && (
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
  )
}

export default () => (
  <Novel initialScriptSet={{ script: ExampleScript }} />
)
