import { adjacentCreatures, adjacentAllies } from '../engine/battle/battlefield'
import { addModifier, damage as damageCreature } from '../engine/battle/creature'
import abilities from './abilities'

export default {
  'Peasant': {
    type: 'creature',
    subtypes: ['human'],
    cost: 1,
    hpMax: 2,
    spMax: 1,
    attackType: 'hp',
    attackValue: 1,
    abilities: [{
        trigger: 'moved',
        effect: (state, me, { creatureId }) => {
            const modifier = { type: 'attackValue', value: 1, until: 'eot' }
            const targets = adjacentAllies(state, { ...me.pos, hero: me.controller })
            _.forEach(targets, (c) => {
                addModifier(state, { creatureId: c.id, modifier })
            })
        },
        text: 'After Move, +1 ATK to adj. allies until EOT'
    }],
    keywords: {},
  },
  'Knight of the Rose': {
    type: 'creature',
    subtypes: ['human', 'soldier'],
    cost: 2,
    hpMax: 3,
    spMax: 1,
    attackType: 'hp',
    attackValue: 1,
    abilities: [],
    keywords: { extraMoves: 1, haste: true },
  },
  'Wall of Pikes': {
    type: 'creature',
    subtypes: ['structure'],
    cost: 1,
    hpMax: 3,
    spMax: 9,
    attackType: 'sp',
    attackValue: 0,
    abilities: [ abilities.retaliation({ damageType: 'sp', damageValue: 5 }) ],
    keywords: { static: true, pacific: true },
  },
  'Timz Tower': {
    type: 'creature',
    subtypes: ['structure'],
    cost: 2,
    hpMax: 3,
    spMax: 3,
    attackType: 'hp',
    attackValue: 0,
    abilities: [{
        trigger: 'activated',
        costType: 'sp',
        costValue: 1,
        targetType: 'creature',
        exhausts: true,
        effect: (state, me, { targetCreatureId }) => {
            damageCreature(state, { creatureId: targetCreatureId, damageType: 'hp', damageValue: 1 })
        },
        text: 'Deal 1 HP damage to target creature'
    }],
    keywords: { static: true, pacific: true },
  },
  'Lightining Bolt': {
    type: 'spell',
    cost: 1,
    targetType: 'creature',
    effect: (state, { targetCreatureId }) => {
        damageCreature(state, { creatureId: targetCreatureId, damageType: 'hp', damageValue: 4 })
    },
    text: 'Deal 3 HP damage to target creature'
  },
}