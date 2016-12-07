import { isCellOccupied } from './battlefield'
import { summon } from './creature'
import { playSpellOnCreature } from './spell'
import { addMana } from './hero'

export const playCard = function(state, { cardId, target, targetType, hero }) {

  const card = state.heroes[hero].cards[cardId]

  if(card.count <=  0) { console.log('ERROR: trying to play card with count <=0'); return false; }
  if(state.heroes[hero].mana <  card.template.cost) { console.log('ERROR: trying to play card without enough mana'); return false; }

  if (card.template.type === 'creature' && targetType === 'cell') {
    if (!isCellOccupied(state, target)) {      
      summon(state, {
        creatureName: card.name,        
        hero,
        cell: target
      })
    } else {
      console.log('ERROR: trying to play a creature on an occupied cell'); return false;
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

}

export const decrementCard = function(state, { cardId, hero }) {
  state.heroes[hero].cards[cardId].count--
  if(state.heroes[hero].cards[cardId].count <= 0) {
    delete state.heroes[hero].cards[cardId]
  }
}