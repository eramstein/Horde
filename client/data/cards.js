import { adjacentCreatures, adjacentAllies } from '../engine/battle/battlefield'
import { addModifier, damage as damageCreature } from '../engine/battle/creature'
import abilities from './abilities'

export default {
  'Peasant': {
    type: 'creature',
    subtypes: ['human'],
    cost: 1,
    hpMax: 2,
    energy: 0,
    attack: 1,
    abilities: [{
        trigger: 'moved',
        effect: (state, me, { creatureId }) => {
            const modifier = { type: 'attack', value: 1, until: 'eot' }
            const targets = adjacentAllies(state, { ...me.pos, hero: me.controller })
            _.forEach(targets, (c) => {
                addModifier(state, { creatureId: c.id, modifier })
            })
        },
        text: 'After Move, +1 ATK to adj. allies until EOT'
    }],
    keywords: {},
  },
  'Goblin': {
    type: 'creature',
    subtypes: ['goblin'],
    cost: 1,
    hpMax: 3,
    energy: 0,
    attack: 1,
    abilities: [],
    keywords: {},
    behaviours: { stupid: true }
  },
  'Wolf': {
    type: 'creature',
    subtypes: ['animal'],
    cost: 3,
    hpMax: 3,
    energy: 0,
    attack: 3,
    abilities: [],
    keywords: {},
    behaviours: { stupid: true }
  },
  'The Black Knight': {
    type: 'creature',
    subtypes: ['human', 'knight'],
    cost: 10,
    hpMax: 30,
    energy: 0,
    attack: 2,
    abilities: [],
    keywords: {},
    behaviours: { stupid: true }
  },
  'Knight of the Rose': {
    type: 'creature',
    subtypes: ['human', 'soldier'],
    cost: 2,
    hpMax: 3,
    attack: 1,
    energy: 1,
    abilities: [],
    keywords: { charge: true },
  },
  'Wall of Pikes': {
    type: 'creature',
    subtypes: ['structure'],
    cost: 1,
    hpMax: 9,
    attack: 0,
    energy: 0,
    abilities: [ abilities.retaliation({ damage: 5 }) ],
    keywords: { static: true, pacific: true },
  },
  'Timz Tower': {
    type: 'creature',
    subtypes: ['structure'],
    cost: 1,
    hpMax: 99,
    attack: 0,
    energy: 3,
    abilities: [{
        trigger: 'activated',
        cost: 1,
        targetType: 'creature',
        exhausts: true,
        effect: (state, me, { targetCreatureId }) => {
            damageCreature(state, { creatureId: targetCreatureId, damage: 1 })
        },
        text: 'Deal 1 HP damage to target creature'
    }],
    keywords: { static: true, pacific: true, airdrop: true },
  },
  'Lightining Bolt': {
    type: 'spell',
    cost: 1,
    targetType: 'creature',
    effect: (state, { targetCreatureId }) => {
        damageCreature(state, { creatureId: targetCreatureId, damage: 3 })
    },
    text: 'Deal 3 HP damage to target creature'
  },
}