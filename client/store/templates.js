import cards from '../data/cards'

export const setTemplates = function (state, add) {
  _.forEach(state.game.battle.player.cards, (c) => {
    c.template = add ? cards[c.name] : null
  })
  _.forEach(state.game.battle.creatures, (c) => {
    c.abilities = add ? cards[c.name].abilities : null
  })
  _.forEach(state.game.battle.graveyard, (c) => {
    c.abilities = add ? cards[c.name].abilities : null
  })
  return state
}

export const setBattleTemplates = function (state, add) {
  _.forEach(state.player.cards, (c) => {
    c.template = add ? cards[c.name] : null
  })
  _.forEach(state.creatures, (c) => {
    c.abilities = add ? cards[c.name].abilities : null
  })
  _.forEach(state.graveyard, (c) => {
    c.abilities = add ? cards[c.name].abilities : null
  })
  return state
}