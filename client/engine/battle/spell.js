export const playSpellOnCreature = function (state, { spellId, targetCreatureId }) {
  const spell = state.heroes[state.currentPlayer].cards[spellId]
  spell.template.effect(state, { targetCreatureId })
}
