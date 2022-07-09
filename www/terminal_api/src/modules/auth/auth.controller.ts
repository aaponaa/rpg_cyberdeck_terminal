import {NextFunction, Request, Response} from "express"
import AuthService from "@/modules/auth/auth.service"
import jwt from "jsonwebtoken"
import debug, {IDebugger} from "debug"
import Password from "../common/services/password"

const jwtSecret: string = process.env.JWT_SECRET || "123456"
const tokenExpirationInSeconds = 36000
const log: IDebugger = debug("auth:controller")

class AuthController {
    constructor() {
    }

    login(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const username = req.body.username
        const password = req.body.password
        return AuthService.findUser(username).then(user => {
            log("user", user)
            if (user) {
                return Password.comparePasswords(user.password, password).then(matches => {
                    if (!matches) {
                        throw new Error("Invalid Password")
                    } else {
                        log("jwt Secret", jwtSecret)
                        const token = jwt.sign(req.body, jwtSecret, {
                            expiresIn: tokenExpirationInSeconds,
                        })
                        return res.status(200).json({
                            username: user.username,
                            token,
                        })
                    }
                });
            } else {
                return res.status(401);
            }
        });
    }

    register(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const username = req.body.username
        const password = req.body.password
        return AuthService.findUser(username).then(user => {
            if (user) {
                throw new Error("User Already Exists")
            } else {
                return AuthService.createUser(username, password).then(newUser => {
                    const token = jwt.sign({username, password}, jwtSecret, {
                        expiresIn: tokenExpirationInSeconds,
                    })
                    return res.status(200).json({
                        username: newUser.username,
                        token,
                    })
                })
            }
        });
    }
}

export default new AuthController()