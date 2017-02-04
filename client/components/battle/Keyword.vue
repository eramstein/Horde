<template>
  <div class="keyword">
    <div class="key">    
      {{ keyLabel }}
    </div>
    <div class="value">    
      {{ valueLabel }}
    </div>
  </div>  
</template>

<script>

const labels = {
  attackAndMove: 'Swift',
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
      return labels[this.data.key] || _.capitalize(this.data.key)
    },
  }
}
</script>

<style>
.keyword {
  float: left;
  padding: 10px 20px 10px 10px;
  div {
    float: left;
  }
}
</style>
