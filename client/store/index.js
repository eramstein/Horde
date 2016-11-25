import Vue from 'vue'
import Vuex from 'vuex'
import Game from './game'
import cards from '../data/cards'

Vue.use(Vuex)

// SAVE state on close, LOAD on open
// ----------------------------------------------------

const state = {}

window.onbeforeunload = saveState

function saveState() {
  let savedData = setTemplates(_.cloneDeep(state), false)
  localStorage.setItem('hordeSavedGame', JSON.stringify(savedData))
}

function setDefaultState() {
  localStorage.setItem('hordeSavedGame', JSON.stringify({}))
}

function setTemplates(state, add) {
  _.forEach(state.game.battle.heroes.player.cards, (c) => {
    c.template = add ? cards[c.name] : null
  })
  _.forEach(state.game.battle.heroes.opponent.cards, (c) => {
    c.template = add ? cards[c.name] : null
  })
  _.forEach(state.game.battle.creatures, (c) => {
    c.template = add ? cards[c.name] : null
  })
  return state
}


// MUTATIONS
// ----------------------------------------------------

const mutations = {
  SHOWMENU(state, show) {
    state.game.showMenu = show
  },
  RESET: setDefaultState,
  SAVE: saveState,
  LOAD(state) {    
    let savedData = localStorage.getItem('hordeSavedGame')
    savedData = JSON.parse(savedData)
    savedData = setTemplates(savedData, true)
    state.game.battle = savedData.game.battle
  }
}


// ACTIONS
// ----------------------------------------------------

const actions = {
  reset({ commit }) {
    commit('RESET')
  },
  save({ commit }, show) {
    commit('SAVE', show)
  },
  load({ commit }, show) {
    commit('LOAD', show)
    commit('SHOWMENU', false)
  },
  showMenu({ commit }, show) {
    commit('SHOWMENU', show)
  },
}


// MAKE STORE and EXPORT
// ----------------------------------------------------

const store = new Vuex.Store({
  state,
  mutations,
  actions,
  modules: {
    game: Game
  }
})

export default store