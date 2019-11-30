import Vue from 'vue';
import Vuex from 'vuex';
import auth from './modules/auth';
import project from './modules/project';
import category from './modules/category';
import comment from './modules/comment';

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    project,
    category,
    comment
  },
})
