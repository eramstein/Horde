import { isCellOccupied } from './battlefield'
import { summon } from './creature'
import { addMana } from './hero'

export const playCard = function(state, { cardId, target, targetType }) {

  const card = state.heroes.player.cards[cardId]

  if(card.count <=  0) { console.log('ERROR: trying to play card with count <=0'); return false; }
  if(state.heroes.player.mana <  card.template.cost) { console.log('ERROR: trying to play card without enough mana'); return false; }

  if (card.template.type === 'creature' && targetType === 'cell') {
    if (!isCellOccupied(state, target)) {
      addMana(state, {
        count: -card.template.cost,
        hero: 'player'
      })
      decrementCard(state, {
        cardId,
        hero: 'player'
      })
      summon(state, {
        creatureName: card.name,        
        hero: 'player',
        cell: target
      })
    } else {
      console.log('ERROR: trying to play a creature on an occupied cell')
    }
  }
}

export const decrementCard = function(state, { cardId, hero }) {
  state.heroes[hero].cards[cardId].count--
  if(state.heroes[hero].cards[cardId].count <= 0) {
    delete state.heroes[hero].cards[cardId]
  }
}