<script setup>
  import { ref } from "vue"; // Ensure `ref` is imported from Vue
  import { useRouter } from 'vue-router';
  import axios from 'axios';

 
  const router = useRouter();

  // Reactive data properties
  const username = ref("");
  const password = ref("");
  const password2 = ref("");
  const error = ref(null);
  const email = ref("");
  const email2 = ref("")
  const checked = ref(false);

  async function signUp() {
    if (username.value == "") {
        error.value = "Por favor entra un nombre de usario";
    } else if (password.value.length < 6) {
        error.value = "Por favor entra una contraseña valida";
    } else if (password.value != password2.value) {
        error.value = "Las contraseñas no coinciden";
    } else if (email.value == "") {
        error.value = "Por favor entra un correo";
    } else if (email.value != email2.value) {
        error.value = "Los correos no coinciden";
    } else if (checked.value == false) {
        error.value = "Por favor acepta los terminos y condiciones"
    } else {
      try {
        const response = await axios.post('http://localhost:5000/api/signup', {
                "Nombre": username.value,
                "Contraseña": password.value,
                "Correo": email.value,
                "Papel": "tutor",
            });

            // Handle backend response
            if (response.data.success) {
                // Redirect to the login page on successful registration
                router.push({ name: 'Login' });
            } else {
                error.value = response.data.error || "Registro fallado";
            }
      }catch (err) {
        error.value = "Registro fallado: " + err.response?.data?.error || err.message;
      }
  }
}
  
</script>

<template>
  <div id="signup-window">

    <h2>Inscribirse</h2>
    <div class="inputs">
        <h3>Nombre de Usuario</h3>
        <input v-model="username" placeholder="Entra tu nombre de usario aquí" />
    </div>
    <div class="inputs">
        <h3>Correo Electrónico</h3>
        <input v-model="email" placeholder="Entra tu correo aquí" />
    </div>
    <div class="inputs">
        <h3>Confirmación de Correo Electrónico</h3>
        <input v-model="email2" placeholder="Confirma tu correo" />
    </div>
    <div class="inputs">
        <h3>Contraseña</h3>
        <input v-model="password"  placeholder="Entra tu contraseña aquí" />
    </div>
    <div class="inputs">
        <h3>Confirmación de Contraseña</h3>
        <input v-model="password2"  placeholder="Confirma tu contraseña" />
    </div>
    <div class="inputs">
        <input type="checkbox" v-model="checked"/>
        <p>Aceptar los terminos y condiciones.</p>
    </div>

    <button @click="signUp">Inscribirse</button>
    <p v-if="error" style="color: red">{{ error }}</p>
  </div>

</template>
<style scoped>

#signup-window {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  margin: 0 auto;
  padding: 60px;
  border-radius: 5px;
  background-color: #DEF3D7;
  box-shadow: 3px 5px 3px lightgray;
  
}

.inputs {
  margin: 0;
  padding: 0;
  width: 100%
}

input {
  width: 100%;
  padding: 0.5em;
  box-sizing: border-box;
}

button {
  width: 70%;
  padding: 0.7em;
  background-color: #61C73F;
  color: white;
  border: none;
  border-radius: 5px;
  margin-top: 30px;
  box-shadow: 2px 4px 2px lightgray;
  justify-content: center;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

h3 {
  margin-top: 10px;
  font-size: .9em;
}

a {
  font-size: .75em;

}

.error-message {
  color: red;
  margin-top: 1em;
}
</style>