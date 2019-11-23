import { URL_SIGN_IN, URL_SIGN_UP } from '@/store/api'
import { 
  AUTH_REQUEST,
  AUTH_SUCCESS,
  AUTH_ERROR,
  AUTH_LOGOUT,
  USER_REQUEST,
  SIGNUP_REQUEST,
  SIGNUP_ERROR }
from '@/store/mutations'
import Axios from 'axios'

const state = {
    token: localStorage.getItem('user-token') || '',
    status: '',
    errors: null,
};
const mutations = {
    [AUTH_REQUEST]: (state) => {
      state.status = 'loading';
    },
    [AUTH_SUCCESS]: (state, token) => {
      state.status = 'success';
      state.token = token;
    },
    [AUTH_ERROR]: (state) => {
      state.status = 'error';
    },
    [AUTH_LOGOUT]: (state) => {
      state.token = null;
      state.status = '';
    },
    [SIGNUP_ERROR]: (state, errors) => {
      state.errors = errors;
      state.status = 'error';
    },
    [SIGNUP_REQUEST]: (state) => {
      state.status = 'loading';
    }
};
const actions = {
    [AUTH_REQUEST]: ({ commit, dispatch }, user) => {
      return new Promise((resolve, reject) => {
        commit(AUTH_REQUEST);
        Axios.post(URL_SIGN_IN, user)
          .then(resp => {
            const response = resp.data;
            if(!response.success){
              reject(response.errors.authorization)
            }
            const token = response.result.token;
            localStorage.setItem('user-token', token);
            commit(AUTH_SUCCESS, token);
            dispatch(USER_REQUEST);
            resolve(resp);
          })
          .catch(err => {
            commit(AUTH_ERROR, err);
            localStorage.removeItem('user-token');
            reject(err);
          })
      });
    },
    [AUTH_LOGOUT]: ({ commit }) => {
      return new Promise((resolve, reject) => {
        commit(AUTH_LOGOUT);
        localStorage.removeItem('user-token');
        resolve();
        if (localStorage.getItem('user-token') == null){
          reject();
        }
      });
    },
    [SIGNUP_REQUEST]: ({ commit }, user) => {
      return new Promise((resolve, reject) => {
        commit(SIGNUP_REQUEST);
        Axios.post(URL_SIGN_UP, user)
          .then(resp => {
            if(!resp.data.success){
              commit(SIGNUP_ERROR, resp.data.errors);
              reject(resp.data.errors);
            }
            commit(AUTH_SUCCESS, resp.data.result.token);
            resolve(resp);
          })
          .catch(err => {
            commit(SIGNUP_ERROR, err);
            reject(err);
          });
      });
    }
};

const getters = {
    isAuthenticated: state => !!state.token,
    authStatus: state => state.status,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}