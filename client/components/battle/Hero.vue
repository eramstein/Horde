<template>
  <div class="hero">
    <div class="name">    
      {{ data.name }}
    </div>
    <div class="wrapper">
      <div class="hp"> {{ data.hp }} </div>
      <div class="mana"> 
        <div class="mana-active">{{ data.mana }}</div>
        <div class="mana-inactive"> / {{ data.manaMax }}</div> 
      </div>
    </div>
  </div>  
</template>

<script>


export default {
  props: ['data'],
  computed: {
  }
}
</script>

<style>
.hero {
  min-height: 105px;
  padding-bottom: 20px;
  border-bottom: 1px #ccc solid;
  .hp {
    color: white;
    float: left;
    margin-left: 20px;
    font-weight: bold;
    background-color: #ec4411;
    border-radius: 50%;
    width: 25px;
    height: 17px;
    padding: 5px 0px;
    text-align: center;
  }
  .mana {
    float: right;
    padding-right: 20px;
    font-size: 20px;
    div {
      float: left;
    }
  }
  .mana-active {
    font-weight: bold;
    color: white;
    width: 22px;
    height: 24px; 
    text-align: center;
    padding-top: 2px;
    background-color: #00026F;
    margin-right: 6px;
  }
  .mana-inactive {
    color: #aaa;
    font-weight: bold;
    height: 24px; 
    padding-top: 2px;
  }
  .name {
    text-align: center;
    font-weight: lighter;
    font-size: 25px;
    padding: 10px 0px;
  }
}
</style>
