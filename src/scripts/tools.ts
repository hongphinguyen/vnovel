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

export type Fragment = Dialogue | TemporalBranch

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
