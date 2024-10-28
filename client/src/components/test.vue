<script>
import axios from 'axios';

export default {
    data () {
        return { login: []};
    },
    async mounted() {
        try {
            const response = await axios.get('http://localhost:5000/api/data');
            this.login = response.data;
            console.log('Response data:', response.data);
        } catch (error) {
            console.error('Error fetching login information', error);
        }        
    }
}

</script>

<template>
<div>
    <ul>
        <li v-for="log in login" :key="log.id">
            {{ log.Nombre }}
        </li>
    </ul>
    
</div>
</template>