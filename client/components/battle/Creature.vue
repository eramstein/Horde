<template>
  <div
    v-bind:id="data.id"
    v-on:click="click"
    v-bind:class="{ creature: true, selected: isSelected }"
    v-bind:style="{ left: x + 'px', 
                    top: y + 'px', 
                    width: width + 'px', 
                    height: height + 'px',
                    borderColor: data.controller === 'opponent' ? '#d20505' : '#333',
                  }"
  >
    <div v-bind:class="{ cont: true, exhausted: cannotDoAnything }">
      <div v-if="isSummoningSick" class="sleeping">
        zzz
      </div>
      <div class="energy round-box"
        v-bind:style="{ left: (width/2 - 10) + 'px' }"
      >{{ data.energy }}</div>      
      <div class="name">
        {{ data.name }} 
      </div>
      <div class="wrapper keywords">
        <Keyword v-for="(keyword, key) in data.keywords" :data="{ key, keyword }"></Keyword>
      </div>
      <div 
        v-bind:class="{ 'ability': true, 
                        'activated': ability.trigger === 'activated', 
                        'active': (key === selectedAbilityId) && isSelected }" 
        v-for="(ability, key) in data.abilities"
        v-on:click="clickAbility({ability, key})"
        :data="ability">        
        <div v-bind:class="{ 'ability-button': true,
                             'energy': true, 
                             'tap': ability.exhausts === true }" 
             v-if="ability.cost">
          {{ ability.cost }}
        </div>
        <div v-else class="ability-button">
          P
        </div>
      </div>
      <div class="hp round-box">{{ data.hp }}</div>
      <div class="atk round-box">
        {{ data.attack }}
      </div>
    </div>    
  </div>
</template>

<script>
import { canMove } from '../../engine/battle/creature'
import { canAttack } from '../../engine/battle/combat'
import Keyword from './Keyword'

export default {
  components: {
    Keyword,
  },
  props: ['data', 'boardLayout'],
  computed: {
    isSelected: function () {
      return this.$store.getters.selectedCreatureId === this.data.id
    },
    x() {
      return (this.data.pos.column - 1) * this.boardLayout.cellSize + this.boardLayout.leftShift
    },
    y() {
      return (this.data.pos.row - 1) * this.boardLayout.cellSize
    },
    width() {
      return this.boardLayout.cellSize - 1
    },
    height() {
      return this.boardLayout.cellSize - 1
    },
    selectedAbilityId() {
      return this.$store.getters.selectedAbilityId
    },
    selectedCreatureId() {
      return this.$store.getters.selectedCreatureId
    },
    attackAnimation() {
      return this.$store.getters.attackAnimation
    },
    isSummoningSick() {
      return this.data.summonedOnTurn === this.$store.getters.turn && !this.data.keywords.haste
    },
    cannotDoAnything() {
      const state = this.$store.state.game.battle
      if (
        this.data.controller === this.$store.getters.currentPlayer &&
        (this.data.exhausted
          || this.isSummoningSick
          || canMove(state, {creatureId: this.data.id }) === false
            && canAttack(state, {attackerCreatureId: this.data.id }) === false
            && _.filter(this.data.abilities, a => 
                a.trigger === 'activated' && this.data.energy > a.cost
              ).length === 0
        )
      ) {
        return true
      } else {
        return false
      }
    },
  },
  methods: {
    click: function (event) {
      if(event.target.className.indexOf('ability-button') >= 0) { return false; }
      this.$store.dispatch('clickCreature', { creatureId: this.data.id })
    },
    clickAbility: function ({ability, key}) {
      this.$store.dispatch('clickAbility', { creatureId: this.data.id, key })
    }
  },
  watch: {
    'data.hp': function(newValue, oldValue) {
      const el = document.getElementById(this.data.id)
      const color = newValue > oldValue ? '#8AE08A' : '#ED7855'
      el.style.backgroundColor = color
      setTimeout( () => {
        el.style.backgroundColor = null
      }, 450)

    },
    'data.energy': function(newValue, oldValue) {
      const el = document.getElementById(this.data.id)
      const color = newValue > oldValue ? '#8AE08A' : '#8DBDFF'
      el.style.backgroundColor = color
      setTimeout( () => {
        el.style.backgroundColor = null
      }, 450)

    },
    attackAnimation: function(newValue, oldValue) {
      const newAttacker = newValue && newValue.attackerCreatureId || null
      const previousAttacker = oldValue && oldValue.attackerCreatureId || null
      if (newAttacker && newAttacker === this.data.id && newAttacker !== previousAttacker) {
        const el = document.getElementById(this.data.id)
        const oldPos = { x: this.x, y: this.y }
        let diffPos = { x: 0, y: 0 }
        const attackerCreature = this.$store.getters.creatures[newValue.attackerCreatureId]
        const attackerCreaturePos = attackerCreature.pos
        const attackerCreatureController = attackerCreature.controller
                
        if (newValue.targetCreaturePos) {
          diffPos = { 
            x: newValue.targetCreaturePos.column - attackerCreaturePos.column,
            y: newValue.targetCreaturePos.row - attackerCreaturePos.row,
          }
        } else {
          if (newValue.defender === 'player') {
            diffPos = { 
              x: 0 - attackerCreaturePos.column,
              y: 0,
            }
          } else {
            diffPos = { 
              x: this.$store.getters.columnCount - attackerCreaturePos.column,
              y: 0,
            }
          }
        }

        const colSize = 100 / this.$store.getters.columnCount
        el.style.left = (oldPos.x + (diffPos.x * colSize)) + 'px'
        el.style.top = (oldPos.y + (diffPos.y * colSize)) + 'px'

        setTimeout( () => {
          el.style.left = oldPos.x + 'px'
          el.style.top = oldPos.y + 'px'
        }, 450)

      }
    }
  }
}
</script>

