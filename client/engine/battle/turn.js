import aiWorker from 'worker?name=ai!./ai/worker'

const AI = new aiWorker

AI.onmessage = function(e) {
  console.log('Message received from worker', e.data);
}

export const passTurn = function (state) {
  if (state.currentPlayer === 'player') {
    state.currentPlayer = 'opponent'
    AI.postMessage(state)
  } else {
    state.currentPlayer = 'player'
    state.turn++
  }
}
