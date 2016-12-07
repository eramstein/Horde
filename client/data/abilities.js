import { adjacentCreatures, adjacentAllies } from '../engine/battle/battlefield'
import { addModifier, damage as damageCreature } from '../engine/battle/creature'

export default {
  retaliation: ({ damageType, damageValue }) => {
    return {
        trigger: 'isAttacked',
        effect: (state, me, { attackerCreatureId }) => {
            damageCreature(state, { creatureId: attackerCreatureId, damageType, damageValue })
        },
        text: () => 'Retaliation: ' + damageType + ' ' + damageValue
    }
  }
}