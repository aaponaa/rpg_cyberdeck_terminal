import {NextFunction, Request, Response} from "express"
import AuthService from "@/modules/users/user.service"
import Password from "../common/services/password"
import JWT from "@/modules/auth/jwt";
import {getLocale} from "@/modules/common/utils";
import TranslationService from "@/modules/common/translation.service";

class AuthController {
    constructor() {
    }

    login(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const username = req.body.username
        const password = req.body.password
        return AuthService.findUser(username).then(user => {
            if (user) {
                return Password.comparePasswords(user.password, password).then(matches => {
                    if (!matches) {
                        return res.sendStatus(401);
                    } else {
                        return res.status(200).json({
                            username: user.username,
                            ...JWT.generateTokens(req.body)
                        })
                    }
                });
            } else {
                return res.status(401).json({
                    error: TranslationService.translate(getLocale(req), "login.failed")
                });
            }
        });
    }

    register(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const username = req.body.username
        const password = req.body.password
        return AuthService.findUser(username).then(user => {
            if (user) {
                return res.status(400).json({
                    error: TranslationService.translate(getLocale(req), "username.alreadyTaken")
                })
            } else {
                return AuthService.createUser(username, password).then(newUser => {
                    return res.status(200).json({
                        username: newUser.username,
                        ...JWT.generateTokens(newUser)
                    })
                })
            }
        });
    }

    refresh(req: Request, res: Response, next: NextFunction): Promise<Response> {
        return JWT.verifyRefreshToken(req.body.refreshToken).then(token => {
            return res.status(200).json(token);
        }, error => {
            return res.sendStatus(403);
        });
    }
}

export default new AuthController()