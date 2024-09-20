<script setup>
   import Tareas from "./Tareas.vue";
   import { useRouter } from 'vue-router';

   const router = useRouter();


   const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

   async function participants() {
        router.push({ name: 'Participants' });
   }
</script>

<template>
    <div class="container">
      <h2>¡Hola {{ currentUser.username }}! Vamos a organizar esta semana juntos.</h2>
      <button @click="participants">Participantes</button>
      
      <Tareas />

    </div>
</template>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

h2 {
  margin: 0 auto;
}



</style>