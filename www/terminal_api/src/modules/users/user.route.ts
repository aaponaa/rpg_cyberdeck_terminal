import {Application} from "express"
import {RouteConfig} from "@/modules/common/route-config"
import AuthController from "./user.controller"
import UserController from "./user.controller";
import JWT from "@/modules/auth/jwt";

export class UserRoutes extends RouteConfig {
    constructor(app: Application) {
        super(app, "UserRoutes")
    }

    configureRoutes() {
        this.app.route("/users").get(JWT.authenticateJWT, UserController.users)
        this.app.route("/users/:name").get(JWT.authenticateJWT, UserController.user)
        return this.app
    }
}