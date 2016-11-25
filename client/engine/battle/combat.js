import { creatureAtCell } from './battlefield'
import { destroy as destroyCreature, getCurrentState } from './creature'



export const attackCreature = function (state, { attackerCreatureId, targetCreatureId }) {
  const creatures = _.cloneDeep(state.creatures)
  const attackerState = getCurrentState(state, attackerCreatureId)
  
  const invalidTarget = !isValidAttackTarget(state, { attackerCreatureId, targetCreatureId })

  const exhausted = attackerState.hasAttacked && !attackerState.keywords.extraAttacks
    || attackerState.keywords.extraAttacks && attackerState.hasAttacked > attackerState.keywords.extraAttacks
    || attackerState.hasMoved && !attackerState.keywords.attackAndMove

  const summoningSickness = 
    attackerState.summonedOnTurn === state.turn && !attackerState.keywords.haste

  const isPacific = attackerState.keywords.pacific === true

  if (invalidTarget) { console.log('ERROR: invalid attack target'); return false; }
  if (exhausted) { console.log('ERROR: trying to attack with an exhausted creature'); return false; }
  if (summoningSickness) { console.log('ERROR: trying to attack with a summon sick creature'); return false; }
  if (isPacific) { console.log('ERROR: trying to attack with a pacific creature'); return false; }

  // if attack valid, do it
  creatures[attackerCreatureId].hasAttacked++
  state.creatures = creatures
  dealCombatDamage(state, { attackerCreatureId, targetCreatureId })
}



export const dealCombatDamage = function (state, { attackerCreatureId, targetCreatureId }) {
  let creatures = _.cloneDeep(state.creatures)
  const defender = creatures[targetCreatureId]
  const attackerState = getCurrentState(state, attackerCreatureId)
  const defenderState = getCurrentState(state, targetCreatureId)

  if (attackerState.attackType === 'hp') {
    defender.damageHp = defenderState.damageHp + attackerState.attackValue
    if (defender.damageHp >= defenderState.hp) {
      destroyCreature(state, { creatureId: targetCreatureId })
      creatures = state.creatures
    }
  }

  if (attackerState.attackType === 'sp') {
    defender.damageSp = defenderState.damageSp + attackerState.attackValue
    if (defender.damageSp >= defenderState.sp) {
      destroyCreature(state, { creatureId: targetCreatureId })
      creatures = state.creatures
    }
  }

  state.creatures = creatures
}



const isValidAttackTarget = function (state, { attackerCreatureId, targetCreatureId }) {

  const attacker = getCurrentState(state, attackerCreatureId)
  const target = getCurrentState(state, targetCreatureId)

  // different rows
  if (attacker.pos.row !== target.pos.row) {
    console.log('ERROR: trying to attack a creature on a different row');
    return false;
  }

  // support column
  if (attacker.pos.column === 1 || attacker.pos.column === state.columnCount) {
    console.log('ERROR: trying to attack from a support column');
    return false;
  }

  // blockers
  const leftCreatureColumn = Math.min(attacker.pos.column, target.pos.column)
  const rightCreatureColumn = Math.max(attacker.pos.column, target.pos.column)
  for (let i = leftCreatureColumn + 1; i <= rightCreatureColumn - 1; i++) {
    const creatureHere = creatureAtCell(state, { row: attacker.pos.row, column: i })
    if (creatureHere && creatureHere.controller !== state.currentPlayer) {
      console.log('ERROR: trying to attack across a blocker');
      return false;
    }
  }

  return true

}