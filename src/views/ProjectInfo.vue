<template>
    <v-container>
        <div v-if="!projectLoaded">
            <v-row>
                <v-col>
                    <v-card>
                        <v-row>
                            <v-col cols="6" class="py-0">
                                <v-skeleton-loader type="image"></v-skeleton-loader>
                            </v-col>
                            <v-col cols="6">
                                <v-skeleton-loader type="article"></v-skeleton-loader>
                                <v-skeleton-loader type="button" class="ml-3"></v-skeleton-loader>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-sheet elevation="2" class="pa-4">
                        <v-skeleton-loader type="paragraph"></v-skeleton-loader>
                    </v-sheet>
                </v-col>
            </v-row>
        </div>
        <div v-else>
            <v-row>
                <v-col>
                    <v-card :elevation="5">
                        <v-row>
                            <v-col cols="6" class="py-0">
                                <v-img :src="project_info.image_url"></v-img>
                            </v-col>
                            <v-col cols="6">
                                <v-card-title>{{ project_info.title }}</v-card-title>
                                <v-card-subtitle>
                                    <v-chip class="mr-1" v-for="category in project_info.categories" :key="category.id">
                                        {{ category.name }}
                                    </v-chip>
                                </v-card-subtitle>
                                <v-card-subtitle>
                                    Author: {{ project_info.owner | full_name }}
                                </v-card-subtitle>
                                <v-card-text>
                                    <v-progress-linear height="20px" :value="project_progress"/>{{project_info.current_sum}} / {{ project_info.sum_goal }} $
                                </v-card-text>
                                <v-card-title>Support</v-card-title>
                                <v-card-text>
                                    <v-text-field dense outlined label="Ammount"></v-text-field>
                                    <v-btn>Support</v-btn>
                                    <div ref="paypalDiv"></div>
                                </v-card-text>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-sheet elevation="2">
                        <v-tabs color="black" background-color="grey lighten-3">
                            <v-tab>Description</v-tab>
                            <v-tab-item>
                                <v-card-text>{{ project_info.description }}</v-card-text>
                            </v-tab-item>
                            <v-tab>Comments</v-tab>
                            <v-tab-item class="pa-5">
                                <v-card color="grey lighten-5">
                                    <v-card-title>User</v-card-title>
                                    <v-card-text>User's comment</v-card-text>
                                </v-card>
                            </v-tab-item>
                        </v-tabs>
                    </v-sheet>
                </v-col>
            </v-row>
        </div>
    </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import { PROJECT_INFO_REQUEST } from '@/store/mutations'

export default {
    name: 'ProjectInfo',
    props: ['id'],
    data(){
        return {
            errors: null,
            order: null,
            projectLoaded: false,
        };
    },
    mounted(){
        this.projectLoaded = false;
        this.$store.dispatch(`project/${PROJECT_INFO_REQUEST}`, this.project_id)
        .then(() => {
            this.projectLoaded = true;
            //const paypal_script = document.createElement('script');
            //paypal_script.src = 'https://www.paypal.com/sdk/js?client-id=AZEHNLcC0dT0sLnHN_cGvLRk8_o4Oo0dhcbXNe9dGVhpEWSB8SxN0LQpiEkKU3Id5rsKEXXQzuAX5dMR';
            //paypal_script.addEventListener('load', this.paypalScriptLoaded);
            //document.body.appendChild(paypal_script);
        })
        .catch(err => {
            this.errors = err;
        });
    },
    computed: {
        project_id() {
            return this.$route.params.id;
        },
        project_progress(){
            return (this.project_info.current_sum/this.project_info.sum_goal)*100;
        },
        ...mapGetters('project', ['project_info'])
    },
    filters: {
        full_name(owner){
            return `${owner.first_name} ${owner.middle_name} ${owner.last_name}`;
        }
    },
    methods: {
        paypalScriptLoaded(){
            window.paypal.Buttons({
                createOrder: (data, actions) => {
                    return actions.order.create({
                        purchase_units: [
                            {
                                description: this.project_info.description,
                                amount: {
                                    currency_code: "USD",
                                    value: 10, 
                                }
                            }
                        ]
                    });
                },
                onApprove: async (data, actions) => {
                    this.order = await actions.order.capture();
                    this.data;
                },
                onError: err => {
                    this.errors = err;
                }
            }).render(this.$refs.paypalDiv);
        }
    }
}
</script>