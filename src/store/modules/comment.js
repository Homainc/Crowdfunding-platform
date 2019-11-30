import {
    COMMENTS_REQUEST,
    COMMENTS_SUCCESS,
    COMMENTS_ERROR,
    ADD_COMMENT,
    ADD_COMMENT_SUCCESS,
    ADD_COMMENT_ERROR
} from "@/store/mutations";
import { URL_COMMENTS } from '@/store/api';
import Axios from "axios";

const state = {
    comments: null,
    errors: null,
    status: ''
};

const mutations = {
    [COMMENTS_REQUEST]: (state) => {
        state.status = 'loading';
    },
    [COMMENTS_SUCCESS]: (state, comments) => {
        state.status = 'success';
        state.comments = comments;
    },
    [COMMENTS_ERROR]: (state, errors) => {
        state.status = 'error';
        state.errors = errors;
    },
    [ADD_COMMENT]: (state) => {
        state.status = 'loading';
    },
    [ADD_COMMENT_SUCCESS]: (state) => {
        state.status = 'success';
    },
    [ADD_COMMENT_ERROR]: (state, errors) => {
        state.status = 'error';
        state.errors = errors;
    }
};

const actions = {
    [COMMENTS_REQUEST]: ({ commit }, project_id) => {
        return new Promise((resolve, reject) => {
            commit(COMMENTS_REQUEST);
            Axios.get(`${URL_COMMENTS}?project_id=${project_id}`)
                .then(resp => {
                    if(resp.data.success){
                        commit(COMMENTS_SUCCESS, resp.data.result.comments);
                        resolve(resp.data.result.comments);
                    }
                    else{
                        if(resp.data.errors === 'Not found comment'){
                            commit(COMMENTS_SUCCESS, null);
                            resolve(null);
                        }
                        else{
                            commit(COMMENTS_ERROR, resp.data.errors);
                            reject(resp.data.errors);
                        }
                    }
                })
                .catch(err => {
                    commit(COMMENTS_ERROR, err);
                    reject(err);
                });
        });
    },
    [ADD_COMMENT]: ({ commit }, comment) => {
        return new Promise((resolve, reject) => {
            commit(ADD_COMMENT);
            Axios.post(URL_COMMENTS, comment)
                .then(resp => {
                    if(resp.data.success){
                        commit(ADD_COMMENT_SUCCESS);
                        resolve();
                    }
                    else{
                        commit(ADD_COMMENT_ERROR, resp.data.errors);
                        reject(resp.data.errors);
                    }
                })
                .catch(err => {
                    commit(ADD_COMMENT_ERROR, err);
                    reject(err);
                });
        });
    }
};

const getters = {
    comments: (state) => state.comments
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};