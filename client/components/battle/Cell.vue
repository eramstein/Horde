<template>
  <div class="cell" 
    v-bind:style="{ left: x + '%', top: y + '%', width: width + '%', height: height + '%' }"
    v-on:click="click"
    v-on:mouseover="mouseover"
    v-on:mouseout="mouseout"
  >
    <div class="cell-tip">{{ text }}</div>
  </div>
</template>

<script>
import { canMove } from '../../engine/battle/creature'

export default {
  props: ['data'],
  data: function () {
    return {
      text: null
    }
  },
  computed: {
    x() {
        return Math.floor( ( (this.data.column - 1) % 3) / (this.$store.getters.columnCount / 2) * 100)
    },
    y() {
        return Math.floor( (this.data.row - 1) / (this.$store.getters.rowCount) * 100)
    },
    width() {
        return Math.floor( 1 / (this.$store.getters.columnCount / 2) * 100)
    },
    height() {
        return Math.floor( 1 / (this.$store.getters.rowCount) * 100)
    },
  },
  methods: {
    click: function (event) {
      const { row, column } = this.data;
      this.$store.dispatch('clickCell', { row, column })
      this.text = null
    },
    mouseover: function (event) {
      const cards = this.$store.getters.player.cards
      const cardId = this.$store.getters.selectedCardId
      const card = cards[cardId]
      const creatures = this.$store.getters.creatures
      const creatureId = this.$store.getters.selectedCreatureId
      const creature = creatures[creatureId]

      const canPlay = 
        cardId &&
        (card.template.type === 'spell' && card.template.targetType === 'cell' || card.template.type === 'creature')
          ||
        creatureId &&
        (creature.controller === 'player' && this.data.column <= this.$store.getters.columnCount / 2) &&
        canMove(this.$store.state.game.battle, { creatureId })

      if (canPlay) {
        if (cardId) {
          this.text = card.name
        }
        if (creatureId) {
          this.text = 'move'
        }
      }      
    },
    mouseout: function (event) {
      this.text = null
    },
  }
}
</script>

<style>
  .cell {
    position: absolute;
    border-right: 1px #ccc solid;
    border-bottom: 1px #ccc solid;
    .cell-tip {
      text-align: center;
      font-size: 20px;
      font-weight: bold;
      color: #999;
      position: relative;      
      top: 50%;
      transform: translateY(-50%);   
    }
  }
</style>
