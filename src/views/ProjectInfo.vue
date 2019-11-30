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
            <v-overlay :value="paymentWindowSeen" absolute>
                <v-card :hidden="!paypalButtonsRendered || isPaymentCompleted || paymentLoading" min-width="500" light>
                    <v-card-title>Support project</v-card-title>
                    <v-card-text>
                        Amount: {{ projectSupportValue }} USD<br>
                        Project: {{ project_info.title }}
                    </v-card-text>
                    <v-card-text>
                        <div ref="paypalDiv"></div>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn @click="paymentWindowSeen = false">Cancel</v-btn>
                    </v-card-actions>
                </v-card>
                <v-progress-circular indeterminate :hidden="paypalButtonsRendered"></v-progress-circular>
                <v-progress-circular indeterminate :hidden="!paymentLoading"></v-progress-circular>
                <v-card light v-if="isPaymentCompleted">
                    <template v-if="isPaymentSuccess">
                        <v-card-title>Payment information</v-card-title>
                        <v-card-text>
                            <v-alert type="success">Payment was successful</v-alert>
                            Description: {{ order.purchase_units[0].description }} <br>
                            Paid: {{ order.purchase_units[0].amount.value }} $ <br>
                            Status: {{ order.status }} <br>
                            Date: {{ new Date(order.create_time).toLocaleString() }}
                        </v-card-text>
                        <v-card-actions>
                            <v-btn @click="hidePaymentWindow">Close</v-btn>
                        </v-card-actions>
                    </template>
                    <template v-else>
                        <v-card-title>Payment information</v-card-title>
                        <v-card-text>
                            <v-alert type="error">Payment failed</v-alert>
                            Error: {{ errors }}
                        </v-card-text>
                        <v-card-actions>
                            <v-btn @click="hidePaymentWindow">Close</v-btn>
                        </v-card-actions>
                    </template>
                </v-card>
            </v-overlay>
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
                                    <v-text-field prefix="$" dense outlined label="Ammount" v-model="projectSupportValue"></v-text-field>
                                    <v-btn @click="showPaymentWindow">Support</v-btn>
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
import { PROJECT_INFO_REQUEST, ADD_PROJECT_PAYMENT } from '@/store/mutations'

export default {
    name: 'ProjectInfo',
    props: ['id'],
    data(){
        return {
            errors: null,
            order: null,
            projectLoaded: false,
            projectSupportValue: 10.00,
            paymentWindowSeen: false,
            paypalButtonsRendered: false,
            paymentLoading: false,
            isPaymentSuccess: false,
            isPaymentCompleted: false,
        };
    },
    mounted(){
        this.projectLoaded = false;
        this.$store.dispatch(`project/${PROJECT_INFO_REQUEST}`, this.project_id)
        .then(() => {
            this.projectLoaded = true;
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
        ...mapGetters('project', ['project_info']),
        ...mapGetters('auth', ['token']),
    },
    filters: {
        full_name(owner){
            return `${owner.first_name} ${owner.last_name}`;
        }
    },
    methods: {
        renderPaypalButtons(){
            window.paypal.Buttons({
                createOrder: (data, actions) => {
                    this.paymentLoading = true;
                    return actions.order.create({
                        purchase_units: [
                            {
                                description: `Support to project "${this.project_info.title}" on the Crownfunding site.`,
                                amount: {
                                    currency_code: "USD",
                                    value: this.projectSupportValue, 
                                }
                            }
                        ]
                    });
                },
                onApprove: async (data, actions) => {
                    this.order = await actions.order.capture();
                    const payment = {
                        date: this.order.create_date,
                        amount: this.order.purchase_units[0].amount.value,
                        token: this.token,
                        title: 'Support project',
                        description: this.order.purchase_units[0].description,
                        payment_method: 'paypal',
                        project_id: this.project_info.id,
                    };
                    this.$store.dispatch(`project/${ADD_PROJECT_PAYMENT}`, payment)
                        .then(() => {
                            this.isPaymentSuccess = true;
                            this.paymentLoading = false;
                            this.isPaymentCompleted = true;
                            this.project_info.current_sum += payment.amount;
                        })
                        .catch(err => {
                            this.errors = err;
                            this.isPaymentSuccess = false;
                            this.paymentLoading = false;
                            this.isPaymentCompleted = true;
                        });
                },
                onError: err => {
                    this.errors = err;
                    this.isPaymentSuccess = false;
                    this.isPaymentCompleted = true;
                    this.paymentLoading = false;
                }
            }).render(this.$refs.paypalDiv);
            this.paypalButtonsRendered = true;
        },
        showPaymentWindow(){
            this.paymentWindowSeen = true;
            const paypal_script = document.createElement('script');
            paypal_script.src = 'https://www.paypal.com/sdk/js?client-id=AZEHNLcC0dT0sLnHN_cGvLRk8_o4Oo0dhcbXNe9dGVhpEWSB8SxN0LQpiEkKU3Id5rsKEXXQzuAX5dMR';
            paypal_script.addEventListener('load', this.renderPaypalButtons);
            document.body.appendChild(paypal_script);
        },
        hidePaymentWindow(){
            this.paymentWindowSeen = false;
            this.paypalButtonsRendered = false;
            this.isPaymentSuccess = false;
            this.paymentLoading = false;
            this.isPaymentCompleted = false;
        }
    }
}
</script>