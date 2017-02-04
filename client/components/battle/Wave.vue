<template>
  <div class="wave">
    <div v-for="creature in data" :data="data" class="wave-creature">
      {{ creature.creature }} ({{ creature.count }})
    </div>
    <div v-if="!data">
      -
    </div>
  </div>  
</template>

<script>
export default {
  props: ['data'],
}
</script>

<style>
.wave {
    padding: 15px 0px;
    text-align: center;
    border: 1px #ccc solid;
    margin: 0px 20px 10px 0px;
    background-color: #f1f1f1;

    .wave-creature {
      padding: 2px 0px;
    }
}
</style>
