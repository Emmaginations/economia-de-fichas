<script setup>
  import AddParticipants from './AddParticipants.vue';
  import { ref, onMounted } from "vue"; // Ensure `ref` is imported from Vue
  import { getFirestore, collection, query, where, getDocs } from "firebase/firestore"; // Correct imports from Firebase
  import { firebaseApp } from "@/main"; // Import your Firebase app

  const db = getFirestore(firebaseApp); // Initialize Firestore with your app
  const participants = ref([]);
  const add = ref(false);

  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

  async function fetchParticipants() {
    try {
        const participantsCollection = collection (db, 'LoginInfo');
        const q = query(participantsCollection, where("Tutor", "==", currentUser.username));
        const querySnapshot = await getDocs(q);
        participants.value = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    } catch (error) {
        console.error('Error fetching participants:', error);
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
<h1>Participants</h1>


<AddParticipants @participant-added="resetState" v-if="add"/>

<button v-if="!add" @click="addParticipants">Add Participants</button>
<div id="participant-block">
    <div class="task" v-for="participant in participants" :key="participant.id">
      <p>{{ participant.Nombre }}</p>
    </div>
</div>

</template>