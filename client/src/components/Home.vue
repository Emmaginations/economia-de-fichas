<script setup>
   import Tareas from "./Tareas.vue";
   import { useRouter } from 'vue-router';
   import { ref, onMounted } from "vue";
   import { getFirestore, collection, query, where, getDocs } from "firebase/firestore"; // Correct imports from Firebase
   import { firebaseApp } from "@/main"; 

   const db = getFirestore(firebaseApp); // Initialize Firestore with your app
   const loginCollection = collection(db, "LoginInfo"); // Reference to the Firestore collection


   const router = useRouter();


   const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

   const participants = ref("");
   const participant = ref("");

   async function toParticipants() {
        router.push({ name: 'Participants' });
   }

   async function fetchParticipants() {
    try {
        const q = query(loginCollection, where("Tutor", "==", currentUser.username));
        const querySnapshot = await getDocs(q);
        participants.value = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
   }

   onMounted(() => {
    fetchParticipants();
  })

</script>

<template>
    <div class="container">
      <h2>¡Hola {{ currentUser.username }}! Vamos a organizar esta semana juntos.</h2>
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