<script setup>
  import { ref, watch, onMounted } from "vue"; // Ensure `ref` is imported from Vue
  import AddTareas from './AddTareas.vue';
  import axios from 'axios';

  const props = defineProps({
    participant: String,
  });

  const tareas = ref([]);
  const add = ref(false);

  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

  async function fetchTareas() {
    try {
      const response = await axios.get('http://localhost:5000/api/tareas', {
        params: {
          usuario: currentUser.username,
          participante: props.participant
        }
      });

      // Check if the response indicates success
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
  })

  async function addTareas() {
    add.value = true;
  }

  function resetState() {
    add.value = false;
    fetchTareas();
  }

  watch(() => props.participant, () => {
    fetchTareas(); // Re-fetch tasks whenever participant changes
  });

</script>

<template>
<div>
<h3>Tareas</h3>

<AddTareas :participant="participant" @tarea-added="resetState" v-if="add"/>

<button @click="addTareas">Agregar Tarea</button>
<div id="task-block">
    <div class="task" v-for="tarea in tareas" :key="tarea.id">
      <p>{{ tarea.Nombre }}</p>
      <p>Cumplido: {{ tarea.Cumplido }}</p>
    </div>
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