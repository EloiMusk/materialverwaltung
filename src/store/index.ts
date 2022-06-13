import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        user: {
            loggedIn: false,
            data: null
        },
        alert: {
            message: "",
            type: "success",
            show: false
        },
        loading: false
    },
    getters: {
        user(state) {
            return state.user
        },
        alert(state) {
            return state.alert
        },
        showAlert(state) {
            return state.alert.show
        },
        loading(state) {
            return state.loading
        }
    },
    mutations: {
        SET_LOGGED_IN(state, value) {
            state.user.loggedIn = value;
        },
        SET_USER(state, data) {
            state.user.data = data;
        },
        SET_ALERT(state, alert) {
            state.alert = alert;
        },
        SET_SHOW_ALERT(state, show) {
            console.log("SET_SHOW_ALERT", show);
            state.alert.show = show;
        },
        SET_LOADING(state, loading) {
            state.loading = loading;
        }
    },
    actions: {
        fetchUser({commit}, user) {
            commit("SET_LOADING", true);
            commit("SET_LOGGED_IN", user !== null);
            if (user) {
                commit("SET_USER", {
                    displayName: user.displayName,
                    email: user.email
                });
            } else {
                commit("SET_USER", null);
            }
            commit("SET_LOADING", false);
        },
        signOut({commit}) {
            commit("SET_LOADING", true);
            commit("SET_USER", null);
            commit("SET_LOGGED_IN", false);
            commit("SET_LOADING", false);
        }
    }
})
