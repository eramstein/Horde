import computeStateValue from './computeStateValue'

onmessage = function(e) {
  console.log('Message received from main script', e);
  postMessage('new state');
}