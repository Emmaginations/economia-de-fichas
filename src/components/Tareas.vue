<script setup>
  import { ref, watch, onMounted } from "vue"; // Ensure `ref` is imported from Vue
  import { getFirestore, collection, query, where, getDocs } from "firebase/firestore"; // Correct imports from Firebase
  import { firebaseApp } from "@/main"; // Import your Firebase app
  
  const props = defineProps({
    participant: String,
  });

  const db = getFirestore(firebaseApp); // Initialize Firestore with your app
  const tareas = ref([]);

  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

  async function fetchTareas() {
    try {
        const tareasCollection = collection (db, 'Tareas');
        const q = query(
            tareasCollection,
            where("Usario", "==", currentUser.username), 
            where("Participante", "==", props.participant)
        );
        const querySnapshot = await getDocs(q);
        tareas.value = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
  }

  onMounted(() => {
    fetchTareas();
  })

  watch(() => props.participant, () => {
    fetchTareas(); // Re-fetch tasks whenever participant changes
  });

</script>

<template>

<h3>Tareas</h3>
<div id="task-block">
    <div class="task" v-for="tarea in tareas" :key="tarea.id">
      <p>{{ tarea.Nombre }}</p>
      <p>Cumplido: {{ tarea.Cumplido }}</p>
    </div>
</div>

</template>

<style>

#task-block {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
}

.task {
    border-top: 1px solid black;
    border-bottom: 1px solid black;
    width: 90%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 50px;
    align-items: center;
}

.task p {
    justify-content: center;
}

h3 {
    margin-top: 40px;
}


</style>