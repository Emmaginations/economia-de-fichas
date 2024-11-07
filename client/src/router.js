import { createRouter, createWebHistory } from 'vue-router';
import Home from './components/Home.vue';
import Login from './components/Login.vue'; // Assuming you have a separate login page
import Signup from './components/Signup.vue';
import Participants from './components/Participants.vue';
import Login_participant from './components/Login_participant.vue';
import Home_participant from './components/Home_participant.vue';
import Password_recovery from './components/PasswordRecoveryForm.vue';
import Password_reset from './components/PasswordReset.vue';

const routes = [
  { path: '/', name: 'Login', component: Login }, // Default route is login
  { path: '/signup', name: 'Signup', component: Signup },
  { path: '/home', name: 'Home', component: Home }, // Home route after login
  { path: '/participants', name: 'Participants', component: Participants },
  { path: '/login-participante', name: 'Login-participant', component: Login_participant},
  { path: '/home-participante', name: 'Home-participant', component: Home_participant },
  { path: '/recover-password', name: 'Recover-password', component: Password_recovery },
  { path: '/reset-password', name: 'Reset-password', component: Password_reset },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;