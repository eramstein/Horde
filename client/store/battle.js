import { playCard } from '../engine/battle/hand'
import { move as moveCreature } from '../engine/battle/creature'
import { passTurn } from '../engine/battle/turn'

// MUTATIONS
// ----------------------------------------------------

const mutations = {
  PLAY_CARD: playCard,
  MOVE_CREATURE: moveCreature,
  PASS_TURN: passTurn,
  SELECT_CARD(state, { cardId }) {    
    state.ui.selectedCardId = state.ui.selectedCardId === cardId ? null : cardId
    state.ui.selectedCreatureId = null
  },
  SELECT_CREATURE(state, { creatureId }) {
    state.ui.selectedCreatureId = state.ui.selectedCreatureId === creatureId ? null : creatureId
    state.ui.selectedCardId = null
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

  clickCreature({ commit }, { creatureId }) {
    commit('SELECT_CREATURE', { creatureId })
  },

  clickTurnButton({ commit }) {
    commit('PASS_TURN')
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
