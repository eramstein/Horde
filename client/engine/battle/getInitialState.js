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
    creatures: {
      'cr-2100': {
        'id': 'cr-2100',
        'name': 'Peasant',
        'damageHp': 0,
        'damageSp': 0,
        'template': {
          'type': 'creature',
          'subtypes': ['human'],
          'cost': 1,
          'hp': 2,
          'sp': 1,
          'attackType': 'hp',
          'attackValue': 1,
          'abilities': [],
          'keywords': {}
        },
        'owner': 'opponent',
        'controller': 'opponent',
        'pos': {
          'row': 3,
          'column': 5
        },
        'hasMoved': 0,
        'hasAttacked': 0,
        'summonedOnTurn': 2
      },
      'cr-2101': {
        'id': 'cr-2101',
        'name': 'Knight of the Rose',
        'damageHp': 0,
        'damageSp': 0,
        'template': {
          'type': 'creature',
          'subtypes': ['human', 'soldier'],
          'cost': 2,
          'hp': 3,
          'sp': 1,
          'attackType': 'hp',
          'attackValue': 1,
          'abilities': [],
          'keywords': {
            'extraMoves': 1,
            'haste': true
          }
        },
        'owner': 'opponent',
        'controller': 'opponent',
        'pos': {
          'row': 4,
          'column': 5
        },
        'hasMoved': 0,
        'hasAttacked': 0,
        'summonedOnTurn': 2
      },
      'cr-3000': {
        'id': 'cr-3000',
        'name': 'Wall',
        'damageHp': 0,
        'damageSp': 0,
        'template': {
          'type': 'creature',
          'subtypes': ['structure'],
          'cost': 2,
          'hp': 3,
          'sp': 1,
          'attackType': 'hp',
          'attackValue': 1,
          'abilities': [],
          'keywords': {
            'static': true
          }
        },
        'owner': 'opponent',
        'controller': 'opponent',
        'pos': {
          'row': 3,
          'column': 6
        },
        'hasMoved': 0,
        'hasAttacked': 0,
        'summonedOnTurn': 2
      },
    },
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
        mana: 10,
        manaMax: 10,
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