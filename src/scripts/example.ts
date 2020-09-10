import { dialogue, narrate, fork, choice, Script, modify } from './tools'

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
          modify('power', state => state.power ? state.power + 5 : 5),
          modify('speed', state => state.speed ? state.speed + 8 : 8),
          narrate(`He gave me the Samurai Sword.`)
        ]),
        choice(`Chainsaw`, [
          dialogue(`Shopkeeper`, `Here you go.`),
          modify('power', state => state.power ? state.power + 8 : 8),
          modify('speed', state => state.speed ? state.speed + 5 : 5),
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
