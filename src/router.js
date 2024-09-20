import { createRouter, createWebHistory } from 'vue-router';
import Home from './components/Home.vue';
import Login from './components/Login.vue'; // Assuming you have a separate login page
import Signup from './components/Signup.vue';
import Participants from './components/Participants.vue';
import Login_participant from './components/Login_participant.vue';
import Home_participant from './components/Home_participant.vue';

const routes = [
  { path: '/', name: 'Login', component: Login }, // Default route is login
  { path: '/signup', name: 'Signup', component: Signup },
  { path: '/home', name: 'Home', component: Home }, // Home route after login
  { path: '/participants', name: 'Participants', component: Participants },
  { path: '/login-participante', name: 'Login-participant', component: Login_participant},
  { path: '/home-participante', name: 'Home-participant', component: Home_participant },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;