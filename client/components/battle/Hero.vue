<template>
  <div class="hero">
    <div class="wrapper">
      <div class="hp"> <div>{{ data.hp }}</div> </div>
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
  },
}
</script>

<style>
.hero {
  position: absolute;
  top: 10px;
  left: 110px;
  .hp {
    color: white;
    float: left;
    font-weight: bold;
    background-color: #ec4411;
    border-radius: 50%;
    width: 35px;
    height: 27px;
    padding: 5px 0px;
    text-align: center;

    div {
      margin-top: 4px;
      font-size: 16px;
    }
  }
  .mana {
    float: right;
    margin-left: 20px;
    font-size: 20px;
    margin-top: 4px;
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
    padding: 2px 3px 0px 3px;
    background-color: #00026F;
    margin-right: 6px;
  }
  .mana-inactive {
    color: #aaa;
    font-weight: bold;
    height: 24px; 
    padding-top: 2px;
  }
}
</style>
