import { canMove, move } from '../creature'
import { canAttack, validAttackTargets, attackCreature, attackOpponent } from '../combat'
import { getFreeCells } from '../battlefield'
import { playCard } from '../hand'

export const executeRandomActions = function(state) {

  let tempState = _.cloneDeep(state)
  let stateSequence = []

  // play cards by decreasing cost
  let cards = _.sortBy(tempState.heroes.opponent.cards, 
    [function(c) { return c.template.cost }]
  )
  _.forEach(cards, c => {    
    const cardWasPlayed = playCardFromHand(tempState, c)
    if (cardWasPlayed) {
      stateSequence.push(_.cloneDeep(tempState))
    }    
  })

  // use creatures
  let creatures = _.filter(tempState.creatures, c => c.controller === 'opponent')
  creatures = _.shuffle(creatures)
  _.forEach(creatures, c => {
    const action = useCreature(tempState, c.id)
    if (action) {
      if (action.indexOf('attack') < 0) {
        tempState.ui.attackAnimation = null
      }
      stateSequence.push(_.cloneDeep(tempState))
    }    
  })

  return stateSequence
}

const playCardFromHand = function (state, card) {
  let cardWasPlayed = false
  if (card.template.type === 'creature') {
    const freeCells = getFreeCells(state, { side: 'opponent' })
    const cell = _.sample(freeCells)
    cardWasPlayed = playCard (state, { cardId: card.id, target: cell, targetType: 'cell', hero: 'opponent' })
  }
  return cardWasPlayed
}

const useCreature = function (state, creatureId) {

  const hints = state.creatures[creatureId].hints || []

  let propensityToAttackHero = 3
  let propensityToAttackCreature = 3
  let propensityToMove = 1

  _.forEach(hints, (h) => {
    if (h.type === 'attack') {
      propensityToAttackHero += h.propensity
      propensityToAttackCreature += h.propensity
    } else if (h.type === 'move') {
      propensityToMove += h.propensity
    }
  })

  const creatureCanMove = canMove(state, { creatureId })
  const creatureCanAttack = canAttack(state, { attackerCreatureId: creatureId })
  let creatureAttackTargets = null
  if (creatureCanAttack) {
    creatureAttackTargets = validAttackTargets(state, { attackerCreatureId: creatureId })
  }

  if (!(creatureCanAttack && creatureAttackTargets.hero)) {
    propensityToAttackHero = 0
  }

  if (!(creatureCanAttack && creatureAttackTargets.creatures.length > 0)) {
    propensityToAttackCreature = 0
  }

  if (!creatureCanMove) {
    propensityToMove = 0
  }

  const random = _.random(1, propensityToAttackHero + propensityToAttackCreature + propensityToMove)
  let action

  if (random <= propensityToAttackHero) {
    action = 'attackOpponent'
    attackOpponent(state, { attackerCreatureId: creatureId })
  } else if (random <= propensityToAttackHero + propensityToAttackCreature) {
    action = 'attackCreature'
    attackCreature(state, { attackerCreatureId: creatureId, targetCreatureId: creatureAttackTargets.creatures[0].id })
  } else if (propensityToMove > 0) {
    action = 'move'
    moveCreature(state, creatureId)
  }

  return action
}

const moveCreature = function (state, creatureId) {

  const freeCells = getFreeCells(state, { side: 'opponent' })  
  const cell = _.sample(freeCells)

  move(state, { creatureId, cell, skipChecks: true })

  return {
    type: 'moveCreature',
    cell,
    creatureId,
  }

}