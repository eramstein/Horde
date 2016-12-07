<template>
  <div class="game-container">
    <div class="column player">      
      <Hero :data="player"></Hero>
      <Card v-for="card in player.cards" :data="card"></Card>
    </div>
    <div class="column battlefield">
      <div class="column cells-container cells-hero">
        <Cell v-for="cell in playerCells" :data="cell"></Cell>
        <Creature v-for="creature in playerCreatures" :data="creature" :key="creature.id"></Creature>
      </div>
      <div class="column cells-container cells-center">     
        
      </div>
      <div class="column cells-container cells-hero">     
        <Cell v-for="cell in opponentCells" :data="cell"></Cell>
        <Creature v-for="creature in opponentCreatures" :data="creature" :key="creature.id"></Creature>
      </div>      
    </div>
    <div class="column opponent">
      <Hero :data="opponent"></Hero>
      <Card v-for="card in opponent.cards" :data="card"></Card>      
      <button class="pass-turn" v-on:click="clickTurnButton">Pass Turn</button>       
    </div>    
  </div>
</template>

<script>
import Cell from './Cell'
import Card from './Card'
import Creature from './Creature'
import Hero from './Hero'

export default {
  components: {
    Cell,
    Card,
    Creature,
    Hero,
  },
  computed: {
    playerCells() {
        return this.$store.getters.playerCells
    },
    opponentCells() {
        return this.$store.getters.opponentCells
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
    opponent() {
        let opponent = this.$store.getters.opponent
        opponent.isOpponent = true
        return opponent
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
  background-color: #E0FCFF;
}

.game-container {
  width: 100vw;

  .column {
    float: left;
    height: 100vh;
  }
  .player, .opponent {
    width: 10%;
    background-color: #eeeeee;
  }
  .player {
    margin-right: 1%;
    border-right: 1px solid #ccc;
  }
  .opponent {
    float: right;
    border-left: 1px solid #ccc;
  }
  .battlefield {
    width: 78%;    
    border-left: 1px solid #ccc;
  }
  .cells-container {
    position: relative;
  }
  .cells-hero {
    width: 45%;
  }
  .cells-center {
    width: 9%;
    border-right: 1px solid #ccc;
  }
  .pass-turn {
    position: absolute;
    bottom: 30px;
    width: 145px;
    right: 10px;
    font-size: 20px;
    font-weight: bold;
  }
}    
</style>
