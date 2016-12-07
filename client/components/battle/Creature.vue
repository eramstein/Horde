<template>
  <div
    v-on:click="click"
    v-bind:class="{ creature: true, selected: isSelected }"
    v-bind:style="{ left: x + '%', top: y + '%', width: width + '%', height: height + '%' }"
  >
    <div class="cont">
      <div class="name">
        {{ data.name }} 
      </div>
      <div 
        v-bind:class="{ 'ability': true, 'activated': ability.trigger === 'activated', 'active': (key === selectedAbilityId) && isSelected }" 
        v-for="(ability, key) in data.abilities"
        v-on:click="clickAbility({ability, key})"
        :data="ability">
        <span v-if="ability.costValue">
          {{ ability.costValue + ' ' + ability.costType + ':' }}
        </span>
        {{ _.isFunction(ability.text) ? ability.text() : ability.text }}
      </div>
      <div class="wrapper">
        <div class="stats">
          <div class="pull-left">
            <div class="hp round-box">{{ data.hp }}</div>
            <div class="sp round-box">{{ data.sp }}</div>
          </div>
          <div v-bind:class="{ 'pull-right': true, atk: true, hp: data.attackType === 'hp', sp: data.attackType === 'sp' }">
            {{ data.attackValue }}
          </div>
        </div>
      </div>
    </div>    
  </div>
</template>

<script>


export default {
  props: ['data'],
  computed: {
    isSelected: function () {
      return this.$store.getters.selectedCreatureId === this.data.id
    },
    x() {
        return Math.floor( ( (this.data.pos.column - 1) % 3) / (this.$store.getters.columnCount / 2) * 100)
    },
    y() {
        return Math.floor( (this.data.pos.row - 1) / (this.$store.getters.rowCount) * 100)
    },
    width() {
        return Math.floor( 1 / (this.$store.getters.columnCount / 2) * 100)
    },
    height() {
        return Math.floor( 1 / (this.$store.getters.rowCount) * 100)
    },
    selectedAbilityId() {
        return this.$store.getters.selectedAbilityId
    },
    selectedCreatureId() {
        return this.$store.getters.selectedCreatureId
    },
  },
  methods: {
    click: function (event) {
      if(event.target.className.indexOf('activated') >= 0) { return false; }
      this.$store.dispatch('clickCreature', { creatureId: this.data.id })
    },
    clickAbility: function ({ability, key}) {
      if (ability.trigger === 'activated') {
        this.$store.dispatch('clickActivatedAbility', { creatureId: this.data.id, key })
      }      
    }
  },
}
</script>

<style>
.creature {
  transition: top 0.4s, left 0.4s, background-color 0.2s;
  position: absolute;
  border: 1px #666 solid;
  .cont {
    position: relative;
    height: 100%;
    .name {
      padding-top: 10px;
      text-align: center;
      font-weight: lighter;
      font-size: 25px;
    }
    .ability {
      padding: 2px 6px;
    }
    .activated:hover {
      cursor: pointer;
      background-color: #B2E7FF;
    }
    .active {
      background-color: #FED087 !important;
    }
    .stats {
      width: 100%;
      position: absolute;
      bottom: 0;
      right: 0;
      padding-bottom: 5px;
      div {    
        font-weight: bold;
        margin-left: 3px;
      }
      .round-box {
        float: left;
        text-align: center;
        width: 22px;
        height: 20px;
        border-radius: 50%;      
        padding-top: 2px;            
      }
      .sp {
        background-color: #19840c;
        color: white;
      }
      .hp {
        background-color: #ec4411;
        color: white;
      }
      .atk {
        margin-left: 6px;
        margin-right: 5px;
        color: white;
        width: 22px;
        height: 20px; 
        text-align: center;
        padding-top: 2px;     
      }
    } 
  }  
} 
  
</style>
