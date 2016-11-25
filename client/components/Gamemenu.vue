<template>
  <div class="menu">
    <button @click="$store.dispatch('startBattle')">BATTLE</button>
    <button @click="$store.dispatch('reset')">RESET</button>    
    <button @click="$store.dispatch('save')">SAVE</button>
    <button @click="$store.dispatch('load')">LOAD</button>
    <button @click="$store.dispatch('showMenu', false)">CLOSE</button>
  </div>
</template>

<script>
import store from '../store'

document.onkeypress = function (e) {
    e = e || window.event;
    if(e.keyCode == 109) {
      store.dispatch('showMenu', true)
    }
};

setTimeout(() => {
  store.dispatch('load')
}, 10)

</script>

<style>
  .menu {
    position: absolute;
    top: 50px;
    left: 300px;
  }
</style>
