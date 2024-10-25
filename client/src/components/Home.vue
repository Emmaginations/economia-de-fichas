<script setup>
   import Tareas from "./Tareas.vue";
   import { useRouter } from 'vue-router';
   import { ref, onMounted } from "vue";
   import Calendar from "./Calendar.vue";
   import axios from 'axios';

   const router = useRouter();


   const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

   const participants = ref("");
   const participant = ref("");
   
   async function toParticipants() {
        router.push({ name: 'Participants' });
   }

   async function fetchParticipants() {
    try {
      const response = await axios.get('http://localhost:5000/api/participants', {
        params: { tutor: currentUser.username }
      });

    // Check if the response indicates success
      if (response.data.success) {
        participants.value = response.data.participants;
      } else {
        console.error('Failed to fetch participants:', response.data.error);
      }
    } catch (error) {
        console.error('Error fetching participants:', error);
    }
   }

   onMounted(() => {
    fetchParticipants();
  })

</script>

<template>
    <div class="container">
      <h2>¡Hola {{ currentUser.username }}! Vamos a organizar esta semana juntos.</h2>
      <Calendar :participant="participant" />
      <button @click="toParticipants">Participantes</button>
      <select v-model="participant">
        <option disabled value="">Por favor selecciona un participante</option>
        <option class="participant" v-for="participant in participants" :key="participant.id">{{participant.Nombre }}</option>
      </select>
      
      <Tareas :participant="participant"/>

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