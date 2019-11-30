import { 
    CATEGORIES_REQUEST,
    CATEGORIES_SUCCESS,
    CATEGORIES_ERROR
} from '@/store/mutations';
import Axios from 'axios';
import { URL_CATEGORIES } from '@/store/api';

const state = {
    categories: null,
    status: '',
    errors: null,
};

const mutations = {
    [CATEGORIES_REQUEST]: (state) => {
        state.status = 'loading';
    },
    [CATEGORIES_SUCCESS]: (state, categories) => {
        state.status = 'success';
        state.categories = categories;
    },
    [CATEGORIES_ERROR]: (state, errors) => {
        state.status = 'error';
        state.errors = errors; 
    }
};

const actions = {
    [CATEGORIES_REQUEST]: ({ commit }) => {
        return new Promise((resolve, reject) => {
            commit(CATEGORIES_REQUEST);
            Axios.get(URL_CATEGORIES)
                .then(resp => {
                    if(resp.data.success){
                        commit(CATEGORIES_SUCCESS, resp.data.result.categories);
                        resolve(resp);
                    }
                    else{
                        commit(CATEGORIES_ERROR, resp.data.errors);
                        reject(resp.data.errors);
                    }
                })
                .catch(err => {
                    commit(CATEGORIES_ERROR, err);
                    reject(err);
                });
        });
    }
};

const getters = {
    categories: (state) => state.categories
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};