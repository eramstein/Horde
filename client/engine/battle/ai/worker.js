import { setBattleTemplates } from '../../../store/templates'
import { summon } from '../creature'
import { useCreature } from './useCreature'

onmessage = function(e) {  
  const state = setBattleTemplates(e.data, true)
  let stateSequence = []

  // summon wave
  // --------------------------------------------
  const wave = state.opponent.waves[state.turn]
  delete state.opponent.waves[state.turn]
  if (wave) {
    // start in center and spread around
    let cell    
    let row
    let rootRow = Math.round(state.rowCount / 2)
    let layer = 0
    let direction = 1
    _.forEach(wave, creatures => {      
      for (let i = 1; i <= creatures.count ; i++) {
        row = rootRow + layer * direction
        direction = -direction
        if (direction === -1) { layer++ }
        cell = { row, column: state.columnCount }
        if (row > 0 && row <= state.rowCount) {
          summon(state, { creatureName: creatures.creature, hero: 'opponent' , cell })       
        }         
      }
      stateSequence.push(_.cloneDeep(state))
    })
    stateSequence.push(_.cloneDeep(state))
  }

  // use creatures
  // --------------------------------------------
  const creatures = _.filter(state.creatures, c => c.controller === 'opponent')
  let newState = _.cloneDeep(state)  
  _.forEach(creatures, c => {
    const result = useCreature(newState, c)
    newState = result.newState
    if (result.creatureAction) {
      stateSequence.push(_.cloneDeep(newState))
    }    
  })

  // send data back
  // --------------------------------------------
  
  postMessage(JSON.parse(JSON.stringify( stateSequence )))
}

