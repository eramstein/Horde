import { idPrefix } from '../config'

export default function (options) {
  let state = {
    ui: {
      selectedCardId: null,
      selectedCreatureId: null,
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
        mana: 10,
        manaMax: 10,
        cards: {
          [idPrefix.PLAYER_CARDS + '1']: {
            id: idPrefix.PLAYER_CARDS + '1',
            name: 'Peasant',
            count: 2,
          }, 
          [idPrefix.PLAYER_CARDS + '2']: {
            id: idPrefix.PLAYER_CARDS + '2',
            name: 'Knight of the Rose',
            count: 1,
          }, 
          [idPrefix.PLAYER_CARDS + '3']: {
            id: idPrefix.PLAYER_CARDS + '3',
            name: 'Wall',
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
            count: 2,
          }, 
          [idPrefix.OPPONENT_CARDS + '2']: {
            id: idPrefix.OPPONENT_CARDS + '2',
            name: 'Knight of the Rose',
            count: 1,
          }
        }
      }
    }
  }
  return state
}