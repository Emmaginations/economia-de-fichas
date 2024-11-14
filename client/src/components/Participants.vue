<script setup>
  import AddParticipants from './AddParticipants.vue';
  import { ref, onMounted } from "vue"; // Ensure `ref` is imported from Vue
  import { useRouter } from 'vue-router';
  import axios from 'axios';

  const participants = ref([]);
  const add = ref(false);

  const router = useRouter();

  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

  async function toHome() {
        router.push({ name: 'Home' });
   }

  async function fetchParticipants() {
  try {
    // Make a GET request to the backend API endpoint for fetching participants
    const response = await axios.get('http://localhost:5000/api/participantslist', {
      params: { tutor: currentUser.username }
    });

    // Handle the response data
    if (response.data.success) {
      participants.value = response.data.participants;
    } else {
      console.error('Error fetching participants:', response.data.error);
    }
  } catch (error) {
    console.error('Error fetching participants:', error.message);
  }
}

  onMounted(() => {
    fetchParticipants();
  })

  async function addParticipants() {
    add.value = true;
  }

  function resetState() {
    add.value = false;
    fetchParticipants();
  }

</script>

<template>
<div>
  <h1>Participants</h1>

<AddParticipants @participant-added="resetState" v-if="add"/>
<button @click="toHome">Página Principal</button>
<button v-if="!add" @click="addParticipants">Agregar Participantes</button>
 <div id="participant-block">
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Manera de Contacto</th>
          <th>Contraseña</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="participant in participants" :key="participant.id">
          <td>{{ participant.Nombre }}</td>
          <td>{{ participant.Contacto }}</td>
          <td>{{ participant.Contraseña }}</td>
        </tr>
      </tbody>
    </table> 
    </div>
</div>

</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  margin-top: 10px;
}

th, td {
  border-top: 1px solid black;
  border-bottom: 1px solid black;
  padding: 8px;
  text-align: left;
  background-color: #f2f2f2;
}

th {
  background-color: #4C8AB9;
  color: white;
}

button {
  margin-right: 10px;
}

</style>