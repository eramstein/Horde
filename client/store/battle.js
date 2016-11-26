import aiWorker from 'worker?name=ai!../engine/battle/ai/worker'

import { playCard } from '../engine/battle/hand'
import { move as moveCreature } from '../engine/battle/creature'
import { attackCreature, attackOpponent } from '../engine/battle/combat'
import { startTurn } from '../engine/battle/turn'
import { setBattleTemplates } from './templates'

const AI = new aiWorker

// MUTATIONS
// ----------------------------------------------------

const mutations = {
  PLAY_CARD: playCard,
  MOVE_CREATURE: moveCreature,
  ATTACK_CREATURE: attackCreature,
  ATTACK_OPPONENT: attackOpponent,
  START_TURN: startTurn,
  SELECT_CARD(state, { cardId }) {    
    state.ui.selectedCardId = state.ui.selectedCardId === cardId ? null : cardId
    state.ui.selectedCreatureId = null
  },
  SELECT_CREATURE(state, { creatureId }) {
    state.ui.selectedCreatureId = state.ui.selectedCreatureId === creatureId ? null : creatureId
    state.ui.selectedCardId = null
  },
  APPLY_AI_ACTIONS(state, newState) {
    // state = newState doesn't work (vuex doesn't work with changing root state)
    _.forOwn(newState, function(value, key) {
      state[key] = value
    })
  },
}


// ACTIONS
// ----------------------------------------------------

const actions = {

  clickCell({ commit, state }, { row, column }) {
    const selectedCardId = state.ui.selectedCardId
    const selectedCreatureId = state.ui.selectedCreatureId
    // if a player's card was selected, play it on the target cell
    if (selectedCardId && state.heroes.player.cards[selectedCardId]) {
      commit('PLAY_CARD', {
        cardId: selectedCardId,
        target: { row, column },
        targetType: 'cell',
      })
    }
    // if a player's creature was selected, move it to the target cell
    if (selectedCreatureId && state.creatures[selectedCreatureId].controller === 'player') {
      commit('MOVE_CREATURE', {
        creatureId: selectedCreatureId,
        cell: { row, column },
      })
    }
  },

  clickCard({ commit }, { cardId }) {
    commit('SELECT_CARD', { cardId })
  },

  clickCreature({ commit, state }, { creatureId }) {
    const selectedCreatureId = state.ui.selectedCreatureId
    // if a player's card was selected, and the target is an opponent's creature, attack it
    if (state.creatures[selectedCreatureId] && 
        state.creatures[selectedCreatureId].controller === 'player' && 
        state.creatures[creatureId].controller === 'opponent') {
      commit('ATTACK_CREATURE', { attackerCreatureId: selectedCreatureId, targetCreatureId: creatureId })
    } else {
    // else, select it
      commit('SELECT_CREATURE', { creatureId })
    }    
  },

  clickOpponent({ commit, state }) {
    const selectedCreatureId = state.ui.selectedCreatureId
    if (state.creatures[selectedCreatureId] && 
        state.creatures[selectedCreatureId].controller === 'player') {
      commit('ATTACK_OPPONENT', { attackerCreatureId: selectedCreatureId })
    }
  },

  clickTurnButton({ commit, state }) {
    // pass turn to AI
    commit('START_TURN', { hero: 'opponent' })
    AI.postMessage(JSON.parse(JSON.stringify(state)))
    // when AI is done
    AI.onmessage = function(e) {
      let newState = setBattleTemplates(e.data, true)
      commit('APPLY_AI_ACTIONS', newState)
      // back to player
      commit('START_TURN', { hero: 'player' })
    }    
  },
}

// GETTERS
// ----------------------------------------------------

const getters = {
  cells: (state) => {
    let cells = []
    for (let i = 1; i <= state.rowCount; i++) {
      for (let j = 1; j <= state.columnCount; j++) {
        cells.push({ row: i, column: j })
      }
    }
    return cells
  },
  playerCells: (state, getters) => {
    return getters.cells.filter(c => c.column <= state.columnCount / 2)
  },
  opponentCells: (state, getters) => {
    return getters.cells.filter(c => c.column > state.columnCount / 2)
  },
  playerCreatures: (state) => {
    return _.filter(state.creatures, c => c.controller === 'player')
  },
  opponentCreatures: (state) => {
    return _.filter(state.creatures, c => c.controller === 'opponent')
  },
  columnCount: state => state.columnCount,
  rowCount: state => state.rowCount,
  player: state => state.heroes.player,
  opponent: state => state.heroes.opponent,
  selectedCardId: state => state.ui.selectedCardId,
  selectedCreatureId: state => state.ui.selectedCreatureId,
}

export default {
  state: {
    ui: {
      selectedCardId: null,
      selectedCreatureId: null,
    },
    turn: 0,
    currentPlayer: '',
    columnCount: 0,
    rowCount: 0,
    creatures: {},
    heroes: {
      player: {
        name: '',
        hp: 0,
        mana: 0,
        manaMax: 0,
        cards: {}
      },
      opponent: {
        name: '',
        hp: 0,
        mana: 0,
        manaMax: 0,
        cards: {}
      },
    },
  },
  mutations,
  actions,
  getters,
}
