import { listener } from './listener'
import { creatureAtCell, getDistance } from './battlefield'
import { destroy as destroyCreature } from './creature'
import { damageHero } from './hero'

export const attackCreature = function (state, { attackerCreatureId, targetCreatureId }) {
  const attacker = state.creatures[attackerCreatureId]

  const creatureCanAttack = canAttack(state, { attackerCreatureId })
  if (!creatureCanAttack) { return false; }
  
  const invalidTarget = !isValidAttackTarget(state, { attackerCreatureId, targetCreatureId })
  if (invalidTarget) { return false; }

  // triggers
  listener(state, { trigger: 'creatureAttacked', args: { attackerCreatureId, defenderCreatureId: targetCreatureId } })

  // state change
  attacker.hasAttacked++
  dealCombatDamage(state, { attackerCreatureId, targetCreatureId })

}

export const attackPlayer = function (state, { attackerCreatureId }) {
  const attacker = state.creatures[attackerCreatureId]

  const creatureCanAttack = canAttack(state, { attackerCreatureId })
  if (!creatureCanAttack) { return false; }

  const creatureCanAttackHero = canAttackPlayer(state, { attackerCreatureId })
  if (!creatureCanAttackHero) { return false; }

  // triggers
  listener(state, { trigger: 'creatureAttacked', args: { attackerCreatureId, defender: 'player' } })

  // state change
  attacker.hasAttacked++
  damageHero(state, { damage: attacker.attack, sourceType: 'creature', source: attackerCreatureId })
  
}

export const dealCombatDamage = function (state, { attackerCreatureId, targetCreatureId }) {
  const attacker = state.creatures[attackerCreatureId]
  const defender = state.creatures[targetCreatureId]

  defender.hp = defender.hp - attacker.attack

  if (!attacker.keywords.firstStrike || defender.hp > 0) {
    attacker.hp = attacker.hp - defender.attack
  }

  if (defender.hp <= 0) {
    destroyCreature(state, { creatureId: targetCreatureId })
  }

  if (attacker.hp <= 0) {
    destroyCreature(state, { creatureId: attackerCreatureId })
  }

}

export const canAttack = function (state, { attackerCreatureId }) {

  const attacker = state.creatures[attackerCreatureId]
  
  const exhausted = attacker.hasAttacked && !attacker.keywords.extraAttacks
    || attacker.keywords.extraAttacks && attacker.hasAttacked > attacker.keywords.extraAttacks
    || attacker.exhausted

  const summoningSickness = 
    attacker.summonedOnTurn === state.turn && !attacker.keywords.haste

  const isPacific = attacker.keywords.pacific === true

  if (exhausted) { return false; }
  if (summoningSickness) { return false; }
  if (isPacific) { return false; }

  return true

}

export const isValidAttackTarget = function (state, { attackerCreatureId, targetCreatureId }) {

  const attacker = state.creatures[attackerCreatureId]
  const target = state.creatures[targetCreatureId]

  if (target.controller === attacker.controller) { return false }

  let valid = false

  let attackDistance = 1

  if (attacker.keywords.shooter) {
    attackDistance = 1000
  }

  if (getDistance(attacker.pos, target.pos) <= attackDistance) {
    valid = true 
  }
  
  return valid
}

export const canAttackPlayer = function (state, { attackerCreatureId }) {
  const attacker = state.creatures[attackerCreatureId]
  let attackDistance = 1
  if (attacker.keywords.shooter) {
    attackDistance = 1000
  }
  return attacker.pos.column <= attackDistance
}

export const attackableCreatures = function (state, { attackerCreatureId }) {
  return _.filter(state.creatures, c => isValidAttackTarget(state, { attackerCreatureId, targetCreatureId: c.id }))
}

