import {Application} from "express"
import {RouteConfig} from "@/modules/common/route-config"
import authController from "./auth.controller"

export class AuthRoutes extends RouteConfig {
    constructor(app: Application) {
        super(app, "AuthRoutes")
    }

    configureRoutes() {
        this.app.route("/login").post(authController.login)
        this.app.route("/register").post(authController.register)
        return this.app
    }
}