import { cancelModifier } from './creature'

export const startTurn = function (state, { hero }) {
  clearEndOfTurnModifiers(state)
  state.currentPlayer = hero
  state.ui = {
    selectedCardId: null,
    selectedCreatureId: null,
    selectedAbilityId: null,
    attackAnimation: null,
  }  
  refreshCreatures(state, { hero })
  if (hero === 'player') {
    incrementMana(state, { hero, count: 1 })
    replenishMana(state, { hero })
    state.turn++
  }
}

export const replenishMana = function (state) {
  state.player.mana = state.player.manaMax
}

export const incrementMana = function (state, { count }) {
  state.player.manaMax = state.player.manaMax + count
}

export const refreshCreatures = function (state, { hero }) {
  _.filter(state.creatures, (c) => c.controller === hero)
    .forEach((c) => {
      c.hasAttacked = 0
      c.hasMoved = 0
      c.exhausted = false
    })
}

export const clearEndOfTurnModifiers = function (state) {
  _.forEach(state.creatures, (c) => {
    _.forEach(c.modifiers, (m) => {
      if (m.until === 'eot') {
        cancelModifier(state, { creatureId: c.id, modifier: m })
      }      
    })
  })
}
