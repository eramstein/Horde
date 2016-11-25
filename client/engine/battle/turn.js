const aiWorker = new Worker('worker.js')

aiWorker.onmessage = function(e) {
  console.log('Message received from worker', e.data);
}

export const passTurn = function (state) {
  if (state.currentPlayer === 'player') {
    state.currentPlayer = 'opponent'
    aiWorker.postMessage(state)
  } else {
    state.currentPlayer = 'player'
    state.turn++
  }
}
?