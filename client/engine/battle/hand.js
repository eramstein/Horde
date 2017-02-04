import { summon, canSummonHere } from './creature'
import { playSpellOnCreature } from './spell'
import { addMana } from './hero'

export const playCard = function(state, { cardId, target, targetType }) {

  const card = state.player.cards[cardId]

  if (card.count <=  0) { return false }
  if (state.player.mana <  card.template.cost) { return false }

  if (card.template.type === 'creature' && targetType === 'cell') {
    if (canSummonHere(state, { cardId, target })) {      
      summon(state, {
        creatureName: card.name,        
        hero: 'player',
        cell: target
      })
    } else {
      return false
    }
  }

  if (card.template.type === 'spell' && card.template.targetType === 'creature' && targetType === 'creature') {
    playSpellOnCreature(state, { 
      spellId: cardId, 
      targetCreatureId : target
    })
  }

  addMana(state, {
    count: -card.template.cost,
  })
  decrementCard(state, {
    cardId,
  })

  return true

}

export const decrementCard = function(state, { cardId }) {
  state.player.cards[cardId].count--
  if(state.player.cards[cardId].count <= 0) {
    delete state.player.cards[cardId]
  }
}