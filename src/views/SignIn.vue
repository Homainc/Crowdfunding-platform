<template>
    <v-container id="sign-in" class="d-flex justify-center">
        <v-card min-width="500">
            <v-card-title>Sign in</v-card-title>
            <v-card-text>
                <v-form ref="form">
                    <v-alert type="error" :value="isFailed">{{ error }}</v-alert>
                    <v-text-field outlined :rules="[rules.required]" ref="login" v-model="login" label="Login"></v-text-field>
                    <v-text-field outlined :rules="[rules.required]" ref="password" v-model="password" label="Password"></v-text-field>
                    <v-btn text to="/sign-up">Sign Up</v-btn>
                    <v-btn :loading="isSigning" @click="signIn">Login</v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import { AUTH_REQUEST } from '@/store/mutations'
import vrules, { isFormValid } from './rules'

export default {
    name: 'SignIn',
    data: function(){
        return {
            login: '',
            password: '',
            isFailed: false,
            error: '',
            isSigning: false,
            rules: vrules,
            check: null
        };
    },
    methods: {
        signIn: function(){
            this.isSigning = true;
            if(isFormValid(this.$refs, this.form)){
                const { login, password } = this;
                this.$store.dispatch('auth/' + AUTH_REQUEST, { login, password }).then(() => {
                    this.isSigning = false;
                    this.$router.push('/');
                })
                .catch((err) => {
                    this.error = err;
                    this.isFailed = true;
                    this.isSigning = false;
                });
            }
            else
                this.isSigning = false;
        }
    },
    computed: {
        form(){
            return {
                login: this.login,
                password: this.password
            }
        }
    }
}
</script>