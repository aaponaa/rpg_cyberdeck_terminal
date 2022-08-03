import { Application } from 'express'
import { RouteConfig } from '@/modules/common/route-config'
import SheetController from '@/modules/sheet/sheet.controller'
import JWT from '@/modules/auth/jwt'

export class SheetRoutes extends RouteConfig {
    constructor(app: Application) {
        super(app, 'SheetRoutes')
    }

    configureRoutes(): Application {
        this.app.route('/sheets').get(JWT.authenticateJWT, SheetController.sheets)
        this.app.route('/sheets/:id').get(JWT.authenticateJWT, SheetController.sheet)
        // this.app.route('/sheets/:id/image').get(JWT.authenticateJWT, SheetController.image)
        this.app.route('/sheets/:id/image').get(SheetController.image)
        return this.app
    }
}
