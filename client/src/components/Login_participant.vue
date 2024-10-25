<script setup>
   import { ref } from "vue"; // Ensure `ref` is imported from Vue
   import { useRouter } from 'vue-router';
  import axios from 'axios';

  const router = useRouter();

  // Reactive data properties
  const username = ref("");
  const password = ref("");
  const error = ref(null);

  // Async function to handle login logic
  async function handleLogin() {
  error.value = null; // Clear error before starting

  try {
    // Make a POST request to the backend API endpoint for login
    const response = await axios.post('http://localhost:5000/api/loginparticipant', {
      Nombre: username.value,
      Contraseña: password.value
    });

    // Handle backend response
    if (response.data.success) {
      const userData = response.data;
      
      // Check the user role and redirect accordingly
      if (userData.Papel === "participante") {
        alert("Login successful!");
        error.value = null; // Clear error message

        // Save current user data to session storage
        const user = { username: userData.Nombre };
        sessionStorage.setItem('currentUser', JSON.stringify(user));

        // Redirect to participant's homepage
        router.push({ name: 'Home-participant' });
      } else {
        error.value = "Esta es una cuenta de tutor";
      }
    } else {
      error.value = response.data.error || "Login failed";
    }
  } catch (err) {
    // Handle errors from the backend call
    error.value = "Login failed: " + (err.response?.data?.error || err.message);
  }
}

</script>

<template>
    

  <div id="login-window">
    <h2>Login</h2>
    <div class="inputs">
    <h3>Nombre de Usuario</h3>
    <input v-model="username" placeholder="Entra tu nombre de usario aquí" />
    </div>
    <div class="inputs">
    <h3>Contraseña</h3>
    <input v-model="password"  placeholder="Entra tu contraseña aquí" />
    </div>

    <button @click="handleLogin">Entrar</button>
    <p v-if="error" style="color: red">{{ error }}</p>
  </div>


</template>

<style scoped>
#login-window {
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