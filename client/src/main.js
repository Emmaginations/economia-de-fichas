import './assets/main.css'

import { createApp } from 'vue'
import { VueFire } from "vuefire"
import { initializeApp } from "firebase/app"
import { setupCalendar, Calendar, DatePicker } from 'v-calendar';
import 'v-calendar/style.css';

import App from './App.vue';
import router from './router';


export const firebaseApp = initializeApp({
    apiKey: "AIzaSyBYEcgqrAVM0xY3L8OOefM-qBSjqUW-QmI",
    authDomain: "economia-de-fichas-9fbf4.firebaseapp.com",
    projectId: "economia-de-fichas-9fbf4",
    storageBucket: "economia-de-fichas-9fbf4.appspot.com",
    messagingSenderId: "715144625366",
    appId: "1:715144625366:web:789c41736469adaa659d77"
  });

const app = createApp(App);
/*const app = initializeApp(firebaseConfig);*/

app.use(VueFire, { firebaseApp });

app.use(setupCalendar, {});

app.component('VCalendar', Calendar);
app.component('VDatePicker', DatePicker);

app.use(router);
app.mount('#app');
