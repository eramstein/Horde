import { reachableCellsAsArray, move, canMove } from '../creature'
import { attackPlayer, attackCreature, attackableCreatures, canAttack, canAttackPlayer } from '../combat'

export const useCreature = function (state, creature) {
  let newState = _.cloneDeep(state)
  let creatureAction = null
  let result
  let newStates = []
  if (creature.behaviours.stupid) {
    result = doStupid(newState, creature)
    creatureAction = result.creatureAction
    newStates = result.newStates
  }

  return { newStates, creatureAction }
}

const doStupid = function (state, creature) {

  const creatureId = creature.id
  let creatureAction = null
  let newStates = []

  // do in priority:
  // - attack hero
  // - attack creature
  //  - amongst my targets, can I kill one?
  //    - order of choice: can kill, most hp, most expensive, right col, top row
  // - move forward. lower column amonst valid cells. tie -> top row

  const pushState = function (action, stateAfterAction) {
    newStates.push(_.cloneDeep(stateAfterAction))
    creatureAction = action
  }

  const attack = function () {
    // attack hero
    if (canAttack(state, { attackerCreatureId: creatureId }) && canAttackPlayer(state, { attackerCreatureId: creatureId })) {      
      if (canAttackPlayer(state, { attackerCreatureId: creatureId })) {
        attackPlayer(state, { attackerCreatureId: creatureId })
        pushState('attackedPlayer', state)
      }
    }
    // attack creature
    if (canAttack(state, { attackerCreatureId: creatureId })) {
      
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
        pushState('attackedCreature', state)
      }
    }
  }

  // attack before move
  attack();

  // move (if still alive)
  if (state.creatures[creatureId] && canMove(state, { creatureId })) {
    let possibleMoves = reachableCellsAsArray(state, { creatureId })
    possibleMoves = _.sortBy(possibleMoves, ['column', 'row'])
    if (possibleMoves.length > 0) {
      move(state, { creatureId, cell: possibleMoves[0] })
      pushState('moved', state)
    }
  }

  // attack after move (if still alive)
  if (state.creatures[creatureId]) {
    attack();
  }  

  return { newStates, creatureAction }

}