<script setup>
  import Tareas_participant from "./Tareas_participant.vue";
  import { ref, onMounted } from "vue";
  import axios from 'axios';

   
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));


  const currentDate = new Date();
  const starsEarned = ref(0);
  

  const getStartOfWeek = (date) => {
    const day = date.getDay();
    const diff = (day === 0 ? -6 : 1) - day; // Calculate the difference to reach Monday (adjust -6 for Sunday start)
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() + diff);
    return startOfWeek.toISOString().split('T')[0];
  };

  const week = getStartOfWeek(currentDate);

  const fetchStarsEarned = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/stars-earned', {
        params: { participant: currentUser.username, week: week }
      });
      starsEarned.value = response.data.starsEarned;
    } catch (error) {
      console.error('Error fetching stars earned:', error);
    }
  };

  onMounted(() => {
    fetchStarsEarned();
  })


</script>

<template>
    <div class="container">
      <h2>¡Hola {{ currentUser.username }}! ¡Vamos a ganar estrellas!</h2>
      <h3>Esta semana ya tienes {{ starsEarned }} estrellas.</h3>
      
      <Tareas_participant />

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