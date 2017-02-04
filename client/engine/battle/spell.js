export const playSpellOnCreature = function (state, { spellId, targetCreatureId }) {
  const spell = state.player.cards[spellId]
  spell.template.effect(state, { targetCreatureId })
}
