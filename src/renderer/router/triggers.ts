import router from '.'
import { AppModule } from '../store'


router.beforeEach((to, from, next) => {
    if (to.meta?.backButton) {
        AppModule.showBackButton(true)
    } else {
        AppModule.showBackButton(false)
    }

    next()

    // if (to.meta?.requiresAuth && !AccountModule.accessToken) {
    //     next({name: RouteNames.LOGIN})
    // } else if (to.name === RouteNames.LOGIN && !!AccountModule.accessToken) {
    //     next({name: RouteNames.HOME})
    // } else {
    //     next();
    // }
})
