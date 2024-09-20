<script setup>


</script>

<template>
  <header>
    <h1>Economía de Fichas</h1>
  </header>

  

  <main>
    <!--<TheWelcome /> 
    <Login />-->
    
    <router-view />

  </main>
</template>

<style scoped>
header {
  height: 60px;
  width: 100%;
  background-color: #61C73F;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
}

header h1 {
  color: white;
  padding: 10px;
  font-size: 1em;
  justify-content: center;
}

</style>
