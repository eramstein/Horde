import { adjacentCreatures, adjacentAllies, getDistance } from '../engine/battle/battlefield'
import { addModifier, damage as damageCreature } from '../engine/battle/creature'

export default {
  retaliation: ({ damage }) => {
    return {
        trigger: 'isAttacked',
        effect: (state, me, { attackerCreatureId }) => {
            damageCreature(state, { creatureId: attackerCreatureId, damage })
        },
        text: 'Retaliation: ' + damage
    }
  },
  charge: () => {
    // add 1 atk per movement if moved in straight line
    return {
        trigger: 'moved',
        effect: (state, me, { from, to }) => {
          if (from.column === to.column || from.row === to.row) {
            addModifier(state, { creatureId: me.id, modifier: { type: 'attack', value: getDistance(from, to), until: 'eot' } })
          }
        },
        text: 'Charge'
    }
  }
}