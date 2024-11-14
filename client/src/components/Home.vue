<script setup>
   import Tareas from "./Tareas.vue";
   import { useRouter } from 'vue-router';
   import { ref, onMounted, watch } from "vue";
   import Calendar from "./Calendar.vue";
   import axios from 'axios';
   

   const router = useRouter();


   const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

   const participants = ref("");
   const participant = ref("");
   const selectedDate = ref('');
   const selectedWeek = ref('');
   const starsEarned = ref(0);

   

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

  const fetchStarsEarned = async () => {
    if (!participant.value || !selectedWeek.value) return;

    try {
      const response = await axios.get('http://localhost:5000/api/stars-earned', {
        params: { participant: participant.value, week: selectedWeek.value }
      });
      starsEarned.value = response.data.starsEarned;
    } catch (error) {
      console.error('Error fetching stars earned:', error);
    }
  };

   function handleParticipantChange() {
    selectedDate.value = '';
   }

   onMounted(() => {
    fetchParticipants();
  })

  watch(participant, (newParticipant) => {
    if (newParticipant) {
      handleParticipantChange();
      fetchStarsEarned();
    }
  })

const handleTaskUpdate = async () => {
  await fetchStarsEarned();
};

watch([participant, selectedWeek], () => {
  if (participant.value && selectedWeek.value) {
    fetchStarsEarned();
  }
});
</script>

<template>
    <div class="container">
      <h2>¡Hola {{ currentUser.username }}! Vamos a organizar esta semana juntos.</h2>
      <p>
        Participante actual:
        <select v-model="participant">
        <option disabled value="">Por favor selecciona un participante</option>
        <option class="participant" v-for="participant in participants" :key="participant.id">{{participant.Nombre }}</option>
        </select>
      </p>

      <button @click="toParticipants">Participantes</button>

      <div v-if="participant && starsEarned > 0">
        <h3>Estrellas Ganadas Esta Semana</h3>
      <div class="stars-count">
        <span class="star-icon">⭐</span>
        <span class="star-number">{{ starsEarned }}</span>
      </div>
        {{ participant }} ha ganado {{ starsEarned }} estrellas esta semana!
      </div>      
      <Calendar 
        v-model:selectedDate="selectedDate" 
        :participant="participant" 
        v-model:week="selectedWeek"
        :starsEarned="starsEarned"
        @update:selectedDate="selectedDate = $event"/>

      <Tareas 
        :participant="participant" 
        :selectedDate="selectedDate"
        @task-updated="handleTaskUpdate"/>

    </div>
</template>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

h2 {
  margin-bottom: 20px;
  padding: 10px;
}

button {
  width: 100px;
  padding: 0.4em;
  background-color: #61C73F;
  color: white;
  border: none;
  border-radius: 5px;
  margin-top: 20px;
  box-shadow: 2px 4px 2px lightgray;
}

select {
  margin-left: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid #ccc;
}

Tareas {
  width: 100%;
}

Calendar {
  width: 100%;
}

</style>