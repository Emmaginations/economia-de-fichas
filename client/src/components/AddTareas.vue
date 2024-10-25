<script setup>
  import { ref } from "vue";
  import { getFirestore, collection, addDoc } from "firebase/firestore"; // Correct imports from Firebase
  import { firebaseApp } from "@/main"; // Import your Firebase app

   const props = defineProps({
    participant: String,
   });

   const emit = defineEmits();

   const db = getFirestore(firebaseApp); // Initialize Firestore with your app
   const tareasCollection = collection (db, 'Tareas');

   const objective = ref("");
   const observations = ref("");
   const error = ref(null);


   async function addTask() {
    if (objective.value == "") {
        error.value = "Por favor entra un objetivo";
    } else {
        await addDoc(tareasCollection, {
            Cumplido: false,
            Nombre: objective.value,
            Participante: participant,
            Usario: currentUser.username,
        });

        emit("tarea-added");
    }
   }
</script>

<template>
<div id="add-tasks">

<h2>Agregar Tarea</h2>
    <div class="inputs">
        <h3>Objetivo</h3>
        <input v-model="objective" placeholder="Entra el objetivo de la tarea" />
    </div>
    <div class="inputs">
        <h3>Observaciones</h3>
        <input v-model="observations"  placeholder="Entra las observaciones para la tarea" />
    </div>

    <div class="inputs">
        <input type="checkbox" v-model="checked"/>
        <h3>Asignar a mas participantes</h3>
    </div>

    <button @click="addTask">Agregar</button>
    <p v-if="error" style="color: red">{{ error }}</p>
</div>
</template>