import cards from '../data/cards'

export const setTemplates = function (state, add) {
  _.forEach(state.game.battle.heroes.player.cards, (c) => {
    c.template = add ? cards[c.name] : null
  })
  _.forEach(state.game.battle.heroes.opponent.cards, (c) => {
    c.template = add ? cards[c.name] : null
  })
  _.forEach(state.game.battle.creatures, (c) => {
    c.template = add ? cards[c.name] : null
  })
  return state
}

export const setBattleTemplates = function (state, add) {
  _.forEach(state.heroes.player.cards, (c) => {
    c.template = add ? cards[c.name] : null
  })
  _.forEach(state.heroes.opponent.cards, (c) => {
    c.template = add ? cards[c.name] : null
  })
  _.forEach(state.creatures, (c) => {
    c.template = add ? cards[c.name] : null
  })
  return state
}