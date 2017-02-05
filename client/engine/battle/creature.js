import { listener } from './listener'
import cards from '../../data/cards'
import { idPrefix } from '../config'
import { isCellOccupied, isLegalCell } from './battlefield'

export const summon = function (state, { creatureName, hero , cell, isGeneral }) {

  if (isCellOccupied(state, cell) || !isLegalCell(state, cell)) { return }

  const id = idPrefix.CREATURES + (_.keys(state.creatures).length + _.keys(state.graveyard).length)
  const template = _.cloneDeep(cards[creatureName])
  const creatures = _.cloneDeep(state.creatures)
  creatures[id] = {
    id,
    name: creatureName,    
    ...template,
    hp: template.hpMax,
    energy: template.energy,
    modifiers: [],
    owner: hero,
    controller: hero,
    pos: cell,
    hasMoved: 0,
    hasAttacked: 0,
    summonedOnTurn: state.turn,
    exhausted: false,
    isGeneral,
  }
  state.creatures = creatures
}

export const damage = function (state, { creatureId, damage }) {
  const creature = state.creatures[creatureId]
  creature.hp -= damage
  if (creature.hp <= 0) {
    destroy(state, { creatureId })
  }
}

export const destroy = function (state, { creatureId }) {
  const creatures = _.cloneDeep(state.creatures)
  const graveyard = _.cloneDeep(state.graveyard)

  graveyard[creatureId] = creatures[creatureId]
  delete creatures[creatureId]

  state.creatures = creatures
  state.graveyard = graveyard
}

export const move = function (state, { creatureId, cell }) {
  const thisCreature = state.creatures[creatureId]

  if (canMove(state, { creatureId, cell }) === false) {
    return false
  }  
  
  // if move valid, do it
  state.creatures[creatureId].hasMoved++
  state.creatures[creatureId].pos = cell

  // triggers
  listener(state, { trigger: 'creatureMoved', args: { creatureId, to: cell } })
}


export const canMove = function (state, { creatureId, cell }) {
  const thisCreature = state.creatures[creatureId]

  // can the creature move at all
  const staticCreature = thisCreature.keywords.static

  const exhausted = thisCreature.hasMoved && !thisCreature.keywords.extraMoves
    || thisCreature.keywords.extraMoves && thisCreature.hasMoved > thisCreature.keywords.extraMoves
    || thisCreature.hasAttacked && !thisCreature.keywords.attackAndMove
    || thisCreature.exhausted

  const summoningSickness = 
    thisCreature.summonedOnTurn === state.turn && !thisCreature.keywords.haste

  if (staticCreature) { return false; }
  if (exhausted) { return false; }
  if (summoningSickness) { return false; }

  // is the target cell valid
  let invalidCell = false 

  if (cell && cell.row && cell.column) {
    let validCells = reachableCells(state, { creatureId })
    invalidCell = !validCells[cell.column + '-' + cell.row]
  }

  if (invalidCell) { return false; }
  
  return true
}

// returns an object like { "3-2": true } with 3 as the column and 2 the row
export const reachableCells = function (state, { creatureId }) {
  let creatureMoves = state.creatures[creatureId].moves || 2
  let pos = state.creatures[creatureId].pos
  let reachableCells = {}

  checkAdjacent(pos, creatureMoves)

  function checkAdjacent(cell, moves) {
    moves--
    if (moves < 0) { return }
    // top 
    exploreCell({ row: (cell.row - 1), column: cell.column }, moves)
    // bottom 
    exploreCell({ row: (cell.row + 1), column: cell.column }, moves)
    // left 
    exploreCell({ row: cell.row, column: (cell.column - 1) }, moves)
    // right 
    exploreCell({ row: cell.row, column: (cell.column + 1) }, moves)
    
  }

  function exploreCell(cellToExplore, movesLeft) {
    if (cellToExplore.row > 0 && 
      cellToExplore.row <= state.rowCount && 
      cellToExplore.column > 0 && 
      cellToExplore.column <= state.columnCount && 
      !isCellOccupied(state, cellToExplore) && 
      !reachableCells[cellToExplore.column + '-' + cellToExplore.row]) {
      
      reachableCells[cellToExplore.column + '-' + cellToExplore.row] = true      
      checkAdjacent(cellToExplore, movesLeft)

    }   
  }

  return reachableCells
}

export const reachableCellsAsArray = function (state, { creatureId }) {
  const reachableCellsAsObject = reachableCells(state, { creatureId })
  let array = [] 
  _.forEach(reachableCellsAsObject, (val, key) => {
    array.push({ row: key.split('-')[1]*1, column: key.split('-')[0]*1})
  })
  return array
}


export const addModifier = function (state, { creatureId, modifier }) {
  let creature = state.creatures[creatureId]

  modifier.id = 'modif-' + (Math.random() * 1000000000000) // lol

  creature.modifiers.push(modifier)
  
  if(modifier.type === 'hpMax') {
    creature.hpMax += modifier.value
  }
  if(modifier.type === 'attack') {
    creature.attack += modifier.value
  }
  if(modifier.type === 'keyword') {
    let currentVal = creature.keywords[modifier.value.keyword]
    if (currentVal) {
      if (_.isNumber(currentVal)) {
        currentVal =  currentVal + (modifier.value.val || 0)
      } else {
        currentVal = modifier.value.val
      }
    } else {
      creature.keywords[modifier.value.keyword] = modifier.value.val || true
    }
  }  
}

export const cancelModifier = function (state, { creatureId, modifier }) {
  let creature = state.creatures[creatureId]

  creature.modifiers = _.filter(creature.modifiers,  m => m.id !== modifier.id )

  if(modifier.type === 'hpMax') {
    creature.hpMax -= modifier.value    
  }
  if(modifier.type === 'attack') {
    creature.attack -= modifier.value
  }

  if(modifier.type === 'keyword') {
    let currentVal = creature.keywords[modifier.value.keyword]
    if (currentVal && _.isNumber(currentVal)) {
      currentVal =  currentVal - (modifier.value.val || 0)
    } else {
      creature.keywords[modifier.value.keyword] = false
    }
  }  
}

export const canSummonHere = function (state, { cardId, target }) {
  const creature = state.player.cards[cardId]

  const correctColumn = target.column === 1 || creature.template.keywords.airdrop

  return correctColumn && !isCellOccupied(state, target)
}