<template>
  <div class="ability-tooltip" v-if="ability.text">
    <div class="ability-text">    
      {{ ability.text }}
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
</style>
