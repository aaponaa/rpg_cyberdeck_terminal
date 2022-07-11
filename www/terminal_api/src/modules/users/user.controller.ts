import {NextFunction, Request, Response} from "express"
import UserService from "@/modules/users/user.service"

class UserController {
    constructor() {
    }

    users(req: Request, res: Response, next: NextFunction): Promise<Response> {
        return UserService.findUsers().then(users => {
            users.forEach(user => {
                delete user.password;
            })
            return res.status(200).json(users);
        })
    }

    user(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const username = req.params.name;
        return UserService.findUser(username).then(user => {
            if (user) {
                delete user.password;
                return res.status(200).json(user);
            } else {
                return res.sendStatus(404);
            }
        });
    }
}

export default new UserController();