import { listener } from './listener'
import { creatureAtCell } from './battlefield'
import { destroy as destroyCreature } from './creature'
import { damageHero } from './hero'

export const attackCreature = function (state, { attackerCreatureId, targetCreatureId }) {
  const creatureCanAttack = canAttack(state, { attackerCreatureId })
  if (!creatureCanAttack) { return false; }
  
  const invalidTarget = !isValidAttackTarget(state, { attackerCreatureId, targetCreatureId })
  if (invalidTarget) { return false; }

  // triggers
  listener(state, { trigger: 'creatureAttacked', args: { attackerCreatureId, defenderCreatureId: targetCreatureId } })

  // state change
  state.creatures[attackerCreatureId].hasAttacked++
  dealCombatDamage(state, { attackerCreatureId, targetCreatureId })  

}

export const attackOpponent = function (state, { attackerCreatureId }) {
  const attacker = state.creatures[attackerCreatureId]
  const hero = state.currentPlayer === 'player' ? 'opponent' : 'player'

  const creatureCanAttack = canAttack(state, { attackerCreatureId })
  if (!creatureCanAttack) { return false; }

  const creatureCanAttackHero = canAttackHero(state, { attackerCreatureId })
  if (!creatureCanAttackHero) { return false; }

  // triggers
  listener(state, { trigger: 'creatureAttacked', args: { attackerCreatureId, defenderHero: hero } })

  // state change
  attacker.hasAttacked++
  damageHero(state, { hero, damage: attacker.attackValue, sourceType: 'creature', source: attackerCreatureId })
  
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
    || attacker.exhausted

  const summoningSickness = 
    attacker.summonedOnTurn === state.turn && !attacker.keywords.haste

  const isPacific = attacker.keywords.pacific === true

  const supportColumn = attacker.pos.column === 1 || attacker.pos.column === state.columnCount

  if (exhausted) { return false; }
  if (summoningSickness) { return false; }
  if (isPacific) { return false; }
  if (supportColumn) { return false; }

  return true

}

export const validAttackTargets = function (state, { attackerCreatureId }) {
  const creatures = _.filter(state.creatures, c => {
    return c.controller !== state.currentPlayer
      && isValidAttackTarget(state, { attackerCreatureId, targetCreatureId: c.id })
  })
  const heroAttackable = canAttackHero(state, { attackerCreatureId })

  return {
    creatures,
    hero: heroAttackable
  }
}

const isValidAttackTarget = function (state, { attackerCreatureId, targetCreatureId }) {

  const attacker = state.creatures[attackerCreatureId]
  const target = state.creatures[targetCreatureId]

  // different rows
  if (attacker.pos.row !== target.pos.row) {
    return false;
  }  

  const blocked = !noBlocker(state, { attackerCreatureId, targetColumn: target.pos.column })
  if (blocked) { return false; }

  return true
}

const canAttackHero = function (state, { attackerCreatureId }) {

  const attacker = state.creatures[attackerCreatureId]
  const targetColumn = attacker.controller === 'player' ? (state.columnCount + 1) : 0

  const blocked = !noBlocker(state, { attackerCreatureId, targetColumn })
  if (blocked) { return false; }

  return true
}

const noBlocker = function (state, { attackerCreatureId, targetColumn }) {
  const attacker = state.creatures[attackerCreatureId]

  const leftCreatureColumn = Math.min(attacker.pos.column, targetColumn)
  const rightCreatureColumn = Math.max(attacker.pos.column, targetColumn)
  for (let i = leftCreatureColumn + 1; i <= rightCreatureColumn - 1; i++) {
    const creatureHere = creatureAtCell(state, { row: attacker.pos.row, column: i })
    if (creatureHere && creatureHere.controller !== attacker.controller) {
      return false;
    }
  }

  return true

}