<style>

/* these transitions are added by transition-group in Battle.vue */
.player-creatures-enter {
  left: -50% !important;
}

.player-creatures-leave-active {
  left: -200% !important;
}

.opponent-creatures-enter {
  left: 150% !important;
}

.opponent-creatures-leave-active {
  left: 300% !important;
}

.creature {
  transition: top 0.4s, left 0.4s, background-color 0.2s;
  position: absolute;
  border: 1px #666 solid;
  z-index: 50;
  .exhausted {
    color: #ddd;
  }
  .cont {
    position: relative;
    height: 100%;
    .name {
      padding-top: 10px;
      padding-bottom: 10px;
      text-align: center;
      font-weight: lighter;
      font-size: 16px;
    }
    .sleeping {
      position: absolute;
      top: 0px;
      right: 5px;
      color: #4D96FB;
    }
    .ability {
      padding: 2px 6px;
      .round-box {
        margin-right: 5px;
      }
      .tap {
        border: 2px #222 solid;
      }
    }
    .activated:hover {
      cursor: pointer;
      background-color: #ddd;
    }
    .active {
      background-color: antiquewhite !important;
    }
    .round-box {
      text-align: center;
      width: 19px;
      height: 16px;
      border-radius: 50%;      
      padding-top: 2px;
      border-width: 1px;
      border-style: solid;           
    }
    .energy {
      border-color: #4D96FB;
      color: #333;
      position: absolute;
      bottom: 2px;
      font-size: 13px;
    }
    .hp {
      border-color: #ec4411;
      color: #333;
      position: absolute;
      bottom: 2px;
      left: 2px;
      font-size: 13px;
    }
    .atk {
      border-color: #ec4411;
      color: #333;
      position: absolute;
      bottom: 2px;
      right: 2px;
      font-size: 13px;
    }
  }  
}

.creature:hover {
  background-color: #f3f3f3;
}
  
</style>
