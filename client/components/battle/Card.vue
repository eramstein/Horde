<template>
  <div
    v-on:click="click"
    v-bind:class="{ card: true, selected: isSelected }"
  >    
    <div class="name">
      {{ data.name }} ({{ data.count }})
    </div>
    <div class="wrapper">
      <div class="mana-cost">{{ data.template.cost }}</div>
      <div class="stats" v-if="data.template.type === 'creature'">
        <div class="hp round-box">{{ data.template.hpMax }}</div>
        <div class="sp round-box">{{ data.template.spMax }}</div>
        <div v-bind:class="{ atk: true, hp: data.template.attackType === 'hp', sp: data.template.attackType === 'sp' }">
          {{ data.template.attackValue }}
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
      return this.$store.getters.selectedCardId === this.data.id
    }
  },
  methods: {
    click: function (event) {
      this.$store.dispatch('clickCard', { cardId: this.data.id })
    }
  }
}
</script>

<style>

.card {
  border-bottom: 1px #ccc solid;
  padding: 5px 5px 5px 15px;
  .name {
    padding-bottom: 5px;
  }  
  .mana-cost {
    float: left;
    color: white;
    width: 22px;
    height: 20px; 
    text-align: center;
    padding-top: 2px;
    background-color: #00026F;
  }
  .stats {
    float: right;
    div {
      float: left;      
      font-weight: bold;
      margin-left: 3px;
    }
    .round-box {      
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
  
</style>
