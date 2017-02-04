import { adjacentCreatures, adjacentAllies } from '../engine/battle/battlefield'
import { addModifier, damage as damageCreature } from '../engine/battle/creature'

export default {
  retaliation: ({ damage }) => {
    return {
        trigger: 'isAttacked',
        effect: (state, me, { attackerCreatureId }) => {
            damageCreature(state, { creatureId: attackerCreatureId, damage })
        },
        text: () => 'Retaliation: ' + damage
    }
  }
}