<template>
  <div class="keyword" v-if="shortLabel">
   {{ shortLabel + valueLabel}}
  </div>  
</template>

<script>

const labels = {
  attackAndMove: { label: 'Swift' },
  airdrop: { hide: true }
}

export default {
  props: ['data'],
  computed: {
    valueLabel: function () {
      if (this.data.keyword === true) {
        return ''
      } else {
        return this.data.keyword        
      }      
    },
    keyLabel: function () {
      return labels[this.data.key] && labels[this.data.key].label || _.capitalize(this.data.key)
    },
    shortLabel: function () {
      return !(labels[this.data.key] && labels[this.data.key].hide) && this.data.key.charAt(0).toUpperCase()
    },
  }
}
</script>

<style>
.keyword {
  float: left;
  padding: 1px 2px;
  font-size: 12px;
}
</style>
