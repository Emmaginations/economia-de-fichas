<script setup>
  import { ref, computed } from "vue";
 import axios from 'axios';
 import { DatePicker } from 'v-calendar';

   const props = defineProps({
    participant: String,
   });

   const emit = defineEmits(['tarea-added']);

   const objective = ref("");
   const observations = ref("");
   const error = ref(null);
   const checked = ref(false);
   const selectedDate=ref(new Date());

   const today = new Date();

   const minDate = computed(() => today);

   const maxDate = computed(() => {
        const date = new Date(today);
        date.setDate(date.getDate() + 28); // 4 weeks = 28 days
        return date;
    });

   const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

   async function addTask() {
    if (objective.value === "") {
        error.value = "Por favor entra un objetivo";
        return;
    }
    
    try {
        // Prepare the task data
        const taskData = {
            Nombre: objective.value,
            Participante: props.participant,
            Usario: currentUser.username,
            Fecha: selectedDate.value.toISOString().split('T')[0]
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

<h2>Nueva Tarea</h2>
    <div class="inputs">
        <h3>Objetivo</h3>
        <input v-model="objective" placeholder="Entra el objetivo de la tarea" />
    </div>
    <div class="inputs">
        <h3>Observaciones</h3>
        <input v-model="observations"  placeholder="Entra las observaciones para la tarea" />
    </div>

    <div class="inputs">
      <h3>Fecha</h3>
      <DatePicker
        v-model="selectedDate"
        :min-date="minDate"
        :max-date="maxDate"
        :masks="{ input: 'DD/MM/YYYY' }"
      >
        <template v-slot="{ inputValue, inputEvents }">
          <input
            class="date-input"
            :value="inputValue"
            v-on="inputEvents"
            placeholder="Selecciona una fecha"
          />
        </template>
      </DatePicker>
    </div>

    <button @click="addTask">Agregar</button>
    <p v-if="error" style="color: red">{{ error }}</p>
</div>
</template>

<style>
#add-tasks {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
  margin: 0 auto;
  padding: 30px;
  border-radius: 5px;
  background-color: #DEF3D7;
  box-shadow: 3px 5px 3px lightgray;
  
}

.inputs {
  margin: 0;
  padding: 0;
  width: 100%;
  text-align: left;
  width: 100%;
}

.check {
  display: inline-block;
}

input {
  width: 100%;
  padding: 0.5em;
  box-sizing: border-box;
}

button {
  color: white;
  border: none;
  border-radius: 5px;
  margin-top: 30px;
  box-shadow: 2px 4px 2px lightgray;
}

h2 {
  text-align: center;
  margin-bottom: 5px;
  font-size: 1.2em;
}

h3 {
  margin-top: 5px;
  font-size: .9em;
  width: 100%;
}

a {
  font-size: .75em;

}

.error-message {
  color: red;
  margin-top: 1em;
}
</style>