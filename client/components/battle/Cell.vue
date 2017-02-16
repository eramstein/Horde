<template>
  <div v-bind:class="{ cell: true, highlighted: highlighted }" 
    v-bind:style="{ left: x + 'px', 
                    top: y + 'px', 
                    width: width + 'px', 
                    height: height + 'px',
                  }"
    v-on:click="click"
    v-on:mouseover="mouseover"
    v-on:mouseout="mouseout"
  >
    <div class="cell-tip">{{ text }}</div>
  </div>
</template>

<script>
import { canMove, canSummonHere } from '../../engine/battle/creature'

export default {
  props: ['data', 'boardLayout'],
  data: function () {
    return {
      text: null
    }
  },
  computed: {
    x() {
      return (this.data.column - 1) * this.boardLayout.cellSize + this.boardLayout.leftShift
    },
    y() {
      return (this.data.row - 1) * this.boardLayout.cellSize
    },
    width() {
      return this.boardLayout.cellSize - 1 // -1 to collapse borders
    },
    height() {
      return this.boardLayout.cellSize - 1
    },
    highlighted() {
      return this.$store.getters.reachableCells 
        && this.$store.getters.reachableCells[this.data.column + '-' + this.data.row]
    }
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

      const canPlay = 
        card &&
        (
        card.template.type === 'spell' && 
        card.template.targetType === 'cell' 
          || 
        card.template.type === 'creature' && 
        canSummonHere(this.$store.state.game.battle, { cardId, target: this.data })
        )

      if (canPlay) {
        this.text = card.name
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
    background-color: white;
    position: absolute;
    border: 1px #ccc solid;
    .cell-tip {
      pointer-events: none; /* this prevents Cell mouse over triggers on hover the tip */
      text-align: center;
      font-size: 20px;
      font-weight: bold;
      color: #999;
      position: relative;      
      top: 50%;
      transform: translateY(-50%);   
    }
  }
  .cell.highlighted {
    background-color: #fbead2;
  }
</style>
