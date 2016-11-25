export const addMana = function (state, {hero, count}) {
  state.heroes[hero].mana = Math.max(state.heroes[hero].mana + count, 0)
}