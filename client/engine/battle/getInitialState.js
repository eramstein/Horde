import { idPrefix } from '../config'
import abilities from '../../data/abilities'

export default function (options) {
  let state = {
    ui: {
      selectedCardId: null,
      selectedCreatureId: null,
      selectedAbilityId: null,
      reachableCells: null,
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
          name: 'Thirsty Dwarf',
          count: 10,
        },
        [idPrefix.PLAYER_CARDS + '2']: {
          id: idPrefix.PLAYER_CARDS + '2',
          name: 'Lightining Bolt',
          count: 1000,
        },
        [idPrefix.PLAYER_CARDS + '3']: {
          id: idPrefix.PLAYER_CARDS + '3',
          name: 'Knight of the Rose',
          count: 10,
        },
        [idPrefix.PLAYER_CARDS + '4']: {
          id: idPrefix.PLAYER_CARDS + '4',
          name: 'Dwarven Inn',
          count: 10,
        },
        [idPrefix.PLAYER_CARDS + '5']: {
          id: idPrefix.PLAYER_CARDS + '5',
          name: 'Bzzzt',
          count: 1000,
        }
      }
    },
    opponent: {
      name: 'The Black Knight',
      waves: {
        1: [{
          creature: 'Wolf',
          count: 1
        }, {
          creature: 'Goblin',
          count: 2
        }],
        2: [{
          creature: 'Wolf',
          count: 3
        }],
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