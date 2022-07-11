import { Application } from 'express'
import { RouteConfig } from '@/modules/common/route-config'
import AuthController from '@/modules/auth/auth.controller'
import SheetController from '@/modules/sheet/sheet.controller'
import JWT from '@/modules/auth/jwt'

export class SheetRoutes extends RouteConfig {
    constructor(app: Application) {
        super(app, 'SheetRoutes')
    }

    configureRoutes(): Application {
        this.app.route('/sheets/:name').get(JWT.authenticateJWT, SheetController.sheets)
        return this.app
    }
}
