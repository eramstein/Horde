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
    columnCount: 6,
    rowCount: 5,
    creatures: {},
    graveyard: {},
    heroes: {
      player: {
        name: 'Thundax',
        hp: 20,
        mana: 1,
        manaMax: 1,
        cards: {
          [idPrefix.PLAYER_CARDS + '1']: {
            id: idPrefix.PLAYER_CARDS + '1',
            name: 'Peasant',
            count: 5,
          }, 
          [idPrefix.PLAYER_CARDS + '2']: {
            id: idPrefix.PLAYER_CARDS + '2',
            name: 'Knight of the Rose',
            count: 2,
          }, 
          [idPrefix.PLAYER_CARDS + '3']: {
            id: idPrefix.PLAYER_CARDS + '3',
            name: 'Timz Tower',
            count: 1,
          }, 
          [idPrefix.PLAYER_CARDS + '4']: {
            id: idPrefix.PLAYER_CARDS + '4',
            name: 'Lightining Bolt',
            count: 1,
          }
        }
      },
      opponent: {
        name: 'The Black Knight',
        hp: 20,
        mana: 1,
        manaMax: 1,
        cards: {
          [idPrefix.OPPONENT_CARDS + '1']: {
            id: idPrefix.OPPONENT_CARDS + '1',
            name: 'Peasant',
            count: 5,
          }, 
          [idPrefix.OPPONENT_CARDS + '2']: {
            id: idPrefix.OPPONENT_CARDS + '2',
            name: 'Knight of the Rose',
            count: 2,
          }
        }
      }
    }
  }
  return state
}