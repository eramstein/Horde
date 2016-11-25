import { idPrefix } from '../config'
import { isCellOccupied } from './battlefield'
import cards from '../../data/cards'

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
  delete state.creatures[creatureId]
}

export const move = function (state, { creatureId, cell }) {
  const creatures = _.cloneDeep(state.creatures)
  const creature = creatures[creatureId]

  // is the move invalid ?

  const cellOccupied = isCellOccupied(state, cell)

  const staticCreature = creature.template.keywords.static

  const wrongColumn = creature.template.keywords.static

  const exhausted = creature.hasMoved && !creature.template.keywords.extraMoves
    || creature.template.keywords.extraMoves && creature.hasMoved > creature.template.keywords.extraMoves
    || creature.hasAttacked && !creature.template.keywords.attackAndMove

  const summoningSickness = 
    creature.summonedOnTurn === state.turn && !creature.template.keywords.haste

  if (cellOccupied) { console.log('ERROR: trying to move a creature to occupied cell'); return false; }
  if (staticCreature) { console.log('ERROR: trying to move a static creature'); return false; }
  if (wrongColumn) { console.log('ERROR: trying to move to opponents board'); return false; }
  if (exhausted) { console.log('ERROR: trying to move an exhausted creature'); return false; }
  if (summoningSickness) { console.log('ERROR: trying to move a summon sick creature'); return false; }
  
  // if move valid, do it

  creature.hasMoved++
  creature.pos = cell
  state.creatures = creatures
}