import { Application } from 'express'
import { RouteConfig } from '@/modules/common/route-config'
import JWT from '@/modules/auth/jwt'
import CampaignController from '@/modules/campaign/campaign.controller'

export class CampaignRoutes extends RouteConfig {
    constructor(app: Application) {
        super(app, 'CampaignRoutes')
    }

    configureRoutes(): Application {
        this.app.route('/campaigns').get(JWT.authenticateJWT, CampaignController.campaigns)
        this.app.route('/campaigns').post(JWT.authenticateJWT, CampaignController.createCampaign)
        this.app.route('/campaigns/:id').get(JWT.authenticateJWT, CampaignController.campaign)
        this.app.route('/campaigns/:id').post(JWT.authenticateJWT, CampaignController.updateCampaign)
        return this.app
    }
}
