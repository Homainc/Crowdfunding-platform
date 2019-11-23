<template>
    <v-container id="sign-up" class="d-flex justify-center">
        <v-card width="600">
            <v-card-title>Sign up</v-card-title>
            <v-card-text>
                <v-form ref="form">
                    <v-alert type="error" :value="isFailed">{{ errors }}</v-alert>
                    <v-text-field outlined ref="login" :rules="[rules.required]" v-model="user.login" label="Login"></v-text-field>
                    <v-text-field outlined ref="password" :rules="[rules.required, rules.min6]" v-model="user.password" label="Password"></v-text-field>
                    <v-text-field outlined ref="confirm_password" :rules="[rules.required, () => user.confirm_password === user.password || 'Passwords must match']" v-model="user.confirm_password" label="Confirm Password"></v-text-field>
                    <v-text-field outlined ref="first_name" :rules="[rules.required]" v-model="user.first_name" label="First Name"></v-text-field>
                    <v-text-field outlined ref="last_name" :rules="[rules.required]" v-model="user.last_name" label="Last Name"></v-text-field>
                    <v-text-field outlined ref="middle_name" :rules="[rules.required]" v-model="user.middle_name" label="Middle Name"></v-text-field>
                    <v-text-field outlined ref="email" :rules="[rules.required, rules.email]" v-model="user.email" label="Email"></v-text-field>
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
                    <v-btn :loading="isSigningUp" @click="signUp">Sign Up</v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import { SIGNUP_REQUEST } from '@/store/mutations'
import vrules, { isFormValid } from './rules';

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
                email: '',
                birthday: null
            },
            rules: vrules,
            isSigningUp: false,
            isFailed: false,
            errors: null,
        };
    },
    methods:{
        showDatePicker: function(){
            this.isDatePickerSeen = true;
        },
        resetDate: function(){
            this.birthDate = null;
        },
        signUp: function(){
            this.isSigningUp = true;
            if(isFormValid(this.$refs, this.form)){
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
            else
                this.isSigningUp = false;
        }
    },
    computed:{
        form(){
            return {
                login: this.user.login,
                password: this.user.password,
                confirm_password: this.user.confirm_password,
                first_name: this.user.first_name,
                middle_name: this.user.middle_name,
                last_name: this.user.last_name,
                email: this.user.email
            }
        }
    }
}
</script>