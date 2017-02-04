import { reachableCellsAsArray, move, canMove } from '../creature'
import { attackPlayer, attackCreature, attackableCreatures, canAttack, canAttackPlayer } from '../combat'

export const useCreature = function (state, creature) {
  let newState = _.cloneDeep(state)
  let creatureAction
  if (creature.behaviours.stupid) {
    creatureAction = doStupid(newState, creature)
  }

  return { newState, creatureAction }
}

const doStupid = function (state, creature) {

  const creatureId = creature.id
  let creatureAction = null

  // do in priority:
  // - attack hero
  // - attack creature
  //  - amongst my targets, can I kill one?
  //    - order of choice: can kill, most hp, most expensive, right col, top row
  // - move forward. lower column amonst valid cells. tie -> top row

  if (canAttack(state, { attackerCreatureId: creatureId })) {

    // attack hero
    if (canAttackPlayer(state, { attackerCreatureId: creatureId })) {
      attackPlayer(state, { attackerCreatureId: creatureId })
      creatureAction = 'attackedPlayer'
    }    

    // attack creature
    const targets = attackableCreatures(state, { attackerCreatureId: creatureId })

    if (targets.length > 0) { 
      // attackValues: for each attackable creature, how much value do I get by attacking it?
      let attackValues = []
      let attackValue
      let stateAfterAttack
      let targetAfterAttack

      _.forEach(targets, targetCreature => {
        // simulate attack to see what would happen
        stateAfterAttack = _.cloneDeep(state)
        attackCreature(stateAfterAttack, { attackerCreatureId: creatureId, targetCreatureId: targetCreature.id })
        targetAfterAttack = stateAfterAttack.creatures[targetCreature.id]
        attackValue = 0
        if (targetAfterAttack === undefined) {
          attackValue += 100000000 //priority to kills
          attackValue += state.creatures[targetCreature.id].hp * 100000 //then by HP
          attackValue += state.creatures[targetCreature.id].cost * 1000 //then by cost
          attackValue += state.creatures[targetCreature.id].pos.column * 10 //then by column
          attackValue += state.creatures[targetCreature.id].pos.row //then by row
        }
        attackValues.push({ target: targetCreature.id, attackValue })
      })

      attackValues = _.sortBy(attackValues, ['attackValue'], ['desc'])

      attackCreature(state, { attackerCreatureId: creatureId, targetCreatureId: attackValues[0].target })
      creatureAction = 'attackedCreature'
    }
  }

  // move (if still alive)
  if (state.creatures[creatureId] && canMove(state, { creatureId })) {
    let possibleMoves = reachableCellsAsArray(state, { creatureId })
    possibleMoves = _.sortBy(possibleMoves, ['column', 'row'])
    if (possibleMoves.length > 0) {
      move(state, { creatureId, cell: possibleMoves[0] })
      creatureAction = 'moved'
    }
  }

  return creatureAction  

}