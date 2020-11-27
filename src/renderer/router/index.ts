import Vue from 'vue'
import VueRouter, {RouteConfig} from 'vue-router'
import HomeComponent from '../views/Home.vue'
import SettingsComponent from '../views/Settings.vue'
import TokenCircleCiComponent from '../views/TokenCircleCi.vue'
import TokenGithubComponent from '../views/TokenGithub.vue'

Vue.use(VueRouter);

export const RouteNames = {
    HOME: 'Home',
    SETTINGS: 'Settings',
    CIRCLECI_TOKEN: 'CircleCI',
    GITHUB_CHOICE: 'Github'
};

const routes: RouteConfig[] = [
    {
        path: '/home',
        name: RouteNames.HOME,
        component: HomeComponent,
        meta: {
            title: "Build Notifier",
            requiresAuth: true
        }
    },
    {
        path: '/settings',
        name: RouteNames.SETTINGS,
        meta: {
            backButton: true,
            requiresAuth: true
        },
        component: SettingsComponent
    },
    {
        path: '/circleci',
        name: RouteNames.CIRCLECI_TOKEN,
        meta: {
            backButton: true
        },
        component: TokenCircleCiComponent
    },
    {
        path: '/github',
        name: RouteNames.GITHUB_CHOICE,
        meta: {
            backButton: true
        },
        component: TokenGithubComponent
    },
    {
        path: '*',
        redirect: { name: RouteNames.HOME },
    },
];

const router = new VueRouter({
    mode: "hash",
    routes
});

export default router;
