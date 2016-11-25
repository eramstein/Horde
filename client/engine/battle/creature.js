import { idPrefix } from '../config'
import { isCellOccupied } from './battlefield'
import cards from '../../data/cards'

export const getCurrentState = function (state, creatureId) {
  const creature = state.creatures[creatureId]
  return {
    id:  creature.id,
    name:  creature.name,
    hasAttacked: creature.hasAttacked,
    hasMoved: creature.hasMoved, 
    damageHp:  creature.damageHp,
    damageSp:  creature.damageSp,
    controller:  creature.controller,
    owner:  creature.owner,
    pos:  creature.pos,
    summonedOnTurn:  creature.summonedOnTurn,
    abilities: creature.template.abilities,
    attackType: creature.template.attackType,
    attackValue: creature.template.attackValue,
    cost: creature.template.cost,
    hp: creature.template.hp,
    keywords: creature.template.keywords,
    sp: creature.template.sp,
    subtypes: creature.template.subtypes,
    type: creature.template.type,
  }
}


export const summon = function (state, { creatureName, hero , cell }) {
  const id = idPrefix.CREATURES + (_.keys(state.creatures).length + _.keys(state.graveyard).length)
  const template = _.cloneDeep(cards[creatureName])
  const creatures = _.cloneDeep(state.creatures)
  creatures[id] = {
    id,
    name: creatureName,
    template,
    owner: hero,
    controller: hero,
    pos: cell,
    hasMoved: 0,
    hasAttacked: 0,
    damageHp: 0,
    damageSp: 0,
    summonedOnTurn: state.turn
  }
  state.creatures = creatures
}

export const destroy = function (state, { creatureId }) { 
  state.graveyard[creatureId] = state.creatures[creatureId]
  delete state.creatures[creatureId]
}

export const move = function (state, { creatureId, cell }) {
  const creatures = _.cloneDeep(state.creatures)
  const creatureState = getCurrentState(state, creatureId)

  // is the move invalid ?

  const cellOccupied = isCellOccupied(state, cell)

  const staticCreature = creatureState.keywords.static

  const wrongColumn = creatureState.controller === 'player' && cell.column > state.columnCount / 2
    || creatureState.controller === 'opponent' && cell.column <= state.columnCount / 2

  const exhausted = creatureState.hasMoved && !creatureState.keywords.extraMoves
    || creatureState.keywords.extraMoves && creatureState.hasMoved > creatureState.keywords.extraMoves
    || creatureState.hasAttacked && !creatureState.keywords.attackAndMove

  const summoningSickness = 
    creatureState.summonedOnTurn === state.turn && !creatureState.keywords.haste

  if (cellOccupied) { console.log('ERROR: trying to move a creature to occupied cell'); return false; }
  if (staticCreature) { console.log('ERROR: trying to move a static creature'); return false; }
  if (wrongColumn) { console.log('ERROR: trying to move to opponents board'); return false; }
  if (exhausted) { console.log('ERROR: trying to move an exhausted creature'); return false; }
  if (summoningSickness) { console.log('ERROR: trying to move a summon sick creature'); return false; }
  
  // if move valid, do it

  creatures[creatureId].hasMoved++
  creatures[creatureId].pos = cell
  state.creatures = creatures
}