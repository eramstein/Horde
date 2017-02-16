export const activateAbility = function (state, { selectedCreatureId, selectedAbilityId, targetCreatureId }) {
  const creature = state.creatures[selectedCreatureId]
  const ability = creature.abilities[selectedAbilityId]
  const canUse = canUseAbility(state, { selectedCreatureId, selectedAbilityId })

  if (!canUse) { return false }

  if (ability.targetType === 'creature' && ability.targetFilter) {
    const target = state.creatures[targetCreatureId]
    if (!ability.targetFilter(target)) { return false }    
  }

  if (payAbilityCost(state, { selectedCreatureId, selectedAbilityId })) {
    ability.effect(state, creature, { targetCreatureId })
  }
  
}

export const canUseAbility = function (state, { selectedCreatureId, selectedAbilityId }) {
  const creature = state.creatures[selectedCreatureId]
  const ability = creature.abilities[selectedAbilityId]

  return (!creature.exhausted || !ability.exhausts) &&
    (creature.summonedOnTurn !== state.turn || creature.keywords.haste)
}

export const payAbilityCost = function (state, { selectedCreatureId, selectedAbilityId }) {
  const creature = state.creatures[selectedCreatureId]
  const ability = creature.abilities[selectedAbilityId]

  if (ability.cost) {
    if (creature.energy >= ability.cost) {
      creature.energy -= ability.cost
      if (ability.exhausts) {
        creature.exhausted = true
      }
    } else {
      return false;
    }  
  } 

  return true
}
