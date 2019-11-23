<template>
  <v-container>
    <v-card
      v-for="project in projects"
      v-bind:key="project.id"
      class="mb-5">
      <v-container>
        <v-row>
          <v-col cols="3">
            <v-img :src="project.image_url"/>
          </v-col>
          <v-col cols="9">
            <v-card-title>{{ project.title }}</v-card-title>
            <v-card-subtitle>{{ project.owner.first_name }} {{ project.owner.middle_name }} {{ project.owner.last_name }}</v-card-subtitle>
            <v-card-text>
              <p>{{ project.description }}</p>
              <p>Expired Date: {{ project.end_time | date }}</p>
              <p><v-progress-linear height="10px" :value="(project.current_sum/project.sum_goal)*100"/>{{project.current_sum}} / {{ project.sum_goal }} $</p>
            </v-card-text>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
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
    date: function(value){
      return new Date(value).toLocaleDateString();
    }
  }
}
</script>
