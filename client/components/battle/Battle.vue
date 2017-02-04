'<template>
  <div class="game-container">    
    <div id="top">
      <AbilityTooltip></AbilityTooltip>
    </div>
    <div id="middle">
      <div class="column player-column">
        <Hero :data="player"></Hero>
        <Card v-for="card in player.cards" :data="card"></Card>
      </div>
      <div class="column" id="battlefield">
        <Cell v-for="cell in cells" :data="cell" :boardLayout="boardLayout"></Cell>
        <transition-group name="player-creatures" tag="div">
          <Creature v-for="creature in playerCreatures" :data="creature" :key="creature.id" :boardLayout="boardLayout"></Creature>
        </transition-group>
        <transition-group name="opponent-creatures" tag="div">
          <Creature v-for="creature in opponentCreatures" :data="creature" :key="creature.id" :boardLayout="boardLayout"></Creature>
        </transition-group>
      </div>
      <div class="column opponent-column">
        <Wave v-for="wave in waves" :data="wave"></Wave>
      </div>
    </div>
    <div id="bottom"></div>
    <button class="pass-turn"
        v-bind:disabled="currentPlayer === 'opponent' && 1==0"
        v-on:click="clickTurnButton"
        v-bind:class="{ disabled: currentPlayer === 'opponent' }">
        Pass Turn
    </button>     
  </div>
</template>

<script>
import Cell from './Cell'
import Card from './Card'
import Creature from './Creature'
import Hero from './Hero'
import Wave from './Wave'
import AbilityTooltip from './AbilityTooltip'

export default {
  components: {
    Cell,
    Card,
    Creature,
    Hero,
    Wave,
    AbilityTooltip,
  },
  computed: {
    cells() {
        return this.$store.getters.cells
    },
    boardLayout() {
      //cells are square. size depends on the battlefield w/h ratio vs column/rows ratio
      const btWidth = document.getElementById('battlefield').offsetWidth
      const btHeight = document.getElementById('battlefield').offsetHeight
      const pixelPerColumn = btWidth / this.$store.getters.columnCount
      const pixelPerRow = btHeight / this.$store.getters.rowCount
      const cellSize = Math.round(Math.min(pixelPerColumn, pixelPerRow))
      return {
        cellSize,
        leftShift: Math.max(0, (btWidth - this.$store.getters.columnCount * cellSize) / 2)
      }
    },
    creatures() {
        return this.$store.getters.creatures
    },
    playerCreatures() {
        return this.$store.getters.playerCreatures
    },
    opponentCreatures() {
        return this.$store.getters.opponentCreatures
    },
    player() {
        return this.$store.getters.player
    },
    waves() {
        return this.$store.getters.waves
    },
    currentPlayer() {
        return this.$store.getters.currentPlayer
    },
  },
  methods: {
    clickTurnButton: function (event) {
      this.$store.dispatch('clickTurnButton')
    }
  }
}
</script>

<style>

.selected {
  box-shadow: 3px 3px 2px rgba(136, 136, 136, 0.57);
}

.game-container {
  width: 100vw;
  height: 100vh;

  #top, #bottom {
    height: 10%;
  }

  #middle {
    height: 80%;
  }

  .column {
    float: left;
    height: 100%;    
  }

  .player-column {
    width: 18%;
    padding-right: 2%;
  }

  .opponent-column {
    width: 18%;
    padding-left: 2%;
  }

  .active-player {
    background-color: #DEDEDE !important;
  }
  .player, .opponent {
    width: 10%;
    background-color: #eeeeee;
    z-index: 100;
    position: relative;
  }
  #battlefield {
    width: 60%;
    height: 100%;
    text-align: center;
    position: relative;
  }
  .pass-turn {
    position: absolute;
    bottom: 30px;
    width: 145px;
    right: 10px;
    font-size: 20px;
    font-weight: bold;
  }
  .disabled {
    color: #666;
  }
}    
</style>
