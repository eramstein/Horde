export const addMana = function (state, { count }) {
  state.player.mana = Math.max(state.player.mana + count, 0)
}

export const damageHero = function (state, { damage, sourceType, source }) {
  state.player.hp -= damage
  if (state.player.hp <= 0) {
    killHero(state)
  }
}

export const killHero = function (state) {
  //console.log('you lose, booooo')
}