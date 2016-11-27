import { adjacentCreatures, adjacentAllies } from '../engine/battle/battlefield'
import { addModifier, damage as damageCreature } from '../engine/battle/creature'

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
        trigger: 'creatureMoved',
        effect: (state, me, { creatureId }) => {
            if(me.id !== creatureId) { return false }
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
  'Timz Tower': {
    type: 'creature',
    subtypes: ['structure'],
    cost: 2,
    hpMax: 3,
    spMax: 3,
    attackType: 'hp',
    attackValue: 1,
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
}