<template>
    <v-container class="d-flex flex-column">
        <v-card min-width="800" class="align-self-center">
            <v-card-title>Profile Information</v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <v-list>
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title>login</v-list-item-title>
                            <v-list-item-subtitle>Login</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title>login</v-list-item-title>
                            <v-list-item-subtitle>Email</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title>login</v-list-item-title>
                            <v-list-item-subtitle>First Name</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title>login</v-list-item-title>
                            <v-list-item-subtitle>Last Name</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title>login</v-list-item-title>
                            <v-list-item-subtitle>Middle Name</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-card-text>
        </v-card>
        <v-sheet min-width="800" elevation="2" class="mt-5 align-self-center">
            <v-tabs color="black" background-color="grey lighten-3">
                <v-tab>Projects</v-tab>
                <v-tab-item>
                    <v-simple-table>
                        <template v-slot:default>
                            <thead>
                                <tr>
                                    <th class="text-left">Title</th>
                                    <th class="text-left">Progress</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Title</td>
                                    <td>
                                        <v-progress-linear value="30"/>
                                        30/100 $
                                    </td>
                                </tr>
                                <tr>
                                    <td>Title</td>
                                    <td>
                                        <v-progress-linear value="30"/>
                                        30/100 $
                                    </td>
                                </tr>
                            </tbody>
                        </template>
                    </v-simple-table>
                </v-tab-item>
                <v-tab>Payments</v-tab>
                <v-tab-item>
                    <v-simple-table>
                        <template v-slot:default>
                            <thead>
                                <tr>
                                    <th class="text-left">Date</th>
                                    <th class="text-left">Project</th>
                                    <th class="text-left">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>10/09/2020</td>
                                    <td>Lmao project</td>
                                    <td>100 $</td>
                                </tr>
                                <tr>
                                    <td>10/09/2020</td>
                                    <td><router-link to="/project/1">Project name</router-link></td>
                                    <td>1230 $</td>
                                </tr>
                            </tbody>
                        </template>
                    </v-simple-table>
                </v-tab-item>
            </v-tabs>
        </v-sheet>
    </v-container>
</template>

<script>
export default {
    
}
</script>