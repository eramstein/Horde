import { listener } from './listener'
import cards from '../../data/cards'
import { idPrefix } from '../config'
import { isCellOccupied } from './battlefield'


export const getCurrentState = function (state, creatureId) {
  const creature = state.creatures[creatureId]

  let hp = creature.template.hp
  let sp = creature.template.sp
  let attackValue = creature.template.attackValue
  let keywords = creature.template.keywords
  let abilities = creature.template.abilities

  _.forEach(creature.modifiers, (m) => {
    if(m.type === 'hp') {
      hp += m.value
    }
    if(m.type === 'sp') {
      sp += m.value
    }
    if(m.type === 'attackValue') {
      attackValue += m.value
    }
    if(m.type === 'keyword') {
      let currentVal = keywords[m.value.keyword]
      if (currentVal) {
        if (_.isNumber(currentVal)) {
          currentVal =  currentVal + (m.value.val || 0)
        } else {
          currentVal = m.value.val
        }
      } else {
        keywords[m.value.keyword] = m.value.val || true
      }
    }
  })

  return {    
    hp,
    sp,
    attackValue,
    abilities,
    keywords,
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
    modifiers: creature.modifiers,    
    attackType: creature.template.attackType,    
    cost: creature.template.cost,           
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
    modifiers: [],
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

  // triggers
  listener(state, { trigger: 'creatureMoved', args: { creatureId, to: cell } })
}


export const addModifier = function (state, { creatureId, modifier }) {
  state.creatures[creatureId].modifiers.push(modifier)
}