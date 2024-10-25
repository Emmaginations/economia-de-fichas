<script setup>
  import { ref } from "vue";
 import axios from 'axios';

   const props = defineProps({
    participant: String,
   });

   const emit = defineEmits();

   const objective = ref("");
   const observations = ref("");
   const error = ref(null);


   async function addTask() {
    if (objective.value === "") {
        error.value = "Por favor entra un objetivo";
        return;
    }
    
    try {
        // Prepare the task data
        const taskData = {
            Nombre: objective.value,
            Participante: participant,
            Usario: currentUser.username,
        };

        // Send a POST request to the backend API to add the task
        const response = await axios.post('http://localhost:5000/api/addtarea', taskData);

        // Check the response to see if the task was added successfully
        if (response.data.success) {
            emit("tarea-added"); // Emit the event only if the request was successful
        } else {
            error.value = response.data.error || "Error al agregar la tarea";
        }
    }catch (err) {
        error.value = "Error al agregar la tarea: " + (err.response?.data?.error || err.message);
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