import { listener } from './listener'
import cards from '../../data/cards'
import { idPrefix } from '../config'
import { isCellOccupied } from './battlefield'

export const summon = function (state, { creatureName, hero , cell }) {
  const id = idPrefix.CREATURES + (_.keys(state.creatures).length + _.keys(state.graveyard).length)
  const template = _.cloneDeep(cards[creatureName])
  const creatures = _.cloneDeep(state.creatures)
  creatures[id] = {
    id,
    name: creatureName,    
    ...template,
    hp: template.hpMax,
    sp: template.spMax,
    modifiers: [],
    owner: hero,
    controller: hero,
    pos: cell,
    hasMoved: 0,
    hasAttacked: 0,
    summonedOnTurn: state.turn
  }
  state.creatures = creatures
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

  // is the move invalid ?

  const cellOccupied = isCellOccupied(state, cell)

  const staticCreature = thisCreature.keywords.static

  const wrongColumn = thisCreature.controller === 'player' && cell.column > state.columnCount / 2
    || thisCreature.controller === 'opponent' && cell.column <= state.columnCount / 2

  const exhausted = thisCreature.hasMoved && !thisCreature.keywords.extraMoves
    || thisCreature.keywords.extraMoves && thisCreature.hasMoved > thisCreature.keywords.extraMoves
    || thisCreature.hasAttacked && !thisCreature.keywords.attackAndMove

  const summoningSickness = 
    thisCreature.summonedOnTurn === state.turn && !thisCreature.keywords.haste

  if (cellOccupied) { console.log('ERROR: trying to move a creature to occupied cell'); return false; }
  if (staticCreature) { console.log('ERROR: trying to move a static creature'); return false; }
  if (wrongColumn) { console.log('ERROR: trying to move to opponents board'); return false; }
  if (exhausted) { console.log('ERROR: trying to move an exhausted creature'); return false; }
  if (summoningSickness) { console.log('ERROR: trying to move a summon sick creature'); return false; }
  
  // if move valid, do it
  state.creatures[creatureId].hasMoved++
  state.creatures[creatureId].pos = cell

  // triggers
  listener(state, { trigger: 'creatureMoved', args: { creatureId, to: cell } })
}


export const addModifier = function (state, { creatureId, modifier }) {
  let creature = state.creatures[creatureId]

  creature.modifiers.push(modifier)
  
  if(modifier.type === 'hpMax') {
    creature.hpMax += modifier.value
  }
  if(modifier.type === 'spMax') {
    creature.spMax += modifier.value
  }
  if(modifier.type === 'attackValue') {
    creature.attackValue += modifier.value
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