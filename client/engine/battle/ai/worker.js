import { setBattleTemplates } from '../../../store/templates'
import { summon } from '../creature'
import { useCreature } from './useCreature'

onmessage = function(e) {  
  const state = setBattleTemplates(e.data, true)
  let stateSequence = []
  let newState = _.cloneDeep(state)

  // use creatures
  // --------------------------------------------
  const creatures = _.filter(newState.creatures, c => c.controller === 'opponent')    
  _.forEach(creatures, c => {
    const result = useCreature(newState, c)
    if (result.newStates.length > 0) {
      newState = result.newStates[result.newStates.length - 1]
    }    
    if (result.creatureAction) {
      result.newStates.forEach(ns => {
        stateSequence.push(ns)
      })      
    }    
  })

  // summon wave
  // --------------------------------------------
  const wave = newState.opponent.waves[newState.turn]
  delete newState.opponent.waves[newState.turn]
  if (wave) {
    // start in center and spread around
    let cell    
    let row
    let rootRow = Math.round(newState.rowCount / 2)
    let layer = 0
    let direction = 1
    _.forEach(wave, creature => {      
      for (let i = 1; i <= creature.count ; i++) {
        row = rootRow + layer * direction
        direction = -direction
        if (direction === -1) { layer++ }
        cell = { row, column: newState.columnCount }
        if (row > 0 && row <= newState.rowCount) {
          summon(newState, { creatureName: creature.creature, hero: 'opponent' , cell, isGeneral: creature.general })       
        }         
      }
      stateSequence.push(_.cloneDeep(newState))
    })
  }

  

  // send data back
  // --------------------------------------------
  
  postMessage(JSON.parse(JSON.stringify( stateSequence )))
}

