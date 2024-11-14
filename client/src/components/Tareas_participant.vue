<script setup>
import { ref, onMounted } from "vue";
import axios from 'axios';

const tareas = ref([]);

const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));


function getCurrentDate() {
  const today = new Date();
  return today.toISOString().split('T')[0]; // This will return "YYYY-MM-DD"
}

async function fetchTareas() {
  try {
    const response = await axios.get('http://localhost:5000/api/tareasp', {
      params: {
        participante: currentUser.username,
        fecha: getCurrentDate(),
      }
    });

    if (response.data.success) {
      tareas.value = response.data.tareas;
    } else {
      console.error('Failed to fetch tasks:', response.data.error);
    }
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
}

onMounted(() => {
  fetchTareas();
});

</script>

<template>
  <div id="tareasp">
    <h2>Tareas para hoy:</h2>

    <div id="task-block">
      <div class="task" v-for="tarea in tareas" :key="tarea.id">
        <div class="task-info">
          <p>{{ tarea.Nombre }}</p>
        </div>
    </div>
    </div>
  </div>
</template>

<style>

#tareasp {
  align-items: center;
  width: 90%;
  display: flex;
  flex-direction: column;
}

#task-block {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
}

#task-block h3 {
  display: flex;
  justify-content: center;
  font-size: 1.1em;
  margin-bottom: 5px;
}

.task {
    border-top: 1px solid black;
    border-bottom: 1px solid black;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 50px;
    align-items: center;
    background-color: rgb(241, 241, 241);
    padding: 10px;
}

.task p {
  display: flex;  
  justify-content: center;
}

h3 {
    margin-top: 40px;
    display: flex;
}

.heading {
  font-weight: bold;
  display: flex;
  justify-content: center;
}

</style>