import { creatureAtCell } from './battlefield'
import { destroy as destroyCreature } from './creature'

export const attackCreature = function (state, { attackerCreatureId, targetCreatureId }) {
  const creatures = _.cloneDeep(state.creatures)
  const creature = creatures[attackerCreatureId]
  
  // is the attack invalid ?

  const invalidTarget = !isValidAttackTarget(state, { attackerCreatureId, targetCreatureId })

  const exhausted = creature.hasAttacked && !creature.template.keywords.extraAttacks
    || creature.template.keywords.extraAttacks && creature.hasAttacked > creature.template.keywords.extraAttacks
    || creature.hasMoved && !creature.template.keywords.attackAndMove

  const summoningSickness = 
    creature.summonedOnTurn === state.turn && !creature.template.keywords.haste

  if (invalidTarget) { console.log('ERROR: invalid attack target'); return false; }
  if (exhausted) { console.log('ERROR: trying to attack with an exhausted creature'); return false; }
  if (summoningSickness) { console.log('ERROR: trying to attack with a summon sick creature'); return false; }

  // if attack valid, do it
  creature.hasAttacked++
  state.creatures = creatures
  dealCombatDamage(state, { attackerCreatureId, targetCreatureId })
}

export const dealCombatDamage = function (state, { attackerCreatureId, targetCreatureId }) {
  let creatures = _.cloneDeep(state.creatures)
  const attacker = creatures[attackerCreatureId]
  const defender = creatures[targetCreatureId]

  if (attacker.template.attackType === 'hp') {
    defender.damageHp = defender.damageHp + attacker.template.attackValue
    if (defender.damageHp >= defender.template.hp) {
      destroyCreature(state, { creatureId: targetCreatureId })
      creatures = state.creatures
    }
  }

  if (attacker.template.attackType === 'sp') {
    defender.damageSp = defender.damageSp + attacker.template.attackValue
    if (defender.damageSp >= defender.template.sp) {
      destroyCreature(state, { creatureId: targetCreatureId })
      creatures = state.creatures
    }
  }

  state.creatures = creatures
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