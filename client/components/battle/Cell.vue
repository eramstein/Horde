<template>
  <div class="cell" 
    v-bind:style="{ left: x + '%', top: y + '%', width: width + '%', height: height + '%' }"
    v-on:click="click"
  >
    
  </div>
</template>

<script>


export default {
  props: ['data'],
  computed: {
    x() {
        return Math.floor( ( (this.data.column - 1) % 3) / (this.$store.getters.columnCount / 2) * 100)
    },
    y() {
        return Math.floor( (this.data.row - 1) / (this.$store.getters.rowCount) * 100)
    },
    width() {
        return Math.floor( 1 / (this.$store.getters.columnCount / 2) * 100)
    },
    height() {
        return Math.floor( 1 / (this.$store.getters.rowCount) * 100)
    },
  },
  methods: {
    click: function (event) {
      const { row, column } = this.data;
      this.$store.dispatch('clickCell', { row, column })
    }
  }
}
</script>

<style>
  .cell {
    position: absolute;
    border-right: 1px #ccc solid;
    border-bottom: 1px #ccc solid;
  }
</style>
