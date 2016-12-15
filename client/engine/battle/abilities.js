export const targetCreature = function (state, { selectedCreatureId, selectedAbilityId, targetCreatureId }) {
  const creature = state.creatures[selectedCreatureId]
  const ability = creature.abilities[selectedAbilityId]
  const canUse = canUseAbility(state, { selectedCreatureId, selectedAbilityId })

  if (!canUse) { console.log('ERROR: this ability cannot be played by an exhausted creature'); return false;}

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

  if (ability.costValue) {
    if (creature[ability.costType] > ability.costValue) {
      creature[ability.costType] -= ability.costValue
      if (ability.exhausts) {
        creature.exhausted = true
      }
    } else {
      console.log('ERROR: cannot pay for that ability'); 
      return false;
    }  
  } 

  return true
}
