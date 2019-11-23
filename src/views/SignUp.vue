<template>
    <v-container id="sign-in">
        <v-form>
            <v-alert type="error" :value="isFailed">{{ errors }}</v-alert>
            <v-text-field v-model="user.login" label="Login"></v-text-field>
            <v-text-field v-model="user.password" label="Password"></v-text-field>
            <v-text-field v-model="user.confirm_password" label="Confirm Password"></v-text-field>
            <v-text-field v-model="user.first_name" label="First Name"></v-text-field>
            <v-text-field v-model="user.last_name" label="Last Name"></v-text-field>
            <v-text-field v-model="user.middle_name" label="Middle Name"></v-text-field>
            <v-text-field v-model="user.email" label="Email"></v-text-field>
            <v-input label="Birth date"/>
            <v-input 
                prepend-icon="mdi-calendar-range" 
                append-icon="mdi-close" 
                @click:prepend="showDatePicker" 
                @click:append="resetDate">
                    {{ user.birthday ? user.birthday : 'Not chosen' }}
            </v-input>
            <v-dialog absolute v-model="isDatePickerSeen" z-index="5" max-width="300">
                <v-date-picker v-model="user.birthday"></v-date-picker>
            </v-dialog>
            <v-divider/>
            <v-btn text to="/sign-in">I already have an account</v-btn>
            <v-btn :loading="isSigningUp" @click="signup">Sign Up</v-btn>
        </v-form>
    </v-container>
</template>

<script>
import { SIGNUP_REQUEST } from '@/store/mutations'

export default {
    name: 'SignUp',
    data(){
        return {
            isDatePickerSeen: false,
            user: {
                login: '',
                password: '',
                confirm_password: '',
                first_name: '',
                middle_name: '',
                last_name: '',
                birthday: null
            },
            isSigningUp: false,
            isFailed: false,
            errors: null,
        };
    },
    methods:{
        showDatePicker(){
            this.isDatePickerSeen = true;
        },
        resetDate(){
            this.birthDate = null;
        },
        signup(){
            this.isSigningUp = true;
            this.$store.dispatch('auth/' + SIGNUP_REQUEST, this.user)
                .then(() => {
                    this.isSigningUp = false;
                    this.$router.push('/');
                })
                .catch(err => {
                    this.isSigningUp = false;
                    this.errors = err;
                    this.isFailed = true;
                });
        }
    }
}
</script>