import { ModifierState } from "../contexts/modifier-context"

export interface Dialogue {
  type: 'dialogue',
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
  type: 'fork',
  data: Choice[]
}


export interface ModificationData {
  name: string
  value: (state: ModifierState) => any
}

export type Modification = {
  type: 'modification',
  data: ModificationData[]
}

export type Fragment = Dialogue | TemporalBranch | Modification

export type Script = Fragment[]


export const dialogue = (speaker: string, lineOrLines: string | string[]): Dialogue => ({
  type: 'dialogue',
  data: {
    speaker,
    lines: Array.isArray(lineOrLines) ? lineOrLines : [lineOrLines]
  }
})

export const narrate = (lineOrLines: string | string[]) => dialogue('', lineOrLines)

export const fork = (choices: Choice[]): TemporalBranch => ({
  type: 'fork',
  data: choices
})

export const choice = (label: string, outcome: any[]): Choice => ({
  label,
  outcome
})

export const modify = (datumOrData: ModificationData | ModificationData[]): Modification => ({
  type: 'modification',
  data: Array.isArray(datumOrData) ? datumOrData : [datumOrData]
})
