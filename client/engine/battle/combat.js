import { creatureAtCell } from './battlefield'
import { destroy as destroyCreature } from './creature'
import { damageHero } from './hero'



export const attackCreature = function (state, { attackerCreatureId, targetCreatureId }) {
  const creatureCanAttack = canAttack(state, { attackerCreatureId })
  if (!creatureCanAttack) { return false; }
  
  const invalidTarget = !isValidAttackTarget(state, { attackerCreatureId, targetCreatureId })
  if (invalidTarget) { console.log('ERROR: invalid attack target'); return false; }

  state.creatures[attackerCreatureId].hasAttacked++
  dealCombatDamage(state, { attackerCreatureId, targetCreatureId })
}



export const attackOpponent = function (state, { attackerCreatureId }) {
  const attacker = state.creatures[attackerCreatureId]

  const creatureCanAttack = canAttack(state, { attackerCreatureId })
  if (!creatureCanAttack) { return false; }

  attacker.hasAttacked++
  damageHero(state, { hero: 'opponent', damage: attacker.attackValue, sourceType: 'creature', source: attackerCreatureId })
}



export const dealCombatDamage = function (state, { attackerCreatureId, targetCreatureId }) {
  const attacker = state.creatures[attackerCreatureId]
  const defender = state.creatures[targetCreatureId]

  if (attacker.attackType === 'hp') {
    defender.hp = defender.hp - attacker.attackValue
  }

  if (attacker.attackType === 'sp') {
    defender.sp = defender.sp - attacker.attackValue
  }

  if (defender.hp <= 0 || defender.sp <= 0) {
    destroyCreature(state, { creatureId: targetCreatureId })
  }

}




export const canAttack = function (state, { attackerCreatureId }) {

  const attacker = state.creatures[attackerCreatureId]
  
  const exhausted = attacker.hasAttacked && !attacker.keywords.extraAttacks
    || attacker.keywords.extraAttacks && attacker.hasAttacked > attacker.keywords.extraAttacks
    || attacker.hasMoved && !attacker.keywords.attackAndMove
    || thisCreature.exhausted

  const summoningSickness = 
    attacker.summonedOnTurn === state.turn && !attacker.keywords.haste

  const isPacific = attacker.keywords.pacific === true

  if (exhausted) { console.log('ERROR: trying to attack with an exhausted creature'); return false; }
  if (summoningSickness) { console.log('ERROR: trying to attack with a summon sick creature'); return false; }
  if (isPacific) { console.log('ERROR: trying to attack with a pacific creature'); return false; }

  return true

}



const isValidAttackTarget = function (state, { attackerCreatureId, targetCreatureId }) {

  const attacker = state.creatures[attackerCreatureId]
  const target = state.creatures[targetCreatureId]

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