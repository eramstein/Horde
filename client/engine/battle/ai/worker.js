import { computeStateValue } from './computeStateValue'

onmessage = function(e) {
  const initialState = e.data
  let newState = initialState
  newState.graveyard = {a: 123}
  console.log('Message received from main script', e);
  postMessage(newState)
}