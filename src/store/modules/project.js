import Axios from 'axios';
import { URL_PROJECTS } from '@/store/api'
import { 
    PROJECTS_REQUEST,
    PROJECTS_SUCCESS,
    PROJECTS_ERROR,
    PROJECT_INFO_REQUEST,
    PROJECT_INFO_SUCCESS,
    PROJECT_INFO_ERROR,
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
                    const projects = resp.data.result.projects;
                    commit(PROJECTS_SUCCESS, projects);
                    resolve(projects);
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
                    commit(PROJECT_INFO_SUCCESS, resp.data.result.project);
                    resolve(resp);
                })
                .catch(err => {
                    commit(PROJECT_INFO_ERROR, err);
                    reject(err);
                });
        })
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