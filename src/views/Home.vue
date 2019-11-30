<template>
  <v-container class="d-inline-flex flex-wrap">
    <v-hover v-slot:default="{ hover }"
      v-for="project in projects"
      v-bind:key="project.id">
      <v-card
      class="ml-5 mt-5"
      :elevation="hover ? 12 : 6"
      :to="`/project/${project.id}`"
      max-width="400">
        <v-img :src="project.image_url"/>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-progress-linear v-on="on" height="10px" :value="(project.current_sum/project.sum_goal)*100"/>
          </template>
          <span>$ {{project.current_sum}} of $ {{ project.sum_goal }} $</span>
        </v-tooltip>
        <v-card-title>{{ project.title }}</v-card-title>
        <v-card-text>
          {{ project.description | cutString200 }}
        </v-card-text>
        <v-card-text>
          <v-row class="ma-0 pa-0">
            <v-col cols="6" class="pa-0 ma-0">
              by {{ project.owner.first_name }} {{ project.owner.last_name }}
            </v-col>
            <v-col cols="6" class="pa-0 ma-0">
              {{ project.end_time | timeLeft }}
            </v-col>
          </v-row>
        </v-card-text>
    </v-card>
    </v-hover>
  </v-container>
</template>

<script>
// @ is an alias to /src
import { PROJECTS_REQUEST } from '@/store/mutations'
import { mapGetters } from 'vuex';

export default {
  name: 'Home',
  mounted(){
    this.$store.dispatch('project/' + PROJECTS_REQUEST);
  },
  computed:{
    ...mapGetters('project', ['projects', 'isLoading'])
  },
  filters: {
    timeLeft: function(value){
      const delta = new Date(value).getTime() - Date.now();
      let hours = delta / (1000 * 60 * 60);
      let days = hours / 24;
      hours = Math.trunc(hours);
      days = Math.trunc(days);
      if(days === 0){
        const postfix = hours === 1 ? 'hour' : 'hours' 
        return `${hours} ${postfix} left`; 
      }
      const postfix = days === 1 ? 'day' : 'days';
      return `${days} ${postfix} left`;
    },
    cutString200: function(value){
      const str = new String(value);
      return str.substring(0, 200) + (str.length > 200 ? '...' : '');
    }
  }
}
</script>
