import { createRouter, createWebHistory } from 'vue-router';
import Home from './components/Home.vue';
import Login from './components/Login.vue'; // Assuming you have a separate login page
import Signup from './components/Signup.vue';

const routes = [
  { path: '/', name: 'Login', component: Login }, // Default route is login
  { path: '/signup', name: 'Signup', component: Signup },
  { path: '/home', name: 'Home', component: Home }, // Home route after login
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;