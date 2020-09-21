import { dialogue, narrate, fork, choice, Script, modifier, backdrop } from './tools'
import testBackdrop from '../assets/800-screen-04.jpg'

const script: Script = [
  backdrop(testBackdrop),
  dialogue(`Shopkeeper`, [
    `If you win this coinflip, you can take home any item on the shelf.`,
    `Heads or tail?`
  ]),
  narrate(`Here I go then.`),
  fork(`Head or tail?`, [
    choice(`Head`, [
      dialogue(`Shopkeeper`, `Good guess, kid. What do you want to take?`),
      fork(`Which weapon suits me more?`, [
        choice(`Samurai Sword`, [
          dialogue(`Shopkeeper`, `Here you go.`),
          modifier('power', state => state.power ? state.power + 5 : 5),
          modifier('speed', state => state.speed ? state.speed + 8 : 8),
          narrate(`He gave me the Samurai Sword.`)
        ]),
        choice(`Chainsaw`, [
          dialogue(`Shopkeeper`, `Here you go.`),
          modifier('power', state => state.power ? state.power + 8 : 8),
          modifier('speed', state => state.speed ? state.speed + 5 : 5),
          narrate(`He gave me the Chainsaw.`)
        ]),
      ])
    ]),
    choice(`Tail`, [
      dialogue(`Shopkeeper`, `Too bad, kid. Better luck next time.`)
    ])
  ]),
  dialogue(`Shopkeeper`, `Now get the fuck outta my shop.`),
]

export default script
