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

const script: Script = [
  dialogue(`Shopkeeper`, [
    `If you win this coinflip, you can take home any item on the shelf.`,
    `Heads or tail?`
  ]),
  narrate(`Here I go then.`),
  fork([
    choice(`Heads`, [
      dialogue(`Shopkeeper`, `Good guess, kid. What do you want to take?`),
      fork([
        choice(`Samurai Sword`, [
          dialogue(`Shopkeeper`, `Here you go.`),
          narrate(`He gave me the Samurai Sword.`)
        ]),
        choice(`Chainsaw`, [
          dialogue(`Shopkeeper`, `Here you go.`),
          narrate(`He gave me the Chainsaw.`)
        ]),
      ])
    ]),
    choice(`Tails`, [
      dialogue(`Shopkeeper`, `Too bad, kid. Better luck next time.`)
    ])
  ]),
  dialogue(`Shopkeeper`, `Now get the fuck outta my shop.`),
]

export default script
