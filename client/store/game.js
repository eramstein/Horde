import Battle from './battle'
import getInitialBattleState from '../engine/battle/getInitialState'

// MUTATIONS
// ----------------------------------------------------

const mutations = {
  START_BATTLE(state, options) {
    state.phase = 'battle'
    state.battle = getInitialBattleState(options)
  },
}


// ACTIONS
// ----------------------------------------------------

const actions = {
  startBattle({ commit }, options) {
    commit('START_BATTLE', options)
  },
}

export default {
  state: {
    phase: 'battle',
    showMenu: true,
  },
  mutations,
  actions,
  modules: {
    battle: Battle
  }
}
