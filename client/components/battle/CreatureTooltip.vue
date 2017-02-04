<template>
  <div class="creature-tooltip">
    <div class"cont">
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
        :data="ability">
        <div v-bind:class="{ 'round-box': true, 
                             'tap': ability.exhausts === true }" 
             v-if="ability.cost">
          {{ ability.cost }}
        </div>
        {{ _.isFunction(ability.text) ? ability.text() : ability.text }}
      </div>
      <div class="wrapper">
        <div class="stats">
          <div class="pull-left">
            <div class="hp round-box">{{ data.hp }}</div>
            <div class="energy round-box">{{ data.energy }}</div>
          </div>
          <div v-bind:class="{ 'pull-right': true, atk: true, hp: true }">
            {{ data.attack }}
          </div>
        </div>
      </div>
    </div>    
  </div>
</template>

<script>
import Keyword from './Keyword'

export default {
  components: {
    Keyword,
  },
  props: ['data'],
  computed: {
  },
  methods: {
    click: function (event) {
      if(event.target.className.indexOf('activated') >= 0) { return false; }
      this.$store.dispatch('clickCreature', { creatureId: this.data.id })
    }
  },
}
</script>

<style>

.creature-tooltip {
  position: absolute;
  border: 1px #666 solid;
  z-index: 50;
  .cont {
    position: relative;
    height: 100%;
    .name {
      padding-top: 10px;
      padding-bottom: 10px;
      text-align: center;
      font-weight: lighter;
      font-size: 25px;
    }
    .keywords {
      padding: 0px 0px 10px 10px;
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
    .round-box {
      float: left;
      text-align: center;
      width: 22px;
      height: 20px;
      border-radius: 50%;      
      padding-top: 2px;            
    }
    .energy {
      background-color: #4D96FB;
      color: white;
    }
    .hp {
      background-color: #ec4411;
      color: white;
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
