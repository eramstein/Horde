import { cancelModifier } from './creature'

export const startTurn = function (state, { hero }) {
  clearEndOfTurnModifiers(state)
  state.currentPlayer = hero
  state.ui.attackAnimation = null
  incrementMana(state, { hero, count: 1 })
  replenishMana(state, { hero })
  refreshCreatures(state, { hero })
  if (hero === 'player') {
    state.turn++
  }
}

export const replenishMana = function (state, { hero }) {
  state.heroes[hero].mana = state.heroes[hero].manaMax
}

export const incrementMana = function (state, { hero, count }) {
  state.heroes[hero].manaMax = state.heroes[hero].manaMax + count
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
