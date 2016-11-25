<template>
  <div>
    <battle v-if="isBattle"></battle>
    <campaign v-if="isCampaign"></campaign>
    <gamemenu v-if="menuOn"></menu>
  </div>  
</template>

<script>
import Battle from '../components/battle/Battle'
import Campaign from '../components/campaign/Campaign'
import Gamemenu from '../components/Gamemenu'

export default {
  components: {
    Battle,
    Campaign,
    Gamemenu,
  },
  computed: {
    isBattle() {
      return this.$store.state.game && this.$store.state.game.phase === 'battle'
    },
    isCampaign() {
      return this.$store.state.game && this.$store.state.game.phase === 'campaign'
    },
    menuOn() {
      return this.$store.state.game && this.$store.state.game.showMenu
    }
  }
}
</script>
