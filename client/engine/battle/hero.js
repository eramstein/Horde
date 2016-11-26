export const addMana = function (state, {hero, count}) {
  state.heroes[hero].mana = Math.max(state.heroes[hero].mana + count, 0)
}

export const damageHero = function (state, { hero, damage, sourceType, source }) {
  state.heroes[hero].hp -= damage
  if(state.heroes[hero].hp <= 0) {
    killHero(state, { hero })
  }
}

export const killHero = function (state, { hero }) {
  if (hero === 'player') {
    alert('you lose, booooo')
  } else {
    alert('you win, yaaayyy')
  }  
}