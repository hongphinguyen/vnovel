import { ModifierState } from "../contexts/modifier-context"

export enum Type {
  Dialogue,
  Fork,
  Modification
}

export interface Dialogue {
  type: Type.Dialogue,
  data: {
    speaker: string,
    lines: string[]
  }
}

export interface Choice {
  label: string
  outcome: Script
}

export interface TemporalBranch {
  type: Type.Fork,
  data: Choice[]
}


export type ModificationData = [
  string,
  (state: ModifierState) => any
]

export type Modification = {
  type: Type.Modification,
  data: ModificationData
}

export type Fragment = Dialogue | TemporalBranch | Modification

export type Script = Fragment[]


export const dialogue = (speaker: string, lineOrLines: string | string[]): Dialogue => ({
  type: Type.Dialogue,
  data: {
    speaker,
    lines: Array.isArray(lineOrLines) ? lineOrLines : [lineOrLines]
  }
})

export const narrate = (lineOrLines: string | string[]) => dialogue('', lineOrLines)

export const fork = (choices: Choice[]): TemporalBranch => ({
  type: Type.Fork,
  data: choices
})

export const choice = (label: string, outcome: any[]): Choice => ({
  label,
  outcome
})

export const modify = (...data: ModificationData): Modification => ({
  type: Type.Modification,
  data
})
