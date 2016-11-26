
export const listener = function (state, {trigger, args}) {
  _.forEach(state.creatures, (c) => {
    _.forEach(state.creatures[c.id].abilities, (a) => {
      if (a.trigger === trigger) {        
        a.effect(state, c, args)
      }
    })
  })
}