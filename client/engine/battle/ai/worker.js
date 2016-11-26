import { computeStateValue } from './computeStateValue'
import { setBattleTemplates } from '../../../store/templates'

onmessage = function(e) {
  const initialState = setBattleTemplates(e.data, true)
  let newState = initialState
  postMessage(JSON.parse(JSON.stringify(newState)))
}

