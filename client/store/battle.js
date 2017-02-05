import aiWorker from 'worker?name=ai!../engine/battle/ai/worker'

import { playCard } from '../engine/battle/hand'
import { move as moveCreature } from '../engine/battle/creature'
import { attackCreature } from '../engine/battle/combat'
import { targetCreature as abilityTargetCreature } from '../engine/battle/abilities'
import { startTurn } from '../engine/battle/turn'
import { setBattleTemplates } from './templates'

const AI = new aiWorker

// MUTATIONS
// ----------------------------------------------------

const mutations = {
  PLAY_CARD: playCard,
  MOVE_CREATURE: moveCreature,
  ATTACK_CREATURE: attackCreature,
  START_TURN: startTurn,
  AA_TARGET_CREATURE: abilityTargetCreature,
  SELECT_CARD(state, { cardId }) {
    state.ui.selectedCardId = state.ui.selectedCardId === cardId ? null : cardId
    state.ui.selectedCreatureId = null
    state.ui.selectedAbilityId = null
  },
  SELECT_ABILITY(state, { creatureId, key }) {
    state.ui.selectedAbilityId = key
  },
  SELECT_CREATURE(state, { creatureId }) {
    state.ui.selectedCreatureId = state.ui.selectedCreatureId === creatureId ? null : creatureId
    state.ui.selectedCardId = null
    state.ui.selectedAbilityId = null
  },
  APPLY_AI_ACTIONS(state, newState) {
    // state = newState doesn't work (vuex doesn't work with changing root state)
    _.forOwn(newState, function(value, key) {
      state[key] = value
    })    
  },
  UNSELECT(state) {
    state.ui.selectedCreatureId = null
    state.ui.selectedCardId = null
    state.ui.selectedAbilityId = null
  },
}


// ACTIONS
// ----------------------------------------------------

const actions = {

  clickCell({ commit, state }, { row, column }) {
    const selectedCardId = state.ui.selectedCardId
    const selectedCreatureId = state.ui.selectedCreatureId
    const selectedCard = selectedCardId && state.player.cards[selectedCardId]
    // if a player's card was selected, play it on the target cell
    if (selectedCard &&
        (selectedCard.template.type === 'creature' || selectedCard.template.targetType === 'cell')
      ) {
      commit('PLAY_CARD', {
        cardId: selectedCardId,
        target: { row, column },
        targetType: 'cell',
        hero: 'player',
      })
      commit('UNSELECT')
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
    const selectedAbilityId = state.ui.selectedAbilityId
    const selectedAbility = selectedCreatureId && selectedAbilityId !== null ? 
      state.creatures[selectedCreatureId].abilities[selectedAbilityId]
      : null;
    const selectedCardId = state.ui.selectedCardId
    const selectedCard = selectedCardId && selectedCardId !== null ? 
      state.player.cards[selectedCardId]
      : null;

    // if an activated activity was selected and it targets creatures
    if (selectedAbility &&
      selectedAbility.targetType === 'creature') {
      commit('AA_TARGET_CREATURE', { 
        selectedCreatureId, 
        selectedAbilityId, 
        targetCreatureId: creatureId 
      })
      commit('UNSELECT')
    }
    // if a spell was selected and it targets creatures
    else if (selectedCard &&
      selectedCard.template.type === 'spell' &&
      selectedCard.template.targetType === 'creature') {      
      commit('PLAY_CARD', { 
        cardId: selectedCardId, 
        target: creatureId, 
        targetType: 'creature',
        hero: 'player',
      })
      commit('UNSELECT')
    }
    // if a player's creature was selected, and the target is an opponent's creature, attack it
    else if (state.creatures[selectedCreatureId] && 
      state.creatures[selectedCreatureId].controller === 'player' && 
      state.creatures[creatureId].controller === 'opponent') {
      commit('ATTACK_CREATURE', { 
        attackerCreatureId: selectedCreatureId, 
        targetCreatureId: creatureId 
      })
      commit('UNSELECT')
    }    
    else {
    // else, select it
      commit('SELECT_CREATURE', { creatureId })
    }
  },

  clickAbility({ commit, state }, { creatureId, key }) {
    commit('SELECT_CREATURE', { creatureId })
    commit('SELECT_ABILITY', { key })
  },

  clickTurnButton({ commit, state }) {
    if (state.currentPlayer === 'player') {
      // pass turn to AI
      commit('START_TURN', { hero: 'opponent' })
      AI.postMessage(JSON.parse(JSON.stringify(state)))
      // when AI is done
      AI.onmessage = function(e) {
        const aiStateSequence = e.data
        // update state action by action
        _.forEach(aiStateSequence, (newState, i) => {
          newState = setBattleTemplates(newState, true)
          setTimeout(() => {
            commit('APPLY_AI_ACTIONS', newState)
          }, i * 1000)        
        })      
        // back to player
        setTimeout(() => {
            commit('START_TURN', { hero: 'player' })
        }, (aiStateSequence.length) * 1000)     
      }
    } else {
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
  playerCreatures: (state) => {
    return _.filter(state.creatures, c => c.controller === 'player')
  },
  opponentCreatures: (state) => {
    return _.filter(state.creatures, c => c.controller === 'opponent')
  },
  creatures: state => state.creatures,
  waves: state => state.opponent.waves,
  columnCount: state => state.columnCount,
  rowCount: state => state.rowCount,
  player: state => state.player,
  opponent: state => state.opponent,
  currentPlayer: state => state.currentPlayer,
  selectedCardId: state => state.ui.selectedCardId,
  selectedCreatureId: state => state.ui.selectedCreatureId,
  selectedAbilityId: state => state.ui.selectedAbilityId,
  attackAnimation: state => state.ui.attackAnimation,
  turn: state => state.turn,
}

export default {
  state: {
    ui: {
      selectedCardId: null,
      selectedCreatureId: null,
      selectedAbilityId: null,
    },
    turn: 0,
    currentPlayer: '',
    columnCount: 0,
    rowCount: 0,
    creatures: {},
    player: {
      name: '',
      mana: 0,
      manaMax: 0,
      hp: 20,
      cards: {}
    },
    opponent: {
      name: '',
      waves: {}
    },
  },
  mutations,
  actions,
  getters,
}
