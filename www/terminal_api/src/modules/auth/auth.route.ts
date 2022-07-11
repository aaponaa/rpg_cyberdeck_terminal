import { Application } from 'express'
import { RouteConfig } from '@/modules/common/route-config'
import AuthController from './auth.controller'

export class AuthRoutes extends RouteConfig {
    constructor(app: Application) {
        super(app, 'AuthRoutes')
    }

    configureRoutes() {
        this.app.route('/auth/login').post(AuthController.login)
        this.app.route('/auth/register').post(AuthController.register)
        this.app.route('/auth/refresh').post(AuthController.refresh)
        return this.app
    }
}
