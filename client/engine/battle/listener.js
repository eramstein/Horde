
export const listener = function (state, {trigger, args}) {
  _.forEach(state.creatures, (c) => {
    if (state.creatures[c.id]) {
      _.forEach(state.creatures[c.id].abilities, (a) => {
        if (
          a.trigger === trigger
          || trigger === 'creatureMoved' && a.trigger === 'moved' && args.creatureId === c.id
          || trigger === 'creatureAttacked' && a.trigger === 'isAttacked' && args.defenderCreatureId === c.id
        ) {        
          a.effect(state, c, args)
        }
      })
    }    
  })
}