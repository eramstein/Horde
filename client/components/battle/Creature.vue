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
      <div class="wrapper">
        <div class="stats">
          <div class="pull-left">
            <div class="hp round-box">{{ hp }}</div>
            <div class="sp round-box">{{ sp }}</div>
          </div>
          <div v-bind:class="{ 'pull-right': true, atk: true, hp: data.template.attackType === 'hp', sp: data.template.attackType === 'sp' }">
            {{ data.template.attackValue }}
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
    hp() {
        return this.data.template.hp - this.data.damageHp
    },
    sp() {
        return this.data.template.sp - this.data.damageSp
    },
  },
  methods: {
    click: function (event) {
      this.$store.dispatch('clickCreature', { creatureId: this.data.id })
    }
  },
}
</script>

<style>
.creature {
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
