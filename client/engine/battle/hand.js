import { isCellOccupied } from './battlefield'
import { summon } from './creature'
import { playSpellOnCreature } from './spell'
import { addMana } from './hero'

export const playCard = function(state, { cardId, target, targetType, hero }) {

  const card = state.heroes[hero].cards[cardId]

  if(card.count <=  0) { return false; }
  if(state.heroes[hero].mana <  card.template.cost) { return false; }

  if (card.template.type === 'creature' && targetType === 'cell') {
    if (!isCellOccupied(state, target)) {      
      summon(state, {
        creatureName: card.name,        
        hero,
        cell: target
      })
    } else {
      return false;
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
    hero,
  })
  decrementCard(state, {
    cardId,
    hero,
  })

  return true

}

export const decrementCard = function(state, { cardId, hero }) {
  state.heroes[hero].cards[cardId].count--
  if(state.heroes[hero].cards[cardId].count <= 0) {
    delete state.heroes[hero].cards[cardId]
  }
}