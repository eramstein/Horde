export const computeStateValue = function (state) {
  let value = 0

  // TODO first let player have a turn on its own

  // points for creatures
  _.forEach(state.creatures, c => {
    let points = c.cost + c.cost * (c.sp + c.hp) / (c.spMax + c.hpMax)
    if (c.controller === 'player') { 
      points = -points 
    }
    value += points
  })

  // points for HP
  value += state.heroes.opponent.hp
  value -= state.heroes.player.hp

  return value
}
