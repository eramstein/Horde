import { computeStateValue } from './computeStateValue'
import { setBattleTemplates } from '../../../store/templates'

onmessage = function(e) {
  console.log(e.data);
  const initialState = setBattleTemplates(e.data, true)
  let newState = initialState
  console.log('Message received from main script', e);
  postMessage(JSON.parse(JSON.stringify(newState)))
}

