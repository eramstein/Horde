import { idPrefix } from '../config'
import abilities from '../../data/abilities'

export default function (options) {
  let state = {
    ui: {
      selectedCardId: null,
      selectedCreatureId: null,
      selectedAbilityId: null,
    },
    turn: 1,
    currentPlayer: 'player',
    columnCount: 9,
    rowCount: 5,
    creatures: {},
    graveyard: {},
    player: {
      name: 'Thundax',
      mana: 1,
      manaMax: 1,
      hp: 20,
      cards: {
        [idPrefix.PLAYER_CARDS + '1']: {
          id: idPrefix.PLAYER_CARDS + '1',
          name: 'Peasant',
          count: 5,
        },
        [idPrefix.PLAYER_CARDS + '2']: {
          id: idPrefix.PLAYER_CARDS + '2',
          name: 'Lightining Bolt',
          count: 1,
        }
      }
    },
    opponent: {
      name: 'The Black Knight',
      waves: {
        1: [{
          creature: 'Goblin',
          count: 3
        }, {
          creature: 'Wolf',
          count: 4
        }],
        2: null,
        3: [{
          creature: 'The Black Knight',
          count: 1,
          general: true
        }]
      }
    }
  }
  return state
}