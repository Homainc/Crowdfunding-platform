import Axios from 'axios';
import { URL_PROJECTS, URL_PAYMENTS, URL_ADD_PROJECT } from '@/store/api'
import { 
    PROJECTS_REQUEST,
    PROJECTS_SUCCESS,
    PROJECTS_ERROR,
    PROJECT_INFO_REQUEST,
    PROJECT_INFO_SUCCESS,
    PROJECT_INFO_ERROR,
    ADD_PROJECT_PAYMENT,
    PROJECT_PAYMENT_SUCCESS,
    PROJECT_PAYMENT_ERROR,
    ADD_PROJECT,
    ADD_PROJECT_SUCCESS,
    ADD_PROJECT_ERROR
} from '@/store/mutations'

const state = {
    projects: null,
    status: '',
    errors: null,
    project_info: null,
};

const mutations = {
    [PROJECTS_REQUEST]: (state) => {
        state.status = 'loading';
    },
    [PROJECTS_SUCCESS]: (state, projects) => {
        state.status = 'success';
        state.projects = projects;
    },
    [PROJECTS_ERROR]: (state, errors) => {
        state.status = 'error';
        state.errors = errors;
    },
    [PROJECT_INFO_REQUEST]: (state) => {
        state.status = 'loading';
    },
    [PROJECT_INFO_SUCCESS]: (state, project_info) => {
        state.status = 'success';
        state.project_info = project_info;
    },
    [PROJECT_INFO_ERROR]: (state, errors) => {
        state.status = 'error';
        state.errors = errors;
    },
    [ADD_PROJECT_PAYMENT]: (state) => {
        state.status = 'loading';
    },
    [PROJECT_PAYMENT_SUCCESS]: (state) => {
        state.status = 'success';

    },
    [PROJECT_PAYMENT_ERROR]: (state, errors) => {
        state.status = 'error';
        state.errors = errors;
    },
    [ADD_PROJECT]: (state) => {
        state.status = 'loading';
    },
    [ADD_PROJECT_ERROR]: (state, errors) => {
        state.status = 'error';
        state.errors = errors;
    },
    [ADD_PROJECT_SUCCESS]: (state) => {
        state.status = 'success';
    }
};

const actions = {
    [PROJECTS_REQUEST]: ({ commit }) => {
        return new Promise((resolve, reject) => {
            commit(PROJECTS_REQUEST);
            Axios.get(URL_PROJECTS)
                .then(resp => {
                    if(!resp.data.success){
                        commit(PROJECTS_ERROR, resp.data.errors)
                        reject(resp.data.errors);
                    }
                    else{
                        const projects = resp.data.result.projects;
                        commit(PROJECTS_SUCCESS, projects);
                        resolve(projects);
                    }
                })
                .catch(err => {
                    commit(PROJECTS_ERROR, err);
                    reject(err);
                });
        });
    },
    [PROJECT_INFO_REQUEST]: ({ commit }, project_id) => {
        return new Promise((resolve, reject) => {
            commit(PROJECT_INFO_REQUEST);
            Axios.get(`${URL_PROJECTS}/${project_id}`)
                .then(resp => {
                    if(!resp.data.success){
                        commit(PROJECT_INFO_ERROR, resp.data.errors);
                        reject(resp.data.errors);
                    }
                    else{
                        commit(PROJECT_INFO_SUCCESS, resp.data.result.project);
                        resolve(resp);
                    }
                })
                .catch(err => {
                    commit(PROJECT_INFO_ERROR, err);
                    reject(err);
                });
        })
    },
    [ADD_PROJECT_PAYMENT]: ({ commit }, payment) => {
        return new Promise((resolve, reject) => {
            commit(ADD_PROJECT_PAYMENT);
            Axios.post(URL_PAYMENTS, payment)
                .then(resp => {
                    if(!resp.data.success){
                        commit(PROJECT_PAYMENT_ERROR, resp.data.errors);
                        reject(resp.data.errors);
                    }
                    else{
                        commit(PROJECT_PAYMENT_SUCCESS);
                        resolve(resp);
                    }
                })
                .catch(err => {
                    commit(PROJECT_PAYMENT_ERROR, err);
                    reject(err);
                });
        });
    },
    [ADD_PROJECT]: ({ commit }, project) => {
        return new Promise((resolve, reject) => {
            commit(ADD_PROJECT);
            Axios.post(URL_ADD_PROJECT, project)
                .then(resp => {
                    if(resp.data.success){
                        commit(ADD_PROJECT_SUCCESS, resp.data.result);
                        resolve(resp);
                    }
                    else{
                        commit(ADD_PROJECT_ERROR, resp.data.errors);
                        reject(resp.data.errors);
                    }
                })
                .catch(err => {
                    commit(ADD_PROJECT_ERROR, err);
                    reject(err);
                });
        });
    }
};

const getters = {
    isLoading: state => state.status === 'loading',
    projects: state => state.projects,
    project_info: state => state.project_info,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};