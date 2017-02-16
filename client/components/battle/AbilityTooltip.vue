<template>
  <div class="ability-tooltip" 
    v-if="ability.text"
    v-on:click="click">
    <div class="ability-text">    
      {{ ability.text }}
      <span class="ability-activate" v-if="!ability.targetType && ability.trigger==='activated'">    
        Click to activate
      </span>
    </div>    
  </div>  
</template>

<script>
export default {
  computed: {
    ability: function () {
      const id = this.$store.getters.selectedAbilityId
      const creature = this.$store.getters.selectedCreatureId

      if (!creature || id === null) { return {} }

      return this.$store.getters.creatures[creature].abilities[id]
    },
  },
  methods: {
    click: function (event) {
      this.$store.dispatch('clickAbilityTooltip')
    }
  }
}
</script>

<style>
.ability-tooltip {
  padding: 12px 0px;
  text-align: center;
  font-size: 16px;
  background-color: antiquewhite;
}
.ability-activate {
  font-weight: bold;
  color: darkred;
}
</style>
