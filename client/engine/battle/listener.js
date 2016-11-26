import { getCurrentState } from './creature'

export const listener = function (state, {trigger, args}) {
  _.forEach(state.creatures, (c) => {
    const creatureState = getCurrentState(state, c.id)
    _.forEach(creatureState.abilities, (a) => {
      if (a.trigger === trigger) {        
        a.effect(state, c, args)
      }
    })
  })
}