<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style>
body {
  background-color: #fafafa;
  margin: 0;
  overflow: hidden;
  font-size: 14px;
  font-family: helvetica, 'helvetica neue',
               Ubuntu,
               'segoe ui', arial,
               sans-serif;
}

.wrapper:after {
  clear: both;
  content: '';
  display: block;
}

</style>
