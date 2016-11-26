import { adjacentCreatures, adjacentAllies } from '../engine/battle/battlefield'
import { addModifier } from '../engine/battle/creature'

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
            const modifier = { type: 'attackValue', value: 1, until: null }
            const targets = adjacentAllies(state, { ...me.pos, hero: me.controller })
            _.forEach(targets, (c) => {
                addModifier(state, { creatureId: c.id, modifier })
            })
        }
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
  'Wall': {
    type: 'creature',
    subtypes: ['structure'],
    cost: 2,
    hpMax: 3,
    spMax: 1,
    attackType: 'hp',
    attackValue: 1,
    abilities: [],
    keywords: { static: true, pacific: true },
  },
}