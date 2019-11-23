<template>
  <v-app>
    <v-toolbar max-height="56px" short max-width="auto">
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer/>
        <v-toolbar-items>
        <v-btn text v-for="link in menu" v-bind:key="link.name" :to="link.path">
          {{ link.name }}
        </v-btn>
        <v-btn v-if="!isAuthenticated" text to="/sign-up">Sign Up / Sing In</v-btn>
        <v-btn v-else text @click="logout">Log Out</v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-content justify-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import { AUTH_LOGOUT } from '@/store/mutations'
import { mapGetters } from 'vuex'

export default {
  name: 'App',
  components: {
  },

  data: () => ({
    title: 'Crowdfunding',
    menu: [
      { name: 'Main', path: '/' },
      { name: 'Profile', path: '/profile' },
    ]
  }),
  computed: {
    ...mapGetters('auth', ['isAuthenticated']),
  },
  methods: {
    logout: function(){
      this.$store.dispatch('auth/' + AUTH_LOGOUT)
      .then(() => {
        this.$router.push('/sign-in');
      });
    }
  }
};
</script>
