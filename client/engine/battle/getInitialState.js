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
    creatures: {
      'cr-2100': {
        'id': 'cr-2100',
        'name': 'Peasant',        
        'hp': 2,
        'sp': 1,
        'attackValue': 1,
        'attackType': 'hp',
        'type': 'creature',
        'subtypes': ['human'],
        'cost': 1,
        'hpMax': 3,
        'spMax': 1,
        'owner': 'opponent',
        'controller': 'opponent',
        'pos': {
          'row': 3,
          'column': 5
        },
        'exhausted': false,
        'keywords': {},
        'hasMoved': 0,
        'hasAttacked': 0,
        'summonedOnTurn': 2,
        'modifiers': [],
        'abilities': [],
      },
      'cr-2101': {
        'id': 'cr-2101',
        'name': 'Wall of Pikes',        
        'hp': 9,
        'sp': 3,
        'attackValue': 0,
        'attackType': 'sp',
        'type': 'creature',
        'subtypes': ['structure'],
        'cost': 1,
        'hpMax': 9,
        'spMax': 3,
        'owner': 'opponent',
        'controller': 'opponent',
        'pos': {
          'row': 2,
          'column': 5
        },
        'exhausted': false,
        'keywords': { static: true, pacific: true },
        'hasMoved': 0,
        'hasAttacked': 0,
        'summonedOnTurn': 2,
        'modifiers': [],
        'abilities': [ abilities.retaliation({ damageType: 'sp', damageValue: 5 }) ],
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
            name: 'Timz Tower',
            count: 1,
          }, 
          [idPrefix.PLAYER_CARDS + '4']: {
            id: idPrefix.PLAYER_CARDS + '4',
            name: 'Lightining Bolt',
            count: 10,
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