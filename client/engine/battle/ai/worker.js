import { findLethal } from './findLethal'
import { computeStateValue } from './computeStateValue'
import { executeRandomActions } from './generateActions'
import { setBattleTemplates } from '../../../store/templates'

onmessage = function(e) {  
  const initialState = setBattleTemplates(e.data, true)
  let bestStateValue = 0
  let bestStateSequence = []

  let lethalStateSequence = findLethal()

  if (lethalStateSequence) {
    bestNewState = lethalStateSequence
  } else {
    for (let i = 0; i < 1; i++) {
      const stateToUse = _.cloneDeep(initialState)
      const stateSequence = executeRandomActions(stateToUse)
      const finalState = stateSequence[stateSequence.length]
      const finalStateValue = computeStateValue(initialState, finalState || initialState)
      if (finalStateValue > bestStateValue) {
        bestStateSequence = stateSequence
        bestStateValue = finalStateValue
      }
    }
  }

  postMessage(JSON.parse(JSON.stringify( bestStateSequence )))
}

