import { ModifierState } from "../contexts/modifier-context"

export enum Type {
  Dialogue,
  Fork,
  Modification,
  Backdrop
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

export interface ForkOptions {
  caption: string
}

export interface TemporalBranch {
  type: Type.Fork,
  data: Choice[],
  options: ForkOptions
}


export type ModificationData = [
  string,
  (state: ModifierState) => any
]

export interface Modification {
  type: Type.Modification
  data: ModificationData
}

export interface Backdrop {
  type: Type.Backdrop
  data: string
}

export type Fragment = Dialogue | TemporalBranch | Modification | Backdrop

export type Script = Fragment[]


export const dialogue = (speaker: string, lineOrLines: string | string[]): Dialogue => ({
  type: Type.Dialogue,
  data: {
    speaker,
    lines: Array.isArray(lineOrLines) ? lineOrLines : [lineOrLines]
  }
})

export const narrate = (lineOrLines: string | string[]) => dialogue('', lineOrLines)

export const fork = (caption: string, choices: Choice[], options?: ForkOptions): TemporalBranch => ({
  type: Type.Fork,
  data: choices,
  options: {
    caption,
    ...options
  }
})

export const choice = (label: string, outcome: any[]): Choice => ({
  label,
  outcome
})

export const modifier = (...data: ModificationData): Modification => ({
  type: Type.Modification,
  data
})

export const backdrop = (image: any): Backdrop => ({
  type: Type.Backdrop,
  data: image
})
