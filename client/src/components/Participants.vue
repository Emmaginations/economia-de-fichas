<script setup>
  import AddParticipants from './AddParticipants.vue';
  import { ref, onMounted } from "vue"; // Ensure `ref` is imported from Vue
  import axios from 'axios';

  const participants = ref([]);
  const add = ref(false);

  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

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

<button v-if="!add" @click="addParticipants">Add Participants</button>
 <div id="participant-block">
    <div class="task" v-for="participant in participants" :key="participant.id">
      <p>{{ participant.Nombre }}</p>
    </div>
</div>
</div>

</template>