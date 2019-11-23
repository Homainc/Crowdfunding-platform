<template>
    <v-container id="sign-in">
        <v-form>
            <v-alert type="error" :value="isFailed">{{ error }}</v-alert>
            <v-text-field v-model="login" label="Login"></v-text-field>
            <v-text-field v-model="password" label="Password"></v-text-field>
            <v-btn text to="/sign-up">Sign Up</v-btn>
            <v-btn :loading="isSigning" @click="signIn">Login</v-btn>
        </v-form>
    </v-container>
</template>

<script>
import { AUTH_REQUEST } from '@/store/mutations'

export default {
    name: 'SignIn',
    data: function(){
        return {
            login: '',
            password: '',
            isFailed: false,
            error: '',
            isSigning: false,
        };
    },
    methods: {
        signIn: function(){
            this.isSigning = true;
            const { login, password } = this;
            this.$store.dispatch('auth/' + AUTH_REQUEST, { login, password }).then(() => {
                this.$router.push('/');
            })
            .catch((err) => {
                this.error = err;
                this.isFailed = true;
                this.isSigning = false;
            });
        }
    }
}
</script>