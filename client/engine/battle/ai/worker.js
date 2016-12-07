import { findLethal } from './findLethal'
import { computeStateValue } from './computeStateValue'
import { executeRandomActions } from './generateActions'
import { setBattleTemplates } from '../../../store/templates'

onmessage = function(e) {
  const initialState = setBattleTemplates(e.data, true)
  let bestStateValue = 0
  let bestNewState = _.cloneDeep(initialState)
  let bestActionsCourse = []

  let { lethalState, lethalActions } = findLethal()

  if (lethalState) {
    bestNewState = lethalState
    bestActionsCourse = lethalActions
  } else {
    for (let i = 0; i < 1; i++) {
      const stateToUse = _.cloneDeep(initialState)
      const { actions, tempState } = executeRandomActions(stateToUse)
      if (computeStateValue(initialState, tempState) > bestStateValue) {
        bestNewState = tempState
        bestActionsCourse = actions
      }
    }
  }
  
  postMessage(JSON.parse(JSON.stringify(bestNewState)))
}

