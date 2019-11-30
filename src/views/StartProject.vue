<template>
    <v-container>
        <v-card>
            <v-form ref="form">
                <v-card-title>Start a project</v-card-title>
                <v-card-text>
                    <v-text-field
                        :rules="[rules.required]" 
                        ref="title" outlined label="Title" v-model="project.title"/>
                    <v-combobox 
                        v-if="categoryWasLoaded" ref="categories_id" v-model="project.categories_id" outlined multiple :items="selectCategories" label="Categories"/>
                    <v-skeleton-loader 
                        v-else type="heading" class="mb-5"></v-skeleton-loader>
                    <v-textarea
                        :rules="[rules.required]" 
                        ref="description" outlined label="Description" v-model="project.description"/>
                    <v-input label="End time"/>
                    <v-input
                        :rules="[]"
                        ref="end_time" 
                        prepend-icon="mdi-calendar-range" 
                        append-icon="mdi-close" 
                        @click:prepend="showDatePicker" 
                        @click:append="resetDate">
                            {{ project.end_time ? project.end_time : 'Not chosen' }}
                    </v-input>
                    <v-dialog absolute v-model="isDatePickerSeen" z-index="5" max-width="300">
                        <v-date-picker v-model="project.end_time"></v-date-picker>
                    </v-dialog>
                    <v-text-field 
                        :rules="[rules.required]"
                        ref="image_url" outlined label="Image url" v-model="project.image_url"/>
                    <v-text-field 
                        :rules="[rules.required]"
                        ref="sum_goal" outlined label="Monetary goal" v-model="project.sum_goal"></v-text-field>
                    <v-text-field 
                        :rules="[rules.required]"
                        ref="payment_secret" outlined label="Paypal Client Id" v-model="project.payment_secret"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-btn @click="startProject">Start</v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import { CATEGORIES_REQUEST, ADD_PROJECT } from '@/store/mutations';
import vrules, { isFormValid } from './rules';

export default {
    data(){
        return {
            isDatePickerSeen: false,
            project: {
                end_time: null,
                title: null,
                description: null,
                image_url: null,
                sum_goal: null,
                payment_secret: null,
                categories_id: null,
            },
            selectCategories: null,
            categoryWasLoaded: false,
            rules: vrules
        };
    },
    mounted() {
        this.$store.dispatch(`category/${CATEGORIES_REQUEST}`)
        .then(() => {
            this.selectCategories = this.categories.map(el => {
                return {
                    value: el.id,
                    text: el.name,
                };
            });
            this.categoryWasLoaded = true;
        })
        .catch(() => {
            this.categoryWasLoaded = false;
        });
    },
    methods: {
        showDatePicker: function(){
            this.isDatePickerSeen = true;
        },
        resetDate: function(){
            this.project.end_time = null;
        },
        startProject: function(){
            if(isFormValid(this.$refs, this.form)){
                const project = { ...this.project, current_sum: 0, user_token: this.token };
                project.categories_id = project.categories_id.map(el => {
                    return el.id;
                });
                this.$store.dispatch(`project/${ADD_PROJECT}`, project)
                    .then(() => {
                        this.$router.push('/');
                    })
                    .catch();
            }
        }
    },
    computed: {
        ...mapGetters('category', ['categories']),
        ...mapGetters('auth', ['token']),
        form: function() {
            return {
                title: this.project.title,
                end_time: this.project.end_time,
                description: this.project.description,
                image_url: this.project.image_url,
                sum_goal: this.project.sum_goal,
                payment_secret: this.project.payment_secret,

            };
        }
    }
}
</script>