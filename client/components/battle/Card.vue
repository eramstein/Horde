<template>
  <div
    v-on:click="click"
    v-bind:class="{ card: true, selected: isSelected }"
  >    
    <div class="name">
      {{ data.name }} ({{ data.count }})
    </div>
    <div class="mana-cost">{{ data.template.cost }}</div>
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
  border: 1px #ccc solid;
  padding: 10px 20px;
  margin: 0px 0px 10px 20px;
  text-align: center;
  position: relative;

  .name {
    padding-bottom: 5px;
  }  
  .mana-cost {
    position: absolute;
    left: 15px;
    top: 8px;
    color: white;
    width: 22px;
    height: 20px; 
    text-align: center;
    padding-top: 2px;
    background-color: #00026F;
  }
}

.card:hover {
  background-color: #f3f3f3;
}
  
</style>
