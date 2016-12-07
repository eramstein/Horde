import { canMove, move } from '../creature'
import { canAttack, validAttackTargets, attackCreature, attackOpponent } from '../combat'
import { getFreeCells } from '../battlefield'
import { playCard } from '../hand'

export const executeRandomActions = function(state) {

  let tempState = _.cloneDeep(state)
  let actions = []

  // play cards by decreasing cost
  let cards = _.sortBy(tempState.heroes.opponent.cards, 
    [function(c) { return c.template.cost }]
  )
  _.forEach(cards, c => playCardFromHand(tempState, c) )

  // use creatures
  let creatures = _.filter(tempState.creatures, c => c.controller === 'opponent')
  creatures = _.shuffle(creatures)
  _.forEach(creatures, c => useCreature(tempState, c.id) )

  return {
    actions,
    tempState,
  }
}

const playCardFromHand = function (state, card) {
  if (card.template.type === 'creature') {
    const freeCells = getFreeCells(state, { side: 'opponent' })
    const cell = _.sample(freeCells)
    playCard (state, { cardId: card.id, target: cell, targetType: 'cell', hero: 'opponent' })
  }
}

const useCreature = function (state, creatureId) {
  const creatureCanMove = canMove(state, { creatureId })
  const creatureCanAttack = canAttack(state, { attackerCreatureId: creatureId })
  let creatureAttackTargets = null
  if (creatureCanAttack) {
    creatureAttackTargets = validAttackTargets(state, { attackerCreatureId: creatureId })
  }

  if (creatureCanAttack && creatureAttackTargets.hero) {
    attackOpponent(state, { attackerCreatureId: creatureId })
  } else if (creatureCanAttack && creatureAttackTargets.creatures.length > 0) {
    attackCreature(state, { attackerCreatureId: creatureId, targetCreatureId: creatureAttackTargets.creatures[0].id })
  } else if (creatureCanMove) {
    moveCreature(state, creatureId)
  }  
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